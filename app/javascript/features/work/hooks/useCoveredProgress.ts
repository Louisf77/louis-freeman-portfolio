import { useCallback, type RefObject } from "react";

import useReducedMotion from "~/hooks/useReducedMotion";
import useScrollFrameMeasure from "~/hooks/useScrollFrameMeasure";
import { COVERED_PROGRESS_PROPERTY, coveredProgressOf, formatProgress } from "~/lib/stickyStack";

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

  const setUp = useCallback(() => {
    const list = listRef.current;
    if (!list) return null;

    return {
      cleanUp: () => {
        coveringSequence(list, followerId).forEach((element) => {
          element.style.removeProperty(COVERED_PROGRESS_PROPERTY);
        });
      },
      measure: () => {
        const sequence = coveringSequence(list, followerId);
        sequence.forEach((element, index) => {
          const covering = sequence[index + 1];
          if (!covering) return;

          const progress = coveredProgressOf(
            element.getBoundingClientRect(),
            covering.getBoundingClientRect().top,
            window.innerHeight,
          );
          element.style.setProperty(COVERED_PROGRESS_PROPERTY, formatProgress(progress));
        });
      },
      observed: [],
    };
  }, [followerId, listRef]);

  useScrollFrameMeasure(setUp, !isReducedMotion);
}
