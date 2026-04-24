import type { WizardData } from "./wizardSchema";

/** Limits aligned with wizard schema and AI prompt budgets. */
export const CONTEXT_DOC_LIMITS = {
  maxFiles: 6,
  maxCharsPerFile: 25_000,
  maxTotalCharsForLlm: 18_000,
  maxTotalCharsInGeneratedPrompt: 4500,
} as const;

export function formatDocumentsForAiPrompt(data: WizardData): string {
  const docs = data.contextDocuments;
  if (!docs.length) return "";

  const budget = CONTEXT_DOC_LIMITS.maxTotalCharsForLlm;
  const header = "Reference materials uploaded by the user (excerpts below). Use them for suggestions: brand, tone, strategy, terminology, and constraints.\n\n";
  let remaining = budget - header.length;
  if (remaining <= 0) return "";

  const parts: string[] = [header];
  const share = Math.max(500, Math.floor(remaining / docs.length));

  for (const d of docs) {
    if (remaining <= 0) break;
    const title = `### ${d.name}\n`;
    const room = Math.min(share, remaining - title.length, d.text.length);
    if (room <= 0) break;
    const body = d.text.slice(0, room);
    const truncated = d.text.length > room;
    parts.push(`${title}${body}${truncated ? "\n[...truncated]" : ""}\n\n`);
    remaining -= title.length + body.length + (truncated ? 20 : 0);
  }

  return parts.join("").trimEnd();
}

export function formatDocumentsForGeneratedMarkdown(data: WizardData, lang: "nl" | "en"): string {
  const docs = data.contextDocuments;
  if (!docs.length) return "";

  const title =
    lang === "nl"
      ? "## Referentiedocumenten (meegeleverd in de wizard)"
      : "## Reference documents (provided in the wizard)";

  const intro =
    lang === "nl"
      ? "Onderstaande fragmenten komen uit je geüploade bestanden. Gebruik ze samen met de rest van de instructie; ze zijn ingekort om binnen model- en koppeltekens te blijven."
      : "The excerpts below are from your uploaded files. Use them together with the rest of this instruction; they are shortened to stay within model limits.";

  let budget = CONTEXT_DOC_LIMITS.maxTotalCharsInGeneratedPrompt - title.length - intro.length - 32;
  const lines: string[] = [`\n${title}\n\n${intro}\n`];

  const share = Math.max(400, Math.floor(budget / docs.length));

  for (const d of docs) {
    if (budget <= 0) break;
    const sub = lang === "nl" ? `### ${d.name}` : `### ${d.name}`;
    const room = Math.min(share, budget - sub.length - 4, d.text.length);
    if (room <= 0) break;
    const body = d.text.slice(0, room);
    const truncated = d.text.length > room;
    lines.push(`\n${sub}\n\n${body}${truncated ? "\n\n[...]" : ""}\n`);
    budget -= sub.length + body.length + 8;
  }

  return lines.join("");
}
