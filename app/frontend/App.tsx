import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { readPageBootstrap } from "~/bootstrap";
import Home from "~/pages/Home";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [{ ui }] = useState(readPageBootstrap);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Home heading={ui.hello_heading ?? ""} />} path="/" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
