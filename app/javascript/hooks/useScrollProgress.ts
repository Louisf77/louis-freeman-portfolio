import { useEffect, useState, type RefObject } from "react";

function clampToUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function scrollProgressOf(element: Element, viewportHeight: number): number {
  const { height, top } = element.getBoundingClientRect();
  const scrollableDistance = height - viewportHeight;
  if (scrollableDistance <= 0) return top <= 0 ? 1 : 0;

  return clampToUnit(-top / scrollableDistance);
}

export default function useScrollProgress(ref: RefObject<Element | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (ref.current) setProgress(scrollProgressOf(ref.current, window.innerHeight));
    };

    const scheduleMeasure = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [ref]);

  return progress;
}
