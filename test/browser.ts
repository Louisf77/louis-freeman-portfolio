import { vi } from "vitest";

export function mockMatchMedia(matchingQueries: string[] = []): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: matchingQueries.includes(query),
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  );
}

export function installDialogPolyfill(): void {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

export function mockFetchJson(bodiesByPath: Record<string, unknown>) {
  return vi.spyOn(window, "fetch").mockImplementation((input) => {
    const url = input instanceof Request ? input.url : input;
    const path = new URL(url, window.location.origin).pathname;
    const body = bodiesByPath[path];
    if (body === undefined) return Promise.reject(new Error(`Unexpected fetch of ${path}`));

    return Promise.resolve(
      new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } }),
    );
  });
}

export function mockScrollTo() {
  const scrollTo = vi.fn();
  vi.stubGlobal("scrollTo", scrollTo);

  return scrollTo;
}

export function mockScrollIntoView() {
  const scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView;

  return scrollIntoView;
}
