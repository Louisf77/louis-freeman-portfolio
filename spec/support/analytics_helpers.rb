module AnalyticsHelpers
  CASE_STUDY_VIEW_SETTLE_SECONDS = 2
  TEST_UMAMI_WEBSITE_ID = "00000000-0000-4000-8000-000000000000".freeze
  CAPTURED_CALLS = "__umamiTrackCalls".freeze
  EXTERNAL_LINK_HOSTS = ["github.com", "www.linkedin.com"].freeze
  UMAMI_SCRIPT_STUB = <<~JS.freeze
    window.#{CAPTURED_CALLS} = [];
    window.umami = {
      track(event, data) {
        window.#{CAPTURED_CALLS}.push({ data, event });
        return Promise.resolve();
      },
    };
  JS

  def with_umami_website_id(website_id)
    original_website_id = Rails.configuration.x.umami_website_id
    Rails.configuration.x.umami_website_id = website_id
    yield
  ensure
    Rails.configuration.x.umami_website_id = original_website_id
  end

  def stub_umami_script
    page.driver.browser.network.intercept
    page.driver.browser.on(:request) do |request|
      respond_to_analytics_request(request)
    end
  end

  def umami_track_calls
    page.evaluate_script("window.#{CAPTURED_CALLS}")
  end

  def umami_events(event)
    umami_track_calls.select { |call| call["event"] == event }.pluck("data")
  end

  def wait_past_case_study_dwell
    sleep CASE_STUDY_VIEW_SETTLE_SECONDS
  end

  def wait_for_case_study_view(slug:)
    page.document.synchronize(CASE_STUDY_VIEW_SETTLE_SECONDS * 2) do
      slugs = umami_events("case_study_view").pluck("case_study_slug")
      raise Capybara::ExpectationNotMet, "no case_study_view for #{slug} yet" unless slugs.include?(slug)
    end
  end

  private

  def respond_to_analytics_request(request)
    url = request.url
    if url == AnalyticsHelper::UMAMI_SCRIPT_URL
      request.respond(body: UMAMI_SCRIPT_STUB, responseHeaders: { "Content-Type" => "text/javascript" })
    elsif EXTERNAL_LINK_HOSTS.include?(URI(url).host)
      request.respond(body: "", responseHeaders: { "Content-Type" => "text/html" })
    else
      request.continue
    end
  end
end

RSpec.configure do |config|
  config.include AnalyticsHelpers, type: :feature
  config.include AnalyticsHelpers, type: :request
  config.include AnalyticsHelpers, type: :system

  config.around(:each, :umami) do |example|
    with_umami_website_id(AnalyticsHelpers::TEST_UMAMI_WEBSITE_ID) { example.run }
  end
end
