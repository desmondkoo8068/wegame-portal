/**
 * StorePageHeader: the title artwork + decorative backdrop at the top of
 * the AI 游戏 and 直播与视频 pages.
 *
 * The backdrop is `absolute top-0 -z-10`. Its positioned ancestor is the
 * store layout's wrapper (which also contains the sub-nav), so the glow
 * starts behind the nav, like the live site. The layout's `isolate` keeps
 * -z-10 from pushing it behind the page background.
 */
import Image from "next/image";
import type { ReactNode } from "react";

interface StorePageHeaderProps {
  title: string;
  /** Title artwork (1000x196 with transparent padding on the right). */
  titleImage: string;
  backdrop: string;
  /** Optional button on the right, e.g. 游戏入驻. */
  action?: ReactNode;
}

export default function StorePageHeader({
  title,
  titleImage,
  backdrop,
  action,
}: StorePageHeaderProps) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden">
        <Image
          src={backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-80"
        />
        {/* Fade into the page colour so the backdrop has no hard bottom edge. */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-page/40 to-page" />
      </div>

      <div className="container-page flex items-end justify-between gap-4 pb-6 pt-4">
        <h1 className="min-w-0">
          <Image
            src={titleImage}
            alt={title}
            width={1000}
            height={196}
            priority
            // The artwork has empty space on the right; crop it with object-left.
            className="-my-2 h-12 w-auto max-w-[55vw] object-contain object-left sm:-my-4 sm:h-24 sm:max-w-none"
          />
        </h1>
        {action}
      </div>
    </>
  );
}
