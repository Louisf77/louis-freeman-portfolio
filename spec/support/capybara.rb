require "capybara/cuprite"

CUPRITE_WINDOW_SIZE = [1440, 900].freeze
CUPRITE_PROCESS_TIMEOUT_SECONDS = 20
CAPYBARA_WAIT_SECONDS = 5

Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(
    app,
    browser_options: ENV["CI"] ? { "no-sandbox" => nil } : {},
    headless: ENV.fetch("HEADLESS", "true") != "false",
    process_timeout: CUPRITE_PROCESS_TIMEOUT_SECONDS,
    window_size: CUPRITE_WINDOW_SIZE,
  )
end

Capybara.default_driver = :rack_test
Capybara.javascript_driver = :cuprite
Capybara.default_max_wait_time = CAPYBARA_WAIT_SECONDS
Capybara.save_path = "tmp/capybara"
Capybara.server = :puma, { Silent: true }

RSpec.configure do |config|
  config.before(:each, :js, type: :feature) do
    Capybara.current_driver = :cuprite
  end

  config.after(:each, type: :feature) do
    Capybara.use_default_driver
  end
end

Capybara.add_selector(:region) do
  xpath do |name|
    labelling_ids = XPath.anywhere[XPath.string.n.is(name.to_s)].attr(:id)
    XPath.descendant(:section)[XPath.attr(:"aria-labelledby") == labelling_ids]
  end
end
