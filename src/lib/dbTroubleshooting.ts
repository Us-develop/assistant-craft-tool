/**
 * Shared helpers for surfacing MySQL / migration issues in admin UI.
 */

export function collectErrorChain(err: unknown): string {
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

export function dbTroubleshootingHints(message: string): string[] {
  const m = message.toLowerCase();
  const hints: string[] = [];

  if (m.includes("unknown column") && m.includes("username")) {
    hints.push(
      "The `temp_users` table may still use the old `email` column. On the server, from the project root with DB env configured: npm run db:migrate",
    );
  }

  const noSuchTable =
    m.includes("er_no_such_table") ||
    m.includes("doesn't exist") ||
    m.includes("does not exist");

  if (noSuchTable && m.includes("temp_users")) {
    hints.push(
      "The `temp_users` table is missing. Run migrations on production: npm run db:migrate",
    );
  } else if (noSuchTable) {
    hints.push(
      "A required table may be missing. From the project root, with MySQL reachable: npm run db:migrate",
    );
  }

  if (m.includes("econnrefused") || m.includes("connect econnrefused")) {
    hints.push(
      "Cannot reach MySQL — confirm DB_HOST and DB_PORT for this environment.",
    );
  }
  if (m.includes("er_access_denied") || m.includes("access denied")) {
    hints.push("MySQL rejected the login — check DB_USER and DB_PASSWORD.");
  }
  if (m.includes("er_bad_db_error") || m.includes("unknown database")) {
    hints.push(
      "Database not found — create it or fix DB_NAME in your hosting env.",
    );
  }
  if (hints.length === 0) {
    hints.push(
      "Confirm DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME, then run npm run db:migrate on this server if migrations were skipped.",
    );
  }
  return hints;
}
