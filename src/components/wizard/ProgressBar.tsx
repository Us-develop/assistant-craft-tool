"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";

const TOTAL_STEPS = 8;

export default function ProgressBar() {
  const { step, lang } = useWizard();
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1);
  const mobileLabel = tr("progress.stepOf", lang)
    .replace("{n}", String(step))
    .replace("{total}", String(TOTAL_STEPS));

  return (
    <div className="wizard-shell py-4 sm:py-6">
      <p className="mb-3 text-center text-xs text-(--color-muted-foreground) sm:hidden">
        {mobileLabel}
      </p>
      <div className="flex items-center justify-between gap-0.5 sm:gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex min-w-0 flex-1 items-center">
            <div className="flex shrink-0 flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold transition-all sm:h-8 sm:w-8 sm:text-xs ${
                  s < step
                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                    : s === step
                      ? "bg-(--color-primary) text-(--color-primary-foreground) ring-2 ring-(--color-accent) sm:ring-4"
                      : "bg-(--color-muted) text-(--color-muted-foreground)"
                }`}
              >
                {s < step ? (
                  <span className="material-icons-outlined text-sm">check</span>
                ) : (
                  s
                )}
              </div>
              <span className="mt-1 hidden max-w-[72px] truncate text-[10px] text-(--color-muted-foreground) md:block">
                {tr(`step${s}.title`, lang)}
              </span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={`relative bottom-[0.45rem] mx-0.5 h-0.5 min-w-[2px] flex-1 rounded-full transition-colors sm:bottom-[0.6rem] sm:mx-1 ${
                  s < step ? "bg-(--color-primary)" : "bg-(--color-muted)"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
