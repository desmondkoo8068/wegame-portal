"use client";
/**
 * SideNav: the fixed "01 … 05" column on the right edge, and the TOP button
 * in the bottom-right corner. Only shown in full-page mode (`fp:` variant),
 * like the live site.
 *
 * Each item shows its number; the current page (and a hovered one) swaps
 * the number for its name (大作, 焕新 …). Items are real links (#topic), so
 * they also work without JavaScript; with it, a click moves the slideshow
 * through Redux instead of jumping to the anchor.
 */
import type { MouseEvent } from "react";
import { sideNav, type PageId } from "@/data/home";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { goToPage } from "@/store/slices/uiSlice";

export default function SideNav() {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.ui.activePage);

  const go = (page: PageId) => (event: MouseEvent) => {
    event.preventDefault();
    dispatch(goToPage(page));
  };

  return (
    <>
      <nav
        aria-label="页面导航"
        className="fixed right-0 top-1/2 z-30 hidden w-[calc(0.8*var(--u))] -translate-y-1/2 fp:block"
      >
        <ol>
          {sideNav.map((item) => {
            const isActive = item.page === activePage;
            return (
              <li key={item.page}>
                <a
                  href={`#${item.page}`}
                  onClick={go(item.page)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${item.num} ${item.label}`}
                  // Number and label share one spot; CSS cross-fades them.
                  className="group relative flex h-[calc(0.64*var(--u))] items-center justify-center text-white"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute font-num text-[calc(0.18*var(--u))] transition-opacity duration-200 ${
                      isActive ? "opacity-0" : "opacity-30 group-hover:opacity-0"
                    }`}
                  >
                    {item.num}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute text-[calc(0.14*var(--u))] font-bold transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Back to the first page; hidden while already there. */}
      <a
        href="#kv"
        onClick={go("kv")}
        aria-label="回到顶部"
        tabIndex={activePage === "kv" ? -1 : 0}
        className={`fixed bottom-[calc(0.2*var(--u))] right-[calc(0.2*var(--u))] z-30 hidden size-[calc(0.4*var(--u))] bg-[url(/wegame/icon-gototop.png)] bg-contain bg-no-repeat transition-opacity duration-200 hover:opacity-100 fp:block ${
          activePage === "kv" ? "pointer-events-none opacity-0" : "opacity-30"
        }`}
      />
    </>
  );
}
