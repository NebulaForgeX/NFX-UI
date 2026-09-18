import type { AnimatedIconHandle } from "./types";

import { useCallback, useRef } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAnimatedIconTrigger() {
  const iconRef = useRef<AnimatedIconHandle>(null);

  const start = useCallback(() => {
    if (!prefersReducedMotion()) iconRef.current?.startAnimation();
  }, []);

  const stop = useCallback(() => {
    iconRef.current?.stopAnimation();
  }, []);

  const replay = useCallback(() => {
    if (prefersReducedMotion()) return;
    iconRef.current?.stopAnimation();
    iconRef.current?.startAnimation();
  }, []);

  return { iconRef, replay, start, stop };
}
