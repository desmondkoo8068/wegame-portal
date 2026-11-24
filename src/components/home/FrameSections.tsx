/**
 * FrameSections: "02 焕新" – two pages showing off the new client.
 *
 *   FrameUpdateSection: "WEGAME 3.0 轻装上阵" + a framed client screenshot
 *   FrameFastSection:   "性能升级 轻快畅玩" + three claims + a gameplay video
 *                       on a screen tilted back in 3D
 *
 * Both share the same orange chevron background and glow, so the window
 * frame and background live in small helper components below.
 * No hooks here: these are Server Components (PageSection and AutoVideo
 * are the only client parts).
 */
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import AutoVideo from "@/components/ui/AutoVideo";
import { revealDelay } from "@/lib/style";
import PageSection from "./PageSection";

export function FrameUpdateSection() {
  return (
    <PageSection id="frame-update" label="02 焕新：WEGAME 3.0 轻装上阵" className="py-16 lg:py-0">
      <FrameBackground />
      <div className="relative flex h-full flex-col items-center gap-8 px-4 lg:gap-[calc(60*var(--dp))] lg:px-0 lg:pt-[calc(var(--stage-top)+190*var(--dp))]">
        <h2 className="reveal w-[85%] max-w-[600px] lg:w-[calc(900*var(--dp))] lg:max-w-none">
          <Image
            src="/wegame/section-title-02.svg"
            alt="WEGAME 3.0 轻装上阵"
            width={1200}
            height={120}
            className="h-auto w-full"
          />
        </h2>
        <ClientWindow className="reveal" style={revealDelay(200)}>
          <Image
            src="/wegame/frame-main-store.png"
            alt="WeGame 3.0 客户端商店首页截图"
            width={2804}
            height={1600}
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="h-auto w-full"
          />
        </ClientWindow>
      </div>
    </PageSection>
  );
}

export function FrameFastSection() {
  return (
    <PageSection id="frame-fast" label="02 焕新：性能升级 轻快畅玩" className="py-16 lg:py-0">
      <FrameBackground />
      <div className="relative flex h-full flex-col items-center gap-6 px-4 lg:gap-[calc(30*var(--dp))] lg:px-0 lg:pt-[calc(var(--stage-top)+190*var(--dp))]">
        <h2 className="reveal w-[85%] max-w-[600px] lg:w-[calc(900*var(--dp))] lg:max-w-none">
          <Image
            src="/wegame/section-title-02-2.svg"
            alt="性能升级 轻快畅玩"
            width={1200}
            height={120}
            className="h-auto w-full"
          />
        </h2>
        <Image
          src="/wegame/frame-subtitle.png"
          alt="界面表现更丝滑，游戏体验零影响，助手稳定不掉帧"
          width={1344}
          height={244}
          className="reveal h-auto w-[80%] max-w-[420px] lg:w-[calc(504*var(--dp))] lg:max-w-none"
          style={revealDelay(150)}
        />
        {/* perspective on the parent + rotateX on the child = screen tilted back */}
        <div className="w-full [perspective:1200px] lg:absolute lg:bottom-[calc(-120*var(--dp))] lg:left-1/2 lg:w-auto lg:-translate-x-1/2">
          <ClientWindow className="reveal lg:[transform:rotateX(38deg)]" style={revealDelay(300)}>
            <div className="relative aspect-video">
              <AutoVideo
                src="/wegame/video/frame-mingchao.mp4"
                poster="/wegame/video/frame-mingchao-poster.jpg"
                pageId="frame-fast"
              />
            </div>
          </ClientWindow>
        </div>
      </div>
    </PageSection>
  );
}

/** Orange chevron background + horizontal glow shared by both pages. */
function FrameBackground() {
  return (
    <div aria-hidden="true">
      <Image
        src="/wegame/frame-bg.svg"
        alt=""
        width={3100}
        height={1851}
        className="absolute left-1/2 top-[30%] w-[220%] max-w-none -translate-x-1/2 opacity-90 lg:top-[calc(50%-200*var(--dp))] lg:w-[calc(2400*var(--dp))]"
      />
      <Image
        src="/wegame/frame-light.png"
        alt=""
        width={4016}
        height={1066}
        className="absolute left-1/2 top-[25%] w-[200%] max-w-none -translate-x-1/2 lg:top-[calc(50%-300*var(--dp))] lg:w-[calc(1350*var(--dp))]"
      />
    </div>
  );
}

/** Translucent bordered "monitor" frame around a screenshot or video. */
function ClientWindow({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`w-full max-w-[720px] rounded-lg border border-white/15 bg-white/5 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-sm lg:w-[calc(950*var(--dp))] lg:max-w-none lg:p-[calc(11*var(--dp))] ${className}`}
      style={style}
    >
      <div className="overflow-hidden rounded">{children}</div>
    </div>
  );
}
