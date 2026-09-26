import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@test/utils";
import ExternalLink from "~/components/ExternalLink/ExternalLink";

const UI = { opens_in_new_tab: "(opens in a new tab)" };

function renderLink() {
  return renderWithProviders(
    <ExternalLink href="https://github.com/Louisf77">GitHub</ExternalLink>,
    {
      ui: UI,
    },
  );
}

describe("ExternalLink", () => {
  it("opens in a new tab", () => {
    renderLink();

    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
  });

  it("gives the new page no opener or referrer", () => {
    renderLink();

    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("tells screen reader users it opens a new tab", () => {
    renderLink();

    expect(screen.getByRole("link", { name: "GitHub (opens in a new tab)" })).toBeInTheDocument();
  });
});
