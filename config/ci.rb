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

  step "Tests: Migrations redo", "bin/rails db:migrate:redo" if Dir.glob("db/migrate/*.rb").any?
  step "Tests: RSpec", "bundle exec rspec"
  step "Tests: Vitest", "npx vitest run"

  step "Build: Vite", "RAILS_ENV=production SECRET_KEY_BASE_DUMMY=1 bin/rails assets:precompile"
end
