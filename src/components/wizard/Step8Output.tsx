"use client";

import { WizardFieldError, wizardInvalidInputClass } from "./WizardFieldNotice";
import { useWizard, useWizardStepField } from "./WizardContext";
import { tr } from "@/lib/translations";

export default function Step8Output() {
  const { lang, data, updateData } = useWizard();
  const nameF = useWizardStepField("assistantName");
  const varF = useWizardStepField("variants");
  const descF = useWizardStepField("description");
  const structF = useWizardStepField("outputStructure");
  const lenF = useWizardStepField("lengthLimits");
  const kickF = useWizardStepField("kickoffMessage");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold sm:text-2xl">{tr("step8.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step8.subtitle", lang)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">{tr("step8.name", lang)}</label>
          <input
            type="text"
            className={wizardInvalidInputClass(nameF.invalid)}
            placeholder={tr("step8.namePlaceholder", lang)}
            value={data.assistantName}
            onChange={(e) => updateData({ assistantName: e.target.value })}
          />
          <WizardFieldError message={nameF.message} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">{tr("step8.variants", lang)}</label>
          <input
            type="text"
            className={wizardInvalidInputClass(varF.invalid)}
            placeholder={tr("step8.variantsPlaceholder", lang)}
            value={data.variants}
            onChange={(e) => updateData({ variants: e.target.value })}
          />
          <WizardFieldError message={varF.message} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step8.description", lang)}</label>
        <input
          type="text"
          className={wizardInvalidInputClass(descF.invalid)}
          placeholder={tr("step8.descriptionPlaceholder", lang)}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
        />
        <WizardFieldError message={descF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {tr("step8.outputStructure", lang)}
        </label>
        <input
          type="text"
          className={wizardInvalidInputClass(structF.invalid)}
          placeholder={tr("step8.outputStructurePlaceholder", lang)}
          value={data.outputStructure}
          onChange={(e) => updateData({ outputStructure: e.target.value })}
        />
        <WizardFieldError message={structF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {tr("step8.lengthLimits", lang)}
        </label>
        <input
          type="text"
          className={wizardInvalidInputClass(lenF.invalid)}
          placeholder={tr("step8.lengthLimitsPlaceholder", lang)}
          value={data.lengthLimits}
          onChange={(e) => updateData({ lengthLimits: e.target.value })}
        />
        <WizardFieldError message={lenF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {tr("step8.kickoff", lang)}
          <span className="mt-1 block text-xs font-normal text-(--color-muted-foreground)">
            {tr("step8.kickoffSub", lang)}
          </span>
        </label>
        <textarea
          className={`${wizardInvalidInputClass(kickF.invalid)} min-h-[120px] resize-y`}
          placeholder={tr("step8.kickoffPlaceholder", lang)}
          value={data.kickoffMessage}
          onChange={(e) => updateData({ kickoffMessage: e.target.value })}
        />
        <WizardFieldError message={kickF.message} />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step8.guideTip", lang)}</p>
      </div>
    </div>
  );
}
