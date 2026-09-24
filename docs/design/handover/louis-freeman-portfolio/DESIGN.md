# Louis Freeman Portfolio: Design Reference

This is the source of truth for colours, type, spacing, components and motion. The approved mockups are in `design-source/`. The copy is in `content/content.json`.

**Look and feel:** minimal and modern. A warm paper background, near-black ink and one forest-green accent. Sections behave like cards that stack on top of each other as you scroll. There are no gradients, no emoji, and nothing loud.

---

## 1. Colour

### Core palette

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F4F2EC` | Page background. **The hero video's background is matched to this colour.** |
| `--surface` | `#FBFAF6` | Card surface (primary) |
| `--surface-2` | `#EFEBE2` | Card surface (alternate); also the Capabilities section background |
| `--surface-3` | `#EAE6DC` | Diagram / media wells |
| `--surface-4` | `#E6E2D7` | Third card in a deck stack |
| `--ink` | `#17160F` | Primary text, borders on active/hover, dark pills |
| `--ink-2` | `#2A2923` | Bullet-list text |
| `--ink-3` | `#3E3C35` | Body copy / secondary text |
| `--muted` | `#5B584F` | Labels, captions, mono meta |
| `--line` | `#D6D1C4` | Default 1px borders / dividers |
| `--line-2` | `#CFC9BA` | Tag-chip borders |
| `--line-dash` | `#B9B2A0` | Dashed placeholder borders (metric boxes) |
| `--green` | `#2F5D45` | The only accent: links, year numerals, bullets, progress, "connect." |
| `--green-dark` | `#1F4232` | Link hover; text on the green tint |
| `--green-tint` | `#D7E4D6` | Highlighter "mark" behind key phrases |
| `--green-line` | `#B9C9BC` | Domain-chip borders; labels on dark cards |

### Hobby-card tints (behind the cut-out illustrations)

`#E2E9E1` (sage), `#ECE6D8` (sand), `#EAE6DC` (paper-3). Rotate through them in that order.

### Shadows and overlays (always ink-based, never grey or black)

- **Card lift on hover:** `0 26px 40px -30px rgba(23,22,15,.5)`
- **Active deck card:** `0 34px 60px -44px rgba(23,22,15,.55)`
- **Stacked section card (the upward shadow as it slides over):** `0 -34px 70px -46px rgba(23,22,15,.5)`
- **Nav pill once scrolled:** `0 18px 40px -26px rgba(23,22,15,.45)`
- **Nav pill fill:** `rgba(244,242,236,.82)` with `backdrop-filter: blur(16px) saturate(1.4)`
- **Covered-card darkening:** an ink overlay at `opacity: progress × 0.22`, applied only while the next card physically overlaps it.
- **Big faint company watermark:** `rgba(23,22,15,.05)`

### Contrast

Body text on paper uses `--ink-3`. Labels use `--muted`, never lighter than that. The green on paper passes AA for text at 16px and above.

---

## 2. Typography

| Role | Family | Weights | Source |
|---|---|---|---|
| Display / headings | **Sora** | 500, 600 | Google Fonts |
| Body / UI | **Karla** | 400, 500, 600, 700 | Google Fonts |
| Mono / tags / meta | **JetBrains Mono** | 400, 500 | Google Fonts |

```
https://fonts.googleapis.com/css2?family=Sora:wght@300..800&family=Karla:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
```

Stacks: `'Sora','Helvetica Neue',sans-serif` · `'Karla','Helvetica Neue',sans-serif` · `'JetBrains Mono',ui-monospace,monospace`

### Scale (desktop → mobile)

