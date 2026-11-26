"use client";
/**
 * PageSection: wrapper for one "slide" of the home page.
 *
 * - data-page: which page this is (PageFlow and CSS look for it).
 * - data-active="true" while it's the current page. Every section's CSS
 *   Module starts its entrance animations from this attribute, so they
 *   replay each time you arrive on the page.
 * - inert in full-page mode while hidden: invisible slides are skipped by
 *   Tab and screen readers.
 * - Children can be Server Components: a Client Component may render
 *   server-rendered children passed in as props.
 */
import type { HTMLAttributes, ReactNode } from "react";
import type { PageId } from "@/data/home";
import { useAppSelector } from "@/store/hooks";

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  id: PageId;
  /** Accessible name for the section (the visible titles are images). */
  label: string;
  children: ReactNode;
}

export default function PageSection({
  id,
  label,
  className = "",
  children,
  ...rest
}: PageSectionProps) {
  const isActive = useAppSelector((state) => state.ui.activePage === id);
  const isFullPage = useAppSelector((state) => state.ui.isFullPage);

  return (
    <section
      {...rest}
      id={id}
      data-page={id}
      data-active={isActive}
      aria-label={label}
      inert={isFullPage && !isActive}
      className={`page-section ${className}`}
    >
      {children}
    </section>
  );
}
