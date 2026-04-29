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
 * Required fields for the active step before advancing (Next / Generate).
 * Context document uploads on step 1 stay optional.
 */
export function isStepComplete(step: number, data: WizardData): boolean {
  switch (step) {
    case 1:
      return nonEmpty(data.domain) || nonEmpty(data.customDomain);
    case 2:
      return (
        nonEmpty(data.jobTitle) &&
        (data.mentalLens.length > 0 || nonEmpty(data.customMentalLens)) &&
        nonEmpty(data.successDefinition)
      );
    case 3:
      return nonEmpty(data.coreConviction) && nonEmpty(data.qualityAnchor);
    case 4:
      return (
        (data.toneProfile.length > 0 || nonEmpty(data.customTone)) &&
        nonEmpty(data.doExamples) &&
        nonEmpty(data.dontExamples)
      );
    case 5:
      return (
        nonEmpty(data.targetAudience) &&
        data.channels.length > 0 &&
        nonEmpty(data.brandPromise)
      );
    case 6:
      return data.checklist.length > 0 && nonEmpty(data.briefingMistakes);
    case 7:
      return (
        nonEmpty(data.alwaysDo) &&
        nonEmpty(data.neverDo) &&
        nonEmpty(data.outOfScope) &&
        nonEmpty(data.missingInfoProtocol)
      );
    case 8:
      return (
        nonEmpty(data.assistantName) &&
        nonEmpty(data.description) &&
        nonEmpty(data.outputStructure) &&
        nonEmpty(data.lengthLimits) &&
        nonEmpty(data.variants) &&
        nonEmpty(data.kickoffMessage)
      );
    default:
      return false;
  }
}
