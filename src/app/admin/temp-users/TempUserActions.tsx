"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, RotateCcw, KeyRound, Copy, Check } from "lucide-react";

type Row = {
  id: number;
  username: string;
  displayName: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  tenantSlugs: string[];
};

type Tenant = { slug: string; name: string };

function generatePassword(length = 10): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join("");
}

export default function TempUserActions({
  initialRows,
  tenants,
}: {
  initialRows: Row[];
  tenants: Tenant[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState(() => generatePassword());
  const [selectedTenants, setSelectedTenants] = useState<string[]>(
    tenants[0] ? [tenants[0].slug] : [],
  );
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  async function refreshRows() {
    const res = await fetch("/api/admin/temp-users");
    const data = await res.json();
    setRows(data.rows);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/admin/temp-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        displayName: displayName || undefined,
        tenantSlugs: selectedTenants,
        expiresAt: expiresAt || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create temp user");
      return;
    }

    setSuccess(`Username: ${username} — password: ${password}`);
    setUsername("");
    setDisplayName("");
    setPassword(generatePassword());
    setExpiresAt("");

    startTransition(() => router.refresh());
    await refreshRows();
  }

  async function handleDelete(id: number) {
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/admin/temp-users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to delete");
      return;
    }

    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(() => router.refresh());
  }

  async function handleResetPassword(id: number) {
    setError(null);
    setSuccess(null);

    const newPass = generatePassword();
    const res = await fetch(`/api/admin/temp-users/${id}/reset-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPass }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to reset password");
      return;
    }

    const row = rows.find((r) => r.id === id);
    setSuccess(`New password for ${row?.username}: ${newPass}`);
  }

  async function handleResetAll() {
    setError(null);
    setSuccess(null);
    setConfirmResetAll(false);

    const res = await fetch("/api/admin/temp-users/reset", {
      method: "POST",
    });

    if (!res.ok) {
      setError("Failed to reset all temp users");
      return;
    }

    const data = await res.json();
    setSuccess(`Deleted ${data.deleted} temp user(s) and their tenant access.`);
    setRows([]);
    startTransition(() => router.refresh());
  }

  function handleCopyCredentials(row: Row) {
    const text = `Username: ${row.username}`;
    navigator.clipboard.writeText(text);
    setCopiedId(row.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleTenant(slug: string) {
    setSelectedTenants((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  return (
    <>
      {/* Create form */}
      <form
        onSubmit={handleAdd}
        className="card-elevated mb-6 space-y-4 p-5"
      >
        <p className="text-sm text-(--color-muted-foreground)">
          Only one shared training login can exist. Remove it or use &quot;Reset
          all temp users&quot; before creating another. Username: 3–32 characters,
          lowercase letters, digits, underscore, or hyphen.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-1">
            <label
              htmlFor="temp-username"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)"
            >
              Username
            </label>
            <input
              id="temp-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. training-demo"
              className="input-field"
              autoComplete="off"
            />
          </div>
          <div className="sm:w-40">
            <label
              htmlFor="temp-name"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)"
            >
              Display name
            </label>
            <input
              id="temp-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Optional"
              className="input-field"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-1">
            <label
              htmlFor="temp-password"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)"
            >
              Password
            </label>
            <div className="flex gap-2">
              <input
                id="temp-password"
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field flex-1 font-mono"
              />
              <button
                type="button"
                onClick={() => setPassword(generatePassword())}
                className="btn-ghost shrink-0 text-xs"
                title="Generate new password"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <div className="sm:w-48">
            <label
              htmlFor="temp-expires"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)"
            >
              Expires at
            </label>
            <input
              id="temp-expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-(--color-muted-foreground)">
            Tenant access
          </span>
          <div className="flex flex-wrap gap-2">
            {tenants.map((t) => (
              <label
                key={t.slug}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-(--color-border) px-3 py-1.5 text-sm transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
              >
                <input
                  type="checkbox"
                  checked={selectedTenants.includes(t.slug)}
                  onChange={() => toggleTenant(t.slug)}
                  className="accent-blue-600"
                />
                {t.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="submit"
            disabled={isPending || selectedTenants.length === 0}
            className="btn-primary shrink-0 text-sm"
          >
            Create shared training login
          </button>
        </div>
      </form>

      {/* Messages */}
      {error && (
        <div className="dont-box mb-4 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}

      {/* Reset all */}
      {rows.length > 0 && (
        <div className="mb-4 flex items-center justify-end gap-2">
          {confirmResetAll ? (
            <>
              <span className="text-sm text-(--color-destructive)">
                This will delete all temp users and their access. Are you sure?
              </span>
              <button
                type="button"
                onClick={handleResetAll}
                className="btn-primary bg-(--color-destructive) text-sm"
              >
                Yes, delete all
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetAll(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmResetAll(true)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-(--color-destructive) transition-colors hover:bg-(--color-error-light)"
            >
              <Trash2 size={14} />
              Reset all temp users
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card-elevated overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-(--color-muted) text-left text-xs uppercase text-(--color-muted-foreground)">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Tenants</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-(--color-muted-foreground)"
                >
                  No temporary users. Create one above.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-(--color-border)">
                  <td className="px-4 py-3 font-mono text-xs">{r.username}</td>
                  <td className="px-4 py-3">{r.displayName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.tenantSlugs.map((s) => (
                        <span
                          key={s}
                          className="inline-block rounded bg-(--color-muted) px-1.5 py-0.5 font-mono text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-(--color-muted-foreground)">
                    {r.expiresAt
                      ? r.expiresAt.replace("T", " ").slice(0, 16)
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-(--color-muted-foreground)">
                    {r.createdAt.replace("T", " ").slice(0, 16)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(r)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-(--color-muted)"
                        title="Copy username"
                      >
                        {copiedId === r.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(r.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-(--color-muted)"
                        title="Reset password"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-(--color-destructive) transition-colors hover:bg-(--color-error-light)"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
