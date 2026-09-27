import { describe, expect, it } from "vitest";

import {
  DRIFT_DISTANCE_SHARE,
  coveredProgressOf,
  driftProgressOf,
  stickyTopOf,
} from "~/lib/stickyStack";

const VIEWPORT_HEIGHT = 900;

describe("stickyTopOf", () => {
  it("pins a section shorter than the viewport at the top", () => {
    expect(stickyTopOf(600, VIEWPORT_HEIGHT)).toBe(0);
  });

  it("pins a section exactly the viewport's height at the top", () => {
    expect(stickyTopOf(VIEWPORT_HEIGHT, VIEWPORT_HEIGHT)).toBe(0);
  });

  it("lets a tall section scroll fully before pinning its bottom to the viewport's", () => {
    expect(stickyTopOf(3900, VIEWPORT_HEIGHT)).toBe(-3000);
  });
});

describe("coveredProgressOf", () => {
  it("is 0 while the next element is still below the covered one", () => {
    expect(coveredProgressOf({ bottom: 700, height: 640 }, 760, VIEWPORT_HEIGHT)).toBe(0);
  });

  it("is the covered share of the element's height", () => {
    expect(coveredProgressOf({ bottom: 744, height: 640 }, 424, VIEWPORT_HEIGHT)).toBe(0.5);
  });

  it("stops at 1 once the element is fully covered", () => {
    expect(coveredProgressOf({ bottom: 744, height: 640 }, 0, VIEWPORT_HEIGHT)).toBe(1);
  });

  it("measures against the viewport when the element is taller than it", () => {
    expect(coveredProgressOf({ bottom: 2000, height: 1800 }, 450, VIEWPORT_HEIGHT)).toBe(0.5);
  });
});

describe("driftProgressOf", () => {
  it("is 0 at the top of the page", () => {
    expect(driftProgressOf(0, 920)).toBe(0);
  });

  it("completes after scrolling 90% of the lead section's height", () => {
    expect(DRIFT_DISTANCE_SHARE).toBe(0.9);
    expect(driftProgressOf(414, 920)).toBeCloseTo(0.5);
  });

  it("stops at 1 once the lead section has scrolled past", () => {
    expect(driftProgressOf(5000, 920)).toBe(1);
  });

  it("never goes below 0 on overscroll", () => {
    expect(driftProgressOf(-40, 920)).toBe(0);
  });
});
