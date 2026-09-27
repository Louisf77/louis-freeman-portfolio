import { describe, expect, it } from "vitest";

import { bubbleReveal, glideOffset, lerpTowards } from "~/features/about/hooks/useChatGlide";

const WINDOW_HEIGHT = 400;

describe("glideOffset", () => {
  it("parks the first bubble at the bottom of the chat window before scrolling", () => {
    expect(
      glideOffset({
        firstBubbleHeight: 60,
        listHeight: 1000,
        progress: 0,
        windowHeight: WINDOW_HEIGHT,
      }),
    ).toBe(340);
  });

  it("brings the last bubble to the bottom of the window at full progress", () => {
    expect(
      glideOffset({
        firstBubbleHeight: 60,
        listHeight: 1000,
        progress: 1,
        windowHeight: WINDOW_HEIGHT,
      }),
    ).toBe(-600);
  });
});

describe("bubbleReveal", () => {
  it("is fully revealed once the bubble sits inside the window", () => {
    expect(
      bubbleReveal({ bubbleHeight: 100, bubbleTop: 0, offset: 200, windowHeight: WINDOW_HEIGHT }),
    ).toBe(1);
  });

  it("is hidden while the bubble is still below the window", () => {
    expect(
      bubbleReveal({ bubbleHeight: 100, bubbleTop: 500, offset: 0, windowHeight: WINDOW_HEIGHT }),
    ).toBe(0);
  });

  it("is part-way while the bubble is entering the window", () => {
    expect(
      bubbleReveal({ bubbleHeight: 100, bubbleTop: 357, offset: 0, windowHeight: WINDOW_HEIGHT }),
    ).toBeCloseTo(0.5);
  });
});

describe("lerpTowards", () => {
  it("moves 14% of the way to the target each frame", () => {
    expect(lerpTowards(0, 1)).toBeCloseTo(0.14);
  });

  it("snaps to the target once it is close enough", () => {
    expect(lerpTowards(0.9999, 1)).toBe(1);
  });
});
