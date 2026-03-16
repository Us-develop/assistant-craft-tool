import { useCallback } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import OutputScreen from "./OutputScreen";
import Step1Domain from "./Step1Domain";
import Step2Role from "./Step2Role";
import Step3Conviction from "./Step3Conviction";
import Step4Tone from "./Step4Tone";
import Step5Context from "./Step5Context";
import Step6Quality from "./Step6Quality";
import Step7Rules from "./Step7Rules";
import Step8Output from "./Step8Output";

const TOTAL_STEPS = 8;

const stepComponents: Record<number, React.FC> = {
  1: Step1Domain,
  2: Step2Role,
  3: Step3Conviction,
  4: Step4Tone,
  5: Step5Context,
  6: Step6Quality,
  7: Step7Rules,
  8: Step8Output,
};

export default function WizardContainer() {
  const { lang, step, setStep, showOutput, setShowOutput } = useWizard();

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setShowOutput(true);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, setStep, setShowOutput]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, setStep]);

  const StepComponent = stepComponents[step];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {showOutput ? (
        <OutputScreen />
      ) : (
        <>
          <ProgressBar />

          <div className="max-w-3xl mx-auto px-4 pb-8 relative">
            {/* Decorative blobs on step 1 */}
            {step === 1 && (
              <>
                <div className="blob-1 -top-20 -left-32" />
                <div className="blob-2 top-40 -right-20" />
                <div className="blob-3 bottom-0 left-10" />
              </>
            )}

            <div className="card-elevated p-6 sm:p-8 relative z-10">
              <StepComponent />
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className={`btn-ghost flex items-center gap-2 ${step === 1 ? "invisible" : ""}`}
                onClick={goBack}
              >
                <span className="material-icons-outlined text-sm">arrow_back</span>
                {tr("nav.back", lang)}
              </button>
              <button
                type="button"
                className="btn-primary flex items-center gap-2"
                onClick={goNext}
              >
                {step === TOTAL_STEPS ? tr("nav.finish", lang) : tr("nav.next", lang)}
                <span className="material-icons-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
