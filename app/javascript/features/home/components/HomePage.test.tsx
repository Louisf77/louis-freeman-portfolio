import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import HomePage from "~/features/home/components/HomePage";
import { STACK_FRAME_ATTRIBUTE } from "~/hooks/useStickyStack";
import type { HomeResponse, ProfileResponse } from "~/types/contracts";

const UI = {
  experience_heading: "Experience",
  selected_work_coming_soon_body: "Personal projects are on the way.",
  selected_work_coming_soon_label: "Coming soon",
  selected_work_heading: "Selected work",
};

function homeFixture(): HomeResponse {
  return contractFixture("api/v1/home/show") as HomeResponse;
}

function profileFixture(isWorkPublished = true): ProfileResponse {
  const profile = contractFixture("api/v1/profile/show") as ProfileResponse;

  return { profile: { ...profile.profile, work_published: isWorkPublished } };
}

describe("HomePage", () => {
  it("composes the hero, experience, selected work and capabilities sections", () => {
    renderWithProviders(<HomePage />, {
      bootstrapQueries: { home: homeFixture(), profile: profileFixture() },
      ui: UI,
    });

    expect(screen.getAllByRole("region").map((section) => section.id)).toEqual([
      "hero",
      "experience",
      "work",
      "capabilities",
    ]);
  });

  it("stacks every section in its own card frame, led by the hero", () => {
    renderWithProviders(<HomePage />, {
      bootstrapQueries: { home: homeFixture(), profile: profileFixture() },
      ui: UI,
    });

    const frames = screen.getAllByRole("region").map((section) => section.parentElement);
    expect(frames.every((frame) => frame?.hasAttribute(STACK_FRAME_ATTRIBUTE))).toBe(true);
    expect(frames[0]?.nextElementSibling).toBe(frames[1]);
  });

  it("hides Selected work when no case study is featured", () => {
    const home = homeFixture();
    home.home.selected_work.case_studies = [];
    renderWithProviders(<HomePage />, {
      bootstrapQueries: { home, profile: profileFixture() },
      ui: UI,
    });

    expect(screen.queryByRole("heading", { name: "Selected work" })).not.toBeInTheDocument();
  });

  describe("while work is unpublished", () => {
    function renderUnpublished() {
      const home = homeFixture();
      home.home.selected_work.case_studies = [];
      renderWithProviders(<HomePage />, {
        bootstrapQueries: { home, profile: profileFixture(false) },
        ui: UI,
      });
    }

    it("keeps Selected work in its place in the stack", () => {
      renderUnpublished();

      expect(screen.getAllByRole("region").map((section) => section.id)).toEqual([
        "hero",
        "experience",
        "work",
        "capabilities",
      ]);
    });

    it("shows the coming-soon card", () => {
      renderUnpublished();

      expect(screen.getByText("Personal projects are on the way.")).toBeInTheDocument();
    });

    it("links nowhere near Work", () => {
      renderUnpublished();

      expect(screen.queryByRole("link", { name: /work/i })).not.toBeInTheDocument();
    });
  });
});
