/**
 * Browser-API and network helpers for the geolocation + currency bonus.
 * Plain async functions (no React, no Redux) so they're easy to test and
 * reuse; the Redux thunks in geoSlice call these.
 */

/** Our own error codes, so the UI can show a specific message for each. */
export type GeoErrorCode =
  | "UNSUPPORTED" // browser has no Geolocation API (or page isn't HTTPS)
  | "PERMISSION_DENIED" // user (or browser policy) refused location access
  | "POSITION_UNAVAILABLE" // device couldn't determine a position
  | "TIMEOUT" // took too long
  | "LOOKUP_FAILED"; // got coordinates but couldn't resolve a country

export interface GeoError {
  code: GeoErrorCode;
  message: string;
}

/**
 * Promise wrapper around navigator.geolocation.getCurrentPosition, which
 * only offers callbacks. Rejects with one of our GeoError codes.
 */
export function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject({ code: "UNSUPPORTED", message: "此浏览器不支持定位功能。" } satisfies GeoError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => {
        // GeolocationPositionError codes: 1 denied, 2 unavailable, 3 timeout.
        const byCode: Record<number, GeoError> = {
          1: { code: "PERMISSION_DENIED", message: "定位权限被拒绝。" },
          2: { code: "POSITION_UNAVAILABLE", message: "暂时无法确定你的位置。" },
          3: { code: "TIMEOUT", message: "获取位置超时。" },
        };
        reject(byCode[error.code] ?? byCode[2]);
      },
      // Country-level accuracy is plenty: allow a cached position (10 min)
      // and skip high-accuracy GPS, which is slower and uses more battery.
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 },
    );
  });
}

/**
 * Round coordinates to 2 decimals (~1 km) before sending them anywhere.
 * We only need the country, so there's no reason to share a precise location.
 */
const roughly = (value: number) => Math.round(value * 100) / 100;

/**
 * Coordinates → ISO country code, via BigDataCloud's free client-side
 * reverse-geocoding endpoint (no API key, CORS enabled). Falls back to the
 * offline bounding-box table if the request fails.
 */
export async function lookupCountry(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(roughly(latitude)),
    longitude: String(roughly(longitude)),
    localityLanguage: "en",
  });
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: { countryCode?: string } = await response.json();
    if (data.countryCode) return { countryCode: data.countryCode, source: "api" as const };
  } catch {
    // Network error, timeout, or ad-blocker: try the offline table below.
  }
  const offline = countryFromBoundingBox(latitude, longitude);
  return offline ? { countryCode: offline, source: "offline" as const } : null;
}

/**
 * Very rough offline fallback: [country, south, west, north, east].
 * Boxes overlap at borders, so smaller countries are listed first and the
 * first match wins. Good enough to pick a currency when the API is down.
 */
// prettier-ignore
const BOXES: [string, number, number, number, number][] = [
  ["SG", 1.15, 103.6, 1.48, 104.1],
  ["HK", 22.15, 113.8, 22.57, 114.45],
  ["MO", 22.1, 113.52, 22.22, 113.6],
  ["TW", 21.8, 119.3, 25.4, 122.1],
  ["BN", 4.0, 114.0, 5.1, 115.4],
  ["MY", 0.85, 99.6, 7.4, 119.3],
  ["ID", -11.0, 95.0, 6.1, 141.1],
  ["TH", 5.6, 97.3, 20.5, 105.7],
  ["VN", 8.4, 102.1, 23.4, 109.5],
  ["PH", 4.5, 116.9, 21.2, 126.6],
  ["KR", 33.0, 124.5, 38.7, 130.0],
  ["JP", 24.0, 122.9, 45.6, 146.0],
  ["CN", 18.0, 73.5, 53.6, 134.8],
  ["IN", 6.5, 68.1, 35.7, 97.4],
  ["AU", -44.0, 112.9, -10.0, 154.0],
  ["GB", 49.8, -8.7, 60.9, 1.8],
  ["US", 24.4, -125.0, 49.4, -66.9],
  ["CA", 41.6, -141.0, 83.2, -52.6],
  ["BR", -33.8, -74.0, 5.3, -34.7],
];

function countryFromBoundingBox(lat: number, lon: number) {
  const hit = BOXES.find(([, s, w, n, e]) => lat >= s && lat <= n && lon >= w && lon <= e);
  return hit?.[0] ?? null;
}

/**
 * Exchange rates with CNY as the base, from open.er-api.com (free, no key,
 * CORS enabled, updated daily). Returns e.g. { MYR: 0.61, USD: 0.15, ... }.
 */
export async function fetchCnyRates() {
  const response = await fetch("https://open.er-api.com/v6/latest/CNY", {
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data: { result: string; rates: Record<string, number>; time_last_update_unix: number } =
    await response.json();
  if (data.result !== "success") throw new Error("Rates API returned an error");
  return { rates: data.rates, updatedAt: data.time_last_update_unix * 1000 };
}

/** "MY" -> 🇲🇾 : flags are pairs of "regional indicator" emoji letters. */
export function flagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65));
}