| Style | Desktop | Mobile | Spec |
|---|---|---|---|
| Hero greeting (typed) | 88px | 44px | Sora 500, line-height 1.02, letter-spacing −0.025em, `text-wrap: balance` |
| About H1 | 124px (100px when pinned) | 58px (46px pinned) | Sora 600, lh .9, ls −0.055em |
| Page H1 ("Work") | 96px | 64px | Sora 600, lh 1, ls −0.05em |
| Section H2 | 80px (Selected work / What I do), 48–60px elsewhere | 40px | Sora 600, lh 1.02, ls −0.04em |
| Footer "Let's connect." | 128–168px | 64px | Sora 600, lh .92, ls −0.05em; "connect." in green |
| Card title | 38–42px | 26–30px | Sora 600, lh 1.02–1.04, ls −0.035em |
| Card sub / role | 18px | 15px | Sora 500, lh 1.35, colour `--ink-3` |
| Lead / summary (sparse cards) | 26px | 14.5–15px | Sora 500, lh 1.4, ls −0.015em |
| Body | 16–17px | 14.5–15.5px | Karla 400, lh 1.55–1.65, colour `--ink-3` |
| Bullets | 14.5px | 14px | Karla, lh 1.5, colour `--ink-2`, 6px green dot |
| Label / kicker | 11px | 10.5px | Sora 600, uppercase, letter-spacing .16em, colour `--muted` |
| Mono meta | 11–12px | 11.5px | JetBrains Mono 400, uppercase where used as a label (.14em) |
| Stack ticker | 60px (40px ≤900px) | 30px | Sora 600, ls −0.03em |

---

## 3. Layout and spacing

- **Desktop canvas:** 1440px. 64px side padding. 12-column grid, 24px column gap.
- **Mobile:** 390px design width. 16px side padding. Single column, content max-width 430px.
- **Section padding:** desktop 110–130px vertical; mobile 64px.
- **Gaps:** 8 / 10 / 12 / 14 / 16 / 18 / 22 / 24 / 28 / 32 / 48 / 56px. Use a 2px-step scale; 8, 16, 24 and 48 are the workhorses.
- **Radii:**
  - 999px: pills, buttons, chips
  - 12px: small wells
  - 16px: rows, media
  - 20–24px: cards
  - 28–32px: case-study cards
  - 44px: top corners of stacked section cards (desktop); 32px on mobile
- **Borders:** always 1px. `--line` by default and `--ink` for active/hover. Dashed borders mark placeholders and education.
- **Touch targets:** at least 44px (buttons 48–54px tall).

---

## 4. Components

### Nav pill (all pages)
- A sticky, centred, floating pill with no bar behind it. It holds: logo mark (home link), Work, About, and a **Contact** button.
- The current page is an ink-filled pill; the logo uses a 9% ink tint when you're on Home.
- **Contact, desktop:** toggles `aria-expanded` and slides out Email · LinkedIn ↗ · GitHub ↗ inline (max-width transition, .55s).
- **Contact, mobile:** opens a dropdown card below the pill with the same three links.
- The pill gains a shadow once the page scrolls past 12px.

### Buttons
- **Primary:** ink fill with paper text; hover turns it green.
- **Ghost:** 1px ink border; hover fills it with ink.
- Height 54px (48px small), radius 999px, Karla 500 16px. The `→` arrow nudges 4px on hover.

### Tag chip
- JetBrains Mono 12px, padding 8px 12px, 1px `--line-2` border, radius 999px.
- **Dates variant:** ink border and ink text.
- **Domain variant:** `--green-line` border with `--green-dark` text.

### Highlight mark
A green highlighter band behind key phrases in body copy:
`background: linear-gradient(transparent 62%, #D7E4D6 62%, #D7E4D6 94%, transparent 94%); font-weight: 600`

### Hero (Home)
- The looping video sits right of centre, 820px wide on desktop and 358px on mobile, cropped slightly at the top.
- The video background is `#F4F2EC`, plus a soft edge mask:
  - **Desktop:** fade the top ~15% and the side 14%, plus a short fade below the feet.
  - **Mobile:** top 5→17%, bottom 93→99%, sides 13%.
- **Typed greeting**, bottom-left:
  - The prefix "Hi, I'm " cycles through `greetingEndings`.
  - It types at 60–140ms per character, holds for 2.4s, then deletes at 34ms per character.
  - The caret is a 3px green bar that blinks while holding.
  - It never overlaps the figure; long lines wrap.
- Below the greeting: the tagline, plus a "Scroll" cue on the right with an animated 1px line.
- Keep a visually hidden full sentence for screen readers.

