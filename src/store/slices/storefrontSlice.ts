/**
 * storefrontSlice: state for the 商店 (store) page.
 *
 * 1. data: banner, releases, reservations and rankings, loaded once from
 *    /api/store with fetchStorefront (idle -> loading -> succeeded/failed).
 *    Because it lives in Redux, going Home and back to the store doesn't
 *    refetch: the data is still in the store.
 *
 * 2. recommendations: the 游戏推荐 grid is paginated. fetchMoreRecommendations
 *    loads the next page and *appends* it. It has its own status, so a failed
 *    "load more" shows an error under the grid without hiding what's loaded.
 *
 * 3. reservedIds: games the visitor clicked 预约 on. This is shared state:
 *    the same game can appear in the banner, the 预约进行中 cards and the
 *    预约之星 ranking, and all of them must agree.
 *
 * (Named "storefront", not "store", so code never reads `state.store`:
 * in Redux "store" already means the whole state container.)
 */
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Recommendation, Storefront } from "@/data/store";
import type { RootState } from "@/store";
import type { LoadStatus } from "./gamesSlice";

interface RecommendationsState {
  items: Recommendation[];
  /** Last page loaded (0 = none yet). */
  page: number;
  hasMore: boolean;
  status: LoadStatus;
  error: string | null;
}

export interface StorefrontState {
  data: Storefront | null;
  status: LoadStatus;
  error: string | null;
  recommendations: RecommendationsState;
  reservedIds: string[];
}

const initialState: StorefrontState = {
  data: null,
  status: "idle",
  error: null,
  recommendations: { items: [], page: 0, hasMore: true, status: "idle", error: null },
  reservedIds: [],
};

/** fetch() + JSON with friendly error messages, shared by both thunks. */
async function getJson<T>(url: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    // fetch() only throws when the network itself fails.
    throw new Error("网络连接失败，请检查网络后重试。");
  }
  if (!response.ok) throw new Error(`服务器出错了（${response.status}），请稍后重试。`);
  return response.json();
}

export const fetchStorefront = createAsyncThunk<
  Storefront,
  void,
  { state: RootState; rejectValue: string }
>(
  "storefront/fetchStorefront",
  async (_, { rejectWithValue }) => {
    try {
      return await getJson<Storefront>("/api/store");
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
  {
    // Skip if already loading or loaded (same pattern as fetchGames).
    condition: (_, { getState }) => {
      const { status } = getState().storefront;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

interface RecommendationsPage {
  items: Recommendation[];
  page: number;
  hasMore: boolean;
}

/** Loads the page after the last one we have. */
export const fetchMoreRecommendations = createAsyncThunk<
  RecommendationsPage,
  void,
  { state: RootState; rejectValue: string }
>(
  "storefront/fetchMoreRecommendations",
  async (_, { getState, rejectWithValue }) => {
    const nextPage = getState().storefront.recommendations.page + 1;
    try {
      return await getJson<RecommendationsPage>(`/api/store/recommendations/${nextPage}`);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
  {
    // Never load two pages at once, and stop at the end of the list.
    // This makes it safe to call from a scroll observer that fires often.
    condition: (_, { getState }) => {
      const { status, hasMore } = getState().storefront.recommendations;
      return status !== "loading" && hasMore;
    },
  },
);

const storefrontSlice = createSlice({
  name: "storefront",
  initialState,
  reducers: {
    /** 预约 / 已预约: reserve a game, or cancel the reservation. */
    toggleReservation(state, action: PayloadAction<string>) {
      const id = action.payload;
      // Immer lets us write "mutating" code; it produces a new state for us.
      if (state.reservedIds.includes(id)) {
        state.reservedIds = state.reservedIds.filter((reserved) => reserved !== id);
      } else {
        state.reservedIds.push(id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStorefront.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStorefront.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchStorefront.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "加载失败，请重试。";
      })
      .addCase(fetchMoreRecommendations.pending, (state) => {
        state.recommendations.status = "loading";
        state.recommendations.error = null;
      })
      .addCase(fetchMoreRecommendations.fulfilled, (state, action) => {
        const recs = state.recommendations;
        recs.status = "succeeded";
        recs.items.push(...action.payload.items); // append, don't replace
        recs.page = action.payload.page;
        recs.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMoreRecommendations.rejected, (state, action) => {
        state.recommendations.status = "failed";
        state.recommendations.error = action.payload ?? "加载失败，请重试。";
      });
  },
});

export const { toggleReservation } = storefrontSlice.actions;
export default storefrontSlice.reducer;

// ------------------------------------------------------------- Selectors ---

export const selectStorefront = (state: RootState) => state.storefront;
export const selectRecommendations = (state: RootState) => state.storefront.recommendations;
/** Usage: useAppSelector((state) => selectIsReserved(state, game.id)) */
export const selectIsReserved = (state: RootState, id: string) =>
  state.storefront.reservedIds.includes(id);
