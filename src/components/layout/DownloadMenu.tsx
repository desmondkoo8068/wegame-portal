"use client";
/**
 * DownloadMenu: the highlighted "Download Client" button and its panel of
 * platform options (Windows, Mac Intel, Mac M-series), like the real site.
 *
 * It reuses useDropdown, so it behaves exactly like the other dropdowns and
 * opening it closes any other open dropdown (one shared Redux value).
 */
import { DownloadIcon } from "@/components/ui/Icons";
import { downloadOptions } from "@/data/navigation";
import { useDropdown } from "@/lib/useDropdown";

export default function DownloadMenu() {
  const { isOpen, ref, toggle, close } = useDropdown("download");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="download-panel"
        className="btn-primary"
      >
        <DownloadIcon width={16} height={16} />
        Download Client
      </button>

      {isOpen && (
        <div id="download-panel" className="absolute right-0 top-full pt-2">
          <div className="dropdown-panel w-64">
            <ul>
              {downloadOptions.map((option) => (
                <li key={option.label}>
                  <a href={option.href} onClick={close} className="dropdown-item">
                    <DownloadIcon width={16} height={16} className="text-brand" />
                    {option.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-1 border-t border-line px-3 pt-2 text-xs leading-relaxed text-muted">
              Not sure which Mac? Apple menu &rarr; About This Mac &rarr; Chip.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
