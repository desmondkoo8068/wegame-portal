/**
 * Is a nav link "active" for the current URL?
 *
 * A section link stays highlighted on its sub-pages: 商店 (/store) is
 * active on /store/ai and /store/video too. "/" only matches itself,
 * otherwise 首页 would be active everywhere.
 *
 *   isActivePath("/store/ai", "/store") -> true
 *   isActivePath("/store", "/")         -> false
 */
export function isActivePath(pathname: string, href: string) {
  if (href === "/" || href === "#") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
