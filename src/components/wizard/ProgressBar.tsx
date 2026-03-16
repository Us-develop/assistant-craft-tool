import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";

const TOTAL_STEPS = 8;

export default function ProgressBar() {
  const { step, lang } = useWizard();

  const stepKeys = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-1">
        {stepKeys.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  s < step
                    ? "bg-primary text-primary-foreground"
                    : s === step
                    ? "bg-primary text-primary-foreground ring-4 ring-mint-light"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? (
                  <span className="material-icons-outlined text-sm">check</span>
                ) : (
                  s
                )}
              </div>
              <span className="text-[10px] mt-1 text-muted-foreground text-center hidden sm:block max-w-[72px] truncate">
                {tr(`step${s}.title`, lang)}
              </span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${
                  s < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
