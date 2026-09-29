import { act, fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockUmami } from "@test/analytics";
import { mockMatchMedia } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import SelectedWorkSection from "~/features/home/components/SelectedWorkSection";
import { COMPACT_MEDIA_QUERY } from "~/hooks/useMediaQuery";
import type {
  HomeResponse,
  SelectedWorkSection as SelectedWorkSectionContent,
} from "~/types/contracts";

const UI = {
  case_study_metric: "Metric",
  case_study_technologies: "Technologies",
  selected_work_coming_soon_body: "Personal projects are on the way.",
  selected_work_coming_soon_label: "Coming soon",
  selected_work_heading: "Selected work",
  selected_work_read_case_study: "Read case study",
  selected_work_read_case_study_title: ": %{title}",
  selected_work_view_all: "View all work",
};

const IDLE_MS = 30_000;
const CASE_STUDY_TITLES = [
  "Example Project One",
  "Example Project Two",
  "Example Project Three",
  "Example Project Four",
];

function selectedWorkFixture(): SelectedWorkSectionContent {
  return (contractFixture("api/v1/home/show") as HomeResponse).home.selected_work;
}

function withMetric(metric: string): SelectedWorkSectionContent {
  const selectedWork = selectedWorkFixture();
  selectedWork.case_studies = selectedWork.case_studies.map((caseStudy, index) =>
    index === 0 ? { ...caseStudy, metric } : caseStudy,
  );

  return selectedWork;
}

function renderSection(selectedWork = selectedWorkFixture(), isWorkPublished = true) {
  return renderWithProviders(
    <SelectedWorkSection isWorkPublished={isWorkPublished} selectedWork={selectedWork} />,
    { ui: UI },
  );
}

function readLinks() {
  return screen.getAllByRole("link", { name: /Read case study/ });
}

