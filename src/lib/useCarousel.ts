"use client";
/**
 * useCarousel: the logic behind any slider/tab rotator, without any markup.
 *
 *   const { index, goTo, next, prev, pause, resume } = useCarousel(3, { interval: 6000 });
 *
 * - wraps around at both ends
 * - optional autoplay that restarts after every slide change, so manual
 *   navigation always gets a full interval
 * - pause()/resume() for hover and keyboard focus
 * - no autoplay when the user prefers reduced motion
 *
 * Keeping logic in a hook and markup in components means the same behaviour
 * can drive very different looking sliders.
 */
import { useCallback, useEffect, useState } from "react";

interface Options {
  /** Autoplay delay in ms. Omit to disable autoplay. */
  interval?: number;
  /** Set false to stop autoplay from outside (e.g. section not visible). */
  enabled?: boolean;
}

export function useCarousel(count: number, { interval, enabled = true }: Options = {}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (!interval || !enabled || isPaused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
    // `index` is a dependency on purpose: each change restarts the timer.
  }, [index, interval, enabled, isPaused, count, next]);

  return {
    index,
    goTo,
    next,
    prev,
    isPaused,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  };
}
