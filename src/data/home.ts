/**
 * Structure of the home portal: its full-screen "pages", the 01–05 side
 * navigation, and the content of each page.
 *
 * On desktop the home page works like a slideshow (see PageFlow): one page
 * fills the screen, and each mouse-wheel step cross-fades to the next one.
 * A page can have several `steps` that play inside the same page before the
 * flow moves on (02 焕新 shows "update", then "performance").
 */

export const pages = [
  { id: "kv", steps: 1 },
  { id: "topic", steps: 1 },
  { id: "frame", steps: 2 },
  { id: "feature", steps: 1 },
  { id: "team", steps: 1 },
  { id: "university", steps: 1 },
  { id: "more", steps: 1 },
] as const;

export type PageId = (typeof pages)[number]["id"];

/** Position of a page in the flow (0 = top). */
export const pageIndex = (id: PageId) => pages.findIndex((page) => page.id === id);

export interface SideNavItem {
  page: PageId;
  num: string;
  label: string;
}

/** The fixed 01–05 navigation on the right edge. */
export const sideNav: SideNavItem[] = [
  { page: "topic", num: "01", label: "大作" },
  { page: "frame", num: "02", label: "焕新" },
  { page: "feature", num: "03", label: "助手" },
  { page: "team", num: "04", label: "开黑" },
  { page: "university", num: "05", label: "高校" },
];

/* ---------- 03 助手: the feature slides ---------- */

export interface FeatureSlide {
  id: "val" | "lol" | "ai";
  /** Tab label; the visible tab text is an image (feature-item-N.svg). */
  tab: string;
  subtitle: { src: string; alt: string };
  title: { src: string; alt: string };
}

export const featureSlides: FeatureSlide[] = [
  {
    id: "val",
    tab: "01 点位教学",
    subtitle: { src: "/wegame/feature-subtitle-1.svg", alt: "无畏契约助手" },
    title: { src: "/wegame/feature-title-3.svg", alt: "点位教学" },
  },
  {
    id: "lol",
    tab: "02 符文与装备推荐",
    subtitle: { src: "/wegame/feature-subtitle-2.svg", alt: "英雄联盟助手" },
    title: { src: "/wegame/feature-title-4.svg", alt: "符文与装备推荐" },
  },
  {
    id: "ai",
    tab: "03 AI 游戏助手",
    subtitle: { src: "/wegame/feature-subtitle-4.svg", alt: "AI 赋能好用好玩" },
    title: { src: "/wegame/feature-title-6.svg", alt: "智能有趣的 AI 助手" },
  },
];

/* ---------- 04 开黑 ---------- */

/** Party row: avatar + role icon. The middle seat is the "invite" slot. */
export const teamMembers = [
  { avatar: "01", icon: "102" },
  { avatar: "02", icon: "101" },
  { avatar: "03", icon: "104" },
  { avatar: "04", icon: "100" },
  { avatar: "05", icon: "103" },
];

/* ---------- 05 高校 ---------- */

export const universityFeatures = [
  { src: "/wegame/college-feature-01.svg", alt: "快捷认证：游戏福利一站通关" },
  { src: "/wegame/college-feature-02.svg", alt: "大佬聚集：轻松找到同校搭子" },
  { src: "/wegame/college-feature-03.svg", alt: "同校竞技：解锁专属排行荣誉" },
];

export const universityMessages = [
  "蛋蛋君已完成高校认证",
  "三角洲求大佬带飞",
  "让我看看本校榜一是谁",
  "这周的福利到手啦",
  "找个校友一起开黑",
  "下次一定要打赢隔壁",
];
