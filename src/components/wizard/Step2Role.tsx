"use client";

import clsx from "clsx";
import { WizardFieldError, wizardInvalidGroupClass, wizardInvalidInputClass } from "./WizardFieldNotice";
import { useWizard, useWizardStepField } from "./WizardContext";
import { tr } from "@/lib/translations";
import SmartPillSelector from "./SmartPillSelector";

export default function Step2Role() {
  const { lang, data, updateData } = useWizard();
  const jobF = useWizardStepField("jobTitle");
  const lensF = useWizardStepField("mentalLens");
  const successF = useWizardStepField("successDefinition");

  const mentalLensPills = [
    tr("step2.mentalLensPills.strategist", lang),
    tr("step2.mentalLensPills.conversion", lang),
    tr("step2.mentalLensPills.reader", lang),
    tr("step2.mentalLensPills.emotion", lang),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold sm:text-2xl">{tr("step2.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step2.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step2.jobTitle", lang)}</label>
        <input
          type="text"
          className={wizardInvalidInputClass(jobF.invalid)}
          placeholder={tr("step2.jobTitlePlaceholder", lang)}
          value={data.jobTitle}
          onChange={(e) => updateData({ jobTitle: e.target.value })}
        />
        <WizardFieldError message={jobF.message} />
        <p className="mt-2 text-xs text-(--color-muted-foreground)">
          {tr("step2.jobTitleTip", lang)}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step2.mentalLens", lang)}</label>
        <div className={clsx(wizardInvalidGroupClass(lensF.invalid))}>
          <SmartPillSelector
            category="mental lenses"
            options={mentalLensPills}
            selected={data.mentalLens}
            onToggle={(val) => {
              const next = data.mentalLens.includes(val)
                ? data.mentalLens.filter((v) => v !== val)
                : [...data.mentalLens, val];
              updateData({ mentalLens: next });
            }}
          />
          <input
            type="text"
            className={clsx("input-field mt-3", lensF.invalid && "wizard-field-invalid")}
            placeholder={tr("step2.mentalLensPlaceholder", lang)}
            value={data.customMentalLens}
            onChange={(e) => updateData({ customMentalLens: e.target.value })}
          />
        </div>
        <WizardFieldError message={lensF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step2.success", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(successF.invalid)} min-h-[100px] resize-y`}
          placeholder={tr("step2.successPlaceholder", lang)}
          value={data.successDefinition}
          onChange={(e) => updateData({ successDefinition: e.target.value })}
        />
        <WizardFieldError message={successF.message} />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step2.guideTip", lang)}</p>
      </div>
    </div>
  );
}
