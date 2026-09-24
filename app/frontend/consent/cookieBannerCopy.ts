import type { CookieBannerCopy } from "~/consent/CookieBanner";

const COOKIE_BANNER_UI_KEYS: Record<keyof CookieBannerCopy, string> = {
  acceptAnalytics: "cookie_accept_analytics",
  acceptedMessage: "cookie_accepted_message",
  alwaysOn: "cookie_always_on",
  analyticsDescription: "cookie_analytics_description",
  analyticsIntro: "cookie_banner_analytics",
  analyticsLabel: "cookie_analytics_label",
  changeSettingsLink: "cookie_change_settings_link",
  essentialIntro: "cookie_banner_essential",
  hide: "cookie_hide",
  necessaryDescription: "cookie_necessary_description",
  necessaryLabel: "cookie_necessary_label",
  rejectAnalytics: "cookie_reject_analytics",
  rejectedMessage: "cookie_rejected_message",
  saveChoices: "cookie_save_choices",
  settingsLegend: "cookie_settings_legend",
  title: "cookie_banner_title",
  viewCookies: "cookie_view_cookies",
};

export function cookieBannerCopy(ui: Record<string, string>): CookieBannerCopy {
  const entries = Object.entries(COOKIE_BANNER_UI_KEYS).map(([copyKey, uiKey]) => [
    copyKey,
    ui[uiKey] ?? "",
  ]);

  return Object.fromEntries(entries) as CookieBannerCopy;
}
