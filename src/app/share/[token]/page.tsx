import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import SharePageClient from "./SharePageClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ShareByTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (token.length > 32 || !/^[A-Za-z0-9_-]+$/.test(token)) {
    notFound();
  }

  const rows = await db
    .select()
    .from(schema.promptShares)
    .where(eq(schema.promptShares.token, token))
    .limit(1);

  const row = rows[0];
  if (!row) {
    notFound();
  }

  return <SharePageClient row={row} />;
}
