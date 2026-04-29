"use client";

import { DotLottieReact, type Layout } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const FALLBACK = "/ai-assistant-robot.png";
const DEFAULT_LOTTIE_SRC = "/lottie/ai-assistant-robot.lottie";

/** Keep the full comp in the canvas and pin the character to the bottom (like object-bottom). */
const LOTTIE_LAYOUT: Layout = { fit: "contain", align: [0.5, 1] };

/** Floating launcher: square from md and up (mobile uses a compact icon in the panel) */
const FAB_SIZE_CLASS = "h-[24rem] w-[24rem] min-h-0 min-w-0";

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

const FAB_PX = 384; // 24rem at 16px root, for Next/Image

const dimensions: Record<
  AssistantRobotLottieProps["variant"],
  { w: number; h: number; className: string; canvasClass: string }
> = {
  fab: {
    w: FAB_PX,
    h: FAB_PX,
    className: `${FAB_SIZE_CLASS} object-contain object-bottom`,
    canvasClass: "h-full w-full",
  },
  header: {
    w: 32,
    h: 38,
    className: "h-8 w-7 shrink-0 object-contain object-bottom",
    canvasClass: "h-8 w-7",
  },
  empty: {
    w: 96,
    h: 80,
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
  const isFab = variant === "fab";

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
      className={`flex items-end justify-center overflow-hidden ${
        isFab ? FAB_SIZE_CLASS : ""
      } ${className}`}
      style={!isFab ? { width: dim.w, height: dim.h } : undefined}
    >
      <DotLottieReact
        src={src}
        loop
        autoplay
        layout={LOTTIE_LAYOUT}
        className={dim.canvasClass}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        renderConfig={{ autoResize: true }}
      />
    </div>
  );
}
