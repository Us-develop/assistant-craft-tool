"use client";

import { TENANT_HEADER } from "@/lib/tenants/resolve";

/**
 * Client-side fetch that attaches the current tenant slug for API routes.
 */
export function apiFetch(
  tenantSlug: string,
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set(TENANT_HEADER, tenantSlug);
  return fetch(input, { ...init, headers });
}
