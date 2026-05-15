import { NextResponse } from "next/server";

const AUTH_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "authjs.csrf-token",
  "__Secure-authjs.csrf-token",
];

export function POST(request: Request) {
  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url, 302);

  for (const name of AUTH_COOKIES) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return response;
}
