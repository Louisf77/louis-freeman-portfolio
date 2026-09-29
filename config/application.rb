require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"

Bundler.require(*Rails.groups)

require_relative "../lib/middleware/public_file_caching"

module Portfolio
  class Application < Rails::Application
    config.load_defaults 8.1

    config.autoload_lib(ignore: %w[middleware tasks])

    config.public_file_server.headers = { "cache-control" => PublicFileCaching::SHORT_CACHE_CONTROL }
    config.middleware.insert_before ActionDispatch::Static, PublicFileCaching

    config.generators.system_tests = nil

    config.x.canonical_origin = ENV.fetch("CANONICAL_ORIGIN", "https://louisfreeman.co.uk")
    config.x.umami_website_id = ENV.fetch("UMAMI_WEBSITE_ID", nil)
  end
end
