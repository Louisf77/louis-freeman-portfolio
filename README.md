# Louis Freeman Portfolio

Rails 8 + PostgreSQL serving a React 19 + TypeScript single-page app built with Vite (`vite_rails`).

## Prerequisites

- Ruby 4.0.7 (`.ruby-version`) and Node 24 (`.node-version`), e.g. via `mise`
- PostgreSQL 18 running locally. Connection settings come from the standard libpq variables (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`) or `~/.pgpass`
- Google Chrome (feature specs run headless Chrome through Cuprite)

## Getting started

```sh
bin/setup
```

`bin/setup` installs gems and packages, prepares and seeds the database, generates the js-routes helpers and then starts `bin/dev` (Rails on :3000 + the Vite dev server). Pass `--skip-server` to skip the last step.

## Checks

```sh
bin/ci
```

Runs everything CI runs: RuboCop, erb_lint, ESLint, Prettier, `tsc`, Brakeman, bundler-audit, `npm audit`, RSpec, Vitest and the Vite build.

## Publishing work

The Work page is dormant until at least one case study exists. Until then the nav has no Work link, `/work` and `/api/v1/work` return 404, the sitemap leaves `/work` out and Home shows a coming-soon card in Selected work. To publish, add entries to `work.caseStudies` in `db/seeds/content.json` (each needs `id`, `slug`, `title`, `years`, `headline`, `description`, `role` and a `diagramKey` of `cards`, `identity`, `tax` or `ai`) and re-seed.

## Deploying

`main` deploys to Render from `render.yaml` once CI passes. See `docs/reports/BT-1-devops.md` for the one-off setup.
