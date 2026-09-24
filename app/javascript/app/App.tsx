import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import HomePage from "~/features/home/components/HomePage";
import { readPageBootstrap } from "~/lib/bootstrap";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [{ ui }] = useState(readPageBootstrap);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<HomePage heading={ui.hello_heading ?? ""} />} path="/" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
