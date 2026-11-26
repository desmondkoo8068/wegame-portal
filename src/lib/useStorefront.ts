"use client";
/**
 * Hooks for the store page, wrapping storefrontSlice so components never
 * dispatch thunks or dig into the state shape themselves.
 *
 *   const { status, data, error, retry } = useStorefront();
 *   const { isReserved, toggle } = useReservation("dnf");
 */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchStorefront,
  selectIsReserved,
  selectStorefront,
  toggleReservation,
} from "@/store/slices/storefrontSlice";

/** Loads the store content on first use and reports its status. */
export function useStorefront() {
  const dispatch = useAppDispatch();
  const { status, data, error } = useAppSelector(selectStorefront);

  useEffect(() => {
    // Only the first visit fetches. After that the data stays in Redux,
    // so navigating Home -> Store again renders instantly.
    if (status === "idle") dispatch(fetchStorefront());
  }, [status, dispatch]);

  return { status, data, error, retry: () => dispatch(fetchStorefront()) };
}

/** Reservation state for one game. Every 预约 button uses this. */
export function useReservation(gameId: string) {
  const dispatch = useAppDispatch();
  const isReserved = useAppSelector((state) => selectIsReserved(state, gameId));
  return { isReserved, toggle: () => dispatch(toggleReservation(gameId)) };
}
