import { NextResponse, type NextRequest } from "next/server";
import { TENANT_SLUGS } from "@/lib/tenants";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/demo",
    "/demo/:path*",
    "/maxi-zoo",
    "/maxi-zoo/:path*",
  ],
};

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return adminAuth(request);
  }

  const segment = pathname.split("/")[1];
  if (segment && !TENANT_SLUGS.includes(segment as (typeof TENANT_SLUGS)[number])) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  return NextResponse.next();
}

function adminAuth(request: NextRequest): NextResponse {
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
    const binaryString = atob(value.trim());
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoded = new TextDecoder("utf-8").decode(bytes);
    const colon = decoded.indexOf(":");
    if (colon === -1) return [null, null];
    return [decoded.slice(0, colon), decoded.slice(colon + 1)];
  } catch {
    return [null, null];
  }
}

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
