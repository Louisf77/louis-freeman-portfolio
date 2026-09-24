class CookieConsent
  COOKIE_NAME = "cookie_consent".freeze
  VERSION = 1

  def self.from_cookie(value:, logger: Rails.logger)
    stored_choice = value.present? ? JSON.parse(value) : {}
    stored_choice = {} unless stored_choice.is_a?(Hash)
    new(analytics: stored_choice["analytics"] == true, version: stored_choice["version"])
  rescue JSON::ParserError => e
    logger.warn("CookieConsent: ignoring malformed cookie (#{e.class}: #{e.message})")
    new(analytics: false, version: nil)
  end

  def initialize(analytics:, version:)
    @analytics = analytics
    @version = version
  end

  def analytics?
    decided? && analytics
  end

  def decided?
    version == VERSION
  end

  private

  attr_reader :analytics, :version
end
