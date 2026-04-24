import { desc, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

/**
 * Admin dashboard listing the most recent submissions. Auth is handled
 * centrally by `src/middleware.ts` (HTTP Basic). This page only runs after
 * the user has authenticated.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [totalRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(schema.submissions);
  const total = Number(totalRow?.total ?? 0);

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
    .limit(PAGE_SIZE)
    .offset(offset);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Submissions</h1>
          <p className="text-sm text-(--color-muted-foreground)">
            Logged entries from the Assistant Craft Tool wizard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-(--color-muted-foreground)">
            {total.toLocaleString()} total
          </span>
          <a
            href="/api/admin/submissions/export"
            className="btn-primary text-sm"
            download
          >
            Export CSV
          </a>
        </div>
      </header>

      <div className="card-elevated overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-(--color-muted) text-left text-xs uppercase text-(--color-muted-foreground)">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Lang</th>
              <th className="px-4 py-3">Assistant</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Job title</th>
              <th className="px-4 py-3 text-right">Chars</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-(--color-muted-foreground)"
                >
                  No submissions yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-(--color-border)">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 uppercase">{r.language}</td>
                  <td className="px-4 py-3">{r.assistantName ?? "—"}</td>
                  <td className="px-4 py-3">{r.domain ?? "—"}</td>
                  <td className="px-4 py-3 text-(--color-muted-foreground)">
                    {r.jobTitle ? truncate(r.jobTitle, 60) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{r.charCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between text-sm">
          <PageLink page={page - 1} disabled={page <= 1} label="← Previous" />
          <span className="text-(--color-muted-foreground)">
            Page {page} of {totalPages}
          </span>
          <PageLink page={page + 1} disabled={page >= totalPages} label="Next →" />
        </nav>
      )}
    </main>
  );
}

function PageLink({
  page,
  disabled,
  label,
}: {
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return <span className="text-(--color-muted-foreground)">{label}</span>;
  }
  return (
    <a href={`/admin?page=${page}`} className="text-(--color-primary) hover:underline">
      {label}
    </a>
  );
}

function formatDate(d: Date): string {
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}
