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
  colorsPath: "/tenants/maxi-zoo/colors.json",
  defaultLang: "nl",
  listedOnArchive: true,
  openaiEnvKey: "OPENAI_API_KEY__MAXI_ZOO",
};
