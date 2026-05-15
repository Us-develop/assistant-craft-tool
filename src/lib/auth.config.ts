import type { NextAuthConfig, DefaultSession } from "next-auth";
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

/**
 * Edge-safe Auth.js config — no DB imports.
 * Used directly by the middleware. The full config in `auth.ts`
 * extends this with DB-dependent callbacks.
 */
export const authConfig = {
  providers: [Google],
  trustHost: true,
  session: { strategy: "jwt", maxAge: 3600 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    session({ session, token }) {
      session.user.isAdmin = token.isAdmin ?? false;
      session.user.allowedTenants = token.allowedTenants ?? [];
      return session;
    },
  },
} satisfies NextAuthConfig;
