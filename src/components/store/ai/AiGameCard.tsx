"use client";
/**
 * AiGameCard: one game in the AI 游戏 list.
 *
 *   ┌─────────────┬──────────────┐
 *   │ cover image │ AI 机制 list  │   hover / focus / click a screenshot
 *   │ name ★8.1   │ ┌──┐ ┌──┐    │   on the right to show it in the big
 *   │ brief, tags │ └──┘ └──┘    │   cover on the left
 *   └─────────────┴──────────────┘
 *
 * The cover pokes out above the card's top edge (negative margin), like the
 * live site. Only `active` (which image is big) is state, and it's local.
 */
import { useState } from "react";
import Image from "next/image";
import type { AiGame } from "@/data/storeAi";
import { AiTags, Mechanics, Rating } from "./AiBits";

export default function AiGameCard({ game }: { game: AiGame }) {
  const images = [game.cover, ...game.screenshots];
  const [active, setActive] = useState(0);
  // Indexes of images shown at least once. A big image is only rendered
  // (and downloaded) after its screenshot is first picked, so 14 cards
  // don't load 70 large images up front. Once loaded it stays, so
  // switching back is instant.
  const [seen, setSeen] = useState<number[]>([0]);

  const show = (i: number) => {
    setActive(i);
    setSeen((prev) => (prev.includes(i) ? prev : [...prev, i]));
  };

  return (
    <article className="mt-10 grid grid-cols-1 overflow-visible rounded-lg border border-white/10 bg-surface/80 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="px-5 pb-6 sm:px-10">
        <a
          href="#"
          className="relative -mt-9 block aspect-video overflow-hidden rounded bg-raised shadow-2xl shadow-black/60"
        >
          {images.map(
            (src, i) =>
              // Stacked images cross-fade with opacity.
              seen.includes(i) && (
                <Image
                  key={src}
                  src={src}
                  alt={i === 0 ? game.name : ""}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className={`object-cover transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-0"}`}
                />
              ),
          )}
        </a>

        <div className="mt-5 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-white sm:text-2xl">{game.name}</h3>
          {game.rating && <Rating rating={game.rating} />}
        </div>
        <p className="mt-2 text-[15px] text-muted">{game.brief}</p>
        <div className="mt-5">
          <AiTags game={game} />
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-b-lg bg-white/5 p-5 sm:p-7 lg:rounded-r-lg lg:rounded-bl-none">
        <Mechanics items={game.mechanics} />
        <ul className="mt-auto grid grid-cols-2 gap-3" aria-label={`${game.name} 截图`}>
          {game.screenshots.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                // +1 because image 0 is the cover.
                onMouseEnter={() => show(i + 1)}
                onFocus={() => show(i + 1)}
                onClick={() => show(i + 1)}
                aria-label={`在左侧查看截图 ${i + 1}`}
                aria-pressed={active === i + 1}
                className="relative block aspect-video w-full overflow-hidden rounded-sm ring-2 ring-transparent transition hover:ring-white/70 aria-pressed:ring-brand"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 230px, 45vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