### Experience card deck (Home)
- **Desktop:** a sticky stage.
  - Left column: the "Experience" heading, the large green year, and a list of company names (the active one has a green bar).
  - Right: a stack of 6 cards, 640px tall.
  - Scroll progress flips cards. The top card is solid with an ink border; the next two peek through, offset 20/22px and 40/44px, on `--surface-2` and `--surface-4`.
  - Cards you've passed fly up and out at −118% with a −4° rotation.
- **Mobile:** a 600px deck.
  - Swipe, or tap the ← → buttons (48px).
  - A progress bar and a "01 / 06" counter show position.
  - It autoplays every 4.2s until the visitor interacts.
- **Card contents:**
  - Top: dates chip, company, role.
  - Middle: summary, and "Time there" (only on sparse cards).
  - Bullets: up to 3 on mobile.
  - Bottom: badges (and subs such as promotion dates on desktop).
- **Faint watermark:** the company name (or `mark`, e.g. "UON") sits at 172px on desktop and 96px on mobile, 146px/74px when the name is over 8 characters. It's anchored bottom-right, bleeds off the card edge and sits behind the content.
- **Sparse cards** (fewer than 3 highlights) set the summary at lead size so the card doesn't look empty.

### Selected work: accordion gallery (desktop Home)
- Four panels in a row, 600px tall. Closed panels show a number and a vertical title.
- The open panel grows (`flex-grow: 6`), turns `--surface`, and reveals the diagram (scaled .8), meta, title, headline, tags and a "Read case study →" ghost button.
- Hover or focus opens a panel. It autoplays every 4.5s until the visitor interacts.
- **On mobile** this becomes stacked cards: diagram well → meta → title → headline → tags → button.

### Case-study card (Work page)
- Each card is sticky, and the cards stack as you scroll: `top: 104 + i×22px` on desktop and `72 + i×14px` on mobile.
- Backgrounds alternate `--surface` and `--surface-2`.
- **Desktop:** 640px tall, a 7/5 split between diagram and text, with sides alternating per card.
- **Contents:**
  - Number and years
  - Title
  - Headline (Sora 500)
  - Description
  - Role
  - Tags
  - **Metric placeholder:** a dashed box. Real metrics are still TBC.
- **End of list:** the last card stays pinned while the footer slides up over the stack as a rounded card.

### Diagrams (`Viz*.dc.html`)
- Four 720×440 illustrated diagrams, built in HTML/SVG. Keep them as inline SVG/HTML components, not images.
- They sit on `--surface-3`, using a 24px grid or dot pattern, 1px ink strokes and green for the key path.
- A mono caption reads "FIG. 0X — …".
- Scale them to fit their well: .49 on mobile, .8–1.08 on desktop.

### Capability card
- Centred content on `--surface`, 20px radius.
- Sora 600 title (26px desktop / 22px mobile), with a centred chip cloud underneath.
- On desktop the four cards sit in a row. On mobile they're sticky-stacked.
- A "Domain" box (bordered, no fill) holds green-tinted chips.
- **Stack ticker:** an infinite marquee (70s desktop / 50s mobile) with diamond separators and faded edges. It pauses on hover.

### About: conversation intro
- A large transparent cut-out of Louis waving sits on the right, with a bottom fade mask. The H1 overlaps it.
- Chat:
  - **Question bubbles:** right-aligned ink pills.
  - **Answer bubbles:** `--surface` cards with an ink shadow and the highlight mark on key phrases.
- **Scroll behaviour, desktop and mobile:**
  - The intro pins for about 100vh + 1500–1700px of scroll.
  - The conversation list translates up with scroll, eased with a 0.14 lerp per frame.
  - Each bubble fades and rises in (opacity 0→1, 18–22px → 0, scale .96→1) as it enters the chat window, which has a top fade mask.
  - Once the last message is in, the page continues.

### Hobby card
- Illustration well 280px tall on desktop, 160px on mobile. Transparent cut-outs sit bottom-aligned on a tint; photos are `object-fit: cover`.
- The label is Sora 600.
- **Desktop:** 4-column grid. **Mobile:** a horizontal swipe row of 190px cards.
- An ink "Earlier" card lists the Wimbledon and Rio 2016 roles.

