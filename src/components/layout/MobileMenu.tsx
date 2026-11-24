"use client";
/**
 * MobileMenu: the slide-down navigation panel shown below the header on
 * screens narrower than `lg` (1024px).
 *
 * The open/closed flag is in Redux (ui.isMobileMenuOpen) because the
 * hamburger button that opens it lives in a different component (Navbar).
 *
 * Side effects handled here:
 *   1. Lock page scrolling while open, so only the menu scrolls.
 *   2. Close on Escape.
 *   3. Close automatically if the window is resized to desktop width,
 *      otherwise the scroll lock would stay on with the menu hidden.
 */
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { downloadOptions, mainNav, utilityLinks } from "@/data/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileMenu } from "@/store/slices/uiSlice";
import { DownloadIcon, ExternalIcon, UserIcon, iconsByName } from "@/components/ui/Icons";

// Must match Tailwind's `lg` breakpoint, where the desktop nav appears.
const DESKTOP_QUERY = "(min-width: 1024px)";

export default function MobileMenu() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const pathname = usePathname();
  const close = () => dispatch(closeMobileMenu());

  useEffect(() => {
    if (!isOpen) return;

    // 1. Scroll lock
    document.body.style.overflow = "hidden";

    // 2. Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(closeMobileMenu());
    };
    document.addEventListener("keydown", handleKeyDown);

    // 3. Resize to desktop
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) dispatch(closeMobileMenu());
    };
    desktop.addEventListener("change", handleBreakpoint);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleBreakpoint);
    };
  }, [isOpen, dispatch]);

  return (
    <div
      id="mobile-menu"
      // `inert` hides the closed menu from keyboard focus and screen readers,
      // while keeping it in the DOM for the slide animation.
      inert={!isOpen}
      className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-page/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
        isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
      }`}
    >
      <nav aria-label="移动端导航" className="container-page flex flex-col gap-6 py-6">
        <ul className="flex flex-col">
          {mainNav.map((item) =>
            item.children ? (
              <li key={item.id} className="border-b border-line py-3">
                <p className="mb-2 text-xs font-bold text-muted">{item.label}</p>
                <ul className="flex flex-col gap-1">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <a
                        href={child.href}
                        onClick={close}
                        {...(child.external && { target: "_blank", rel: "noopener noreferrer" })}
                        className="flex items-center justify-between py-2 text-base text-white"
                      >
                        {child.label}
                        {child.external && (
                          <ExternalIcon width={16} height={16} className="text-muted" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.id} className="border-b border-line">
                <Link
                  href={item.href ?? "#"}
                  onClick={close}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block py-4 text-lg font-bold text-white aria-[current=page]:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <section aria-labelledby="mobile-download-heading">
          <h2 id="mobile-download-heading" className="mb-2 text-xs font-bold text-muted">
            下载客户端
          </h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {downloadOptions.map((option) => (
              <a
                key={option.label}
                href={option.href}
                onClick={close}
                className="btn-glass justify-start"
              >
                <DownloadIcon width={16} height={16} className="text-brand" />
                {option.label}
              </a>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-6 text-sm text-muted">
          {utilityLinks.map(({ id, label, href, icon }) => {
            const Icon = iconsByName[icon];
            return (
              <a
                key={id}
                href={href}
                onClick={close}
                className="flex items-center gap-2 hover:text-white"
              >
                <Icon width={18} height={18} />
                {label}
              </a>
            );
          })}
        </div>

        <button type="button" className="btn-primary w-full py-3">
          <UserIcon width={18} height={18} />
          登录
        </button>
      </nav>
    </div>
  );
}
