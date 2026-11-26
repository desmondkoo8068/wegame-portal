"use client";
/**
 * Offer: renders the "how do I get this game" line used on every store card.
 *
 * The data type is a discriminated union (see `Offer` in src/data/store.ts),
 * so the `switch` below must handle every `kind`. If a new kind is added,
 * TypeScript flags this component until it is handled too.
 *
 *   { kind: "free" }                    -> 免费开玩
 *   { kind: "price", cny: 48 }          -> ¥48 (or RM… via <Price>)
 *   { kind: "price", cny: 29, originalCny: 58 } -> [5 折] ¥29 ¥58
 *   { kind: "text", text: "时长付费" }   -> 时长付费
 */
import type { Offer as OfferData } from "@/data/store";
import Price from "@/components/ui/Price";

export default function Offer({ offer, className = "" }: { offer: OfferData; className?: string }) {
  switch (offer.kind) {
    case "free":
      return <span className={`text-sm text-white/80 ${className}`}>免费开玩</span>;

    case "text":
      return <span className={`text-sm text-muted ${className}`}>{offer.text}</span>;

    case "price": {
      const { cny, originalCny } = offer;
      if (!originalCny) return <Price priceCny={cny} className={`text-sm ${className}`} />;

      // Chinese stores show discounts as 折: 8 折 means you pay 80%.
      const zhe = Math.round((cny / originalCny) * 10);
      return (
        <span className={`inline-flex flex-wrap items-center gap-2 text-sm ${className}`}>
          <span className="rounded-sm bg-brand px-1 text-xs font-bold text-white">{zhe} 折</span>
          <Price priceCny={cny} />
          <Price priceCny={originalCny} strike />
        </span>
      );
    }
  }
}
