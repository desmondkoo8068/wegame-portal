"use client";
/**
 * FeatureSection: "03 助手" – a three-slide carousel of in-game assistant
 * features (点位教学 / 符文与装备推荐 / AI 游戏助手).
 *
 * Behaviour comes from the useCarousel hook; this file is only markup:
 *   - autoplays every 7s, but only while this page is on screen
 *   - pauses on hover/focus; ← → keys switch tabs; swipe on touch screens
 *   - the active tab shows a progress bar that fills until the next slide
 *   - accessible tabs pattern: role=tablist/tab/tabpanel + aria-selected
 *
 * Slides cross-fade (all stacked, only the active one visible). Each slide
 * describes its own desktop layout with stage coordinates.
 */
import Image from "next/image";
import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { Stage, StageItem } from "@/components/ui/Stage";
import { useCarousel } from "@/lib/useCarousel";
import { useAppSelector } from "@/store/hooks";
import PageSection from "./PageSection";

const INTERVAL_MS = 7000;
const SWIPE_THRESHOLD = 50;

interface Art {
  src: string;
  width: number;
  height: number;
  /** Desktop stage position (design px). */
  at: { x: number; y: number; w: number };
  alt?: string;
}

interface Slide {
  id: string;
  tab: string;
  background: string;
  texture: string;
  subtitle: Art;
  title: Art;
  /** Screenshots and character art, back to front. */
  art: Art[];
  /** Optional icon list (AI slide). */
  points?: Art[];
}

const svgTitle = (src: string, alt: string, x: number, y: number, h = 120): Art => ({
  src,
  alt,
  width: 1200,
  height: h,
  at: { x, y, w: 900 },
});

const slides: Slide[] = [
  {
    id: "aim",
    tab: "点位教学",
    background: "/wegame/feature-bg-1.png",
    texture: "/wegame/feature-texture-1.png",
    subtitle: svgTitle("/wegame/feature-subtitle-1.svg", "无畏契约助手", 117, 200),
    title: svgTitle("/wegame/feature-title-3.svg", "点位教学", 117, 250),
    art: [
      {
        src: "/wegame/feature-role-1.png",
        width: 1166,
        height: 1000,
        at: { x: 700, y: 110, w: 780 },
      },
      {
        src: "/wegame/feature-inner-1.png",
        width: 1341,
        height: 822,
        alt: "无畏契约点位教学界面",
        at: { x: 117, y: 370, w: 640 },
      },
    ],
  },
  {
    id: "build",
    tab: "符文与装备推荐",
    background: "/wegame/feature-bg-2.png",
    texture: "/wegame/feature-texture-2.png",
    subtitle: svgTitle("/wegame/feature-subtitle-2.svg", "英雄联盟助手", 885, 200),
    title: svgTitle("/wegame/feature-title-4.svg", "符文与装备推荐", 885, 250),
    art: [
      {
        src: "/wegame/feature-role-2.png",
        width: 1524,
        height: 1045,
        at: { x: 0, y: 140, w: 1000 },
      },
      {
        src: "/wegame/feature-inner-2.png",
        width: 980,
        height: 1960,
        alt: "英雄联盟符文与装备推荐界面",
        at: { x: 885, y: 370, w: 300 },
      },
    ],
  },
  {
    id: "ai",
    tab: "AI 游戏助手",
    background: "/wegame/feature-bg-4.png",
    texture: "/wegame/feature-texture-4.png",
    subtitle: svgTitle("/wegame/feature-subtitle-4.svg", "AI 赋能好用好玩", 820, 200),
    title: svgTitle("/wegame/feature-title-6.svg", "智能有趣的 AI 助手", 820, 250, 160),
    art: [
      {
        src: "/wegame/feature-inner-4-bd.png",
        width: 850,
        height: 712,
        alt: "AI 本局复盘界面",
        at: { x: 117, y: 270, w: 560 },
      },
      {
        // The panel above is only a frame; its contents are a separate layer.
        src: "/wegame/feature-inner-4-bd-text.png",
        width: 761,
        height: 757,
        at: { x: 150, y: 300, w: 494 },
      },
      {
        src: "/wegame/feature-inner-4-hd.png",
        width: 351,
        height: 176,
        alt: "AI 本局复盘",
        at: { x: 90, y: 200, w: 300 },
      },
      {
        src: "/wegame/feature-ai-avatar.png",
        width: 1050,
        height: 1500,
        at: { x: 1160, y: 330, w: 220 },
      },
    ],
    points: [1, 2, 3].map((n) => ({
      src: `/wegame/feature-inner-4-info-${n}.svg`,
      width: 232,
      height: 64,
      alt: ["战报总结", "个人教练", "实时助手"][n - 1],
      at: { x: 820, y: 360 + n * 80, w: 232 },
    })),
  },
];

