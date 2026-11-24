"use client";
/**
 * Navbar: sticky header shown on every page, laid out like wegame.com.cn.
 *
 * Desktop (>= lg): logo · 首页 / 商店 / 开发者平台▾ · search box ·
 *                  creator badge · changelog + feedback icons ·
 *                  下载客户端▾ · 登录
 * Mobile/tablet:   logo · hamburger (links live in <MobileMenu>)
 *
 * State: mobile menu + dropdowns are in Redux (shared between components).
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseIcon, MenuIcon, SearchIcon, UserIcon, iconsByName } from "@/components/ui/Icons";
import { mainNav, searchPlaceholder, utilityLinks } from "@/data/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/store/slices/uiSlice";
import NavDropdown from "./NavDropdown";
import DownloadMenu from "./DownloadMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const pathname = usePathname();

  return (
    // MobileMenu is a *sibling* of <header>, not a child: the header's
    // backdrop-blur creates a new containing block, which would trap a
    // `position: fixed` child inside the header.
    <>
      <header className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-page/85 backdrop-blur-md">
        <div className="flex h-full items-center gap-6 px-4 lg:gap-10 lg:px-6">
          <Link href="/" aria-label="WeGame 首页" className="shrink-0">
            <Image
              src="/wegame/icon-logo.svg"
              alt="WeGame"
              width={194}
              height={49}
              priority
              className="h-7 w-auto lg:h-9"
            />
          </Link>

          {/* ---------- Desktop navigation ---------- */}
          <nav aria-label="主导航" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-10">
              {mainNav.map((item) => (
                <li key={item.id} className="h-full">
                  {item.children ? (
                    <NavDropdown item={item} />
                  ) : (
                    <Link
                      href={item.href ?? "#"}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="nav-link"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Search: UI only in this mockup, so submitting does nothing. */}
          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="hidden h-9 w-72 items-center rounded bg-white/10 pl-3 pr-1 xl:flex"
          >
            <label htmlFor="site-search" className="sr-only">
              搜索游戏
            </label>
            <input
              id="site-search"
              type="search"
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="搜索"
              className="p-1.5 text-white/60 hover:text-white"
            >
              <SearchIcon width={18} height={18} />
            </button>
          </form>

          {/* ---------- Desktop right-side actions ---------- */}
          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <a href="#" title="视频创作者招募计划" className="transition-transform hover:scale-105">
              <Image
                src="/wegame/link-entry-creator.png"
                alt="视频创作者招募计划"
                width={260}
                height={104}
                className="h-9 w-auto"
              />
            </a>
            {utilityLinks.map(({ id, label, href, icon }) => {
              const Icon = iconsByName[icon];
              return (
                <a
                  key={id}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon width={26} height={26} />
                </a>
              );
            })}
            <DownloadMenu />
            <button type="button" className="btn-glass">
              <UserIcon width={18} height={18} />
              登录
            </button>
          </div>

          {/* ---------- Mobile hamburger ---------- */}
          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
            className="ml-auto rounded p-2 text-white hover:bg-white/10 lg:hidden"
          >
            {isMobileMenuOpen ? (
              <CloseIcon width={24} height={24} />
            ) : (
              <MenuIcon width={24} height={24} />
            )}
          </button>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
