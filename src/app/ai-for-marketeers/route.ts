import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Serves the “AI for Marketeers” knowledge base as a full HTML document.
 * HTML lives in `content/` (not `public/`) so it cannot be served as a static
 * file bypassing middleware. This handler also checks `auth()` as a safeguard.
 */
export async function GET(request: Request): Promise<Response> {
  const session = await auth();
  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", "/ai-for-marketeers");
    return NextResponse.redirect(login);
  }

  const filePath = path.join(
    process.cwd(),
    "content/ai-for-marketeers/index.html",
  );
  const html = await readFile(filePath, "utf-8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
