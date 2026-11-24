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

export const SearchIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </BaseIcon>
);

export const UserIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20l.6-2.9a10 10 0 0 1 12.8 0L19 20z" />
  </BaseIcon>
);

/** Clock with an arrow, like the real site's changelog icon. */
export const ChangelogIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M5.2 16.5A8 8 0 1 1 8 19" />
    <path d="M12 8v4.5l-3 2" />
  </BaseIcon>
);

/** Speech bubble with lines, like the real site's feedback icon. */
export const FeedbackIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 20l8-4.5V5H4v10.5h8" />
    <path d="M8 9h8M8 12h4" />
  </BaseIcon>
);

export const GlobeIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" />
  </BaseIcon>
);

/** Crosshair: "use my location". */
export const LocateIcon = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </BaseIcon>
);

/** Look up an icon by name; used for data-driven icon links. */
export const iconsByName = {
  changelog: ChangelogIcon,
  feedback: FeedbackIcon,
} as const;
