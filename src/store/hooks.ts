/**
 * Typed versions of the react-redux hooks.
 *
 * Use these everywhere instead of the plain `useDispatch` / `useSelector`:
 * - useAppSelector knows the shape of RootState, so `state.ui...` autocompletes
 *   and typos are caught by TypeScript.
 * - useAppDispatch knows about thunks (createAsyncThunk), so dispatching
 *   async actions type-checks correctly.
 */
import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
