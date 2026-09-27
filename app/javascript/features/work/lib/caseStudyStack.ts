export const WIDE_STACK_TOP = 104;
export const WIDE_STACK_STEP = 22;
export const COMPACT_STACK_TOP = 72;
export const COMPACT_STACK_STEP = 14;

export interface StackOffsets {
  compact: number;
  wide: number;
}

export interface CoveredBox {
  bottom: number;
  height: number;
}

function clampToUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function stackOffsetsFor(index: number): StackOffsets {
  return {
    compact: COMPACT_STACK_TOP + index * COMPACT_STACK_STEP,
    wide: WIDE_STACK_TOP + index * WIDE_STACK_STEP,
  };
}

export function coveredProgressOf(
  covered: CoveredBox,
  coveringTop: number,
  viewportHeight: number,
): number {
  const overlap = Math.min(covered.bottom, viewportHeight) - coveringTop;
  const visibleHeight = Math.max(1, Math.min(covered.height, viewportHeight));

  return clampToUnit(overlap / visibleHeight);
}
