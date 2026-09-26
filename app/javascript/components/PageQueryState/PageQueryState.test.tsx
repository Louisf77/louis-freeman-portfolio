import { useQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@test/utils";
import PageQueryState from "~/components/PageQueryState/PageQueryState";
import { ApiError } from "~/lib/apiClient";

interface FailingPageProps {
  error: Error;
}

const UI = { page_load_error: "Couldn't load this page.", retry: "Retry" };

function FailingPage({ error }: FailingPageProps) {
  const query = useQuery<string>({
    queryFn: () => Promise.reject(error),
    queryKey: ["failing", error.message],
  });

  return <PageQueryState query={query}>{(data) => <p>{data}</p>}</PageQueryState>;
}

describe("PageQueryState", () => {
  it("names the API's specific problem", async () => {
    renderWithProviders(
      <FailingPage error={new ApiError("Work header has not been seeded", 404)} />,
      { ui: UI },
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Work header has not been seeded");
  });

  it("shows only the UI message on a network failure", async () => {
    renderWithProviders(<FailingPage error={new TypeError("Failed to fetch")} />, { ui: UI });

    expect(await screen.findByRole("alert")).not.toHaveTextContent("Failed to fetch");
  });

  it("still offers Retry on a network failure", async () => {
    renderWithProviders(<FailingPage error={new TypeError("Failed to fetch")} />, { ui: UI });

    expect(await screen.findByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
