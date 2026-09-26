REDO_EACH_MIGRATION = "for step in $(seq 1 $(ls db/migrate/*.rb | wc -l)); do " \
                      "RAILS_ENV=test bin/rails db:migrate:redo STEP=$step || exit 1; done".freeze

CI.run do
  step "Setup", "bin/setup --skip-server"

  step "Style: Ruby", "bundle exec rubocop --parallel"
  step "Style: ERB", "bundle exec erb_lint --lint-all"
  step "Style: YAML keys", "bin/lint-yaml-keys"
  step "Style: Spec requires", "bin/lint-spec-requires"
  step "Style: ESLint", "npx eslint ."
  step "Style: Prettier", "npx prettier --check ."
  step "Types: TypeScript", "npx tsc --noEmit"

  step "Security: Gem audit", "bin/bundler-audit check --update"
  step "Security: npm audit", "npm audit --omit=dev --audit-level=high"
  step "Security: Brakeman code analysis", "bin/brakeman --quiet --no-pager --exit-on-warn --exit-on-error"

  step "Tests: Load schema into a fresh database", "RAILS_ENV=test bin/rails db:drop db:prepare"
  if Dir.glob("db/migrate/*.rb").any?
    step "Tests: Roll back every migration", "RAILS_ENV=test bin/rails db:migrate VERSION=0"
    step "Tests: Migrate from empty", "RAILS_ENV=test bin/rails db:migrate"
    step "Tests: Redo each migration, newest to oldest", REDO_EACH_MIGRATION
    step "Tests: Schema matches migrations", "git diff --exit-code db/schema.rb"
  end
  step "Tests: RSpec", "bundle exec rspec"
  step "Tests: Vitest", "npx vitest run"

  step "Build: Vite", "RAILS_ENV=production SECRET_KEY_BASE_DUMMY=1 bin/rails assets:precompile"
end
