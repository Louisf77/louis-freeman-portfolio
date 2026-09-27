require "capybara/cuprite"

CUPRITE_WINDOW_SIZE = [1440, 900].freeze
CUPRITE_COMPACT_WINDOW_SIZE = [390, 844].freeze
CUPRITE_PROCESS_TIMEOUT_SECONDS = 30
CUPRITE_CI_BROWSER_OPTIONS = { "disable-dev-shm-usage" => nil, "no-sandbox" => nil }.freeze
CAPYBARA_WAIT_SECONDS = 5

module CupriteOptions
  def self.to_h
    {
      browser_options: ENV["CI"] ? CUPRITE_CI_BROWSER_OPTIONS.dup : {},
      headless: ENV.fetch("HEADLESS", "true") != "false",
      process_timeout: CUPRITE_PROCESS_TIMEOUT_SECONDS,
    }
  end
end

Capybara.register_driver(:cuprite) do |app|
  Capybara::Cuprite::Driver.new(app, **CupriteOptions.to_h, window_size: CUPRITE_WINDOW_SIZE)
end

Capybara.default_driver = :rack_test
Capybara.javascript_driver = :cuprite
Capybara.default_max_wait_time = CAPYBARA_WAIT_SECONDS
Capybara.enable_aria_label = true
Capybara.save_path = "tmp/capybara"
Capybara.server = :puma, { Silent: true }

RSpec.configure do |config|
  config.before(:each, :js, type: :feature) do
    Capybara.current_driver = :cuprite
  end

  config.after(:each, type: :feature) do
    Capybara.use_default_driver
  end

  config.before(:each, type: :system) do
    driven_by :cuprite, screen_size: CUPRITE_WINDOW_SIZE, options: CupriteOptions.to_h
  end

  config.before(:each, :compact, type: :system) do
    driven_by :cuprite,
              screen_size: CUPRITE_COMPACT_WINDOW_SIZE,
              options: CupriteOptions.to_h.merge(name: :cuprite_compact)
  end
end
