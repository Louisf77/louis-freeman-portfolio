import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "~/styles/tokens.css";
import "~/styles/base.css";

import App from "~/app/App";

async function prepareDataSource(): Promise<void> {
  if (!import.meta.env.DEV) return;

  const { installContractFixtureFetch } = await import("~/lib/contractFixtureFetch");
  installContractFixtureFetch();
}

async function mount(): Promise<void> {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  await prepareDataSource();
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

await mount();
