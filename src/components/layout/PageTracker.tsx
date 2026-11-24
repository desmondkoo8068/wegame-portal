"use client";
/**
 * PageTracker: watches which full-screen page is in view and stores it in
 * Redux (ui.activePage). Renders nothing.
 *
 * IntersectionObserver is a browser API that tells us when elements enter or
 * leave the viewport, without listening to every scroll event.
 *
 * rootMargin "-50% 0px -50% 0px" shrinks the observed area to a single
 * horizontal line across the middle of the screen, so exactly one page
 * "intersects" at a time: the one covering the centre of the viewport.
 */
import { useEffect } from "react";
import type { PageId } from "@/data/home";
import { useAppDispatch } from "@/store/hooks";
import { setActivePage } from "@/store/slices/uiSlice";

export default function PageTracker() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const pages = document.querySelectorAll<HTMLElement>("[data-page]");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            dispatch(setActivePage(entry.target.getAttribute("data-page") as PageId));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    pages.forEach((page) => observer.observe(page));
    return () => observer.disconnect();
  }, [dispatch]);

  return null;
}
