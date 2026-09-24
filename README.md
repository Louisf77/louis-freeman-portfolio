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

## Deploying

`main` deploys to Render from `render.yaml` once CI passes. See `docs/reports/BT-1-devops.md` for the one-off setup.
