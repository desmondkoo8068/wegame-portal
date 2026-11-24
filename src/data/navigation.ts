/**
 * Static content for the Navbar and Footer.
 *
 * Keeping text and links here (instead of hard-coding them in JSX) means:
 * - components only care about *layout*, not content;
 * - the desktop nav and the mobile menu render from the same list, so they
 *   can never drift out of sync;
 * - swapping languages later only touches this file.
 *
 * Labels are English translations of the real wegame.com.cn navigation.
 * Pages we don't build in this mockup use "#" as their href.
 */

export interface NavLink {
  label: string;
  href: string;
  /** true for links that leave the site (opens in a new tab). */
  external?: boolean;
}

/** A top-level nav item: either a plain link, or a label with a dropdown. */
export interface NavItem {
  /** Stable id, also used as the dropdown id in Redux (ui.openDropdownId). */
  id: string;
  label: string;
  href?: string;
  children?: NavLink[];
}

export const mainNav: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "store", label: "Store", href: "#" },
  {
    id: "developers",
    label: "Developers",
    children: [
      { label: "Released Games", href: "https://developer.wegame.com", external: true },
      {
        label: "Beta Test Games",
        href: "https://developer.wegame.com/service/test-area.html",
        external: true,
      },
    ],
  },
  { id: "creators", label: "Creator Program", href: "#" },
];

/** Small icon links on the right side of the navbar. */
export const utilityLinks = [
  { id: "changelog", label: "Changelog", href: "#", icon: "changelog" },
  { id: "help", label: "Help & Feedback", href: "#", icon: "help" },
] as const;

/** Options in the "Download Client" panel. */
export const downloadOptions: NavLink[] = [
  { label: "Windows Client 3.0", href: "#" },
  { label: "Mac (Intel)", href: "#" },
  { label: "Mac (Apple M-series)", href: "#" },
];

// ---------------------------------------------------------------- Footer ---

export const socialLinks: NavLink[] = [
  { label: "Weibo", href: "https://weibo.com/u/6068787464", external: true },
  { label: "bilibili", href: "https://space.bilibili.com/1208379085", external: true },
];

export const qrCodes = [
  { id: "wechat-official", caption: "WeChat Official Account" },
  { id: "wechat-channels", caption: "WeChat Channels" },
];

export const legalLinks: NavLink[] = [
  { label: "About Tencent", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Software License", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Children's Privacy", href: "#" },
  { label: "Anti-Addiction Pact", href: "#" },
  { label: "Infringement Notice", href: "#" },
  { label: "Advertising", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Customer Service", href: "#" },
  { label: "Contact Us", href: "#" },
];

export const registrationInfo = [
  "ICP License: 粤B2-20090059-376",
  "Guangdong Public Security Filing 44030502008701",
];
