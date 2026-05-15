import "server-only";

/**
 * SHA-256 hash (first 32 hex chars) of an IP address for light-touch pseudonymization
 * in the `ip_hash` column. Do not treat this as anonymization — correlate only
 * for abuse/duplicate detection, then discard.
 */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
