import { z } from "zod";

export const LANGUAGES = ["nl", "en"] as const;
export type Lang = (typeof LANGUAGES)[number];

/**
 * Single source of truth for the wizard form shape.
 * Used for client validation, server validation, and the DB payload.
 */
const contextDocumentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(200),
  text: z.string().max(25_000),
});

export const wizardSchema = z.object({
  // Step 1 — Reference uploads (brand book, content strategy, …)
  contextDocuments: z.array(contextDocumentSchema).max(6).default([]),

  // Step 1 — Domain
  domain: z.string().max(64).default(""),
  customDomain: z.string().max(200).default(""),

  // Step 2 — Role
  jobTitle: z.string().max(300).default(""),
  mentalLens: z.array(z.string().max(200)).max(10).default([]),
  customMentalLens: z.string().max(200).default(""),
  successDefinition: z.string().max(2000).default(""),

  // Step 3 — Conviction
  coreConviction: z.string().max(500).default(""),
  qualityAnchor: z.string().max(300).default(""),

  // Step 4 — Tone
  toneProfile: z.array(z.string().max(100)).max(10).default([]),
  customTone: z.string().max(200).default(""),
  doExamples: z.string().max(2000).default(""),
  dontExamples: z.string().max(2000).default(""),

  // Step 5 — Context
  targetAudience: z.string().max(2000).default(""),
  channels: z.array(z.string().max(100)).max(20).default([]),
  brandPromise: z.string().max(1000).default(""),

  // Step 6 — Quality
  checklist: z.array(z.string().max(200)).max(5).default([]),
  briefingMistakes: z.string().max(2000).default(""),

  // Step 7 — Rules
  alwaysDo: z.string().max(2000).default(""),
  neverDo: z.string().max(2000).default(""),
  outOfScope: z.string().max(1000).default(""),
  missingInfoProtocol: z.string().max(1000).default(""),

  // Step 8 — Output identity
  assistantName: z.string().max(100).default(""),
  description: z.string().max(500).default(""),
  outputStructure: z.string().max(500).default(""),
  lengthLimits: z.string().max(300).default(""),
  variants: z.string().max(100).default(""),
  kickoffMessage: z.string().max(2000).default(""),
});

export type WizardData = z.infer<typeof wizardSchema>;

export const defaultWizardData: WizardData = wizardSchema.parse({});

/** Payload the client sends to POST /api/submissions. */
export const submissionPayloadSchema = z.object({
  language: z.enum(LANGUAGES),
  data: wizardSchema,
  generatedPrompt: z.string().max(20_000),
  kickoffMessage: z.string().max(2000).default(""),
});

export type SubmissionPayload = z.infer<typeof submissionPayloadSchema>;

/**
 * Minimum quality bar for a submission to be accepted.
 * Requires at least one of: a chosen domain, a job title, or an assistant name.
 * Keeps junk out of the DB while allowing partial drafts.
 */
export function isSubmittable(data: WizardData): boolean {
  return Boolean(
    data.domain.trim() ||
      data.customDomain.trim() ||
      data.jobTitle.trim() ||
      data.assistantName.trim(),
  );
}

function nonEmpty(text: string): boolean {
  return text.trim().length > 0;
}

/**
 * Which field groups are still incomplete for a step (for inline validation UI).
 * Context document uploads on step 1 stay optional.
 */
export function getInvalidFieldIdsForStep(step: number, data: WizardData): string[] {
  const ids: string[] = [];
  switch (step) {
    case 1:
      if (!nonEmpty(data.domain) && !nonEmpty(data.customDomain)) ids.push("domain");
      break;
    case 2:
      if (!nonEmpty(data.jobTitle)) ids.push("jobTitle");
      if (data.mentalLens.length === 0 && !nonEmpty(data.customMentalLens)) ids.push("mentalLens");
      if (!nonEmpty(data.successDefinition)) ids.push("successDefinition");
      break;
    case 3:
      if (!nonEmpty(data.coreConviction)) ids.push("coreConviction");
      if (!nonEmpty(data.qualityAnchor)) ids.push("qualityAnchor");
      break;
    case 4:
      if (data.toneProfile.length === 0 && !nonEmpty(data.customTone)) ids.push("toneProfile");
      if (!nonEmpty(data.doExamples)) ids.push("doExamples");
      if (!nonEmpty(data.dontExamples)) ids.push("dontExamples");
      break;
    case 5:
      if (!nonEmpty(data.targetAudience)) ids.push("targetAudience");
      if (data.channels.length === 0) ids.push("channels");
      if (!nonEmpty(data.brandPromise)) ids.push("brandPromise");
      break;
    case 6:
      if (data.checklist.length === 0) ids.push("checklist");
      if (!nonEmpty(data.briefingMistakes)) ids.push("briefingMistakes");
      break;
    case 7:
      if (!nonEmpty(data.alwaysDo)) ids.push("alwaysDo");
      if (!nonEmpty(data.neverDo)) ids.push("neverDo");
      if (!nonEmpty(data.outOfScope)) ids.push("outOfScope");
      if (!nonEmpty(data.missingInfoProtocol)) ids.push("missingInfoProtocol");
      break;
    case 8:
      if (!nonEmpty(data.assistantName)) ids.push("assistantName");
      if (!nonEmpty(data.description)) ids.push("description");
      if (!nonEmpty(data.outputStructure)) ids.push("outputStructure");
      if (!nonEmpty(data.lengthLimits)) ids.push("lengthLimits");
      if (!nonEmpty(data.variants)) ids.push("variants");
      if (!nonEmpty(data.kickoffMessage)) ids.push("kickoffMessage");
      break;
    default:
      break;
  }
  return ids;
}

/**
 * Required fields for the active step before advancing (Next / Generate).
 */
export function isStepComplete(step: number, data: WizardData): boolean {
  return getInvalidFieldIdsForStep(step, data).length === 0;
}
