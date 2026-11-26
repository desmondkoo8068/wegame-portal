"use client";
/**
 * PageFlow: drives the home page "slideshow". Renders nothing.
 *
 * Two modes, picked by FULL_PAGE_QUERY (the same rule as the live site:
 * at least 1280px wide and a landscape shape between 25:18 and 5:2):
 *
 *   Full-page mode: the page doesn't scroll. All sections sit on top of each
 *     other and only the active one is visible (CSS cross-fade). The mouse
 *     wheel, keyboard and touch swipes move one step at a time through Redux
 *     (scrollPage). Like the live site, the wheel is throttled to one step
 *     per 1.5s, so one flick of a trackpad doesn't skip several pages.
 *
 *   Scroll mode (phones, tablets, square-ish screens): a normal long page.
 *     An IntersectionObserver reports which section covers the middle of the
 *     screen, so entrance animations still play as you scroll.
 *
 * The CSS for the layout lives in globals.css under the same media query,
 * so the first paint is already right; this component only adds behaviour.
 */
import { useEffect, useRef } from "react";
import { pages, type PageId } from "@/data/home";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { goToPage, scrollPage, setFullPage } from "@/store/slices/uiSlice";

/** Keep in sync with the `fp` variant in globals.css. */
export const FULL_PAGE_QUERY =
  "(min-width: 1280px) and (min-aspect-ratio: 25/18) and (max-aspect-ratio: 5/2)";

const WHEEL_LOCK_MS = 1500; // live site's throttle
const KEY_LOCK_MS = 700; // a bit longer than the 0.5s cross-fade
const SWIPE_MIN_PX = 50;

export default function PageFlow() {
  const dispatch = useAppDispatch();
  const isFullPage = useAppSelector((s) => s.ui.isFullPage);
  const activePage = useAppSelector((s) => s.ui.activePage);
  // Modals/menus own the wheel and keyboard while they're open.
  const isOverlayOpen = useAppSelector((s) => s.ui.isLocaleModalOpen || s.ui.isMobileMenuOpen);
  // Event listeners read these through refs, so they don't need re-adding.
  const overlayRef = useRef(isOverlayOpen);
  const activeRef = useRef(activePage);
  useEffect(() => {
    overlayRef.current = isOverlayOpen;
    activeRef.current = activePage;
  }, [isOverlayOpen, activePage]);

  /* ---------- 1. Which mode? (follows window resizes) ---------- */
  useEffect(() => {
    const media = window.matchMedia(FULL_PAGE_QUERY);
    const update = () => dispatch(setFullPage(media.matches));
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      dispatch(setFullPage(false)); // leaving the home page
    };
  }, [dispatch]);

  /* ---------- 2. Deep links: /#university opens that page ---------- */
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (pages.some((page) => page.id === id)) dispatch(goToPage(id as PageId));
  }, [dispatch]);

  /* ---------- 3. Full-page mode: wheel, keys, swipes ---------- */
  useEffect(() => {
    if (!isFullPage) return;
    let lockedUntil = 0;

    /** Move one step, unless a previous step is still playing. */
    const step = (direction: 1 | -1, lockMs: number) => {
      const now = Date.now();
      if (now < lockedUntil || overlayRef.current) return;
      lockedUntil = now + lockMs;
      dispatch(scrollPage(direction));
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 4) return; // ignore tiny trackpad jitter
      step(event.deltaY > 0 ? 1 : -1, WHEEL_LOCK_MS);
    };

    const onKey = (event: KeyboardEvent) => {
      // Don't steal keys from text fields, buttons (Space) or shortcuts.
      const target = event.target as HTMLElement;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (target.closest("input, textarea, select, [contenteditable], [role='tablist']")) return;

      const forward = ["ArrowDown", "PageDown", " "].includes(event.key);
      const back = ["ArrowUp", "PageUp"].includes(event.key);
      if (event.key === " " && target.closest("button, a")) return;

      if (forward || back) {
        event.preventDefault();
        step(forward ? 1 : -1, KEY_LOCK_MS);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        dispatch(goToPage(event.key === "Home" ? pages[0].id : pages[pages.length - 1].id));
      }
    };

    // Touch screens on big landscape displays: swipe up = next page.
    let touchStartY: number | null = null;
    const onTouchStart = (event: TouchEvent) => (touchStartY = event.touches[0].clientY);
    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const distance = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(distance) > SWIPE_MIN_PX) step(distance > 0 ? 1 : -1, KEY_LOCK_MS);
      touchStartY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isFullPage, dispatch]);

  /* ---------- 4. Full-page mode: footer height for the last page ---------- */
  // The last page is "WEGAME MORE" + the site footer. The footer is pinned
  // to the bottom, and the MORE banner fills the space above it, so CSS needs
  // the footer's real height (it changes with the window width).
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (!isFullPage || !footer) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() =>
      root.style.setProperty("--footer-h", `${footer.offsetHeight}px`),
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--footer-h");
    };
  }, [isFullPage]);

  /* ---------- 5. Scroll mode: track the section in the middle ---------- */
  useEffect(() => {
    if (isFullPage) return;
    const sections = document.querySelectorAll<HTMLElement>("[data-page]");
    // rootMargin shrinks the viewport to a line across its middle, so exactly
    // one section "intersects" at a time.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            dispatch(goToPage(entry.target.getAttribute("data-page") as PageId));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isFullPage, dispatch]);

  /* ---------- 6. Switching to scroll mode: keep the same section in view ---------- */
  useEffect(() => {
    if (isFullPage || activeRef.current === "kv") return;
    document.getElementById(activeRef.current)?.scrollIntoView({ behavior: "instant" });
  }, [isFullPage]);

  return null;
}
