import { useEffect, useState, type RefObject } from "react";

import { MAX_DIAGRAM_SCALE, MIN_DIAGRAM_SCALE } from "~/components/diagrams/DiagramFrame";

export const DIAGRAM_WIDTH = 720;
export const DIAGRAM_HEIGHT = 440;
const FULL_SIZE_SCALE = 1;

export function fittedDiagramScale(width: number, height: number): number {
  const fit = Math.min(FULL_SIZE_SCALE, width / DIAGRAM_WIDTH, height / DIAGRAM_HEIGHT);

  return Math.min(MAX_DIAGRAM_SCALE, Math.max(MIN_DIAGRAM_SCALE, fit));
}

export default function useFittedDiagramScale(wellRef: RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(FULL_SIZE_SCALE);

  useEffect(() => {
    const well = wellRef.current;
    if (!well || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const { height, width } = entry.contentRect;
      setScale(fittedDiagramScale(width, height));
    });
    observer.observe(well);

    return () => {
      observer.disconnect();
    };
  }, [wellRef]);

  return scale;
}
