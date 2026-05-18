import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq, and, or, gt, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import {
  isValidTrainingUsername,
  normalizeTrainingUsername,
  trainingTenantUserEmail,
} from "./tempTrainingAuth";
import { authConfig } from "./auth.config";

function getAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.filter((p) => {
      const resolved = typeof p === "function" ? (p as unknown as () => { id: string })() : p;
      return resolved.id !== "credentials";
    }),
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawUsername = credentials.username as string;
        const password = credentials.password as string;
        const username = normalizeTrainingUsername(rawUsername ?? "");
        if (!username || !password || !isValidTrainingUsername(username)) {
          return null;
        }

        try {
          const rows = await db
            .select()
            .from(schema.tempUsers)
            .where(
              and(
                eq(schema.tempUsers.username, username),
                eq(schema.tempUsers.isActive, true),
                or(
                  isNull(schema.tempUsers.expiresAt),
                  gt(schema.tempUsers.expiresAt, new Date()),
                ),
              ),
            )
            .limit(1);

          if (rows.length === 0) return null;

          const user = rows[0];
          const valid = await compare(password, user.passwordHash);
          if (!valid) return null;

          const tenantEmail = trainingTenantUserEmail(username);

          return {
            id: String(user.id),
            email: tenantEmail,
            name: user.displayName ?? user.username,
          };
        } catch (err) {
          console.error("[auth] credentials authorize failed:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      if (getAdminEmails().has(email)) return true;

      try {
        const rows = await db
          .select({ id: schema.tenantUsers.id })
          .from(schema.tenantUsers)
          .where(eq(schema.tenantUsers.email, email))
          .limit(1);

        return rows.length > 0;
      } catch (err) {
        console.error("[auth] signIn DB query failed:", err);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account) {
        const email = token.email?.toLowerCase() ?? "";
        const admins = getAdminEmails();
        token.isAdmin = admins.has(email);

        if (token.isAdmin) {
          token.allowedTenants = [];
        } else {
          try {
            const rows = await db
              .select({ tenantSlug: schema.tenantUsers.tenantSlug })
              .from(schema.tenantUsers)
              .where(eq(schema.tenantUsers.email, email));
            token.allowedTenants = rows.map((r) => r.tenantSlug);
          } catch (err) {
            console.error("[auth] jwt DB query failed:", err);
            token.allowedTenants = [];
          }
        }
      }
      return token;
    },

    session: authConfig.callbacks.session,
  },
});
