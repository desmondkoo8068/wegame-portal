"use client";
/**
 * ReservationGrid (预约进行中): upcoming games you can reserve.
 *
 * The 立即预约 button toggles the game's id in Redux (storefront.reservedIds)
 * via useReservation, so the same game's state also updates in the banner
 * and the 预约之星 ranking.
 */
import Image from "next/image";
import type { Reservation } from "@/data/store";
import { useReservation } from "@/lib/useStorefront";
import { CheckIcon, ChevronRightIcon } from "@/components/ui/Icons";
import StoreSection from "./StoreSection";

export default function ReservationGrid({ reservations }: { reservations: Reservation[] }) {
  return (
    <StoreSection id="reservations" title="预约进行中">
      <ul className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {reservations.map((game) => (
          <li key={game.id}>
            <ReservationCard game={game} />
          </li>
        ))}
      </ul>
    </StoreSection>
  );
}

function ReservationCard({ game }: { game: Reservation }) {
  const { isReserved, toggle } = useReservation(game.id);

  return (
    <article>
      <a
        href="#"
        className="group relative block aspect-[285/160] overflow-hidden rounded bg-raised"
      >
        <Image
          src={game.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 285px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {game.isNew && (
          <span className="absolute left-0 top-0 rounded-br bg-red-600 px-1.5 text-[11px] font-black italic leading-5 text-yellow-300">
            NEW
          </span>
        )}
      </a>

      <h3 className="mt-4 flex items-center gap-2 font-bold text-white">
        <span className="truncate">{game.name}</span>
        {game.badge && (
          <span className="shrink-0 rounded-sm border border-cyan-400/70 px-1 text-[11px] leading-4 text-cyan-300">
            {game.badge}
          </span>
        )}
      </h3>

      <p className="mt-2 flex items-center text-[13px] text-muted">
        <span className="truncate">
          {game.launch && <span className="text-brand">{game.launch} · </span>}
          {game.pitch}
        </span>
        <ChevronRightIcon width={14} height={14} className="shrink-0" />
      </p>

      {/* One button showing action + count, like the live site. */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isReserved}
        className={`mt-4 inline-flex h-9 items-center gap-4 rounded-sm px-3 text-[13px] font-bold transition-colors ${
          isReserved
            ? "bg-brand text-white hover:bg-brand-hover"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <span className="flex items-center gap-1">
          {isReserved && <CheckIcon width={14} height={14} strokeWidth={2.6} />}
          {isReserved ? "已预约" : "立即预约"}
        </span>
        <span className={`tabular-nums ${isReserved ? "text-white/80" : "text-white/70"}`}>
          {game.reservedWan.toFixed(1)} 万人
        </span>
      </button>
    </article>
  );
}
