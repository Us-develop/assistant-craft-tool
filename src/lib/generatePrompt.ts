import type { WizardData, Lang } from "./wizardSchema";
import { tr } from "./translations";

/**
 * Build the Markdown system instruction that the user will paste into their
 * chosen LLM platform. Pure function — safe to run on server or client.
 */
export function generateSystemInstruction(data: WizardData, lang: Lang): string {
  const lines: string[] = [];

  const domain = data.domain
    ? tr(`step1.domains.${data.domain}`, lang)
    : data.customDomain;

  lines.push(`# ${data.assistantName || "AI Assistant"}`);
  if (data.description) lines.push(`\n${data.description}`);
  if (domain) lines.push(`\n**${lang === "nl" ? "Domein" : "Domain"}:** ${domain}`);

  // Role
  if (
    data.jobTitle ||
    data.mentalLens.length ||
    data.customMentalLens ||
    data.successDefinition
  ) {
    lines.push(`\n${tr("md.role", lang)}`);
    if (data.jobTitle) lines.push(data.jobTitle);
    const lenses = [...data.mentalLens, data.customMentalLens].filter(Boolean);
    if (lenses.length) {
      lines.push(`\n**${lang === "nl" ? "Mentale lens" : "Mental lens"}:** ${lenses.join(", ")}`);
    }
    if (data.successDefinition) {
      lines.push(`\n**${lang === "nl" ? "Succes" : "Success"}:** ${data.successDefinition}`);
    }
  }

  // Conviction
  if (data.coreConviction || data.qualityAnchor) {
    lines.push(`\n${tr("md.conviction", lang)}`);
    if (data.coreConviction) lines.push(data.coreConviction);
    if (data.qualityAnchor) {
      lines.push(`\n**${lang === "nl" ? "Referentie" : "Reference"}:** ${data.qualityAnchor}`);
    }
  }

  // Tone
  if (
    data.toneProfile.length ||
    data.customTone ||
    data.doExamples ||
    data.dontExamples
  ) {
    lines.push(`\n${tr("md.tone", lang)}`);
    const tones = [...data.toneProfile, data.customTone].filter(Boolean);
    if (tones.length) lines.push(tones.join(", "));
    if (data.doExamples) lines.push(`\n${tr("md.do", lang)}\n${data.doExamples}`);
    if (data.dontExamples) lines.push(`\n${tr("md.dont", lang)}\n${data.dontExamples}`);
  }

  // Context
  if (data.targetAudience || data.channels.length || data.brandPromise) {
    lines.push(`\n${tr("md.context", lang)}`);
    if (data.targetAudience) lines.push(`\n${tr("md.audience", lang)}\n${data.targetAudience}`);
    if (data.channels.length) lines.push(`\n${tr("md.channels", lang)}\n${data.channels.join(", ")}`);
    if (data.brandPromise) lines.push(`\n${tr("md.brandPromise", lang)}\n${data.brandPromise}`);
  }

  // Quality
  if (data.checklist.length || data.briefingMistakes) {
    lines.push(`\n${tr("md.quality", lang)}`);
    if (data.checklist.length) {
      lines.push(`\n${tr("md.checklist", lang)}`);
      for (const c of data.checklist) lines.push(`- [ ] ${c}`);
    }
    if (data.briefingMistakes) lines.push(`\n${tr("md.mistakes", lang)}\n${data.briefingMistakes}`);
  }

  // Rules
  if (data.alwaysDo || data.neverDo || data.outOfScope || data.missingInfoProtocol) {
    lines.push(`\n${tr("md.rules", lang)}`);
    if (data.alwaysDo) lines.push(`\n${tr("md.alwaysDo", lang)}\n${data.alwaysDo}`);
    if (data.neverDo) lines.push(`\n${tr("md.neverDo", lang)}\n${data.neverDo}`);
    if (data.outOfScope) lines.push(`\n${tr("md.outOfScope", lang)}\n${data.outOfScope}`);
    if (data.missingInfoProtocol) {
      lines.push(`\n${tr("md.missingInfo", lang)}\n${data.missingInfoProtocol}`);
    }
  }

  // Output
  if (data.outputStructure || data.lengthLimits || data.variants) {
    lines.push(`\n${tr("md.output", lang)}`);
    if (data.outputStructure) lines.push(`\n${tr("md.structure", lang)}\n${data.outputStructure}`);
    if (data.lengthLimits) lines.push(`\n${tr("md.length", lang)}\n${data.lengthLimits}`);
    if (data.variants) lines.push(`\n${tr("md.variants", lang)}\n${data.variants}`);
  }

  return lines.join("\n");
}
