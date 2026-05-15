import type { TenantConfig } from "./types";

export const maxiZooTenant: TenantConfig = {
  slug: "maxi-zoo",
  name: "Maxi Zoo",
  description: {
    nl: "Assistant Craft Tool voor Maxi Zoo — op maat van hun merk.",
    en: "Assistant Craft Tool for Maxi Zoo — tailored to their brand.",
  },
  tagline: {
    nl: "Samen sterker voor dieren",
    en: "Stronger together for animals",
  },
  logoSrc: "/tenants/maxi-zoo/logo.svg",
  logoAlt: "Maxi Zoo",
  theme: {
    primary: "#006B3F",
    primaryForeground: "#ffffff",
    accent: "#E8F5E9",
    accentForeground: "#006B3F",
  },
  defaultLang: "nl",
  listedOnArchive: true,
  openaiEnvKey: "OPENAI_API_KEY__MAXI_ZOO",
};
