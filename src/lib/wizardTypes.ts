export interface WizardData {
  // Step 1
  domain: string;
  customDomain: string;

  // Step 2
  jobTitle: string;
  mentalLens: string[];
  customMentalLens: string;
  successDefinition: string;

  // Step 3
  coreConviction: string;
  qualityAnchor: string;

  // Step 4
  toneProfile: string[];
  customTone: string;
  doExamples: string;
  dontExamples: string;

  // Step 5
  targetAudience: string;
  channels: string[];
  brandPromise: string;

  // Step 6
  checklist: string[];
  briefingMistakes: string;

  // Step 7
  alwaysDo: string;
  neverDo: string;
  outOfScope: string;
  missingInfoProtocol: string;

  // Step 8
  assistantName: string;
  description: string;
  outputStructure: string;
  lengthLimits: string;
  variants: string;
  kickoffMessage: string;
}

export const defaultWizardData: WizardData = {
  domain: "",
  customDomain: "",
  jobTitle: "",
  mentalLens: [],
  customMentalLens: "",
  successDefinition: "",
  coreConviction: "",
  qualityAnchor: "",
  toneProfile: [],
  customTone: "",
  doExamples: "",
  dontExamples: "",
  targetAudience: "",
  channels: [],
  brandPromise: "",
  checklist: [],
  briefingMistakes: "",
  alwaysDo: "",
  neverDo: "",
  outOfScope: "",
  missingInfoProtocol: "",
  assistantName: "",
  description: "",
  outputStructure: "",
  lengthLimits: "",
  variants: "",
  kickoffMessage: "",
};
