"use client";

import clsx from "clsx";
import { WizardFieldError, wizardInvalidGroupClass, wizardInvalidInputClass } from "./WizardFieldNotice";
import { useWizard, useWizardStepField } from "./WizardContext";
import { tr } from "@/lib/translations";
import PillSelector from "./PillSelector";

export default function Step3Conviction() {
  const { lang, data, updateData } = useWizard();
  const convictionF = useWizardStepField("coreConviction");
  const anchorF = useWizardStepField("qualityAnchor");

  const beliefPills = [
    tr("step3.beliefPills.simplicity", lang),
    tr("step3.beliefPills.rhythm", lang),
    tr("step3.beliefPills.benefits", lang),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold sm:text-2xl">{tr("step3.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step3.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step3.belief", lang)}</label>
        <div className={clsx(wizardInvalidGroupClass(convictionF.invalid))}>
          <PillSelector
            options={beliefPills}
            selected={data.coreConviction ? [data.coreConviction] : []}
            onToggle={(val) =>
              updateData({ coreConviction: data.coreConviction === val ? "" : val })
            }
          />
          <input
            type="text"
            className={clsx("input-field mt-3", convictionF.invalid && "wizard-field-invalid")}
            placeholder={tr("step3.beliefPlaceholder", lang)}
            value={beliefPills.includes(data.coreConviction) ? "" : data.coreConviction}
            onChange={(e) => updateData({ coreConviction: e.target.value })}
          />
        </div>
        <WizardFieldError message={convictionF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step3.anchor", lang)}</label>
        <input
          type="text"
          className={wizardInvalidInputClass(anchorF.invalid)}
          placeholder={tr("step3.anchorPlaceholder", lang)}
          value={data.qualityAnchor}
          onChange={(e) => updateData({ qualityAnchor: e.target.value })}
        />
        <WizardFieldError message={anchorF.message} />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step3.info", lang)}</p>
        <p className="mt-3 border-t border-(--color-border) pt-3 text-sm">
          {tr("step3.guideTip", lang)}
        </p>
      </div>
    </div>
  );
}
