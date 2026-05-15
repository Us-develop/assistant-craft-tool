import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth.config";
import { TENANT_SLUGS } from "@/lib/tenants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const rows = await db
    .select()
    .from(schema.tenantUsers)
    .orderBy(desc(schema.tenantUsers.createdAt));

  return NextResponse.json({ rows });
}

export async function POST(request: Request): Promise<Response> {
  const session = await auth();
  const adminEmail = session?.user?.email ?? null;

  const body = await request.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const tenantSlug = body.tenantSlug as string;

  if (!email || !tenantSlug) {
    return NextResponse.json(
      { error: "email and tenantSlug are required" },
      { status: 400 },
    );
  }

  if (!TENANT_SLUGS.includes(tenantSlug as (typeof TENANT_SLUGS)[number])) {
    return NextResponse.json(
      { error: `Invalid tenant: ${tenantSlug}` },
      { status: 400 },
    );
  }

  try {
    await db.insert(schema.tenantUsers).values({
      email,
      tenantSlug,
      createdBy: adminEmail,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Duplicate entry") || msg.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "This email already has access to that tenant" },
        { status: 409 },
      );
    }
    throw err;
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
  const body = await request.json();
  const id = Number(body.id);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await db
    .delete(schema.tenantUsers)
    .where(eq(schema.tenantUsers.id, id));

  return NextResponse.json({ ok: true });
}
