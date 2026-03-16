import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";

const DOMAINS = ["email", "social", "paid", "content", "brand", "conversion"] as const;

const domainIcons: Record<string, string> = {
  email: "mail",
  social: "share",
  paid: "campaign",
  content: "article",
  brand: "diamond",
  conversion: "edit_note",
};

export default function Step1Domain() {
  const { lang, data, updateData } = useWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{tr("step1.title", lang)}</h2>
        <p className="text-muted-foreground">{tr("step1.subtitle", lang)}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            className={`selection-card flex flex-col items-center gap-3 text-center ${data.domain === d ? "active" : ""}`}
            onClick={() => updateData({ domain: d, customDomain: "" })}
          >
            <span className="material-icons-outlined text-3xl text-primary">
              {domainIcons[d]}
            </span>
            <span className="font-medium text-sm">{tr(`step1.domains.${d}`, lang)}</span>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          {tr("step1.customLabel", lang)}
        </label>
        <input
          type="text"
          className="input-field"
          placeholder={tr("step1.customPlaceholder", lang)}
          value={data.customDomain}
          onChange={(e) => updateData({ customDomain: e.target.value, domain: "" })}
        />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step1.info", lang)}</p>
      </div>
    </div>
  );
}
