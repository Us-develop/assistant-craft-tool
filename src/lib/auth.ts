import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
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
  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      if (getAdminEmails().has(email)) return true;

      const rows = await db
        .select({ id: schema.tenantUsers.id })
        .from(schema.tenantUsers)
        .where(eq(schema.tenantUsers.email, email))
        .limit(1);

      return rows.length > 0;
    },

    async jwt({ token, account }) {
      if (account) {
        const email = token.email?.toLowerCase() ?? "";
        const admins = getAdminEmails();
        token.isAdmin = admins.has(email);

        if (token.isAdmin) {
          token.allowedTenants = [];
        } else {
          const rows = await db
            .select({ tenantSlug: schema.tenantUsers.tenantSlug })
            .from(schema.tenantUsers)
            .where(eq(schema.tenantUsers.email, email));
          token.allowedTenants = rows.map((r) => r.tenantSlug);
        }
      }
      return token;
    },

    session: authConfig.callbacks.session,
  },
});
