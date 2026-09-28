module AnalyticsHelper
  UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js".freeze
  UMAMI_TRACKED_DOMAINS = "louisfreeman.co.uk".freeze
  UMAMI_AUTO_TRACK = "true".freeze

  def analytics_script_tag
    website_id = Rails.configuration.x.umami_website_id
    return if website_id.blank?

    tag.script(
      defer: true,
      src: UMAMI_SCRIPT_URL,
      data: { auto_track: UMAMI_AUTO_TRACK, domains: UMAMI_TRACKED_DOMAINS, website_id: },
    )
  end
end
