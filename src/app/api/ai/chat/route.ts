import { streamText } from "ai";
import { z } from "zod";
import { getModelsForTenant } from "@/lib/ai/client";
import { buildChatSystemPrompt } from "@/lib/ai/prompts";
import { requireTenantFromRequest } from "@/lib/tenants/resolve";
import { wizardSchema, LANGUAGES } from "@/lib/wizardSchema";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const requestSchema = z.object({
  messages: z.array(messageSchema),
  step: z.number().int().min(1).max(8),
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

    const { messages, step, data, lang } = parsed.data;
    const fullData = wizardSchema.parse(data);

    const systemPrompt = buildChatSystemPrompt(step, fullData, lang);

    const models = getModelsForTenant(tenant.slug);
    const result = streamText({
      model: models.quality,
      system: systemPrompt,
      messages,
      maxOutputTokens: 500,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI chat error:", error);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
