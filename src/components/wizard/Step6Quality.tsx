import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";
import PillSelector from "./PillSelector";

export default function Step6Quality() {
  const { lang, data, updateData } = useWizard();
  const [newCriterion, setNewCriterion] = useState("");

  const checklistPills = [
    tr("step6.checklistPills.scannable", lang),
    tr("step6.checklistPills.cta", lang),
    tr("step6.checklistPills.assumptions", lang),
  ];

  const addCriterion = (val: string) => {
    if (val.trim() && data.checklist.length < 5 && !data.checklist.includes(val.trim())) {
      updateData({ checklist: [...data.checklist, val.trim()] });
    }
  };

  const removeCriterion = (val: string) => {
    updateData({ checklist: data.checklist.filter((c) => c !== val) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{tr("step6.title", lang)}</h2>
        <p className="text-muted-foreground">{tr("step6.subtitle", lang)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {tr("step6.checklist", lang)} ({data.checklist.length}/5)
        </label>
        <PillSelector
          options={checklistPills.filter((p) => !data.checklist.includes(p))}
          selected={[]}
          onToggle={(val) => addCriterion(val)}
        />
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            className="input-field flex-1"
            placeholder={tr("step6.checklistPlaceholder", lang)}
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCriterion(newCriterion);
                setNewCriterion("");
              }
            }}
            disabled={data.checklist.length >= 5}
          />
        </div>
        {data.checklist.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.checklist.map((c) => (
              <span key={c} className="pill-tag active flex items-center gap-1 text-sm">
                {c}
                <button type="button" onClick={() => removeCriterion(c)} className="ml-1 opacity-70 hover:opacity-100">
                  <span className="material-icons-outlined text-sm">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step6.mistakes", lang)}</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder={tr("step6.mistakesPlaceholder", lang)}
          value={data.briefingMistakes}
          onChange={(e) => updateData({ briefingMistakes: e.target.value })}
        />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step6.info", lang)}</p>
      </div>
    </div>
  );
}
