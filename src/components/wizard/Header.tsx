import { useWizard } from "@/contexts/WizardContext";
import { tr } from "@/lib/translations";

export default function Header() {
  const { lang, setLang } = useWizard();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-primary">Us</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">{tr("header.tagline", lang)}</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${lang === "nl" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setLang("nl")}
          >
            NL
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
