import { describe, expect, it } from "vitest";

import { fittedDiagramScale } from "~/features/work/hooks/useFittedDiagramScale";

describe("fittedDiagramScale", () => {
  it("keeps the diagram at full size when the well is large enough", () => {
    expect(fittedDiagramScale(722, 520)).toBe(1);
  });

  it("shrinks the diagram to fit the tighter side of the well", () => {
    expect(fittedDiagramScale(576, 520)).toBe(0.8);
  });

  it("never shrinks below the smallest designed scale", () => {
    expect(fittedDiagramScale(332, 209)).toBe(0.49);
  });
});
