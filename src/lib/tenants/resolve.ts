import { getTenant, isTenantSlug } from "./index";
import type { TenantConfig } from "./types";

export const TENANT_HEADER = "x-tenant-slug";

export function resolveTenantFromRequest(request: Request): TenantConfig | null {
  const raw = request.headers.get(TENANT_HEADER)?.trim();
  if (!raw || !isTenantSlug(raw)) return null;
  return getTenant(raw) ?? null;
}

export function requireTenantFromRequest(
  request: Request,
): TenantConfig | Response {
  const tenant = resolveTenantFromRequest(request);
  if (!tenant) {
    return Response.json(
      { error: "Missing or invalid tenant. Send the x-tenant-slug header." },
      { status: 400 },
    );
  }
  return tenant;
}
