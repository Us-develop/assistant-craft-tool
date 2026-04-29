"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { tr } from "@/lib/translations";
import {
  defaultWizardData,
  type Lang,
  type WizardData,
} from "@/lib/wizardSchema";

export interface WizardStepFieldErrors {
  step: number;
  fieldIds: string[];
}

interface WizardContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  step: number;
  setStep: (s: number) => void;
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
  resetData: () => void;
  showOutput: boolean;
  setShowOutput: (v: boolean) => void;
  stepFieldErrors: WizardStepFieldErrors | null;
  setStepFieldErrors: Dispatch<SetStateAction<WizardStepFieldErrors | null>>;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("nl");
  const [step, setStepInternal] = useState(1);
  const [data, setData] = useState<WizardData>({ ...defaultWizardData });
  const [showOutput, setShowOutput] = useState(false);
  const [stepFieldErrors, setStepFieldErrors] = useState<WizardStepFieldErrors | null>(null);

  const setStep = useCallback((s: number) => {
    setStepFieldErrors(null);
    setStepInternal(s);
  }, []);

  const updateData = useCallback((partial: Partial<WizardData>) => {
    setStepFieldErrors(null);
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    setData({ ...defaultWizardData });
    setStepInternal(1);
    setShowOutput(false);
    setStepFieldErrors(null);
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({
      lang,
      setLang,
      step,
      setStep,
      data,
      updateData,
      resetData,
      showOutput,
      setShowOutput,
      stepFieldErrors,
      setStepFieldErrors,
    }),
    [
      lang,
      setLang,
      step,
      setStep,
      data,
      updateData,
      resetData,
      showOutput,
      setShowOutput,
      stepFieldErrors,
      setStepFieldErrors,
    ],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside <WizardProvider>");
  return ctx;
}

/**
 * Per-field validation highlight for the current wizard step (after a failed Next attempt).
 */
export function useWizardStepField(fieldId: string) {
  const { step, lang, stepFieldErrors } = useWizard();
  const invalid =
    stepFieldErrors !== null &&
    stepFieldErrors.step === step &&
    stepFieldErrors.fieldIds.includes(fieldId);
  const message = invalid ? tr(`validation.field.${fieldId}`, lang) : null;
  return { invalid, message };
}
