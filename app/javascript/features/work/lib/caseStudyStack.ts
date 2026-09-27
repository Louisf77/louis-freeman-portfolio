export const WIDE_STACK_TOP = 104;
export const WIDE_STACK_STEP = 22;
export const COMPACT_STACK_TOP = 72;
export const COMPACT_STACK_STEP = 14;

export interface StackOffsets {
  compact: number;
  wide: number;
}

export function stackOffsetsFor(index: number): StackOffsets {
  return {
    compact: COMPACT_STACK_TOP + index * COMPACT_STACK_STEP,
    wide: WIDE_STACK_TOP + index * WIDE_STACK_STEP,
  };
}
