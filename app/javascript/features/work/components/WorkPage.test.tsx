import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import WorkPage from "~/features/work/components/WorkPage";
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
});
