export type RobotMood = "idle" | "wave" | "smile" | "jump" | "pace";

type LottieMarker = { cm: string; tm: number; dr: number };

export type LottieAnimData = {
  ip: number;
  op: number;
  fr: number;
  markers?: LottieMarker[];
};

const MOOD_ORDER: RobotMood[] = ["idle", "wave", "smile", "jump", "pace"];

export function isLoopingMood(mood: RobotMood): boolean {
  return mood === "idle" || mood === "pace";
}

function markerSegment(data: LottieAnimData, mood: RobotMood): [number, number] | null {
  const list = data.markers;
  if (!list?.length) return null;
  const m = list.find((x) => x.cm === mood);
  if (!m) return null;
  const ip = Math.floor(data.ip);
  const opEnd = Math.floor(data.op) - 1;
  const start = Math.max(ip, Math.floor(m.tm));
  const end = Math.min(Math.max(start, Math.floor(m.tm + m.dr) - 1), opEnd);
  if (end < start) return null;
  return [start, end];
}

/**
 * If the JSON has no named markers, split the comp into five slices by frame range.
 */
function fallbackSegment(data: LottieAnimData, mood: RobotMood): [number, number] {
  const ip = Math.floor(data.ip);
  const opExcl = Math.floor(data.op);
  const total = Math.max(1, opExcl - ip);
  const slice = total / 5;
  const idx = MOOD_ORDER.indexOf(mood);
  const start = Math.floor(ip + idx * slice);
  const end = Math.min(Math.floor(start + slice) - 1, opExcl - 1);
  return [start, Math.max(start, end)];
}

export function segmentForMood(data: LottieAnimData, mood: RobotMood): [number, number] {
  return markerSegment(data, mood) ?? fallbackSegment(data, mood);
}
