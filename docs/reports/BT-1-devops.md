# BT-1 — DevOps: bootstrap (report)

**Status:** `NEEDS USER ACTION` — everything local is done and verified. Creating the public GitHub repo was blocked by the permission classifier, so the push, the CI run and the Render Blueprint are still to do (steps below).

## What exists now

- Local repo `~/Documents/Dev/louis-freeman-portfolio`, branch `main`. Nothing pushed yet. `docs/` is untouched; the 4.1 MB handover zip is under the ~5 MB limit, so it stays tracked.
- Commits on `main`:
  1. `8eabd24` Add plan and designs
  2. `56f7847` Scaffold Rails 8 app with Vite, React 19 and TypeScript
  3. `ec1c899` Add lint tooling configured to the coding preferences
  4. `5d19464` Add RSpec and Vitest test harness with smoke specs
  5. `f0190db` Add cookie consent layer with Consent Mode v2 defaults
  6. `62c9723` Add CI workflow and bin/ci mirroring it
  7. `73e69a2` Add Render blueprint for free web service and Postgres in Frankfurt
  8. `37bd1ba` Serve bin/dev web process on PORT
  9. (this report)
- Key files:
  - App: `app/controllers/pages_controller.rb` (`home`), `app/views/layouts/application.html.erb` (Consent Mode script first in `<head>`, Vite tags, `<div id="root">`, `<script id="bootstrap" type="application/json">` containing `{ queries: {}, ui: I18n.t("ui") }`, as the contract describes), `app/helpers/application_helper.rb`
  - FE: `app/frontend/entrypoints/application.tsx`, `App.tsx` (React Query + React Router + consent), `bootstrap.ts`, `pages/Home.tsx` (placeholder hello), `assets/` (logo-mark.png, hero.mp4, hero-poster.jpg, louis-waving.png); `public/images/hobbies/*`
  - Consent: `app/models/cookie_consent.rb`, `app/helpers/consent_helper.rb`, `app/frontend/consent/{consent.ts,ConsentProvider.tsx,CookieBanner.tsx,CookieBanner.module.css,CookieSettingsButton.tsx,cookieBannerCopy.ts}`, copy in `config/locales/en.yml` under `en.ui.cookie_*`
  - Tooling: `.rubocop.yml`, `.erb_lint.yml`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.editorconfig`, `tsconfig.json`, `vitest.config.ts`, `bin/lint-yaml-keys`
  - Tests: `.rspec`, `spec/spec_helper.rb`, `spec/rails_helper.rb`, `spec/support/{capybara,factory_bot,request_helpers,contract_matcher}.rb`, `spec/contracts/.keep`, `spec/factories/.keep`, `test/setup.ts`, `test/utils.tsx` (`renderWithProviders`)
  - DX: `bin/setup`, `bin/dev` + `Procfile.dev` (web on :3000 + Vite on :3036), `bin/ci` + `config/ci.rb`, `.env.example`, `README.md`
  - CI: `.github/workflows/ci.yml` (jobs `build`, `lint`, `security`, `test`)
  - Deploy: `render.yaml`, `bin/render-build.sh`

## Dependencies added

| Dependency | Stack line |
|---|---|
| rails 8.1.3.1, pg, puma, propshaft, bootsnap, thruster | Back end / DB (Rails 8 + PostgreSQL) |
| vite_rails 3.11, vite 8, vite-plugin-ruby | FE framework (Vite via vite_rails) |
| react / react-dom 19.3, react-router 7.18 | FE framework, Routing |
| @tanstack/react-query 5 | Data fetching |
| js-routes 2.4 | Data fetching (js-routes path helpers) |
| rspec-rails, factory_bot_rails, capybara, cuprite, json_schemer | Tests / New dependencies |
| rubocop (+rails, rspec, capybara, factory_bot), erb_lint | New dependencies |
| brakeman, bundler-audit, strong_migrations, bullet | New dependencies |
| vitest 5, @testing-library/{react,jest-dom,user-event}, jsdom | Tests |
| eslint 9, typescript-eslint, eslint-plugin-react, eslint-plugin-jsx-a11y, prettier | New dependencies |

**Implied support packages** (not named in the list, but needed for the listed ones to work): `typescript ~6.0`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react` (React transform and Fast Refresh for Vite), `@eslint/js` (ESLint's base config), `@testing-library/dom` (peer dependency of Testing Library React). `bin/dev` installs `foreman` into your Ruby the first time it runs (the standard Rails `bin/dev` pattern). This is not a Gemfile dependency.

**Version pins:** TypeScript stays on 6.0 because typescript-eslint supports `<6.1`. ESLint stays on 9 because eslint-plugin-react and eslint-plugin-jsx-a11y don't support ESLint 10 yet.

**Not added:** mutant, Tailwind, any UI kit.

## Scaffold decisions and assumptions

- Command used: `rails new . --database=postgresql --skip-test --skip-system-test --skip-javascript --skip-kamal --skip-docker --skip-ci --skip-rubocop --skip-jbuilder --skip-action-mailbox --skip-action-text --skip-active-storage --skip-action-cable`, then `vite install`.
- **Solid Cache and Solid Queue removed.** The Architecture has no jobs or caching, and a free Render Postgres is a single database. Rails falls back to the file cache store and the async job adapter. They can be added back when a task needs them.
- Deleted the empty PWA views, the commented-out CSP initializer, the inflections initializer and the default favicons. BT-13 owns meta and icons.
- Generator boilerplate comments were stripped from `config/**/*.rb`, `Gemfile` and friends (the no-comments preference). `bin/*` was left as generated.
- `.ruby-version` is `4.0.7`, and the Gemfile has `ruby file: ".ruby-version"` so Render reads it from the lockfile. `.node-version` is `24.21.0`. Postgres 18 is used everywhere: local, CI image `postgres:18`, Render `postgresMajorVersion: "18"`, and `StrongMigrations.target_version = 18`.
- js-routes writes `app/frontend/routes.js` + `routes.d.ts` (`config.javascript_path = "frontend"`). These files are **gitignored**, as the js-routes README recommends. They are regenerated by the dev middleware, `bin/setup`, CI, and before `assets:precompile` / `vite:build` (`lib/tasks/js_routes.rake`).
- Production: `config.hosts` = louisfreeman.co.uk, www.louisfreeman.co.uk and `RENDER_EXTERNAL_HOSTNAME`, with `/up` excluded. `force_ssl` and `assume_ssl` are on. `/images/*` and `/vite/*` are served with `cache-control: public, max-age=31556952` (verified with a local production boot).
- Aliases: `~/*` → `app/frontend/*`, `@test/*` → `test/*`.

## Linters encoding the preferences

- **RuboCop:** double quotes (including in interpolation); `consistent_comma` trailing commas on arrays, hashes and arguments; `Style/NumericLiterals` (MinDigits 5); `Naming/PredicatePrefix` forbids `is_`/`has_`/`check_`; `Naming/AccessorMethodName`; `Rails/Output` (rake tasks and seeds excluded); `Rails/DefaultScope`; `RSpec/MultipleExpectations` Max 1; `RSpec/LetSetup`, `VerifiedDoubles`, `AnyInstance`, `NamedSubject`, `PredicateMatcher` (strict), `Focus`; `RSpec/ContextWording` prefixes when/with/without; `Style/Documentation` off.
- **ESLint:** `no-explicit-any`, `eqeqeq`, `no-var`, `no-void`, `no-floating-promises`, `no-console`, `react/button-has-type`, `react/jsx-sort-props`, `member-ordering` (alphabetical), `naming-convention` (booleans must start with `is`), jsx-a11y recommended, typescript-eslint `strictTypeChecked`. Each rule was checked by linting a deliberately bad file.
- **TypeScript:** `strict`, `noUncheckedIndexedAccess`.
- **Alphabetical YAML keys:** no stock linter covers this, so `bin/lint-yaml-keys` (Ruby stdlib, no new dependency) walks every tracked YAML file outside `docs/`, compares keys case-insensitively and ignores `<<`. It runs in CI and in `bin/ci`, and was shown to fail on a deliberately unsorted file.
- **Left to QA's standards review** (no linter enforces these): up/down migrations only (CI runs `db:migrate:redo` once migrations exist), keyword arguments, one guard clause per condition, logging rules, the module-level `Record` mapping rule, "no hardcoded user-facing strings", and "no code comments" in general.

## Cookie consent layer (for BT-5 / BT-18)

- Categories: `necessary` (always on) and `analytics`. Cookie `cookie_consent` = `{"analytics":bool,"updated_at":iso,"version":1}`, URL-encoded JSON, `SameSite=Lax`, `Secure` on https, `max-age` 6 months. Raise `CONSENT_VERSION` (TS) and `CookieConsent::VERSION` (Ruby) together to ask everyone again.
- The `<head>` gets `consent_mode_script_tag` as its first script. It defines `dataLayer`/`gtag`, sets `gtag("consent","default",…)` with everything denied except `security_storage`, and `wait_for_update: 500`. If the stored choice grants analytics, the server emits `gtag("consent","update",{analytics_storage:"granted"})` straight away.
- JS API (`~/consent/consent`): `consent.has("analytics")`, `consent.onChange(cb)` (returns an unsubscribe function), `consent.open()`, plus `acceptAll` / `rejectAll` / `save` / `dismiss`. Every change updates Consent Mode.
- React: `ConsentProvider` (context + `useMemo`) and `useConsent()`. **Footer reopen hook:** `useConsent().open`, or `<CookieSettingsButton label={ui.cookie_settings} className=… />`. `App.tsx` currently renders a placeholder `<footer>` with that button. BT-5's Footer should replace it.
- Rails: the `cookie_consent` helper (`cookie_consent.analytics?`) lets BT-18 skip rendering the gtag.js tag server-side until analytics is granted.
- Banner: a non-modal `section` labelled by its heading. Accept all and Reject all share the same style. Manage choices shows Necessary (disabled, always on) and Analytics (unticked unless already granted), then Save choices. Escape counts as reject before any choice and just closes the banner after one. Reopening moves focus to the banner. All copy comes from `en.ui.cookie_*`. Styling is minimal and uses no tokens yet, so BT-5 should restyle it.
- **Louis to review:** the banner copy in `config/locales/en.yml` is the short cookie notice the plan asks for. It isn't legal text. The plan has no `/privacy` or `/cookies` pages, so none were added. Tell me if you want them.

## Verification

| Step | Command | Result |
|---|---|---|
| Fresh clone | `git clone` into scratch → `bin/setup --skip-server` | Gems and packages installed, dev and test DBs created, seeds run, routes generated |
| `bin/dev` boots | `bin/dev` in the clone | Rails on :3000 and Vite on :3036. `/up` returns 200. Headless Chrome shows the `<h1>` "Hello from Louis Freeman", the "Cookie preferences" banner and the "Cookie settings" button |
| RSpec (run twice, random order) | `bundle exec rspec` | 33 examples, 0 failures, both runs. Covers the `/up` spec, pages request spec, `FactoryBot.lint`, JS smoke feature, 13-example consent feature spec, CookieConsent model and ConsentHelper specs |
| Vitest | `npx vitest run` | 4 files, 30 tests passed (store, banner, App smoke, Home) |
| Lint / types | `bundle exec rubocop && bundle exec erb_lint --lint-all && npx eslint . && npx tsc --noEmit && npx prettier --check . && bin/lint-yaml-keys` | All pass |
| Security | brakeman, bundler-audit, `npm audit --omit=dev --audit-level=high` | 0 warnings, 0 vulnerabilities |
| Full CI locally | `bin/ci` | All steps passed (17 s) |
| Production boot | `RAILS_ENV=production` precompile, `db:prepare`, `db:seed`, `bin/thrust bin/rails server` | `/up` returns 200, `/` returns 200 with fingerprinted `/vite/assets/*`, an unknown Host returns 403, 1-year cache headers |
| Blueprint | `render blueprints validate render.yaml` | `valid: true` (1 database, 1 web service) |
| CI on GitHub / draft PR / broken-lint check | — | **Not done**, because the repo couldn't be created (see below) |
| Deploy | — | Out of scope (BT-21) and needs your approval |

Local verification ran against a throwaway Postgres 18 cluster (trust auth on port 5433, in the session scratchpad). It has since been stopped. Your installed Postgres wasn't changed.

## NEEDS USER ACTION

1. **Create the public GitHub repo and push** (free). The auto-mode classifier blocked `gh repo create` because it creates a public surface. Run this yourself:
   ```sh
   cd ~/Documents/Dev/louis-freeman-portfolio
   gh repo create Louisf77/louis-freeman-portfolio --public --source . --remote origin --push
   ```
   Or allow that command and I'll run it. After the push: check `gh run list` shows CI green on `main`, then optionally protect `main` by requiring the `build`, `lint`, `security` and `test` checks.
2. **Local Postgres credentials.** Your EDB Postgres 18 (`/Library/PostgreSQL/18`) requires a password. `bin/setup` uses the standard libpq variables, so set up one of:
   - `~/.pgpass` containing `localhost:5432:*:postgres:<password>` (chmod 600), with `export PGUSER=postgres PGHOST=localhost`
   - or `PGUSER` / `PGPASSWORD` in your shell
3. **Ruby on PATH.** In this environment `/usr/bin/ruby` (2.6) came before mise's Ruby 4.0.7. Make sure `mise activate zsh` is in `~/.zshrc`, so `bin/*` scripts pick up Ruby 4.0.7.
4. **Render Blueprint** (after the repo exists; a later deploy task, BT-21): Dashboard → New → Blueprint → select the repo. This creates `portfolio-web` (free, frankfurt, Ruby) and `portfolio-db` (free Postgres 18, frankfurt). No secrets to paste: `SECRET_KEY_BASE` is `generateValue: true`, `DATABASE_URL` comes from the database. `RAILS_MASTER_KEY` isn't needed because no credentials are used. `config/master.key` stays local and gitignored; keep a copy somewhere safe.
5. **Review the cookie banner copy** in `config/locales/en.yml` (`en.ui.cookie_*`).

## Costs (Render, from the plan's Hosting row)

| Resource | Plan | Monthly |
|---|---|---|
| portfolio-web | Free | $0 (spins down when idle; 750 free instance hours per workspace) |
| portfolio-db | Free | $0 (**expires 30 days after creation**) |
| Planned upgrade before the DB expires | Starter web + Basic-256mb Postgres | about $7 + about $6 = **about $13/mo** |

Free-plan trade-off: `preDeployCommand` isn't available, so `bin/render-build.sh` runs `db:prepare` + `db:seed` during the build. Migrations therefore run before the health-checked switch-over, which protects less than a pre-deploy step would. Deploys wait for GitHub checks (`autoDeployTrigger: checksPass`).

## DNS

None yet. The louisfreeman.co.uk apex + www, and the Cloudflare DNS-only setup, belong to the production deploy task (BT-21). `config.hosts` already allows both names.
