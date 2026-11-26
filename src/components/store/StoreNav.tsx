"use client";
/**
 * StoreNav: the store's own second-level menu under the main header:
 * 精选 · 燃点试玩 · AI 游戏 · 直播与视频 · 分类导航▾
 *
 * The links scroll sideways on small screens. The 分类导航 dropdown sits
 * *outside* that scrolling row on purpose: an element with overflow
 * clips anything positioned inside it, which would cut the panel off.
 *
 * The dropdown reuses useDropdown, so it shares the header's rules: one
 * menu open at a time (Redux ui.openDropdownId), outside click / Escape
 * closes it.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryGroups, storeNav, storePromo } from "@/data/store";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { useDropdown } from "@/lib/useDropdown";

export default function StoreNav() {
  const pathname = usePathname();
  const { isOpen, ref, toggle, close } = useDropdown("store-categories");

  return (
    <nav aria-label="商店导航" className="container-page flex h-14 items-center gap-6">
      <ul className="no-scrollbar flex min-w-0 flex-1 items-center gap-7 overflow-x-auto lg:flex-none">
        {storeNav.map((item) => (
          <li key={item.id} className="shrink-0">
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="relative flex items-center text-sm font-bold text-white/80 transition-colors hover:text-white aria-[current=page]:text-brand"
            >
              {"image" in item ? (
                <Image
                  src={item.image}
                  alt={item.label}
                  width={300}
                  height={64}
                  className="h-[22px] w-auto"
                />
              ) : (
                item.label
              )}
              {"isNew" in item && (
                <sup className="ml-0.5 text-[9px] font-bold italic text-brand">NEW</sup>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div ref={ref} className="relative shrink-0">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls="store-categories"
          className="flex items-center gap-1 text-sm font-bold text-white/80 transition-colors hover:text-white"
        >
          分类导航
          <ChevronDownIcon
            width={16}
            height={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div
            id="store-categories"
            className="dropdown-panel absolute right-0 top-full z-30 mt-3 grid w-[min(36rem,calc(100vw-2rem))] gap-4 p-4 sm:grid-cols-3 lg:left-0 lg:right-auto"
          >
            {categoryGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-3 text-xs font-bold text-muted">{group.title}</p>
                <ul>
                  {group.items.map((label) => (
                    <li key={label}>
                      <a href="#" onClick={close} className="dropdown-item py-1.5">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event promo image, desktop only (as on the live site's wide layout). */}
      <a
        href={storePromo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden shrink-0 transition-transform hover:scale-105 lg:block"
      >
        <Image
          src={storePromo.image}
          alt={storePromo.label}
          width={281}
          height={64}
          className="h-7 w-auto"
        />
      </a>
    </nav>
  );
}
