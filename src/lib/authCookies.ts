import type { NextAuthConfig } from "next-auth";

const useSecureCookies = process.env.NODE_ENV === "production";

/**
 * Auth.js default cookie shape (must stay aligned with @auth/core `defaultCookies`)
 * plus optional `AUTH_COOKIE_DOMAIN` on session only for sibling subdomains.
 */
export function buildAuthCookies(): NextAuthConfig["cookies"] {
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";
  const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim();
  const baseOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: useSecureCookies,
  };

  return {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        ...baseOpts,
        ...(cookieDomain ? { domain: cookieDomain } : {}),
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: baseOpts,
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}authjs.csrf-token`,
      options: baseOpts,
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}authjs.pkce.code_verifier`,
      options: { ...baseOpts, maxAge: 60 * 15 },
    },
    state: {
      name: `${cookiePrefix}authjs.state`,
      options: { ...baseOpts, maxAge: 60 * 15 },
    },
    nonce: {
      name: `${cookiePrefix}authjs.nonce`,
      options: baseOpts,
    },
    webauthnChallenge: {
      name: `${cookiePrefix}authjs.challenge`,
      options: { ...baseOpts, maxAge: 60 * 15 },
    },
  };
}
