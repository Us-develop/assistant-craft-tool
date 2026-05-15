import { NextResponse, type NextRequest } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 200;

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const limit = clamp(Number(searchParams.get("limit") ?? 50), 1, MAX_LIMIT);
  const offset = clamp(Number(searchParams.get("offset") ?? 0), 0, Number.MAX_SAFE_INTEGER);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(schema.submissions);

  const rows = await db
    .select({
      id: schema.submissions.id,
      createdAt: schema.submissions.createdAt,
      language: schema.submissions.language,
      assistantName: schema.submissions.assistantName,
      domain: schema.submissions.domain,
      jobTitle: schema.submissions.jobTitle,
      charCount: schema.submissions.charCount,
    })
    .from(schema.submissions)
    .orderBy(desc(schema.submissions.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ total, limit, offset, rows });
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}
