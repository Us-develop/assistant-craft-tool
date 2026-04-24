"use client";

import { useEffect, useRef, useState } from "react";
import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";
import { generateSystemInstruction } from "@/lib/generatePrompt";
import { isSubmittable, type Lang, type WizardData } from "@/lib/wizardSchema";
import { useToast } from "@/components/ui/Toast";

interface CompletenessField {
  label: string;
  filled: boolean;
}

function getCompletenessFields(data: WizardData, lang: Lang): CompletenessField[] {
  return [
    { label: tr("step1.title", lang), filled: Boolean(data.domain || data.customDomain) },
    { label: tr("step2.title", lang), filled: Boolean(data.jobTitle) },
    { label: tr("step3.title", lang), filled: Boolean(data.coreConviction) },
    { label: tr("step4.title", lang), filled: Boolean(data.toneProfile.length || data.customTone) },
    { label: tr("step5.title", lang), filled: Boolean(data.targetAudience) },
    { label: tr("step6.title", lang), filled: data.checklist.length > 0 },
    { label: tr("step7.title", lang), filled: Boolean(data.alwaysDo || data.neverDo) },
    { label: tr("step8.title", lang), filled: Boolean(data.assistantName) },
  ];
}

export default function OutputScreen() {
  const { lang, data, setStep, setShowOutput, resetData } = useWizard();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"instruction" | "kickoff">("instruction");
  const [copiedInstruction, setCopiedInstruction] = useState(false);
  const [copiedKickoff, setCopiedKickoff] = useState(false);

  const instruction = generateSystemInstruction(data, lang);
  const charCount = instruction.length;
  const fields = getCompletenessFields(data, lang);
  const domain = data.domain ? tr(`step1.domains.${data.domain}`, lang) : data.customDomain;

  const charColor =
    charCount > 8000
      ? "bg-(--color-destructive)"
      : charCount > 6000
        ? "bg-(--color-amber)"
        : "bg-(--color-primary)";
  const charPct = Math.min((charCount / 8000) * 100, 100);

  // Log the submission exactly once per arrival at this screen.
  const hasLoggedRef = useRef(false);
  useEffect(() => {
    if (hasLoggedRef.current) return;
    hasLoggedRef.current = true;

    if (!isSubmittable(data)) {
      toast(tr("save.notSubmittable", lang), "error");
      return;
    }

    void fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang,
        data,
        generatedPrompt: instruction,
        kickoffMessage: data.kickoffMessage,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        toast(tr("save.success", lang), "success");
      })
      .catch((err) => {
        console.error("Failed to log submission:", err);
        toast(tr("save.failed", lang), "error");
      });
  }, [data, lang, instruction, toast]);

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      window.setTimeout(() => setter(false), 2000);
    } catch {
      toast(tr("save.failed", lang), "error");
    }
  };

  return (
    <div className="wizard-shell space-y-6 px-4 py-8">
      <h2 className="text-center text-2xl font-semibold">{tr("output.title", lang)}</h2>

      <div className="card-elevated space-y-4 p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{data.assistantName || "—"}</h3>
          {domain && <p className="text-sm text-(--color-muted-foreground)">{domain}</p>}
          {data.description && <p className="text-sm">{data.description}</p>}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-(--color-muted-foreground)">
            {tr("output.completeness", lang)}
          </p>
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => (
              <span
                key={f.label}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  f.filled
                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                    : "bg-(--color-muted) text-(--color-muted-foreground)"
                }`}
              >
                {f.filled && (
                  <span className="material-icons-outlined mr-1 align-middle text-xs">
                    check
                  </span>
                )}
                {f.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs text-(--color-muted-foreground)">
            <span>
              {tr("output.charCount", lang)}: {charCount.toLocaleString()}
            </span>
            <span>{tr("output.maxChars", lang)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-muted)">
            <div
              className={`h-full rounded-full transition-all ${charColor}`}
              style={{ width: `${charPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="flex border-b border-(--color-border)">
          {(["instruction", "kickoff"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-(--color-primary) text-(--color-primary)"
                  : "text-(--color-muted-foreground)"
              }`}
            >
              {tr(tab === "instruction" ? "output.tabInstruction" : "output.tabKickoff", lang)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "instruction" ? (
            <div>
              <pre className="max-h-[500px] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {instruction}
              </pre>
              <button
                type="button"
                onClick={() => copyText(instruction, setCopiedInstruction)}
                className="btn-primary mt-4 text-sm"
              >
                <span className="material-icons-outlined text-sm">
                  {copiedInstruction ? "check_circle" : "content_copy"}
                </span>
                {copiedInstruction ? tr("nav.copied", lang) : tr("nav.copy", lang)}
              </button>
            </div>
          ) : (
            <div>
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {data.kickoffMessage || "—"}
              </pre>
              <button
                type="button"
                onClick={() => copyText(data.kickoffMessage, setCopiedKickoff)}
                disabled={!data.kickoffMessage}
                className="btn-primary mt-4 text-sm"
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

      <div className="flex justify-center gap-4">
        <button type="button" onClick={resetData} className="btn-ghost">
          {tr("nav.startOver", lang)}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOutput(false);
            setStep(1);
          }}
          className="btn-primary"
        >
          <span className="material-icons-outlined text-sm">edit</span>
          {tr("nav.edit", lang)}
        </button>
      </div>
    </div>
  );
}
