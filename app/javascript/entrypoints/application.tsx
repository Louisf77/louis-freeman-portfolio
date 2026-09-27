import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "~/styles/tokens.css";
import "~/styles/base.css";

import App from "~/app/App";

function mount(): void {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

mount();
