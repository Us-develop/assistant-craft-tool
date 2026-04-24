"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";

const TOTAL_STEPS = 8;

export default function ProgressBar() {
  const { step, lang } = useWizard();
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-shrink-0 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  s < step
                    ? "bg-(--color-primary) text-(--color-primary-foreground)"
                    : s === step
                      ? "bg-(--color-primary) text-(--color-primary-foreground) ring-4 ring-(--color-mint-light)"
                      : "bg-(--color-muted) text-(--color-muted-foreground)"
                }`}
              >
                {s < step ? (
                  <span className="material-icons-outlined text-sm">check</span>
                ) : (
                  s
                )}
              </div>
              <span className="mt-1 hidden max-w-[72px] truncate text-[10px] text-(--color-muted-foreground) sm:block">
                {tr(`step${s}.title`, lang)}
              </span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 rounded-full transition-colors ${
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
