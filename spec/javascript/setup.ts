import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

import { installDialogPolyfill, mockMatchMedia, mockScrollTo } from "@test/browser";

installDialogPolyfill();

beforeEach(() => {
  mockMatchMedia();
  mockScrollTo();
  vi.spyOn(console, "error").mockImplementation((...messages: unknown[]) => {
    throw new Error(`console.error was called: ${messages.map(String).join(" ")}`);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
