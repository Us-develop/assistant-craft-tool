/**
 * Models often wrap JSON in ```json fences. Parse a string[] or fall back to safe line parsing.
 */
export function parseSuggestionsFromLlm(raw: string, max = 8): string[] {
  const text = raw.trim();
  if (!text) return [];

  const stripped = stripMarkdownCodeFence(text);

  const tryArray = (json: string): string[] | null => {
    try {
      const v = JSON.parse(json) as unknown;
      if (!Array.isArray(v)) return null;
      return v
        .filter((x): x is string => typeof x === "string")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length < 200 && isReasonablePill(s));
    } catch {
      return null;
    }
  };

  const direct = tryArray(stripped);
  if (direct?.length) {
    return dedupe(direct).slice(0, max);
  }

  const start = stripped.indexOf("[");
  const end = stripped.lastIndexOf("]");
  if (start !== -1 && end > start) {
    const slice = stripped.slice(start, end + 1);
    const inner = tryArray(slice);
    if (inner?.length) {
      return dedupe(inner).slice(0, max);
    }
  }

  const lines = stripped
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").replace(/^["']|["']$/g, "").trim())
    .filter((line) => isReasonablePill(line));

  return dedupe(lines).slice(0, max);
}

function stripMarkdownCodeFence(s: string): string {
  const t = s.trim();
  if (!t.startsWith("```")) {
    return t;
  }
  // Drop opening ``` or ```json line, then closing ```
  const afterOpen = t.replace(/^```(?:json)?\s*\r?\n?/i, "");
  return afterOpen.replace(/\r?\n?```\s*$/i, "").trim();
}

function isReasonablePill(s: string): boolean {
  if (s.length === 0 || s.length > 200) return false;
  if (/^```/.test(s)) return false;
  if (/^[\s`{}\[\],":0-9.-]+$/.test(s)) return false;
  if (s === "json" || s === "JSON") return false;
  return true;
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of items) {
    const k = x.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
}
