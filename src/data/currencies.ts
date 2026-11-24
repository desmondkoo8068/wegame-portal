/**
 * Country → currency lookup for the geolocation bonus.
 *
 * Browsers have no built-in "which currency does country X use" API, so we
 * keep a small ISO 3166 (country) → ISO 4217 (currency) table. Display names
 * and symbols are NOT stored here: Intl.DisplayNames / Intl.NumberFormat
 * produce them in the right language for free.
 */

/** Prices in the catalogue are stored in this currency. */
export const BASE_CURRENCY = "CNY";

/** Used when a country isn't in the table below. */
export const FALLBACK_CURRENCY = "USD";

// prettier-ignore
const EURO_COUNTRIES = [
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR",
  "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK",
];

// prettier-ignore
export const currencyByCountry: Record<string, string> = {
  // East & South-East Asia (WeGame's main markets first)
  CN: "CNY", HK: "HKD", MO: "MOP", TW: "TWD",
  MY: "MYR", SG: "SGD", ID: "IDR", TH: "THB", VN: "VND", PH: "PHP",
  BN: "BND", KH: "KHR", LA: "LAK", MM: "MMK",
  JP: "JPY", KR: "KRW", MN: "MNT",
  // South Asia & Middle East
  IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR",
  AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", IL: "ILS", TR: "TRY",
  // Oceania
  AU: "AUD", NZ: "NZD",
  // Americas
  US: "USD", CA: "CAD", MX: "MXN", BR: "BRL", AR: "ARS", CL: "CLP",
  CO: "COP", PE: "PEN",
  // Europe (non-euro)
  GB: "GBP", CH: "CHF", NO: "NOK", SE: "SEK", DK: "DKK", PL: "PLN",
  CZ: "CZK", HU: "HUF", RO: "RON", UA: "UAH", RU: "RUB",
  // Africa
  ZA: "ZAR", NG: "NGN", EG: "EGP", KE: "KES",
  ...Object.fromEntries(EURO_COUNTRIES.map((code) => [code, "EUR"])),
};

/** Currencies offered in the manual picker (when location is unavailable). */
// prettier-ignore
export const manualCurrencies = [
  "CNY", "MYR", "SGD", "IDR", "THB", "VND", "PHP", "HKD", "TWD",
  "JPY", "KRW", "INR", "AUD", "USD", "EUR", "GBP", "BRL", "RUB", "TRY",
];

export function currencyForCountry(countryCode: string) {
  return currencyByCountry[countryCode.toUpperCase()] ?? FALLBACK_CURRENCY;
}
