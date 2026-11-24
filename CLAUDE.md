# WeGame Portal: Frontend Engineering Challenge

## Goal
Responsive mockup of https://www.wegame.com.cn/home/, installable as a PWA,
deployed on Vercel. Bonus: Geolocation API + local currency display.
Graded on: code quality, component structure, state management, CSS
architecture, loading/error states. Quality over 100% completion.

## Stack
- Next.js (App Router, `src/` dir), TypeScript, Tailwind CSS
- Redux Toolkit + react-redux (all shared state goes in Redux)
- Node 22 (run `nvm use 22` in every terminal)

## Folder structure
src/app (pages, layout, manifest), src/components/{layout,home,ui},
src/store/{index.ts,hooks.ts,StoreProvider.tsx,slices/}, src/data, src/lib

## Conventions
- Clean, readable, commented code. I am learning, so explain what you do.
- Use typed hooks useAppDispatch / useAppSelector, never raw useDispatch.
- One slice per feature. Async work (geolocation) uses createAsyncThunk
  with idle/loading/succeeded/failed states.
- Write core layout and logic from scratch (no boilerplate clones).

## Roadmap
1. Setup + Redux store (done)
2. Navbar (sticky, dropdown, mobile menu) + Footer
3. Hero slider, game sections
4. Responsive tuning (desktop/tablet/mobile)
5. PWA: manifest, icons, service worker, offline page
6. Bonus: geolocation + currency
7. Deploy to Vercel
