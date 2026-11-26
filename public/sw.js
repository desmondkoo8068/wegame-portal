/*
 * Service worker: makes the site load offline and speeds up repeat visits.
 *
 * It sits between the page and the network and decides, per request, whether
 * to answer from the cache or from the network. Written by hand (no library)
 * so each rule is easy to read.
 *
 * Strategies:
 *   Pages (navigations)   network first, so visitors always get the latest
 *                         page; fall back to the cached copy, then to
 *                         /offline.html.
 *   Hashed build files    cache first: files under /_next/static/ never
 *                         change for a given URL, so reuse them forever.
 *   Images, fonts, icons  stale-while-revalidate: show the cached copy
 *                         instantly and refresh it in the background.
 *   /api/* (JSON data)    network first with cache fallback, so the game
 *                         wall and store content work offline.
 *   First-visit files     the page sends the list of files it already loaded
 *                         (see ServiceWorkerRegister), because the worker
 *                         isn't in control yet while a first visit loads.
 *   Videos                never cached: they are large, and use Range
 *                         requests that the Cache API can't store properly.
 *
 * Bump VERSION to invalidate every cache on the next deploy.
 */
const VERSION = "v2";
const PRECACHE = `wegame-precache-${VERSION}`;
const RUNTIME = `wegame-runtime-${VERSION}`;

// /_next/image responses carry "Vary: Accept". A cached copy only matches a
// request with the same Accept header, so lookups must ignore Vary or the
// page's own image requests would miss what we cached ourselves.
const MATCH_OPTIONS = { ignoreVary: true };
const IMAGE_ACCEPT = "image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8";

// The minimum needed to show something useful with no network.
const PRECACHE_URLS = [
  "/offline.html",
  "/icons/icon-192.png",
  "/wegame/icon-logo.svg",
  "/wegame/video/kv-poster.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await cache.addAll(PRECACHE_URLS);
      // Best effort: also cache the home page. If it fails (e.g. a flaky
      // network during install) we still install successfully.
      await cache.add("/").catch(() => {});
      // Activate this version right away instead of waiting for old tabs to close.
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete caches from older versions.
      const keep = new Set([PRECACHE, RUNTIME]);
      const names = await caches.keys();
      await Promise.all(names.filter((name) => !keep.has(name)).map((name) => caches.delete(name)));
      // Take control of already-open tabs.
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests; let everything else pass through.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Videos and Range requests: skip the cache entirely.
  if (request.headers.has("range") || /\.(mp4|webm)$/i.test(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
  } else if (/\.(png|jpe?g|svg|avif|webp|gif|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  } else if (url.pathname.startsWith("/_next/image")) {
    // Next's optimised images, e.g. /_next/image?url=...&w=640
    event.respondWith(staleWhileRevalidate(request));
  }
});

// The page posts { type: "CACHE_URLS", urls: [...] } after the worker is ready.
self.addEventListener("message", (event) => {
  if (event.data?.type === "CACHE_URLS") event.waitUntil(cacheUrls(event.data.urls));
});

/** Cache files the page already loaded, skipping ones we have and videos. */
async function cacheUrls(urls) {
  const cache = await caches.open(RUNTIME);
  await Promise.all(
    urls.map(async (href) => {
      const url = new URL(href, self.location.origin);
      if (url.origin !== self.location.origin || /\.(mp4|webm)$/i.test(url.pathname)) return;
      if (await cache.match(url.href, MATCH_OPTIONS)) return;
      try {
        // Ask for images the way a browser does, so /_next/image returns the
        // same variant the page itself would have received.
        const response = await fetch(url.href, { headers: { Accept: IMAGE_ACCEPT } });
        if (response.ok) await cache.put(url.href, response);
      } catch {
        // Ignore: this file will be cached the next time it is requested.
      }
    }),
  );
}

/** Pages: try the network, remember the result, fall back when offline. */
async function navigationStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, MATCH_OPTIONS);
    return cached ?? (await caches.match("/offline.html")) ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request, MATCH_OPTIONS);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, MATCH_OPTIONS);
    return cached ?? Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request, MATCH_OPTIONS);
  // Start the refresh now; it updates the cache for next time.
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  // Cached copy wins if we have one; otherwise wait for the network.
  return cached ?? (await refresh) ?? Response.error();
}
