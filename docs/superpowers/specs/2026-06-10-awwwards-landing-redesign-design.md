# Katy Technologies — Landing Page Redesign ("Blueprint Instrument")

Date: 2026-06-10
Status: Built autonomously per Harsha's request; design decisions recorded here for review.

## Goal

Replace `index.html` with a modern, awwwards-caliber long-form landing page using GSAP
(ScrollTrigger) and Three.js, while staying strictly inside the existing brand system
(`docs/2026-05-24-katy-technologies-brand-system-spec.md`): navy blueprint palette,
Work Sans / Literata, grain + faint grid, precise diagram language, plainspoken no-hype voice.

## Concept

**The page is a precision instrument.** A dark blueprint surface where the centerpiece is a
scroll-driven workflow diagram that draws itself — intake → manual review (the bottleneck)
→ approval → output — and then an automation layer routes the repeat steps around the
bottleneck while human review stays visible. The story the company tells, told as a diagram.

## Approaches considered

1. **Three.js hero spectacle** (big 3D object, heavy shaders) — rejected: fights the brand's
   "no AI-hype" rule and the navy/slate-only palette starves a hero object of contrast.
2. **Pure-GSAP editorial page** (no WebGL) — safe but doesn't meet the "visually captivating /
   Three.js" brief.
3. **Chosen: quiet WebGL atmosphere + scroll-driven diagram narrative.** Three.js renders a
   subtle drifting blueprint point-grid/terrain (slate points, faint connecting lines, pointer
   parallax) behind the hero. GSAP ScrollTrigger drives the page: split-line headline reveal,
   pinned diagram scene with synced copy beats, staggered module reveals, marquee-free.
   Spectacle comes from precision and motion choreography, not color or gimmicks.

## Page structure (single long-form landing)

1. **Preloader** — ≤1.1s, logo mark + measurement tick sweep; skipped for reduced-motion.
2. **Hero** — full viewport; Three.js blueprint field + grainy directional gradient;
   GSAP line-mask headline "Automate the work that slows your team down."; Literata subline;
   CTAs "Talk through a bottleneck" / "See the work"; technical metadata strip; scroll cue.
3. **The Bottleneck (pinned diagram)** — "Start with the bottleneck, not the tool." SVG system
   diagram draws via stroke-dashoffset scrubbed by ScrollTrigger; four copy beats sync to
   stages; bottleneck node gets a risk marker; automation layer path draws in last with
   "human review stays visible" callout (plain type leader-line callouts — no faux handwriting,
   per brand rule).
4. **Ways we help** — six adjacent-plane modules (01–06) with hairlines, real copy from
   solutions.html, stagger reveal, tonal hover.
5. **Field notes** — three engagement log entries (2023 economic consulting, 2025 ticket
   vendor, current hospitality) with year ticks; horizontal scrub on desktop, stacked mobile.
6. **Principles** — Clarity / Practicality / Integrity / Throughput as large numbered index,
   opacity-ladder reveal.
7. **CTA** — grainy gradient panel: "Automation should make work easier to trust, not harder
   to explain." + primary CTA.
8. **Footer** — restrained; existing contact details.

## Tech decisions

- **No build step preserved** (AGENTS.md): GSAP 3.x + ScrollTrigger and Three.js via CDN.
- New files `css/landing.css`, `js/landing.js` — existing `css/main.css`/`components.css`
  stay untouched so `/about`, `/solutions`, `/contact` keep working unchanged.
- Three.js: capped pixel ratio, points-only geometry, paused offscreen, fully disabled for
  `prefers-reduced-motion` and replaced by the static grainy gradient (also the no-WebGL
  fallback).
- All scroll animation respects `prefers-reduced-motion` (content visible, no pins).
- Mobile: fluid clamp() type scale, diagram scene unpinned/simplified under 768px,
  burger menu preserved.
- Accessibility: AA contrast on navy, focus-visible states, semantic headings, skip link.

## Out of scope

About/solutions/contact page restyles (would follow in a second pass once this direction
is approved).

---

## V2 — "Hubtown" direction (2026-06-10, same day)

Harsha pointed at https://hubtown.co.in/ ("make something like this, something crazy good").
Reference fingerprint (from source): GSAP + ScrollTrigger + Lenis + SplitText; light grotesk
display + mono labels; strict two-tone (pale tint surface / near-black ink); 0→100% preloader;
single-word full-screen chapters (Future/Innovation/Collaboration/Excellence/Purpose/Legacy);
giant footer wordmark.

Translation into the Katy brand system:

- **Two-tone inversion**: Warm Paper #F8F7F2 + navy ink for the method chapters
  (inverted blueprint — drawing on paper); deep navy for hero, capabilities, field notes,
  CTA, footer. No new hues.
- **Chapters**: MAP → NAME → ROUTE → TRUST, each 100vh+: giant light Work Sans word with
  scroll parallax, stage copy, and a small navy diagram fragment that draws on enter.
  These replace the V1 pinned diagram scene (same narrative, more theatrical).
- **Manifesto scrub**: "Automation should make work easier to trust, not harder to explain."
  revealed word-by-word on scroll (opacity ladder) on paper.
- **Lenis smooth scroll** (skipped under prefers-reduced-motion), 0→100 counter preloader,
  capabilities as full-width index rows, giant cropped "Katy Technologies" footer wordmark.
- Header swaps to navy-ink treatment over light sections (one-ink navy knockout logo variant).
- Principles section dropped (lives on /about; chapters carry the same weight now).
