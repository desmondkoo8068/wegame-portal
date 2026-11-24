/**
 * Price: the one place prices are rendered.
 *
 * Handles three cases: free-to-play, full price, and discounted (badge +
 * struck-through original). Because every card and the hero use this
 * component, the currency bonus in step 6 only needs to change this file.
 */
import { applyDiscount, formatPrice } from "@/lib/format";

interface PriceProps {
  priceCny: number;
  discountPercent?: number;
  /** "lg" for the hero, "md" for cards. */
  size?: "md" | "lg";
}

export default function Price({ priceCny, discountPercent = 0, size = "md" }: PriceProps) {
  const textSize = size === "lg" ? "text-xl" : "text-sm";

  if (priceCny === 0) {
    return <span className={`font-semibold text-emerald-400 ${textSize}`}>Free to Play</span>;
  }

  const finalPrice = applyDiscount(priceCny, discountPercent);

  return (
    <div className="flex items-center gap-2">
      {discountPercent > 0 && (
        <>
          <span className="rounded bg-brand px-1.5 py-0.5 text-xs font-bold text-page">
            -{discountPercent}%
          </span>
          <s className="text-xs text-muted" aria-label={`Was ${formatPrice(priceCny)}`}>
            {formatPrice(priceCny)}
          </s>
        </>
      )}
      <span className={`font-semibold text-white ${textSize}`}>{formatPrice(finalPrice)}</span>
    </div>
  );
}
