"use client";

import clsx from "clsx";
import { WizardFieldError, wizardInvalidGroupClass, wizardInvalidInputClass } from "./WizardFieldNotice";
import { useWizard, useWizardStepField } from "./WizardContext";
import { tr } from "@/lib/translations";
import SmartPillSelector from "./SmartPillSelector";

export default function Step5Context() {
  const { lang, data, updateData } = useWizard();
  const audF = useWizardStepField("targetAudience");
  const chF = useWizardStepField("channels");
  const brandF = useWizardStepField("brandPromise");
  const channelOptions = tr("step5.channelPills", lang).split(",");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold sm:text-2xl">{tr("step5.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step5.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step5.audience", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(audF.invalid)} min-h-[100px] resize-y`}
          placeholder={tr("step5.audiencePlaceholder", lang)}
          value={data.targetAudience}
          onChange={(e) => updateData({ targetAudience: e.target.value })}
        />
        <WizardFieldError message={audF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step5.channels", lang)}</label>
        <div className={clsx(wizardInvalidGroupClass(chF.invalid))}>
          <SmartPillSelector
            category="channels"
            options={channelOptions}
            selected={data.channels}
            onToggle={(val) => {
              const next = data.channels.includes(val)
                ? data.channels.filter((v) => v !== val)
                : [...data.channels, val];
              updateData({ channels: next });
            }}
          />
        </div>
        <WizardFieldError message={chF.message} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step5.brandPromise", lang)}</label>
        <textarea
          className={`${wizardInvalidInputClass(brandF.invalid)} min-h-[80px] resize-y`}
          placeholder={tr("step5.brandPromisePlaceholder", lang)}
          value={data.brandPromise}
          onChange={(e) => updateData({ brandPromise: e.target.value })}
        />
        <WizardFieldError message={brandF.message} />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step5.guideTip", lang)}</p>
      </div>
    </div>
  );
}
