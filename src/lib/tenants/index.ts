import { demoTenant } from "./demo";
import { maxiZooTenant } from "./maxi-zoo";
import type { TenantConfig, TenantSlug } from "./types";

const TENANTS: TenantConfig[] = [demoTenant, maxiZooTenant];

const bySlug = new Map<string, TenantConfig>(
  TENANTS.map((t) => [t.slug, t]),
);

/** Slugs allowed on tenant routes — used by middleware (Edge-safe). */
export const TENANT_SLUGS: TenantSlug[] = TENANTS.map((t) => t.slug);

export function listTenants(): TenantConfig[] {
  return TENANTS.filter((t) => t.listedOnArchive);
}

export function getTenant(slug: string): TenantConfig | undefined {
  return bySlug.get(slug);
}

export function isTenantSlug(slug: string): slug is TenantSlug {
  return bySlug.has(slug);
}

export type { TenantConfig, TenantSlug } from "./types";
export type { TenantColorScheme } from "./colors";
export { loadTenantColorScheme, tenantColorSchemeSchema } from "./colors";
