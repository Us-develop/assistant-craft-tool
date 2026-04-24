import type { LottieAnimData } from "./assistantRobotLottie";

const DEFAULT_PATH = "/lottie/ai-assistant-robot.json";

let cached: LottieAnimData | null | undefined;
let inflight: Promise<LottieAnimData | null> | null = null;

function resolveUrl(): string {
  if (
    typeof process !== "undefined" &&
    typeof process.env.NEXT_PUBLIC_ASSISTANT_LOTTIE_URL === "string" &&
    process.env.NEXT_PUBLIC_ASSISTANT_LOTTIE_URL.length > 0
  ) {
    return process.env.NEXT_PUBLIC_ASSISTANT_LOTTIE_URL;
  }
  return DEFAULT_PATH;
}

/**
 * Loads the assistant Lottie once; concurrent callers share the same promise and cached JSON.
 */
export function loadAssistantRobotLottieJson(): Promise<LottieAnimData | null> {
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }
  if (inflight) {
    return inflight;
  }
  inflight = fetch(resolveUrl())
    .then((r) => (r.ok ? (r.json() as Promise<LottieAnimData>) : Promise.resolve(null)))
    .then((j) => {
      cached = j;
      return j;
    })
    .catch(() => {
      cached = null;
      return null;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
