import { NextResponse, type NextRequest } from "next/server";
import { db, schema } from "@/lib/db";
import { hashIp } from "@/lib/hashIp";
import { requireTenantFromRequest } from "@/lib/tenants/resolve";
import { submissionPayloadSchema, isSubmittable } from "@/lib/wizardSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const tenantResult = requireTenantFromRequest(request);
  if (tenantResult instanceof NextResponse) return tenantResult;
  const tenant = tenantResult;

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = submissionPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { language, data, generatedPrompt, kickoffMessage } = parsed.data;

  if (!isSubmittable(data)) {
    return NextResponse.json(
      { error: "Submission did not meet the minimum content requirement." },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip ? await hashIp(ip) : null;
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  try {
    const [result] = await db.insert(schema.submissions).values({
      tenantSlug: tenant.slug,
      language,
      assistantName: data.assistantName || null,
      domain: data.domain || data.customDomain || null,
      jobTitle: data.jobTitle || null,
      data,
      generatedPrompt,
      kickoffMessage: kickoffMessage || null,
      charCount: generatedPrompt.length,
      ipHash,
      userAgent,
    });

    return NextResponse.json(
      { ok: true, id: result.insertId },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to persist submission:", err);
    return NextResponse.json(
      { error: "Database error — submission not saved." },
      { status: 500 },
    );
  }
}
