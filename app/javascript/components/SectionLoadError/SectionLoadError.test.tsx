import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "@test/utils";
import SectionLoadError from "~/components/SectionLoadError/SectionLoadError";

const UI = { page_load_error: "Couldn't load this page.", retry: "Retry", retrying: "Retrying…" };

describe("SectionLoadError", () => {
  it("announces that the page could not load", () => {
    renderWithProviders(<SectionLoadError isRetrying={false} onRetry={vi.fn()} />, { ui: UI });

    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't load this page.");
  });

  it("names the specific problem when the API gives one", () => {
    renderWithProviders(
      <SectionLoadError
        detail="Hero section has not been seeded"
        isRetrying={false}
        onRetry={vi.fn()}
      />,
      { ui: UI },
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Hero section has not been seeded");
  });

  it("retries when Retry is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithProviders(<SectionLoadError isRetrying={false} onRetry={onRetry} />, { ui: UI });

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("disables Retry while a retry is in flight", () => {
    renderWithProviders(<SectionLoadError isRetrying onRetry={vi.fn()} />, { ui: UI });

    expect(screen.getByRole("button", { name: "Retrying…" })).toBeDisabled();
  });
});
