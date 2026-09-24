# Louis Freeman Portfolio: handoff pack

This folder is everything Claude Code needs to build the site from the approved designs.

```
BUILD_BRIEF.md      ← what to build, stack, behaviours, quality bar (Claude Code reads this first)
DESIGN.md           ← design reference: colours, type, spacing, components, motion, assets
content/content.json← all copy and data (experience, case studies, About, capabilities, links)
design-source/      ← the approved mockups from the design canvas (desktop + mobile + diagrams)
assets/             ← logo, hero video + poster, waving cut-out, hobby illustrations
```

## How to use it with Claude Code

1. Unzip this folder somewhere, for example `~/code/louis-freeman-portfolio-design`. Keep it next to where the Rails app will live, or let Claude Code create the app inside it and move these files into a `docs/design/` folder.
2. Open a terminal in that folder and run `claude`.
3. Paste this first message:

   > Read BUILD_BRIEF.md and DESIGN.md, then look through content/content.json and design-source/. Build the portfolio as a Rails 8 + Inertia.js + React (TypeScript, Vite) app, as described. Start by proposing the project structure and plan, then work through the "Suggested order" section, checking in after each step.

4. Work in steps, and ask it to run the dev server and compare against the mockups as it goes. Your design canvas on claude.ai is still the visual reference, and screenshots from it pasted into Claude Code work well when something looks off.
5. Optional: once the project exists, ask Claude Code to write a `CLAUDE.md` that summarises these conventions (tokens, content location, motion rules). Future sessions will then pick them up automatically.

## Still to add
- A real metric for each case study (`metric` in `content.json`).
