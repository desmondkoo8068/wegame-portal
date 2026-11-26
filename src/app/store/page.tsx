/**
 * Store page (/store, 精选): a recreation of wegame.com.cn/store.
 *
 * Like the home page, this file stays a Server Component and only arranges
 * sections (the sub-nav comes from ./layout.tsx). The data-driven parts are
 * Client Components that load through Redux (storefrontSlice):
 *   StoreContent    -> GET /api/store                  (banner … 排行榜)
 *   Recommendations -> GET /api/store/recommendations/N (游戏推荐, paginated)
 */
import type { Metadata } from "next";
import StoreContent from "@/components/store/StoreContent";
import Recommendations from "@/components/store/Recommendations";

export const metadata: Metadata = {
  title: "WeGame游戏商店 - 一起更好玩",
  description: "WeGame 游戏商店：新游发布、预约、排行榜与游戏推荐。",
};

export default function StorePage() {
  return (
    <main>
      <h1 className="sr-only">WeGame 游戏商店</h1>
      <StoreContent />
      <Recommendations />
    </main>
  );
}
