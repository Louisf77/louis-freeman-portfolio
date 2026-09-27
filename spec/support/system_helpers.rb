module SystemHelpers
  API_PATH_PREFIX = "/api/".freeze
  INTERNAL_ERROR_BODY = {
    errors: [{ code: "internal_error", field: nil, message: "Something went wrong loading this page" }],
  }.freeze
  PAGE_LOAD_MARKER = "__samePageLoad".freeze

  def seed_content
    Content::Seeder.from_file(path: Content::Seeder::SOURCE_PATH).call
  end

  def browser
    page.driver.browser
  end

  def api_requests
    browser.network.traffic.filter_map do |exchange|
      path = URI(exchange.request.url).path
      path if path.start_with?(API_PATH_PREFIX)
    end
  end

  def api_response_body(path:)
    exchange = browser.network.traffic.rfind { URI(it.request.url).path == path && it.response }
    JSON.parse(exchange.response.body)
  end

  def forget_api_requests
    browser.network.clear(:traffic)
  end

  def fail_api_requests(path:, failing:)
    browser.network.intercept
    browser.on(:request) do |request|
      next request.continue unless failing.call && URI(request.url).path == path

      request.respond(
        body: JSON.generate(INTERNAL_ERROR_BODY),
        responseCode: 500,
        responseHeaders: { "Content-Type" => "application/json" },
      )
    end
  end

  def mark_page_load
    page.execute_script("window.#{PAGE_LOAD_MARKER} = true")
  end
end

RSpec.configure do |config|
  config.include SystemHelpers, type: :system
end

RSpec::Matchers.define :be_in_viewport do
  match do |element|
    element.synchronize do
      raise Capybara::ExpectationNotMet, "#{element.path} is outside the viewport" unless element.evaluate_script(<<~JS)
        (() => {
          const box = this.getBoundingClientRect();
          return box.top < window.innerHeight && box.bottom > 0;
        })()
      JS

      true
    end
  rescue Capybara::ExpectationNotMet
    false
  end
end

RSpec::Matchers.define :be_the_marked_page_load do
  match do |session|
    session.evaluate_script("window.#{SystemHelpers::PAGE_LOAD_MARKER} === true")
  end
end
