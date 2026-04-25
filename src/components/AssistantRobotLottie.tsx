"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const FALLBACK = "/ai-assistant-robot.png";
const DEFAULT_LOTTIE_SRC = "/lottie/ai-assistant-robot.lottie";

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

function resolveLottieSrc(): string {
  const u = process.env.NEXT_PUBLIC_ASSISTANT_LOTTIE_URL;
  if (typeof u === "string" && u.length > 0) {
    return u;
  }
  return DEFAULT_LOTTIE_SRC;
}

export type AssistantRobotLottieProps = {
  /** Shorthand sizes used by the AI panel */
  variant: "fab" | "header" | "empty";
  className?: string;
};

const dimensions: Record<
  AssistantRobotLottieProps["variant"],
  { w: number; h: number; className: string; canvasClass: string }
> = {
  fab: {
    w: 90,
    h: 108,
    className: "h-[5.25rem] w-full max-w-[4.5rem] object-contain object-bottom",
    canvasClass: "h-full w-full max-h-[5.25rem]",
  },
  header: {
    w: 32,
    h: 38,
    className: "h-8 w-7 shrink-0 object-contain object-bottom",
    canvasClass: "h-8 w-7",
  },
  empty: {
    h: 80,
    w: 96,
    className: "h-16 w-auto object-contain object-bottom",
    canvasClass: "h-16 w-20",
  },
};

/**
 * Renders the assistant bot from `public/lottie/ai-assistant-robot.lottie` (dotLottie).
 * Override with `NEXT_PUBLIC_ASSISTANT_LOTTIE_URL` (JSON or .lottie URL). Reduced motion: PNG fallback.
 */
export default function AssistantRobotLottie({ variant, className = "" }: AssistantRobotLottieProps) {
  const reducedMotion = usePrefersReducedMotion();
  const dim = dimensions[variant];
  const src = resolveLottieSrc();

  if (reducedMotion) {
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
      className={`flex items-end justify-center overflow-hidden ${className}`}
      style={{ width: dim.w, height: dim.h }}
    >
      <DotLottieReact
        src={src}
        loop
        autoplay
        className={dim.canvasClass}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        renderConfig={{ autoResize: true }}
      />
    </div>
  );
}
