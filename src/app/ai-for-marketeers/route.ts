import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Serves the merged “AI for Marketeers” knowledge base as a full HTML document.
 * Auth is enforced by `src/middleware.ts` (same session as the rest of the app).
 */
export async function GET(): Promise<Response> {
  const filePath = path.join(
    process.cwd(),
    "public/ai-for-marketeers/index.html",
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
