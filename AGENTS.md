# AGENTS.md

## Codex GitHub PR Review Branch Rule

When asked to code-review a GitHub PR, check out the PR actual head branch locally and keep the local branch name the same as the PR branch. Do not create convenience branches like `pr-697`. If a temporary local branch already exists, rename it to the PR head branch and set its upstream to the matching remote branch before committing or pushing follow-up work.

## Project Overview
- This is a static multi-page marketing site for Katy Technologies.
- Primary pages: `index.html`, `about.html`, `solutions.html`, `contact.html`.
- The careers page has been removed and should not be reintroduced unless explicitly requested.

## Tech Stack
- Plain HTML, CSS, and JavaScript (no build step).
- Shared styling lives in:
  - `css/main.css` (global tokens, base styles, header, hero, utilities)
  - `css/components.css` (cards, page sections, forms, footer, page modules)
  - `css/responsive.css` (breakpoints and responsive behavior)
- Favicon assets:
  - `favicon.svg`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`
  - Source master: `assets/icons/favicon-master.png`

## Editing Guidelines
- Keep changes consistent with the existing glass/dashboard design language.
- For frontend changes, use `docs/2026-05-24-katy-technologies-brand-system-spec.md` as the brand/design reference.
- Prefer editing shared CSS files over page-specific inline styles.
- Preserve accessibility basics:
  - `aria-*` attributes for menu controls
  - visible `:focus-visible` states
  - semantic headings and link text
- Maintain existing URL style (`/`, `/about`, `/solutions`, `/contact`) and `.htaccess` routing behavior.

## JavaScript Notes
- Current pages use inline script blocks for menu + scroll/fade behavior.
- A modular JS folder exists (`js/*.js`), but it is not currently wired from the HTML pages.
- If migrating to modular JS, update all pages consistently and verify behavior parity first.

## Validation Checklist
- Open each page and verify:
  1. Header/menu works on desktop and mobile.
  2. Fade/scroll effects still trigger.
  3. Links do not point to `/careers`.
  4. Favicon renders in browser tabs.
- Quick local preview:
  - `python3 -m http.server 8000`
  - Visit `http://localhost:8000`

## Deployment Notes
- `.htaccess` handles clean URL rewrites and includes a `301` redirect from `/careers` to `/contact`.
- Do not remove redirect/safety rules unless explicitly asked.
