import { generateText } from "ai";
import { z } from "zod";
import { MODELS } from "@/lib/ai/client";
import { buildRefinePrompt } from "@/lib/ai/prompts";
import { wizardSchema, LANGUAGES } from "@/lib/wizardSchema";

const requestSchema = z.object({
  field: z.string().min(1),
  currentValue: z.string().min(1),
  data: wizardSchema.partial(),
  lang: z.enum(LANGUAGES).default("en"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { field, currentValue, data, lang } = parsed.data;
    const fullData = wizardSchema.parse(data);

    const prompt = buildRefinePrompt(field, currentValue, fullData, lang);

    const { text } = await generateText({
      model: MODELS.quality,
      prompt,
      maxOutputTokens: 300,
      temperature: 0.5,
    });

    const refined = text.trim().replace(/^["']|["']$/g, "");

    return Response.json({ refined });
  } catch (error) {
    console.error("AI refine error:", error);
    return Response.json(
      { error: "Failed to refine text" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
