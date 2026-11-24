"use client";
/**
 * NavDropdown: a desktop nav item that reveals a list of sub-links.
 *
 * Open/close logic lives in the useDropdown hook (backed by Redux); this
 * component only handles markup and accessibility attributes:
 *   - aria-expanded tells screen readers whether the menu is open
 *   - aria-controls links the button to the panel it controls
 */
import { ChevronDownIcon, ExternalIcon } from "@/components/ui/Icons";
import type { NavItem } from "@/data/navigation";
import { useDropdown } from "@/lib/useDropdown";

export default function NavDropdown({ item }: { item: NavItem }) {
  const { isOpen, ref, toggle, close } = useDropdown(item.id);
  const panelId = `nav-dropdown-${item.id}`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`nav-link flex items-center gap-1 ${isOpen ? "text-white" : ""}`}
      >
        {item.label}
        <ChevronDownIcon
          width={16}
          height={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div id={panelId} className="absolute left-0 top-full pt-2">
          <ul className="dropdown-panel min-w-48">
            {item.children?.map((child) => (
              <li key={child.label}>
                <a
                  href={child.href}
                  onClick={close}
                  {...(child.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="dropdown-item justify-between"
                >
                  {child.label}
                  {child.external && <ExternalIcon width={14} height={14} />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
