import type { Lang } from "@/lib/wizardSchema";

export type TenantSlug = "demo" | "maxi-zoo";

export type TenantConfig = {
  slug: TenantSlug;
  name: string;
  description: { nl: string; en: string };
  tagline?: { nl: string; en: string };
  logoSrc: string;
  logoAlt: string;
  /** Brand colors live in `public/tenants/{slug}/colors.json` (up to 3 hex values). */
  colorsPath: string;
  defaultLang?: Lang;
  listedOnArchive: boolean;
  archiveBadge?: { nl: string; en: string };
  openaiEnvKey: string;
};
