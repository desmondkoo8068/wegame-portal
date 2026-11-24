/**
 * uiSlice: shared UI state that more than one component needs.
 *
 * - isMobileMenuOpen: the hamburger (in Navbar) and the menu panel
 *   (MobileMenu) are separate components that both need this flag.
 * - openDropdownId: only one header dropdown may be open at a time, so we
 *   store *which* one is open instead of a boolean per dropdown.
 * - isLocaleModalOpen: the 地区与货币 modal is opened from the header and
 *   the mobile menu, and rendered once elsewhere.
 * - activePage: the full-screen page currently in view. The side nav
 *   highlights its group, and the page itself plays its entrance animation.
 *
 * Purely local state (e.g. which tab a carousel shows) stays in that
 * component's useState. Redux is for state that is *shared*.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PageId } from "@/data/home";

export interface UiState {
  isMobileMenuOpen: boolean;
  openDropdownId: string | null;
  isLocaleModalOpen: boolean;
  activePage: PageId;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  openDropdownId: null,
  isLocaleModalOpen: false,
  // The hero is what's on screen when the page first loads.
  activePage: "kv",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  // Redux Toolkit uses Immer, so these "mutations" are safe immutable updates.
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      // Opening the mobile menu should never leave a desktop dropdown open.
      state.openDropdownId = null;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
    /** Open a dropdown by id; toggling the open one closes it. */
    toggleDropdown(state, action: PayloadAction<string>) {
      state.openDropdownId = state.openDropdownId === action.payload ? null : action.payload;
    },
    closeDropdown(state) {
      state.openDropdownId = null;
    },
    openLocaleModal(state) {
      state.isLocaleModalOpen = true;
      // The modal can be opened from the mobile menu; close that behind it.
      state.isMobileMenuOpen = false;
      state.openDropdownId = null;
    },
    closeLocaleModal(state) {
      state.isLocaleModalOpen = false;
    },
    setActivePage(state, action: PayloadAction<PageId>) {
      state.activePage = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleDropdown,
  closeDropdown,
  openLocaleModal,
  closeLocaleModal,
  setActivePage,
} = uiSlice.actions;

export default uiSlice.reducer;
