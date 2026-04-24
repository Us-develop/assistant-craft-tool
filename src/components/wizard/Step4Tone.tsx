"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";
import SmartPillSelector from "./SmartPillSelector";

export default function Step4Tone() {
  const { lang, data, updateData } = useWizard();

  const tonePills = [
    tr("step4.tonePills.direct", lang),
    tr("step4.tonePills.warm", lang),
    tr("step4.tonePills.energetic", lang),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">{tr("step4.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step4.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step4.toneProfile", lang)}</label>
        <SmartPillSelector
          category="tone profiles"
          options={tonePills}
          selected={data.toneProfile}
          onToggle={(val) => {
            const next = data.toneProfile.includes(val)
              ? data.toneProfile.filter((v) => v !== val)
              : [...data.toneProfile, val];
            updateData({ toneProfile: next });
          }}
        />
        <input
          type="text"
          className="input-field mt-3"
          placeholder={tr("step4.tonePlaceholder", lang)}
          value={data.customTone}
          onChange={(e) => updateData({ customTone: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="do-box">
          <label className="mb-2 block text-sm font-semibold">
            {tr("step4.doLabel", lang)}
          </label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder={tr("step4.doPlaceholder", lang)}
            value={data.doExamples}
            onChange={(e) => updateData({ doExamples: e.target.value })}
          />
        </div>
        <div className="dont-box">
          <label className="mb-2 block text-sm font-semibold">
            {tr("step4.dontLabel", lang)}
          </label>
          <textarea
            className="input-field min-h-[120px] resize-y"
            placeholder={tr("step4.dontPlaceholder", lang)}
            value={data.dontExamples}
            onChange={(e) => updateData({ dontExamples: e.target.value })}
          />
        </div>
      </div>

      <div className="tip-box">
        <p className="text-sm">{tr("step4.tip", lang)}</p>
      </div>
    </div>
  );
}
