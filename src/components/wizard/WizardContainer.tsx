"use client";

import { useCallback } from "react";
import { useWizard } from "./WizardContext";
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
import AIAssistantPanel from "./AIAssistantPanel";

const TOTAL_STEPS = 8;

const STEP_COMPONENTS: Record<number, React.FC> = {
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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step, setStep, setShowOutput]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [step, setStep]);

  const StepComponent = STEP_COMPONENTS[step];
  if (!StepComponent) {
    return null;
  }

  return (
    <div className="min-h-dvh overflow-x-clip bg-(--color-background) pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
      <Header />

      {showOutput ? (
        <OutputScreen />
      ) : (
        <>
          <ProgressBar />

          <div className="wizard-shell relative pb-6 sm:pb-8">
            {step === 1 && (
              <>
                <div className="blob-1 -top-20 -left-32" aria-hidden />
                <div className="blob-2 top-40 -right-20" aria-hidden />
                <div className="blob-3 bottom-0 left-10" aria-hidden />
              </>
            )}

            <div className="card-elevated relative z-10 p-4 sm:p-6 md:p-8">
              <StepComponent />
            </div>

            <div
              className={`mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center ${
                step === 1 ? "sm:justify-end" : "sm:justify-between"
              }`}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="btn-ghost order-1 w-full sm:order-1 sm:w-auto"
                >
                  <span className="material-icons-outlined text-sm">arrow_back</span>
                  {tr("nav.back", lang)}
                </button>
              )}
              <button
                type="button"
                onClick={goNext}
                className="btn-primary order-2 w-full sm:order-2 sm:w-auto"
              >
                {step === TOTAL_STEPS ? tr("nav.finish", lang) : tr("nav.next", lang)}
                <span className="material-icons-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <AIAssistantPanel />
        </>
      )}
    </div>
  );
}
