"use client";
/**
 * ReleaseTimeline (新游发布): games grouped by date in a sideways-scrolling
 * row, with ‹ › arrows on the section heading.
 *
 * - The group whose date is today gets a 今天 badge and its tagline.
 * - On first render the row scrolls so recent/upcoming dates are in view,
 *   like the live site (which opens a couple of days before "today").
 */
import { useEffect } from "react";
import Image from "next/image";
import type { Release, ReleaseDay } from "@/data/store";
import { useHorizontalScroll } from "@/lib/useHorizontalScroll";
import Offer from "./Offer";
import StoreSection, { ScrollArrows } from "./StoreSection";

/** Today as "MM-DD", matching the data's date format. */
function todayKey() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function ReleaseTimeline({ days }: { days: ReleaseDay[] }) {
  const { ref, canPrev, canNext, scrollPrev, scrollNext } = useHorizontalScroll();
  // This component only renders in the browser after the data has loaded,
  // so reading the clock here can't cause a server/client mismatch.
  const today = todayKey();

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    // First group dated today or later ("MM-DD" strings sort like dates
    // within a year). Start one group earlier so there's some context.
    const upcoming = days.findIndex((day) => day.date >= today);
    const start = Math.max(0, (upcoming === -1 ? days.length : upcoming) - 2);
    const target = row.children[start] as HTMLElement | undefined;
    // `row` is position:relative, so offsetLeft is measured from its edge.
    if (target) row.scrollLeft = target.offsetLeft;
  }, [days, today, ref]);

  return (
    <StoreSection
      id="releases"
      title="新游发布"
      more
      actions={
        <ScrollArrows
          label="新游发布"
          canPrev={canPrev}
          canNext={canNext}
          onPrev={scrollPrev}
          onNext={scrollNext}
        />
      }
    >
      <ul ref={ref} className="no-scrollbar relative flex snap-x gap-5 overflow-x-auto pb-2">
        {days.map((day) => {
          const isToday = day.date === today;
          return (
            <li key={day.date} className="shrink-0 snap-start">
              <p className="mb-4 flex h-9 items-center gap-2 border-b border-line pb-3">
                <time className="text-xl font-bold tabular-nums text-white">{day.date}</time>
                {isToday && (
                  <>
                    <span className="rounded-sm bg-brand px-1.5 text-xs font-bold leading-5 text-black">
                      今天
                    </span>
                    {day.highlight && (
                      <span className="ml-2 hidden text-sm text-muted sm:inline">
                        {day.highlight}
                      </span>
                    )}
                  </>
                )}
              </p>
              <ul className="flex gap-5">
                {day.releases.map((release) => (
                  <li key={release.id}>
                    <ReleaseCard release={release} />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </StoreSection>
  );
}

function ReleaseCard({ release }: { release: Release }) {
  const isLive = release.status === "现已上线";
  return (
    <a href="#" className="group block">
      {/* Fixed height, width by cover type: posters are narrow, live games wide. */}
      <div
        className={`relative h-60 overflow-hidden rounded bg-raised lg:h-80 ${
          release.wide ? "w-[350px] lg:w-[468px]" : "w-[168px] lg:w-56"
        }`}
      >
        <Image
          src={release.cover}
          alt=""
          fill
          sizes={release.wide ? "468px" : "224px"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className={`mt-4 text-xs font-bold ${isLive ? "text-brand" : "text-white/70"}`}>
        {release.status}
      </p>
      <h3 className="mt-1.5 max-w-56 truncate font-bold text-white">{release.name}</h3>
      <Offer offer={release.detail} className="mt-1.5 block" />
    </a>
  );
}
