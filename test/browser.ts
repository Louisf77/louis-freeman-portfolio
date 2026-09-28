import { onTestFinished, vi } from "vitest";

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

export function preventLinkNavigation() {
  const preventNavigation = (event: MouseEvent) => {
    event.preventDefault();
  };
  document.addEventListener("click", preventNavigation);
  onTestFinished(() => {
    document.removeEventListener("click", preventNavigation);
  });
}

interface IntersectionObserverMock {
  intersect: (target: Element, intersectionRatio: number) => void;
}

export function mockIntersectionObserver(): IntersectionObserverMock {
  const observers = new Set<{
    callback: IntersectionObserverCallback;
    instance: IntersectionObserver;
    targets: Set<Element>;
  }>();

  class MockIntersectionObserver implements IntersectionObserver {
    private readonly entry;
    readonly root = null;
    readonly rootMargin = "0px";
    readonly scrollMargin = "0px";
    readonly thresholds: readonly number[];

    constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
      const threshold = options.threshold ?? 0;
      this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
      this.entry = { callback, instance: this, targets: new Set<Element>() };
      observers.add(this.entry);
    }

    disconnect() {
      this.entry.targets.clear();
      observers.delete(this.entry);
    }

    observe(target: Element) {
      this.entry.targets.add(target);
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve(target: Element) {
      this.entry.targets.delete(target);
    }
  }

  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

  return {
    intersect(target, intersectionRatio) {
      observers.forEach(({ callback, instance, targets }) => {
        if (!targets.has(target)) return;

        const entry = {
          intersectionRatio,
          isIntersecting: intersectionRatio > 0,
          target,
        } as IntersectionObserverEntry;
        callback([entry], instance);
      });
    },
  };
}
