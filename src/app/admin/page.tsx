import Link from "next/link";
import { desc, eq, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TENANT_SLUGS, getTenant } from "@/lib/tenants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function collectErrorChain(err: unknown): string {
  const parts: string[] = [];
  let e: unknown = err;
  let depth = 0;
  while (e instanceof Error && depth < 6) {
    parts.push(e.message);
    e = e.cause;
    depth++;
  }
  if (parts.length === 0) return String(err);
  return parts.join(" → ");
}

function dbTroubleshootingHints(message: string): string[] {
  const m = message.toLowerCase();
  const hints: string[] = [];
  if (
    m.includes("er_no_such_table") ||
    m.includes("doesn't exist") ||
    m.includes("does not exist")
  ) {
    hints.push(
      "The `submissions` table (or another required table) is missing. From the project root, with MySQL running: npm run db:migrate",
    );
  }
  if (m.includes("econnrefused") || m.includes("connect econnrefused")) {
    hints.push(
      "Cannot reach MySQL — start your database (see README Docker example) and confirm DB_HOST and DB_PORT in .env.local.",
    );
  }
  if (m.includes("er_access_denied") || m.includes("access denied")) {
    hints.push("MySQL rejected the login — check DB_USER and DB_PASSWORD in .env.local.");
  }
  if (m.includes("er_bad_db_error") || m.includes("unknown database")) {
    hints.push(
      "Database name not found — create it (e.g. CREATE DATABASE assistant_craft) or fix DB_NAME in .env.local.",
    );
  }
  if (hints.length === 0) {
    hints.push(
      "Confirm DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env.local match your MySQL instance, then run npm run db:migrate if tables were never created.",
    );
  }
  return hints;
}

