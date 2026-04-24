import { generateText } from "ai";
import { z } from "zod";
import { MODELS } from "@/lib/ai/client";
import { buildSuggestPrompt } from "@/lib/ai/prompts";
import { wizardSchema, LANGUAGES } from "@/lib/wizardSchema";

const requestSchema = z.object({
  category: z.string().min(1),
  currentSelections: z.array(z.string()).default([]),
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

    const { category, currentSelections, data, lang } = parsed.data;
    const fullData = wizardSchema.parse(data);

    const prompt = buildSuggestPrompt(category, currentSelections, fullData, lang);

    const { text } = await generateText({
      model: MODELS.fast,
      prompt,
      maxOutputTokens: 200,
      temperature: 0.7,
    });

    let suggestions: string[];
    try {
      suggestions = JSON.parse(text.trim());
      if (!Array.isArray(suggestions)) {
        throw new Error("Response is not an array");
      }
      suggestions = suggestions.filter((s) => typeof s === "string" && s.trim().length > 0);
    } catch {
      const lines = text
        .split("\n")
        .map((line) => line.replace(/^[-*•]\s*/, "").replace(/^["']|["']$/g, "").trim())
        .filter((line) => line.length > 0 && line.length < 100);
      suggestions = lines.slice(0, 6);
    }

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
