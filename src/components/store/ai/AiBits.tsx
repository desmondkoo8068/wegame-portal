/**
 * Small pieces shared by the AI 游戏 page's carousel and list:
 * the "AI 原生" badge, the rating, the tag chips and the AI 机制 list.
 */
import Image from "next/image";
import type { AiGame } from "@/data/storeAi";

/** The live site's "Ai原生" badge image. */
export function NativeBadge() {
  return (
    <Image
      src="/wegame/store/ai/native-tag.png"
      alt="AI 原生"
      title="AI 原生：AI 是这款游戏的核心玩法"
      width={123}
      height={32}
      className="h-8 w-auto"
    />
  );
}

/** "期待值 ★8.1" or "评分 ★8.9" */
export function Rating({ rating }: { rating: NonNullable<AiGame["rating"]> }) {
  return (
    <p className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-white">
      {rating.label}
      <span className="flex items-center gap-0.5 text-lg italic text-brand">
        <span aria-hidden="true">★</span>
        {rating.value.toFixed(1)}
      </span>
    </p>
  );
}

/** Badge (if AI-native) followed by up to `max` tags. */
export function AiTags({ game, max = 6 }: { game: AiGame; max?: number }) {
  return (
    <ul className="flex flex-wrap items-center gap-2.5" aria-label="标签">
      {game.native && (
        <li>
          <NativeBadge />
        </li>
      )}
      {game.tags.slice(0, max).map((tag) => (
        <li key={tag} className="rounded-sm bg-white/10 px-2.5 text-sm leading-8 text-white/90">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** "AI 机制" heading + bullet list. */
export function Mechanics({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={className}>
      <h4 className="text-base font-bold text-white/80">AI 机制</h4>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/90">
            <span aria-hidden="true" className="font-bold text-brand">
              ›
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
