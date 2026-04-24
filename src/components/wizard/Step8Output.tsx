"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";

export default function Step8Output() {
  const { lang, data, updateData } = useWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">{tr("step8.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step8.subtitle", lang)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">{tr("step8.name", lang)}</label>
          <input
            type="text"
            className="input-field"
            placeholder={tr("step8.namePlaceholder", lang)}
            value={data.assistantName}
            onChange={(e) => updateData({ assistantName: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">{tr("step8.variants", lang)}</label>
          <input
            type="text"
            className="input-field"
            placeholder={tr("step8.variantsPlaceholder", lang)}
            value={data.variants}
            onChange={(e) => updateData({ variants: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{tr("step8.description", lang)}</label>
        <input
          type="text"
          className="input-field"
          placeholder={tr("step8.descriptionPlaceholder", lang)}
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {tr("step8.outputStructure", lang)}
        </label>
        <input
          type="text"
          className="input-field"
          placeholder={tr("step8.outputStructurePlaceholder", lang)}
          value={data.outputStructure}
          onChange={(e) => updateData({ outputStructure: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {tr("step8.lengthLimits", lang)}
        </label>
        <input
          type="text"
          className="input-field"
          placeholder={tr("step8.lengthLimitsPlaceholder", lang)}
          value={data.lengthLimits}
          onChange={(e) => updateData({ lengthLimits: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          {tr("step8.kickoff", lang)}
          <span className="mt-1 block text-xs font-normal text-(--color-muted-foreground)">
            {tr("step8.kickoffSub", lang)}
          </span>
        </label>
        <textarea
          className="input-field min-h-[120px] resize-y"
          placeholder={tr("step8.kickoffPlaceholder", lang)}
          value={data.kickoffMessage}
          onChange={(e) => updateData({ kickoffMessage: e.target.value })}
        />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step8.guideTip", lang)}</p>
      </div>
    </div>
  );
}
