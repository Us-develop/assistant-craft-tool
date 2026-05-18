import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { trainingTenantUserEmail } from "@/lib/tempTrainingAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
  const tempRows = await db
    .select({ username: schema.tempUsers.username })
    .from(schema.tempUsers);

  if (tempRows.length > 0) {
    const bridgeEmails = tempRows.map((r) => trainingTenantUserEmail(r.username));

    await db
      .delete(schema.tenantUsers)
      .where(inArray(schema.tenantUsers.email, bridgeEmails));

    await db.delete(schema.tempUsers);
  }

  return NextResponse.json({ ok: true, deleted: tempRows.length });
}
