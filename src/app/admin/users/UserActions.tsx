"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Row = {
  id: number;
  email: string;
  tenantSlug: string;
  createdAt: string;
  createdBy: string | null;
};

type Tenant = { slug: string; name: string };

export default function UserActions({
  initialRows,
  tenants,
}: {
  initialRows: Row[];
  tenants: Tenant[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [email, setEmail] = useState("");
  const [tenantSlug, setTenantSlug] = useState(tenants[0]?.slug ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, tenantSlug }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to add user");
      return;
    }

    setEmail("");
    startTransition(() => {
      router.refresh();
    });

    const listRes = await fetch("/api/admin/users");
    const listData = await listRes.json();
    setRows(
      listData.rows.map((r: Row & { createdAt: string }) => ({
        ...r,
        createdAt:
          typeof r.createdAt === "string"
            ? r.createdAt
            : new Date(r.createdAt).toISOString(),
      })),
    );
  }

  async function handleDelete(id: number) {
    setError(null);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to remove user");
      return;
    }

    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <form
        onSubmit={handleAdd}
        className="card-elevated mb-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:gap-4"
      >
        <div className="flex-1">
          <label
            htmlFor="user-email"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)"
          >
            Email
          </label>
          <input
            id="user-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="input-field"
          />
        </div>
        <div className="sm:w-48">
          <label
            htmlFor="user-tenant"
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)"
          >
            Tenant
          </label>
          <select
            id="user-tenant"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            className="input-field"
          >
            {tenants.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary shrink-0 text-sm"
        >
          Add user
        </button>
      </form>

      {error && (
        <div className="dont-box mb-4 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card-elevated overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-(--color-muted) text-left text-xs uppercase text-(--color-muted-foreground)">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Added</th>
              <th className="px-4 py-3">Added by</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-(--color-muted-foreground)"
                >
                  No tenant users yet. Add one above.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-(--color-border)">
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.tenantSlug}</td>
                  <td className="px-4 py-3 text-(--color-muted-foreground)">
                    {r.createdAt.replace("T", " ").slice(0, 19)}
                  </td>
                  <td className="px-4 py-3 text-(--color-muted-foreground)">
                    {r.createdBy ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-(--color-destructive) transition-colors hover:bg-(--color-error-light)"
                      title="Remove access"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
