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
