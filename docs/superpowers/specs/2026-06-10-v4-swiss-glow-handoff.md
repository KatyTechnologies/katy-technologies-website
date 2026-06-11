# V4 — "Swiss Glow" — Session Handoff

Date: 2026-06-10
Branch: `redesign/awwwards-landing` (PR #2)
Status: **Not started.** This doc is the brief for the next session.

## The ask (verbatim intent)

Harsha reviewed the 5 design-lab concepts and chose a **combination**:

> "I like the typography of [05 Swiss Ops] but the 3D glowing stuff from the first one
> [the main-site V3 glowing path]. Combine those two."

So V4 = **Swiss Ops brutalist typography** rendered **over the V3 Three.js glowing-path
valley scene**. Loud International-Typographic type sitting on the cinematic dark 3D world.

## What to take from each source

### From the V3 main site (already live at repo root, `localhost:8000`)
Files: `index.html`, `css/landing.css`, `js/story-field.js`.
- **`js/story-field.js`** is the keeper — the Three.js scene: dark valley terrain (`ridgeNoise`
  + vertex colors), a glowing electric-blue path (`CatmullRomCurve3` → `TubeGeometry` core +
  halo, `UnrealBloomPass`), flowing particles + ambient dust on round sprites, camera flies
  along the curve tied to scroll progress over `.story`, pointer parallax, fog so the path
  fades into the dark (the "no white blowout" fix), aspect-aware side offset for portrait,
  IntersectionObserver visibility gating, `no-webgl` fallback.
- Fixed canvas (`#story-canvas`, `position:fixed; z-index:0`) behind transparent scroll
  sections (`z-index:1`). Header is a **soft top gradient fade**, no bar (last fix Harsha asked
  for). Readability **veil band** behind chapter copy (`.chapter::before`, dark gradient that
  clears at section edges). Manifesto is **dark** now (paper section removed — Harsha said the
  white "came out of nowhere"; keep the whole site one dark world).
- Palette accents: electric blue `#7CC4FF` / `#2E7CFF` (Harsha explicitly approved breaking the
  brand "no neon glow" rule for this — keep it; it's a user override, flagged on the PR).

### From design-lab/05-swiss-ops (`localhost:8005`, single self-contained `index.html`)
Take the **type system + layout language**, NOT its flat color panels:
- Viewport-filling Work Sans **700**, uppercase, tight leading **0.92**, stacked hero lines
  ("AUTOMATE / THE WORK / THAT SLOWS / YOUR TEAM / DOWN.").
- **Exposed 12-column hairline grid** overlay (1px, ~8% opacity) — but tune opacity so it reads
  over the 3D scene without fighting the glow (try blue-tinted hairlines `rgba(124,196,255,.10)`).
- **Oversized half-cropped section numerals** (01–06) bleeding off panel edges, parallaxed.
- **Kinetic type**: hero lines slide in from alternating sides; headline letter-spacing scrubs
  tighter as you scroll past; numerals parallax at a different speed than text.
- **Marquee bands** ("MAP · NAME · ROUTE · TRUST ·") between/over sections — keep, but make them
  translucent so the glow shows through; pause under reduced-motion.
- **Hard-cut row inversions** on services (instant blue/white, no transition — very Swiss).
- **Blue shock CTA panel** — keep as the one fully-opaque electric-blue moment (gives the eye a
  rest from the dark scene and matches the path accent).
- Hard-cut 3-flash preloader (navy → blue → paper → content) OR keep V3's 0→100 counter —
  pick one; lean Swiss flash to match the type energy.

## How they combine (the actual design)

1. **Hero** — giant stacked uppercase Swiss headline over the glowing valley; the path threads
   up behind/between the type lines. Kinetic slide-in on the lines. 12-col hairlines + cropped
   "01" numeral. One-liner in the corner, dual CTAs.
2. **Method (the spine)** — keep V3's scroll-flythrough: camera travels the path through four
   beats, BUT each beat is now a **Swiss panel** — massive numeral + uppercase title + short
   copy + the small line-diagram fragment, sitting in a veil band over the scene. Decide:
   either V3's smooth fly-through (chapters fade through) OR Swiss curtain-wipe panels pinned
   over the scene. **Recommendation: keep the fly-through** (the camera-on-path IS the wow);
   layer Swiss type treatment on top rather than re-introducing pinned clip-path wipes, which
   would fight the continuous camera move. Marquee band as a transition between method end and
   services.
3. **Manifesto** — "Automation should make work easier to trust, not harder to explain." Dark,
   word-by-word scrub (from V3), but set in larger Swiss-ish display.
4. **Services** — full-width index rows with giant numerals; hard-cut blue invert on hover;
   opaque dark background (hands off cleanly from the fixed canvas — set the canvas to pause /
   the section to be opaque so GPU rests).
5. **Field notes** — strict table (year / client / note), hairline rules.
6. **CTA** — the electric-blue shock panel, "READY TO FIND THE SLOW HANDOFF?", white-bordered
   button → `/contact`.
7. **Footer** — navy, giant cropped "KATY TECHNOLOGIES" wordmark, link grid.

## Build approach

- Cleanest path: **fork the V3 root files** (`index.html` + `css/landing.css` + `js/story-field.js`
  + `js/landing.js`) and re-skin the type/layout to Swiss, keeping the WebGL module intact.
  Pull the exact type scale, hairline grid, numeral, marquee, and row-invert CSS from
  `design-lab/05-swiss-ops/index.html`.
- Keep `js/story-field.js` essentially as-is; it already solves the hard problems (fog, fallback,
  portrait offset, perf gating). Only retune the path curve/colors if the new type composition
  wants the glow in a different place.
- Decide where V4 lives: probably **replace the root site** (it's the chosen direction) once
  approved, but build it first as `design-lab/06-swiss-glow/` for side-by-side review, then
  promote. Reuse logos already copied into the lab folders.

## Open decisions for Harsha (ask at session start)

1. Fly-through camera (recommended) vs. Swiss pinned curtain-wipes for the method — or a hybrid?
2. Preloader: Swiss 3-flash vs. V3 0→100 counter?
3. Does V4 replace the root homepage, or live alongside as a 6th lab entry first?
4. Keep the electric-blue glow, or pull it toward brand slate for a more on-spec version?

## Current repo state (for the next session)

- **Branch:** `redesign/awwwards-landing`, PR #2 (https://github.com/KatyTechnologies/katy-technologies-website/pull/2). All work lands here via PR per Harsha's hard rule — never commit to `main`.
- **Root site = V3** (glowing path, dark, blended header/manifesto). This is the current
  "real" homepage. Local preview: `python3 -m http.server 8000` then `localhost:8000`.
- **`design-lab/01..05`** = the five concept variants, each a self-contained `index.html`
  (04-flow-field also has `scene.js`). Served on ports 8001–8005:
  01 Assembly Line · 02 Terminal · 03 Paper Trail · 04 Flow Field · 05 Swiss Ops.
  Harsha is keeping **05 (type)** + the **root V3 (3D glow)** → V4.
- **Specs:** this file + `docs/superpowers/specs/2026-06-10-awwwards-landing-redesign-design.md`
  (V1/V2/V3 history).
- **Brand source of truth:** `docs/2026-05-24-katy-technologies-brand-system-spec.md`. Voice is
  plainspoken/advisory; banned words: digital transformation, cutting-edge, innovation, synergy,
  leverage, seamless, disrupt, future-proof, revolutionary. Method copy (MAP/NAME/ROUTE/TRUST),
  services ×6, field notes ×3, contact details — all in the V3 `index.html` and every lab file.
- **Verify tooling:** Claude-in-Chrome was flaky this session; the Preview MCP (`preview_*`)
  works but its render surface caps ~960px physical and occasionally freezes its RAF loop —
  verify wide layouts via layout metrics, and prefer a real human scroll-through for scrub feel.
- **Restart all lab servers:** `for i in 1 2 3 4 5; do d=$(ls -d design-lab/0$i-*); python3 -m http.server $((8000+i)) -d "$d" & done`
