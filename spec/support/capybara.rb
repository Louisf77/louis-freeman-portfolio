require "capybara/cuprite"

CUPRITE_WINDOW_SIZE = [1440, 900].freeze
CUPRITE_COMPACT_WINDOW_SIZE = [390, 844].freeze
CUPRITE_PROCESS_TIMEOUT_SECONDS = 30
CUPRITE_COMMAND_TIMEOUT_SECONDS = 15
CUPRITE_CI_BROWSER_OPTIONS = { "disable-dev-shm-usage" => nil, "no-sandbox" => nil }.freeze
CAPYBARA_WAIT_SECONDS = 5
SMOOTH_SCROLLING_DISABLING_FLAG = "disable-smooth-scrolling".freeze
APP_SERVER_HOSTS = ["127.0.0.1", "localhost"].freeze
OFFLINE_BROWSER_OPTIONS = {
  "host-resolver-rules" => ["MAP * ~NOTFOUND", *APP_SERVER_HOSTS.map { |host| "EXCLUDE #{host}" }].join(", "),
}.freeze

module CupriteOptions
  def self.to_h
    {
      browser_options: OFFLINE_BROWSER_OPTIONS.merge(ENV["CI"] ? CUPRITE_CI_BROWSER_OPTIONS : {}),
      headless: ENV.fetch("HEADLESS", "true") != "false",
      process_timeout: CUPRITE_PROCESS_TIMEOUT_SECONDS,
      timeout: CUPRITE_COMMAND_TIMEOUT_SECONDS,
    }
  end

  def self.with_smooth_scrolling
    default_flags = Ferrum::Browser::Options::Chrome::DEFAULT_OPTIONS.except(SMOOTH_SCROLLING_DISABLING_FLAG)
    options = to_h
    options.merge(
      browser_options: default_flags.merge(options.fetch(:browser_options)),
      ignore_default_browser_options: true,
    )
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

  config.before(:each, :smooth_scrolling, type: :system) do |example|
    is_compact = example.metadata[:compact]
    driven_by :cuprite,
              screen_size: is_compact ? CUPRITE_COMPACT_WINDOW_SIZE : CUPRITE_WINDOW_SIZE,
              options: CupriteOptions.with_smooth_scrolling.merge(
                name: is_compact ? :cuprite_smooth_compact : :cuprite_smooth,
              )
  end
end
