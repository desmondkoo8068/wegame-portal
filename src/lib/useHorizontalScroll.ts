"use client";
/**
 * useHorizontalScroll: prev/next arrows for a sideways-scrolling row.
 *
 *   const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll();
 *   <ul ref={ref} className="overflow-x-auto">...</ul>
 *
 * The row itself scrolls natively (touch swipe, trackpad, shift+wheel all
 * work); the arrows just call scrollBy(). canPrev / canNext let the arrows
 * disable themselves at either end.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalScroll<T extends HTMLElement = HTMLUListElement>() {
  const ref = useRef<T>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /** Re-read the scroll position and update which arrows are usable. */
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // 1px tolerance: scrollLeft can be fractional on high-DPI screens.
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    // `passive` tells the browser we never call preventDefault(),
    // so scrolling stays smooth.
    el.addEventListener("scroll", update, { passive: true });
    // The row's size changes with the window (and as images load).
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  /** Scroll by most of a screenful, keeping a little overlap for context. */
  const scrollByPage = (direction: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return {
    ref,
    canPrev,
    canNext,
    scrollPrev: () => scrollByPage(-1),
    scrollNext: () => scrollByPage(1),
  };
}
