import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { tr, Lang } from "@/lib/translations";
import { WizardData } from "@/lib/wizardTypes";

function generateSystemInstruction(data: WizardData, lang: Lang): string {
  const lines: string[] = [];
  const domain = data.domain
    ? tr(`step1.domains.${data.domain}`, lang)
    : data.customDomain;

  lines.push(`# ${data.assistantName || "AI Assistant"}`);
  if (data.description) lines.push(`\n${data.description}`);
  if (domain) lines.push(`\n**${lang === "nl" ? "Domein" : "Domain"}:** ${domain}`);

  // Role
  if (data.jobTitle || data.mentalLens.length || data.customMentalLens || data.successDefinition) {
    lines.push(`\n${tr("md.role", lang)}`);
    if (data.jobTitle) lines.push(data.jobTitle);
    const lenses = [...data.mentalLens, data.customMentalLens].filter(Boolean);
    if (lenses.length) lines.push(`\n**${lang === "nl" ? "Mentale lens" : "Mental lens"}:** ${lenses.join(", ")}`);
    if (data.successDefinition) lines.push(`\n**${lang === "nl" ? "Succes" : "Success"}:** ${data.successDefinition}`);
  }

  // Conviction
  if (data.coreConviction || data.qualityAnchor) {
    lines.push(`\n${tr("md.conviction", lang)}`);
    if (data.coreConviction) lines.push(data.coreConviction);
    if (data.qualityAnchor) lines.push(`\n**${lang === "nl" ? "Referentie" : "Reference"}:** ${data.qualityAnchor}`);
  }

  // Tone
  if (data.toneProfile.length || data.customTone || data.doExamples || data.dontExamples) {
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
      data.checklist.forEach((c) => lines.push(`- [ ] ${c}`));
    }
    if (data.briefingMistakes) lines.push(`\n${tr("md.mistakes", lang)}\n${data.briefingMistakes}`);
  }

  // Rules
  if (data.alwaysDo || data.neverDo || data.outOfScope || data.missingInfoProtocol) {
    lines.push(`\n${tr("md.rules", lang)}`);
    if (data.alwaysDo) lines.push(`\n${tr("md.alwaysDo", lang)}\n${data.alwaysDo}`);
    if (data.neverDo) lines.push(`\n${tr("md.neverDo", lang)}\n${data.neverDo}`);
    if (data.outOfScope) lines.push(`\n${tr("md.outOfScope", lang)}\n${data.outOfScope}`);
    if (data.missingInfoProtocol) lines.push(`\n${tr("md.missingInfo", lang)}\n${data.missingInfoProtocol}`);
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

interface CompletenessField {
  label: string;
  filled: boolean;
}

function getCompletenessFields(data: WizardData, lang: Lang): CompletenessField[] {
  return [
    { label: tr("step1.title", lang), filled: !!(data.domain || data.customDomain) },
    { label: tr("step2.title", lang), filled: !!data.jobTitle },
    { label: tr("step3.title", lang), filled: !!data.coreConviction },
    { label: tr("step4.title", lang), filled: !!(data.toneProfile.length || data.customTone) },
    { label: tr("step5.title", lang), filled: !!data.targetAudience },
    { label: tr("step6.title", lang), filled: data.checklist.length > 0 },
    { label: tr("step7.title", lang), filled: !!(data.alwaysDo || data.neverDo) },
    { label: tr("step8.title", lang), filled: !!data.assistantName },
  ];
}

export default function OutputScreen() {
  const { lang, data, setStep, setShowOutput, resetData } = useWizard();
  const [activeTab, setActiveTab] = useState<"instruction" | "kickoff">("instruction");
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [copiedKickoff, setCopiedKickoff] = useState(false);

  const instruction = generateSystemInstruction(data, lang);
  const charCount = instruction.length;
  const fields = getCompletenessFields(data, lang);
  const domain = data.domain ? tr(`step1.domains.${data.domain}`, lang) : data.customDomain;

  const charColor = charCount > 8000 ? "bg-destructive" : charCount > 6000 ? "bg-amber" : "bg-primary";
  const charPct = Math.min((charCount / 8000) * 100, 100);

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-semibold text-center">{tr("output.title", lang)}</h2>

      {/* Metadata card */}
      <div className="card-elevated p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{data.assistantName || "—"}</h3>
          {domain && <p className="text-sm text-muted-foreground">{domain}</p>}
          {data.description && <p className="text-sm">{data.description}</p>}
        </div>

        {/* Completeness */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">{tr("output.completeness", lang)}</p>
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => (
              <span
                key={f.label}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  f.filled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {f.filled && <span className="material-icons-outlined text-xs mr-1 align-middle">check</span>}
                {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Char count */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{tr("output.charCount", lang)}: {charCount.toLocaleString()}</span>
            <span>{tr("output.maxChars", lang)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full transition-all ${charColor}`} style={{ width: `${charPct}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-elevated overflow-hidden">
        <div className="flex border-b border-border">
          <button
            type="button"
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "instruction" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("instruction")}
          >
            {tr("output.tabInstruction", lang)}
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "kickoff" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("kickoff")}
          >
            {tr("output.tabKickoff", lang)}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "instruction" ? (
            <div>
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed max-h-[500px] overflow-y-auto">
                {instruction}
              </pre>
              <button
                type="button"
                className={`mt-4 btn-primary text-sm flex items-center gap-2 ${copiedInstruction ? "bg-primary" : ""}`}
                onClick={() => copyText(instruction, setCopiedInstruction)}
              >
                <span className="material-icons-outlined text-sm">
                  {copiedInstruction ? "check_circle" : "content_copy"}
                </span>
                {copiedInstruction ? tr("nav.copied", lang) : tr("nav.copy", lang)}
              </button>
            </div>
          ) : (
            <div>
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {data.kickoffMessage || "—"}
              </pre>
              <button
                type="button"
                className={`mt-4 btn-primary text-sm flex items-center gap-2`}
                onClick={() => copyText(data.kickoffMessage, setCopiedKickoff)}
                disabled={!data.kickoffMessage}
              >
                <span className="material-icons-outlined text-sm">
                  {copiedKickoff ? "check_circle" : "content_copy"}
                </span>
                {copiedKickoff ? tr("nav.copied", lang) : tr("nav.copy", lang)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button type="button" className="btn-ghost" onClick={resetData}>
          {tr("nav.startOver", lang)}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setShowOutput(false);
            setStep(1);
          }}
        >
          <span className="flex items-center gap-2">
            <span className="material-icons-outlined text-sm">edit</span>
            {tr("nav.edit", lang)}
          </span>
        </button>
      </div>
    </div>
  );
}
