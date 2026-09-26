import { describe, expect, it } from "vitest";

import { mockScrollIntoView, mockScrollTo } from "@test/browser";
import { renderWithProviders } from "@test/utils";
import ScrollToLocation from "~/app/ScrollToLocation";

function renderAt(path: string) {
  return renderWithProviders(
    <>
      <div id="[redacted]" />
      <ScrollToLocation />
    </>,
    { initialEntries: [path] },
  );
}

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

  it("leaves the scroll position alone when a hash is present", () => {
    mockScrollIntoView();
    const scrollTo = mockScrollTo();
    renderAt("/work#[redacted]");

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
