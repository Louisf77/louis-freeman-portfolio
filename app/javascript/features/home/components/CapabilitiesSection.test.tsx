import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { contractFixture } from "@test/contracts";
import { renderWithProviders } from "@test/utils";
import CapabilitiesSection from "~/features/home/components/CapabilitiesSection";
import type { CapabilitiesSection as CapabilitiesContent, HomeResponse } from "~/types/contracts";

const UI = { capabilities_domain_label: "Domain", stack_ticker_label: "Stack: %{items}" };

function capabilitiesFixture(): CapabilitiesContent {
  return (contractFixture("api/v1/home/show") as HomeResponse).home.capabilities;
}

function renderCapabilities(capabilities: CapabilitiesContent = capabilitiesFixture()) {
  return renderWithProviders(<CapabilitiesSection capabilities={capabilities} />, { ui: UI });
}

describe("CapabilitiesSection", () => {
  it("shows the title and intro", () => {
    const capabilities = capabilitiesFixture();
    renderCapabilities(capabilities);

    expect(screen.getByRole("region", { name: capabilities.title })).toHaveAttribute(
      "id",
      "capabilities",
    );
    expect(screen.getByText(capabilities.intro)).toBeInTheDocument();
  });

  it("renders a card per group with its capabilities as chips", () => {
    const capabilities = capabilitiesFixture();
    renderCapabilities(capabilities);

    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards.map((heading) => heading.textContent)).toEqual(
      capabilities.groups.map((group) => group.title),
    );

    const [firstGroup] = capabilities.groups;
    const firstCard = cards[0]?.parentElement;
    if (!firstGroup || !firstCard) throw new Error("Expected a capability group in the fixture");
    expect(
      within(firstCard)
        .getAllByRole("listitem")
        .map((chip) => chip.textContent),
    ).toEqual(firstGroup.capabilities.map((capability) => capability.name));
  });

  it("lists the domains in the Domain box", () => {
    const capabilities = capabilitiesFixture();
    renderCapabilities(capabilities);

    const domainBox = screen.getByText("Domain").parentElement;
    if (!domainBox) throw new Error("Expected the Domain box");
    expect(
      within(domainBox)
        .getAllByRole("listitem")
        .map((chip) => chip.textContent),
    ).toEqual(capabilities.domains.map((domain) => domain.label));
  });

  it("summarises the stack ticker for screen readers and hides the moving copy", () => {
    const capabilities = capabilitiesFixture();
    renderCapabilities(capabilities);
    const labels = capabilities.ticker.map((item) => item.label);

    const ticker = screen.getByRole("img", { name: `Stack: ${labels.join(", ")}` });
    const track = ticker.firstElementChild;
    expect(track).toHaveAttribute("aria-hidden", "true");
    expect(track?.children).toHaveLength(labels.length * 2);
  });

  it("hides the Domain box and ticker when they are empty", () => {
    renderCapabilities({ ...capabilitiesFixture(), domains: [], ticker: [] });

    expect(screen.queryByText("Domain")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