export default function FeatureSection() {
  const isActive = useAppSelector((state) => state.ui.activePage === "feature");
  const { index, goTo, next, prev, pause, resume, isPaused } = useCarousel(slides.length, {
    interval: INTERVAL_MS,
    enabled: isActive,
  });
  const swipeStartX = useRef<number | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  };
  const handlePointerUp = (event: PointerEvent) => {
    if (swipeStartX.current === null) return;
    const distance = event.clientX - swipeStartX.current;
    if (distance > SWIPE_THRESHOLD) prev();
    if (distance < -SWIPE_THRESHOLD) next();
    swipeStartX.current = null;
  };

  return (
    <PageSection id="feature" label="03 助手：游戏内外 全面助力" className="pb-10 lg:pb-0">
      <div
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        onPointerDown={(e) => (swipeStartX.current = e.clientX)}
        onPointerUp={handlePointerUp}
        className="relative flex h-full touch-pan-y flex-col"
      >
        {/* Mobile-only intro heading (desktop shows it in the side nav). */}
        <div className="order-first flex flex-col items-center gap-2 px-4 pb-6 pt-16 lg:hidden">
          <Image
            src="/wegame/feature-title-1.svg"
            alt="游戏内外"
            width={1200}
            height={120}
            className="h-auto w-[70%] max-w-[480px]"
          />
          <Image
            src="/wegame/feature-title-2.svg"
            alt="全面助力"
            width={1200}
            height={120}
            className="h-auto w-[70%] max-w-[480px]"
          />
        </div>

        {/* ---------- Slides ---------- */}
        <div className="relative grid flex-1">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              id={`feature-panel-${slide.id}`}
              role="tabpanel"
              aria-labelledby={`feature-tab-${slide.id}`}
              inert={i !== index}
              className={`col-start-1 row-start-1 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <SlideView slide={slide} />
            </div>
          ))}
        </div>

        {/* ---------- Tabs ---------- */}
        <div
          role="tablist"
          aria-label="助手功能"
          onKeyDown={handleKeyDown}
          className="relative order-first mx-4 mb-4 grid grid-cols-3 gap-2 lg:absolute lg:inset-x-0 lg:bottom-[calc(var(--stage-top)+40*var(--dp))] lg:order-none lg:mx-auto lg:mb-0 lg:w-[calc(900*var(--dp))] lg:gap-[calc(40*var(--dp))]"
        >
          {slides.map((slide, i) => {
            const selected = i === index;
            return (
              <button
                key={slide.id}
                id={`feature-tab-${slide.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`feature-panel-${slide.id}`}
                // Roving tabindex: only the selected tab is in the Tab order;
                // arrow keys move between tabs.
                tabIndex={selected ? 0 : -1}
                onClick={() => goTo(i)}
                className={`group flex flex-col items-center gap-1 pb-2 text-center transition-colors ${
                  selected ? "text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold lg:text-lg ${selected ? "text-brand" : ""}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-bold sm:text-sm lg:text-base">{slide.tab}</span>
                {/* Progress bar; `key` restarts the CSS animation on every slide change. */}
                <span className="mt-1 h-0.5 w-full overflow-hidden rounded bg-white/15">
                  {selected && (
                    <span
                      key={index}
                      className="block h-full origin-left bg-brand"
                      style={{
                        animation: `progress ${INTERVAL_MS}ms linear forwards`,
                        animationPlayState: isPaused || !isActive ? "paused" : "running",
                      }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </PageSection>
  );
}

/** One slide: background layers, then mobile (stacked) and desktop (stage) layouts. */
function SlideView({ slide }: { slide: Slide }) {
  const decorative = (art: Art) => art.alt ?? "";

  return (
    <div className="relative h-full min-h-[560px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.background})` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.texture})` }}
      />

      {/* Mobile / tablet: stacked */}
      <div className="relative flex flex-col items-center gap-3 px-4 py-6 lg:hidden">
        <Image
          src={slide.subtitle.src}
          alt={slide.subtitle.alt!}
          width={1200}
          height={120}
          className="h-auto w-[90%] max-w-[560px]"
        />
        <Image
          src={slide.title.src}
          alt={slide.title.alt!}
          width={1200}
          height={slide.title.height}
          className="h-auto w-[90%] max-w-[560px]"
        />
        {slide.points && (
          <div className="flex flex-wrap justify-center gap-2">
            {slide.points.map((point) => (
              <Image
                key={point.src}
                src={point.src}
                alt={point.alt!}
                width={232}
                height={64}
                className="h-auto w-28"
              />
            ))}
          </div>
        )}
        <div className="flex w-full max-w-[560px] items-end justify-center gap-2">
          {slide.art.map((art) => (
            <Image
              key={art.src}
              src={art.src}
              alt={decorative(art)}
              width={art.width}
              height={art.height}
              sizes="50vw"
              className="h-auto max-h-[260px] w-auto max-w-[60%] object-contain"
            />
          ))}
        </div>
      </div>

      {/* Desktop: stage layout */}
      <Stage className="hidden lg:block">
        {slide.art.map((art) => (
          <StageItem key={art.src} {...art.at}>
            <Image
              src={art.src}
              alt={decorative(art)}
              width={art.width}
              height={art.height}
              sizes="55vw"
              className="h-auto w-full drop-shadow-2xl"
            />
          </StageItem>
        ))}
        <StageItem {...slide.subtitle.at}>
          <Image
            src={slide.subtitle.src}
            alt={slide.subtitle.alt!}
            width={1200}
            height={120}
            className="h-auto w-full"
          />
        </StageItem>
        <StageItem {...slide.title.at}>
          <h3>
            <Image
              src={slide.title.src}
              alt={slide.title.alt!}
              width={1200}
              height={slide.title.height}
              className="h-auto w-full"
            />
          </h3>
        </StageItem>
        {slide.points?.map((point) => (
          <StageItem key={point.src} {...point.at}>
            <Image
              src={point.src}
              alt={point.alt!}
              width={232}
              height={64}
              className="h-auto w-full"
            />
          </StageItem>
        ))}
      </Stage>
    </div>
  );
}
