# Build brief for Claude Code

You're building Louis Freeman's personal portfolio from finished, approved designs. Treat the design as final. Your job is a faithful, production-quality implementation, not a redesign.

## Read first
1. `DESIGN.md`: tokens, type, components, motion, accessibility and assets. This is the spec.
2. `content/content.json`: every piece of copy, the experience entries, case studies and About content. It's the seed data for the database (see "Content model").
3. `design-source/*.dc.html`: the approved mockups, for layout, exact values and behaviour.
   - They're HTML with `{{holes}}`, `<sc-for>` and `<sc-if>` template tags, plus a `class Component extends DCLogic` script that holds the interaction logic. Read them as reference, not as code to copy verbatim.
   - `Main` = Home, `Work` = Work, `About` = About.
   - `MHome`, `MWork` and `MAbout` = the mobile (390px) versions.
   - `Viz*` = the four case-study diagrams.
   - `Main.dc.html` contains some leftover CSS and a typeface switcher from earlier explorations (for example `.tl-*` timeline classes, `.read-cursor`, and the `TYPES` map). Ignore these. The final fonts are Sora + Karla + JetBrains Mono.
   - Asset references appear as `/_blob/<id>`. Map them to `assets/` using the table in DESIGN.md §7.

## Stack
- **Ruby on Rails 8**: routing, controllers, data, and one deployable app.
- **Inertia.js** (`inertia-rails` gem + `@inertiajs/react`): each page is a React component rendered by a Rails controller. There's no separate API and no client router.
- **React 18 + TypeScript**, bundled with **Vite** (`vite_ruby` / `vite_rails`).
- **PostgreSQL** for content (SQLite is fine for local development if preferred).
- **Styling:** plain CSS with custom properties for the tokens in DESIGN.md, in one `tokens.css` plus per-component CSS modules or plain CSS files via Vite. No UI kit and no Tailwind, so the design stays exact.
- **Fonts:** Google Fonts `<link>` in the Inertia root layout (Sora, Karla, JetBrains Mono), with `preconnect`.
- **Animation:** no library needed. Use CSS plus small `requestAnimationFrame` scroll hooks in React. Framer Motion is acceptable if it makes the scroll-linked pieces cleaner.
- **Tests:** RSpec for models and requests; Vitest + Testing Library for the interactive React components (the deck, the accordion and the contact menu).

## Project structure (suggested)
```
app/
  controllers/pages_controller.rb      # home, work, about → render inertia: "Home" / "Work" / "About"
  models/experience.rb, case_study.rb, capability.rb, hobby.rb, chat_message.rb, site_setting.rb
  frontend/
    entrypoints/application.tsx        # Inertia createInertiaApp
    pages/Home.tsx, Work.tsx, About.tsx
    components/
      Nav.tsx, Footer.tsx, PageEnter.tsx
      home/Hero.tsx, TypedGreeting.tsx, ExperienceDeck.tsx, WorkAccordion.tsx,
           WorkStackMobile.tsx, Capabilities.tsx, StackTicker.tsx
      work/CaseStudyCard.tsx
      about/ConversationIntro.tsx, HobbyCard.tsx, WhereIveBeen.tsx
      diagrams/VizCards.tsx, VizIdentity.tsx, VizTax.tsx, VizAI.tsx
      shared/Tag.tsx, Button.tsx, Card.tsx, HighlightMark.tsx
    hooks/useScrollProgress.ts, useStickyStack.ts, useReducedMotion.ts, useMediaQuery.ts
    styles/tokens.css, base.css
  views/layouts/application.html.erb   # Inertia root, fonts, meta
app/assets/ or public/                  # logo, hero.mp4 + poster, waving cut-out, hobbies (from assets/)
db/seeds.rb                            # loads content/content.json
```

## Content model
Seed everything from `content/content.json` so Louis can edit copy without touching components:
- `Experience`:
  - company, role, dates_label, year_label, summary
  - highlights (array/jsonb), tags (array/jsonb), subs (jsonb)
  - duration_label (`len`), watermark (`mark`, e.g. "UON"), education (bool), position
