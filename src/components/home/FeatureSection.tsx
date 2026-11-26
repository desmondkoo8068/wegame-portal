"use client";
/**
 * FeatureSection: "03 助手" – the in-game assistant features.
 *
 * Sequence (same timing as the live site), restarted each time the page
 * becomes active:
 *   intro (1s) → 点位教学 → 符文与装备推荐 → AI 游戏助手 → 点位教学 … (5s each)
 *
 * State is local (only this section cares): which slide shows, and whether
 * the intro is still playing its 0.5s exit. Each slide is rendered with a
 * `key`, so React mounts it fresh and its CSS entrance animations replay.
 *
 * Accessibility: real tabs (role=tablist/tab/tabpanel, ← → keys), and the
 * rotation pauses while keyboard focus is inside. (Not on hover: in
 * full-page mode the pointer is almost always over this page.)
 */
import Image from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";
import { featureSlides, type FeatureSlide } from "@/data/home";
import { useAppSelector } from "@/store/hooks";
import PageSection from "./PageSection";
import styles from "./FeatureSection.module.css";

const INTRO_MS = 1000;
const SLIDE_MS = 5000;
const INTRO_EXIT_MS = 500;
const INTRO = 0; // slide numbers: 0 = intro, 1..3 = featureSlides

export default function FeatureSection() {
  const isActive = useAppSelector((state) => state.ui.activePage === "feature");
  const [slide, setSlide] = useState(INTRO);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Leaving the page resets to the intro, so it replays next time.
  // (Adjusting state during render when a value changes is the React-
  // recommended alternative to an effect for this.)
  const [wasActive, setWasActive] = useState(isActive);
  if (isActive !== wasActive) {
    setWasActive(isActive);
    if (!isActive) setSlide(INTRO);
  }

  const goTo = (next: number) => {
    if (slide === INTRO && next !== INTRO) setIntroLeaving(true);
    setSlide(next);
  };

  // Autoplay: intro → slide 1 after 1s, then the next slide every 5s.
  // `slide` is a dependency, so any change (including a tab click) restarts
  // the timer with a full interval.
  useEffect(() => {
    if (!isActive) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (slide !== INTRO && (isPaused || reduceMotion)) return;

    const timer = setTimeout(
      () => goTo(slide === INTRO ? 1 : (slide % featureSlides.length) + 1),
      slide === INTRO ? INTRO_MS : SLIDE_MS,
    );
    return () => clearTimeout(timer);
    // goTo only reads `slide`, which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, slide, isPaused]);

  // Keep the intro mounted for its exit animation, then remove it.
  useEffect(() => {
    if (!introLeaving) return;
    const timer = setTimeout(() => setIntroLeaving(false), INTRO_EXIT_MS);
    return () => clearTimeout(timer);
  }, [introLeaving]);

  const onTabKey = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const current = Math.max(slide, 1) - 1;
    const next = (current + step + featureSlides.length) % featureSlides.length;
    goTo(next + 1);
    document.getElementById(`feature-tab-${next + 1}`)?.focus();
  };

  const current = slide === INTRO ? null : featureSlides[slide - 1];

  return (
    <PageSection
      id="feature"
      label="03 助手：游戏内外 全面助力"
      className={styles.feature}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {(slide === INTRO || introLeaving) && <Intro leaving={slide !== INTRO} />}

      {current && (
        <div
          key={current.id}
          id={`feature-panel-${slide}`}
          role="tabpanel"
          aria-labelledby={`feature-tab-${slide}`}
          className={`${styles.slide} ${styles.game} ${styles[current.id]}`}
        >
          <GameSlide slide={current} />
        </div>
      )}

      <div className={styles.nav} data-show={isActive && slide !== INTRO}>
        <ul role="tablist" aria-label="助手功能" onKeyDown={onTabKey}>
          {featureSlides.map((item, i) => {
            const isSelected = slide === i + 1;
            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  role="tab"
                  id={`feature-tab-${i + 1}`}
                  aria-selected={isSelected}
                  aria-controls={isSelected ? `feature-panel-${i + 1}` : undefined}
                  tabIndex={isSelected || (slide === INTRO && i === 0) ? 0 : -1}
                  onClick={() => goTo(i + 1)}
                  className={styles.tab}
                >
                  <span className="sr-only">{item.tab}</span>
                  <span
                    aria-hidden="true"
                    className={styles.tabText}
                    style={{ maskImage: `url(/wegame/feature-item-${i + 1}.svg)` }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </PageSection>
  );
}

/** The 1-second intro: 游戏内外 / 全面助力 on an orange wedge. */
function Intro({ leaving }: { leaving: boolean }) {
  return (
    <div className={`${styles.slide} ${styles.guide}`} data-leaving={leaving}>
      <div className={styles.wedge} aria-hidden="true" />
      <div className={styles.arrowsFront} aria-hidden="true">
        <span />
      </div>
      <div className={styles.arrowsBack} aria-hidden="true">
        <span />
      </div>
      <Image
        src="/wegame/feature-title-1.svg"
        alt="游戏内外"
        width={1200}
        height={120}
        className={styles.guideTitle}
      />
      <Image
        src="/wegame/feature-title-2.svg"
        alt="全面助力"
        width={1200}
        height={120}
        className={styles.guideTitle}
      />
    </div>
  );
}

/** One game slide: background, character art, titles and a screenshot. */
function GameSlide({ slide }: { slide: FeatureSlide }) {
  return (
    <>
      <div className={styles.bgImage} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />
      {slide.id === "ai" ? <AiPanel /> : <div className={styles.role} aria-hidden="true" />}

      <div className={styles.center}>
        <Image
          src={slide.subtitle.src}
          alt={slide.subtitle.alt}
          width={1200}
          height={120}
          className={styles.subtitle}
        />
        <h3>
          <Image
            src={slide.title.src}
            alt={slide.title.alt}
            width={1200}
            height={slide.id === "ai" ? 160 : 120}
            className={styles.title}
          />
        </h3>
        {slide.id === "ai" ? (
          <div className={styles.aiPoints}>
            {[1, 2, 3].map((n) => (
              <Image
                key={n}
                src={`/wegame/feature-inner-4-info-${n}.svg`}
                alt=""
                width={232}
                height={64}
              />
            ))}
          </div>
        ) : (
          <div className={styles.inner} role="img" aria-label={`${slide.subtitle.alt}界面`} />
        )}
      </div>
    </>
  );
}

/** AI slide: a "本局复盘" review panel whose text types itself out. */
function AiPanel() {
  return (
    <div className={styles.aiPanel} role="img" aria-label="AI 本局复盘界面">
      <div className={styles.aiRole} />
      <div className={styles.aiPanelHead} />
      <div className={styles.aiPanelBody}>
        <div className={styles.aiPanelText} />
      </div>
    </div>
  );
}
