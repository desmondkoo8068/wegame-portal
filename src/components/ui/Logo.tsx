/**
 * Logo: an original "W" mark plus the wordmark, drawn with SVG and text.
 * It links home, and on small screens the wordmark can be hidden by the
 * parent while the mark stays visible.
 */
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="WeGame home"
      className={`flex items-center gap-2 font-bold tracking-tight text-white ${className}`}
    >
      <svg viewBox="0 0 32 32" width={30} height={30} aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-brand" />
        <path
          d="M7 10l4 12 5-9 5 9 4-12"
          fill="none"
          stroke="#0f1115"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg">WeGame</span>
    </Link>
  );
}
