/**
 * Shared training login uses a short username. Internally we map it to a
 * synthetic email for `tenant_users` so Auth.js JWT + middleware stay unchanged.
 * Do not add `@temp.training.local` addresses to ADMIN_EMAILS or Google ACLs.
 */
const TRAINING_TENANT_EMAIL_DOMAIN = "temp.training.local";

const USERNAME_PATTERN = /^[a-z0-9_-]{3,32}$/;

export function normalizeTrainingUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidTrainingUsername(normalized: string): boolean {
  return USERNAME_PATTERN.test(normalized);
}

export function trainingTenantUserEmail(normalizedUsername: string): string {
  return `${normalizedUsername}@${TRAINING_TENANT_EMAIL_DOMAIN}`;
}
