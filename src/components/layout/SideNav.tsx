"use client";
/**
 * SideNav: the fixed "01 大作 … 05 高校" navigation on the right edge
 * (desktop only), plus a back-to-top button.
 *
 * It reads ui.activePage from Redux (kept up to date by <PageTracker>) and
 * highlights the group that page belongs to. Links are plain in-page anchors
 * (#topic etc.), so they work without JavaScript and scroll smoothly via CSS.
 */
import Image from "next/image";
import { navForPage, pages, sideNav } from "@/data/home";
import { useAppSelector } from "@/store/hooks";

/** First page of each nav group = where its link scrolls to. */
const targetFor = (navId: string) => pages.find((page) => page.nav === navId)?.id ?? navId;

export default function SideNav() {
  const activePage = useAppSelector((state) => state.ui.activePage);
  const activeNav = navForPage(activePage);

  return (
    <nav
      aria-label="页面导航"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
    >
      <ol className="flex flex-col items-end gap-5">
        {sideNav.map((item) => {
          const isActive = item.id === activeNav;
          return (
            <li key={item.id}>
              <a
                href={`#${targetFor(item.id)}`}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-center gap-2 font-mono text-xs font-bold transition-colors ${
                  isActive ? "text-brand" : "text-white/50 hover:text-white"
                }`}
              >
                {/* Label slides out on hover, and stays visible when active. */}
                <span
                  className={`font-sans transition-all duration-300 ${
                    isActive
                      ? "opacity-100"
                      : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                <span className={`flex items-center gap-1.5`}>
                  {item.num}
                  <span
                    className={`h-px transition-all duration-300 ${isActive ? "w-6 bg-brand" : "w-3 bg-white/40"}`}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      <a
        href="#kv"
        aria-label="回到顶部"
        className={`mt-4 transition-opacity duration-300 hover:opacity-80 ${
          activePage === "kv" ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        tabIndex={activePage === "kv" ? -1 : 0}
      >
        <Image src="/wegame/icon-gototop.png" alt="" width={80} height={80} className="size-10" />
      </a>
    </nav>
  );
}
