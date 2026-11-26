"use client";
/**
 * BannerCarousel: the store's hero. One large slide on the left and, on
 * desktop, a menu of all 7 games on the right with a progress bar under
 * the active one (on mobile the menu becomes dots).
 *
 * All the timing logic (autoplay, wrap-around, pause on hover, reduced
 * motion) comes from the same useCarousel hook as the home page's feature
 * slider. This component is only markup.
 *
 * Slides are stacked on top of each other and cross-fade with opacity.
 * Hidden slides get `inert`, so keyboard and screen-reader users only
 * reach the visible one.
 */
import Image from "next/image";
import type { Banner } from "@/data/store";
import { useCarousel } from "@/lib/useCarousel";
import { useReservation } from "@/lib/useStorefront";
import { CheckIcon } from "@/components/ui/Icons";

const INTERVAL = 5000;

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const { index, goTo, isPaused, pause, resume } = useCarousel(banners.length, {
    interval: INTERVAL,
  });

  return (
    <section
      aria-roledescription="carousel"
      aria-label="精选推荐"
      // Pause while the pointer is over it or keyboard focus is inside it,
      // so a slide never changes under someone who's reading or clicking.
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className="container-page grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_234px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-raised sm:aspect-[946/504]">
        {banners.map((banner, i) => (
          <Slide
            key={banner.id}
            banner={banner}
            isActive={i === index}
            label={`${i + 1} / ${banners.length}：${banner.name}`}
            priority={i === 0}
          />
        ))}
      </div>

      {/* Desktop: game menu with progress bar */}
      <ul className="hidden flex-col justify-between lg:flex">
        {banners.map((banner, i) => {
          const isActive = i === index;
          return (
            <li key={banner.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={isActive}
                className={`relative flex h-[66px] w-full items-center gap-3 overflow-hidden rounded px-2.5 text-left transition-colors ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Image
                  src={banner.icon}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-md"
                />
                <span className="truncate text-sm font-bold text-white">{banner.name}</span>
                {isActive && (
                  // `key` restarts the CSS animation whenever the slide changes.
                  <span
                    key={index}
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand"
                    style={{
                      animation: `progress ${INTERVAL}ms linear forwards`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Mobile/tablet: dots */}
      <div className="flex justify-center gap-2 lg:hidden">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`第 ${i + 1} 张：${banner.name}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-brand" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

interface SlideProps {
  banner: Banner;
  isActive: boolean;
  label: string;
  priority: boolean;
}

function Slide({ banner, isActive, label, priority }: SlideProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      inert={!isActive}
      className={`absolute inset-0 transition-opacity duration-700 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={banner.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 950px, 100vw"
        className="object-cover"
      />
      {/* Dark fade from the bottom-left so white text stays readable. */}
      <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/20 to-transparent" />

      <Image
        src={banner.logo}
        alt=""
        width={500}
        height={200}
        className="absolute left-5 top-5 h-12 w-auto max-w-[45%] object-contain object-left sm:left-10 sm:top-8 sm:h-20"
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
        <p className="text-xs font-bold text-white/60">{banner.theme}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-2xl">
          {banner.title}
          <span className="hidden sm:block">{banner.subtitle}</span>
        </h3>

        <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
          {banner.tags.map((tag, i) => (
            <span
              key={tag}
              className={`rounded-sm bg-white/10 px-2 py-0.5 text-xs font-bold backdrop-blur-sm ${
                i === 0 ? "text-brand" : "text-white"
              }`}
            >
              {tag}
            </span>
          ))}
          {banner.score !== undefined && (
            <span className="rounded-sm bg-white/10 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
              评分 {banner.score.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-4">
          {banner.cta === "预约" ? (
            <ReserveCta gameId={banner.id} />
          ) : (
            <a href="#" className="btn-glass bg-white/85 px-6 text-black hover:bg-white">
              {banner.cta}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** The banner's 预约 button. Shares state with the reservation cards. */
function ReserveCta({ gameId }: { gameId: string }) {
  const { isReserved, toggle } = useReservation(gameId);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isReserved}
      className={`btn-glass px-6 ${
        isReserved
          ? "bg-brand text-white hover:bg-brand-hover"
          : "bg-white/85 text-black hover:bg-white"
      }`}
    >
      {isReserved && <CheckIcon width={16} height={16} strokeWidth={2.4} />}
      {isReserved ? "已预约" : "预约"}
    </button>
  );
}
