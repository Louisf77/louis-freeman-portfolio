# Louis Freeman Portfolio — site build

Notion: https://app.notion.com/p/3e5f4750980b81e6882ff1c95860aba7 · Size: App · Planned: 2026-09-24
Approval: APPROVED by user 2026-09-24 — "Approve" (adds BT-25 CI hardening). Earlier approvals: "Approved, carry on" (re-plan), "Approved, hand it off" (initial) (re-plan: Umami instead of GA4 + consent; FE source → app/javascript feature-based; json gem pin; merge policy). First approval: 2026-09-24 — "Approved, hand it off"

## Summary
Build Louis Freeman's personal portfolio (Home, Work, About) from the approved Claude Design handoff, as a Rails 8 API + React 19 SPA. Audience: hiring managers, recruiters and engineers. It must be pixel-close to the mockups at 1440px and 390px, with the full scroll/motion system and a static fallback for reduced motion. It's hosted on Render (free tier first) at louisfreeman.co.uk.

## Scope
- **In:** `/`, `/work`, `/about` (responsive, one site); read-only content API seeded from `content.json`; server-set meta/OG/JSON-LD per page; UI chrome via Rails I18n; cookieless analytics (Umami Cloud, no consent banner) + a short privacy note; sitemap/robots; OG share image; styled static 404/500; CI; Render deploy + custom domain.
- **Out:** `/admin` CMS · contact form (mailto + LinkedIn + GitHub only) · case-study detail pages ("Read case study →" goes to `/work#<slug>`) · launch/marketing material · blog · dark mode · translated content (the structure is i18n-ready for chrome only).

## Measurement & SEO
**Goals:** Know whether the portfolio turns visits into contact, and which work draws people in.
**First question to answer:** How many visitors click a contact link, and do they view case studies first?

### Key events (conversions)
| Event | Fires when | Parameters | Why |
|---|---|---|---|
| contact_click | Click on the email, LinkedIn or GitHub link (nav Contact menu or footer) | method (`email`\|`linkedin`\|`github`), location (`nav`\|`footer`), page_type (`home`\|`work`\|`about`) | primary conversion |

### Funnel(s)
page_view (home) → case_study_view → contact_click

### Supporting events
| Event | Fires when | Parameters |
|---|---|---|
| case_study_view | A case-study card becomes ≥50% visible on `/work` (once per card per page view), or the accordion panel/mobile card's "Read case study →" is clicked on Home | case_study_slug, source (`work_scroll`\|`home_link`) |

### Event properties (Umami)
- method, location, page_type, case_study_slug, source (sent as event data)

### SEO
- **Audience & topics:** hiring managers/recruiters for senior full-stack roles in London; topics: senior full stack engineer London, Ruby on Rails React engineer, fintech integrations engineer, AI engineering / Claude Code tooling.
- **Pages to rank:** `/`, `/work`, `/about`
- **Noindex:** none (404/500 are static and not linked)
- **Structured data:** `Person` (name, jobTitle, address London, url, email, sameAs LinkedIn + GitHub) on every page; `WebSite` on `/`.
- **Brand:** "Louis Freeman — Senior Full Stack Engineer"; the share image comes from BT Creative: OG share image; sameAs https://www.linkedin.com/in/louis-freeman7/, https://github.com/Louisf77

### Consent
None needed. Umami is cookieless (no cookies, no localStorage, nothing stored on the device), so PECR/ePrivacy consent doesn't apply, and the site sets no other non-essential storage. GA4 was dropped because it needs consent in the UK even after the DUAA 2025 statistical exemption. A short privacy note (what Umami collects, a link to Umami's policy) sits behind a footer "Privacy" link. **Constraint:** no feature may add non-essential cookies/storage without re-planning consent.

### Release & marketing material
- **Needed:** default OG share image only (1200×630). No launch kit.
- **Tools:** HTML→PNG render from the design tokens (no paid generation). **Credit ceiling:** 0.

## Behaviour
- **Routing:** real paths `/`, `/work`, `/about`. Each is a Rails HTML route that serves the SPA shell (deep links and refreshes work). React Router handles in-app navigation; the nav stays mounted; content plays the page-enter animation; scroll resets to top (except a `#hash` target, which scrolls to that element).
- **First load:** the shell embeds that page's API payloads as JSON; React Query uses them as `initialData`, so there's no spinner or layout shift. **Client navigation:** fetches behind the page-enter fade; cached queries are reused.
- **Errors:** if a page query fails (client navigation only; first load is embedded), the page's content area shows an inline panel ("Couldn't load this page." + **Retry** button that refetches). The nav and footer still render from the cached/embedded `profile` where possible. No console-only errors.
- **Unknown path:** Rails returns the static `public/404.html` (styled). 500 → static `public/500.html`.
- **Metric:** a case study's metric box renders only when `metric` is non-null.
- **"Read case study →"** links to `/work#<slug>`; the Work page scrolls that card into view.
- **Reduced motion:** every effect in DESIGN.md §5 is off; content shows statically; the hero shows the poster instead of the video.
- **Contact:** desktop inline slide-out, mobile dropdown (DESIGN.md §4 Nav pill); links are `mailto:` + external `target="_blank" rel="noopener"`.
- **Hobbies tints** rotate sage → sand → paper-3 by position (client-side), not stored.

