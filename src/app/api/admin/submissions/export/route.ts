import { type NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TENANT_SLUGS } from "@/lib/tenants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CSV_HEADERS = [
  "id",
  "tenant_slug",
  "created_at",
  "language",
  "assistant_name",
  "domain",
  "job_title",
  "char_count",
  "generated_prompt",
  "kickoff_message",
] as const;

export async function GET(request: NextRequest): Promise<Response> {
  const tenantParam = request.nextUrl.searchParams.get("tenant");
  const tenantFilter =
    tenantParam && TENANT_SLUGS.includes(tenantParam as (typeof TENANT_SLUGS)[number])
      ? tenantParam
      : undefined;

  const baseQuery = db.select().from(schema.submissions).orderBy(desc(schema.submissions.createdAt));
  const rows = tenantFilter
    ? await baseQuery.where(eq(schema.submissions.tenantSlug, tenantFilter))
    : await baseQuery;

  const chunks: string[] = [CSV_HEADERS.join(",")];
  for (const row of rows) {
    chunks.push(
      [
        row.id,
        row.tenantSlug,
        row.createdAt.toISOString(),
        row.language,
        row.assistantName ?? "",
        row.domain ?? "",
        row.jobTitle ?? "",
        row.charCount,
        row.generatedPrompt,
        row.kickoffMessage ?? "",
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  const filename = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(chunks.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
