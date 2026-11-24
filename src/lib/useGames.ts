"use client";
/**
 * useGames: makes sure the game catalogue is loaded, and reports its status.
 *
 * Any component that shows games calls this. The first one to mount starts
 * the fetch; the thunk's `condition` stops the others from fetching again.
 *
 *   const { status, error, retry } = useGames();
 */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGames, selectGamesError, selectGamesStatus } from "@/store/slices/gamesSlice";

export function useGames() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectGamesStatus);
  const error = useAppSelector(selectGamesError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchGames());
  }, [status, dispatch]);

  return {
    status,
    error,
    retry: () => dispatch(fetchGames()),
  };
}
