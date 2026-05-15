import type { Lang } from "@/lib/wizardSchema";

export type TenantSlug = "demo" | "maxi-zoo";

export type TenantTheme = {
  primary?: string;
  primaryForeground?: string;
  accent?: string;
  accentForeground?: string;
};

export type TenantConfig = {
  slug: TenantSlug;
  name: string;
  description: { nl: string; en: string };
  tagline?: { nl: string; en: string };
  logoSrc: string;
  logoAlt: string;
  theme?: TenantTheme;
  defaultLang?: Lang;
  listedOnArchive: boolean;
  archiveBadge?: { nl: string; en: string };
  openaiEnvKey: string;
};
