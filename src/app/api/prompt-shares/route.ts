import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireTenantFromRequest } from "@/lib/tenants/resolve";
import { LANGUAGES } from "@/lib/wizardSchema";

const bodySchema = z.object({
  language: z.enum(LANGUAGES),
  generatedPrompt: z.string().min(1).max(25_000),
  kickoffMessage: z.string().max(2000).optional().default(""),
  assistantName: z.string().max(160).optional().default(""),
});

function getRequestOrigin(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  if (host) {
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const tenantResult = requireTenantFromRequest(request);
  if (tenantResult instanceof NextResponse) return tenantResult;
  const tenant = tenantResult;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const token = randomBytes(12).toString("base64url").slice(0, 24);
  if (token.length < 12) {
    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  }

  const { language, generatedPrompt, kickoffMessage, assistantName } = parsed.data;

  try {
    await db.insert(schema.promptShares).values({
      token,
      tenantSlug: tenant.slug,
      language,
      assistantName: assistantName || null,
      generatedPrompt,
      kickoffMessage: kickoffMessage.trim() || null,
    });
  } catch (err) {
    console.error("prompt_shares insert failed:", err);
    return NextResponse.json(
      { error: "Could not create link. Is the database migration applied?" },
      { status: 500 },
    );
  }

  const origin = getRequestOrigin(request);
  const url = `${origin}/${tenant.slug}/share/${token}`;

  return NextResponse.json({ url, token });
}
