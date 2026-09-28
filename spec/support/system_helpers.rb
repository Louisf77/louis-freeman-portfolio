module SystemHelpers
  API_PATH_PREFIX = "/api/".freeze
  INTERNAL_ERROR_BODY = {
    errors: [{ code: "internal_error", field: nil, message: "Something went wrong loading this page" }],
  }.freeze
  PAGE_LOAD_MARKER = "__samePageLoad".freeze
  MAX_TAB_STOPS = 40
  SCROLL_SETTLE_POLL_SECONDS = 0.4

  def seed_content
    Content::Seeder.from_file(path: Content::Seeder::SOURCE_PATH).call
  end

  def browser
    page.driver.browser
  end

  def api_requests
    browser.network.traffic.filter_map do |exchange|
      path = request_path(exchange)
      path if path.start_with?(API_PATH_PREFIX)
    end
  end

  def api_response_body(path:)
    exchange = browser.network.traffic.rfind { request_path(it) == path && it.response }
    JSON.parse(exchange.response.body)
  end

  def request_path(exchange)
    return "" unless exchange.request

    URI(exchange.request.url).path.to_s
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

  def navigate_from_address_bar(path:)
    browser.page.command("Page.navigate", url: "#{Capybara.current_session.server.base_url}#{path}")
  end

  def wait_for_viewport_top(id:)
    element = find_by_id(id)
    element.synchronize do
      top = element.evaluate_script("this.getBoundingClientRect().top")
      raise Capybara::ExpectationNotMet, "##{id} is at #{top}px, not the viewport top" unless top.abs <= 1
    end
  end

  def settles_uncovered?(element)
    wait_for_scroll_to_settle
    uncovered?(element)
  end

  def wait_for_scroll_to_settle
    last_y = nil
    page.document.synchronize do
      sleep SCROLL_SETTLE_POLL_SECONDS
      y = page.evaluate_script("window.scrollY")
      settled = y == last_y
      last_y = y
      raise Capybara::ExpectationNotMet, "the page is still scrolling" unless settled
    end
  end

  def uncovered?(element)
    element.evaluate_script(<<~JS)
      (() => {
        const box = this.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return hit !== null && this.contains(hit);
      })()
    JS
  end

  def covered_tab_stops_until(text:)
    MAX_TAB_STOPS.times.each_with_object([]) do |_, covered|
      browser.keyboard.type(:Tab)
      stop = page.active_element
      stop_text = stop.text
      covered << stop_text unless settles_uncovered?(stop)
      break covered if stop_text.include?(text)
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

RSpec::Matchers.define :be_at_the_viewport_top do
  match do |element|
    element.synchronize do
      top = element.evaluate_script("this.getBoundingClientRect().top")
      raise Capybara::ExpectationNotMet, "#{element.path} is at #{top}px, not the viewport top" unless top.abs <= 1

      true
    end
  rescue Capybara::ExpectationNotMet
    false
  end
end

RSpec::Matchers.define :be_uncovered do
  match { |element| settles_uncovered?(element) }
end

RSpec::Matchers.define :be_the_marked_page_load do
  match do |session|
    session.evaluate_script("window.#{SystemHelpers::PAGE_LOAD_MARKER} === true")
  end
end
