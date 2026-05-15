import { generateText } from "ai";
import { z } from "zod";
import { getModelsForTenant } from "@/lib/ai/client";
import { parseSuggestionsFromLlm } from "@/lib/ai/parseSuggestionsResponse";
import { requireTenantFromRequest } from "@/lib/tenants/resolve";
import { buildSuggestPrompt } from "@/lib/ai/prompts";
import { wizardSchema, LANGUAGES } from "@/lib/wizardSchema";

const requestSchema = z.object({
  category: z.string().min(1),
  currentSelections: z.array(z.string()).default([]),
  data: wizardSchema.partial(),
  lang: z.enum(LANGUAGES).default("en"),
});

export async function POST(request: Request) {
  const tenantResult = requireTenantFromRequest(request);
  if (tenantResult instanceof Response) return tenantResult;
  const tenant = tenantResult;

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { category, currentSelections, data, lang } = parsed.data;
    const fullData = wizardSchema.parse(data);

    const prompt = buildSuggestPrompt(category, currentSelections, fullData, lang);

    const models = getModelsForTenant(tenant.slug);
    const { text } = await generateText({
      model: models.fast,
      prompt,
      maxOutputTokens: 200,
      temperature: 0.7,
    });

    const suggestions = parseSuggestionsFromLlm(text, 8);

    return Response.json({ suggestions });
  } catch (error) {
    console.error("AI suggest error:", error);
    return Response.json(
      { error: "Failed to generate suggestions" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
