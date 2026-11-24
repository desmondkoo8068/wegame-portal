/**
 * Stage + StageItem: place desktop artwork using the real site's coordinates.
 *
 * The live WeGame page is designed on a 1440x900 canvas. <Stage> is that
 * canvas, scaled to fit the viewport (see .stage in globals.css). Inside it,
 * <StageItem x y w> takes positions in *design pixels* and converts them to
 * percentages, so the composition scales with the screen.
 *
 *   <Stage>
 *     <StageItem x={270} y={138} w={900}>...</StageItem>
 *   </Stage>
 *
 * Only used on desktop (lg and up); mobile layouts use normal flow.
 */
import type { CSSProperties, ReactNode } from "react";

const DESIGN_W = 1440;
const DESIGN_H = 900;
const pct = (value: number, total: number) => `${(value / total) * 100}%`;

export function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`stage ${className}`}>{children}</div>;
}

interface StageItemProps {
  /** Left edge, in design pixels (0–1440). */
  x: number;
  /** Top edge, in design pixels (0–900). */
  y: number;
  /** Width, in design pixels. Height follows the content (e.g. an image). */
  w: number;
  /** Optional fixed height, in design pixels. */
  h?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function StageItem({ x, y, w, h, className = "", style, children }: StageItemProps) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: pct(x, DESIGN_W),
        top: pct(y, DESIGN_H),
        width: pct(w, DESIGN_W),
        height: h === undefined ? undefined : pct(h, DESIGN_H),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
