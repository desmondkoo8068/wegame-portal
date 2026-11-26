/**
 * Static content for the header and footer, copied from wegame.com.cn.
 *
 * Keeping text and links here (instead of hard-coding them in JSX) means:
 * - components only care about *layout*, not content;
 * - the desktop nav and the mobile menu render from the same list, so they
 *   can never drift out of sync.
 *
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
  { id: "home", label: "首页", href: "/" },
  { id: "store", label: "商店", href: "/store" },
  {
    id: "developers",
    label: "开发者平台",
    children: [
      { label: "正式发行游戏", href: "https://developer.wegame.com", external: true },
      {
        label: "先锋测试游戏",
        href: "https://developer.wegame.com/service/test-area.html",
        external: true,
      },
    ],
  },
];

/** Placeholder text in the header search box (as on the live site). */
export const searchPlaceholder = "《蓝色星原：旅谣》预下载今日开启";

/** Small icon links on the right side of the header. */
export const utilityLinks = [
  { id: "changelog", label: "更新日志", href: "#", icon: "changelog" },
  { id: "feedback", label: "帮助与反馈", href: "#", icon: "feedback" },
] as const;

/** Options in the "下载客户端" menu. */
export const downloadOptions: NavLink[] = [
  { label: "Windows 版", href: "#" },
  { label: "Mac 版（Intel 芯片）", href: "#" },
  { label: "Mac 版（M 系列芯片）", href: "#" },
];

// ---------------------------------------------------------------- Footer ---

export const footerDownloads: NavLink[] = [
  { label: "Windows版", href: "#" },
  { label: "Mac版（测试版）", href: "#" },
];

export const socialLinks: NavLink[] = [
  { label: "微博", href: "https://weibo.com/u/6068787464", external: true },
  { label: "bilibili", href: "https://space.bilibili.com/1208379085", external: true },
];

export const qrCodes = [
  { src: "/wegame/qrcode-wechat.jpg", caption: "关注微信公众号" },
  { src: "/wegame/qrcode-wechat-video.jpg", caption: "关注微信视频号" },
];

export const friendLinks: NavLink[] = [
  { label: "INDIENOVA", href: "https://indienova.com/", external: true },
  { label: "腾讯GWB", href: "https://gwb.tencent.com/", external: true },
  { label: "腾讯动漫", href: "http://ac.qq.com", external: true },
  { label: "腾讯视频", href: "http://v.qq.com", external: true },
];

export const legalLinks: NavLink[] = [
  { label: "关于腾讯", href: "https://www.tencent.com/zh-cn/index.html", external: true },
  { label: "服务条款", href: "https://www.qq.com/contract.shtml", external: true },
  { label: "软件许可及服务协议", href: "#" },
  { label: "隐私保护指引", href: "#" },
  {
    label: "儿童隐私保护指引",
    href: "https://privacy.qq.com/privacy-children.htm",
    external: true,
  },
  {
    label: "网络游戏行业防沉迷自律公约",
    href: "https://game.qq.com/self-discipline_pact.shtml",
    external: true,
  },
  {
    label: "侵权通知",
    href: "https://developer.wegame.com/developer/static/infringement.html",
    external: true,
  },
  { label: "广告服务", href: "http://www.tencentmind.com/", external: true },
  { label: "腾讯招聘", href: "https://hr.tencent.com/", external: true },
  { label: "客服中心", href: "https://kf.qq.com/index.html", external: true },
  { label: "联系我们", href: "#" },
];

export const registration = {
  icp: { label: "ICP备案号：粤B2-20090059-376", href: "https://beian.miit.gov.cn/" },
  police: {
    label: "粤公网安备 44030502008701号",
    href: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502008701",
  },
};
