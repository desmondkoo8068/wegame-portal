/**
 * Structure of the home portal: its full-screen "pages" and the 01–05 side
 * navigation that groups them.
 *
 * Some numbered groups span two pages (e.g. 02 焕新 has an "update" page and
 * a "performance" page), so each page names the nav group it belongs to.
 */

export interface SideNavItem {
  /** Nav group id, matched against each page's `nav`. */
  id: string;
  num: string;
  label: string;
}

export const sideNav: SideNavItem[] = [
  { id: "topic", num: "01", label: "大作" },
  { id: "frame", num: "02", label: "焕新" },
  { id: "feature", num: "03", label: "助手" },
  { id: "team", num: "04", label: "开黑" },
  { id: "university", num: "05", label: "高校" },
];

/** Every page in scroll order. `nav: null` = not part of the 01–05 nav. */
export const pages = [
  { id: "kv", nav: null },
  { id: "topic", nav: "topic" },
  { id: "frame-update", nav: "frame" },
  { id: "frame-fast", nav: "frame" },
  { id: "feature", nav: "feature" },
  { id: "team", nav: "team" },
  { id: "team-world", nav: "team" },
  { id: "university", nav: "university" },
  { id: "more", nav: null },
] as const;

export type PageId = (typeof pages)[number]["id"];

/** Look up which nav group a page belongs to. */
export function navForPage(pageId: string) {
  return pages.find((page) => page.id === pageId)?.nav ?? null;
}
