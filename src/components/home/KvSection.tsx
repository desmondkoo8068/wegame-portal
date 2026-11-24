"use client";
/**
 * KvSection: the full-screen hero ("key visual") at the top of the page.
 *
 * Layers, back to front:
 *   1. background video (AutoVideo handles loading/error/pausing)
 *   2. dark tint + orange light + digital "code" texture at the bottom
 *   3. the slogan, which cross-fades between "轻装上阵 3.0" and "一起更好玩"
 *   4. download button and a "scroll down" arrow
 *
 * The slogan rotation reuses the same useCarousel hook as the 03 slider.
 */
import Image from "next/image";
import AutoVideo from "@/components/ui/AutoVideo";
import { DownloadIcon } from "@/components/ui/Icons";
import { useCarousel } from "@/lib/useCarousel";
import PageSection from "./PageSection";

const slogans = [
  { src: "/wegame/slogan-3.0.svg", alt: "轻装上阵 WeGame 3.0" },
  { src: "/wegame/slogan-2.0.svg", alt: "一起更好玩" },
];

export default function KvSection() {
  const { index } = useCarousel(slogans.length, { interval: 5000 });

  return (
    <PageSection
      id="kv"
      label="WeGame 3.0 轻装上阵"
      // Pulled up under the sticky header so the video fills the first screen.
      className="-mt-[var(--header-h)] h-[85svh] min-h-[520px] lg:h-svh lg:min-h-[640px]"
    >
      <AutoVideo src="/wegame/video/kv.mp4" poster="/wegame/video/kv-poster.jpg" pageId="kv" />

      {/* Decorative layers */}
      <div className="absolute inset-0 bg-black/30" />
      <Image
        src="/wegame/kv-code.svg"
        alt=""
        width={1920}
        height={635}
        className="absolute bottom-0 left-0 w-full opacity-60"
      />
      <Image
        src="/wegame/kv-light.svg"
        alt=""
        width={2376}
        height={700}
        className="absolute -bottom-[10%] left-1/2 w-[130%] max-w-none -translate-x-1/2"
      />

      <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-6 px-4 lg:bottom-[calc(60*var(--dp))] lg:gap-[calc(30*var(--dp))]">
        {/* Cross-fading slogans stacked in one grid cell. */}
        <div className="grid w-full max-w-[640px] lg:w-[calc(768*var(--dp))] lg:max-w-none">
          {slogans.map((slogan, i) => (
            <Image
              key={slogan.src}
              src={slogan.src}
              alt={i === index ? slogan.alt : ""}
              aria-hidden={i !== index}
              width={1024}
              height={160}
              priority={i === 0}
              className={`col-start-1 row-start-1 h-auto w-full transition-opacity duration-1000 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <a href="#" className="btn-angled">
          <DownloadIcon width={20} height={20} />
          下载客户端
        </a>

        <a href="#topic" aria-label="向下滚动" className="hidden text-white lg:block">
          <svg
            viewBox="0 0 24 24"
            width={32}
            height={32}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="animate-nudge"
            aria-hidden="true"
          >
            <path d="M6 6l6 6 6-6M6 12l6 6 6-6" />
          </svg>
        </a>
      </div>
    </PageSection>
  );
}
