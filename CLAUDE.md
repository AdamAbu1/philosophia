# Philosophia — interactive timeline of philosophy

Personal learning app: horizontally scrolled, piecewise-scaled timeline of Western
philosophy (48 thinkers), era bands, detail drawer with influence-chip jumps.

## Product rules
- **No quiz / no test mechanics — by explicit owner decision.** This is a
  knowledge-expansion tool, not an assessment tool. Do not reintroduce scoring,
  streaks, or right/wrong flows.
- Schema is global-ready: `tradition` field + reserved bottom lane are the
  extension points for Chinese / Indian / Islamic tracks (v2). Western-only until then.

## Structure
- `src/data.js` — eras, core philosopher records + birthplace coords (PLACES); merges `details.js`, computes reverse `influenced` links
- `src/details.js` — long-form content per thinker: bio, titled key ideas, major works, legacy (schema test-enforced)
- `src/geo.js` — pure globe helpers (era-for-year, frontside check, same-city fan-out, jump-year rule); tested
- `src/Globe.jsx` — THE main view: engraved orthographic globe rendered to CANVAS (d3-geo canvas path + bundled `assets/land-110m.json`). Rendering is imperative and event-driven: rotation/zoom live in refs, handlers call draw() directly (no React render per frame — do not convert the map back to SVG/React elements; SVG re-rasterization was the perf bottleneck). rAF loop drives only spin/play/tween. Points hit-test on click (nearest within radius). Selection draws great-circle influence arcs (dashed = drew from, solid = shaped) with dashed rings on connected points. ALL 48 points visible by default ("All time"); wheel/dblclick/buttons zoom (1–8×, portrait mini-medallions at zoom ≥3, names ≥4); the scrubber is a LENS, not a gate — scrubbing/play highlights the then-living and fades the rest, "all time ✕" chip resets. Owner decisions, in order: timeline strip removed for the globe; time then demoted from gate to lens. Click-vs-drag uses a 3px movement threshold WITHOUT pointer capture — capturing on pointerdown retargets pointerup and eats point clicks; don't reintroduce it.
- `src/Lifeline.jsx` — the "timeline, somewhere else": engraved strip in each entry (lifespan vs eras, influences above / heirs below as clickable jump dots)
- `src/DetailPanel.jsx` / `src/App.jsx` — the entry renders inline BELOW the globe (owner rejected pop-out drawer — keep it inline)
- `src/search.js` / `src/SearchBox.jsx` — ranked, diacritic-folded search (name/alias > school > place > era > works > ideas); "/" focuses; picking a result selects + flies the globe
- `src/agent.js` / `src/AgentPanel.jsx` — "Ask Philosophia" conversational agent (tested). **BYOK by owner decision**: user's Anthropic key in localStorage, browser→api.anthropic.com direct (`@anthropic-ai/sdk`, `dangerouslyAllowBrowser`) — the site is static, there is NO proxy backend; don't add one unasked. Two modes: resident guide (grounded via per-turn retrieval over search.js — persona/selection/last-cited/query-matched records ride in `<records>` on the user turn, system prompt holds rules + full roster) and persona chat (entered via "Converse with X" button in DetailPanel). Replies use the `[[id]]` marker protocol → clickable chips that select + fly the globe; unknown ids render literally; half-streamed markers hidden. Default model `claude-opus-4-8` (picker: sonnet-5, haiku-4-5; haiku gets NO thinking param — pre-adaptive). max_tokens 8000 = deliberate cost guard. The agent must never quiz — enforced in the system prompt; keep it that way.
- `src/format.js` — date formatting
- `public/portraits/<id>.png` — engraved portraits, one per philosopher (test-enforced)

## Commands & deployment
- `npm run dev` — dev server; `npm test` — Vitest (keep green); `npm run build` — prod build
- LIVE at https://adamabu1.github.io/philosophia/ — every push to main auto-deploys via
  .github/workflows/deploy.yml (runs tests first; public repo AdamAbu1/philosophia, SSH remote).
  Portraits are committed as ~400KB JPEGs; full-res originals live OUTSIDE the repo in
  ~/Desktop/Philosophy-portrait-originals (96MB of PNGs were purged from git history —
  don't recommit them). Installable on phones (manifest + icons; Socrates is the app icon).

## Portraits (Higgsfield MCP)
Generated 2026-07-19, model `nano_banana_pro`, 2 credits/image, aspect 3:4.
When adding a philosopher, reuse this exact style template so the set stays uniform:

> Antique copperplate engraving portrait of {NAME} ({DATES}), {one-line physical
> descriptor}. Bust-length, three-quarter view. Fine cross-hatching and stipple
> shading, black ink on aged cream paper, 19th-century encyclopedia illustration
> style. Plain background with subtle oval vignette framing. No text, no caption,
> no border, no signature.

For ancients with no surviving likeness, describe a dignified era-appropriate
archetype; for post-1400 figures the model knows the historical faces.

## Known quirks / open items
- Claude Code Browser pane reports `visibilityState: "hidden"` → requestAnimationFrame
  is suspended there, so idle spin, the play sweep, and the rotate-to-selection tween
  don't animate in the pane. Scrubbing and clicking still work (event-driven). The app
  code is correct — verify animations in a real browser; don't "fix" them.
- Open: keyboard a11y for globe points, portrait webp compression (~96MB of PNGs),
  deploy target, v2 traditions (Chinese · Indian · Islamic points on the same globe).
