import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TENANT_SLUGS, getTenant } from "@/lib/tenants";
import UserActions from "./UserActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const rows = await db
    .select()
    .from(schema.tenantUsers)
    .orderBy(desc(schema.tenantUsers.createdAt));

  return (
    <main className="wizard-shell py-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Access</h1>
          <p className="text-sm text-(--color-muted-foreground)">
            Manage which email addresses can access each tenant.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn-ghost text-sm">
            ← Submissions
          </Link>
        </div>
      </header>

      <UserActions
        initialRows={rows.map((r) => ({
          id: r.id,
          email: r.email,
          tenantSlug: r.tenantSlug,
          createdAt: r.createdAt.toISOString(),
          createdBy: r.createdBy,
        }))}
        tenants={TENANT_SLUGS.map((slug) => ({
          slug,
          name: getTenant(slug)?.name ?? slug,
        }))}
      />
    </main>
  );
}
