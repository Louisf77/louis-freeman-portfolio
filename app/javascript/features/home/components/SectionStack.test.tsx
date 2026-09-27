import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "@test/browser";
import SectionStack from "~/features/home/components/SectionStack";
import { REDUCED_MOTION_MEDIA_QUERY } from "~/hooks/useReducedMotion";

const VIEWPORT_HEIGHT = 900;
const FOLLOWER_ID = "contact";

interface Box {
  height: number;
  top: number;
}

const BOXES: Record<string, Box | undefined> = {
  contact: { height: 780, top: 1400 },
  covered: { height: 640, top: 104 },
  covering: { height: 3900, top: 424 },
  hero: { height: 920, top: -414 },
};

function boxOf(element: Element): Box | undefined {
  const measured = element.id ? element : element.firstElementChild;
  return measured ? BOXES[measured.id] : undefined;
}

function stubLayout() {
  vi.stubGlobal("innerHeight", VIEWPORT_HEIGHT);
  vi.stubGlobal("scrollY", 414);
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const box = boxOf(this) ?? { height: 0, top: 0 };
    return DOMRect.fromRect({ height: box.height, width: 1440, x: 0, y: box.top });
  });
}

function renderStack() {
  return render(
    <>
      <SectionStack followerId={FOLLOWER_ID} lead={<section aria-label="Hero" id="hero" />}>
        <section aria-label="Covered" id="covered" />
        <section aria-label="Covering" id="covering" />
      </SectionStack>
      <footer id={FOLLOWER_ID} />
    </>,
  );
}

function frameOf(name: string): HTMLElement {
  const frame = screen.getByRole("region", { name }).parentElement;
  if (!frame) throw new Error(`The ${name} section has no stack frame`);

  return frame;
}

function property(name: string, frame: string): string {
  return frameOf(frame).style.getPropertyValue(name);
}

describe("SectionStack", () => {
  beforeEach(stubLayout);

  it("renders the lead first and every section in its own frame, in order", () => {
    renderStack();

    expect(screen.getAllByRole("region").map((section) => section.id)).toEqual([
      "hero",
      "covered",
      "covering",
    ]);
    expect(new Set(["Hero", "Covered", "Covering"].map(frameOf)).size).toBe(3);
  });

  it("pins short sections at the top and tall ones once they have fully scrolled", () => {
    renderStack();

    expect(property("--stack-top", "Covered")).toBe("0px");
    expect(property("--stack-top", "Covering")).toBe("-3000px");
  });

  it("darkens a section only by the share the next one overlaps it", () => {
    renderStack();

    expect(property("--covered-progress", "Covered")).toBe("0.500");
    expect(property("--covered-progress", "Covering")).toBe("0.000");
  });

  it("drifts the lead section instead of darkening it", () => {
    renderStack();

    expect(property("--drift-progress", "Hero")).toBe("0.500");
    expect(property("--covered-progress", "Hero")).toBe("");
  });

  it("stays static under reduced motion", () => {
    mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
    renderStack();

    expect(property("--stack-top", "Covered")).toBe("");
    expect(property("--covered-progress", "Covered")).toBe("");
    expect(property("--drift-progress", "Hero")).toBe("");
  });

  it("clears the stack properties on unmount", () => {
    const { unmount } = renderStack();
    const covered = frameOf("Covered");
    unmount();

    expect(covered.style.getPropertyValue("--covered-progress")).toBe("");
    expect(covered.style.getPropertyValue("--stack-top")).toBe("");
  });
});
