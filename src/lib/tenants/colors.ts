import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, "Expected hex color (#RGB, #RRGGBB)");

/** Up to three brand colors, stored in `public/tenants/{slug}/colors.json`. */
export const tenantColorSchemeSchema = z
  .object({
    primary: hexColor.optional(),
    secondary: hexColor.optional(),
    accent: hexColor.optional(),
  })
  .strict();

export type TenantColorScheme = z.infer<typeof tenantColorSchemeSchema>;

export function tenantColorsPath(slug: string): string {
  return path.join(process.cwd(), "public", "tenants", slug, "colors.json");
}

/** Load `public/tenants/{slug}/colors.json`. Returns null if missing or invalid. */
export async function loadTenantColorScheme(slug: string): Promise<TenantColorScheme | null> {
  try {
    const raw = await readFile(tenantColorsPath(slug), "utf8");
    const parsed = tenantColorSchemeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.warn(`Invalid colors.json for tenant "${slug}":`, parsed.error.flatten());
      return null;
    }
    const { primary, secondary, accent } = parsed.data;
    if (!primary && !secondary && !accent) return null;
    return parsed.data;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn(`Could not read colors for tenant "${slug}":`, err);
    }
    return null;
  }
}