- `CaseStudy`: number, title, years, headline, description, role, tags, diagram_key, metric (nullable), position
- `Capability`: title, items, position. Store the domain chips and the stack ticker in `SiteSetting` or as their own simple records.
- `ChatMessage`: question, answer (the answer allows the `<mark>` highlight spans), position
- `Hobby`: name, image, photo (bool), tint, position
- `SiteSetting`:
  - name, role, location, email, linkedin, github, footer_blurb
  - greeting prefix and endings
  - section intros, the "Earlier" lines

Controllers pass plain JSON props to Inertia. The React pages stay presentational.

**Optional, later:** a simple password-protected `/admin` (Rails basic auth or `http_basic_authenticate_with`) with forms for these models. Don't build it in the first pass unless Louis asks.

## Routes
- `GET /` → `pages#home` → `Home`: Hero → Experience deck → Selected work → What I do → Footer
- `GET /work` → `pages#work` → `Work`: header plus four sticky-stacked case-study cards; the footer slides over the last card
- `GET /about` → `pages#about` → `About`: pinned conversation intro → hobbies → "Where I've been" → Footer
- Nav links use Inertia `<Link>`, so page changes are client-side and the page-enter animation plays.

## Responsive
- One responsive site, not separate mobile pages. Use the desktop designs from about 1024px upward and the mobile designs (`M*.dc.html`) below about 768px. Interpolate sensibly in between.
- The mobile-specific patterns are:
  - The Experience deck is swipe/tap with autoplay.
  - Selected work becomes stacked cards instead of the accordion.
  - Capabilities cards stack.
  - Hobbies become a horizontal swipe row.
  - The nav Contact becomes a dropdown.

## Behaviours to get right (details in DESIGN.md §4–5)
1. **Typed greeting** cycles the endings, with a caret, and never overlaps the hero figure.
2. **Hero video** autoplays, is muted, loops and plays inline. Retry `play()` if autoplay is refused. It has a soft edge mask, and its background must match `--paper` exactly.
3. **Home sections stack like cards.**
   - Each section is sticky, with `top = min(0, viewportHeight − sectionHeight)`.
   - The next section slides over it with a rounded top and an upward shadow.
   - The covered section darkens only while it's actually overlapped.
   - The hero fades and drifts instead of darkening.
4. **Experience deck:**
   - **Desktop:** scroll-driven inside a sticky stage, plus a clickable company list.
   - **Mobile:** swipe, ← → buttons, progress bar and a counter.
5. **Selected work accordion** on desktop opens on hover, focus or click, and autoplays until the visitor interacts.
6. **Work page:** the case-study cards sticky-stack; the last card pins and the footer rises over it.
7. **About conversation:**
   - The intro pins.
   - The chat list glides up with scroll, using lerp smoothing, and each bubble fades in as it enters.
   - After that, normal scrolling resumes.
8. **Page transitions:** content eases in on each Inertia visit, and the nav stays put. Reset scroll to the top on navigation.
9. **Reduced motion:** every effect above turns off, and everything shows statically.

## Quality bar
- The build should be pixel-close to the mockups at 1440px and 390px.
- Semantic HTML, a skip link, visible focus rings, and keyboard-operable deck and accordion. Target WCAG AA contrast.
- Lighthouse aims: Performance ≥ 90 and Accessibility ≥ 95 on mobile.
  - Lazy-load the hobby images.
  - Give the video a poster.
  - Serve assets with cache headers.
- Page titles and meta descriptions per page; Open Graph image optional.
- The only open placeholders are the case-study metrics (`metric: nil`). Keep the dashed placeholder until Louis supplies them.

## Deploy
Use Rails 8 defaults: Kamal to a small VPS, or Render/Fly.io if simpler. Ask Louis which he prefers before setting it up. Use Postgres in production.

## Suggested order
1. `rails new` (Postgres, skip default JS), then add `vite_rails`, `inertia-rails`, React + TypeScript and RSpec. Confirm a hello-world Inertia page renders.
2. Models, migrations and `db/seeds.rb` from `content/content.json`, with request specs for the three pages.
3. Tokens, fonts, base CSS, layout, nav and footer.
4. The static pages at desktop and mobile, with no motion.
5. The interactions: typed greeting, deck, accordion, contact menu. Add Vitest specs for these.
6. The scroll effects: section stacking, Work stacking/pin, About chat.
7. The reduced-motion, accessibility and performance pass.
8. Compare against the mockups side by side. Then set up deploy.
