import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";

export default function Step7Rules() {
  const { lang, data, updateData } = useWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{tr("step7.title", lang)}</h2>
        <p className="text-muted-foreground">{tr("step7.subtitle", lang)}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step7.alwaysDo", lang)}</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder={tr("step7.alwaysDoPlaceholder", lang)}
          value={data.alwaysDo}
          onChange={(e) => updateData({ alwaysDo: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step7.neverDo", lang)}</label>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder={tr("step7.neverDoPlaceholder", lang)}
          value={data.neverDo}
          onChange={(e) => updateData({ neverDo: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step7.outOfScope", lang)}</label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder={tr("step7.outOfScopePlaceholder", lang)}
          value={data.outOfScope}
          onChange={(e) => updateData({ outOfScope: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tr("step7.missingInfo", lang)}</label>
        <textarea
          className="input-field min-h-[80px] resize-y"
          placeholder={tr("step7.missingInfoPlaceholder", lang)}
          value={data.missingInfoProtocol}
          onChange={(e) => updateData({ missingInfoProtocol: e.target.value })}
        />
      </div>
    </div>
  );
}
