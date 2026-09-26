import { describe, expect, it } from "vitest";

import { scrollProgressOf } from "~/hooks/useScrollProgress";

const VIEWPORT_HEIGHT = 800;

function elementAt(top: number, height: number): Element {
  const element = document.createElement("div");
  element.getBoundingClientRect = () => DOMRect.fromRect({ height, width: 0, x: 0, y: top });

  return element;
}

describe("scrollProgressOf", () => {
  it("is 0 before the element reaches the top of the viewport", () => {
    expect(scrollProgressOf(elementAt(200, 2000), VIEWPORT_HEIGHT)).toBe(0);
  });

  it("is halfway when half the scrollable distance has passed", () => {
    expect(scrollProgressOf(elementAt(-600, 2000), VIEWPORT_HEIGHT)).toBe(0.5);
  });

  it("stops at 1 once the element has scrolled through", () => {
    expect(scrollProgressOf(elementAt(-5000, 2000), VIEWPORT_HEIGHT)).toBe(1);
  });

  it("jumps to 1 for an element shorter than the viewport once it passes the top", () => {
    expect(scrollProgressOf(elementAt(-10, 400), VIEWPORT_HEIGHT)).toBe(1);
  });
});
