import { useEffect, type RefObject } from "react";

import { naturalDocumentTop } from "~/lib/naturalPosition";

const HALF = 0.5;
const STICKY_POSITION = "sticky";
const STATIC_POSITION = "static";
const SETTLED_FRAMES = 3;
const MAX_SETTLE_FRAMES = 90;

function stickyAncestorsOf(element: HTMLElement): HTMLElement[] {
  const ancestors: HTMLElement[] = [];
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (window.getComputedStyle(node).position === STICKY_POSITION) ancestors.push(node);
  }

  return ancestors;
}

function nearestStickyAncestor(node: Element): HTMLElement | null {
  for (let current: Element | null = node; current; current = current.parentElement) {
    if (
      current instanceof HTMLElement &&
      window.getComputedStyle(current).position === STICKY_POSITION
    ) {
      return current;
    }
  }

  return null;
}

function isCoveredByAnotherCard(element: HTMLElement): boolean {
  const box = element.getBoundingClientRect();
  if (box.top < 0 || box.bottom > window.innerHeight) return true;

  const hit = document.elementFromPoint(box.left + box.width * HALF, box.top + box.height * HALF);
  if (!hit || element.contains(hit)) return false;

  return nearestStickyAncestor(hit) !== nearestStickyAncestor(element);
}

function stuckTopOf(element: HTMLElement): number {
  return Number.parseFloat(window.getComputedStyle(element).top) || 0;
}

function naturalTopWithin(ancestors: HTMLElement[], element: HTMLElement): number {
  const inlinePositions = ancestors.map((ancestor) => ancestor.style.position);
  ancestors.forEach((ancestor) => {
    ancestor.style.position = STATIC_POSITION;
  });
  const top = naturalDocumentTop(element);
  ancestors.forEach((ancestor, index) => {
    ancestor.style.position = inlinePositions[index] ?? "";
  });

  return top;
}

function candidateScrollTops(element: HTMLElement): number[] {
  const ancestors = stickyAncestorsOf(element);
  const elementTop = naturalTopWithin(ancestors, element);
  const centred = elementTop + element.offsetHeight * HALF - window.innerHeight * HALF;
  const stuckStarts = ancestors.map(
    (ancestor, index) =>
      naturalTopWithin(ancestors.slice(index + 1), ancestor) - stuckTopOf(ancestor),
  );

  return [...stuckStarts, centred];
}

function uncover(element: HTMLElement) {
  if (!isCoveredByAnotherCard(element)) return;

  const startY = window.scrollY;
  const uncoveringTop = candidateScrollTops(element).find((top) => {
    window.scrollTo({ behavior: "instant", left: 0, top });
    return !isCoveredByAnotherCard(element);
  });
  if (uncoveringTop === undefined) window.scrollTo({ behavior: "instant", left: 0, top: startY });
}

export default function useUncoveredFocus(
  framesRef: RefObject<HTMLElement[]>,
  isEnabled: boolean,
): void {
  useEffect(() => {
    if (!isEnabled) return undefined;

    let animationFrame = 0;

    const uncoverOnceScrollSettles = (element: HTMLElement) => {
      let lastY = window.scrollY;
      let stillFrames = 0;
      let framesLeft = MAX_SETTLE_FRAMES;

      const check = () => {
        framesLeft -= 1;
        stillFrames = window.scrollY === lastY ? stillFrames + 1 : 0;
        lastY = window.scrollY;
        if (stillFrames < SETTLED_FRAMES && framesLeft > 0) {
          animationFrame = window.requestAnimationFrame(check);
          return;
        }

        if (document.activeElement === element) uncover(element);
      };

      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(check);
    };

    const onFocusIn = (event: FocusEvent) => {
      const element = event.target;
      if (!(element instanceof HTMLElement)) return;
      if (!framesRef.current.some((frame) => frame.contains(element))) return;

      uncoverOnceScrollSettles(element);
    };

    document.addEventListener("focusin", onFocusIn);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [framesRef, isEnabled]);
}
