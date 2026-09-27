import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { mockScrollIntoView, mockScrollTo } from "@test/browser";
import { renderWithProviders } from "@test/utils";
import ScrollToLocation from "~/app/ScrollToLocation";

const SCROLLED_Y = 1200;
const NATURAL_VIEWPORT_TOP = 500;
const STUCK_VIEWPORT_TOP = 104;
const SCROLL_MARGIN_TOP = 104;
const STUCK_FRAME_VIEWPORT_TOP = -3000;

function renderAt(path: string, target = <div id="[redacted]" />) {
  return renderWithProviders(
    <>
      {target}
      <Link to="/work#[redacted]">{"[redacted]"}</Link>
      <ScrollToLocation />
    </>,
    { initialEntries: [path] },
  );
}

function stuckCard() {
  return (
    <div
      id="[redacted]"
      ref={(element) => {
        if (!element) return;

        element.getBoundingClientRect = () =>
          DOMRect.fromRect({
            height: 640,
            width: 0,
            x: 0,
            y: element.style.position === "sticky" ? STUCK_VIEWPORT_TOP : NATURAL_VIEWPORT_TOP,
          });
      }}
      style={{ position: "sticky", scrollMarginTop: SCROLL_MARGIN_TOP, top: STUCK_VIEWPORT_TOP }}
    />
  );
}

function stuckFrame() {
  return (
    <div
      ref={(element) => {
        if (!element) return;

        element.getBoundingClientRect = () =>
          DOMRect.fromRect({
            height: 3900,
            width: 0,
            x: 0,
            y:
              element.style.position === "sticky" ? STUCK_FRAME_VIEWPORT_TOP : NATURAL_VIEWPORT_TOP,
          });
      }}
      style={{ position: "sticky", top: STUCK_FRAME_VIEWPORT_TOP }}
    >
      <section id="[redacted]" />
    </div>
  );
}

function scrollPageTo(y: number) {
  vi.stubGlobal("scrollY", y);
}

const EXPECTED_STICKY_TOP = SCROLLED_Y + NATURAL_VIEWPORT_TOP - SCROLL_MARGIN_TOP;

describe("ScrollToLocation", () => {
  it("scrolls to the top on a plain path", () => {
    const scrollTo = mockScrollTo();
    renderAt("/work");

    expect(scrollTo).toHaveBeenCalledWith({ behavior: "instant", left: 0, top: 0 });
  });

  it("scrolls the hash target into view", () => {
    const scrollIntoView = mockScrollIntoView();
    renderAt("/work#[redacted]");

    expect(scrollIntoView).toHaveBeenCalledOnce();
  });

  it("leaves the scroll position alone when a non-sticky hash target is present", () => {
    mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/work#[redacted]");

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls a stuck sticky target to its natural position when arriving from a scrolled page", () => {
    scrollPageTo(SCROLLED_Y);
    const scrollIntoView = mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/work#[redacted]", stuckCard());

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, top: EXPECTED_STICKY_TOP });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("scrolls to the natural position of the stuck sticky frame around the target", () => {
    scrollPageTo(SCROLLED_Y);
    const scrollIntoView = mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/#[redacted]", stuckFrame());

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, top: SCROLLED_Y + NATURAL_VIEWPORT_TOP });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("restores the sticky target's position after measuring it", () => {
    scrollPageTo(SCROLLED_Y);
    renderAt("/work#[redacted]", stuckCard());

    expect(document.getElementById("[redacted]")).toHaveStyle({ position: "sticky" });
  });

  it("scrolls back to an earlier stuck card on an in-page hash change", async () => {
    scrollPageTo(SCROLLED_Y);
    const scrollTo = mockScrollTo();
    renderAt("/work", stuckCard());
    scrollTo.mockClear();

    await act(async () => {
      await userEvent.click(screen.getByRole("link", { name: "[redacted]" }));
    });

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, top: EXPECTED_STICKY_TOP });
  });
});
