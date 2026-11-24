# WeGame Portal: Frontend Engineering Challenge

A responsive recreation of the [WeGame home page](https://www.wegame.com.cn/home/), installable as a Progressive Web App, with the geolocation + local currency bonus.

**Live:** _Vercel URL to be added after deployment_

| Requirement | Where |
|---|---|
| Responsive UI mockup (desktop / tablet / mobile) | `src/components/home`, `src/components/layout` |
| Core interactions | Feature slider, rotating slogans, header dropdowns, sticky header, 01–05 side nav, mobile menu |
| PWA: manifest, icons, service worker, offline page | `src/app/manifest.ts`, `public/sw.js`, `public/offline.html` |
| Deployed on Vercel | See **Live** above |
| Bonus: geolocation → local currency | 地区与货币 button in the header (`src/components/locale`) |

## Running it

Requires **Node 22** (see `.nvmrc`).

```sh
nvm use 22
npm install
npm run dev          # http://localhost:3000
```

The service worker is only registered in production builds:

```sh
npm run build && npm start
```

Checks: `npm run lint` and `npm run typecheck`.

## Tech stack

- **Next.js 16** (App Router, `src/` directory) with **TypeScript**
- **Tailwind CSS v4** for styling
- **Redux Toolkit** + react-redux for shared state
- No UI, carousel, PWA or i18n libraries: the layout, slider logic, service worker and geolocation flow are written by hand.

## Project structure

```
src/
  app/            layout, home page, web app manifest, /api/games route
  components/
    home/         one component per full-screen section (hero, 01–05, closing banner)
    layout/       header, mobile menu, footer, side nav, page tracker, SW registration
    locale/       geolocation + currency button and modal (bonus)
    ui/           reusable pieces: Stage, AutoVideo, Price, ErrorState, icons
  data/           static content: navigation, page order, games, currency table
  lib/            hooks (useCarousel, useDropdown, useGames) and helpers (geo, format)
  store/          Redux store, typed hooks, slices (ui, games, geo)
public/
  wegame/         images and videos taken from the live site (see Assets)
  icons/          PWA icons (standard + maskable)
  sw.js           service worker
  offline.html    offline fallback page
```

## Key decisions

### State management

Redux holds only state that several components share. State used by a single component stays in `useState`.

| Slice | State | Why shared |
|---|---|---|
| `ui` | mobile menu, open dropdown, currency modal, **active page** | The hamburger and the menu panel are separate components. The active page drives both the side nav highlight and each section's entrance animation. |
| `games` | game catalogue from `/api/games` | Used by the poster wall and the currency modal |
| `geo` | location, currency, exchange rates | Every `<Price>` on the page converts with it |

The async work (`fetchGames`, `detectLocation`, `fetchRates`) uses `createAsyncThunk` with `idle / loading / succeeded / failed` states. `condition` guards make sure that several components asking for the same data trigger only one request.

### Loading and error states

- **Game posters:** skeletons while loading; a retry message if the request fails.
- **Videos (`AutoVideo`):** show a poster frame until playable and keep it if the video fails. They only play while their section is on screen, and never autoplay when the visitor prefers reduced motion.
- **Geolocation:** each failure has its own message and fix: unsupported browser, permission denied, position unavailable, timeout, lookup failed. A manual currency picker is always available.
- **Exchange rates:** if they fail to load, prices stay in CNY instead of disappearing.

### CSS architecture

`src/app/globals.css` is organised in three layers:

1. **Design tokens** in `@theme`: colours sampled from the live site, the font stack and animations. Tailwind turns them into utilities such as `bg-brand`.
2. **Base:** page scroll-snapping and reduced-motion handling.
3. **Components:** a few reusable classes, e.g. `.page-section`, `.stage`, `.reveal` and the button styles.

Everything else is Tailwind utilities in the JSX.

The live site is designed on a 1440×900 canvas. A `--dp` CSS variable ("design pixel") and the `<Stage>` / `<StageItem>` components scale that canvas to any desktop viewport. This lets the desktop composition use the real site's coordinates. Below 1024px, sections switch to a normal stacked layout.

On desktop, sections snap one per screen using CSS `scroll-snap` rather than wheel hijacking, so keyboard, trackpad and the scrollbar all behave normally. An `IntersectionObserver` (`PageTracker`) reports the visible section to Redux.

### PWA

`public/sw.js` is hand-written so each caching rule is visible:

| Request | Strategy |
|---|---|
| Pages | Network first, then the cached page, then `offline.html` |
| `/_next/static/*` (hashed build files) | Cache first |
| Images and icons | Stale-while-revalidate |
| `/api/games` | Network first, with the cache as fallback |
| Videos | Not cached (large files that use range requests) |

On a first visit the worker isn't in control yet, so the page sends it the list of files it already loaded. This makes the site work offline from the second visit onward. Cache lookups ignore `Vary`, because `next/image` responses vary on `Accept`.

Verified in headless Chrome:

- Chrome reports no installability errors.
- With the server stopped, the cached home page loads with all images.
- A page that was never visited shows the offline page.

### Bonus: geolocation and local currency

1. The browser Geolocation API provides coordinates. These are rounded to about 1 km before leaving the browser, since only the country is needed.
2. BigDataCloud's free client-side reverse geocoding turns the coordinates into a country code. If it's unreachable, an offline bounding-box table is used instead.
3. A small table maps the country to its currency (MY → MYR, ID → IDR, US → USD and so on).
4. Exchange rates come from open.er-api.com (free, no key) and are loaded once.
5. `<Price>` converts every CNY price on the site. Currency symbols shared by several currencies (`$`, `¥`) are shown as codes, e.g. `SGD 51.78`.

## Assets

Images, videos and icons were taken from the live site with browser DevTools, as the brief allows. The two videos were re-encoded from 36 MB to 9.7 MB. All artwork belongs to Tencent, and this is an unofficial practice project (stated in the footer).
