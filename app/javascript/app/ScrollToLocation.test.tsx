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
const PAGE_ENTER_OFFSET = 28;

function renderAt(path: string, target = <div id="example-project-one" />) {
  return renderWithProviders(
    <>
      {target}
      <Link to="/work#example-project-one">{"Example project one"}</Link>
      <ScrollToLocation />
    </>,
    { initialEntries: [path] },
  );
}

function stuckCard() {
  return (
    <div
      id="example-project-one"
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
      <section id="example-project-one" />
    </div>
  );
}

function enteringTarget() {
  return (
    <div style={{ transform: `matrix(1, 0, 0, 1, 0, ${String(PAGE_ENTER_OFFSET)})` }}>
      <section
        id="example-project-one"
        ref={(element) => {
          if (!element) return;

          element.getBoundingClientRect = () =>
            DOMRect.fromRect({ height: 640, width: 0, x: 0, y: NATURAL_VIEWPORT_TOP });
        }}
      />
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

  it("jumps straight to the hash target when arriving on the page", () => {
    const scrollIntoView = mockScrollIntoView();
    renderAt("/work#example-project-one");

    expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: "instant" });
  });

  it("scrolls to the hash target again once web fonts have reflowed the page", async () => {
    scrollPageTo(SCROLLED_Y);
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
    const scrollTo = mockScrollTo();
    renderAt("/work#example-project-one", stuckCard());

    await act(async () => {
      await Promise.resolve();
    });
    Reflect.deleteProperty(document, "fonts");

    expect(scrollTo).toHaveBeenCalledTimes(2);
  });

  it("starts from the top while the arriving page's hash target is still loading", () => {
    const scrollTo = mockScrollTo();
    renderAt("/work#example-project-one", <div />);

    expect(scrollTo).toHaveBeenCalledWith({ behavior: "instant", left: 0, top: 0 });
  });

  it("leaves the scroll position alone when a non-sticky hash target is present", () => {
    mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/work#example-project-one");

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls a stuck sticky target to its natural position when arriving from a scrolled page", () => {
    scrollPageTo(SCROLLED_Y);
    const scrollIntoView = mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/work#example-project-one", stuckCard());

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "instant",
      left: 0,
      top: EXPECTED_STICKY_TOP,
    });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("scrolls to the natural position of the stuck sticky frame around the target", () => {
    scrollPageTo(SCROLLED_Y);
    const scrollIntoView = mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/#example-project-one", stuckFrame());

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "instant",
      left: 0,
      top: SCROLLED_Y + NATURAL_VIEWPORT_TOP,
    });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("restores the sticky target's position after measuring it", () => {
    scrollPageTo(SCROLLED_Y);
    renderAt("/work#example-project-one", stuckCard());

    expect(document.getElementById("example-project-one")).toHaveStyle({ position: "sticky" });
  });

  it("hands scroll restoration to the app so Back lands on the hash target", () => {
    renderAt("/work");

    expect(window.history.scrollRestoration).toBe("manual");
  });

  it("measures a target under the page-enter offset at its settled position", () => {
    scrollPageTo(SCROLLED_Y);
    const scrollIntoView = mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/#example-project-one", enteringTarget());

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "instant",
      left: 0,
      top: SCROLLED_Y + NATURAL_VIEWPORT_TOP - PAGE_ENTER_OFFSET,
    });
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("scrolls to the same hash again when it is followed a second time", async () => {
    scrollPageTo(SCROLLED_Y);
    const scrollTo = mockScrollTo();
    renderAt("/work", stuckCard());
    scrollTo.mockClear();

    await act(async () => {
      await userEvent.click(screen.getByRole("link", { name: "Example project one" }));
    });
    await act(async () => {
      await userEvent.click(screen.getByRole("link", { name: "Example project one" }));
    });

    expect(scrollTo).toHaveBeenCalledTimes(2);
  });

  it("scrolls back to an earlier stuck card on an in-page hash change", async () => {
    scrollPageTo(SCROLLED_Y);
    const scrollTo = mockScrollTo();
    renderAt("/work", stuckCard());
    scrollTo.mockClear();

    await act(async () => {
      await userEvent.click(screen.getByRole("link", { name: "Example project one" }));
    });

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      left: 0,
      top: EXPECTED_STICKY_TOP,
    });
  });
});
