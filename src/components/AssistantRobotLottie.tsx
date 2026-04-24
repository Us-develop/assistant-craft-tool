"use client";

import Image from "next/image";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  isLoopingMood,
  segmentForMood,
  type LottieAnimData,
  type RobotMood,
} from "@/lib/assistantRobotLottie";
import { loadAssistantRobotLottieJson } from "@/lib/assistantRobotLottieCache";

const FALLBACK = "/ai-assistant-robot.png";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export type AssistantRobotLottieProps = {
  mood: RobotMood;
  /** Shorthand sizes used by the AI panel */
  variant: "fab" | "header" | "empty";
  className?: string;
  onOneShotEnd?: () => void;
};

const dimensions: Record<
  AssistantRobotLottieProps["variant"],
  { w: number; h: number; className: string }
> = {
  fab: {
    w: 90,
    h: 108,
    className: "h-[5.25rem] w-auto max-w-[4.5rem] object-contain object-bottom",
  },
  header: { w: 32, h: 38, className: "h-8 w-7 shrink-0 object-contain object-bottom" },
  empty: { h: 80, w: 96, className: "h-16 w-auto object-contain object-bottom" },
};

/**
 * Renders the assistant mascot as Lottie (markers: idle, wave, smile, jump, pace).
 * Replace `public/lottie/ai-assistant-robot.json` with your LottieFiles export, or set
 * `NEXT_PUBLIC_ASSISTANT_LOTTIE_URL` to a hosted JSON.
 */
export default function AssistantRobotLottie({
  mood,
  variant,
  className = "",
  onOneShotEnd,
}: AssistantRobotLottieProps) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [animationData, setAnimationData] = useState<LottieAnimData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const moodRef = useRef(mood);
  const dataRef = useRef<LottieAnimData | null>(null);
  moodRef.current = mood;
  dataRef.current = animationData;

  const applyMood = useCallback((m: RobotMood, data: LottieAnimData) => {
    const inst = lottieRef.current;
    if (!inst?.playSegments) return;
    const item = inst.animationItem;
    if (item) {
      item.loop = isLoopingMood(m);
    }
    const [a, b] = segmentForMood(data, m);
    inst.stop();
    inst.playSegments([a, b], true);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    void loadAssistantRobotLottieJson().then((j) => {
      if (cancelled) return;
      if (j) setAnimationData(j);
      else setLoadFailed(true);
    });
    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!animationData || reducedMotion) return;
    requestAnimationFrame(() => applyMood(mood, animationData));
  }, [animationData, mood, applyMood, reducedMotion]);

  const handleComplete = useCallback(() => {
    if (isLoopingMood(moodRef.current)) return;
    onOneShotEnd?.();
  }, [onOneShotEnd]);

  const dim = dimensions[variant];
  if (reducedMotion || loadFailed || !animationData) {
    return (
      <Image
        src={FALLBACK}
        alt=""
        width={dim.w}
        height={dim.h}
        className={`${dim.className} ${className}`}
        unoptimized
      />
    );
  }

  return (
    <div
      className={`flex items-end justify-center ${className}`}
      style={{ width: dim.w, height: dim.h }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData as object}
        loop={false}
        className="h-full w-full [&_svg]:h-full [&_svg]:w-auto"
        onComplete={handleComplete}
        onDOMLoaded={() => {
          const d = dataRef.current;
          if (d) {
            requestAnimationFrame(() => applyMood(moodRef.current, d));
          }
        }}
      />
    </div>
  );
}
