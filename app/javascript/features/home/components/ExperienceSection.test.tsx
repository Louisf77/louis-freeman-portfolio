import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia, mockScrollTo } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import ExperienceSection from "~/features/home/components/ExperienceSection";
import { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import { REDUCED_MOTION_MEDIA_QUERY } from "~/hooks/useReducedMotion";
import type {
  ExperienceSection as ExperienceSectionContent,
  HomeResponse,
} from "~/types/contracts";

const UI = {
  experience_companies_label: "Companies",
  experience_counter: "%{current} / %{total}",
  experience_deck_description: "carousel",
  experience_heading: "Experience",
  experience_hint_scroll: "Scroll to flip through",
  experience_hint_static: "Pick a company to flip through",
  experience_next: "Next role",
  experience_previous: "Previous role",
  experience_slide_description: "slide",
  experience_slide_label: "%{current} of %{total}",
  experience_technologies: "Technologies",
  experience_time_there: "Time there",
};

const LONG_IDLE_MS = 60_000;
const TRACK_TOP = 100;
const TRACK_HEIGHT = 4000;
const SWIPE_DISTANCE = 120;

function experienceFixture(): ExperienceSectionContent {
  return (contractFixture("api/v1/home/show") as HomeResponse).home.experience;
}

function renderSection(experience = experienceFixture()) {
  return renderWithProviders(<ExperienceSection experience={experience} />, { ui: UI });
}

function currentCompany() {
  return screen.getByRole("heading", { level: 3 }).textContent;
}

describe("ExperienceSection", () => {
  it("renders nothing without experiences", () => {
    renderSection({ experiences: [] });

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  describe("on mobile", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      mockMatchMedia([COMPACT_MEDIA_QUERY]);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function nextButton() {
      return screen.getByRole("button", { name: "Next role" });
    }

    function previousButton() {
      return screen.getByRole("button", { name: "Previous role" });
    }

    it("starts on the first role with a 01 / 06 counter", () => {
      renderSection();

      expect(screen.getByText("01 / 06")).toBeInTheDocument();
      expect(currentCompany()).toBe("Hnry");
    });

    it("moves to the next role", async () => {
      renderSection();
      await userEvent.click(nextButton());

      expect(screen.getByText("02 / 06")).toBeInTheDocument();
      expect(currentCompany()).toBe("Soho House");
    });

    it("moves back to the previous role", async () => {
      renderSection();
      await userEvent.click(nextButton());
      await userEvent.click(previousButton());

      expect(currentCompany()).toBe("Hnry");
    });

    it("disables Previous on the first role", () => {
      renderSection();

      expect(previousButton()).toBeDisabled();
    });

    it("disables Next on the last role", async () => {
      renderSection();
      for (let step = 0; step < 5; step += 1) await userEvent.click(nextButton());

      expect(screen.getByText("06 / 06")).toBeInTheDocument();
      expect(nextButton()).toBeDisabled();
    });

    it("holds the first role while the visitor waits", () => {
      renderSection();
      act(() => {
        vi.advanceTimersByTime(LONG_IDLE_MS);
      });

      expect(currentCompany()).toBe("Hnry");
      expect(screen.getByText("01 / 06")).toBeInTheDocument();
    });

    it("holds the chosen role after the visitor moves on", async () => {
      renderSection();
      await userEvent.click(nextButton());
      act(() => {
        vi.advanceTimersByTime(LONG_IDLE_MS);
      });

      expect(currentCompany()).toBe("Soho House");
    });

    it("announces the counter politely", () => {
      renderSection();

      expect(screen.getByText("01 / 06")).toHaveAttribute("aria-live", "polite");
    });

    it("moves with the arrow keys", async () => {
      renderSection();
      screen.getByRole("group", { name: "Experience" }).focus();
      await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}");

      expect(currentCompany()).toBe("Soho House");
    });

    it("advances on a left swipe", () => {
      renderSection();
      const deck = screen.getByRole("group", { name: "Experience" });
      fireEvent.touchStart(deck, { touches: [{ clientX: SWIPE_DISTANCE * 2, clientY: 0 }] });
      fireEvent.touchEnd(deck, { changedTouches: [{ clientX: SWIPE_DISTANCE, clientY: 0 }] });

      expect(currentCompany()).toBe("Soho House");
    });

    it("shows at most three highlights", () => {
      renderSection();
      const card = screen.getByRole("group", { name: "1 of 6" });
      const highlights = experienceFixture().experiences[0]?.highlights ?? [];

      expect(within(card).getByText(highlights[2] ?? "")).toBeInTheDocument();
      expect(within(card).queryByText(highlights[3] ?? "")).not.toBeInTheDocument();
    });
  });

  describe("on desktop", () => {
    beforeEach(() => {
      vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(
        DOMRect.fromRect({ height: TRACK_HEIGHT, width: 0, x: 0, y: TRACK_TOP }),
      );
    });

    function companyTab(company: string) {
      return screen.getByRole("tab", { name: company });
    }

    it("lists every company with the first selected", () => {
      renderSection();

      expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual(
        experienceFixture().experiences.map((experience) => experience.company),
      );
      expect(companyTab("Hnry")).toHaveAttribute("aria-selected", "true");
    });

    it("shows the selected role's card", () => {
      renderSection();

      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Hnry");
    });

    it("scrolls to a company's card when it is clicked", async () => {
      const scrollTo = mockScrollTo();
      renderSection();
      await userEvent.click(companyTab("NHS"));

      const scrollableDistance = TRACK_HEIGHT - window.innerHeight;
      expect(scrollTo).toHaveBeenCalledWith({
        behavior: "smooth",
        top: TRACK_TOP + (3.5 / 6) * scrollableDistance,
      });
    });

    it("moves focus between companies with the arrow keys", async () => {
      const scrollTo = mockScrollTo();
      renderSection();
      companyTab("Hnry").focus();
      await userEvent.keyboard("{ArrowDown}");

      expect(companyTab("Soho House")).toHaveFocus();
      expect(scrollTo).toHaveBeenCalledTimes(1);
    });

    it("jumps to the last company with End", async () => {
      renderSection();
      companyTab("Hnry").focus();
      await userEvent.keyboard("{End}");

      expect(companyTab("University of Nottingham")).toHaveFocus();
    });

    it("selects a company directly with reduced motion", async () => {
      mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
      renderSection();
      await userEvent.click(companyTab("MediaVision"));

      expect(companyTab("MediaVision")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveAccessibleName("MediaVision");
    });

    it("shows the time there on sparse cards", async () => {
      mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
      renderSection();
      await userEvent.click(companyTab("MediaVision"));

      expect(within(screen.getByRole("tabpanel")).getByText("3 months")).toBeInTheDocument();
    });

    it("leaves the time there off cards with three or more highlights", async () => {
      mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
      renderSection();
      await userEvent.click(companyTab("Soho House"));

      expect(
        within(screen.getByRole("tabpanel")).queryByText("2 years, 2 months"),
      ).not.toBeInTheDocument();
    });

    it("keeps the watermark out of the accessible text", () => {
      renderSection();
      const watermark = screen.getByRole("tabpanel").querySelector("[data-watermark]");

      expect(watermark).toHaveAttribute("data-watermark", "Hnry");
      expect(watermark).toBeEmptyDOMElement();
    });

    it("uses the short mark as the watermark when one is set", async () => {
      mockMatchMedia([REDUCED_MOTION_MEDIA_QUERY]);
      renderSection();
      await userEvent.click(companyTab("University of Nottingham"));

      expect(screen.getByRole("tabpanel").querySelector("[data-watermark]")).toHaveAttribute(
        "data-watermark",
        "UON",
      );
    });

    it("shows promotion subs", () => {
      renderSection();

      expect(
        within(screen.getByRole("tabpanel")).getByText("Promoted to Senior Software Engineer"),
      ).toBeInTheDocument();
    });
  });
});
