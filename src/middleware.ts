import { NextResponse, type NextRequest } from "next/server";

/**
 * Gate all admin surfaces behind HTTP Basic Auth:
 *  - /admin               (the submissions dashboard page)
 *  - /api/admin/*         (the admin JSON + CSV endpoints)
 *
 * Credentials live in ADMIN_USER / ADMIN_PASSWORD env vars. Middleware runs
 * on the Edge runtime, so we use the Web Crypto API for constant-time comparison
 * rather than Node's `crypto.timingSafeEqual`.
 */
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function middleware(request: NextRequest): NextResponse {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return new NextResponse(
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

  if (
    !constantTimeEquals(user, expectedUser) ||
    !constantTimeEquals(pass, expectedPass)
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}

function decodeBasic(value: string): [string, string] | [null, null] {
  try {
    const decoded = atob(value);
    const colon = decoded.indexOf(":");
    if (colon === -1) return [null, null];
    return [decoded.slice(0, colon), decoded.slice(colon + 1)];
  } catch {
    return [null, null];
  }
}

/** Constant-time string compare using Web Crypto (Edge-safe). */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Assistant Craft Tool admin", charset="UTF-8"',
    },
  });
}
