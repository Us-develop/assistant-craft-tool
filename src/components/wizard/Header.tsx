"use client";

import { useWizard } from "./WizardContext";
import { tr } from "@/lib/translations";

export default function Header() {
  const { lang, setLang } = useWizard();

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-card)/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-(--color-primary)">Us</span>
          <span className="hidden text-xs text-(--color-muted-foreground) sm:inline">
            {tr("header.tagline", lang)}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-(--color-muted) p-1">
          {(["nl", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                lang === code
                  ? "bg-(--color-primary) text-(--color-primary-foreground)"
                  : "text-(--color-muted-foreground)"
              }`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
