import { useEffect, type RefObject } from "react";

import { coveredProgressOf } from "~/features/work/lib/caseStudyStack";
import useReducedMotion from "~/hooks/useReducedMotion";

export const COVERED_PROGRESS_PROPERTY = "--covered-progress";
const PROGRESS_DECIMALS = 3;

function coveringSequence(list: HTMLElement, followerId: string): HTMLElement[] {
  const cards = Array.from(list.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
  const follower = document.getElementById(followerId);

  return follower ? [...cards, follower] : cards;
}

export default function useCoveredProgress(
  listRef: RefObject<HTMLElement | null>,
  followerId: string,
): void {
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list || isReducedMotion) return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const sequence = coveringSequence(list, followerId);
      sequence.forEach((element, index) => {
        const covering = sequence[index + 1];
        if (!covering) return;

        const progress = coveredProgressOf(
          element.getBoundingClientRect(),
          covering.getBoundingClientRect().top,
          window.innerHeight,
        );
        element.style.setProperty(COVERED_PROGRESS_PROPERTY, progress.toFixed(PROGRESS_DECIMALS));
      });
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
      coveringSequence(list, followerId).forEach((element) => {
        element.style.removeProperty(COVERED_PROGRESS_PROPERTY);
      });
    };
  }, [followerId, isReducedMotion, listRef]);
}
