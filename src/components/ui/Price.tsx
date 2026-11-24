"use client";
/**
 * Price: the one place prices are rendered.
 *
 * Catalogue prices are in CNY. This component reads the visitor's display
 * currency and exchange rate from Redux (geoSlice) and converts. Because
 * every price goes through here, the whole site switches currency at once.
 *
 *   ¥268  ->  RM164.46  (¥268)   when the visitor is in Malaysia
 */
import { formatPrice } from "@/lib/format";
import { useAppSelector } from "@/store/hooks";
import { selectDisplayCurrency } from "@/store/slices/geoSlice";
import { BASE_CURRENCY } from "@/data/currencies";

interface PriceProps {
  priceCny: number;
  className?: string;
}

export default function Price({ priceCny, className = "" }: PriceProps) {
  const { currency, rate, converted } = useAppSelector(selectDisplayCurrency);

  if (priceCny === 0) {
    return <span className={`font-bold text-emerald-400 ${className}`}>免费游玩</span>;
  }

  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-bold text-white">{formatPrice(priceCny * rate, currency)}</span>
      {/* Show the original price too, so a converted price is never confusing. */}
      {converted && (
        <span className="text-xs text-white/50">({formatPrice(priceCny, BASE_CURRENCY)})</span>
      )}
    </span>
  );
}
