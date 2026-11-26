/**
 * uiSlice: shared UI state that more than one component needs.
 *
 * - isMobileMenuOpen: the hamburger (in Navbar) and the menu panel
 *   (MobileMenu) are separate components that both need this flag.
 * - openDropdownId: only one header dropdown may be open at a time, so we
 *   store *which* one is open instead of a boolean per dropdown.
 * - isLocaleModalOpen: the 地区与货币 modal is opened from the header and
 *   the mobile menu, and rendered once elsewhere.
 * - activePage / pageStep: the home page "slide" on screen (and the step
 *   inside it, e.g. 02 焕新 has two). The side nav, the footer, videos and
 *   each page's entrance animation all depend on it.
 * - isFullPage: true when the screen suits the desktop slideshow (wide,
 *   landscape). Otherwise the home page is a normal scrolling page.
 *
 * Purely local state (e.g. which tab a carousel shows) stays in that
 * component's useState. Redux is for state that is *shared*.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { pageIndex, pages, type PageId } from "@/data/home";

export interface UiState {
  isMobileMenuOpen: boolean;
  openDropdownId: string | null;
  isLocaleModalOpen: boolean;
  activePage: PageId;
  pageStep: number;
  isFullPage: boolean;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
  openDropdownId: null,
  isLocaleModalOpen: false,
  // The hero is what's on screen when the page first loads.
  activePage: "kv",
  pageStep: 0,
  // Decided in the browser (PageFlow); the server can't know the screen size.
  isFullPage: false,
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
    /** Jump straight to a page (side nav, back-to-top, scroll tracking). */
    goToPage(state, action: PayloadAction<PageId>) {
      if (state.activePage === action.payload) return;
      state.activePage = action.payload;
      state.pageStep = 0;
    },
    /**
     * One wheel/keyboard step forwards (+1) or backwards (-1).
     * Steps inside the current page come first; then the flow moves to the
     * next page, entering on its first step (or its last one when going back).
     * Kept here as a pure function of the state, so it's easy to test.
     */
    scrollPage(state, action: PayloadAction<1 | -1>) {
      const direction = action.payload;
      const index = pageIndex(state.activePage);
      const step = state.pageStep + direction;

      if (step >= 0 && step < pages[index].steps) {
        state.pageStep = step;
        return;
      }
      const next = pages[index + direction];
      if (!next) return; // already at the first/last page
      state.activePage = next.id;
      state.pageStep = direction === 1 ? 0 : next.steps - 1;
    },
    setFullPage(state, action: PayloadAction<boolean>) {
      state.isFullPage = action.payload;
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
  goToPage,
  scrollPage,
  setFullPage,
} = uiSlice.actions;

export default uiSlice.reducer;