/**
 * Admin dashboard listing the most recent submissions. Auth is handled
 * centrally by `src/middleware.ts` (Google OAuth + admin role check).
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tenant?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const tenantFilter =
    params.tenant && TENANT_SLUGS.includes(params.tenant as (typeof TENANT_SLUGS)[number])
      ? params.tenant
      : undefined;
  const tenantWhere = tenantFilter
    ? eq(schema.submissions.tenantSlug, tenantFilter)
    : undefined;

  let total = 0;
  let rows: Awaited<ReturnType<typeof fetchSubmissions>>;
  try {
    const countQuery = db.select({ total: sql<number>`count(*)` }).from(schema.submissions);
    const [totalRow] = tenantWhere ? await countQuery.where(tenantWhere) : await countQuery;
    total = Number(totalRow?.total ?? 0);

    rows = await fetchSubmissions(offset, tenantWhere);
  } catch (err) {
    const detail = collectErrorChain(err);
    const hints = dbTroubleshootingHints(detail);
    return (
      <main className="wizard-shell space-y-6 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold">Submissions</h1>
        <div className="dont-box space-y-3">
          <p className="font-medium text-(--color-foreground)">Could not load data from MySQL</p>
          <p className="text-sm text-(--color-muted-foreground)">
            The admin dashboard needs a working database connection and the Drizzle migrations applied.
          </p>
          <pre className="max-h-48 overflow-auto rounded-(--radius-m) bg-(--color-card) p-3 font-mono text-xs whitespace-pre-wrap text-(--color-foreground)">
            {detail}
          </pre>
          <ul className="list-inside list-disc space-y-1 text-sm text-(--color-foreground)">
            {hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="wizard-shell py-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Submissions</h1>
          <p className="text-sm text-(--color-muted-foreground)">
            Logged entries from the Assistant Craft Tool wizard.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Link href="/admin/users" className="btn-ghost text-sm">
            Manage users
          </Link>
          <Link href="/admin/temp-users" className="btn-ghost text-sm">
            Temp users
          </Link>
          <form method="get" className="flex items-center gap-2">
            <label htmlFor="tenant-filter" className="sr-only">
              Filter by client
            </label>
            <select
              id="tenant-filter"
              name="tenant"
              defaultValue={tenantFilter ?? ""}
              className="rounded-(--radius-m) border border-(--color-border) bg-(--color-card) px-3 py-2 text-sm"
            >
              <option value="">All clients</option>
              {TENANT_SLUGS.map((slug) => (
                <option key={slug} value={slug}>
                  {getTenant(slug)?.name ?? slug}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary text-sm">
              Filter
            </button>
          </form>
          <span className="text-sm text-(--color-muted-foreground)">
            {total.toLocaleString()} total
          </span>
          <a
            href={
              tenantFilter
                ? `/api/admin/submissions/export?tenant=${tenantFilter}`
                : "/api/admin/submissions/export"
            }
            className="btn-primary w-full text-center text-sm sm:w-auto"
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
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Lang</th>
              <th className="px-4 py-3">Assistant</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Job title</th>
              <th className="px-4 py-3">Prompt</th>
              <th className="px-4 py-3 text-right">Chars</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-(--color-muted-foreground)"
                >
                  No submissions yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-(--color-border)">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.tenantSlug}</td>
                  <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 uppercase">{r.language}</td>
                  <td className="px-4 py-3">{r.assistantName ?? "—"}</td>
                  <td className="px-4 py-3">{r.domain ?? "—"}</td>
                  <td className="px-4 py-3 text-(--color-muted-foreground)">
                    {r.jobTitle ? truncate(r.jobTitle, 60) : "—"}
                  </td>
                  <td className="max-w-[14rem] px-4 py-3 align-top min-[900px]:max-w-xs">
                    <details className="rounded-(--radius-m) border border-transparent open:border-(--color-border) open:bg-(--color-neutral-20) [&_summary::-webkit-details-marker]:hidden">
                      <summary className="cursor-pointer list-none text-(--color-primary) underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current">
                        <span className="inline-flex items-center gap-1 text-xs font-medium">
                          <span className="material-icons-outlined text-sm" aria-hidden>
                            expand_more
                          </span>
                          View prompt
                        </span>
                      </summary>
                      <div className="max-h-[min(24rem,55vh)] space-y-3 overflow-y-auto border-t border-(--color-border) p-3">
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-(--color-muted-foreground)">
                            System instruction
                          </p>
                          <pre className="break-words font-mono text-xs leading-relaxed whitespace-pre-wrap text-(--color-foreground)">
                            {r.generatedPrompt}
                          </pre>
                        </div>
                        {r.kickoffMessage?.trim() ? (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-(--color-muted-foreground)">
                              Kick-off message
                            </p>
                            <pre className="break-words font-mono text-xs leading-relaxed whitespace-pre-wrap text-(--color-foreground)">
                              {r.kickoffMessage}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    </details>
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
          <PageLink
            page={page - 1}
            disabled={page <= 1}
            label="← Previous"
            tenant={tenantFilter}
          />
          <span className="text-(--color-muted-foreground)">
            Page {page} of {totalPages}
          </span>
          <PageLink
            page={page + 1}
            disabled={page >= totalPages}
            label="Next →"
            tenant={tenantFilter}
          />
        </nav>
      )}
    </main>
  );
}

async function fetchSubmissions(offset: number, tenantWhere?: SQL) {
  const base = db
    .select({
      id: schema.submissions.id,
      tenantSlug: schema.submissions.tenantSlug,
      createdAt: schema.submissions.createdAt,
      language: schema.submissions.language,
      assistantName: schema.submissions.assistantName,
      domain: schema.submissions.domain,
      jobTitle: schema.submissions.jobTitle,
      charCount: schema.submissions.charCount,
      generatedPrompt: schema.submissions.generatedPrompt,
      kickoffMessage: schema.submissions.kickoffMessage,
    })
    .from(schema.submissions);

  const filtered = tenantWhere ? base.where(tenantWhere) : base;

  return filtered
    .orderBy(desc(schema.submissions.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);
}

function PageLink({
  page,
  disabled,
  label,
  tenant,
}: {
  page: number;
  disabled: boolean;
  label: string;
  tenant?: string;
}) {
  if (disabled) {
    return <span className="text-(--color-muted-foreground)">{label}</span>;
  }
  const qs = new URLSearchParams({ page: String(page) });
  if (tenant) qs.set("tenant", tenant);
  return (
    <a href={`/admin?${qs}`} className="text-(--color-primary) hover:underline">
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
