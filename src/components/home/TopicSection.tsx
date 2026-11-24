"use client";
/**
 * TopicSection: "01 大作" – the blockbuster games poster wall.
 *
 * Data: game posters come from Redux (loaded from /api/games), so this
 * section shows real loading (skeletons) and error (retry) states.
 *
 * Layout:
 *   - Desktop: posters float around the title at fixed "slots" on the
 *     1440x900 stage, larger ones in front, smaller ones fading into depth.
 *   - Mobile/tablet: two rows of posters scrolling sideways (marquee).
 * In the middle, a ticker cycles 追火爆的 → 尝新鲜的 → 搜想玩的.
 */
import Image from "next/image";
import type { Game } from "@/data/games";
import ErrorState from "@/components/ui/ErrorState";
import { Stage, StageItem } from "@/components/ui/Stage";
import { useCarousel } from "@/lib/useCarousel";
import { useGames } from "@/lib/useGames";
import { revealDelay } from "@/lib/style";
import { useAppSelector } from "@/store/hooks";
import { selectAllGames } from "@/store/slices/gamesSlice";
import PageSection from "./PageSection";

/**
 * Where posters sit on the desktop stage (design px). Order = game order.
 * Bigger posters feel closer; `depth` lowers opacity for far-away ones.
 */
const slots = [
  { x: 40, y: 70, w: 210 },
  { x: 60, y: 540, w: 230, depth: 0 },
  { x: 1190, y: 60, w: 210 },
  { x: 1160, y: 520, w: 240 },
  { x: 300, y: 300, w: 140, depth: 1 },
  { x: 990, y: 300, w: 150, depth: 1 },
  { x: 340, y: 620, w: 160, depth: 1 },
  { x: 940, y: 620, w: 150, depth: 1 },
  { x: 280, y: 40, w: 120, depth: 2 },
  { x: 1040, y: 50, w: 120, depth: 2 },
  { x: 540, y: 660, w: 110, depth: 2 },
  { x: 790, y: 670, w: 110, depth: 2 },
  { x: 170, y: 380, w: 100, depth: 2 },
  { x: 1300, y: 380, w: 100, depth: 2 },
  { x: 660, y: 30, w: 90, depth: 3 },
];
const depthOpacity = ["opacity-100", "opacity-80", "opacity-60", "opacity-40"];

const tickerTags = [
  { src: "/wegame/topic-hot.svg", alt: "追火爆的" },
  { src: "/wegame/topic-new.svg", alt: "尝新鲜的" },
  { src: "/wegame/topic-search.svg", alt: "搜想玩的" },
];

export default function TopicSection() {
  const { status, retry } = useGames();
  const games = useAppSelector(selectAllGames);

  return (
    <PageSection id="topic" label="01 大作云集 总有新东西" className="py-16 lg:py-0">
      {/* Orange diagonal glow behind everything */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgb(255_129_17/0.35),transparent)]" />

      {/* ---------- Desktop poster wall ---------- */}
      <Stage className="hidden lg:block">
        {status === "succeeded"
          ? games.slice(0, slots.length).map((game, i) => (
              <StageItem key={game.id} {...slots[i]} className={depthOpacity[slots[i].depth ?? 0]}>
                <div
                  className="reveal animate-float"
                  // Different delays/durations so posters don't bob in sync.
                  style={{
                    ...revealDelay(i * 60),
                    animationDelay: `${(i % 5) * -1.2}s`,
                    animationDuration: `${5 + (i % 4)}s`,
                  }}
                >
                  <Poster game={game} sizes="16vw" />
                </div>
              </StageItem>
            ))
          : slots.map((slot, i) => (
              <StageItem key={i} {...slot}>
                <div
                  className={`aspect-[760/1000] rounded-md ${
                    status === "failed" ? "border border-dashed border-line" : "skeleton"
                  }`}
                />
              </StageItem>
            ))}
      </Stage>

      {/* ---------- Title + ticker (all sizes) ---------- */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-4 lg:absolute lg:inset-x-0 lg:top-[calc(50%-312*var(--dp))] lg:gap-[calc(20*var(--dp))]">
        <h2 className="reveal w-[80%] max-w-[600px] lg:w-[calc(900*var(--dp))] lg:max-w-none">
          <Image
            src="/wegame/section-title-01.svg"
            alt="大作云集"
            width={1200}
            height={120}
            className="h-auto w-full"
          />
        </h2>
        <Image
          src="/wegame/section-subtitle-01.svg"
          alt="总有新东西"
          width={1200}
          height={80}
          className="reveal h-auto w-[80%] max-w-[600px] lg:w-[calc(900*var(--dp))] lg:max-w-none"
          style={revealDelay(150)}
        />
        <div className="reveal mt-4 lg:mt-[calc(100*var(--dp))]" style={revealDelay(300)}>
          <TopicTicker />
        </div>
        {status === "failed" && (
          <ErrorState compact message="游戏列表加载失败" onRetry={retry} className="mt-4 w-72" />
        )}
      </div>

      {/* ---------- Mobile/tablet marquee ---------- */}
      <div className="relative mt-10 flex flex-col gap-3 lg:hidden">
        {status === "succeeded" ? (
          <>
            <PosterMarquee games={games.slice(0, 8)} />
            <PosterMarquee games={games.slice(7)} reverse />
          </>
        ) : (
          <div className="flex gap-3 overflow-hidden px-4" aria-busy={status !== "failed"}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton aspect-[760/1000] w-28 shrink-0 sm:w-36" />
            ))}
          </div>
        )}
      </div>
    </PageSection>
  );
}

function Poster({ game, sizes }: { game: Game; sizes: string }) {
  return (
    <Image
      src={game.poster}
      alt={game.title}
      width={760}
      height={1000}
      sizes={sizes}
      className="h-auto w-full rounded-md shadow-2xl shadow-black/60 transition-transform duration-300 hover:scale-105"
    />
  );
}

/** Rotating tag in the centre: slides vertically through the three tags. */
function TopicTicker() {
  const { index } = useCarousel(tickerTags.length, { interval: 2500 });

  return (
    <div
      className="relative h-[60px] w-[240px] overflow-hidden rounded-full border border-brand/60 bg-page/80 lg:h-[calc(66*var(--dp))] lg:w-[calc(262*var(--dp))]"
      aria-live="polite"
    >
      <div
        className="transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${index * 100}%)`, height: "100%" }}
      >
        {tickerTags.map((tag, i) => (
          <div key={tag.src} className="flex h-full items-center justify-center px-6">
            <Image
              src={tag.src}
              alt={tag.alt}
              aria-hidden={i !== index}
              width={272}
              height={60}
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
    </div>
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
            <Poster game={game} sizes="144px" />
          </li>
        ))}
      </ul>
    </div>
  );
}
