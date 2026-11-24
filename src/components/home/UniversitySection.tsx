/**
 * UniversitySection: "05 高校" – WeGame campus verification.
 *
 * Left: title, description and three feature badges.
 * Right: a phone mock-up with floating cards, the 蛋蛋君 mascot, and a column
 * of chat bubbles that scrolls upwards forever (CSS-only ticker).
 *
 * Server Component: all motion is CSS.
 */
import Image from "next/image";
import { revealDelay } from "@/lib/style";
import PageSection from "./PageSection";

const features = [
  { src: "/wegame/college-feature-01.svg", alt: "快捷认证：游戏福利一站通关" },
  { src: "/wegame/college-feature-02.svg", alt: "大佬聚集：轻松找到同校搭子" },
  { src: "/wegame/college-feature-03.svg", alt: "同校竞技：解锁专属排行荣誉" },
];

const messages = [
  "蛋蛋君已完成高校认证",
  "三角洲求大佬带飞",
  "让我看看本校榜一是谁",
  "这周的福利到手啦",
  "找个校友一起开黑",
  "下次一定要打赢隔壁",
];

export default function UniversitySection() {
  return (
    <PageSection id="university" label="05 高校：WEGAME 高校认证" className="py-16 lg:py-0">
      {/* Orange diagonal panel in the top-right, like the real page. */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,rgb(255_129_17/0.85)_45%,rgb(204_65_0/0.6)_75%,transparent_75%)] opacity-60" />

      <div className="container-page relative flex h-full flex-col gap-10 lg:max-w-none lg:flex-row lg:items-start lg:gap-[calc(52*var(--dp))] lg:px-0 lg:pl-[calc(50vw-531*var(--dp))] lg:pt-[calc(var(--stage-top)+169*var(--dp))]">
        {/* ---------- Copy ---------- */}
        <div className="flex flex-col gap-6 lg:w-[calc(560*var(--dp))] lg:gap-[calc(40*var(--dp))]">
          <div>
            <h2 className="reveal">
              <Image
                src="/wegame/college-title-01.svg"
                alt="WEGAME 高校认证"
                width={1200}
                height={120}
                className="h-auto w-full max-w-[560px] lg:max-w-none"
              />
            </h2>
            <Image
              src="/wegame/college-desc-01.svg"
              alt="同校聚集，为荣誉也为共鸣"
              width={1200}
              height={120}
              className="reveal -mt-3 h-auto w-full max-w-[560px] lg:-mt-[calc(16*var(--dp))] lg:max-w-none"
              style={revealDelay(100)}
            />
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-[calc(45*var(--dp))]">
            {features.map((feature, i) => (
              <li key={feature.src} className="reveal" style={revealDelay(200 + i * 100)}>
                <Image
                  src={feature.src}
                  alt={feature.alt}
                  width={260}
                  height={80}
                  className="h-auto w-52 lg:w-[calc(260*var(--dp))]"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Phone + floating cards ---------- */}
        <div
          className="reveal relative mx-auto w-[260px] sm:w-[300px] lg:mx-0 lg:w-[calc(360*var(--dp))]"
          style={revealDelay(200)}
        >
          <Image
            src="/wegame/college-app.jpg"
            alt="WeGame 高校认证 App 界面"
            width={720}
            height={1293}
            sizes="(min-width: 1024px) 25vw, 300px"
            className="h-auto w-full rounded-[24px] border-4 border-white/10 shadow-2xl shadow-black/70"
          />
          <Image
            src="/wegame/college-app-card-02.png"
            alt=""
            width={811}
            height={347}
            className="absolute -right-[40%] top-[3%] h-auto w-[110%] animate-float"
          />
          <Image
            src="/wegame/college-app-card-01.png"
            alt=""
            width={798}
            height={453}
            className="absolute -left-[50%] top-[33%] h-auto w-[110%] animate-float [animation-delay:-3s]"
          />
          <Image
            src="/wegame/college-ddj.png"
            alt="蛋蛋君"
            width={450}
            height={450}
            className="absolute -right-[25%] bottom-[22%] h-auto w-[40%] animate-float [animation-delay:-1.5s]"
          />

          {/* Chat bubbles: list duplicated so the upward loop is seamless. */}
          <div
            aria-hidden="true"
            className="absolute left-[104%] top-[44%] hidden h-[45%] overflow-hidden [mask-image:linear-gradient(transparent,#000_20%,#000_80%,transparent)] lg:block"
          >
            <ul className="flex animate-ticker flex-col gap-3">
              {[...messages, ...messages].map((message, i) => (
                <li
                  key={i}
                  className="w-max rounded-full bg-white px-4 py-2 text-[13.5px] font-bold text-brand shadow-lg"
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
