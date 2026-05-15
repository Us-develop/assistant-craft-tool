import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getTenant } from "@/lib/tenants";
import SharePageClient from "./SharePageClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = { params: Promise<{ tenant: string; token: string }> };

export default async function ShareByTokenPage({ params }: Props) {
  const { tenant: tenantSlug, token } = await params;

  if (!getTenant(tenantSlug)) notFound();
  if (token.length > 32 || !/^[A-Za-z0-9_-]+$/.test(token)) notFound();

  const rows = await db
    .select()
    .from(schema.promptShares)
    .where(
      and(
        eq(schema.promptShares.token, token),
        eq(schema.promptShares.tenantSlug, tenantSlug),
      ),
    )
    .limit(1);

  const row = rows[0];
  if (!row) notFound();

  return <SharePageClient row={row} tenantSlug={tenantSlug} />;
}
