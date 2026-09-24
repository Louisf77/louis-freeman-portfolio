import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import App from "~/App";

const BOOTSTRAP = { queries: {}, ui: { hello_heading: "Hello from the bootstrap" } };

describe("App", () => {
  beforeEach(() => {
    const script = document.createElement("script");
    script.id = "bootstrap";
    script.type = "application/json";
    script.textContent = JSON.stringify(BOOTSTRAP);
    document.body.append(script);
  });

  afterEach(() => {
    document.getElementById("bootstrap")?.remove();
  });

  it("renders the home page heading from the bootstrap UI strings", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Hello from the bootstrap" }),
    ).toBeInTheDocument();
  });
});
