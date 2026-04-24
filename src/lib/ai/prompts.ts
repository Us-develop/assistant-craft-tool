import { formatDocumentsForAiPrompt } from "../contextDocuments";
import type { WizardData, Lang } from "../wizardSchema";

export const STEP_CONTEXT: Record<number, { name: string; description: string }> = {
  1: {
    name: "Domain",
    description: "Choose the domain your AI assistant will specialize in (e.g., Email & CRM, Social media, Content & SEO)",
  },
  2: {
    name: "Role & Expertise",
    description: "Define the job title, seniority level, mental lenses (how the assistant thinks), and success criteria",
  },
  3: {
    name: "Core Conviction",
    description: "Give the assistant a philosophy and quality anchor (reference person or brand)",
  },
  4: {
    name: "Tone & Style",
    description: "Define how the assistant sounds, with do's and don'ts for communication style",
  },
  5: {
    name: "Context",
    description: "Specify target audience, primary channels, and brand promise",
  },
  6: {
    name: "Quality Filter",
    description: "Set up internal checklist criteria and common briefing mistakes to watch for",
  },
  7: {
    name: "Rules & Scope",
    description: "Define always-do rules, never-do rules, out-of-scope responses, and missing info protocols",
  },
  8: {
    name: "Output & Identity",
    description: "Name the assistant, define output structure, length limits, and kick-off message",
  },
};

function formatCurrentData(data: WizardData): string {
  const parts: string[] = [];

  if (data.domain || data.customDomain) {
    parts.push(`Domain: ${data.domain || data.customDomain}`);
  }
  if (data.jobTitle) {
    parts.push(`Job title: ${data.jobTitle}`);
  }
  if (data.mentalLens.length > 0) {
    parts.push(`Mental lenses: ${data.mentalLens.join(", ")}`);
  }
  if (data.coreConviction) {
    parts.push(`Core conviction: ${data.coreConviction}`);
  }
  if (data.toneProfile.length > 0) {
    parts.push(`Tone profile: ${data.toneProfile.join(", ")}`);
  }
  if (data.targetAudience) {
    parts.push(`Target audience: ${data.targetAudience}`);
  }
  if (data.channels.length > 0) {
    parts.push(`Channels: ${data.channels.join(", ")}`);
  }
  if (data.brandPromise) {
    parts.push(`Brand promise: ${data.brandPromise}`);
  }
  if (data.assistantName) {
    parts.push(`Assistant name: ${data.assistantName}`);
  }

  const base = parts.length > 0 ? parts.join("\n") : "No data entered yet.";
  const docBlock = formatDocumentsForAiPrompt(data);
  if (!docBlock) {
    return base;
  }
  if (base === "No data entered yet.") {
    return docBlock;
  }
  return `${base}\n\n${docBlock}`;
}

export function buildSuggestPrompt(
  category: string,
  currentSelections: string[],
  data: WizardData,
  lang: Lang,
): string {
  const langName = lang === "nl" ? "Dutch" : "English";

  return `You are a copywriting and marketing expert helping someone configure an AI writing assistant.

The user is building a custom AI assistant using a wizard tool. They are currently selecting ${category}.

Current wizard context:
${formatCurrentData(data)}

Already selected ${category}:
${currentSelections.length > 0 ? currentSelections.join(", ") : "None yet"}

Generate 4-6 additional relevant ${category} suggestions that:
1. Complement (not duplicate) the existing selections
2. Are specifically relevant to their domain and role
3. Are concise (2-5 words each)
4. Are in ${langName}

Return ONLY a JSON array of strings. Example: ["suggestion 1", "suggestion 2", "suggestion 3"]`;
}

export function buildRefinePrompt(
  field: string,
  currentValue: string,
  data: WizardData,
  lang: Lang,
): string {
  const langName = lang === "nl" ? "Dutch" : "English";

  return `You are a copywriting and marketing expert helping someone configure an AI writing assistant.

The user wants help refining their ${field} input.

Current wizard context:
${formatCurrentData(data)}

Current ${field} value:
"${currentValue}"

Provide a refined, more specific version of this ${field}. Make it:
1. More actionable and concrete
2. Better aligned with their domain and role
3. Professional but not overly formal
4. In ${langName}

Return ONLY the refined text, no explanations or quotes.`;
}

export function buildChatSystemPrompt(step: number, data: WizardData, lang: Lang): string {
  const langName = lang === "nl" ? "Dutch" : "English";
  const stepInfo = STEP_CONTEXT[step] || { name: "Unknown", description: "" };

  return `You are a helpful assistant guiding someone through creating a custom AI writing assistant. You are an expert in copywriting, marketing, and AI prompt engineering.

The user is currently on Step ${step}: "${stepInfo.name}"
Step description: ${stepInfo.description}

Current wizard data so far:
${formatCurrentData(data)}

Your role:
1. Help them think through this step with thoughtful questions and suggestions
2. Provide specific, actionable advice based on their domain and goals
3. Give concrete examples when helpful
4. Keep responses concise (2-4 sentences unless they ask for more detail)
5. Always respond in ${langName}

When suggesting content for fields:
- Be specific to their domain and role
- Use professional but approachable language
- Provide options they can choose from or modify

Do NOT:
- Be overly formal or use corporate jargon
- Give generic advice that could apply to anyone
- Write long essays when a few sentences will do`;
}

export function buildAutocompletePrompt(
  field: string,
  partialValue: string,
  data: WizardData,
  lang: Lang,
): string {
  const langName = lang === "nl" ? "Dutch" : "English";

  return `You are helping someone fill out a form field for their AI writing assistant configuration.

Field: ${field}
What they've typed so far: "${partialValue}"

Context:
${formatCurrentData(data)}

Complete their thought with a natural, relevant continuation. Be specific to their domain.
Response must be in ${langName}.

Return ONLY the completion text (what comes after what they've typed), no quotes or explanations. If the input is already complete or you can't suggest a good completion, return an empty string.`;
}
