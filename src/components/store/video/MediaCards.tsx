/**
 * Cards for the 直播与视频 page: VideoCard (uploaded videos) and LiveCard
 * (streams that are live now). Both end with a GameChip that links the
 * clip to its game, like the live site.
 *
 * These are plain presentational components (no state, no hooks), so they
 * render on the server and ship no JavaScript.
 */
import Image from "next/image";
import type { ReactNode } from "react";
import type { LiveStream, VideoGame, VideoItem } from "@/data/storeVideo";
import { platformNames } from "@/data/storeVideo";
import { formatCount } from "@/lib/format";
import { EyeIcon, PlayIcon } from "@/components/ui/Icons";

/** Thumbnail frame shared by both card types: image, zoom on hover, overlay slot. */
function Thumb({ src, sizes, children }: { src: string; sizes: string; children: ReactNode }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded bg-raised">
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Bottom shade so the white counters stay readable on bright images. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
      {children}
    </div>
  );
}

/** "[icon] 狩  大逃杀 · 动作格斗" */
export function GameChip({ game }: { game: VideoGame }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-sm bg-white/5 py-1 pl-1 pr-2 text-xs">
      <Image
        src={game.icon}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 rounded-sm object-cover"
      />
      <span className="shrink-0 font-bold text-white">{game.name}</span>
      <span className="truncate text-muted">{game.tags.join(" · ")}</span>
    </span>
  );
}

interface VideoCardProps {
  video: VideoItem;
  /** Large cards get a bigger title. */
  size?: "md" | "lg";
  /** Shows a 1, 2, 3… badge (本周热门). */
  rank?: number;
  sizes?: string;
}

export function VideoCard({
  video,
  size = "md",
  rank,
  sizes = "(min-width: 1024px) 300px, 50vw",
}: VideoCardProps) {
  return (
    <a href="#" className="group block">
      <Thumb src={video.thumb} sizes={sizes}>
        {rank !== undefined && (
          <span className="absolute left-2 top-0 bg-brand px-2 pb-1 pt-0.5 text-sm font-black text-black [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]">
            {rank}
          </span>
        )}
        <span className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-bold text-white">
          <PlayIcon width={16} height={16} />
          {formatCount(video.views)}
        </span>
        <span className="absolute bottom-2 right-2 text-xs text-white/80">{video.duration}</span>
      </Thumb>

      <h3
        className={`mt-3 truncate font-bold text-white ${size === "lg" ? "text-base" : "text-sm"}`}
      >
        {video.title}
      </h3>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
        <span className="rounded-sm border border-pink-400/70 px-0.5 text-[9px] font-bold leading-3 text-pink-400">
          UP
        </span>
        <span className="truncate">{video.author}</span>
        <span aria-hidden="true">·</span>
        <time className="shrink-0">{video.date}</time>
      </p>
      <div className="mt-2">
        <GameChip game={video.game} />
      </div>
    </a>
  );
}

export function LiveCard({
  stream,
  sizes = "(min-width: 1024px) 400px, 50vw",
}: {
  stream: LiveStream;
  sizes?: string;
}) {
  return (
    <a href="#" className="group block">
      <Thumb src={stream.thumb} sizes={sizes}>
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-sm bg-red-600 px-1.5 text-xs font-bold leading-5 text-white">
          {/* Three bars bouncing: a "live" equaliser. */}
          <span aria-hidden="true" className="flex h-2.5 items-end gap-px">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-0.5 animate-pulse bg-white"
                style={{
                  height: `${50 + i * 25}%`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </span>
          直播
        </span>
        <span className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-bold text-white">
          <EyeIcon width={16} height={16} />
          {formatCount(stream.viewers)}
        </span>
      </Thumb>

      <h3 className="mt-3 truncate text-sm font-bold text-white">{stream.title}</h3>
      <p className="mt-1.5 truncate text-xs text-muted">
        {stream.streamer} · {platformNames[stream.platform]}
      </p>
      <div className="mt-2">
        <GameChip game={stream.game} />
      </div>
    </a>
  );
}
