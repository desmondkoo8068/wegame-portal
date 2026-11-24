/**
 * TeamSections: "04 开黑" (team up) – two pages.
 *
 *   TeamUpSection:    "开黑功能 实力回归" – a row of party avatars, the
 *                     WeGame mascot in the middle, over rising orange chevrons
 *   TeamWorldSection: "游戏内外互通 快速集结" – game heroes gathered around
 *                     a portal
 *
 * Server Components: the only interactivity is CSS hover, so no JS needed.
 */
import Image from "next/image";
import { revealDelay } from "@/lib/style";
import PageSection from "./PageSection";

/** Party members: avatar image + the role icon shown under it. */
const party = [
  { avatar: "01", icon: "102", label: "队友 1" },
  { avatar: "02", icon: "101", label: "队友 2" },
  { avatar: "03", icon: "104", label: "WeGame 蛋蛋君", isMascot: true },
  { avatar: "04", icon: "100", label: "队友 3" },
  { avatar: "05", icon: "103", label: "队友 4" },
];

export function TeamUpSection() {
  return (
    <PageSection id="team" label="04 开黑：开黑功能 实力回归" className="py-16 lg:py-0">
      {/* Three stacked chevrons rising from the bottom. */}
      {[0, 1, 2].map((i) => (
        <Image
          key={i}
          src="/wegame/tamup-arrow-bg.svg"
          alt=""
          width={2150}
          height={1283}
          className="reveal absolute left-1/2 w-[200%] max-w-none -translate-x-1/2 lg:w-[calc(1612*var(--dp))]"
          style={{ top: `calc(55% + ${i * 33}%)`, ...revealDelay(300 + i * 150) }}
        />
      ))}

      <div className="relative flex h-full flex-col items-center gap-2 px-4 lg:gap-0 lg:pt-[calc(var(--stage-top)+90*var(--dp))]">
        <h2 className="reveal w-[85%] max-w-[600px] lg:w-[calc(900*var(--dp))] lg:max-w-none">
          <Image
            src="/wegame/teamup-title-01.svg"
            alt="开黑功能 实力回归"
            width={1200}
            height={120}
            className="h-auto w-full"
          />
        </h2>
        <Image
          src="/wegame/teamup-subtitle-01.svg"
          alt="开黑寻友 一起好玩"
          width={1200}
          height={120}
          className="reveal -mt-2 h-auto w-[85%] max-w-[600px] lg:-mt-[calc(30*var(--dp))] lg:w-[calc(900*var(--dp))] lg:max-w-none"
          style={revealDelay(100)}
        />

        <ul className="mt-10 flex items-start justify-center gap-3 sm:gap-6 lg:mt-[calc(110*var(--dp))] lg:gap-[calc(60*var(--dp))]">
          {party.map((member, i) => (
            <li
              key={member.avatar}
              className="reveal flex flex-col items-center gap-3 lg:gap-[calc(30*var(--dp))]"
              // Outer avatars sit lower, forming an arc.
              style={{ marginTop: `${Math.abs(i - 2) * 12}px`, ...revealDelay(200 + i * 80) }}
            >
              <Image
                src={`/wegame/teamup-avatar-${member.avatar}.png`}
                alt={member.label}
                width={315}
                height={315}
                className={`h-auto rounded-full transition-transform duration-300 hover:-translate-y-2 hover:scale-105 ${
                  member.isMascot
                    ? "w-20 ring-4 ring-brand sm:w-28 lg:w-[calc(140*var(--dp))]"
                    : "w-14 ring-2 ring-white/30 sm:w-20 lg:w-[calc(110*var(--dp))]"
                }`}
              />
              <Image
                src={`/wegame/Component-${member.icon}.png`}
                alt=""
                width={60}
                height={60}
                className="h-auto w-6 lg:w-[calc(30*var(--dp))]"
              />
            </li>
          ))}
        </ul>
      </div>
    </PageSection>
  );
}

export function TeamWorldSection() {
  return (
    <PageSection
      id="team-world"
      label="04 开黑：游戏内外互通 快速集结"
      className="h-[560px] sm:h-[680px] lg:h-svh"
    >
      <Image src="/wegame/teamup-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-page/70 via-transparent to-page/80" />

      {/*
        All five hero images share the same 1800x1800 canvas with each
        character pre-positioned, so stacking them builds the group shot.
      */}
      <div className="absolute bottom-0 left-1/2 aspect-square w-[115%] max-w-[760px] -translate-x-1/2 lg:w-[calc(760*var(--dp))] lg:max-w-none">
        {["01", "02", "03", "04", "05"].map((n, i) => (
          <Image
            key={n}
            src={`/wegame/teamup-hero-${n}.png`}
            alt=""
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="reveal object-contain"
            style={revealDelay(200 + i * 120)}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center px-4 pt-16 lg:pt-[calc(var(--stage-top)+90*var(--dp))]">
        <h2 className="reveal w-[85%] max-w-[600px] lg:w-[calc(900*var(--dp))] lg:max-w-none">
          <Image
            src="/wegame/teamup-title-02.svg"
            alt="游戏内外互通"
            width={1200}
            height={120}
            className="h-auto w-full"
          />
        </h2>
        <Image
          src="/wegame/teamup-subtitle-02.svg"
          alt="快速集结"
          width={1200}
          height={120}
          className="reveal -mt-2 h-auto w-[85%] max-w-[600px] lg:-mt-[calc(30*var(--dp))] lg:w-[calc(900*var(--dp))] lg:max-w-none"
          style={revealDelay(100)}
        />
      </div>
    </PageSection>
  );
}
