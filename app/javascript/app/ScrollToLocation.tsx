import { useEffect } from "react";
import { useLocation } from "react-router";

const MAX_TARGET_LOOKUP_FRAMES = 120;
const STICKY_POSITION = "sticky";
const STATIC_POSITION = "static";

function naturalDocumentTop(target: HTMLElement): number {
  const inlinePosition = target.style.position;
  target.style.position = STATIC_POSITION;
  const top = target.getBoundingClientRect().top + window.scrollY;
  target.style.position = inlinePosition;

  return top;
}

function stickyFrameAround(target: HTMLElement): HTMLElement | null {
  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    if (window.getComputedStyle(element).position === STICKY_POSITION) return element;
  }

  return null;
}

function scrollToHashTarget(target: HTMLElement) {
  const stickyFrame = stickyFrameAround(target);
  if (!stickyFrame) {
    target.scrollIntoView();
    return;
  }

  const scrollMarginTop =
    Number.parseFloat(window.getComputedStyle(stickyFrame).scrollMarginTop) || 0;
  window.scrollTo({ left: 0, top: naturalDocumentTop(stickyFrame) - scrollMarginTop });
}

function ScrollToLocation() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ behavior: "instant", left: 0, top: 0 });
      return undefined;
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let framesLeft = MAX_TARGET_LOOKUP_FRAMES;
    let frame = 0;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        scrollToHashTarget(target);
        return;
      }

      framesLeft -= 1;
      if (framesLeft > 0) frame = window.requestAnimationFrame(scrollToTarget);
    };

    scrollToTarget();

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [hash, pathname]);

  return null;
}

export default ScrollToLocation;
