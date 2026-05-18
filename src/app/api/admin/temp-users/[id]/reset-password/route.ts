import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db, schema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();
  const password = body.password as string;

  if (!password) {
    return NextResponse.json(
      { error: "password is required" },
      { status: 400 },
    );
  }

  const rows = await db
    .select({ id: schema.tempUsers.id })
    .from(schema.tempUsers)
    .where(eq(schema.tempUsers.id, id))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const passwordHash = await hash(password, 10);

  await db
    .update(schema.tempUsers)
    .set({ passwordHash })
    .where(eq(schema.tempUsers.id, id));

  return NextResponse.json({ ok: true });
}
