import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { collectErrorChain, dbTroubleshootingHints } from "@/lib/dbTroubleshooting";
import { TENANT_SLUGS, getTenant } from "@/lib/tenants";
import { trainingTenantUserEmail } from "@/lib/tempTrainingAuth";
import TempUserActions from "./TempUserActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminTempUsersPage() {
  let tempRows: (typeof schema.tempUsers.$inferSelect)[];
  let tenantRows: { email: string; tenantSlug: string }[];

  try {
    tempRows = await db
      .select()
      .from(schema.tempUsers)
      .orderBy(desc(schema.tempUsers.createdAt));

    tenantRows = await db
      .select({
        email: schema.tenantUsers.email,
        tenantSlug: schema.tenantUsers.tenantSlug,
      })
      .from(schema.tenantUsers);
  } catch (err) {
    const detail = collectErrorChain(err);
    const hints = dbTroubleshootingHints(detail);
    return (
      <main className="wizard-shell space-y-6 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold">Temporary Users</h1>
        <div className="dont-box space-y-3">
          <p className="font-medium text-(--color-foreground)">
            Could not load training accounts from MySQL
          </p>
          <p className="text-sm text-(--color-muted-foreground)">
            This page needs migrations through at least{" "}
            <code className="text-xs">0005_temp_users_username</code> (and{" "}
            <code className="text-xs">0004</code> for the <code className="text-xs">temp_users</code>{" "}
            table).
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

  const tenantsByEmail = new Map<string, string[]>();
  for (const r of tenantRows) {
    const list = tenantsByEmail.get(r.email) ?? [];
    list.push(r.tenantSlug);
    tenantsByEmail.set(r.email, list);
  }

  const rows = tempRows.map((r) => ({
    id: r.id,
    username: r.username,
    displayName: r.displayName,
    expiresAt: r.expiresAt?.toISOString() ?? null,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
    createdBy: r.createdBy,
    tenantSlugs: tenantsByEmail.get(trainingTenantUserEmail(r.username)) ?? [],
  }));

  return (
    <main className="wizard-shell py-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Temporary Users</h1>
          <p className="text-sm text-(--color-muted-foreground)">
            One shared username and password for all trainees. Reset when the
            session ends.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn-ghost text-sm">
            ← Submissions
          </Link>
          <Link href="/admin/users" className="btn-ghost text-sm">
            User Access
          </Link>
        </div>
      </header>

      <TempUserActions
        initialRows={rows}
        tenants={TENANT_SLUGS.map((slug) => ({
          slug,
          name: getTenant(slug)?.name ?? slug,
        }))}
      />
    </main>
  );
}
