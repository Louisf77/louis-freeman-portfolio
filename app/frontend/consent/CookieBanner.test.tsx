import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CONSENT_COOKIE_NAME, createConsentStore, type ConsentStore } from "~/consent/consent";
import ConsentProvider from "~/consent/ConsentProvider";
import CookieBanner, { type CookieBannerCopy } from "~/consent/CookieBanner";

const COPY: CookieBannerCopy = {
  acceptAll: "Accept all",
  alwaysOn: "Always on",
  analyticsDescription: "Helps me see which pages are read.",
  analyticsLabel: "Analytics",
  body: "This site uses cookies.",
  manageChoices: "Manage choices",
  necessaryDescription: "Keeps the site working.",
  necessaryLabel: "Necessary",
  rejectAll: "Reject all",
  saveChoices: "Save choices",
  title: "Cookie preferences",
};

function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; max-age=0; path=/`;
}

function renderBanner(store: ConsentStore) {
  render(
    <ConsentProvider store={store}>
      <CookieBanner copy={COPY} />
    </ConsentProvider>,
  );
}

describe("CookieBanner", () => {
  let store: ConsentStore;

  beforeEach(() => {
    clearConsentCookie();
    store = createConsentStore();
  });

  afterEach(clearConsentCookie);

  it("shows on a first visit", () => {
    renderBanner(store);

    expect(screen.getByRole("region", { name: COPY.title })).toBeInTheDocument();
  });

  it("gives accept and reject equal prominence as buttons", () => {
    renderBanner(store);

    expect(screen.getByRole("button", { name: COPY.acceptAll }).className).toBe(
      screen.getByRole("button", { name: COPY.rejectAll }).className,
    );
  });

  it("grants analytics when accepting all", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.acceptAll }));

    expect(store.has("analytics")).toBe(true);
  });

  it("denies analytics when rejecting all", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.rejectAll }));

    expect(store.has("analytics")).toBe(false);
  });

  it("hides after a choice", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.rejectAll }));

    expect(screen.queryByRole("region", { name: COPY.title })).not.toBeInTheDocument();
  });

  it("leaves analytics unticked when managing choices", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.manageChoices }));

    expect(screen.getByRole("checkbox", { name: COPY.analyticsLabel })).not.toBeChecked();
  });

  it("shows necessary cookies as always on", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.manageChoices }));

    expect(screen.getByRole("checkbox", { name: COPY.necessaryLabel })).toBeDisabled();
  });

  it("saves the managed choices", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.manageChoices }));
    await userEvent.click(screen.getByRole("checkbox", { name: COPY.analyticsLabel }));
    await userEvent.click(screen.getByRole("button", { name: COPY.saveChoices }));

    expect(store.has("analytics")).toBe(true);
  });

  it("rejects when dismissed with Escape before any choice", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.manageChoices }));
    await userEvent.keyboard("{Escape}");

    expect(store.getSnapshot().isDecided).toBe(true);
  });

  it("reopens when asked", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.rejectAll }));
    act(() => {
      store.open();
    });

    expect(screen.getByRole("region", { name: COPY.title })).toHaveFocus();
  });

  it("shows the stored choice when reopened", async () => {
    renderBanner(store);
    await userEvent.click(screen.getByRole("button", { name: COPY.acceptAll }));
    act(() => {
      store.open();
    });
    await userEvent.click(screen.getByRole("button", { name: COPY.manageChoices }));

    expect(screen.getByRole("checkbox", { name: COPY.analyticsLabel })).toBeChecked();
  });
});
