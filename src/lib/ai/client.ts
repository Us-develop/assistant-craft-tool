import { createOpenAI } from "@ai-sdk/openai";
import { getTenant, isTenantSlug } from "@/lib/tenants";

const clientCache = new Map<string, ReturnType<typeof createOpenAI>>();

function resolveApiKey(tenantSlug: string): string | undefined {
  if (isTenantSlug(tenantSlug)) {
    const tenant = getTenant(tenantSlug);
    if (tenant) {
      const tenantKey = process.env[tenant.openaiEnvKey];
      if (tenantKey) return tenantKey;
    }
  }
  return process.env.OPENAI_API_KEY;
}

export function getOpenAIForTenant(tenantSlug: string) {
  let client = clientCache.get(tenantSlug);
  if (!client) {
    const apiKey = resolveApiKey(tenantSlug);
    if (!apiKey) {
      throw new Error(
        `No OpenAI API key configured for tenant "${tenantSlug}". Set ${getTenant(tenantSlug)?.openaiEnvKey ?? "OPENAI_API_KEY"} or OPENAI_API_KEY.`,
      );
    }
    client = createOpenAI({ apiKey });
    clientCache.set(tenantSlug, client);
  }
  return client;
}

export function getModelsForTenant(tenantSlug: string) {
  const openai = getOpenAIForTenant(tenantSlug);
  return {
    fast: openai("gpt-4o-mini"),
    quality: openai("gpt-4o"),
  } as const;
}

/** @deprecated Use getModelsForTenant(tenantSlug) in API routes. */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** @deprecated Use getModelsForTenant(tenantSlug) in API routes. */
export const MODELS = {
  fast: openai("gpt-4o-mini"),
  quality: openai("gpt-4o"),
} as const;
