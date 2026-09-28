import { describe, expect, it, vi } from "vitest";

import { mockUmami } from "@test/analytics";
import { pageTypeFor, track } from "~/lib/analytics";

describe("track", () => {
  it("sends the event and its data to Umami", () => {
    const umami = mockUmami();

    track("contact_click", { location: "footer", method: "email", page_type: "home" });

    expect(umami.track).toHaveBeenCalledWith("contact_click", {
      location: "footer",
      method: "email",
      page_type: "home",
    });
  });

  it("sends a case study view", () => {
    const umami = mockUmami();

    track("case_study_view", { case_study_slug: "[redacted]", source: "work_scroll" });

    expect(umami.track).toHaveBeenCalledWith("case_study_view", {
      case_study_slug: "[redacted]",
      source: "work_scroll",
    });
  });

  it("does nothing when the Umami script is absent", () => {
    vi.stubGlobal("umami", undefined);

    expect(() => {
      track("contact_click", { location: "nav", method: "github", page_type: "work" });
    }).not.toThrow();
  });

  it("handles a rejected Umami request", () => {
    const umami = mockUmami();
    const failedDelivery = Promise.reject(new Error("Network error"));
    const handleFailure = vi.spyOn(failedDelivery, "catch");
    umami.track.mockReturnValue(failedDelivery);

    track("contact_click", { location: "nav", method: "linkedin", page_type: "about" });

    expect(handleFailure).toHaveBeenCalledOnce();
  });
});

describe("pageTypeFor", () => {
  it("maps the home path", () => {
    expect(pageTypeFor("/")).toBe("home");
  });

  it("maps the work path", () => {
    expect(pageTypeFor("/work")).toBe("work");
  });

  it("maps the about path", () => {
    expect(pageTypeFor("/about")).toBe("about");
  });

  it("returns undefined for an unknown path", () => {
    expect(pageTypeFor("/nope")).toBeUndefined();
  });
});
