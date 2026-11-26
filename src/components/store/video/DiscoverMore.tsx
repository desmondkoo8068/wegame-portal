"use client";
/**
 * DiscoverMore (发现更多): browse every stream or video, filtered by game.
 *
 * State: which tab (直播 / 视频) and which game is selected. Only this
 * component uses it, so it's local useState, not Redux. (Redux is for
 * state that several components share.)
 *
 * The game filter chips are *derived* from the data with useMemo instead
 * of being hard-coded, so a chip can never point at a game with no cards,
 * and adding a stream for a new game adds its chip automatically.
 */
import { useMemo, useState } from "react";
import type { LiveStream, VideoItem } from "@/data/storeVideo";
import { LiveCard, VideoCard } from "./MediaCards";

type Tab = "live" | "video";
const ALL = "全部";

const tabs: { id: Tab; label: string }[] = [
  { id: "live", label: "直播" },
  { id: "video", label: "视频" },
];

interface DiscoverMoreProps {
  streams: LiveStream[];
  videos: VideoItem[];
}

export default function DiscoverMore({ streams, videos }: DiscoverMoreProps) {
  const [tab, setTab] = useState<Tab>("live");
  const [game, setGame] = useState(ALL);

  const items = tab === "live" ? streams : videos;

  // Unique game names in this tab, in order of first appearance.
  const games = useMemo(() => [ALL, ...new Set(items.map((item) => item.game.name))], [items]);

  const visible = game === ALL ? items : items.filter((item) => item.game.name === game);

  const switchTab = (next: Tab) => {
    setTab(next);
    // The other tab may not have the selected game, so reset the filter.
    setGame(ALL);
  };

  return (
    <section aria-labelledby="discover-heading" className="container-page mt-12 lg:mt-16">
      <div className="mb-5 flex items-end gap-6">
        <h2 id="discover-heading" className="text-2xl font-bold text-white lg:text-[28px]">
          发现更多
        </h2>
        {/* Real tabs for screen readers: role=tablist / tab / tabpanel. */}
        <div role="tablist" aria-label="内容类型" className="flex gap-5 pb-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`discover-tab-${id}`}
              aria-selected={tab === id}
              aria-controls="discover-panel"
              onClick={() => switchTab(id)}
              className="border-b-2 border-transparent pb-1 text-sm font-bold text-white/60 transition-colors hover:text-white aria-selected:border-brand aria-selected:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded bg-white/5 p-4">
        <span className="text-sm text-muted">游戏：</span>
        {games.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setGame(name)}
            aria-pressed={game === name}
            className="rounded-sm px-2.5 py-1 text-sm text-white/80 transition-colors hover:text-white aria-pressed:bg-white/10 aria-pressed:font-bold aria-pressed:text-brand"
          >
            {name}
          </button>
        ))}
      </div>

      <div
        id="discover-panel"
        role="tabpanel"
        aria-labelledby={`discover-tab-${tab}`}
        className="mt-6"
      >
        {/* aria-live announces the new result count after filtering. */}
        <p aria-live="polite" className="mb-4 text-sm text-muted">
          共 {visible.length} 个{tab === "live" ? "直播" : "视频"}
        </p>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.id}>
              {"viewers" in item ? (
                <LiveCard stream={item} />
              ) : (
                <VideoCard video={item} sizes="(min-width: 1024px) 400px, 50vw" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
