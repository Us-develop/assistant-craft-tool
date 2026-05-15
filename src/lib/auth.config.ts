import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      isAdmin: boolean;
      allowedTenants: string[];
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    isAdmin?: boolean;
    allowedTenants?: string[];
  }
}

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
  providers: [Google],
  session: { strategy: "jwt", maxAge: 3600 },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      if (getAdminEmails().has(email)) return true;

      const { db, schema } = await import("@/lib/db");
      const { eq } = await import("drizzle-orm");
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
          const { db, schema } = await import("@/lib/db");
          const { eq } = await import("drizzle-orm");
          const rows = await db
            .select({ tenantSlug: schema.tenantUsers.tenantSlug })
            .from(schema.tenantUsers)
            .where(eq(schema.tenantUsers.email, email));
          token.allowedTenants = rows.map((r) => r.tenantSlug);
        }
      }
      return token;
    },

    session({ session, token }) {
      session.user.isAdmin = token.isAdmin ?? false;
      session.user.allowedTenants = token.allowedTenants ?? [];
      return session;
    },
  },
});
