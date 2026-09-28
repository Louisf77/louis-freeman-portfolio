import { vi } from "vitest";

export function mockUmami() {
  const umami = { track: vi.fn<(event: string, data: object) => Promise<void>>() };
  umami.track.mockResolvedValue(undefined);
  vi.stubGlobal("umami", umami);

  return umami;
}
