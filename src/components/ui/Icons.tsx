/**
 * Small inline SVG icons.
 *
 * Inline SVGs (instead of an icon library) keep the bundle tiny, and using
 * `currentColor` lets each icon inherit the text colour of its parent, so
 * `text-muted hover:text-white` styles the icon too.
 *
 * Icons are decorative (aria-hidden); the surrounding button/link must
 * provide an accessible label.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Shared defaults so every icon has the same size and stroke style. */
function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MenuIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </BaseIcon>
);

export const CloseIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </BaseIcon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M6 9l6 6 6-6" />
  </BaseIcon>
);

export const ChangelogIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5M10 13h6M10 17h6" />
  </BaseIcon>
);

export const HelpIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" />
  </BaseIcon>
);

export const DownloadIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </BaseIcon>
);

export const ExternalIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
  </BaseIcon>
);

/** Look up an icon by name; used for data-driven icon links. */
export const iconsByName = {
  changelog: ChangelogIcon,
  help: HelpIcon,
} as const;
