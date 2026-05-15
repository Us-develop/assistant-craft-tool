"use client";

import Image from "next/image";
import { useTenant } from "@/components/TenantProvider";
import { useWizard } from "./WizardContext";

export default function Header() {
  const tenant = useTenant();
  const { lang, setLang } = useWizard();
  const tagline = tenant.tagline?.[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-card)/85 pt-[max(0.75rem,env(safe-area-inset-top,0px))] backdrop-blur-md">
      <div className="wizard-shell flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Image
            src={tenant.logoSrc}
            alt={tenant.logoAlt}
            width={120}
            height={40}
            className="h-8 w-auto max-w-[140px] shrink-0 object-contain object-left"
            priority
          />
          {tagline ? (
            <span className="hidden text-xs text-(--color-muted-foreground) sm:inline">
              {tagline}
            </span>
          ) : null}
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
