/**
 * geoSlice: the visitor's location → local currency (bonus feature).
 *
 * Two independent async flows, each with its own idle/loading/succeeded/
 * failed status so the UI can show exactly what is happening:
 *
 *   detectLocation()  browser permission → coordinates → country → currency
 *   fetchRates()      CNY exchange-rate table (loaded once, reused when the
 *                     visitor switches currency manually)
 *
 * Prices are stored in CNY; selectLocalPrice() converts them. Until a rate
 * is available everything simply stays in CNY, so prices never disappear.
 */
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { BASE_CURRENCY, currencyForCountry } from "@/data/currencies";
import { fetchCnyRates, getCurrentPosition, lookupCountry, type GeoError } from "@/lib/geo";
import type { RootState } from "@/store";
import type { LoadStatus } from "./gamesSlice";

export interface GeoState {
  status: LoadStatus;
  error: GeoError | null;
  /** How the currency was chosen. */
  source: "default" | "location" | "manual";
  countryCode: string | null;
  /** True when the country came from the offline fallback, not the API. */
  approximate: boolean;
  currency: string;
  rates: {
    status: LoadStatus;
    error: string | null;
    table: Record<string, number> | null;
    updatedAt: number | null;
  };
}

const initialState: GeoState = {
  status: "idle",
  error: null,
  source: "default",
  countryCode: null,
  approximate: false,
  currency: BASE_CURRENCY,
  rates: { status: "idle", error: null, table: null, updatedAt: null },
};

/** Load the exchange-rate table. Skipped if it's loading or already loaded. */
export const fetchRates = createAsyncThunk<
  Awaited<ReturnType<typeof fetchCnyRates>>,
  void,
  { state: RootState; rejectValue: string }
>(
  "geo/fetchRates",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCnyRates();
    } catch {
      return rejectWithValue("汇率加载失败，价格暂以人民币显示。");
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().geo.rates;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

/** Ask for the visitor's location and work out their country + currency. */
export const detectLocation = createAsyncThunk<
  { countryCode: string; currency: string; approximate: boolean },
  void,
  { state: RootState; rejectValue: GeoError }
>(
  "geo/detectLocation",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Start loading rates in parallel: we'll almost certainly need them.
      dispatch(fetchRates());

      const { latitude, longitude } = await getCurrentPosition();
      const country = await lookupCountry(latitude, longitude);
      if (!country) {
        return rejectWithValue({ code: "LOOKUP_FAILED", message: "无法识别你所在的国家或地区。" });
      }
      return {
        countryCode: country.countryCode,
        currency: currencyForCountry(country.countryCode),
        approximate: country.source === "offline",
      };
    } catch (error) {
      // getCurrentPosition rejects with a GeoError; anything else is unexpected.
      const geoError = error as Partial<GeoError>;
      return rejectWithValue(
        geoError.code
          ? (geoError as GeoError)
          : { code: "LOOKUP_FAILED", message: "定位时发生未知错误。" },
      );
    }
  },
  {
    condition: (_, { getState }) => getState().geo.status !== "loading",
  },
);

const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    /** Manual pick from the currency list (e.g. when location is denied). */
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
      state.source = action.payload === BASE_CURRENCY ? "default" : "manual";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectLocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(detectLocation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.source = "location";
        state.countryCode = action.payload.countryCode;
        state.currency = action.payload.currency;
        state.approximate = action.payload.approximate;
      })
      .addCase(detectLocation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? { code: "LOOKUP_FAILED", message: "定位失败。" };
      })
      .addCase(fetchRates.pending, (state) => {
        state.rates.status = "loading";
        state.rates.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.rates.status = "succeeded";
        state.rates.table = action.payload.rates;
        state.rates.updatedAt = action.payload.updatedAt;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.rates.status = "failed";
        state.rates.error = action.payload ?? "汇率加载失败。";
      });
  },
});

export const { setCurrency } = geoSlice.actions;
export default geoSlice.reducer;

// ------------------------------------------------------------- Selectors ---

export const selectGeo = (state: RootState) => state.geo;

/**
 * The currency prices should actually be shown in, plus the rate to use.
 * If the rate for the chosen currency isn't available (yet), fall back to
 * CNY with rate 1, so a price is always shown and is never wrong.
 *
 * createSelector memoizes the result object: without it, every call would
 * return a new object and re-render every <Price> on any store change.
 */
export const selectDisplayCurrency = createSelector(
  [(state: RootState) => state.geo.currency, (state: RootState) => state.geo.rates.table],
  (currency, table) => {
    if (currency === BASE_CURRENCY) return { currency, rate: 1, converted: false };
    const rate = table?.[currency];
    return rate
      ? { currency, rate, converted: true }
      : { currency: BASE_CURRENCY, rate: 1, converted: false };
  },
);
