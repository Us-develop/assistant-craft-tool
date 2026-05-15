import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { TENANT_SLUGS } from "@/lib/tenants";

const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/login", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!request.auth) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const { isAdmin, allowedTenants } = request.auth.user ?? {};

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1];

  if (
    segment &&
    TENANT_SLUGS.includes(segment as (typeof TENANT_SLUGS)[number])
  ) {
    if (!isAdmin && !allowedTenants?.includes(segment)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
