import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import WhereIveBeenSection from "~/features/about/components/WhereIveBeenSection";
import { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import type { AboutResponse, Experience } from "~/types/contracts";

const UI = {
  where_ive_been_heading: "Where I've been",
  where_ive_been_order: "Most recent first",
  where_ive_been_show_less: "Show less",
  where_ive_been_show_more: "Show more (%{count})",
};

function timelineFixture(): Experience[] {
  return (contractFixture("api/v1/about/show") as AboutResponse).about.timeline;
}

function renderTimeline(timeline: Experience[] = timelineFixture()) {
  return renderWithProviders(<WhereIveBeenSection timeline={timeline} />, { ui: UI });
}

function visibleCompanies(): string[] {
  const list = screen.getByRole("list");

  return within(list)
    .getAllByRole("listitem")
    .map((row) => row.querySelector("span + span")?.textContent ?? "");
}

function row(company: string): HTMLElement {
  const item = screen.getByText(company).closest("li");
  if (!item) throw new Error(`Expected a row for ${company}`);

  return item;
}

describe("WhereIveBeenSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the heading and ordering note", () => {
    renderTimeline();

    expect(screen.getByRole("region", { name: UI.where_ive_been_heading })).toHaveAttribute(
      "id",
      "experience",
    );
    expect(screen.getByText(UI.where_ive_been_order)).toBeInTheDocument();
  });

  it("shows year, company, role and dates on each row", () => {
    renderTimeline();

    const hnry = within(row("Hnry"));
    expect(hnry.getByText("Now")).toBeInTheDocument();
    expect(hnry.getByText("Senior Software Engineer")).toBeInTheDocument();
    expect(hnry.getByText("Jan 2024 — Present")).toBeInTheDocument();
  });

  it("styles education rows differently from roles", () => {
    renderTimeline();

    expect(row("University of Nottingham")).toHaveAttribute("data-variant", "education");
    expect(row("Hnry")).toHaveAttribute("data-variant", "role");
  });

  describe("on desktop", () => {
    it("shows the three latest roles plus education until expanded", () => {
      renderTimeline();

      expect(visibleCompanies()).toEqual([
        "Hnry",
        "Soho House",
        "Academy",
        "University of Nottingham",
      ]);
    });

    it("reveals the older roles and toggles back", async () => {
      const user = userEvent.setup();
      renderTimeline();

      const toggle = screen.getByRole("button", { name: "Show more (2)" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await user.click(toggle);

      expect(visibleCompanies()).toEqual(timelineFixture().map((entry) => entry.company));
      const collapse = screen.getByRole("button", { name: UI.where_ive_been_show_less });
      expect(collapse).toHaveAttribute("aria-expanded", "true");

      await user.click(collapse);
      expect(visibleCompanies()).toHaveLength(4);
    });

    it("has no toggle when every role fits", () => {
      renderTimeline(timelineFixture().slice(0, 3));

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("on mobile", () => {
    it("lists every entry without a toggle", () => {
      mockMatchMedia([COMPACT_MEDIA_QUERY]);
      renderTimeline();

      expect(visibleCompanies()).toEqual(timelineFixture().map((entry) => entry.company));
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  it("renders nothing without a timeline", () => {
    const { container } = renderTimeline([]);

    expect(container).toBeEmptyDOMElement();
  });
});
