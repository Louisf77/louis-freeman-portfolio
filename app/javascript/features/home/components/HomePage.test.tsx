import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import HomePage from "~/features/home/components/HomePage";
import type { HomeResponse } from "~/types/contracts";

const UI = { experience_heading: "Experience", selected_work_heading: "Selected work" };

function homeFixture(): HomeResponse {
  return contractFixture("api/v1/home/show") as HomeResponse;
}

describe("HomePage", () => {
  it("composes the hero, experience, selected work and capabilities sections", () => {
    renderWithProviders(<HomePage />, { bootstrapQueries: { home: homeFixture() }, ui: UI });

    expect(screen.getAllByRole("region").map((section) => section.id)).toEqual([
      "hero",
      "experience",
      "work",
      "capabilities",
    ]);
  });

  it("hides Selected work when no case study is featured", () => {
    const home = homeFixture();
    home.home.selected_work.case_studies = [];
    renderWithProviders(<HomePage />, { bootstrapQueries: { home }, ui: UI });

    expect(screen.queryByRole("heading", { name: "Selected work" })).not.toBeInTheDocument();
  });
});
