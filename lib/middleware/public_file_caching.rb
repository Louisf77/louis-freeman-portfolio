require "active_support/core_ext/integer/time"

class PublicFileCaching
  SHORT_CACHE_CONTROL = "public, max-age=#{1.hour.to_i}".freeze
  FINGERPRINTED_CACHE_CONTROL = "public, max-age=#{1.year.to_i}, immutable".freeze
  CACHEABLE_STATUSES = [200, 304].freeze

  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, body = app.call(env)
    headers["cache-control"] = FINGERPRINTED_CACHE_CONTROL if fingerprinted_asset?(status:, path: env["PATH_INFO"])
    [status, headers, body]
  end

  private

  attr_reader :app

  def fingerprinted_asset?(status:, path:)
    CACHEABLE_STATUSES.include?(status) && path.start_with?(fingerprinted_prefix)
  end

  def fingerprinted_prefix
    @fingerprinted_prefix ||= "/#{ViteRuby.config.public_output_dir}/"
  end
end
