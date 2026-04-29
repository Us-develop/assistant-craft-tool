"use client";

import clsx from "clsx";
import ContextDocumentUpload from "./ContextDocumentUpload";
import { WizardFieldError } from "./WizardFieldNotice";
import { useWizard, useWizardStepField } from "./WizardContext";
import { tr } from "@/lib/translations";

const DOMAINS = ["email", "social", "paid", "content", "brand", "conversion"] as const;

const DOMAIN_ICONS: Record<(typeof DOMAINS)[number], string> = {
  email: "mail",
  social: "share",
  paid: "campaign",
  content: "article",
  brand: "diamond",
  conversion: "edit_note",
};

export default function Step1Domain() {
  const { lang, data, updateData } = useWizard();
  const domainF = useWizardStepField("domain");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-semibold sm:text-2xl">{tr("step1.title", lang)}</h2>
        <p className="text-(--color-muted-foreground)">{tr("step1.subtitle", lang)}</p>
      </div>

      <ContextDocumentUpload
        lang={lang}
        documents={data.contextDocuments}
        onChange={(contextDocuments) => updateData({ contextDocuments })}
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {DOMAINS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => updateData({ domain: d, customDomain: "" })}
              className={clsx(
                "selection-card flex flex-col items-center gap-3 text-center",
                data.domain === d && "active",
                domainF.invalid && "selection-card-validation-invalid",
              )}
            >
              <span className="material-icons-outlined text-3xl text-(--color-primary)">
                {DOMAIN_ICONS[d]}
              </span>
              <span className="text-sm font-medium">{tr(`step1.domains.${d}`, lang)}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-(--color-muted-foreground)">
            {tr("step1.customLabel", lang)}
          </label>
          <input
            type="text"
            className={clsx(
              "input-field",
              domainF.invalid && "wizard-field-invalid",
            )}
            placeholder={tr("step1.customPlaceholder", lang)}
            value={data.customDomain}
            onChange={(e) => updateData({ customDomain: e.target.value, domain: "" })}
          />
        </div>
        <WizardFieldError message={domainF.message} />
      </div>

      <div className="info-box">
        <p className="text-sm">{tr("step1.info", lang)}</p>
        <p className="mt-3 border-t border-(--color-border) pt-3 text-sm">
          {tr("step1.guideTip", lang)}
        </p>
      </div>
    </div>
  );
}
