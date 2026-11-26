"use client";
/**
 * TopicSection: "01 大作" – blockbuster posters flying past the title.
 *
 * Data: posters come from Redux (loaded from /api/games), so the section has
 * real loading (placeholder cards) and error (retry) states.
 *
 * In the middle, a pill cycles 搜想玩的 → 追火爆的 → 尝新鲜的.
 * Motion is all CSS (TopicSection.module.css); this file is only markup.
 */
import Image from "next/image";
import type { Game } from "@/data/games";
import ErrorState from "@/components/ui/ErrorState";
import Price from "@/components/ui/Price";
import { useGames } from "@/lib/useGames";
import { useAppSelector } from "@/store/hooks";
import { selectAllGames } from "@/store/slices/gamesSlice";
import PageSection from "./PageSection";
import styles from "./TopicSection.module.css";

/** Which game sits in each of the 16 slots (same order as the live wall). */
const wallOrder = [
  "lol", "df", "val", "cf", "dnf", "ca", "nba", "heping",
  "poe", "heishenhua", "mingchao", "sanguosha", "bt", "rainbow", "cala", "heping",
];

const keywords = [
  { src: "/wegame/topic-search.svg", alt: "搜想玩的" },
  { src: "/wegame/topic-hot.svg", alt: "追火爆的" },
  { src: "/wegame/topic-new.svg", alt: "尝新鲜的" },
];

export default function TopicSection() {
  const { status, retry } = useGames();
  const games = useAppSelector(selectAllGames);
  const byId = new Map(games.map((game) => [game.id, game]));
  const wall = wallOrder.map((id) => byId.get(id));
  const isLoading = status === "idle" || status === "loading";

  return (
    <PageSection id="topic" label="01 大作云集 总有新东西" className={styles.topic}>
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.main}>
        <h2 className={styles.title}>
          <Image src="/wegame/section-title-01.svg" alt="大作云集" width={1200} height={120} />
        </h2>
        <Image
          src="/wegame/section-subtitle-01.svg"
          alt="总有新东西"
          width={1200}
          height={80}
          className={styles.subtitle}
        />

        <div className={styles.ticker}>
          <span className="sr-only">{keywords.map((k) => k.alt).join("、")}</span>
          {keywords.map((keyword) => (
            <Image
              key={keyword.src}
              src={keyword.src}
              alt=""
              width={272}
              height={60}
              className={styles.key}
            />
          ))}
        </div>

        {status === "failed" && (
          <ErrorState compact message="游戏列表加载失败" onRetry={retry} className="z-20 mt-4 w-72" />
        )}

        {/* ---------- Desktop: flying poster wall ---------- */}
        <ul className={styles.posters} aria-busy={isLoading}>
          {wall.map((game, i) => (
            // A slot keeps its place (and animation) while data loads.
            <li key={i} className={styles.poster} aria-hidden={i === 15 || undefined}>
              {game ? (
                <Poster game={game} sizes="12vw" />
              ) : (
                status !== "failed" && <div className={`${styles.placeholder} skeleton`} />
              )}
            </li>
          ))}
        </ul>

        {/* ---------- Mobile/tablet: two marquee rows ---------- */}
        <div className={styles.marquee}>
          {status === "succeeded" ? (
            <>
              <PosterMarquee games={games.slice(0, 8)} />
              <PosterMarquee games={games.slice(7)} reverse />
            </>
          ) : (
            isLoading && (
              <div className="flex gap-3 overflow-hidden px-4" aria-busy="true">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="skeleton aspect-[760/1000] w-28 shrink-0 sm:w-36" />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </PageSection>
  );
}

/** One poster; its price (in the visitor's currency) shows on hover. */
function Poster({ game, sizes }: { game: Game; sizes: string }) {
  return (
    <figure className="relative h-full w-full">
      <Image
        src={game.poster}
        alt={game.title}
        width={760}
        height={1000}
        sizes={sizes}
        className={styles.image}
      />
      <figcaption className={styles.price}>
        <Price priceCny={game.priceCny} />
      </figcaption>
    </figure>
  );
}

/** Infinite sideways scroll: the list is rendered twice so it loops seamlessly. */
function PosterMarquee({ games, reverse = false }: { games: Game[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <ul
        className="flex w-max animate-marquee gap-3"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...games, ...games].map((game, i) => (
          // Second copy is hidden from screen readers to avoid reading twice.
          <li key={`${game.id}-${i}`} aria-hidden={i >= games.length} className="w-28 sm:w-36">
            <Image
              src={game.poster}
              alt={game.title}
              width={760}
              height={1000}
              sizes="144px"
              className="h-auto w-full rounded-md"
            />
            <p className="mt-1.5 text-center text-xs">
              <Price priceCny={game.priceCny} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
