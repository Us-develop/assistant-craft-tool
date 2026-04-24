"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultWizardData,
  type Lang,
  type WizardData,
} from "@/lib/wizardSchema";

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
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("nl");
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({ ...defaultWizardData });
  const [showOutput, setShowOutput] = useState(false);

  const updateData = useCallback((partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    setData({ ...defaultWizardData });
    setStep(1);
    setShowOutput(false);
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
    }),
    [lang, step, data, updateData, resetData, showOutput],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used inside <WizardProvider>");
  return ctx;
}