describe("SelectedWorkSection", () => {
  describe("while work is unpublished", () => {
    function renderUnpublished() {
      return renderSection({ ...selectedWorkFixture(), case_studies: [] }, false);
    }

    it("keeps the Selected work heading", () => {
      renderUnpublished();

      expect(screen.getByRole("heading", { level: 2, name: "Selected work" })).toBeInTheDocument();
    });

    it("shows the coming-soon card", () => {
      renderUnpublished();

      expect(screen.getByText("Coming soon")).toBeInTheDocument();
      expect(screen.getByText("Personal projects are on the way.")).toBeInTheDocument();
    });

    it("leaves out the intro", () => {
      renderUnpublished();

      expect(screen.queryByText(selectedWorkFixture().intro)).not.toBeInTheDocument();
    });

    it("links nowhere", () => {
      renderUnpublished();

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("shows no case studies even if some are passed", () => {
      renderSection(selectedWorkFixture(), false);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  it("renders nothing without featured case studies", () => {
    renderSection({ ...selectedWorkFixture(), case_studies: [] });

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("shows the heading and intro", () => {
    renderSection();

    expect(screen.getByRole("heading", { level: 2, name: "Selected work" })).toBeInTheDocument();
    expect(screen.getByText(selectedWorkFixture().intro)).toBeInTheDocument();
  });

  it("links to all work", () => {
    renderSection();

    expect(screen.getByRole("link", { name: /View all work/ })).toHaveAttribute("href", "/work");
  });

  describe("on desktop", () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      mockMatchMedia([]);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function panelToggles() {
      return screen.getAllByRole("button").filter((button) => button.hasAttribute("aria-expanded"));
    }

    function panelToggle(title: string) {
      return screen.getByRole("button", { name: title });
    }

    function openTitle() {
      return screen
        .getAllByRole("button")
        .find((toggle) => toggle.getAttribute("aria-expanded") === "true")
        ?.getAttribute("aria-label");
    }

    function panel(title: string) {
      const toggle = panelToggle(title);
      const article = toggle.closest("article");
      if (!article) throw new Error(`No panel found for ${title}`);

      return article;
    }

    it("shows a panel per featured case study with the first open", () => {
      renderSection();

      expect(panelToggles().map((toggle) => toggle.getAttribute("aria-label"))).toEqual(
        CASE_STUDY_TITLES,
      );
      expect(openTitle()).toBe(CASE_STUDY_TITLES[0]);
    });

    it("adapts to fewer case studies", () => {
      const selectedWork = selectedWorkFixture();
      selectedWork.case_studies = selectedWork.case_studies.slice(0, 2);
      renderSection(selectedWork);

      expect(panelToggles()).toHaveLength(2);
    });

    it("opens a panel on hover", () => {
      renderSection();
      fireEvent.mouseEnter(panel(CASE_STUDY_TITLES[2] ?? ""));

      expect(openTitle()).toBe(CASE_STUDY_TITLES[2]);
    });

    it("opens a panel on focus", () => {
      renderSection();
      act(() => {
        panelToggle(CASE_STUDY_TITLES[1] ?? "").focus();
      });

      expect(openTitle()).toBe(CASE_STUDY_TITLES[1]);
    });

    it("opens a panel on click", async () => {
      renderSection();
      await userEvent.click(panelToggle(CASE_STUDY_TITLES[3] ?? ""));

      expect(openTitle()).toBe(CASE_STUDY_TITLES[3]);
    });

    it("moves between panels with the arrow keys", async () => {
      renderSection();
      act(() => {
        panelToggle(CASE_STUDY_TITLES[0] ?? "").focus();
      });
      await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}");

      expect(panelToggle(CASE_STUDY_TITLES[1] ?? "")).toHaveFocus();
      expect(openTitle()).toBe(CASE_STUDY_TITLES[1]);
    });

    it("jumps to the last panel with End", async () => {
      renderSection();
      act(() => {
        panelToggle(CASE_STUDY_TITLES[0] ?? "").focus();
      });
      await userEvent.keyboard("{End}");

      expect(openTitle()).toBe(CASE_STUDY_TITLES[3]);
    });

    it("tabs from an open panel's toggle into its case study link", async () => {
      renderSection();
      act(() => {
        panelToggle(CASE_STUDY_TITLES[1] ?? "").focus();
      });
      await userEvent.tab();

      expect(within(panel(CASE_STUDY_TITLES[1] ?? "")).getByRole("link")).toHaveFocus();
    });

    it("keeps closed panels' content out of reach", () => {
      renderSection();

      expect(
        within(panel(CASE_STUDY_TITLES[1] ?? ""))
          .getByRole("link")
          .closest("[inert]"),
      ).not.toBeNull();
      expect(
        within(panel(CASE_STUDY_TITLES[0] ?? ""))
          .getByRole("link")
          .closest("[inert]"),
      ).toBeNull();
    });

    it("keeps the open panel until the visitor picks another", () => {
      renderSection();
      act(() => {
        vi.advanceTimersByTime(IDLE_MS);
      });

      expect(openTitle()).toBe(CASE_STUDY_TITLES[0]);
    });

    it("shows the number, years and role in the open panel", () => {
      renderSection();

      expect(
        within(panel(CASE_STUDY_TITLES[0] ?? "")).getByText("01 · 2024–25 · Lead engineer"),
      ).toBeInTheDocument();
    });

    it("links each panel to its case study", () => {
      renderSection();

      expect(readLinks().map((link) => link.getAttribute("href"))).toEqual([
        "/work#example-project-one",
        "/work#example-project-two",
        "/work#example-project-three",
        "/work#example-project-four",
      ]);
    });

    it("hides the metric when there is none", () => {
      renderSection();

      expect(screen.queryByText("Metric")).not.toBeInTheDocument();
    });

    it("shows the metric when there is one", () => {
      renderSection(withMetric("Example metric"));

      expect(
        within(panel(CASE_STUDY_TITLES[0] ?? "")).getByText("Example metric"),
      ).toBeInTheDocument();
    });

    it("tracks a case study view when an open panel's link is clicked", async () => {
      const umami = mockUmami();
      renderSection();
      await userEvent.click(panelToggle(CASE_STUDY_TITLES[2] ?? ""));
      await userEvent.click(within(panel(CASE_STUDY_TITLES[2] ?? "")).getByRole("link"));

      expect(umami.track).toHaveBeenCalledWith("case_study_view", {
        case_study_slug: "example-project-three",
        source: "home_link",
      });
    });

    it("does not track opening a panel", async () => {
      const umami = mockUmami();
      renderSection();
      await userEvent.click(panelToggle(CASE_STUDY_TITLES[2] ?? ""));

      expect(umami.track).not.toHaveBeenCalled();
    });
  });

  describe("on mobile", () => {
    beforeEach(() => {
      mockMatchMedia([COMPACT_MEDIA_QUERY]);
    });

    function card(title: string) {
      const article = screen.getByRole("heading", { level: 3, name: title }).closest("article");
      if (!article) throw new Error(`No card found for ${title}`);

      return article;
    }

    it("names each read link after its case study", () => {
      renderSection();

      const names = CASE_STUDY_TITLES.map(
        (title) => screen.getByRole("link", { name: `Read case study: ${title}` }).textContent,
      );

      expect(names).toHaveLength(CASE_STUDY_TITLES.length);
    });

    it("stacks a card per featured case study", () => {
      renderSection();

      expect(
        screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
      ).toEqual(CASE_STUDY_TITLES);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("shows the number and years on each card", () => {
      renderSection();
      const firstCard = card(CASE_STUDY_TITLES[0] ?? "");

      expect(within(firstCard).getByText("01")).toBeInTheDocument();
      expect(within(firstCard).getByText("2024–25")).toBeInTheDocument();
    });

    it("links each card to its case study", () => {
      renderSection();

      expect(readLinks().map((link) => link.getAttribute("href"))).toEqual([
        "/work#example-project-one",
        "/work#example-project-two",
        "/work#example-project-three",
        "/work#example-project-four",
      ]);
    });

    it("hides the metric when there is none", () => {
      renderSection();

      expect(screen.queryByText("Metric")).not.toBeInTheDocument();
    });

    it("shows the metric when there is one", () => {
      renderSection(withMetric("Example metric"));

      expect(
        within(card(CASE_STUDY_TITLES[0] ?? "")).getByText("Example metric"),
      ).toBeInTheDocument();
    });

    it("tracks a case study view when a card's link is clicked", async () => {
      const umami = mockUmami();
      renderSection();
      await userEvent.click(within(card(CASE_STUDY_TITLES[3] ?? "")).getByRole("link"));

      expect(umami.track).toHaveBeenCalledWith("case_study_view", {
        case_study_slug: "example-project-four",
        source: "home_link",
      });
    });
  });
});
