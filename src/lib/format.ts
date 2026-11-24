/**
 * Formatting helpers, all built on the browser's Intl APIs.
 *
 * Intl knows every currency's symbol, decimals and separators, and the
 * names of countries and currencies in any language, so we never hand-build
 * strings like "RM" or "马来西亚".
 */

const LOCALE = "zh-CN";

/**
 * e.g. formatPrice(268, "CNY") -> "¥268" ; formatPrice(164.46, "MYR") -> "RM164.46"
 * Large amounts (IDR, VND, KRW…) drop the decimals: "Rp734,247".
 */
export function formatPrice(amount: number, currency: string) {
  const maxDecimals = amount >= 1000 ? 0 : 2;
  const rounded = Number(amount.toFixed(maxDecimals));
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    // Short symbols (RM, Rp, ฿) read best, but "$" and "¥" are shared by many
    // currencies, so for those we show the code instead: "SGD 51.78".
    currencyDisplay: hasAmbiguousSymbol(currency) ? "code" : "narrowSymbol",
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(rounded);
}

/** Symbols used by several currencies, and the one currency that "owns" each. */
const SHARED_SYMBOLS: Record<string, string> = { $: "USD", "¥": "CNY", "£": "GBP", kr: "SEK" };

function hasAmbiguousSymbol(currency: string) {
  const symbol = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  })
    .formatToParts(0)
    .find((part) => part.type === "currency")?.value;
  return symbol !== undefined && symbol in SHARED_SYMBOLS && SHARED_SYMBOLS[symbol] !== currency;
}

/** "MY" -> "马来西亚" */
export function countryName(countryCode: string) {
  return new Intl.DisplayNames([LOCALE], { type: "region" }).of(countryCode) ?? countryCode;
}

/** "MYR" -> "马来西亚林吉特" */
export function currencyName(currency: string) {
  return new Intl.DisplayNames([LOCALE], { type: "currency" }).of(currency) ?? currency;
}