### "Where I've been" row
- A grid of year (green Sora) | company | role | mono dates, on 16px-radius cards.
- Education uses a dashed border on a transparent background.

### Footer
- "Let's connect." in huge type, with "connect." in green.
- An underlined email link, plus LinkedIn ↗ and GitHub ↗ ghost pills.
- The blurb sits on the right on desktop and below on mobile.
- Bottom row: logo, © 2026 Louis Freeman, "Back to top ↑".

---

## 5. Motion

All motion must respect `prefers-reduced-motion: reduce`. When it's set, turn animation off and show everything statically.

| Effect | Spec |
|---|---|
| Page enter | Content (not the nav) fades up from 28px plus a 6px blur, over .9s `cubic-bezier(.2,.7,.2,1)`, staggered .12s per section |
| Section card stack (desktop Home) | Each section is `position: sticky`, with `top = min(0, vh − sectionHeight)` so tall sections scroll fully before pinning. The next section slides over it; the covered section darkens only while overlapped. The hero never darkens; it drifts and fades instead (translateY up to 180px, scale to .9, opacity to 0). |
| Deck flip | transform .8s `cubic-bezier(.2,.8,.2,1)`, opacity .6s |
| Accordion | flex-grow .8s; body fades in after a .3s delay |
| Card hover | translateY(−6px) and the shadow over .45s; the border turns ink |
| Chat glide | Scroll-linked with 0.14 lerp smoothing and per-bubble opacity/translate |
| Nav contact slide-out | max-width .55s `cubic-bezier(.2,.8,.2,1)`, opacity .3s |
| Easing house style | `cubic-bezier(.2,.7,.2,1)` for entrances, `cubic-bezier(.2,.8,.2,1)` for UI transitions |

---

## 6. Accessibility

- Include a skip link, hidden until focused.
- Use real `<button>`s for toggles with `aria-expanded`. The deck and accordion are keyboard-reachable.
- The focus ring is a 2px green outline with a 3–4px offset.
- The typed greeting has a static screen-reader sentence. Decorative watermarks and the ticker are `aria-hidden`; the ticker gets a summary `aria-label`.
- Diagrams use `role="img"` with a descriptive `aria-label`.
- All video is muted, looping and `playsinline`, with a poster frame. With reduced motion, show the poster instead.

---

## 7. Assets

| File | Use | Blob id in `design-source` |
|---|---|---|
| `assets/logo-mark.png` | Nav + footer logo | `fdb51469796b01eb2b9a5f74f75d9dd9` |
| `assets/hero.mp4` (1080², ~1.3 MB, bg `#F4F2EC`, BT.709/sRGB) | Home hero loop | `c864ef3237f8f0e0a81ec2ee3954d363` |
| `assets/hero-poster.jpg` | Hero poster / reduced-motion still | `dc53cadcce8ff630c8dd5405dc83ec48` |
| `assets/louis-waving.png` (transparent) | About intro | `d6c0cdcbc723b81048d5fb9da1469eaa` |
| `assets/hobbies/rugby.png` | Hobby card | `bf87d27c47c10565b343d7fe7d401a99` |
| `assets/hobbies/golf.png` | Hobby card | `8ddb44cf289f1cc388c8aba2e274bce7` |
| `assets/hobbies/football.jpg` (photo) | Hobby card | `8eb3c596f21baf349510f76f6acf9edd` |
| `assets/hobbies/surfing.png` | Hobby card | `809af02536fc97586e72804cf0c5a688` |
| `assets/hobbies/cooking.jpg` (photo) | Hobby card | `04eecf4335e73b7ff2b14f1a2a87f1c6` |
| `assets/hobbies/photography.png` | Hobby card | `0133370f8d9342373d47e8d43fcd170c` |
| `assets/hobbies/travelling.png` | Hobby card | `c42687b9a876e0b8053037d9087ae087` |

`design-source` files reference these as `/_blob/<id>`, which you should swap for the local paths above.

## 8. Still to fill in

- A real metric for each case study (dashed "Metric" boxes).
