import { useEffect, type RefObject } from "react";

import { track } from "~/lib/analytics";

export const CASE_STUDY_VIEW_DWELL_MS = 1000;
const CASE_STUDY_VIEW_CHECK_INTERVAL_MS = 250;
const CASE_STUDY_VIEW_VISIBLE_RATIO = 0.5;

function isUncovered(card: HTMLElement): boolean {
  const box = card.getBoundingClientRect();
  const left = Math.max(box.left, 0);
  const right = Math.min(box.right, window.innerWidth);
  const top = Math.max(box.top, 0);
  const bottom = Math.min(box.bottom, window.innerHeight);
  const topmost = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);

  return topmost !== null && card.contains(topmost);
}

function useTrackCaseStudyView(
  cardRef: RefObject<HTMLElement | null>,
  slug: string,
  isLandingTarget: boolean,
): void {
  useEffect(() => {
    const card = cardRef.current;
    if (!card || isLandingTarget || typeof IntersectionObserver === "undefined") return undefined;

    let dwellCheck: number | undefined;
    let uncoveredMs = 0;

    const stopDwelling = () => {
      window.clearInterval(dwellCheck);
      dwellCheck = undefined;
      uncoveredMs = 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const isHalfVisible = entries.some(
          (entry) =>
            entry.isIntersecting && entry.intersectionRatio >= CASE_STUDY_VIEW_VISIBLE_RATIO,
        );
        if (!isHalfVisible) {
          stopDwelling();
          return;
        }
        if (dwellCheck !== undefined) return;

        dwellCheck = window.setInterval(() => {
          uncoveredMs = isUncovered(card) ? uncoveredMs + CASE_STUDY_VIEW_CHECK_INTERVAL_MS : 0;
          if (uncoveredMs < CASE_STUDY_VIEW_DWELL_MS) return;

          stopDwelling();
          observer.disconnect();
          track("case_study_view", { case_study_slug: slug, source: "work_scroll" });
        }, CASE_STUDY_VIEW_CHECK_INTERVAL_MS);
      },
      { threshold: CASE_STUDY_VIEW_VISIBLE_RATIO },
    );
    observer.observe(card);

    return () => {
      stopDwelling();
      observer.disconnect();
    };
  }, [cardRef, isLandingTarget, slug]);
}

export default useTrackCaseStudyView;
