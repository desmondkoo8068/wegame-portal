"use client";
/**
 * StoreContent: turns the /api/store request status into UI.
 *
 *   idle / loading -> <StoreSkeleton> (same shapes as the real layout, so
 *                     nothing jumps when the content arrives)
 *   failed         -> error message with 重试
 *   succeeded      -> the real sections
 *
 * 游戏推荐 is not in here: it has its own request and its own states.
 */
import { useStorefront } from "@/lib/useStorefront";
import ErrorState from "@/components/ui/ErrorState";
import BannerCarousel from "./BannerCarousel";
import ReleaseTimeline from "./ReleaseTimeline";
import ReservationGrid from "./ReservationGrid";
import RankingBoard from "./RankingBoard";

export default function StoreContent() {
  const { status, data, error, retry } = useStorefront();

  if (status === "failed") {
    return (
      <div className="container-page">
        <ErrorState title="商店内容加载失败" message={error ?? "请稍后重试。"} onRetry={retry} />
      </div>
    );
  }

  if (!data) return <StoreSkeleton />;

  return (
    <>
      <BannerCarousel banners={data.banners} />
      <ReleaseTimeline days={data.releaseDays} />
      <ReservationGrid reservations={data.reservations} />
      <RankingBoard rankings={data.rankings} />
    </>
  );
}

/** Grey placeholder blocks shaped like the banner and the first section. */
function StoreSkeleton() {
  return (
    <div role="status" aria-label="加载中">
      <div className="container-page grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_234px]">
        <div className="skeleton aspect-[4/3] rounded-lg sm:aspect-[946/504]" />
        <div className="hidden flex-col justify-between lg:flex">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="flex h-[66px] items-center gap-3 px-2.5">
              <div className="skeleton size-11 shrink-0" />
              <div className="skeleton h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="container-page mt-12 lg:mt-16">
        <div className="skeleton mb-5 h-8 w-40" />
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="skeleton h-60 w-[168px] shrink-0 lg:h-80 lg:w-56" />
          ))}
        </div>
      </div>
    </div>
  );
}
