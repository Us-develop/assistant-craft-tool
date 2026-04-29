"use client";

import { WizardFieldError, wizardInvalidInputClass } from "./WizardFieldNotice";
import { useWizard, useWizardStepField } from "./WizardContext";
import { tr } from "@/lib/translations";

export default function Step7Rules() {
  const { lang, data, updateData } = useWizard();
  const alwaysF = useWizardStepField("alwaysDo");
  const neverF = useWizardStepField("neverDo");
  const scopeF = useWizardStepField("outOfScope");
  const missingF = useWizardStepField("missingInfoProtocol");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold sm:text-2xl">{tr("step7.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step7.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step7.alwaysDo", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(alwaysF.invalid)} min-h-[100px] resize-y`}
          placeholder={tr("step7.alwaysDoPlaceholder", lang)}
          value={data.alwaysDo}
          onChange={(e) => updateData({ alwaysDo: e.target.value })}
        />
        <WizardFieldError message={alwaysF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step7.neverDo", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(neverF.invalid)} min-h-[100px] resize-y`}
          placeholder={tr("step7.neverDoPlaceholder", lang)}
          value={data.neverDo}
          onChange={(e) => updateData({ neverDo: e.target.value })}
        />
        <WizardFieldError message={neverF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step7.outOfScope", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(scopeF.invalid)} min-h-[80px] resize-y`}
          placeholder={tr("step7.outOfScopePlaceholder", lang)}
          value={data.outOfScope}
          onChange={(e) => updateData({ outOfScope: e.target.value })}
        />
        <WizardFieldError message={scopeF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step7.missingInfo", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(missingF.invalid)} min-h-[80px] resize-y`}
          placeholder={tr("step7.missingInfoPlaceholder", lang)}
          value={data.missingInfoProtocol}
          onChange={(e) => updateData({ missingInfoProtocol: e.target.value })}
        />
        <WizardFieldError message={missingF.message} />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step7.guideTip", lang)}</p>
      </div>
    </div>
  );
}
