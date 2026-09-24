import type { CookieBannerCopy } from "~/consent/CookieBanner";

const COOKIE_BANNER_UI_KEYS: Record<keyof CookieBannerCopy, string> = {
  acceptAll: "cookie_accept_all",
  alwaysOn: "cookie_always_on",
  analyticsDescription: "cookie_analytics_description",
  analyticsLabel: "cookie_analytics_label",
  body: "cookie_banner_body",
  manageChoices: "cookie_manage_choices",
  necessaryDescription: "cookie_necessary_description",
  necessaryLabel: "cookie_necessary_label",
  rejectAll: "cookie_reject_all",
  saveChoices: "cookie_save_choices",
  title: "cookie_banner_title",
};

export function cookieBannerCopy(ui: Record<string, string>): CookieBannerCopy {
  const entries = Object.entries(COOKIE_BANNER_UI_KEYS).map(([copyKey, uiKey]) => [
    copyKey,
    ui[uiKey] ?? "",
  ]);

  return Object.fromEntries(entries) as CookieBannerCopy;
}
