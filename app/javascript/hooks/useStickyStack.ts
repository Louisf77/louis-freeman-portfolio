import { useEffect, type RefObject } from "react";

import useReducedMotion from "~/hooks/useReducedMotion";
import { coveredProgressOf, driftProgressOf, stickyTopOf } from "~/lib/stickyStack";

export const STACK_FRAME_ATTRIBUTE = "data-stack-frame";
export const STACK_TOP_PROPERTY = "--stack-top";
export const COVERED_PROGRESS_PROPERTY = "--covered-progress";
export const DRIFT_PROGRESS_PROPERTY = "--drift-progress";
const PROGRESS_DECIMALS = 3;
const STACK_PROPERTIES = [STACK_TOP_PROPERTY, COVERED_PROGRESS_PROPERTY, DRIFT_PROGRESS_PROPERTY];

interface FrameStyle {
  coveredProgress?: number;
  driftProgress?: number;
  frame: HTMLElement;
  stickyTop: number;
}

function framesFrom(lead: HTMLElement): HTMLElement[] {
  const frames = [lead];
  let sibling = lead.nextElementSibling;
  while (sibling instanceof HTMLElement && sibling.hasAttribute(STACK_FRAME_ATTRIBUTE)) {
    frames.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  return frames;
}

function measureFrames(frameElements: HTMLElement[], followerId: string): FrameStyle[] {
  const viewportHeight = window.innerHeight;
  const frames = frameElements.map((frame) => ({
    box: frame.getBoundingClientRect(),
    frame,
  }));
  const shown = frames.filter(({ box }) => box.height > 0);
  const followerTop = document.getElementById(followerId)?.getBoundingClientRect().top;

  return shown.map(({ box, frame }, index) => {
    const stickyTop = stickyTopOf(box.height, viewportHeight);
    if (index === 0) {
      return { driftProgress: driftProgressOf(window.scrollY, box.height), frame, stickyTop };
    }

    const coveringTop = shown[index + 1]?.box.top ?? followerTop;
    const coveredProgress =
      coveringTop === undefined ? 0 : coveredProgressOf(box, coveringTop, viewportHeight);

    return { coveredProgress, frame, stickyTop };
  });
}

function applyFrameStyle({ coveredProgress, driftProgress, frame, stickyTop }: FrameStyle) {
  const top = `${String(stickyTop)}px`;
  if (frame.style.getPropertyValue(STACK_TOP_PROPERTY) !== top) {
    frame.style.setProperty(STACK_TOP_PROPERTY, top);
  }
  if (coveredProgress !== undefined) {
    frame.style.setProperty(COVERED_PROGRESS_PROPERTY, coveredProgress.toFixed(PROGRESS_DECIMALS));
  }
  if (driftProgress !== undefined) {
    frame.style.setProperty(DRIFT_PROGRESS_PROPERTY, driftProgress.toFixed(PROGRESS_DECIMALS));
  }
}

function clearFrameStyles(frames: HTMLElement[]) {
  frames.forEach((frame) => {
    STACK_PROPERTIES.forEach((property) => {
      frame.style.removeProperty(property);
    });
  });
}

export default function useStickyStack(
  leadRef: RefObject<HTMLElement | null>,
  followerId: string,
): void {
  const isReducedMotion = useReducedMotion();

  useEffect(() => {
    const lead = leadRef.current;
    if (!lead || isReducedMotion) return undefined;

    const frames = framesFrom(lead);
    let animationFrame = 0;

    const measure = () => {
      animationFrame = 0;
      measureFrames(frames, followerId).forEach(applyFrameStyle);
    };

    const scheduleMeasure = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(measure);
    };

    const resizeObserver =
      typeof ResizeObserver === "function" ? new ResizeObserver(scheduleMeasure) : undefined;
    frames.forEach((child) => {
      resizeObserver?.observe(child);
    });

    measure();
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      resizeObserver?.disconnect();
      clearFrameStyles(frames);
    };
  }, [followerId, isReducedMotion, leadRef]);
}
