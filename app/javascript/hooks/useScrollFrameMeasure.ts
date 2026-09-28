import { useEffect } from "react";

interface ScrollFrameMeasure {
  cleanUp: () => void;
  measure: () => void;
  observed: Element[];
}

export default function useScrollFrameMeasure(
  setUp: () => ScrollFrameMeasure | null,
  isEnabled: boolean,
): void {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const scrollFrameMeasure = setUp();
    if (!scrollFrameMeasure) return undefined;

    const { cleanUp, measure, observed } = scrollFrameMeasure;
    let animationFrame = 0;

    const measureInFrame = () => {
      animationFrame = 0;
      measure();
    };

    const scheduleMeasure = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(measureInFrame);
    };

    const resizeObserver =
      typeof ResizeObserver === "function" ? new ResizeObserver(scheduleMeasure) : undefined;
    observed.forEach((element) => {
      resizeObserver?.observe(element);
    });

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      resizeObserver?.disconnect();
      cleanUp();
    };
  }, [isEnabled, setUp]);
}
