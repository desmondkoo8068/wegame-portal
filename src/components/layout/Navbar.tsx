"use client";
/**
 * Navbar: sticky top bar shown on every page.
 *
 * Layout by screen size:
 *   - Mobile/tablet (< lg): logo + hamburger button. The links live in
 *     <MobileMenu>, which slides down when the hamburger is pressed.
 *   - Desktop (>= lg): logo, main links (with dropdowns), then icon links,
 *     the Download Client menu and Log in on the right.
 *
 * State:
 *   - Mobile menu + dropdowns: Redux (shared between components).
 *   - "Has the page been scrolled?": local useState, because only the
 *     navbar cares about it. It makes the bar more opaque once you scroll.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { CloseIcon, MenuIcon, iconsByName } from "@/components/ui/Icons";
import { mainNav, utilityLinks } from "@/data/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/store/slices/uiSlice";
import NavDropdown from "./NavDropdown";
import DownloadMenu from "./DownloadMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll(); // set the right value if the page loads already scrolled
    // `passive: true` tells the browser we never call preventDefault(),
    // so scrolling stays smooth.
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Solid background when scrolled OR when the mobile menu is open.
  const isSolid = isScrolled || isMobileMenuOpen;

  return (
    // MobileMenu is a *sibling* of <header>, not a child: the header's
    // backdrop-blur creates a new containing block, which would trap a
    // `position: fixed` child inside the 64px-tall header.
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          isSolid
            ? "border-line bg-surface/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="container-page flex h-16 items-center gap-8">
          <Logo />

          {/* ---------- Desktop navigation ---------- */}
          <nav aria-label="Main" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-6">
              {mainNav.map((item) => (
                <li key={item.id}>
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

          {/* ---------- Desktop right-side actions ---------- */}
          <div className="ml-auto hidden items-center gap-4 lg:flex">
            {utilityLinks.map(({ id, label, href, icon }) => {
              const Icon = iconsByName[icon];
              return (
                <a
                  key={id}
                  href={href}
                  aria-label={label}
                  title={label}
                  className="rounded-md p-2 text-muted transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Icon />
                </a>
              );
            })}
            <DownloadMenu />
            <button type="button" className="btn-outline">
              Log in
            </button>
          </div>

          {/* ---------- Mobile hamburger ---------- */}
          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="ml-auto rounded-md p-2 text-white hover:bg-white/5 lg:hidden"
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
