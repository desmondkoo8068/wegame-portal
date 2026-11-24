"use client";
/**
 * useDropdown: everything a navbar dropdown needs, in one reusable hook.
 *
 * The "which dropdown is open" state lives in Redux (ui.openDropdownId), so
 * opening one dropdown automatically closes any other. This hook adds the
 * behaviour users expect on top of that:
 *   - clicking the trigger toggles it (click-only on purpose: mixing hover
 *     and click makes a click close a menu that hover just opened)
 *   - clicking anywhere outside closes it
 *   - pressing Escape closes it
 *
 * Usage:
 *   const { isOpen, ref, toggle } = useDropdown("developers");
 *   <div ref={ref}> ... </div>
 */
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeDropdown, toggleDropdown } from "@/store/slices/uiSlice";

export function useDropdown(id: string) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.openDropdownId === id);

  // Points at the wrapper element, so we can tell "inside" from "outside" clicks.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only listen while open: no point paying for listeners otherwise.
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        dispatch(closeDropdown());
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(closeDropdown());
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    // Cleanup runs when the dropdown closes or the component unmounts.
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dispatch]);

  return {
    isOpen,
    ref,
    toggle: () => dispatch(toggleDropdown(id)),
    close: () => dispatch(closeDropdown()),
  };
}
