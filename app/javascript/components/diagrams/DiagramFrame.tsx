import type { CSSProperties, ReactNode } from "react";

import styles from "~/components/diagrams/DiagramFrame.module.css";
import classNames from "~/lib/classNames";

export type DiagramPattern = "dots" | "grid" | "plain";

interface DiagramFrameProps {
  caption: string;
  captionLeft?: number;
  children?: ReactNode;
  label: string;
  pattern: DiagramPattern;
  scale?: number;
}

export const MIN_DIAGRAM_SCALE = 0.49;
export const MAX_DIAGRAM_SCALE = 1.08;
const DEFAULT_CAPTION_LEFT = 28;

const PATTERN_CLASS: Record<DiagramPattern, string | undefined> = {
  dots: styles.dots,
  grid: styles.grid,
  plain: undefined,
};

function clampScale(scale: number): number {
  return Math.min(MAX_DIAGRAM_SCALE, Math.max(MIN_DIAGRAM_SCALE, scale));
}

function DiagramFrame({
  caption,
  captionLeft = DEFAULT_CAPTION_LEFT,
  children,
  label,
  pattern,
  scale = 1,
}: DiagramFrameProps) {
  const frameStyle = { "--diagram-scale": clampScale(scale) } as CSSProperties;

  return (
    <div aria-label={label} className={styles.frame} role="img" style={frameStyle}>
      <div className={classNames(styles.canvas, PATTERN_CLASS[pattern])}>
        {children}
        <div className={styles.caption} style={{ left: captionLeft }}>
          {caption}
        </div>
      </div>
    </div>
  );
}

export default DiagramFrame;
