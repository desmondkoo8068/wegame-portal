"use client";
/**
 * RankingBoard (排行榜): four ranking panels. Their placement per screen
 * size is done in CSS with named grid areas (.ranking-board in
 * globals.css); each panel just declares its area with data-area.
 */
import Image from "next/image";
import type { RankEntry, RankList } from "@/data/store";
import { useAppSelector } from "@/store/hooks";
import { selectIsReserved } from "@/store/slices/storefrontSlice";
import { ChevronRightIcon } from "@/components/ui/Icons";
import Offer from "./Offer";
import StoreSection from "./StoreSection";

/** Each panel's tint and subtitle colour, sampled from the live site. */
const panelTheme: Record<RankList["id"], { tint: string; subtitle: string }> = {
  hot: { tint: "from-[#5a3418]", subtitle: "text-orange-300/80" },
  reserve: { tint: "from-[#143c3a]", subtitle: "text-teal-300/80" },
  sales: { tint: "from-[#1d2c40]", subtitle: "text-muted" },
  top: { tint: "from-[#2b2f3a]", subtitle: "text-muted" },
};

export default function RankingBoard({ rankings }: { rankings: RankList[] }) {
  return (
    <StoreSection id="rankings" title="排行榜" more>
      <div className="ranking-board">
        {rankings.map((list) => (
          <RankPanel key={list.id} list={list} />
        ))}
      </div>
    </StoreSection>
  );
}

function RankPanel({ list }: { list: RankList }) {
  const theme = panelTheme[list.id];
  const [first, ...rest] = list.entries;
  const headingId = `rank-${list.id}`;

  return (
    <section
      data-area={list.id}
      aria-labelledby={headingId}
      className={`rounded-lg border border-white/5 bg-linear-to-b to-surface to-30% px-6 pb-4 pt-5 ${theme.tint}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 id={headingId} className="text-2xl font-bold text-white">
            {list.title}
          </h3>
          <p className={`mt-1 text-sm ${theme.subtitle}`}>{list.subtitle}</p>
        </div>
        <a
          href="#"
          aria-label={`查看完整${list.title}榜单`}
          className="grid size-8 shrink-0 place-items-center rounded-sm border border-white/30 text-white transition-colors hover:bg-white/10"
        >
          <ChevronRightIcon width={18} height={18} />
        </a>
      </div>

      {/* An ordered list: the ranking order *is* the meaning. */}
      <ol>
        {list.featureFirst ? (
          <li>
            <FeaturedEntry entry={first} />
          </li>
        ) : (
          <li>
            <RankRow entry={first} rank={1} />
          </li>
        )}
        {rest.map((entry, i) => (
          <li key={entry.id}>
            <RankRow entry={entry} rank={i + 2} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/** #1 of 火爆新品 / 最高热度: a big cover with the name on top. */
function FeaturedEntry({ entry }: { entry: RankEntry }) {
  return (
    <a href="#" className="group relative mb-2 block aspect-[337/180] overflow-hidden rounded">
      <Image
        src={entry.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <RankBadge rank={1} />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
        <p className="font-bold text-white">{entry.name}</p>
        <Offer offer={entry.detail} className="text-xs" />
      </div>
    </a>
  );
}

function RankRow({ entry, rank }: { entry: RankEntry; rank: number }) {
  // Same game id as the reservation cards, so reserving there shows here.
  const isReserved = useAppSelector((state) => selectIsReserved(state, entry.id));

  return (
    <a
      href="#"
      className="group flex items-center gap-4 rounded py-2.5 transition-colors hover:bg-white/5"
    >
      <span className="w-5 shrink-0 text-center text-lg font-bold tabular-nums text-white/50">
        {rank > 1 && rank}
      </span>
      <div className="relative aspect-video w-[100px] shrink-0 overflow-hidden rounded-sm bg-raised">
        <Image src={entry.image} alt="" fill sizes="100px" className="object-cover" />
        {rank === 1 && <RankBadge rank={1} />}
      </div>
      <div className="min-w-0">
        <p className="truncate font-bold text-white">{entry.name}</p>
        <p className="mt-1 flex items-center gap-2">
          <Offer offer={entry.detail} className="truncate text-xs" />
          {isReserved && (
            <span className="shrink-0 rounded-sm bg-brand/20 px-1 text-[11px] font-bold text-brand">
              已预约
            </span>
          )}
        </p>
      </div>
    </a>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="absolute left-0 top-0 rounded-br-sm bg-brand px-2 text-xs font-bold leading-5 text-black">
      {rank}
    </span>
  );
}
