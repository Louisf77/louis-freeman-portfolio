source "https://rubygems.org"

ruby file: ".ruby-version"

gem "bootsnap", require: false
gem "json", "~> 2.18"
gem "js-routes", "~> 2.4"
gem "pg", "~> 1.1"
gem "propshaft"
gem "puma", ">= 5.0"
gem "rails", "~> 8.1.3", ">= 8.1.3.1"
gem "strong_migrations", "~> 2.8"
gem "thruster", require: false
gem "tzinfo-data", platforms: %i[windows jruby]
gem "vite_rails", "~> 3.11"

group :development, :test do
  gem "brakeman", require: false
  gem "bullet", "~> 8.2"
  gem "bundler-audit", require: false
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "erb_lint", "~> 0.9", require: false
  gem "factory_bot_rails", "~> 6.5"
  gem "rspec-rails", "~> 8.0"
  gem "rubocop", "~> 1.91", require: false
  gem "rubocop-capybara", "~> 3.0", require: false
  gem "rubocop-factory_bot", "~> 2.28", require: false
  gem "rubocop-rails", "~> 2.38", require: false
  gem "rubocop-rspec", "~> 3.10", require: false
end

group :development do
  gem "web-console"
end

group :test do
  gem "capybara", "~> 3.40"
  gem "cuprite", "~> 0.18"
  gem "json_schemer", "~> 2.5"
end
