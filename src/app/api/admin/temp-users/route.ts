import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { TENANT_SLUGS } from "@/lib/tenants";
import {
  isValidTrainingUsername,
  normalizeTrainingUsername,
  trainingTenantUserEmail,
} from "@/lib/tempTrainingAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
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

  return NextResponse.json({ rows });
}

export async function POST(request: Request): Promise<Response> {
  const session = await auth();
  const adminEmail = session?.user?.email ?? null;

  const body = await request.json();
  const username = normalizeTrainingUsername(body.username as string);
  const password = body.password as string;
  const displayName = (body.displayName as string)?.trim() || null;
  const tenantSlugs = body.tenantSlugs as string[];
  const expiresAt = body.expiresAt ? new Date(body.expiresAt as string) : null;

  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 400 },
    );
  }

  if (!isValidTrainingUsername(username)) {
    return NextResponse.json(
      {
        error:
          "Username must be 3–32 characters: lowercase letters, digits, underscore, or hyphen",
      },
      { status: 400 },
    );
  }

  if (!Array.isArray(tenantSlugs) || tenantSlugs.length === 0) {
    return NextResponse.json(
      { error: "At least one tenant is required" },
      { status: 400 },
    );
  }

  for (const slug of tenantSlugs) {
    if (!TENANT_SLUGS.includes(slug as (typeof TENANT_SLUGS)[number])) {
      return NextResponse.json(
        { error: `Invalid tenant: ${slug}` },
        { status: 400 },
      );
    }
  }

  const existing = await db.select({ id: schema.tempUsers.id }).from(schema.tempUsers).limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      {
        error:
          "A training login already exists. Remove it or use “Reset all temp users” before creating another.",
      },
      { status: 409 },
    );
  }

  const tenantEmail = trainingTenantUserEmail(username);
  const passwordHash = await hash(password, 10);

  try {
    await db.insert(schema.tempUsers).values({
      username,
      passwordHash,
      displayName,
      expiresAt,
      createdBy: adminEmail,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Duplicate entry") || msg.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "A temp user with this username already exists" },
        { status: 409 },
      );
    }
    throw err;
  }

  for (const slug of tenantSlugs) {
    try {
      await db.insert(schema.tenantUsers).values({
        email: tenantEmail,
        tenantSlug: slug,
        createdBy: adminEmail,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Duplicate entry") || msg.includes("UNIQUE")) {
        continue;
      }
      throw err;
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const body = await request.json();
  const id = Number(body.id);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const rows = await db
    .select({ username: schema.tempUsers.username })
    .from(schema.tempUsers)
    .where(eq(schema.tempUsers.id, id))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tenantEmail = trainingTenantUserEmail(rows[0].username);

  await db.delete(schema.tenantUsers).where(eq(schema.tenantUsers.email, tenantEmail));
  await db.delete(schema.tempUsers).where(eq(schema.tempUsers.id, id));

  return NextResponse.json({ ok: true });
}
