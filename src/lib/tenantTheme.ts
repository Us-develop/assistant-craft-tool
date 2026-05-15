import type { CSSProperties } from "react";
import type { TenantColorScheme } from "@/lib/tenants/colors";

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    return {
      r: parseInt(normalized[0] + normalized[0], 16),
      g: parseInt(normalized[1] + normalized[1], 16),
      b: parseInt(normalized[2] + normalized[2], 16),
    };
  }
  if (normalized.length === 6) {
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }
  return null;
}

/** Pick white or black text for readable contrast on a solid brand color. */
export function contrastForeground(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "#ffffff";
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.55 ? "#191a1b" : "#ffffff";
}

/**
 * Maps up to three tenant colors onto wizard CSS variables:
 * - primary → buttons, progress, links, focus ring
 * - secondary → soft panels / secondary surfaces
 * - accent → highlights and accent surfaces
 */
export function tenantThemeStyle(colors: TenantColorScheme | null): CSSProperties | undefined {
  if (!colors) return undefined;

  const vars: Record<string, string> = {};

  if (colors.primary) {
    vars["--color-primary"] = colors.primary;
    vars["--color-primary-foreground"] = contrastForeground(colors.primary);
    vars["--color-ring"] = colors.primary;
  }

  if (colors.secondary) {
    vars["--color-secondary"] = colors.secondary;
    vars["--color-secondary-foreground"] = contrastForeground(colors.secondary);
    vars["--color-muted"] = colors.secondary;
  }

  if (colors.accent) {
    vars["--color-accent"] = colors.accent;
    vars["--color-accent-foreground"] = contrastForeground(colors.accent);
  }

  if (Object.keys(vars).length === 0) return undefined;
  return vars as CSSProperties;
}
