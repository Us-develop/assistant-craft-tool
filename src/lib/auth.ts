import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Protect admin routes with HTTP Basic Auth. Credentials come from
 * ADMIN_USER / ADMIN_PASSWORD environment variables. Uses constant-time
 * comparison to avoid trivial timing side-channels.
 *
 * Returns a Response (401) when the request is unauthenticated, or null
 * when the caller may proceed.
 */
export function requireAdminAuth(request: Request): Response | null {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new Response(
      "Server misconfigured: ADMIN_USER / ADMIN_PASSWORD not set.",
      { status: 500 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) {
    return unauthorized();
  }

  const [user, pass] = decodeBasic(header.slice(6));
  if (!user || !pass) return unauthorized();

  if (!constantTimeEquals(user, expectedUser) || !constantTimeEquals(pass, expectedPass)) {
    return unauthorized();
  }

  return null;
}

function decodeBasic(value: string): [string, string] | [null, null] {
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    const colon = decoded.indexOf(":");
    if (colon === -1) return [null, null];
    return [decoded.slice(0, colon), decoded.slice(colon + 1)];
  } catch {
    return [null, null];
  }
}

function constantTimeEquals(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

function unauthorized(): Response {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Assistant Craft Tool admin", charset="UTF-8"',
    },
  });
}

/**
 * SHA-256 hash (first 32 hex chars) of an IP address for light-touch pseudonymization
 * in the `ip_hash` column. Do not treat this as anonymization — correlate only
 * for abuse/duplicate detection, then discard.
 */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