## Decisions
| Decision | Choice | Why |
|---|---|---|
| Rendering | React SPA + Rails API; no Inertia | User's choice (replaces the brief's Inertia) |
| Routing | React Router with real paths + a Rails HTML route per page | Page transitions + deep links + server meta |
| SEO meta | Server-rendered per route in the shell | Link previews/crawlers see tags without JS |
| API shape | One read-only singular resource per page (`home`, `work`, `about`) + `profile`, under `/api/v1` | User's choice: granular page controllers, not a catch-all settings resource |
| DB shape | One table per section (+ item tables); stack ticker derived from `capabilities` | User's choice |
| First paint | Bootstrap JSON in the shell → React Query `initialData` | No spinner, good LCP |
| Content storage | Postgres tables seeded from `content.json` | Brief's model; admin-ready later |
| Selected work | `case_studies.featured` flag decides what Home shows; Work shows all | User's request |
| i18n | UI chrome in `config/locales/en.yml` (`en.ui.*`), content single-locale | i18n-ready without translating content |
| Metrics | Hidden when null | No "TBC" in production |
| React Query / API modules / js-routes | Apply fully (the preferences stand now that there's an API) | User preferences |
| Analytics | Umami Cloud (Hobby, free), cookieless; no consent banner; GA4 dropped | GA4 needs consent in UK/EU (DUAA exemption doesn't cover it); user's choice |
| FE source layout | `app/javascript/`, feature-based (see §Architecture) | User's choice: industry-standard layout instead of vite_rails' `app/frontend` |
| Merging | The orchestrator squash-merges a PR once CI is green and QA passes, **except large features (L-size) and scaffolding/infra PRs, which need the user's OK first** | User's choice |
| Hosting | Render **Free** web + **free** Postgres, Frankfurt, prod only; upgrade to Starter + Basic DB before the free DB's 30-day expiry | User's choice; content is reseedable |
| Error pages | Styled static `public/404.html`, `public/500.html` | Work even when the app is down |

## Stack
| Layer | Choice | Source |
|---|---|---|
| FE framework / rendering | React 19 + TypeScript, client-rendered SPA bundled by Vite (`vite_rails`), mounted in a Rails layout | confirmed by user |
| Routing (FE) | React Router (v7, library/declarative mode), real paths | confirmed by user |
| Styling & tokens | Plain CSS: `app/javascript/styles/tokens.css` + `base.css` + per-component CSS modules. No Tailwind, no UI kit | confirmed by user (brief) |
| Fonts | Google Fonts `<link>` with preconnect: Sora, Karla, JetBrains Mono | confirmed by user (brief) |
| Animation | CSS + small `requestAnimationFrame` hooks; no animation library | confirmed by user (brief) |
| Data fetching (FE) | `@tanstack/react-query`; typed fetchers in `app/javascript/features/<page>/api/*.ts` + shared client in `app/javascript/lib/` using `js-routes` path helpers; queries in `*.queries.ts` | confirmed by user |
| Back end / DB | Rails 8 (full app, API controllers under `Api::V1`), PostgreSQL | confirmed by user |
| Tests | RSpec (models, requests) + Capybara/Cuprite system specs; Vitest + Testing Library + jsdom | confirmed by user |
| New dependencies | rspec-rails, factory_bot_rails, capybara, cuprite, json_schemer, rubocop (+rails/rspec/capybara/factory_bot), erb_lint, brakeman, bundler-audit, strong_migrations, bullet, js-routes; vite_rails, react, react-dom, react-router, @tanstack/react-query, vitest, @testing-library/{react,jest-dom,user-event}, jsdom, eslint + typescript-eslint + eslint-plugin-react + eslint-plugin-jsx-a11y, prettier | confirmed by user |
| Hosting | Render · Free web service + free Postgres · region frankfurt; upgrade to Starter ($7) + Basic DB (~$6) before the DB's 30-day expiry | confirmed by user |
| Environments | production only | confirmed by user |
| Domain | louisfreeman.co.uk (apex) + www → apex redirect | confirmed by user |
| Cloudflare | DNS only (nameservers moved to Cloudflare) · proxy: no | confirmed by user |
| Analytics | Umami Cloud (Hobby, free), cookieless script + `umami.track` events · no GA4, no GTM, no consent banner | confirmed by user (re-plan) |
| FE source layout | `app/javascript/` (vite_rails `sourceCodeDir`), feature-based: `entrypoints/`, `app/` (router, providers, layout), `features/{home,work,about}/{components,hooks,api}`, `components/` (shared UI), `hooks/`, `lib/`, `styles/`, `assets/`, `types/` | confirmed by user (re-plan) |
| Repo | public GitHub `Louisf77/louis-freeman-portfolio` (via `gh` CLI) | confirmed by user |

## Architecture
Greenfield; the architecture was settled directly with the user (no options doc needed; the brief plus grilling fixed it). One Rails app:

```
Browser ──GET /, /work, /about──▶ PagesController (HTML)
                                   └─ layout: meta/OG/JSON-LD + <div id="root"> + <script id="bootstrap" type="application/json">
                                         bootstrap = { ui: I18n.t("ui"), queries: { <queryKey>: <same JSON as the API> } }
React SPA (Vite, app/javascript) ─ React Router ─ features/home|work|about
      └─ React Query (initialData from bootstrap) ──GET /api/v1/{profile,home,work,about}──▶ Api::V1::{Profiles,Homes,Works,Abouts}Controller#show
                                                        └─ page serializer composes section serializers ─▶ section models (one table per section)
```
- **One API controller per page** (singular resources) plus `profile` for the shared nav/footer data. **One table per section** (plus item tables for a section's lists).
- **Serializers** are plain Ruby, one per section (`app/serializers/sections/*`), composed by one per page (`app/serializers/pages/*`). The API controllers and the page shell share them, so the embedded bootstrap JSON has exactly the API's shape.
- **Query keys** equal the bootstrap keys: `profile`, `home`, `work`, `about`.
- **FE layout** (`app/javascript/`): `entrypoints/application.tsx` · `app/` (router, providers, `Layout` with Nav/Footer, `PageEnter`) · `features/home|work|about/` each with `components/` (incl. the page component, e.g. `features/home/components/HomePage.tsx`), `hooks/`, `api/` (`*.api.ts` fetchers + `*.queries.ts`) · `components/` shared UI (`Nav`, `Footer`, `Button`, `Tag`, `Card`, `HighlightMark`, `SectionLoadError`, `diagrams/`) · `hooks/` shared (`useReducedMotion`, `useMediaQuery`, `useScrollProgress`, `useStickyStack`) · `lib/` (api client, js-routes, `useUi`, bootstrap reader, analytics) · `styles/` · `assets/` · `types/` (contract types). Import alias `~/` → `app/javascript/`.
- **Stack ticker** is derived from `capabilities` (`in_ticker`), not stored separately.
- **Static assets:** the logo, hero video/poster and waving cut-out are imported by the FE through Vite (fingerprinted). Hobby images live at `public/images/hobbies/*` (cache headers set), and the API returns their paths.
- **Diagrams** are React components (inline SVG/HTML), selected by `diagram_key`.

## Contracts

### Shared error envelope
All `/api/v1` errors:
```json
{ "errors": [ { "code": "not_found", "field": null, "message": "Hero section has not been seeded" } ] }
```
- `code`: string (`not_found` | `internal_error`); `field`: string or null; `message`: human-readable string naming the missing section, shown in the UI.
- 404 `:not_found` when a required singleton section row is missing; 500 `:internal_server_error` (rescued in `Api::V1::BaseController`, logged with class + message). There's no 422: the API is read-only.
- All endpoints: public (no auth), `GET` only, JSON, `Cache-Control: public, max-age=300`. No pagination.
- Shared item shapes (reused in several responses):
  - **Experience:** `{ "id": 1, "company": "Hnry", "role": "Senior Software Engineer", "dates_label": "Jan 2024 — Present", "year_label": "Now", "duration_label": null, "summary": "…", "highlights": ["…"], "subs": [ { "date_label": "Dec 2025", "label": "Promoted to Senior Software Engineer" } ], "tags": ["Ruby on Rails"], "watermark": null, "education": false, "position": 1 }`. `duration_label`/`watermark` are string|null; `highlights`/`tags` are string[]; `subs` is `{date_label, label}[]`; the FE falls back to `company` when `watermark` is null.
  - **CaseStudy:** `{ "id": 1, "slug": "card-issuing", "number": "01", "title": "Card Issuing, End to End", "years_label": "2024–25", "headline": "…", "description": "…", "role": "Lead engineer", "tags": ["Rails", "SOAP"], "diagram_key": "cards", "metric": null, "position": 1 }`. `diagram_key` ∈ `cards`|`identity`|`tax`|`ai`; `metric` is string|null. Slugs: `card-issuing`, `identity-verification`, `self-assessment`, `ai-tooling`.
  - **ListItem:** `{ "id": 1, "text": "Louis.", "position": 1 }` (greetings, earlier roles)
  - All lists are ordered by `position` ascending.

### GET /api/v1/profile — shared identity, contact links, footer
- **Controller:** `Api::V1::ProfilesController#show` (`resource :profile, only: :show`)
- **200 OK:**
```json
{ "profile": { "name": "Louis Freeman", "role": "Senior Full Stack Engineer", "location": "London",
  "email": "hello@louisfreeman.co.uk", "linkedin_url": "https://www.linkedin.com/in/louis-freeman7/",
  "github_url": "https://github.com/Louisf77",
  "footer_blurb": "Based in London. Happy to talk about fintech integrations, engineering leadership or AI tooling." } }
```
- **Errors:** 404 (profile not seeded) · 500

### GET /api/v1/home — Home page sections
- **Controller:** `Api::V1::HomesController#show` (`resource :home, only: :show`)
- **200 OK:**
```json
{ "home": {
  "hero": { "greeting_prefix": "Hi, I'm ", "tagline": "Senior Full Stack Engineer",
            "greetings": [ { "id": 1, "text": "Louis.", "position": 1 } ] },
  "experience": { "experiences": [ { …Experience… } ] },
  "selected_work": { "intro": "Four projects from Hnry: …", "case_studies": [ { …CaseStudy… } ] },
  "capabilities": {
    "title": "What I do", "intro": "Leading a team, building with AI, and shipping across the whole stack.",
    "groups": [ { "id": 1, "title": "Leadership", "position": 1,
                  "capabilities": [ { "id": 1, "name": "Line management", "position": 1 } ] } ],
    "domains": [ { "id": 1, "label": "Banking & card integrations", "position": 1 } ],
    "ticker": [ { "id": 7, "label": "React", "position": 1 } ]
  } } }
```
  `selected_work.case_studies` = only case studies with `featured: true`, ordered by `position` (may be empty; the FE then hides the Selected work section). `/api/v1/work` returns **all** case studies regardless of `featured`. The `featured` flag itself is not in the payload.
  `ticker` = capabilities with `in_ticker: true`, ordered by `ticker_position`; `label` = `ticker_label` if present, else `name`. `groups[].capabilities` contain only capabilities belonging to that group (ungrouped ticker-only capabilities appear only in `ticker`).
- **Errors:** 404 (hero, selected-work or capabilities section not seeded; the message names which) · 500

### GET /api/v1/work — Work page sections
- **Controller:** `Api::V1::WorksController#show` (`resource :work, only: :show`)
- **200 OK:** `{ "work": { "header": { "intro": "Case studies from Hnry. …" }, "case_studies": [ { …CaseStudy… } ] } }`
- **Errors:** 404 (work header not seeded) · 500

### GET /api/v1/about — About page sections
- **Controller:** `Api::V1::AboutsController#show` (`resource :about, only: :show`)
- **200 OK:**
```json
{ "about": {
  "intro": { "heading": "Hello! I'm Louis Freeman.", "subline": "Senior Full Stack Engineer · London" },
  "conversation": [ { "id": 1, "question": "So, what do you do?", "answer": "I'm a full-stack engineer …",
                      "highlights": ["full-stack engineer"], "position": 1 } ],
  "hobbies": { "items": [ { "id": 1, "name": "Rugby", "image_path": "/images/hobbies/rugby.png", "photo": false, "position": 1 } ],
               "earlier_roles": [ { "id": 1, "text": "Led a team of court attendants at the Wimbledon Championships.", "position": 1 } ] },
  "timeline": [ { …Experience… } ] } }
```
  `answer` is plain text (no HTML). The FE wraps each exact, case-sensitive occurrence of a `highlights` phrase in `<mark>`. `photo: true` = photograph (`object-fit: cover`), false = transparent cut-out.
- **Errors:** 404 (about intro not seeded) · 500

### HTML page shells
- **Routes:** `root "pages#home"`, `get "work" => "pages#work"`, `get "about" => "pages#about"`. **Controller:** `PagesController` (HTML only).
- **Layout** renders: `<title>`, `meta description`, canonical, OG/Twitter tags (`og:image` = `/og/default.png`, 1200×630), `Person` JSON-LD from `profile` (plus `WebSite` on home), Google Fonts links, the Vite entry, and `<div id="root"></div>`.
- **Bootstrap script:** `<script id="bootstrap" type="application/json">`:
```json
{ "ui": { "skip_to_content": "Skip to content", "…": "…" },
  "queries": { "profile": { …GET /api/v1/profile body… }, "home": { …GET /api/v1/home body… } } }
```
  Per page: **home** → profile, home · **work** → profile, work · **about** → profile, about. Each value is exactly the API response body (same serializers), escaped for safe embedding (`json_escape`).
- **Meta per page** (`config/locales/en.yml` `en.meta.<page>.title|description`):
  - home: "Louis Freeman — Senior Full Stack Engineer, London" / "Senior full-stack engineer (React, TypeScript, Ruby on Rails) building fintech integrations and AI tooling at Hnry."
  - work: "Work — Louis Freeman" / "Case studies: card issuing, identity verification in three countries, a UK Self Assessment tax return, and AI developer tooling."
  - about: "About — Louis Freeman" / "Senior full stack engineer in London: team lead, AI engineering lead, and product design engineer by training."
- `ui`: `I18n.t("ui")`, a flat string map owned by the FE (it adds keys to `en.ui` as needed; the schema requires an object of strings).

### Database — one table per section (all new, additive, one migration task)
Every table has `id` bigint PK and `created_at`/`updated_at` datetime not null. **Singleton** tables hold exactly one row (seeds guarantee it; the model exposes `.current`). Every `position` column is integer not null; item tables have a unique index on `position` unless stated.

| Table | Section | Columns (all not null unless marked) |
|---|---|---|
| `profiles` (singleton) | nav contact + footer | name, role, location, email, linkedin_url, github_url: string · footer_blurb: text |
| `hero_sections` (singleton) | Home hero | greeting_prefix, tagline: string |
| `hero_greetings` | Home hero greeting endings | text: string · position |
| `experiences` | Home deck + About timeline | company, role, dates_label, year_label: string · duration_label, watermark: string **null** · summary: text · highlights, tags, subs: jsonb default `[]` · education: boolean default `false` · position |
| `selected_work_sections` (singleton) | Home selected work | intro: text |
| `case_studies` | Home selected work + Work | slug, number, title, years_label, role, diagram_key: string · headline, description: text · tags: jsonb default `[]` · metric: string **null** · featured: boolean default `false` (true = shown in Home "Selected work") · position. Unique `slug`; index on `featured`. Model validates `diagram_key` ∈ cards/identity/tax/ai |
| `capabilities_sections` (singleton) | Home "What I do" | title: string · intro: text |
| `capability_groups` | "What I do" cards | title: string · position |
| `capabilities` | card items + stack ticker | capability_group_id: bigint FK → capability_groups **null** (indexed) · name: string · position: integer **null** · in_ticker: boolean default `false` · ticker_label: string **null** · ticker_position: integer **null**. Unique `(capability_group_id, position)`; unique `ticker_position` where not null. Model validates: group present ⇒ position present; `in_ticker` ⇔ `ticker_position` present; at least one of group or `in_ticker` |
| `domains` | "What I do" Domain box | label: string · position |
| `work_headers` (singleton) | Work header | intro: text |
| `about_intros` (singleton) | About intro | heading, subline: string |
| `chat_messages` | About conversation | question: string · answer: text · highlights: jsonb default `[]` · position |
| `hobbies` | About hobbies | name, image_path: string · photo: boolean default `false` · position |
| `earlier_roles` | About "Earlier" card | text: string · position |

- **Ticker seed mapping** (`content.json` `stackTicker` → capabilities): React → "React 18" (Front end; ticker_label "React") · TypeScript → "TypeScript" · Ruby → new ungrouped "Ruby" · Rails → "Ruby on Rails" (ticker_label "Rails") · PostgreSQL → "PostgreSQL" · AWS → "AWS (SQS, S3)" (ticker_label "AWS") · Terraform, Docker, Kubernetes → same-named items · Tailwind → "Tailwind CSS" (ticker_label "Tailwind") · Jest → "Jest" · Claude → "Claude Code" (ticker_label "Claude"). `ticker_position` follows the `stackTicker` order (1–12).
- **Migration plan:** one additive migration file per table (15 files, `capability_groups` before `capabilities`), `up`/`down`, all in task **Migration: create content tables**. No backfill (seeds populate).

## Designs
Handover: `docs/design/handover/louis-freeman-portfolio/` (original zip alongside). Spec: `DESIGN.md` + `BUILD_BRIEF.md` (ignore its Inertia instructions: this plan replaces them).

| Screen / piece | Files | Task |
|---|---|---|
| Tokens, type, nav, footer, buttons, chips, page enter | DESIGN.md §1–4, `Main.dc.html`, `MHome.dc.html` | Frontend: app shell & design foundation |
| Diagrams | `VizCards`, `VizIdentity`, `VizTax`, `VizAI` `.dc.html` | Frontend: case-study diagrams |
| Home hero, capabilities, ticker | `Main.dc.html`, `MHome.dc.html` | Frontend: Home hero, capabilities & ticker |
| Experience deck | `Main.dc.html`, `MHome.dc.html` | Frontend: Home experience deck |
| Selected work | `Main.dc.html`, `MHome.dc.html` | Frontend: Home selected work |
| Home section stacking | `Main.dc.html` (DESIGN.md §5) | Frontend: Home section card stack |
| Work | `Work.dc.html`, `MWork.dc.html` | Frontend: Work page |
| About intro + chat | `About.dc.html`, `MAbout.dc.html` | Frontend: About conversation intro |
| Hobbies + Where I've been | `About.dc.html`, `MAbout.dc.html` | Frontend: About hobbies & where I've been |
Assets: `assets/` → mapping in DESIGN.md §7 (`/_blob/<id>` → file).

## Preferences applied
- RESTful controllers — https://app.notion.com/p/3e4f4750980b8129b5ffd0b0fb452f4a — `Api::V1::{Profiles,Homes,Works,Abouts}Controller#show` only
- API calls in typed modules via generated path helpers; React Query — https://app.notion.com/p/3e4f4750980b81b490bafc431dd9bd3f — `app/javascript/features/*/api/*` + `lib/` client + js-routes + `*.queries.ts`
- No hardcoded user-facing strings — https://app.notion.com/p/3e4f4750980b81c3bd55f47deccc5544 — content from the API, chrome from `en.ui`
- Users see error feedback in the UI — https://app.notion.com/p/3e4f4750980b81319ef8e273076a3401 — inline Retry panel
- Migrations up/down — https://app.notion.com/p/3e4f4750980b819f88bde3ff851f09bc · explicit boolean defaults — https://app.notion.com/p/3e4f4750980b817ababef98247392f12
- Feature specs for anything a user sees — https://app.notion.com/p/3e4f4750980b81a1af16c0db472c1b48 — Capybara/Cuprite per page
- No code comments — https://app.notion.com/p/3e4f4750980b81bf82d1f153ed01a972 · PRs as drafts — https://app.notion.com/p/3e4f4750980b8127bfa7e27cd8e86e9a

## Risks & open questions
- **Render free Postgres expires 30 days after creation.** DevOps adds a reminder to the project Outcome; upgrade before then (content is reseedable).
- **Render free web cold starts** (~30–60s after idle) will hurt first impressions and mobile Lighthouse. Measure Lighthouse on a warm instance; the planned move to Starter fixes it.
- **Parallel Home tasks** share `features/home/components/HomePage.tsx`. The foundation task creates Home with one placeholder component per section; each Home task edits only its own component files, plus the single line that mounts it.
- The `interface`-vs-type preference is unsettled (awaiting your answer). Until then, use `interface` for object shapes.

## Goals

### Milestone 1 — Foundation (demoable when: the app boots locally and in CI, `/api/v1/*` serve seeded content, and `/`, `/work`, `/about` render the shell with nav, footer and tokens)
| # | ID | Task | Role | Size | Blocked by |
|---|---|---|---|---|---|
| 1 | BT-1 | DevOps: bootstrap | DevOps | L | — |
| 2 | BT-2 | Contracts: content API & page bootstrap | Integration | S | 1 |
| 3 | BT-3 | Migration: create content tables | Backend | S | 1 |
| 3a | BT-22 | DevOps: pin json gem | DevOps | S | 1 |
| 3b | BT-23 | DevOps: remove cookie consent layer | DevOps | S | 1 (after PR #1 merges) |
| 3c | BT-24 | DevOps: move React source to app/javascript (feature-based) | DevOps | M | 2, 23 |
| 3d | BT-25 | DevOps: harden CI (migration round-trip, schema diff, Chrome startup) | DevOps | S | 3 |
| 4 | BT-4 | Backend: content models & seeds | Backend | M | 3, 22 |
| 5 | BT-6 | Backend: content API v1 | Backend | M | 2, 4 |
| 6 | BT-13 | Backend: page shells, meta & bootstrap JSON | Backend | M | 5 |
| 7 | BT-5 | Frontend: app shell & design foundation | Frontend | L | 2, 24 |

### Milestone 2 — Pages (demoable when: all three pages match the mockups at 1440/390 on real data)
| # | ID | Task | Role | Size | Blocked by |
|---|---|---|---|---|---|
| 8 | BT-7 | Frontend: case-study diagrams | Frontend | M | 7 |
| 9 | BT-8 | Frontend: Home hero, capabilities & ticker | Frontend | M | 7 |
| 10 | BT-9 | Frontend: Home experience deck | Frontend | M | 7 |
| 11 | BT-14 | Frontend: Home selected work | Frontend | M | 8 |
| 12 | BT-16 | Frontend: Home section card stack | Frontend | S | 9, 10, 11 |
| 13 | BT-15 | Frontend: Work page | Frontend | M | 8 |
| 14 | BT-10 | Frontend: About conversation intro | Frontend | M | 7 |
| 15 | BT-11 | Frontend: About hobbies & where I've been | Frontend | M | 7 |
| 16 | BT-17 | Integrate: content | Integration | M | 6, 12, 13, 14, 15 |

### Milestone 3 — Launch (demoable when: live at louisfreeman.co.uk with Umami analytics and SEO)
| # | ID | Task | Role | Size | Blocked by |
|---|---|---|---|---|---|
| 17 | BT-12 | Creative: OG share image | Creative | S | 7 |
| 18 | BT-18 | Marketing: analytics & SEO foundation | Marketing | M | 16, 17 |
| 19 | BT-19 | Frontend: motion, accessibility & performance pass | Frontend | M | 16 |
| 20 | BT-20 | QA: release check | QA | M | 1–19 |
| 21 | BT-21 | DevOps: production deploy | DevOps | M | 20 |

## Goal prompts

Common context for every goal:
- Project: Louis Freeman Portfolio — https://app.notion.com/p/3e5f4750980b81e6882ff1c95860aba7
- Plan: `docs/plans/2026-09-24-portfolio-site.md`. Preferences: `docs/plans/preferences.md` (don't query Notion)
- Handover: `docs/design/handover/louis-freeman-portfolio/` (`DESIGN.md` is the spec; `BUILD_BRIEF.md` is superseded where it mentions Inertia)
- Stack: see plan §Stack. It was decided with the user; don't change it.

### BT-1 — DevOps: bootstrap
Role: DevOps (Bootstrap mode) · Size: L · Blocked by: —

**Goal:** A fresh clone runs `bin/setup && bin/dev` and serves a hello-world React page from Rails, with the full test/lint toolchain, cookie consent, CI and a Render blueprint in place.

**Context**
- Folder `~/Documents/Dev/louis-freeman-portfolio` already holds `docs/`. Scaffold the Rails app around it; don't move or delete `docs/`. Keep the original zip out of git if it's over ~5 MB (add it to `.gitignore`).
- Repo: create **public** `Louisf77/louis-freeman-portfolio` with the `gh` CLI (the GitHub MCP is unavailable). Return NEEDS USER ACTION if `gh` isn't authenticated.
- Stack: plan §Stack. `rails new . --database=postgresql --skip-javascript --skip-asset-pipeline=false` (or equivalent), then `vite_rails`, React 19 + TS, React Router, React Query, js-routes, and the approved baseline list only.
- Copy `assets/logo-mark.png`, `hero.mp4`, `hero-poster.jpg`, `louis-waving.png` to `app/frontend/assets/` (moved to `app/javascript/assets/` by BT-24), and `assets/hobbies/*` to `public/images/hobbies/`. Set far-future cache headers for `/images` and Vite assets.

**Scope**
- In: scaffold; gems/packages from the approved list; RuboCop/ESLint/Prettier configured to the preferences (double quotes, trailing commas, no `any`, explicit button type via eslint react/button-has-type, alphabetical YAML keys); `rails_helper`/`spec_helper`/`spec/support` (Cuprite driver, FactoryBot); Vitest config (jsdom); `bin/setup`, `bin/dev` (Rails + Vite); cookie consent layer (necessary + analytics, Consent Mode v2 default-denied, footer "Cookie settings" reopen hook exposed for the FE); GitHub Actions CI (rubocop, erb_lint, eslint, tsc, brakeman, bundler-audit, rspec, vitest, vite build); `render.yaml` (web **free** plan, Postgres **free**, region frankfurt, build runs `db:prepare` + `db:seed`); a placeholder `PagesController#home` rendering a React "hello" via the Vite entry.
- Out: models, API, real pages, domain/DNS (production deploy task), GA4 wiring (Marketing task).

**Preferences that apply**
- YAML keys in alphabetical order — https://app.notion.com/p/3e4f4750980b81fb91a5cd1f8663e546
- No code comments — https://app.notion.com/p/3e4f4750980b81bf82d1f153ed01a972
- Never force-push without consent — https://app.notion.com/p/3e4f4750980b8157b510e3d2c0751086

**Done when**
- [ ] `bin/setup` then `bin/dev` serves `/` with a React-rendered hello and the consent banner
- [ ] `bundle exec rspec` and `npx vitest run` are green (including the consent feature spec)
- [ ] `bundle exec rubocop && bundle exec erb_lint --lint-all && npx eslint . && npx tsc --noEmit` pass
- [ ] CI is green on the initial push; `render.yaml` validates
- [ ] Report lists any NEEDS USER ACTION (gh auth, Render account)

**Report back:** summary, files, commands + results, repo URL, assumptions.

### BT-2 — Contracts: content API & page bootstrap
Role: Integration · Size: S · Blocked by: DevOps: bootstrap

**Goal:** Every contract in plan §Contracts exists as an executable JSON Schema that both sides test against.

**Context:** plan §Contracts (all of it) and §Architecture. Schemas go in `spec/contracts/`: `api/v1/profile/show.json`, `api/v1/home/show.json`, `api/v1/work/show.json`, `api/v1/about/show.json`, shared `$defs` for Experience/CaseStudy/ListItem in `api/v1/shared.json`, `api/v1/error.json`, `pages/bootstrap.json`. Add an RSpec matcher (`match_contract("api/v1/home/show")`, json_schemer) and a TS check for FE fixtures (a Vitest helper validating mock JSON against the same schemas, e.g. with `ajv`; add `ajv` as a dev dependency only if needed, and note it in the report).

**Scope**
- In: schemas (strict: `additionalProperties: false` on every object, required fields, nullability, enums for `diagram_key`), the RSpec matcher + spec, the Vitest helper, and one valid fixture per schema in `spec/fixtures/contracts/` built from `content.json` data (these become the FE's mock data).
- Out: controllers, models, FE code.

**Preferences that apply**
- Inline hashes over fixture files for small payloads — https://app.notion.com/p/3e4f4750980b81f5bce9c0eb5debbab4 (the contract fixtures are the exception: they're shared FE/BE data)
- No `any`, including in test mocks — https://app.notion.com/p/3e4f4750980b81faab74ef61db5a6185

**Done when**
- [ ] Each fixture validates against its schema in both RSpec and Vitest; a deliberately broken fixture fails (a spec proves it)
- [ ] `bundle exec rspec spec/contracts` and `npx vitest run` green; lint passes
- [ ] No contract field differs from plan §Contracts

### BT-3 — Migration: create content tables
Role: Backend · Size: S · Blocked by: DevOps: bootstrap

**Goal:** The fifteen section tables exist exactly as specified in plan §Contracts › Database.

**Scope**
- In: one migration per table (the 15 tables in §Contracts › Database, `capability_groups` before `capabilities`), with `up`/`down`, null constraints, jsonb defaults `[]`, boolean `default: false, null: false`, the FK, and the unique/partial indexes as listed. Updated `db/schema.rb`. Draft PR of its own.
- Out: models, seeds.

**Preferences that apply**
- Migrations: always up/down, never change — https://app.notion.com/p/3e4f4750980b819f88bde3ff851f09bc
- Explicit boolean defaults — https://app.notion.com/p/3e4f4750980b817ababef98247392f12

**Done when**
- [ ] `bin/rails db:migrate && bin/rails db:rollback STEP=15 && bin/rails db:migrate` succeeds
- [ ] `db/schema.rb` matches the contract tables column for column; strong_migrations raises no warnings
- [ ] CI green

### BT-22 — DevOps: pin json gem
Role: DevOps (Change mode) · Size: S · Blocked by: —

**Goal:** Rails can decode JSON again (jsonb columns, `ActiveSupport::JSON.decode`), with a guard so a future json bump can't silently break it.

**Context:** `json 3.0.2` in Gemfile.lock changed `JSON.parse` to one argument; ActiveSupport 8.1 calls `::JSON.parse(json, options)`, so `bin/rails runner 'ActiveSupport::JSON.decode("[1]")'` raises ArgumentError. It also makes schema dumps drop jsonb tables. Found by BT-3.

**Scope**
- In: `gem "json", "~> 2.18"` in the Gemfile (keep its ordering conventions), `bundle lock`, and a DB-free spec that `ActiveSupport::JSON.decode` round-trips an array + object. Draft PR from `origin/main`.
- Out: any other gem bumps.

**Done when**
- [ ] The repro command prints the decoded value; the new spec fails on json 3.0.2 and passes on the pin
- [ ] CI green

### BT-23 — DevOps: remove cookie consent layer
Role: DevOps (Change mode) · Size: S · Blocked by: DevOps: bootstrap (and PR #1 merged, so its non-consent QA fixes land first)

**Goal:** The site ships with no cookie banner or consent code, since it sets no non-essential cookies (plan §Measurement & SEO › Consent).

**Scope**
- In: remove the consent banner component, its CSS, the `CookieConsent` Ruby class, the consent cookie, Consent Mode defaults/gtag stubs, the footer reopen hook, the `en.ui.cookie_*` keys, and their specs/tests; add a request/system spec asserting a first visit sets no cookies except (at most) Rails' session cookie, and no banner renders. Update docs/reports/BT-1-devops.md with a note. Draft PR from `origin/main`.
- Out: the privacy note and Umami (BT-18); moving FE files (BT-24).

**Preferences that apply**
- No code comments — https://app.notion.com/p/3e4f4750980b81bf82d1f153ed01a972

**Done when**
- [ ] `grep -ri "consent\|cookie_" app config spec test` finds nothing consent-related; the no-cookies spec passes
- [ ] Full suite + linters + CI green

### BT-24 — DevOps: move React source to app/javascript (feature-based)
Role: DevOps (Change mode) · Size: M · Blocked by: Contracts: content API & page bootstrap; DevOps: remove cookie consent layer

**Goal:** All front-end source lives in `app/javascript/` in the feature-based layout from plan §Architecture, and every tool (Vite, TS, ESLint, Prettier, Vitest, CI) points at it.

**Scope**
- In: set `sourceCodeDir: "app/javascript"` in `config/vite.json`; `git mv` everything from `app/frontend/` into the §Architecture layout (`entrypoints/`, `app/`, `features/{home,work,about}/{components,hooks,api}` with `.keep` where empty, `components/`, `hooks/`, `lib/`, `styles/`, `assets/`, `types/`); alias `~/` → `app/javascript/` in `tsconfig.json`, Vite and Vitest; update the ESLint/Prettier globs, the Vitest include/setup paths, the BT-2 contract helper imports (`test/contracts.ts`) and the layout's `vite_javascript_tag`; update `README`/docs mentions. No behaviour change. Draft PR from `origin/main` after BT-2 and BT-23 merge.
- Out: new components or features.

**Done when**
- [ ] `app/frontend/` no longer exists; `bin/dev` serves the React hello page; the production Vite build succeeds
- [ ] `npx vitest run`, `npx tsc --noEmit`, `npx eslint .`, `npx prettier --check .`, RSpec and CI green

### BT-25 — DevOps: harden CI (migration round-trip, schema diff, Chrome startup)
Role: DevOps (Change mode) · Size: S · Blocked by: Migration: create content tables

**Goal:** CI catches a broken `down` in any migration or a stale/broken `db/schema.rb`, and system specs no longer flake on headless Chrome startup.

**Context:** found by BT-3 QA: `bin/rails db:migrate:redo` only rolls back the latest migration and never diffs the schema. CI also failed twice with `Ferrum::ProcessTimeoutError` (Cuprite/Chrome startup) on otherwise green runs.

**Scope**
- In: replace the CI "Migrations redo" step (in `config/ci.rb` and the GitHub workflow) with a full round-trip: `db:migrate` from empty → `db:rollback STEP=<all migrations>` (or `db:migrate VERSION=0`) → `db:migrate`, then fail if `git diff --exit-code db/schema.rb` shows changes; raise Cuprite's `process_timeout` (e.g. 30s) and add `--no-sandbox`/`--disable-dev-shm-usage` browser options in CI only; keep `bin/ci` mirroring the workflow. Draft PR from `origin/main`.
- Out: other CI changes.

**Done when**
- [ ] A deliberately broken `down` in an older migration (tested on a throwaway branch, not committed) fails CI; a hand-edited `schema.rb` fails CI
- [ ] CI green on the PR; `bin/ci` passes locally (DB steps may need a throwaway Postgres)

### BT-4 — Backend: content models & seeds
Role: Backend · Size: M · Blocked by: Migration: create content tables; DevOps: pin json gem

**Goal:** `bin/rails db:seed` loads every piece of copy from `content.json` into the database, idempotently.

**Context:** source `docs/design/handover/louis-freeman-portfolio/content/content.json`. Copy it to `db/seeds/content.json` (the seed reads that copy). Field mapping: see plan §Contracts, including the **ticker seed mapping** (e.g. `dates`→`dates_label`, `year`→`year_label`, `len`→`duration_label`, `mark`→`watermark`, `edu`→`education`, `subs[].date`→`date_label`, case study `id`→`number`, `diagram` `VizCards.dc.html`→`cards` etc., `about.conversation[].q/a/highlight`→`question/answer/highlights`, hobbies→`image_path` `/images/hobbies/<name>.png|jpg` with `photo: true` for football and cooking). Case-study slugs are in §Contracts.

**Scope**
- In: one model per table (`Profile`, `HeroSection`, `HeroGreeting`, `Experience`, `SelectedWorkSection`, `CaseStudy`, `CapabilitiesSection`, `CapabilityGroup`, `Capability`, `Domain`, `WorkHeader`, `AboutIntro`, `ChatMessage`, `Hobby`, `EarlierRole`) with the validations in §Contracts (presence, `diagram_key` inclusion, unique `position`/`slug`, the capability ticker rules), an `ordered` named scope on item models, `.current` on singletons, `Capability.in_ticker` scope ordered by `ticker_position`, `CaseStudy.featured` scope; a seed loader class (`Content::Seeder`, keyword args) that upserts by natural key (`position`/`slug`) in one transaction, and is idempotent; model specs + a seeder spec.
- Out: serializers, controllers.

**Preferences that apply**
- Guard against duplicates before creating records — https://app.notion.com/p/3e4f4750980b8190b2dbe1cf5ca572a4
- Named scopes; no default_scope — https://app.notion.com/p/3e4f4750980b81848e02e2eab1f192d3
- Testing: seed state in the DB, build over create when persistence isn't needed; one expectation per `it` — https://app.notion.com/p/3e4f4750980b8123886cd5abff6591b1

**Done when**
- [ ] Running `bin/rails db:seed` twice leaves 1 row in each singleton, 4 hero greetings, 6 experiences, 4 case studies (all 4 seeded `featured: true`), 4 capability groups, 26 capabilities (25 grouped + ungrouped "Ruby"), 12 in the ticker, 8 domains, 3 chat messages, 7 hobbies, 2 earlier roles
- [ ] `bundle exec rspec spec/models spec/lib` green; rubocop passes

### BT-6 — Backend: content API v1
Role: Backend · Size: M · Blocked by: Contracts: content API & page bootstrap; Backend: content models & seeds

**Goal:** `GET /api/v1/profile`, `/home`, `/work` and `/about` return seeded content exactly per their schemas.

**Scope**
- In: routes `namespace :api { namespace :v1 { resource :profile, :home, :work, :about, only: :show } }` (controllers `ProfilesController`, `HomesController`, `WorksController`, `AboutsController`); `Api::V1::BaseController` (JSON only, error envelope, rescue + log for 404/500, `Cache-Control: public, max-age=300`); plain-Ruby serializers: one per section under `app/serializers/sections/`, composed by one per page under `app/serializers/pages/` (reused by the page shells later); eager-load to avoid N+1; request specs asserting `match_contract` for every endpoint, a 404 case per singleton section a page needs, and a spec that a non-featured case study is absent from `/home` but present in `/work`.
- Out: HTML pages, FE.

**Contracts to honour:** every `/api/v1` endpoint + error envelope — plan §Contracts; schemas in `spec/contracts/api/v1/`.

**Preferences that apply**
- RESTful controllers — https://app.notion.com/p/3e4f4750980b8129b5ffd0b0fb452f4a
- Keep controller actions short — https://app.notion.com/p/3e4f4750980b813aa3afe7c200249fe5
- Log errors with class and message — https://app.notion.com/p/3e4f4750980b8143a6eedf1a588633e0

**Done when**
- [ ] `curl localhost:3000/api/v1/home` returns all four sections, with the 12-item ticker in order
- [ ] `bundle exec rspec spec/requests/api` green, every response matching its contract; bullet reports no N+1
- [ ] rubocop + brakeman pass

### BT-13 — Backend: page shells, meta & bootstrap JSON
Role: Backend · Size: M · Blocked by: Backend: content API v1

**Goal:** `/`, `/work` and `/about` return server-rendered HTML with correct per-page meta, OG tags, JSON-LD and the embedded bootstrap JSON, mounting the SPA.

**Scope**
- In: `PagesController#home|work|about`; the layout (`app/views/layouts/application.html.erb`) with fonts + preconnect, meta/canonical/OG/Twitter (`og:image` `/og/default.png`; the file comes from the Creative task, so reference the path now), `Person` JSON-LD (+ `WebSite` on home); a bootstrap builder (e.g. `Pages::Bootstrap.new(page:)`) that embeds the per-page query set via the API serializers plus `ui: I18n.t("ui")` (queries per §Contracts: profile + the page's own); `config/locales/en.yml` with `en.meta.*` (copy from §Contracts) and a starter `en.ui` (`skip_to_content`, `retry`, `section_load_error`); styled static `public/404.html` + `public/500.html` in the paper/ink tokens with the logo and a "Back home" ghost button (inline CSS, no JS; `assets/logo-mark.png` inlined or copied to `public/`). Request specs: meta per page + bootstrap validates against `spec/contracts/pages/bootstrap.json`.
- Out: React components.

**Contracts to honour:** HTML page shells + bootstrap — plan §Contracts.

**Preferences that apply**
- Split units by responsibility and compose them — https://app.notion.com/p/3e4f4750980b816c89f5d62ada1890a5
- One expectation per `it`; named subject first — https://app.notion.com/p/3e4f4750980b811fb736c406ffff222c

**Done when**
- [ ] `curl -s localhost:3000/work | grep og:title` shows the Work title; the bootstrap script parses and matches its schema
- [ ] `/nope` returns the styled 404
- [ ] `bundle exec rspec spec/requests/pages_spec.rb` green; erb_lint + rubocop pass

### BT-5 — Frontend: app shell & design foundation
Role: Frontend · Size: L · Blocked by: Contracts: content API & page bootstrap; DevOps: move React source to app/javascript (feature-based)

**Goal:** The SPA has the full design system and chrome (tokens, fonts, nav with contact menu, footer, page-enter transitions, skip link, error/retry panel) and typed data access, so page tasks only build their sections.

**Context**
- Designs: DESIGN.md §1–6; nav/footer/buttons/chips in `Main.dc.html` + `MHome.dc.html`. Ignore leftover `.tl-*`, `.read-cursor` and the `TYPES` map.
- Data: build against the contract fixtures in `spec/fixtures/contracts/` (mock fetch in dev/tests until Integrate); read the bootstrap from `#bootstrap` when present.

**Scope**
- In: `styles/tokens.css` (every DESIGN.md token) + `base.css`; React Router with `/`, `/work`, `/about` routes and scroll reset/hash scroll; `PageEnter` transition; `Nav` (pill, active state, scrolled shadow, desktop Contact slide-out, mobile dropdown; `aria-expanded`); `Footer` (incl. a "Privacy" link to a short privacy note section/dialog, content from `en.ui`, and "Back to top ↑"); shared `Tag`, `Button`, `Card`, `HighlightMark`; hooks `useReducedMotion`, `useMediaQuery`, `useScrollProgress`; `features/*/api/*.api.ts` typed fetchers (shared client in `lib/`, js-routes helpers) + `*.queries.ts` (React Query, `initialData` from bootstrap) with TS types matching the schemas (query keys `profile`, `home`, `work`, `about`); `SectionLoadError` inline Retry panel; `useUi()` for `en.ui` strings; `features/home/components/HomePage.tsx` composing placeholder section components (`HeroSection`, `ExperienceSection`, `SelectedWorkSection`, `CapabilitiesSection`), plus `features/work/components/WorkPage.tsx` and `features/about/components/AboutPage.tsx` (About composes placeholder `ConversationIntro`, `HobbiesSection`, `WhereIveBeenSection`, each edited only by its own task). Vitest specs for Nav contact menu (desktop + mobile), the Retry panel and bootstrap hydration.
- Out: section contents, diagrams, scroll-stacking effects.

**Contracts to honour:** all `/api/v1` response shapes + bootstrap — schemas in `spec/contracts/`.

**Preferences that apply**
- Functional components; Props interface at top, default export at bottom; props alphabetical — https://app.notion.com/p/3e4f4750980b81a0858ddaef64d9e7be
- Every `<button>` gets an explicit type — https://app.notion.com/p/3e4f4750980b8130ba48e6bd60391f52
- API calls in typed modules via generated path helpers — https://app.notion.com/p/3e4f4750980b81b490bafc431dd9bd3f
- No hardcoded user-facing strings — https://app.notion.com/p/3e4f4750980b81c3bd55f47deccc5544
- Users see error feedback in the UI — https://app.notion.com/p/3e4f4750980b81319ef8e273076a3401

**Done when**
- [ ] Nav/footer match the mockups at 1440 and 390 (screenshots in the report); navigating plays the page-enter animation with the nav persisting
- [ ] Contact menu keyboard-operable; skip link visible on focus; focus ring per DESIGN.md §6
- [ ] `npx vitest run`, `npx eslint .`, `npx tsc --noEmit` pass

### BT-7 — Frontend: case-study diagrams
Role: Frontend · Size: M · Blocked by: Frontend: app shell & design foundation

**Goal:** Four faithful, scalable diagram components render exactly like the mockups at any well size.

**Context:** `VizCards.dc.html`, `VizIdentity.dc.html`, `VizTax.dc.html`, `VizAI.dc.html`; DESIGN.md §4 Diagrams (720×440 base, `--surface-3`, grid/dot pattern, ink strokes, green key path, "FIG. 0X — …" caption).

**Scope**
- In: `app/javascript/components/diagrams/{CardIssuingDiagram,IdentityDiagram,TaxReturnDiagram,AiToolingDiagram}.tsx`, inline SVG/HTML; a `CaseStudyDiagram` picker keyed by `diagram_key` via a module-level `Record`; a `scale` prop (0.49–1.08) that keeps the layout box correct; `role="img"` + descriptive `aria-label` (strings in `en.ui`). A Vitest spec per diagram (renders, has label) + the picker.
- Out: where they're placed (Home/Work tasks).

**Preferences that apply**
- Mapping logic in module-level `Record<K, V>` — https://app.notion.com/p/3e4f4750980b8173a0a2d0fc3de53373
- Name components by what they do — https://app.notion.com/p/3e4f4750980b816eabe0ed93a682639e

**Done when**
- [ ] A dev-only preview (or a Vitest DOM snapshot + screenshots in the report) shows each diagram matching its mockup at 1.0 and 0.49 scale
- [ ] vitest, eslint, tsc pass

### BT-8 — Frontend: Home hero, capabilities & ticker
Role: Frontend · Size: M · Blocked by: Frontend: app shell & design foundation

**Goal:** The Home hero (looping video, typed greeting) and the "What I do" section match the mockups on desktop and mobile.

**Context:** `Main.dc.html` + `MHome.dc.html`; DESIGN.md §4 Hero, Capability card, Stack ticker.

**Scope**
- In: `HeroSection` (video autoplay/muted/loop/playsinline with poster, `play()` retry, edge masks desktop/mobile, background exactly `--paper`; `TypedGreeting` with the timing spec, caret, never overlapping the figure, SR-only full sentence; tagline + Scroll cue); `CapabilitiesSection` (4 cards in a row on desktop, sticky-stacked on mobile; Domain box; `StackTicker` marquee 70s/50s, pause on hover, `aria-hidden` + summary label). Data: `home.hero`, `home.capabilities` (groups, domains, ticker). Vitest for TypedGreeting (fake timers: types, holds, deletes, cycles; static under reduced motion).
- Out: the section-over-section stacking (Home section card stack task); the deck; selected work.

**Preferences that apply**
- useRef for comparison values; useCallback for effect-dep handlers — https://app.notion.com/p/3e4f4750980b819285bbda0d46aa064b
- Magic numbers become named constants — https://app.notion.com/p/3e4f4750980b8100b2d5e119c7242537

**Done when**
- [ ] Screenshots at 1440 and 390 match the mockups; the greeting cycles all four endings without overlapping the figure
- [ ] vitest, eslint, tsc pass

### BT-9 — Frontend: Home experience deck
Role: Frontend · Size: M · Blocked by: Frontend: app shell & design foundation

**Goal:** The Experience deck works as designed: scroll-driven with a clickable company list on desktop, swipe/buttons/autoplay on mobile.

**Context:** `Main.dc.html` + `MHome.dc.html`; DESIGN.md §4 Experience card deck, §5 Deck flip. Data: `home.experience.experiences`.

**Scope**
- In: `ExperienceSection` + `ExperienceDeck`, `ExperienceCard`: sticky stage, year numeral, company list with active bar (clicking scrolls to that card), peeking stack offsets/surfaces, fly-out (−118%, −4°), watermark sizing rules (`watermark ?? company`), sparse-card lead size, education dashed style; mobile 600px deck with swipe, 48px ← → buttons, progress bar, "01 / 06" counter, 4.2s autoplay until interaction. Keyboard: arrow keys move cards; the list items are buttons. Vitest: mobile next/prev/counter, autoplay stops after interaction, keyboard nav.
- Out: section stacking.

**Preferences that apply**
- Custom radio-style controls get full ARIA and arrow-key navigation — https://app.notion.com/p/3e4f4750980b816a9ac6d47d9e848037
- Booleans start with `is` — https://app.notion.com/p/3e4f4750980b81deb930e2bf1cb251c5

**Done when**
- [ ] Screenshots/GIF at 1440 and 390 match the mockups; all 6 entries reachable by scroll, click, swipe and keyboard
- [ ] vitest, eslint, tsc pass

### BT-14 — Frontend: Home selected work
Role: Frontend · Size: M · Blocked by: Frontend: case-study diagrams

**Goal:** Selected work shows the desktop accordion gallery and the mobile stacked cards, each linking to its case study on `/work`.

**Context:** `Main.dc.html` + `MHome.dc.html`; DESIGN.md §4 Selected work, §5 Accordion. Data: `home.selected_work`.

**Scope**
- In: `SelectedWorkSection` (renders nothing when `case_studies` is empty; the accordion adapts to 1–4 panels) with `WorkAccordion` (4 panels, 600px, vertical titles when closed, `flex-grow: 6` open panel, diagram at .8, meta/title/headline/tags, "Read case study →" ghost button → `/work#<slug>`; opens on hover/focus/click; 4.5s autoplay until interaction) and `WorkStackMobile`; metric hidden when null. Vitest: hover/focus/click open, autoplay stops, link hrefs.
- Out: section stacking; analytics events (Marketing task adds them; expose the link element cleanly).

**Done when**
- [ ] Screenshots at 1440 and 390 match; the accordion is fully keyboard-operable
- [ ] vitest, eslint, tsc pass

### BT-16 — Frontend: Home section card stack
Role: Frontend · Size: S · Blocked by: Frontend: Home hero, capabilities & ticker; Frontend: Home experience deck; Frontend: Home selected work

**Goal:** Home sections stack like cards as you scroll, exactly per DESIGN.md §5.

**Scope**
- In: `useStickyStack` hook + wrapper: each section sticky with `top = min(0, vh − sectionHeight)`, the next slides over with a rounded top (44px desktop / 32px mobile) and upward shadow, the covered section darkens (`progress × 0.22` ink overlay) only while overlapped; the hero drifts/fades/scales instead (≤180px, .9, 0). Works with the sticky deck inside. Static under reduced motion.
- Out: section internals.

**Done when**
- [ ] A scroll-through GIF at 1440 and 390 matches the mockup behaviour; no jank (no layout thrash: transforms/opacity only)
- [ ] vitest (hook maths unit-tested), eslint, tsc pass

### BT-15 — Frontend: Work page
Role: Frontend · Size: M · Blocked by: Frontend: case-study diagrams

**Goal:** `/work` shows the header and four sticky-stacking case-study cards, the last pinning while the footer rises over it, with deep links to each card.

**Context:** `Work.dc.html` + `MWork.dc.html`; DESIGN.md §4 Case-study card. Data: `work.header`, `work.case_studies`.

**Scope**
- In: `features/work/components/WorkPage.tsx`, `CaseStudyCard` (`top: 104 + i×22` desktop / `72 + i×14` mobile; alternating surfaces; 640px 7/5 split alternating sides; number, years, title, headline, description, role, tags; metric box only when non-null; `id={slug}`), footer-over-last-card behaviour, `/work#<slug>` scroll-into-view. Vitest: metric hidden when null, anchor ids.
- Out: analytics `case_study_view` (Marketing).

**Done when**
- [ ] Screenshots/GIF at 1440 and 390 match; `/work#self-assessment` lands on card 03
- [ ] vitest, eslint, tsc pass

### BT-10 — Frontend: About conversation intro
Role: Frontend · Size: M · Blocked by: Frontend: app shell & design foundation

**Goal:** `/about` opens with the pinned conversation intro: the waving cut-out, the H1 and a chat that glides up with scroll and reveals every exchange before the page continues.

**Context:** `About.dc.html` + `MAbout.dc.html`; DESIGN.md §4 About conversation, §5 Chat glide. Data: `about.intro`, `about.conversation`.

**Scope**
- In: `ConversationIntro`: waving cut-out with bottom fade mask, H1 overlapping it (124→100px desktop pinned, 58→46px mobile), question pills (right-aligned ink) and answer cards (`--surface`, ink shadow), highlight phrases wrapped via `HighlightMark` from `highlights` (exact, case-sensitive, all occurrences, no HTML injection); pin for ≈100vh + 1500–1700px; 0.14 lerp glide; per-bubble opacity/translate (18–22px)/scale (.96→1) on entering the chat window; top fade mask; normal scroll afterwards. Static under reduced motion. Vitest: highlight wrapping (single, multiple, overlapping-free, no match), reduced-motion static render.
- Out: hobbies, "Where I've been" (sibling task; edit only `ConversationIntro` files plus its mount line in `About.tsx`).

**Preferences that apply**
- No hardcoded user-facing strings; sanitize — https://app.notion.com/p/3e4f4750980b81c3bd55f47deccc5544
- useRef for comparison values; useCallback for effect-dep handlers — https://app.notion.com/p/3e4f4750980b819285bbda0d46aa064b

**Done when**
- [ ] A scroll GIF at 1440 and 390 matches the mockups; all 3 exchanges are revealed before the page continues
- [ ] vitest, eslint, tsc pass

### BT-11 — Frontend: About hobbies & where I've been
Role: Frontend · Size: M · Blocked by: Frontend: app shell & design foundation

**Goal:** The About page's hobbies and "Where I've been" sections match the mockups on desktop and mobile.

**Context:** `About.dc.html` + `MAbout.dc.html`; DESIGN.md §4 Hobby card, "Where I've been" row. Data: `about.hobbies` (items, earlier_roles), `about.timeline`.

**Scope**
- In: `HobbiesSection` + `HobbyCard` (280px/160px wells; 4-column grid desktop, 190px horizontal swipe row mobile; lazy-loaded images; tints rotated sage → sand → paper-3 by index via a module-level constant; cut-outs bottom-aligned on tint, photos `object-fit: cover`; Sora 600 label) + the ink "Earlier" card; `WhereIveBeenSection` rows (green Sora year | company | role | mono dates, 16px radius; education dashed on transparent). Vitest: tint rotation, photo vs cut-out, education styling, lazy loading attribute.
- Out: the conversation intro (sibling task; edit only these components plus their mount lines in `About.tsx`).

**Preferences that apply**
- Mapping logic in module-level `Record<K, V>` — https://app.notion.com/p/3e4f4750980b8173a0a2d0fc3de53373

**Done when**
- [ ] Screenshots at 1440 and 390 match the mockups; the mobile hobby row swipes
- [ ] vitest, eslint, tsc pass

### BT-17 — Integrate: content
Role: Integration · Size: M · Blocked by: Backend: page shells, meta & bootstrap JSON; Frontend: Home section card stack; Frontend: Work page; Frontend: About conversation intro; Frontend: About hobbies & where I've been

**Goal:** The SPA runs on the real API and bootstrap (no mocks outside tests), and system specs prove each page's flows end to end.

**Scope**
- In: remove dev mocks from the runtime path (fixtures stay for Vitest); verify bootstrap `initialData` hydration (no refetch flash on first load); Capybara/Cuprite system specs: Home (greeting present, deck navigable, accordion link → `/work#slug`), Work (4 cards, anchors, metric hidden), About (chat messages visible, hobbies, timeline), nav between pages without full reload, contact menu, an API failure on client navigation shows the Retry panel (stub `/api/v1/work` to 500) and Retry recovers.
- Out: styling changes (report drift to the owning FE/BE task instead).

**Done when**
- [ ] `bundle exec rspec spec/system` green in CI; full suite green
- [ ] No contract drift (FE types and BE responses both validate against `spec/contracts/`)

### BT-12 — Creative: OG share image
Role: Creative · Size: S · Blocked by: Frontend: app shell & design foundation

**Goal:** A 1200×630 default share image in the site's style, at `public/og/default.png`.

**Scope**
- In: an HTML template using the tokens (paper background, Sora "Louis Freeman", "Senior Full Stack Engineer · London", logo mark, one green accent), rendered to PNG (headless Chrome/Playwright screenshot); keep the template in `docs/design/og/`. **Budget: 0 credits**, no paid generation. Draft PR; user creative review.
- Out: other imagery.

**Done when**
- [ ] `public/og/default.png` is 1200×630, <200 KB; the user approved it in creative review

### BT-18 — Marketing: analytics & SEO foundation
Role: Marketing · Size: M · Blocked by: Integrate: content; Creative: OG share image

**Goal:** Umami records the plan's key and supporting events (cookielessly, no banner), and the SEO foundation (sitemap, robots, meta, structured data) is complete and valid.

**Context:** plan §Measurement & SEO (implement exactly; propose changes in the report, don't add them).

**Scope**
- In: Umami Cloud script in the layout (`data-website-id` from `ENV["UMAMI_WEBSITE_ID"]`, absent → no script; `data-auto-track` handles SPA page views, verify it on client navigation); a typed `lib/analytics.ts` wrapper around `umami.track` (no-op when the script is absent); `contact_click` (method, location, page_type) and `case_study_view` (case_study_slug, source) per the tables; `docs/analytics/tracking-plan.md`; `sitemap.xml` (3 URLs) + `robots.txt`; verify the meta/OG/JSON-LD from the shell task (Rich Results-valid `Person`); the footer privacy note copy (what Umami collects, no cookies, link to Umami's privacy policy) in `en.ui`; Vitest for the event helpers; a system spec asserting the page sets no cookies other than Rails' session (if any) and no localStorage keys.
- Out: Umami account/website creation and Search Console verification (NEEDS USER ACTION at launch).

**Done when**
- [ ] Events fire with the right params (report the captured `umami.track` calls); no cookies or storage are written by analytics
- [ ] `/sitemap.xml` and `/robots.txt` served; JSON-LD validates
- [ ] suites + lint green

### BT-19 — Frontend: motion, accessibility & performance pass
Role: Frontend · Size: M · Blocked by: Integrate: content

**Goal:** The whole site meets the quality bar: reduced motion fully static, WCAG AA, Lighthouse mobile Performance ≥ 90 and Accessibility ≥ 95.

**Scope**
- In: audit every effect under `prefers-reduced-motion: reduce` (poster instead of video); keyboard walkthrough of all pages; contrast check; lazy-load hobby images; video poster/preload; font `display=swap`; cache headers verified; bundle size check (route-level code splitting if it helps); fix findings in the owning components. Report Lighthouse (mobile) for all three pages, run locally against a production build.
- Out: new features.

**Done when**
- [ ] Lighthouse mobile ≥ 90 performance and ≥ 95 accessibility on `/`, `/work`, `/about` (scores in the report)
- [ ] axe (via a system spec or Playwright) reports no serious/critical issues
- [ ] suites + lint green

### BT-20 — QA: release check
Role: QA (Release mode) · Size: M · Blocked by: all tasks above

**Goal:** Release QA across everything built for this plan: traceability to every goal, pixel comparison at 1440/390 against the handoff, preferences snapshot current, CI green.

**Done when**
- [ ] Release report with PASS / PASS WITH NOTES, or FAIL findings mapped to tasks

### BT-21 — DevOps: production deploy
Role: DevOps (Deploy mode) · Size: M · Blocked by: QA: release check

**Goal:** The site is live at https://louisfreeman.co.uk (www → apex) on Render Free with a seeded free Postgres, served over TLS.

**Scope**
- In: Render blueprint apply (free web + free DB, frankfurt); env vars (`RAILS_MASTER_KEY`, `UMAMI_WEBSITE_ID` when supplied); Cloudflare DNS-only records for apex + www; custom domains + TLS on Render; smoke test all pages + API. Every external/paid step is NEEDS USER ACTION with its cost ($0 now), and record the **free DB expiry date** and the upgrade path (Starter $7 + Basic DB ~$6) in the report.
- Out: the upgrade itself.

**Done when**
- [ ] `https://louisfreeman.co.uk`, `/work`, `/about` return 200 with correct meta; `https://www.louisfreeman.co.uk` redirects to apex
- [ ] The report states the DB expiry date and the next steps (Umami website ID, Search Console)
