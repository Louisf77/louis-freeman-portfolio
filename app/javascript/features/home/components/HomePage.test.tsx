import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@test/utils";
import HomePage from "~/features/home/components/HomePage";

describe("HomePage", () => {
  it("renders the heading it is given", () => {
    renderWithProviders(<HomePage heading="Hello" />);

    expect(screen.getByRole("heading", { level: 1, name: "Hello" })).toBeInTheDocument();
  });
});
