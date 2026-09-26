import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UiProvider, useUi } from "~/lib/ui";

interface ProbeProps {
  name: string;
}

function Probe({ name }: ProbeProps) {
  const t = useUi();

  return <p>{t(name, { name: "Louis Freeman", year: 2026 })}</p>;
}

function renderProbe(name: string) {
  return render(
    <UiProvider strings={{ copyright: "© %{year} %{name}", retry: "Retry" }}>
      <Probe name={name} />
    </UiProvider>,
  );
}

describe("useUi", () => {
  it("returns the string for a key", () => {
    renderProbe("retry");

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("interpolates named values", () => {
    renderProbe("copyright");

    expect(screen.getByText("© 2026 Louis Freeman")).toBeInTheDocument();
  });

  it("falls back to the key so a missing string is visible", () => {
    renderProbe("missing_key");

    expect(screen.getByText("missing_key")).toBeInTheDocument();
  });
});
