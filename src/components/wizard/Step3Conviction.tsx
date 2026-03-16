import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";
import PillSelector from "./PillSelector";

export default function Step3Conviction() {
  const { lang, data, updateData } = useWizard();

  const beliefPills = [
    tr("step3.beliefPills.simplicity", lang),
    tr("step3.beliefPills.rhythm", lang),
    tr("step3.beliefPills.benefits", lang),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{tr("step3.title", lang)}</h2>
        <p className="text-muted-foreground">{tr("step3.subtitle", lang)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step3.belief", lang)}</label>
        <PillSelector
          options={beliefPills}
          selected={data.coreConviction ? [data.coreConviction] : []}
          onToggle={(val) => updateData({ coreConviction: data.coreConviction === val ? "" : val })}
        />
        <input
          type="text"
          className="input-field mt-3"
          placeholder={tr("step3.beliefPlaceholder", lang)}
          value={beliefPills.includes(data.coreConviction) ? "" : data.coreConviction}
          onChange={(e) => updateData({ coreConviction: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step3.anchor", lang)}</label>
        <input
          type="text"
          className="input-field"
          placeholder={tr("step3.anchorPlaceholder", lang)}
          value={data.qualityAnchor}
          onChange={(e) => updateData({ qualityAnchor: e.target.value })}
        />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step3.info", lang)}</p>
      </div>
    </div>
  );
}
