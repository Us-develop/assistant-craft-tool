"use client";

import Link from "next/link";
import { useState } from "react";
import type { PromptShareRow } from "@/drizzle/schema";
import { tr } from "@/lib/translations";
import type { Lang } from "@/lib/wizardSchema";
import { useToast } from "@/components/ui/Toast";

export default function SharePageClient({ row }: { row: PromptShareRow }) {
  const lang = (row.language === "en" ? "en" : "nl") as Lang;
  const { toast } = useToast();
  const [copiedInst, setCopiedInst] = useState(false);
  const [copiedKick, setCopiedKick] = useState(false);

  const copy = async (text: string, which: "inst" | "kick") => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "inst") {
        setCopiedInst(true);
        window.setTimeout(() => setCopiedInst(false), 2000);
      } else {
        setCopiedKick(true);
        window.setTimeout(() => setCopiedKick(false), 2000);
      }
      toast(tr("output.copyOk", lang), "success");
    } catch {
      toast(tr("output.copyFail", lang), "error");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-(--color-foreground)">
          {tr("sharePage.title", lang)}
        </h1>
        <p className="mt-1 text-sm text-(--color-muted-foreground)">{tr("sharePage.sub", lang)}</p>
        {row.assistantName && (
          <p className="mt-2 text-lg font-medium">{row.assistantName}</p>
        )}
      </div>

      <section className="card-elevated space-y-3 p-6">
        <h2 className="text-sm font-semibold text-(--color-foreground)">
          {tr("output.tabInstruction", lang)}
        </h2>
        <pre className="max-h-[420px] overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {row.generatedPrompt}
        </pre>
        <button
          type="button"
          onClick={() => void copy(row.generatedPrompt, "inst")}
          className="btn-primary text-sm"
        >
          {copiedInst ? tr("nav.copied", lang) : tr("output.copy", lang)}
        </button>
      </section>

      {row.kickoffMessage ? (
        <section className="card-elevated space-y-3 p-6">
          <h2 className="text-sm font-semibold text-(--color-foreground)">
            {tr("output.tabKickoff", lang)}
          </h2>
          <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {row.kickoffMessage}
          </pre>
          <button
            type="button"
            onClick={() => void copy(row.kickoffMessage ?? "", "kick")}
            className="btn-primary text-sm"
          >
            {copiedKick ? tr("nav.copied", lang) : tr("output.copy", lang)}
          </button>
        </section>
      ) : null}

      <p className="text-center text-sm text-(--color-muted-foreground)">
        <Link href="/" className="text-(--color-primary) underline">
          {tr("sharePage.back", lang)}
        </Link>
      </p>
    </div>
  );
}
