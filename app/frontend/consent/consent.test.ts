import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CONSENT_COOKIE_NAME, CONSENT_VERSION, createConsentStore } from "~/consent/consent";

function clearCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; max-age=0; path=/`;
  });
}

function storedCookie(): Record<string, unknown> | null {
  const entry = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!entry) return null;

  return JSON.parse(decodeURIComponent(entry.split("=")[1] ?? "")) as Record<string, unknown>;
}

describe("createConsentStore", () => {
  const gtag = vi.fn();

  beforeEach(() => {
    clearCookies();
    window.gtag = gtag;
  });

  afterEach(() => {
    clearCookies();
    gtag.mockReset();
  });

  it("is undecided on a first visit", () => {
    expect(createConsentStore().getSnapshot().isDecided).toBe(false);
  });

  it("opens the banner on a first visit", () => {
    expect(createConsentStore().getSnapshot().isBannerOpen).toBe(true);
  });

  it("does not grant analytics on a first visit", () => {
    expect(createConsentStore().has("analytics")).toBe(false);
  });

  it("grants analytics after accepting all", () => {
    const store = createConsentStore();
    store.acceptAll();

    expect(store.has("analytics")).toBe(true);
  });

  it("closes the banner after a choice", () => {
    const store = createConsentStore();
    store.rejectAll();

    expect(store.getSnapshot().isBannerOpen).toBe(false);
  });

  it("stores the choice with the current version", () => {
    createConsentStore().acceptAll();

    expect(storedCookie()).toMatchObject({ analytics: true, version: CONSENT_VERSION });
  });

  it("restores a stored choice", () => {
    createConsentStore().acceptAll();

    expect(createConsentStore().has("analytics")).toBe(true);
  });

  it("keeps the banner closed when a choice is stored", () => {
    createConsentStore().rejectAll();

    expect(createConsentStore().getSnapshot().isBannerOpen).toBe(false);
  });

  it("asks again when the stored choice is from an older version", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify({ analytics: true, version: CONSENT_VERSION - 1 }),
    )}; path=/`;

    expect(createConsentStore().getSnapshot().isBannerOpen).toBe(true);
  });

  it("ignores a malformed stored choice", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=not-json; path=/`;

    expect(createConsentStore().has("analytics")).toBe(false);
  });

  it("updates Consent Mode when analytics is granted", () => {
    createConsentStore().save({ analytics: true });

    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
  });

  it("updates Consent Mode when analytics is denied", () => {
    createConsentStore().save({ analytics: false });

    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "denied" });
  });

  it("notifies change listeners with the new choice", () => {
    const store = createConsentStore();
    const listener = vi.fn();
    store.onChange(listener);
    store.acceptAll();

    expect(listener).toHaveBeenCalledWith({ analytics: true });
  });

  it("stops notifying a listener once unsubscribed", () => {
    const store = createConsentStore();
    const listener = vi.fn();
    const unsubscribe = store.onChange(listener);
    unsubscribe();
    store.acceptAll();

    expect(listener).not.toHaveBeenCalled();
  });

  it("reopens the banner after a choice", () => {
    const store = createConsentStore();
    store.rejectAll();
    store.open();

    expect(store.getSnapshot().isBannerOpen).toBe(true);
  });

  it("treats dismissing an undecided banner as rejecting", () => {
    const store = createConsentStore();
    store.dismiss();

    expect(storedCookie()).toMatchObject({ analytics: false });
  });

  it("keeps the stored choice when a reopened banner is dismissed", () => {
    const store = createConsentStore();
    store.acceptAll();
    store.open();
    store.dismiss();

    expect(store.has("analytics")).toBe(true);
  });
});
