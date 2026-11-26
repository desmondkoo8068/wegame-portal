/**
 * Store layout: wraps every page under /store (精选, AI 游戏, 直播与视频).
 *
 * Next.js nests layouts automatically: the root layout (header + footer)
 * wraps this one, which wraps the current store page. So the store's own
 * sub-nav is written once here, and it stays mounted (no re-render, open
 * dropdown kept) when you switch between store pages.
 *
 * `isolate` starts a new stacking context, so a page's decorative backdrop
 * can use -z-10 to sit behind the nav without going behind the whole site.
 */
import type { ReactNode } from "react";
import StoreNav from "@/components/store/StoreNav";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate pb-20">
      <StoreNav />
      {children}
    </div>
  );
}
