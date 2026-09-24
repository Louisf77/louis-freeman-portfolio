import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { readPageBootstrap } from "~/bootstrap";
import ConsentProvider from "~/consent/ConsentProvider";
import CookieBanner from "~/consent/CookieBanner";
import { cookieBannerCopy } from "~/consent/cookieBannerCopy";
import CookieSettingsButton from "~/consent/CookieSettingsButton";
import Home from "~/pages/Home";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [{ ui }] = useState(readPageBootstrap);

  return (
    <ConsentProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Home heading={ui.hello_heading ?? ""} />} path="/" />
          </Routes>
          <footer>
            <CookieSettingsButton label={ui.cookie_settings ?? ""} />
          </footer>
        </BrowserRouter>
      </QueryClientProvider>
      <CookieBanner copy={cookieBannerCopy(ui)} />
    </ConsentProvider>
  );
}

export default App;
