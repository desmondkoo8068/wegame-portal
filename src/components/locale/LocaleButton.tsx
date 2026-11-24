"use client";
/**
 * LocaleButton: header button showing the current display currency
 * (e.g. "🇲🇾 MYR"); opens the 地区与货币 modal.
 */
import { GlobeIcon } from "@/components/ui/Icons";
import { flagEmoji } from "@/lib/geo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectGeo } from "@/store/slices/geoSlice";
import { openLocaleModal } from "@/store/slices/uiSlice";

export default function LocaleButton({ className = "" }: { className?: string }) {
  const dispatch = useAppDispatch();
  const { currency, countryCode, source } = useAppSelector(selectGeo);

  return (
    <button
      type="button"
      onClick={() => dispatch(openLocaleModal())}
      aria-haspopup="dialog"
      aria-label={`地区与货币，当前货币 ${currency}`}
      className={`btn-glass ${className}`}
    >
      {source === "location" && countryCode ? (
        <span aria-hidden="true">{flagEmoji(countryCode)}</span>
      ) : (
        <GlobeIcon width={18} height={18} />
      )}
      {currency}
    </button>
  );
}
