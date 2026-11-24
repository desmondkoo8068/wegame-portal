import type { CSSProperties } from "react";

/**
 * Stagger delay for `.reveal` entrance animations (see globals.css).
 * CSS custom properties aren't in React's style types, hence the cast.
 *
 *   <div className="reveal" style={revealDelay(200)} />
 */
export const revealDelay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
