/**
 * uiSlice: shared UI state that more than one component needs to know about.
 *
 * Examples:
 * - The Navbar's hamburger button opens the mobile menu, and the menu panel
 *   (a separate component) needs to read that same flag.
 * - Only one desktop dropdown should be open at a time, so we store *which*
 *   one is open (by id) instead of a boolean per dropdown.
 *
 * Purely local state (e.g. a hover effect inside a single component) should
 * stay in that component's useState. Redux is for state that is *shared*.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  /** Is the mobile navigation menu open? */
  isMobileMenuOpen: boolean;
  /** Id of the currently open navbar dropdown, or null if none is open. */
  openDropdownId: string | null;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  openDropdownId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  // Redux Toolkit uses Immer under the hood, so these "mutations" are safe:
  // Immer turns them into immutable updates for us.
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      // Opening the mobile menu should never leave a desktop dropdown open.
      state.openDropdownId = null;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
    /** Open a dropdown by id; clicking the same one again closes it. */
    toggleDropdown(state, action: PayloadAction<string>) {
      state.openDropdownId = state.openDropdownId === action.payload ? null : action.payload;
    },
    closeDropdown(state) {
      state.openDropdownId = null;
    },
  },
});

// Action creators, used like: dispatch(toggleMobileMenu())
export const { toggleMobileMenu, closeMobileMenu, toggleDropdown, closeDropdown } = uiSlice.actions;

export default uiSlice.reducer;
