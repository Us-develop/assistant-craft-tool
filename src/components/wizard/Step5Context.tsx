"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";
import PillSelector from "./PillSelector";

export default function Step5Context() {
  const { lang, data, updateData } = useWizard();
  const channelOptions = tr("step5.channelPills", lang).split(",");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">{tr("step5.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step5.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step5.audience", lang)}</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder={tr("step5.audiencePlaceholder", lang)}
          value={data.targetAudience}
          onChange={(e) => updateData({ targetAudience: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step5.channels", lang)}</label>
        <PillSelector
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

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step5.brandPromise", lang)}</label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder={tr("step5.brandPromisePlaceholder", lang)}
          value={data.brandPromise}
          onChange={(e) => updateData({ brandPromise: e.target.value })}
        />
      </div>
    </div>
  );
}
