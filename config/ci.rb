CI.run do
  step "Setup", "bin/setup --skip-server"

  step "Style: Ruby", "bundle exec rubocop --parallel"
  step "Style: ERB", "bundle exec erb_lint --lint-all"
  step "Style: YAML keys", "bin/lint-yaml-keys"
  step "Style: ESLint", "npx eslint ."
  step "Style: Prettier", "npx prettier --check ."
  step "Types: TypeScript", "npx tsc --noEmit"

  step "Security: Gem audit", "bin/bundler-audit check --update"
  step "Security: npm audit", "npm audit --omit=dev --audit-level=high"
  step "Security: Brakeman code analysis", "bin/brakeman --quiet --no-pager --exit-on-warn --exit-on-error"

  step "Tests: Migrate from empty", "RAILS_ENV=test bin/rails db:drop db:create db:migrate"
  step "Tests: Schema matches migrations", "git diff --exit-code db/schema.rb"
  if Dir.glob("db/migrate/*.rb").any?
    step "Tests: Roll back every migration", "RAILS_ENV=test bin/rails db:migrate VERSION=0"
    step "Tests: Re-apply every migration", "RAILS_ENV=test bin/rails db:migrate"
    step "Tests: Schema matches after round-trip", "git diff --exit-code db/schema.rb"
  end
  step "Tests: RSpec", "bundle exec rspec"
  step "Tests: Vitest", "npx vitest run"

  step "Build: Vite", "RAILS_ENV=production SECRET_KEY_BASE_DUMMY=1 bin/rails assets:precompile"
end
