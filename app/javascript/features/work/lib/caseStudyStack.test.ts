import { describe, expect, it } from "vitest";

import {
  COMPACT_STACK_STEP,
  COMPACT_STACK_TOP,
  WIDE_STACK_STEP,
  WIDE_STACK_TOP,
  coveredProgressOf,
  stackOffsetsFor,
} from "~/features/work/lib/caseStudyStack";

const VIEWPORT_HEIGHT = 900;

describe("stackOffsetsFor", () => {
  it("pins the first card at the base offsets", () => {
    expect(stackOffsetsFor(0)).toEqual({ compact: COMPACT_STACK_TOP, wide: WIDE_STACK_TOP });
  });

  it("steps each later card down by 22px wide and 14px compact", () => {
    expect(stackOffsetsFor(2)).toEqual({ compact: 100, wide: 148 });
  });

  it("uses the designed base offsets and steps", () => {
    expect([WIDE_STACK_TOP, WIDE_STACK_STEP, COMPACT_STACK_TOP, COMPACT_STACK_STEP]).toEqual([
      104, 22, 72, 14,
    ]);
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
