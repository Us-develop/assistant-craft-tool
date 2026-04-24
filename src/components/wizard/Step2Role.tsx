"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";
import SmartPillSelector from "./SmartPillSelector";

export default function Step2Role() {
  const { lang, data, updateData } = useWizard();

  const mentalLensPills = [
    tr("step2.mentalLensPills.strategist", lang),
    tr("step2.mentalLensPills.conversion", lang),
    tr("step2.mentalLensPills.reader", lang),
    tr("step2.mentalLensPills.emotion", lang),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">{tr("step2.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step2.subtitle", lang)}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step2.jobTitle", lang)}</label>
        <input
          type="text"
          className="input-field"
          placeholder={tr("step2.jobTitlePlaceholder", lang)}
          value={data.jobTitle}
          onChange={(e) => updateData({ jobTitle: e.target.value })}
        />
        <p className="mt-2 text-xs text-(--color-muted-foreground)">
          {tr("step2.jobTitleTip", lang)}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step2.mentalLens", lang)}</label>
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
          className="input-field mt-3"
          placeholder={tr("step2.mentalLensPlaceholder", lang)}
          value={data.customMentalLens}
          onChange={(e) => updateData({ customMentalLens: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step2.success", lang)}</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder={tr("step2.successPlaceholder", lang)}
          value={data.successDefinition}
          onChange={(e) => updateData({ successDefinition: e.target.value })}
        />
      </div>
    </div>
  );
}
