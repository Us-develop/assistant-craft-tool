import { NextResponse } from "next/server";

const AUTH_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "authjs.csrf-token",
  "__Secure-authjs.csrf-token",
];

export function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of AUTH_COOKIES) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return response;
}
