import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter } from "react-router";

import AppRoutes from "~/app/AppRoutes";
import { readPageBootstrap } from "~/lib/bootstrap";
import { BootstrapQueriesProvider } from "~/lib/bootstrapQueries";
import { createQueryClient } from "~/lib/queryClient";
import { UiProvider } from "~/lib/ui";

function App() {
  const [queryClient] = useState(createQueryClient);
  const [{ queries, ui }] = useState(readPageBootstrap);

  return (
    <UiProvider strings={ui}>
      <BootstrapQueriesProvider queries={queries}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </BootstrapQueriesProvider>
    </UiProvider>
  );
}

export default App;
