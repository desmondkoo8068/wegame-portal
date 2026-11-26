/**
 * 直播与视频 (/store/video): a recreation of wegame.com.cn/store/game_video.html.
 *
 * Unlike /store, this page doesn't fetch on the client: the content is
 * static, so this Server Component reads it straight from src/data and the
 * HTML arrives complete (no loading state needed, nothing to fail). Only
 * DiscoverMore, which has filters, is a Client Component.
 *
 * Sections: featured grid · 新游新情报 · 正在热播 · 本周热门 · 发现更多
 */
import type { Metadata } from "next";
import { featuredIds, liveStreams, newsIds, videos, weeklyIds } from "@/data/storeVideo";
import StorePageHeader from "@/components/store/StorePageHeader";
import StoreSection from "@/components/store/StoreSection";
import { LiveCard, VideoCard } from "@/components/store/video/MediaCards";
import DiscoverMore from "@/components/store/video/DiscoverMore";

export const metadata: Metadata = {
  title: "直播与视频 - WeGame游戏商店",
  description: "新游预告、热门视频与正在直播的游戏内容。",
};

/** Look up videos by id. Each video is stored once and reused across sections. */
const byIds = (ids: string[]) => ids.map((id) => videos.find((video) => video.id === id)!);

export default function VideoPage() {
  const featured = byIds(featuredIds);
  const [newsLead, ...newsRest] = byIds(newsIds);
  const weekly = byIds(weeklyIds);

  return (
    <main>
      <StorePageHeader
        title="直播与视频"
        titleImage="/wegame/store/video/title.png"
        backdrop="/wegame/store/video/head-bg.jpg"
      />

      {/* Featured: 2 large cards, then a row of 4. */}
      <section aria-label="精选视频" className="container-page">
        <ul className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((video, i) => (
            <li key={video.id} className={i < 2 ? "lg:col-span-2" : ""}>
              <VideoCard
                video={video}
                size={i < 2 ? "lg" : "md"}
                sizes={i < 2 ? "(min-width: 1024px) 600px, 50vw" : undefined}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* One lead video spanning 2x2 cells, four smaller ones beside it. */}
      <StoreSection id="news" title="新游新情报，一键观看">
        <ul className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <li className="sm:col-span-2 lg:row-span-2">
            <VideoCard video={newsLead} size="lg" sizes="(min-width: 1024px) 600px, 100vw" />
          </li>
          {newsRest.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      </StoreSection>

      <StoreSection id="live-now" title="正在热播">
        <ul className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {liveStreams.slice(0, 4).map((stream) => (
            <li key={stream.id}>
              <LiveCard stream={stream} sizes="(min-width: 1024px) 300px, 50vw" />
            </li>
          ))}
        </ul>
      </StoreSection>

      <StoreSection id="weekly" title="本周热门">
        <ol className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {weekly.map((video, i) => (
            <li key={video.id}>
              <VideoCard video={video} rank={i + 1} />
            </li>
          ))}
        </ol>
      </StoreSection>

      <DiscoverMore streams={liveStreams} videos={videos} />
    </main>
  );
}
