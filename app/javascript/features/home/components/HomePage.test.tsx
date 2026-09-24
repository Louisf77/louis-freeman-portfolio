import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@test/utils";
import Home from "~/pages/Home";

describe("Home", () => {
  it("renders the heading it is given", () => {
    renderWithProviders(<Home heading="Hello" />);

    expect(screen.getByRole("heading", { level: 1, name: "Hello" })).toBeInTheDocument();
  });
});
