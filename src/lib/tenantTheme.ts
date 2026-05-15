import type { CSSProperties } from "react";
import type { TenantConfig } from "@/lib/tenants/types";

export function tenantThemeStyle(tenant: TenantConfig): CSSProperties | undefined {
  const t = tenant.theme;
  if (!t) return undefined;

  const vars: Record<string, string> = {};
  if (t.primary) vars["--color-primary"] = t.primary;
  if (t.primaryForeground) vars["--color-primary-foreground"] = t.primaryForeground;
  if (t.accent) vars["--color-accent"] = t.accent;
  if (t.accentForeground) vars["--color-accent-foreground"] = t.accentForeground;

  if (Object.keys(vars).length === 0) return undefined;
  return vars as CSSProperties;
}
