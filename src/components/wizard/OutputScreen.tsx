"use client";

import { useEffect, useRef, useState } from "react";
import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";
import { generateSystemInstruction } from "@/lib/generatePrompt";
import { buildMailtoOpenInstruction, downloadPromptPdf } from "@/lib/promptExport";
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
  const [linkBusy, setLinkBusy] = useState(false);

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

  const filePrefix = data.assistantName?.trim() || "assistant";
  const hasKickoff = Boolean(data.kickoffMessage?.trim());
  const activeText = activeTab === "instruction" ? instruction : (data.kickoffMessage ?? "");
  const canUseActive = activeTab === "instruction" || hasKickoff;

  const copyActive = async () => {
    if (!canUseActive) {
      toast(tr("output.nothingToExport", lang), "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(activeText);
      toast(tr("output.copyOk", lang), "success");
    } catch {
      toast(tr("output.copyFail", lang), "error");
    }
  };

  const createShareLink = async () => {
    setLinkBusy(true);
    try {
      const res = await fetch("/api/prompt-shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          generatedPrompt: instruction,
          kickoffMessage: data.kickoffMessage ?? "",
          assistantName: data.assistantName ?? "",
        }),
      });
      if (!res.ok) throw new Error("share failed");
      const { url } = (await res.json()) as { url: string };
      await navigator.clipboard.writeText(url);
      toast(tr("output.linkCopied", lang), "success");
    } catch (err) {
      console.error(err);
      toast(tr("output.linkFailed", lang), "error");
    } finally {
      setLinkBusy(false);
    }
  };

  const downloadPdf = () => {
    if (!canUseActive) {
      toast(tr("output.nothingToExport", lang), "error");
      return;
    }
    downloadPromptPdf(activeText, {
      filePrefix,
      lang: lang === "en" ? "en" : "nl",
      variant: activeTab,
    });
  };

  const sendEmail = async () => {
    if (!canUseActive) {
      toast(tr("output.nothingToExport", lang), "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(activeText);
    } catch {
      toast(tr("output.copyFail", lang), "error");
      return;
    }
    const l = lang === "en" ? "en" : "nl";
    const { subject, body } = buildMailtoOpenInstruction(
      l,
      data.assistantName ?? "",
      activeTab,
    );
    const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <div className="wizard-shell space-y-6 py-6 sm:py-8">
      <h2 className="text-center text-xl font-semibold sm:text-2xl">
        {tr("output.title", lang)}
      </h2>

      <div className="card-elevated space-y-4 p-4 sm:p-6">
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
              className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors min-[400px]:px-4 min-[400px]:py-3 min-[400px]:text-sm ${
                activeTab === tab
                  ? "border-b-2 border-(--color-primary) text-(--color-primary)"
                  : "text-(--color-muted-foreground)"
              }`}
            >
              {tr(tab === "instruction" ? "output.tabInstruction" : "output.tabKickoff", lang)}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "instruction" ? (
            <pre className="max-h-[min(500px,55vh)] overflow-y-auto break-words font-mono text-xs leading-relaxed whitespace-pre-wrap sm:max-h-[500px] sm:text-sm">
              {instruction}
            </pre>
          ) : (
            <pre className="break-words font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
              {data.kickoffMessage || "—"}
            </pre>
          )}

          <div className="mt-6 space-y-2 border-t border-(--color-border) pt-4">
            <p className="text-xs font-medium text-(--color-muted-foreground)">
              {tr("output.saveShare", lang)}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void copyActive()}
                disabled={!canUseActive}
                className="btn-primary text-sm"
              >
                <span className="material-icons-outlined text-sm">content_copy</span>
                {tr("output.actionCopy", lang)}
              </button>
              <button
                type="button"
                onClick={() => void createShareLink()}
                disabled={linkBusy}
                className="btn-primary text-sm"
              >
                <span className="material-icons-outlined text-sm">link</span>
                {linkBusy ? tr("nav.saving", lang) : tr("output.createLink", lang)}
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={!canUseActive}
                className="btn-primary text-sm"
              >
                <span className="material-icons-outlined text-sm">picture_as_pdf</span>
                {tr("output.downloadPdf", lang)}
              </button>
              <button
                type="button"
                onClick={() => void sendEmail()}
                disabled={!canUseActive}
                className="btn-primary text-sm"
              >
                <span className="material-icons-outlined text-sm">email</span>
                {tr("output.sendEmail", lang)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-[400px]:flex-row min-[400px]:justify-center min-[400px]:gap-4">
        <button
          type="button"
          onClick={resetData}
          className="btn-ghost w-full min-[400px]:w-auto"
        >
          {tr("nav.startOver", lang)}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowOutput(false);
            setStep(1);
          }}
          className="btn-primary w-full min-[400px]:w-auto"
        >
          <span className="material-icons-outlined text-sm">edit</span>
          {tr("nav.edit", lang)}
        </button>
      </div>
    </div>
  );
}
