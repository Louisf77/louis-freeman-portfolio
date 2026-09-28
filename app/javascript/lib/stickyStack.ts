export const DRIFT_DISTANCE_SHARE = 0.9;
export const COVERED_PROGRESS_PROPERTY = "--covered-progress";
const PROGRESS_DECIMALS = 3;

export interface CoveredBox {
  bottom: number;
  height: number;
}

function clampToUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function stickyTopOf(height: number, viewportHeight: number): number {
  return Math.min(0, viewportHeight - height);
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

export function formatProgress(progress: number): string {
  return progress.toFixed(PROGRESS_DECIMALS);
}

export function driftProgressOf(scrollY: number, leadHeight: number): number {
  return clampToUnit(scrollY / Math.max(1, leadHeight * DRIFT_DISTANCE_SHARE));
}
