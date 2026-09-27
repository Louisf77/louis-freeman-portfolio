import { describe, expect, it } from "vitest";

import {
  COMPACT_STACK_STEP,
  COMPACT_STACK_TOP,
  WIDE_STACK_STEP,
  WIDE_STACK_TOP,
  stackOffsetsFor,
} from "~/features/work/lib/caseStudyStack";

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
