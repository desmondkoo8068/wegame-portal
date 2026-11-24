/**
 * Formatting helpers.
 *
 * Intl.NumberFormat is built into every browser and handles currency symbols,
 * separators and decimals for any locale, so we never hand-build "¥" strings.
 */

/** Price after applying an optional percentage discount. */
export function applyDiscount(price: number, discountPercent = 0) {
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

/** e.g. formatPrice(198) -> "¥198" ; formatPrice(47.6) -> "¥47.60" */
export function formatPrice(amount: number, currency = "CNY", locale = "zh-CN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // Whole prices show no decimals; others show exactly two.
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
