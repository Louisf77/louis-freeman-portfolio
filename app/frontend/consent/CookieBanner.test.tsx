import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CONSENT_COOKIE_NAME, createConsentStore, type ConsentStore } from "~/consent/consent";
import ConsentProvider from "~/consent/ConsentProvider";
import CookieBanner, { type CookieBannerCopy } from "~/consent/CookieBanner";

const COPY: CookieBannerCopy = {
  acceptAnalytics: "Accept analytics cookies",
  acceptedMessage: "You've accepted analytics cookies. You can %{link} at any time.",
  alwaysOn: "Always on",
  analyticsDescription: "Helps me see which pages are read.",
  analyticsIntro: "I'd also like to use analytics cookies.",
  analyticsLabel: "Analytics",
  changeSettingsLink: "change your cookie settings",
  essentialIntro: "I use one essential cookie.",
  hide: "Hide",
  necessaryDescription: "Remembers your cookie choice.",
  necessaryLabel: "Essential",
  rejectAnalytics: "Reject analytics cookies",
  rejectedMessage: "You've rejected analytics cookies. You can %{link} at any time.",
  saveChoices: "Save cookie settings",
  settingsLegend: "Choose which cookies I can use",
  title: "Cookies on louisfreeman.co.uk",
  viewCookies: "View cookies",
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

function banner() {
  return screen.queryByRole("region", { name: COPY.title });
}

async function clickButton(name: string) {
  await userEvent.click(screen.getByRole("button", { name }));
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

    expect(banner()).toBeInTheDocument();
  });

  it("explains the essential cookie", () => {
    renderBanner(store);

    expect(screen.getByText(COPY.essentialIntro)).toBeInTheDocument();
  });

  it("asks about analytics cookies", () => {
    renderBanner(store);

    expect(screen.getByText(COPY.analyticsIntro)).toBeInTheDocument();
  });

  it("gives accept and reject equal visual weight", () => {
    renderBanner(store);

    expect(screen.getByRole("button", { name: COPY.acceptAnalytics }).className).toBe(
      screen.getByRole("button", { name: COPY.rejectAnalytics }).className,
    );
  });

  it("grants analytics when accepting", async () => {
    renderBanner(store);
    await clickButton(COPY.acceptAnalytics);

    expect(store.has("analytics")).toBe(true);
  });

  it("denies analytics when rejecting", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);

    expect(store.has("analytics")).toBe(false);
  });

  it("confirms an accepted choice", async () => {
    renderBanner(store);
    await clickButton(COPY.acceptAnalytics);

    expect(screen.getByRole("status")).toHaveTextContent(
      "You've accepted analytics cookies. You can change your cookie settings at any time.",
    );
  });

  it("confirms a rejected choice", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);

    expect(screen.getByRole("status")).toHaveTextContent(
      "You've rejected analytics cookies. You can change your cookie settings at any time.",
    );
  });

  it("moves focus to the confirmation", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);

    expect(screen.getByRole("status")).toHaveFocus();
  });

  it("hides the confirmation", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);
    await clickButton(COPY.hide);

    expect(banner()).not.toBeInTheDocument();
  });

  it("hides the confirmation with Escape", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);
    await userEvent.keyboard("{Escape}");

    expect(banner()).not.toBeInTheDocument();
  });

  it("opens the settings from the confirmation", async () => {
    renderBanner(store);
    await clickButton(COPY.acceptAnalytics);
    await clickButton(COPY.changeSettingsLink);

    expect(screen.getByRole("checkbox", { name: COPY.analyticsLabel })).toBeChecked();
  });

  it("leaves analytics unticked when viewing cookies", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);

    expect(screen.getByRole("checkbox", { name: COPY.analyticsLabel })).not.toBeChecked();
  });

  it("names the settings group", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);

    expect(screen.getByRole("group", { name: COPY.settingsLegend })).toBeInTheDocument();
  });

  it("describes the essential cookie as always on", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);

    expect(screen.getByRole("checkbox", { name: COPY.necessaryLabel })).toHaveAccessibleDescription(
      `${COPY.alwaysOn} ${COPY.necessaryDescription}`,
    );
  });

  it("shows the essential cookie as always on", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);

    expect(screen.getByRole("checkbox", { name: COPY.necessaryLabel })).toBeDisabled();
  });

  it("saves the chosen settings", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);
    await userEvent.click(screen.getByRole("checkbox", { name: COPY.analyticsLabel }));
    await clickButton(COPY.saveChoices);

    expect(store.has("analytics")).toBe(true);
  });

  it("confirms saved settings", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);
    await clickButton(COPY.saveChoices);

    expect(screen.getByRole("status")).toHaveTextContent("You've rejected analytics cookies.");
  });

  it("rejects when dismissed with Escape before any choice", async () => {
    renderBanner(store);
    await clickButton(COPY.viewCookies);
    await userEvent.keyboard("{Escape}");

    expect(store.getSnapshot().isDecided).toBe(true);
  });

  it("reopens the question when asked", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);
    await clickButton(COPY.hide);
    act(() => {
      store.open();
    });

    expect(banner()).toHaveFocus();
  });

  it("offers the choice again when reopened", async () => {
    renderBanner(store);
    await clickButton(COPY.rejectAnalytics);
    await clickButton(COPY.hide);
    act(() => {
      store.open();
    });

    expect(screen.getByRole("button", { name: COPY.acceptAnalytics })).toBeInTheDocument();
  });
});
