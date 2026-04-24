import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MODELS = {
  fast: openai("gpt-4o-mini"),
  quality: openai("gpt-4o"),
} as const;
