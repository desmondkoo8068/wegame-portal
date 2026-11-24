/**
 * Redux store setup.
 *
 * Why `makeStore()` instead of a single exported `store`?
 * In Next.js the same server process renders pages for many different
 * visitors. A module-level store would be shared between all of them and
 * could leak one user's state into another's page. So we export a *factory*
 * and create one store per browser session inside <StoreProvider>.
 */
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import gamesReducer from "./slices/gamesSlice";

export const makeStore = () =>
  configureStore({
    // Each key here becomes a top-level branch of the state tree,
    // e.g. state.ui.isMobileMenuOpen. Add new feature slices here.
    reducer: {
      ui: uiReducer,
      games: gamesReducer,
    },
  });

// Types derived from the store itself, so they stay correct automatically
// whenever a slice is added or changed.
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
