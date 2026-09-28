import { act, screen } from "@testing-library/react";
import type { InitialEntry } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockUmami } from "@test/analytics";
import { mockIntersectionObserver } from "@test/browser";
import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import WorkPage from "~/features/work/components/WorkPage";
import { CASE_STUDY_VIEW_DWELL_MS } from "~/features/work/hooks/useTrackCaseStudyView";
import { caseStudyLandingState } from "~/lib/analytics";
import type { WorkResponse } from "~/types/contracts";

const UI = { work_heading: "Work" };

function workFixture(): WorkResponse {
  return contractFixture("api/v1/work/show") as WorkResponse;
}

describe("WorkPage", () => {
  it("shows the heading and the header intro", () => {
    const work = workFixture();
    renderWithProviders(<WorkPage />, { bootstrapQueries: { work }, ui: UI });

    expect(screen.getByRole("heading", { level: 1, name: "Work" })).toBeInTheDocument();
    expect(screen.getByText(work.work.header.intro)).toBeInTheDocument();
  });

  it("renders every case study in order, anchored on its slug", () => {
    const work = workFixture();
    renderWithProviders(<WorkPage />, { bootstrapQueries: { work }, ui: UI });

    expect(screen.getAllByRole("article").map((card) => card.id)).toEqual(
      work.work.case_studies.map((caseStudy) => caseStudy.slug),
    );
  });

  it("puts [redacted] third so /work#[redacted] lands on card 03", () => {
    renderWithProviders(<WorkPage />, { bootstrapQueries: { work: workFixture() }, ui: UI });

    const card = screen.getAllByRole("article")[2];
    expect(card).toHaveAttribute("id", "[redacted]");
    expect(card).toHaveTextContent("03");
  });

  describe("case study view tracking", () => {
    let topElement: (card: Element) => Element | null;

    beforeEach(() => {
      vi.useFakeTimers();
      topElement = (card) => card;
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function cardFor(slug: string) {
      const card = screen.getAllByRole("article").find((article) => article.id === slug);
      if (!card) throw new Error(`No card found for ${slug}`);

      return card;
    }

    function renderTrackedWorkPage(entry: InitialEntry = "/work") {
      const umami = mockUmami();
      const observer = mockIntersectionObserver();
      const { unmount } = renderWithProviders(<WorkPage />, {
        bootstrapQueries: { work: workFixture() },
        initialEntries: [entry],
        ui: UI,
      });
      document.elementFromPoint = () => {
        const cards = screen.getAllByRole("article");
        const intersecting = cards.find((card) => card.dataset.testIntersecting === "true");

        return intersecting ? topElement(intersecting) : null;
      };

      return { observer, umami, unmount };
    }

    function showCard(
      observer: ReturnType<typeof mockIntersectionObserver>,
      slug: string,
      ratio: number,
    ) {
      const card = cardFor(slug);
      card.dataset.testIntersecting = String(ratio > 0);
      act(() => {
        observer.intersect(card, ratio);
      });
    }

    function wait(milliseconds: number) {
      act(() => {
        vi.advanceTimersByTime(milliseconds);
      });
    }

    it("tracks a card that stays half visible for the dwell time", () => {
      const { observer, umami } = renderTrackedWorkPage();

      showCard(observer, "[redacted]", 0.5);
      wait(CASE_STUDY_VIEW_DWELL_MS);

      expect(umami.track).toHaveBeenCalledWith("case_study_view", {
        case_study_slug: "[redacted]",
        source: "work_scroll",
      });
    });

    it("does not track a card before the dwell time", () => {
      const { observer, umami } = renderTrackedWorkPage();

      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS / 2);

      expect(umami.track).not.toHaveBeenCalled();
    });

    it("does not track a card that scrolls straight past", () => {
      const { observer, umami } = renderTrackedWorkPage();

      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS / 2);
      showCard(observer, "[redacted]", 0);
      wait(CASE_STUDY_VIEW_DWELL_MS * 3);

      expect(umami.track).not.toHaveBeenCalled();
    });

    it("does not track a card that is less than half visible", () => {
      const { observer, umami } = renderTrackedWorkPage();

      showCard(observer, "[redacted]", 0.49);
      wait(CASE_STUDY_VIEW_DWELL_MS * 3);

      expect(umami.track).not.toHaveBeenCalled();
    });

    it("does not track a card covered by the card stacked over it", () => {
      const { observer, umami } = renderTrackedWorkPage();
      topElement = () => cardFor("[redacted]");

      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS * 3);

      expect(umami.track).not.toHaveBeenCalled();
    });

    it("tracks a covered card once it stays uncovered for the dwell time", () => {
      const { observer, umami } = renderTrackedWorkPage();
      topElement = () => cardFor("[redacted]");
      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS * 3);

      topElement = (card) => card;
      wait(CASE_STUDY_VIEW_DWELL_MS * 2);

      expect(umami.track).toHaveBeenCalledOnce();
    });

    it("tracks each card only once per page view", () => {
      const { observer, umami } = renderTrackedWorkPage();

      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS * 2);
      showCard(observer, "[redacted]", 0);
      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS * 2);

      expect(umami.track).toHaveBeenCalledOnce();
    });

    it("tracks again on a new page view", () => {
      const { observer, umami, unmount } = renderTrackedWorkPage();
      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS * 2);
      unmount();

      renderWithProviders(<WorkPage />, { bootstrapQueries: { work: workFixture() }, ui: UI });
      showCard(observer, "[redacted]", 1);
      wait(CASE_STUDY_VIEW_DWELL_MS * 2);

      expect(umami.track).toHaveBeenCalledTimes(2);
    });

    describe("after landing from a Home case study link", () => {
      const landing: InitialEntry = {
        hash: "#[redacted]",
        pathname: "/work",
        state: caseStudyLandingState("[redacted]"),
      };

      it("does not track the card it landed on", () => {
        const { observer, umami } = renderTrackedWorkPage(landing);

        showCard(observer, "[redacted]", 1);
        wait(CASE_STUDY_VIEW_DWELL_MS * 3);

        expect(umami.track).not.toHaveBeenCalled();
      });

      it("still tracks the other cards", () => {
        const { observer, umami } = renderTrackedWorkPage(landing);

        showCard(observer, "[redacted]", 1);
        wait(CASE_STUDY_VIEW_DWELL_MS * 2);

        expect(umami.track).toHaveBeenCalledWith("case_study_view", {
          case_study_slug: "[redacted]",
          source: "work_scroll",
        });
      });
    });
  });
});
