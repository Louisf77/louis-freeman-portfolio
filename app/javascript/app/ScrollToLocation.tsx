import { useEffect, useRef } from "react";
import { NavigationType, useLocation, useNavigationType } from "react-router";

import { enterOffsetAbove, naturalDocumentTop } from "~/lib/naturalPosition";

const MAX_TARGET_LOOKUP_FRAMES = 120;
const STICKY_POSITION = "sticky";
const MANUAL_SCROLL_RESTORATION = "manual";
const SETTLED_SCROLL_TOLERANCE_PX = 2;
const NATIVE_SCROLL_SETTLE_MS = 1000;

function scrollMarginTopOf(element: HTMLElement): number {
  return Number.parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
}

function stickyFrameAround(target: HTMLElement): HTMLElement | null {
  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    if (window.getComputedStyle(element).position === STICKY_POSITION) return element;
  }

  return null;
}

function scrollToHashTarget(target: HTMLElement, behavior: ScrollBehavior) {
  const stickyFrame = stickyFrameAround(target);
  if (!stickyFrame && enterOffsetAbove(target) === 0) {
    target.scrollIntoView({ behavior });
    return;
  }

  const anchor = stickyFrame ?? target;
  window.scrollTo({
    behavior,
    left: 0,
    top: naturalDocumentTop(anchor) - scrollMarginTopOf(anchor),
  });
}

function scrollToTop() {
  window.scrollTo({ behavior: "instant", left: 0, top: 0 });
}

function ScrollToLocation() {
  const { hash, key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const shownPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    window.history.scrollRestoration = MANUAL_SCROLL_RESTORATION;
  }, []);

  useEffect(() => {
    const isNewPage = shownPathnameRef.current !== pathname;
    shownPathnameRef.current = pathname;
    if (!hash) {
      scrollToTop();
      return undefined;
    }

    const isBrowserNavigation = navigationType === NavigationType.Pop;
    const behavior: ScrollBehavior = isNewPage || isBrowserNavigation ? "instant" : "auto";

    const targetId = decodeURIComponent(hash.slice(1));
    let framesLeft = MAX_TARGET_LOOKUP_FRAMES;
    let frame = 0;
    let isCancelled = false;
    let stopWatchingNativeScroll = () => undefined;

    const rescrollAfterNativeScroll = (target: HTMLElement) => {
      const rescroll = () => {
        stopWatchingNativeScroll();
        scrollToHashTarget(target, behavior);
      };
      const settleTimer = window.setTimeout(stopWatchingNativeScroll, NATIVE_SCROLL_SETTLE_MS);
      window.addEventListener("scrollend", rescroll);
      stopWatchingNativeScroll = () => {
        window.clearTimeout(settleTimer);
        window.removeEventListener("scrollend", rescroll);
      };
    };

    const rescrollOnceFontsLoad = (target: HTMLElement) => {
      if (!("fonts" in document)) return;

      const scrolledY = window.scrollY;
      document.fonts.ready
        .then(() => {
          const isUntouched = Math.abs(window.scrollY - scrolledY) <= SETTLED_SCROLL_TOLERANCE_PX;
          if (!isCancelled && isUntouched) scrollToHashTarget(target, behavior);
        })
        .catch(() => undefined);
    };

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        scrollToHashTarget(target, behavior);
        if (isNewPage) rescrollOnceFontsLoad(target);
        if (isBrowserNavigation) rescrollAfterNativeScroll(target);
        return;
      }

      if (isNewPage && framesLeft === MAX_TARGET_LOOKUP_FRAMES) scrollToTop();

      framesLeft -= 1;
      if (framesLeft > 0) frame = window.requestAnimationFrame(scrollToTarget);
    };

    scrollToTarget();

    return () => {
      isCancelled = true;
      stopWatchingNativeScroll();
      window.cancelAnimationFrame(frame);
    };
  }, [hash, key, navigationType, pathname]);

  return null;
}

export default ScrollToLocation;
