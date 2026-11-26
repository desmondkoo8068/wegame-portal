"use client";
/**
 * AiShowcase: the AI 游戏 page's top carousel. One featured game at a time:
 * a large image with a strip of screenshots under it, and the game's info,
 * AI mechanics and actions on the right. ‹ › and the dashes switch games.
 *
 * - Which game is showing: useCarousel (same hook as the home and store
 *   sliders), autoplay off, since there's a lot to read on each slide.
 * - Which screenshot is large: local useState in <Slide>. Giving <Slide>
 *   key={game.id} makes React create a fresh one per game, so the
 *   screenshot choice resets to the first image whenever the game changes.
 * - 预约: useReservation, the same Redux state as the store page's buttons.
 */
import { useState } from "react";
import Image from "next/image";
import type { AiGame } from "@/data/storeAi";
import { useCarousel } from "@/lib/useCarousel";
import { useReservation } from "@/lib/useStorefront";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@/components/ui/Icons";
import { AiTags, Mechanics } from "./AiBits";

export default function AiShowcase({ games }: { games: AiGame[] }) {
  const { index, goTo, next, prev } = useCarousel(games.length);
  const game = games[index];

  return (
    <section aria-roledescription="carousel" aria-label="AI 游戏推荐" className="container-page">
      <div className="rounded-lg border border-white/15 bg-black/40 p-4 backdrop-blur-sm sm:p-7">
        <Slide key={game.id} game={game} label={`${index + 1} / ${games.length}：${game.name}`} />
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="上一个游戏"
          className="grid size-7 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronLeftIcon width={16} height={16} strokeWidth={2.4} />
        </button>
        <div className="flex gap-1">
          {games.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`第 ${i + 1} 个：${g.name}`}
              aria-current={i === index}
              className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-3 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="下一个游戏"
          className="grid size-7 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ChevronRightIcon width={16} height={16} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  );
}

function Slide({ game, label }: { game: AiGame; label: string }) {
  const images = [game.cover, ...game.screenshots];
  const [active, setActive] = useState(0);
  const { isReserved, toggle } = useReservation(game.id);

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div>
        <div className="relative aspect-video overflow-hidden rounded bg-raised">
          <Image
            key={images[active]}
            src={images[active]}
            alt={`${game.name} 截图 ${active + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 730px, 100vw"
            className="animate-[fade-in_0.4s_ease] object-cover"
          />
        </div>
        <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto" aria-label="截图">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`查看截图 ${i + 1}`}
                aria-pressed={active === i}
                className="relative block aspect-video w-24 overflow-hidden rounded-sm opacity-60 ring-2 ring-transparent transition hover:opacity-100 aria-pressed:opacity-100 aria-pressed:ring-white sm:w-28"
              >
                <Image src={src} alt="" fill sizes="112px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <h3 className="text-2xl font-bold text-white sm:text-3xl">{game.name}</h3>
        <div className="mt-4">
          <AiTags game={game} max={4} />
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-white/70">{game.brief}</p>
        {/* Long lists scroll inside the box so the buttons stay in place. */}
        <Mechanics
          items={game.mechanics}
          className="no-scrollbar mt-6 max-h-48 overflow-y-auto rounded bg-white/5 p-4"
        />

        <div className="mt-6 grid grid-cols-2 gap-4 lg:mt-auto lg:pt-6">
          <a href="#" className="btn-primary py-3 text-base">
            立即抢号
          </a>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={isReserved}
            className={`btn-glass py-3 text-base ${isReserved ? "text-brand" : ""}`}
          >
            {isReserved ? (
              <CheckIcon width={20} height={20} strokeWidth={2.4} />
            ) : (
              <HeartIcon width={20} height={20} />
            )}
            {isReserved ? "已预约" : "预约"}
          </button>
        </div>
      </div>
    </div>
  );
}
