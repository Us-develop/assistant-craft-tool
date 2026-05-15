import type { TenantConfig } from "./types";

export const demoTenant: TenantConfig = {
  slug: "demo",
  name: "Demo",
  description: {
    nl: "Standaard Assistant Craft Tool — Us branding.",
    en: "Default Assistant Craft Tool — Us branding.",
  },
  tagline: {
    nl: "Co-creating digital impact",
    en: "Co-creating digital impact",
  },
  logoSrc: "/tenants/demo/logo.svg",
  logoAlt: "Us",
  colorsPath: "/tenants/demo/colors.json",
  defaultLang: "nl",
  listedOnArchive: true,
  archiveBadge: { nl: "Interne demo", en: "Internal demo" },
  openaiEnvKey: "OPENAI_API_KEY__DEMO",
};
