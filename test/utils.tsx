import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { BootstrapQueriesProvider } from "~/lib/bootstrapQueries";
import { UiProvider } from "~/lib/ui";
import type { QueryResponses, UiStrings } from "~/types/contracts";

interface ProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  bootstrapQueries?: Partial<QueryResponses>;
  initialEntries?: string[];
  ui?: UiStrings;
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    bootstrapQueries = {},
    initialEntries = ["/"],
    ui: strings = {},
    ...options
  }: ProvidersOptions = {},
) {
  const queryClient = createTestQueryClient();

  function Providers({ children }: { children: ReactNode }) {
    return (
      <UiProvider strings={strings}>
        <BootstrapQueriesProvider queries={bootstrapQueries}>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </QueryClientProvider>
        </BootstrapQueriesProvider>
      </UiProvider>
    );
  }

  return { queryClient, ...render(ui, { wrapper: Providers, ...options }) };
}
