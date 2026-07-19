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
- `src/data.js` — eras (piecewise axis: per-era pixel width) + core philosopher records; merges `details.js` and computes reverse `influenced` links
- `src/details.js` — long-form content per thinker: bio, titled key ideas, major works, legacy (schema test-enforced)
- `src/layout.js` — pure positioning (clamp, 14px min gap, 4-lane cycling); tested
- `src/Timeline.jsx` / `src/DetailPanel.jsx` / `src/App.jsx` — UI; the detail entry renders inline BELOW the strip (owner rejected the pop-out drawer — keep it inline)
- `public/portraits/<id>.png` — engraved portraits, one per philosopher (test-enforced)

## Commands
- `npm run dev` — dev server; `npm test` — Vitest (keep green); `npm run build` — prod build

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
- Claude Code Browser pane reports `visibilityState: "hidden"` → smooth-scroll
  animations don't play there. Verify scrolling with `behavior:'instant'` in
  devtools; the app code is correct — don't "fix" it.
- Open: mobile/vertical layout, keyboard a11y for nodes (currently divs),
  portrait webp compression (~96MB of PNGs), deploy target, v2 traditions.
