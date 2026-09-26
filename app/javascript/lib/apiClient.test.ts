import { describe, expect, it, vi } from "vitest";

import { contractFixture } from "@test/contracts";
import { ApiError, fetchJson } from "~/lib/apiClient";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

describe("fetchJson", () => {
  it("returns the parsed body", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(jsonResponse({ profile: { name: "Louis" } }));

    await expect(fetchJson("/api/v1/profile")).resolves.toEqual({ profile: { name: "Louis" } });
  });

  it("raises the error envelope's message", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(jsonResponse(contractFixture("api/v1/error"), 404));

    await expect(fetchJson("/api/v1/home")).rejects.toThrow(
      new ApiError("Hero section has not been seeded", 404),
    );
  });

  it("keeps the status on the error", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(jsonResponse(contractFixture("api/v1/error"), 404));

    await expect(fetchJson("/api/v1/home")).rejects.toMatchObject({ status: 404 });
  });

  it("names the status when the body is not the error envelope", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue(new Response("oops", { status: 502 }));

    await expect(fetchJson("/api/v1/home")).rejects.toThrow("responded 502");
  });
});
