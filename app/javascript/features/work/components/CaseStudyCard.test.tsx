import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import CaseStudyCard from "~/features/work/components/CaseStudyCard";
import type { CaseStudy, WorkResponse } from "~/types/contracts";

const UI = {
  case_study_metric: "Metric",
  case_study_role: "Role",
  case_study_technologies: "Technologies",
};

function caseStudyFixture(overrides: Partial<CaseStudy> = {}): CaseStudy {
  const [caseStudy] = (contractFixture("api/v1/work/show") as WorkResponse).work.case_studies;
  if (!caseStudy) throw new Error("The work contract fixture has no case studies");

  return { ...caseStudy, ...overrides };
}

function renderCard(caseStudy: CaseStudy, index = 0) {
  return renderWithProviders(<CaseStudyCard caseStudy={caseStudy} index={index} />, { ui: UI });
}

describe("CaseStudyCard", () => {
  it("anchors the card on its slug and labels it by its title", () => {
    const caseStudy = caseStudyFixture({ slug: "example-project-three", title: "Tax return" });
    renderCard(caseStudy);

    const card = screen.getByRole("article", { name: "Tax return" });
    expect(card).toHaveAttribute("id", "example-project-three");
  });

  it("shows the number, years, headline, description, role and tags", () => {
    const caseStudy = caseStudyFixture();
    renderCard(caseStudy);

    const card = screen.getByRole("article");
    expect(within(card).getByText(caseStudy.number)).toBeInTheDocument();
    expect(within(card).getByText(caseStudy.years_label)).toBeInTheDocument();
    expect(within(card).getByText(caseStudy.headline)).toBeInTheDocument();
    expect(within(card).getByText(caseStudy.description)).toBeInTheDocument();
    expect(within(card).getByText(caseStudy.role)).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Technologies" }))
        .getAllByRole("listitem")
        .map((tag) => tag.textContent),
    ).toEqual(caseStudy.tags);
  });

  it("hides the metric box when the metric is null", () => {
    renderCard(caseStudyFixture({ metric: null }));

    expect(screen.queryByText("Metric")).not.toBeInTheDocument();
  });

  it("shows the metric box when the metric is present", () => {
    renderCard(caseStudyFixture({ metric: "40% fewer manual checks" }));

    expect(screen.getByText("Metric")).toBeInTheDocument();
    expect(screen.getByText("40% fewer manual checks")).toBeInTheDocument();
  });

  it("sets its sticky offsets and stacking order from its position", () => {
    renderCard(caseStudyFixture(), 3);

    const card = screen.getByRole("article");
    expect(card.style.getPropertyValue("--stack-top-wide")).toBe("170px");
    expect(card.style.getPropertyValue("--stack-top-compact")).toBe("114px");
    expect(card.style.zIndex).toBe("4");
  });

  it("alternates the surface and diagram side between neighbours", () => {
    const { rerender } = renderCard(caseStudyFixture(), 0);
    const evenClass = screen.getByRole("article").className;

    rerender(<CaseStudyCard caseStudy={caseStudyFixture()} index={1} />);

    expect(screen.getByRole("article").className).not.toBe(evenClass);
  });
});
