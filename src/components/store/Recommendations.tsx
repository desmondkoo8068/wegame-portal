"use client";
/**
 * Recommendations (游戏推荐): an infinite-scrolling grid of game cards.
 *
 * Flow (pages load lazily, like the live site):
 *   sentinel near the viewport -> fetch the next page (page 1 first),
 *                                 appended to the grid
 *   loading          -> skeleton cards after the loaded ones
 *   failed           -> compact error + 重试; auto-loading stops
 *   no more pages    -> "已经到底啦"
 *
 * The "sentinel" is an empty div under the grid. An IntersectionObserver
 * tells us when it comes within 600px of the viewport. It may fire many
 * times, but fetchMoreRecommendations' `condition` ignores calls while a
 * page is loading or when there are no more pages, so this stays simple.
 *
 * This section loads independently from the rest of the store, so it still
 * works even if /api/store failed (and vice versa).
 */
import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Recommendation } from "@/data/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMoreRecommendations, selectRecommendations } from "@/store/slices/storefrontSlice";
import ErrorState from "@/components/ui/ErrorState";
import Offer from "./Offer";
import StoreSection from "./StoreSection";

const SKELETON_COUNT = 6;

export default function Recommendations() {
  const dispatch = useAppDispatch();
  const { items, status, error, hasMore } = useAppSelector(selectRecommendations);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load more when the sentinel nears the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    // After an error we wait for 重试 instead of retrying automatically.
    if (!sentinel || !hasMore || status === "failed") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) dispatch(fetchMoreRecommendations());
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // `items.length` is a dependency on purpose: a fresh observer reports
    // the sentinel's current position right away, so if a loaded page
    // didn't push it off screen, the next page loads too.
  }, [dispatch, hasMore, status, items.length]);

  return (
    <StoreSection id="recommendations" title="游戏推荐" subtitle="你可能会喜欢这些游戏~">
      <ul
        className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy={status === "loading"}
      >
        {items.map((game) => (
          <li key={game.id}>
            <RecommendationCard game={game} />
          </li>
        ))}
        {status === "loading" &&
          Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <li key={`skeleton-${i}`} aria-hidden="true">
              <div className="skeleton aspect-[387/216]" />
              <div className="skeleton mt-4 h-5 w-2/5" />
              <div className="skeleton mt-3 h-5 w-3/4" />
            </li>
          ))}
      </ul>

      {status === "failed" && error && (
        <ErrorState
          compact
          message={error}
          onRetry={() => dispatch(fetchMoreRecommendations())}
          className="mt-8"
        />
      )}

      {!hasMore && <p className="mt-10 text-center text-sm text-muted">已经到底啦～</p>}

      <div ref={sentinelRef} aria-hidden="true" />
    </StoreSection>
  );
}

function RecommendationCard({ game }: { game: Recommendation }) {
  return (
    <a href="#" className="group block">
      <div className="relative aspect-[387/216] overflow-hidden rounded bg-raised">
        <Image
          src={game.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 truncate font-bold text-white">{game.name}</h3>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="标签">
        {game.tags.map((tag) => (
          <li key={tag} className="rounded-sm bg-white/10 px-1.5 text-xs leading-6 text-white/70">
            {tag}
          </li>
        ))}
      </ul>
      <Offer offer={game.offer} className="mt-3 block" />
    </a>
  );
}
