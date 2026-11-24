"use client";
/**
 * PageSection: wrapper for one full-screen page of the home portal.
 *
 * - data-page lets <PageTracker> know which page is on screen.
 * - data-active="true" (from Redux ui.activePage) triggers the CSS
 *   entrance animation of every .reveal element inside (desktop only).
 * - Its children can be Server Components: a Client Component may render
 *   server-rendered children passed in as props.
 */
import type { ReactNode } from "react";
import type { PageId } from "@/data/home";
import { useAppSelector } from "@/store/hooks";

interface PageSectionProps {
  id: PageId;
  /** Accessible name for the section (the visible titles are images). */
  label: string;
  className?: string;
  children: ReactNode;
}

export default function PageSection({ id, label, className = "", children }: PageSectionProps) {
  const isActive = useAppSelector((state) => state.ui.activePage === id);

  return (
    <section
      id={id}
      data-page={id}
      data-active={isActive}
      aria-label={label}
      className={`page-section ${className}`}
    >
      {children}
    </section>
  );
}
