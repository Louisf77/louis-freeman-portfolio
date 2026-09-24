module ConsentHelper
  CONSENT_MODE_DEFAULTS = {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  }.freeze
  GRANTED_ANALYTICS_UPDATE = { analytics_storage: "granted" }.freeze

  def cookie_consent
    @cookie_consent ||= CookieConsent.from_cookie(value: cookies[CookieConsent::COOKIE_NAME])
  end

  def consent_mode_script_tag
    javascript_tag(consent_mode_script, nonce: true)
  end

  private

  def consent_mode_script
    lines = [
      "window.dataLayer = window.dataLayer || [];",
      "window.gtag = function gtag() { window.dataLayer.push(arguments); };",
      "gtag(\"consent\",\"default\",#{CONSENT_MODE_DEFAULTS.to_json});",
    ]
    lines << "gtag(\"consent\",\"update\",#{GRANTED_ANALYTICS_UPDATE.to_json});" if cookie_consent.analytics?
    lines.join("\n")
  end
end
