# Deploying to Combell Node.js Hosting

This guide walks through deploying Assistant Craft Tool to a Combell Node.js
hosting plan, with the MySQL database hosted on the parent Linux account.

## 1. Prerequisites

On Combell you'll need:

1. A **Linux hosting** account (any plan) — this is where the MySQL database
   lives and can optionally serve the domain.
2. A **Node.js hosting** account nested under the Linux account.
   Recommended: **Node.js Business** or higher (≥ 1 GB RAM), because Next.js
   builds benefit from more memory. The €1.79/month **Basic** (512 MB) works
   but is tight for `next build`; if you hit OOM there, build locally and
   upload `.next/standalone/`.
3. A **MySQL database** created via *mijn.combell.com → Databases → Create
   new database*. Note the host, port, username, password and database name.

## 2. Local build & upload (recommended path)

Building on a shared Node.js host is slow and hits RAM limits. Build locally
and upload the output.

```bash
# On your machine
npm ci
npm run db:generate   # (only if you changed the Drizzle schema)
npm run build         # produces .next/standalone/, .next/static/, etc.
```

Next.js emits a self-contained server bundle under `.next/standalone/`
because `next.config.ts` sets `output: "standalone"`.

Upload the following to the Node.js account document root:

```
.next/standalone/        → (rename to the account root, keeping server.js visible)
.next/static/            → place at .next/static/ inside the same root
public/                  → at the root
package.json             → at the root (already present in .next/standalone/)
node_modules/            → usually not needed (standalone bundles deps), but
                           some Combell configurations require a top-level
                           node_modules with `next`. Upload if the account
                           fails to start without it.
```

The final layout on the server looks like:

```
/
├── .next/
│   └── static/
├── public/
├── server.js              ← entry point
├── package.json
└── node_modules/          ← optional, if standalone output omits required deps
```

Use SFTP (FileZilla, Cyberduck) or the web-based file manager in mijn.combell.

## 3. Environment variables

In the Combell Node.js account panel, set the following environment variables.
They map 1:1 to the values in `.env.example`:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | provided by Combell (use `$PORT` in the start command) |
| `DB_HOST` | the MySQL host shown in mijn.combell.com (usually `mysql.hostname.be`) |
| `DB_PORT` | `3306` |
| `DB_USER` | the MySQL user |
| `DB_PASSWORD` | the MySQL password |
| `DB_NAME` | the database name |
| `DB_SSL` | `false` (internal host) or `true` (remote) |
| `ADMIN_USER` | your admin username |
| `ADMIN_PASSWORD` | a long random string (`openssl rand -base64 24`) |
| `NEXT_PUBLIC_APP_URL` | your public URL, e.g. `https://craft.example.com` |

## 4. Start command

In the Node.js panel, set the **Start command** to:

```bash
node server.js
```

Combell will set `PORT` automatically and proxy the configured domain to that
port. Next.js standalone respects `PORT` out of the box, so no extra config
is required.

If you chose **not** to use standalone output, the start command is instead:

```bash
npx next start -p $PORT
```

## 5. Domain & MySQL setup

1. **Domain** — In mijn.combell → Domains → point your domain to the Node.js
   account (Combell exposes a dropdown that routes the hostname to the
   correct sub-account).
2. **MySQL** — open phpMyAdmin for your database and run the SQL in
   `src/drizzle/migrations/0000_create_submissions.sql` (copy-paste). This
   creates the `submissions` table and the three indexes used by the admin
   list. You can also run `npm run db:migrate` locally against the remote
   MySQL if port 3306 is reachable from the outside; Combell often blocks
   external MySQL access by default, so phpMyAdmin is the reliable route.

## 6. Verify

1. Browse to `https://yourdomain.com` — the wizard should load.
2. Complete the 8 steps and click **Genereer instructie / Generate instruction**.
   A green toast "Je inzending is opgeslagen." should appear.
3. Browse to `https://yourdomain.com/admin` — a Basic Auth popup appears.
   Enter `ADMIN_USER` / `ADMIN_PASSWORD`. You should see the submission you
   just created. **Export CSV** downloads a CSV dump.

## 7. Updating the app

```bash
git pull
npm ci
npm run build
# Upload the new .next/ folder, overwriting the old one.
# Restart the Node.js app from the Combell panel.
```

Schema changes: add a new migration file under `src/drizzle/migrations/`,
register it in `meta/_journal.json`, and apply it via phpMyAdmin.

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| 502 on every request | App not listening on `$PORT` | Verify the start command uses `node server.js` (standalone) or `next start -p $PORT` |
| 500 on `/api/submissions` | DB creds wrong or table missing | Check logs in Combell panel; verify env vars; re-run the migration SQL |
| 401 on `/admin` is never accepted | `ADMIN_PASSWORD` not set or has a trailing space | Check the env var value exactly in the Combell panel |
| "Missing database env vars" at startup | Env vars not applied | After editing env vars, **restart** the Node.js app |
| Build OOM on cheapest Basic plan | 512 MB not enough for `next build` | Build locally and upload `.next/` as described in step 2 |
