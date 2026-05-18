import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TENANT_SLUGS, getTenant } from "@/lib/tenants";
import { trainingTenantUserEmail } from "@/lib/tempTrainingAuth";
import TempUserActions from "./TempUserActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminTempUsersPage() {
  const tempRows = await db
    .select()
    .from(schema.tempUsers)
    .orderBy(desc(schema.tempUsers.createdAt));

  const tenantRows = await db
    .select({
      email: schema.tenantUsers.email,
      tenantSlug: schema.tenantUsers.tenantSlug,
    })
    .from(schema.tenantUsers);

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
