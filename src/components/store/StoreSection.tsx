/**
 * StoreSection: the heading + body wrapper every store section shares
 * (新游发布, 预约进行中, 排行榜, 游戏推荐), so they line up and look the same.
 *
 *   <StoreSection id="releases" title="新游发布" more actions={<ScrollArrows .../>}>
 *     ...
 *   </StoreSection>
 */
import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

interface StoreSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  /** Show a › after the title, like the live site's "see all" links. */
  more?: boolean;
  /** Controls on the right of the heading, e.g. scroll arrows. */
  actions?: ReactNode;
  children: ReactNode;
}

export default function StoreSection({
  id,
  title,
  subtitle,
  more = false,
  actions,
  children,
}: StoreSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="container-page mt-12 lg:mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2
            id={headingId}
            className="flex items-center gap-1 text-2xl font-bold text-white lg:text-[28px]"
          >
            {title}
            {more && <ChevronRightIcon width={24} height={24} strokeWidth={2.4} />}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

interface ScrollArrowsProps {
  label: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/** The round ‹ › buttons at the top right of scrolling sections. */
export function ScrollArrows({ label, canPrev, canNext, onPrev, onNext }: ScrollArrowsProps) {
  const button =
    "grid size-7 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white/10";
  return (
    <div className="hidden gap-3 sm:flex">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`${label}：上一页`}
        className={button}
      >
        <ChevronLeftIcon width={16} height={16} strokeWidth={2.4} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label={`${label}：下一页`}
        className={button}
      >
        <ChevronRightIcon width={16} height={16} strokeWidth={2.4} />
      </button>
    </div>
  );
}
