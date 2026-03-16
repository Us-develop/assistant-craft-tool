import React, { createContext, useContext, useState, useCallback } from "react";
import { Lang } from "@/lib/translations";
import { WizardData, defaultWizardData } from "@/lib/wizardTypes";

interface WizardContextType {
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

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <WizardContext.Provider value={{ lang, setLang, step, setStep, data, updateData, resetData, showOutput, setShowOutput }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be inside WizardProvider");
  return ctx;
}
