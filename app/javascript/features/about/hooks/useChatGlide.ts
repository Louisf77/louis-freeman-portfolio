import { useEffect, type RefObject } from "react";

import { scrollProgressOf } from "~/hooks/useScrollProgress";

interface GlideOffsetInput {
  firstBubbleHeight: number;
  listHeight: number;
  progress: number;
  windowHeight: number;
}

interface BubbleRevealInput {
  bubbleHeight: number;
  bubbleTop: number;
  offset: number;
  windowHeight: number;
}

interface ChatGlideOptions {
  isEnabled: boolean;
  listRef: RefObject<HTMLElement | null>;
  riseDistance: number;
  sectionRef: RefObject<HTMLElement | null>;
  windowRef: RefObject<HTMLElement | null>;
}

const LERP_FACTOR = 0.14;
const SETTLE_THRESHOLD = 0.0005;
const REVEAL_SPAN_RATIO = 0.9;
const REVEAL_SPAN_PADDING = 24;
const HIDDEN_SCALE = 0.96;

function clampToUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function glideOffset({
  firstBubbleHeight,
  listHeight,
  progress,
  windowHeight,
}: GlideOffsetInput): number {
  return windowHeight - firstBubbleHeight - progress * Math.max(0, listHeight - firstBubbleHeight);
}

export function bubbleReveal({
  bubbleHeight,
  bubbleTop,
  offset,
  windowHeight,
}: BubbleRevealInput): number {
  const overflowBelowWindow = offset + bubbleTop + bubbleHeight - windowHeight;

  return clampToUnit(
    1 - overflowBelowWindow / (bubbleHeight * REVEAL_SPAN_RATIO + REVEAL_SPAN_PADDING),
  );
}

export function lerpTowards(current: number, target: number): number {
  const next = current + (target - current) * LERP_FACTOR;

  return Math.abs(target - next) < SETTLE_THRESHOLD ? target : next;
}

function layoutChat(
  chatWindow: HTMLElement,
  list: HTMLElement,
  progress: number,
  riseDistance: number,
): void {
  const bubbles = Array.from(list.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
  const firstBubble = bubbles[0];
  if (!firstBubble) return;

  const windowHeight = chatWindow.clientHeight;
  const offset = glideOffset({
    firstBubbleHeight: firstBubble.offsetHeight,
    listHeight: list.scrollHeight,
    progress,
    windowHeight,
  });
  list.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;

  bubbles.forEach((bubble) => {
    const reveal = bubbleReveal({
      bubbleHeight: bubble.offsetHeight,
      bubbleTop: bubble.offsetTop,
      offset,
      windowHeight,
    });
    const rise = ((1 - reveal) * riseDistance).toFixed(1);
    const scale = (HIDDEN_SCALE + (1 - HIDDEN_SCALE) * reveal).toFixed(4);
    bubble.style.opacity = reveal.toFixed(3);
    bubble.style.transform = `translate3d(0, ${rise}px, 0) scale(${scale})`;
  });
}

function clearChat(list: HTMLElement): void {
  list.removeAttribute("style");
  Array.from(list.children).forEach((bubble) => {
    bubble.removeAttribute("style");
  });
}

export default function useChatGlide({
  isEnabled,
  listRef,
  riseDistance,
  sectionRef,
  windowRef,
}: ChatGlideOptions): void {
  useEffect(() => {
    const section = sectionRef.current;
    const chatWindow = windowRef.current;
    const list = listRef.current;
    if (!isEnabled || !section || !chatWindow || !list) return;

    let current: number | null = null;
    let target = 0;
    let frame = 0;

    const tick = () => {
      frame = 0;
      current = current === null ? target : lerpTowards(current, target);
      layoutChat(chatWindow, list, current, riseDistance);
      if (current !== target) frame = window.requestAnimationFrame(tick);
    };

    const followScroll = () => {
      target = scrollProgressOf(section, window.innerHeight);
      if (frame === 0) frame = window.requestAnimationFrame(tick);
    };

    followScroll();
    window.addEventListener("scroll", followScroll, { passive: true });
    window.addEventListener("resize", followScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", followScroll);
      window.removeEventListener("resize", followScroll);
      clearChat(list);
    };
  }, [isEnabled, listRef, riseDistance, sectionRef, windowRef]);
}
