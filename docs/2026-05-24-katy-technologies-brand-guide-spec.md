# Katy Technologies Brand Guide Source Spec

Date: 2026-05-24

Purpose: this Markdown file is the agent-readable source of truth for the Katy Technologies brand guide. It is intentionally more explicit than the final PDF. The PDF should translate these rules into a polished human-readable internal brand guide, but it must not change the decisions recorded here.

Primary deliverables that follow from this spec:

- Human-readable brand guide PDF.
- Reusable logo asset set.
- Later website overhaul direction using the same brand system.

Do not treat this Markdown file as final customer-facing copy. Treat it as a strict implementation brief.

## 1. Brand Foundation

### 1.1 Company Description

Katy Technologies is a consulting company that builds technological solutions to automate workflows.

Canonical offering sentence:

> We help enterprise teams automate manual workflows with practical AI and custom software.

This sentence may be used in the PDF as an example of approved positioning. It should not be overused verbatim throughout the guide.

### 1.2 Audience

Primary audience for the brand:

- Enterprise executives.
- Leaders responsible for operational efficiency, internal systems, risk, and team throughput.
- Buyers who are interested in automation but cautious about AI risk.

Primary reader for the brand guide:

- Internal Katy Technologies team.
- The guide should be rigorous enough that future agents, designers, developers, and team members can apply the system consistently.

### 1.3 Brand Impression

The brand should make enterprise executives feel reassured.

Core brand tension:

- Efficient but human.
- Technically precise but warm.
- Automation-forward but not AI-hype-driven.
- Enterprise-credible but not generic consulting.

### 1.4 Brand Personality

Approved personality direction:

- Human Systems.
- Warm, consultative, practical, and reassuring.
- The brand should show automation as a people-centered way to remove friction from work.

Do not make the brand feel:

- Cold.
- Generic SaaS.
- Overly futuristic.
- Consumer playful.
- Hype-heavy.
- Like a stock technology consultancy.

## 2. Logo System

### 2.1 Source Files

Primary logo files moved into the repository:

- `assets/logos/KT_Logo_Final.svg`
- `assets/logos/KT_Logo_Final.png`
- `assets/logos/KT_Logo_Final.source.svg`

Rules:

- `assets/logos/KT_Logo_Final.svg` is the primary SVG source for the logo.
- The primary SVG has converted the live `T` text into an outlined path.
- The SVG used for final brand-guide assets must not rely on live fonts for the logo mark.
- `assets/logos/KT_Logo_Final.source.svg` is retained only as an archival source with live text. Do not use it for final PDF or website assets.
- If a logo variant is exported, the `T` path must be layered above the `K` and arrow.

### 2.2 Transparent Brand Guide Logo Assets

The following transparent-background SVG and PNG variants have been generated for use in the PDF and future website work.

Primary transparent:

- `assets/logos/brand-guide/2026-05-24-kt-logo-primary-transparent.svg`
- `assets/logos/brand-guide/2026-05-24-kt-logo-primary-transparent.png`

Dark-surface white/slate variant, approved for dark navy and blueprint surfaces:

- `assets/logos/brand-guide/2026-05-24-kt-logo-dark-surface-white-slate-transparent.svg`
- `assets/logos/brand-guide/2026-05-24-kt-logo-dark-surface-white-slate-transparent.png`

One-ink navy knockout variant, approved for light backgrounds where the `T` must visibly sit on top:

- `assets/logos/brand-guide/2026-05-24-kt-logo-one-ink-navy-knockout-transparent.svg`
- `assets/logos/brand-guide/2026-05-24-kt-logo-one-ink-navy-knockout-transparent.png`

Navy/slate tonal variant:

- `assets/logos/brand-guide/2026-05-24-kt-logo-navy-slate-tonal-transparent.svg`
- `assets/logos/brand-guide/2026-05-24-kt-logo-navy-slate-tonal-transparent.png`

One-color white utility variant:

- `assets/logos/brand-guide/2026-05-24-kt-logo-one-color-white-transparent.svg`
- `assets/logos/brand-guide/2026-05-24-kt-logo-one-color-white-transparent.png`

One-color navy utility variant:

- `assets/logos/brand-guide/2026-05-24-kt-logo-one-color-navy-transparent.svg`
- `assets/logos/brand-guide/2026-05-24-kt-logo-one-color-navy-transparent.png`

### 2.3 Primary Logo Rule

The primary full-color logo must keep the original visual relationship:

- White `K` and arrow.
- Translucent muted blue-gray `T`.
- Deep navy field when shown as the official primary mark.

Do not apply the knockout-under-`T` treatment to the primary full-color logo. The primary logo should remain original.

### 2.4 Approved Supporting Logo Behaviors

Approved supporting treatments:

- Use the one-ink navy knockout variant on light backgrounds when the `T` needs to visibly sit on top while staying one-ink.
- Use the dark-surface white/slate variant on dark navy, blueprint, grain, or grid backgrounds.
- Use one-color utility variants only where reproduction constraints require them.

Important technical rule:

- Same-color translucent `T` over same-color opaque `K` is not acceptable as a standard logo behavior because the overlap becomes visually invisible.
- If the `T` must read as the top layer, use either a tonal `T` or a knockout-under-`T` export.

### 2.5 Logo Over Grids, Diagrams, and Background Textures

The logo may appear over grids, sketches, or diagrams only under these conditions:

- Website use: direct overlay is allowed only when the diagram is decorative and quiet.
- Presentation and slide deck use: watermark-style logo is allowed as a background brand texture.
- Functional diagrams: do not place the primary identifying logo over important labels, paths, or process nodes.
- If the logo is used as a background texture or watermark, apply a cutout to the `K`/arrow underneath the `T` so the `T` remains visibly on top.

Approved usage examples:

- Presentation background watermark: low-opacity mark, cutout under `T`, not the only identifying logo on the slide.
- Decorative website diagram: logo may sit directly over quiet non-informational diagram elements, with cutout under `T` for background texture use.

Do not:

- Place the logo over dense process content.
- Let diagram lines cross through the core logo in a way that reduces recognizability.
- Flatten or reorder the mark so the `T` appears beneath the `K`.

### 2.6 Logo Clearspace and Sizing

The PDF should define explicit clearspace and minimum-size rules.

Clearspace rule:

- Use the approximate width of the `T` vertical stem as the minimum clearspace unit.
- Maintain at least 1x this unit around the mark in standard identity usage.
- Use at least 1.5x this unit when the logo sits near grids, diagrams, grain, or other active visual elements.

Minimum-size rules to define in the PDF:

- Web navigation mark: do not render below 32px tall.
- Favicon or app icon: use a simplified square/cropped asset where needed.
- Print mark: do not render below 0.45 inches tall unless using a simplified one-color export.
- Watermark/background texture: may be oversized and cropped, but must not substitute for a primary logo placement.

## 3. Color System

### 3.1 Palette Philosophy

The palette must stay strictly within:

- Logo colors.
- Warm Gray / Taupe as the only approved secondary neutral.
- Tints, shades, and opacity steps of logo colors.
- Tints, shades, and opacity steps of Warm Gray / Taupe.
- Neutral paper/off-white values.

No additional accent hues are allowed for the first brand guide beyond Warm Gray / Taupe.

Do not introduce:

- Green success colors.
- Red error colors.
- Orange/yellow warning colors.
- Purple or cyan technology gradients.
- Rainbow chart palettes.
- Additional warm accent hues beyond Warm Gray / Taupe.

Status states, charts, diagrams, and emphasis must use:

- Navy shades.
- Blue-gray tints.
- Warm Gray / Taupe tints and shades.
- White/off-white.
- Opacity differences.
- Pattern, label, or shape differences where color alone is insufficient.

### 3.2 Core Color Tokens

Use these as starting tokens:

- Deep Navy: `#071A33`
- White: `#FFFFFF`
- Warm Paper: `#F8F7F2`
- Muted Blue-Gray: `#7F95AA`
- Warm Gray / Taupe: `#8B8080`
- Warm Gray / Taupe Shade: `#6F6666`
- Warm Gray / Taupe Tint: `#AFA7A7`
- Warm Gray / Taupe Pale Tint: `#D1CCCC`
- Dark Blueprint Navy: `#06192D`
- Mid Blueprint Navy: `#0A213A`
- Deep Slate: `#263D54`
- Soft Slate: `#536B80`

The final PDF should include:

- HEX values.
- RGB values if needed.
- Usage guidance.
- Tints/shades/opacity ladder.

### 3.3 Tints, Shades, and Opacity

Approved contrast-building methods:

- Use navy at 100%, 86%, 72%, 58%, 42%, 24%, and 12% opacity.
- Use blue-gray at 100%, 72%, 58%, 42%, 24%, and 12% opacity.
- Use white/paper at 100%, 86%, 72%, 58%, 42%, 24%, and 12% opacity.
- Use background tone shifts instead of new hues.

Charts and data displays:

- Differentiate series with shade, opacity, line style, marker shape, and annotation.
- Do not rely on color alone.
- Avoid more than 4 simultaneous visual series unless the chart is split into small multiples.

## 4. Gradients, Grain, and Grid

### 4.1 Gradient Direction

Approved gradient direction:

- Blueprint Fade.
- Darker, technical, blueprint-like grainy gradients.
- Directional linear gradients, not radial glow gradients.

The gradient may follow a Bezier-like path with a small number of control points. This should be implemented with SVG shapes, masks, or layered directional gradients rather than radial gradients.

Do not use:

- Radial gradients.
- Neon glows.
- Multicolor gradients outside the logo palette.
- Purple/blue AI SaaS gradients.

### 4.2 Grain Rule

Grain should feel like fine photo grain.

Required characteristics:

- Dense speckles.
- Small radius speckles.
- No chunky noise.
- No visible repeated bitmap pattern.
- Grain should reduce banding and add texture without muddying the brand colors.

Technical implementation guidance:

- Follow the Frontend Masters "Grainy Gradients" approach: use generated noise as a displacement map rather than simply layering a noisy image over the gradient.
- Prefer an inline zero-dimension SVG filter for web implementations.
- Set `color-interpolation-filters="sRGB"` on the SVG filter so RGB channel behavior preserves expected brand color appearance.
- Use `<feTurbulence type="fractalNoise">` for fine-grained noise.
- Use higher `baseFrequency` values for smaller/finer speckles; avoid integer values because they can produce blank results.
- Use `numOctaves` values no higher than `3` or `4`; higher values add performance cost without enough visible improvement.
- Feed the turbulence result into `<feDisplacementMap in="SourceGraphic">` so the noise displaces the gradient pixels instead of sitting as a visible noise layer on top.
- Use absolute pixel displacement rather than `primitiveUnits="objectBoundingBox"` for non-square surfaces, because relative displacement is inconsistent across browsers.
- Add `<feBlend in2="SourceGraphic">` after the displacement map so the original gradient sits underneath the displaced gradient and covers transparent internal gaps.
- Restrict the filter region with `x="0" y="0" width="1" height="1"` and/or apply `clip-path: inset(0)` so displaced pixels do not extend outside the gradient box.
- Keep the effect subtle enough that text remains legible and the palette still reads as Katy Technologies navy, slate, taupe, and paper.

Reference implementation pattern:

```html
<svg width="0" height="0" aria-hidden="true">
  <filter id="kt-grain" color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">
    <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" />
    <feDisplacementMap in="SourceGraphic" scale="80" xChannelSelector="R" yChannelSelector="G" />
    <feBlend in2="SourceGraphic" />
  </filter>
</svg>
```

```css
.kt-grainy-gradient {
  background: linear-gradient(135deg, #06192D 0%, #0A213A 42%, #536B80 100%);
  clip-path: inset(0);
  filter: url("#kt-grain");
}
```

### 4.3 Grid Rule

Grids are allowed, but should be controlled.

Approved role:

- Rare in the PDF guide.
- Used in diagrams and selected section openers.
- Subtle background texture on web or UI examples only where it supports the technical operating-system feel.

Do not make every PDF page visibly gridded.

Grid opacity rules:

- Content-area grids should generally stay below 12% opacity.
- Stronger grids may be used in diagrams, cover art, section openers, or technical examples.
- Grids should not compete with body copy.

## 5. Typography

### 5.1 Approved Pairing

Approved type pairing:

- Work Sans for all headers/headings, UI labels, captions, navigation, buttons, and technical metadata.
- Literata for body copy, explanatory text, advisory voice, long-form guide content, and editorial warmth.

Why:

- Work Sans gives the system a clear operational feel.
- Literata adds human warmth and readability.
- The pair supports a technical operating-system style without becoming cold.

### 5.2 Typography Rules

Work Sans:

- Use for every header and heading.
- Use for short, precise, operational language.
- Use uppercase sparingly for labels and section metadata.
- Use tight but readable letter spacing for labels.
- Avoid overusing heavy weights.

Literata:

- Use for explanatory prose and human guidance.
- Use for compact manual sections.
- Use for headlines when the tone should feel advisory rather than purely technical.

Do not use:

- Inter as the primary brand typeface.
- Montserrat as the final selected heading font for this guide.
- Generic system type as a visible brand decision.
- Handwriting fonts as permanent brand typography.

### 5.3 Handwritten Layer

The handwritten system should not be a font-based system in the first draft.

Use image placeholders with instructions for what to insert.

Approved handwritten motif scope:

- Workflow sketches.
- Process diagrams.
- Handwritten annotations on precise system diagrams.

Do not prioritize:

- Generic doodle arrows.
- Decorative circles and underlines as the main motif.
- Casual notebook scribbles as the core system.

Handwritten asset placeholder instruction:

- Use placeholders labeled with exact insert instructions, such as `[Insert handwritten annotation: "manual review happens here"]`.
- Specify whether each placeholder should be scanned handwriting, tablet-drawn annotation, or diagram sketch.
- Keep handwritten annotations secondary to precise diagrams.

## 6. Diagram and Icon System

### 6.1 Diagram Direction

Approved direction:

- Precise system diagrams with handwritten annotations.

Base diagrams should feel:

- Clean.
- Technical.
- Structured.
- System-mapping oriented.
- Enterprise-credible.

Handwritten overlays should feel:

- Human.
- Advisory.
- Specific.
- Like a consultant has marked the actual bottleneck.

### 6.2 Diagram Elements

Approved elements:

- Process nodes.
- Handoff lines.
- Decision branches.
- System boundaries.
- Inputs and outputs.
- Risk markers.
- Annotation callouts.
- Measurement ticks.
- Subtle grid references.

Do not use:

- Stock icons as primary visual language.
- Cartoon illustrations.
- Photography.
- Decorative doodles without operational meaning.

### 6.3 Iconography

Iconography should be diagrammatic marks and line symbols.

Rules:

- Prefer simple line symbols over filled icons.
- Use line weight consistently.
- Use right angles, direct paths, and precise curves.
- Use icons only when they clarify system meaning.
- Avoid icon libraries that look generic or SaaS-template-like.

## 7. Layout System

### 7.1 Overall PDF Feel

The PDF should feel like:

- A rigorous standards manual.
- With field-notebook visual language.
- Compact and manual-like.
- Not a presentation deck.

Page format:

- US Letter portrait.

Cover:

- Full-page.
- Atmospheric.
- Use grainy blueprint gradient, grid, and watermark-style mark.
- Include a date on the front page.
- Do not include a formal version label on the cover.

Interior:

- Compact.
- Rule-dense.
- Easy to scan.
- Manual-like rather than deck-like.

### 7.2 Layout Geometry

Approved component shape:

- Sharp and rectilinear.

Important layout preference:

- Avoid visible nested-card hierarchy.
- Do not make divs look like obvious children inside other divs.
- Place modules side by side so edges are implied by spacing, alignment, faint rules, and tonal shifts.
- Avoid heavy parent boxes around groups of smaller boxes.

### 7.3 Borders and Rules

Approved direction:

- Very faint hairlines.

Hairline rules:

- Use sharp modules with faint structural lines.
- Borders should support precision without making the page feel boxed-in.
- Hairlines should generally be subtle enough to recede behind content.

Do not use:

- Heavy technical borders everywhere.
- Rounded card stacks.
- Parent containers that visibly wrap child containers.
- Thick dividers unless used as a deliberate technical example.

## 8. Component System

The brand guide should include comprehensive component examples.

Required examples:

- Hero treatments.
- Navigation.
- Footer.
- Buttons.
- Cards or module blocks.
- Forms.
- Workflow diagrams.
- Grid/gradient backgrounds.
- Annotation/sketch placeholders.
- Iconography/line symbols.
- Charts.
- Tables.
- Social/OG examples.

### 8.1 Component Feel

Approved UI direction:

- Technical operating system.
- Panels, grids, labels, precise states.
- Sharp modules.
- Faint hairlines.
- No nested-card look.

Use realistic Katy Technologies copy in examples.

### 8.2 Buttons and CTAs

Primary CTA language:

> Talk through a bottleneck

CTA rules:

- CTAs should invite conversation, diagnosis, and collaboration.
- Avoid aggressive conversion language.
- Avoid "Get Started" as the dominant brand CTA unless needed in a generic context.

Approved CTA examples:

- Talk through a bottleneck.
- Map a workflow.
- Find the slow handoff.
- Talk with us.

Avoid:

- Unlock transformation.
- Supercharge your business.
- Start innovating today.
- Leverage AI now.

### 8.3 Forms

Forms should feel advisory and low-friction.

Recommended fields:

- Name.
- Work email.
- Company.
- What workflow is slowing your team down?
- What systems are involved?
- Optional notes.

Avoid:

- Long sales qualification forms.
- Overly generic contact forms.
- Fields that feel like a lead trap.

### 8.4 Charts and Tables

Use charts and tables to show operational clarity.

Rules:

- Use logo colors plus tints, shades, opacity.
- Use line styles and labels to differentiate states.
- Avoid rainbow palettes.
- Use tables for process audits, workflow inventory, handoff analysis, and risk notes.
- Keep charts sparse and clearly labeled.

Example table topics:

- Workflow step.
- Owner.
- Current tool.
- Manual effort.
- Automation opportunity.
- Risk level.

## 9. Voice and Messaging

### 9.1 Voice Direction

Approved voice:

- Warm.
- Advisory.
- Humanistic.
- Plainspoken.
- Specific.

Do not sound:

- Hype-driven.
- Corporate-generic.
- Overly technical for its own sake.
- Like an AI vendor.
- Like a traditional consultancy using jargon.

### 9.2 Forbidden or Discouraged Language

Explicitly avoid common technology-consulting jargon, including:

- Digital transformation.
- Cutting-edge.
- Innovation.
- Synergy.
- Leverage.
- Seamless.
- Disrupt.
- Future-proof.
- Revolutionary.
- AI-powered everything.
- Unlock your potential.

If these terms appear in source material, rewrite them into human operational language.

### 9.3 Messaging Examples

Approved hero direction:

- "Automate the work that slows your team down."
- "Practical AI and custom software for workflows that still depend on handoffs, spreadsheets, and manual review."
- CTA: "Talk through a bottleneck."

Approved service description direction:

- "We map the way work actually moves through your organization, then build the software and AI support that removes repeat manual steps without creating new risk."

Approved reassurance copy:

- "Automation should make work easier to trust, not harder to explain."
- "We start with the bottleneck, not the tool."
- "Every workflow has a human reason behind it. We preserve that context while removing the unnecessary manual effort."

Do not write:

- "We provide cutting-edge AI solutions that digitally transform your enterprise."
- "Unlock innovation with next-generation automation."
- "Leverage our advanced technology stack to optimize synergies."

## 10. Imagery and Media

### 10.1 Photography

No photography.

The brand system should rely on:

- Diagrams.
- Grids.
- Grainy gradients.
- UI/process artifacts.
- Precise system maps.
- Handwritten workflow annotations.
- Logo texture/watermark treatments.

### 10.2 Social and OG Images

Social and OG examples should use:

- Atmospheric blueprint gradient.
- Fine grain.
- Rare grid texture.
- Primary or dark-surface logo variant.
- Short humanistic headline.

Example OG headline:

- "Automate the work that slows your team down."

Do not use:

- Stock people photos.
- Abstract 3D blobs.
- Purple AI gradients.
- Generic dashboard screenshots without brand context.

## 11. Accessibility and Legibility

### 11.1 Core Rule

Atmosphere should never make the work harder to understand.

### 11.2 Text Contrast

Text must meet WCAG AA:

- 4.5:1 minimum for normal text.
- 3:1 minimum for large display text.

The PDF should include do/don't examples showing:

- Quiet grid with clear type.
- Overactive grid with weak contrast.

### 11.3 Logo Legibility

Rules:

- Primary logo should sit on navy or sufficiently dark blueprint gradient.
- Use protected spacing when grids or diagrams become visually active.
- Use the dark-surface white/slate asset for dark surfaces.
- Use the one-ink navy knockout asset on light surfaces when top-layer visibility matters.

### 11.4 Grid Legibility

Rules:

- Grid lines below body copy should generally stay below 12% opacity.
- Stronger grid lines are allowed in diagrams, section openers, or technical examples.
- Grids should never reduce text clarity.

### 11.5 Grain Legibility

Rules:

- Grain must be fine and dense.
- Grain should not lower contrast below accessibility thresholds.
- Grain should not create muddy color shifts.

### 11.6 Diagram Legibility

Rules:

- Functional diagrams must prioritize labels and paths.
- Decorative diagrams may sit behind logos only when they do not cross core logo shapes.
- Handwritten annotations must be readable and purposeful.
- Avoid decorative marks that look like instructions but do not convey meaning.

### 11.7 Motion

For website examples:

- Motion should clarify flow.
- Avoid motion that repeats continuously near body copy.
- Avoid animation that makes workflow diagrams harder to read.
- Respect reduced-motion preferences.

## 12. Do and Don't Requirements

The PDF must include do/don't examples for these systems:

- Logo placement.
- Logo variants.
- Logo over grids/diagrams.
- Grainy gradients.
- Grid use.
- Diagram use.
- Typography.
- Component layout.
- Voice and messaging.
- Accessibility/legibility.

Do examples should use realistic Katy Technologies content.

Don't examples should be realistic mistakes, not absurd strawmen.

## 13. Markdown-to-PDF Production Workflow

### 13.1 Source of Truth

This Markdown spec is the source of truth for the brand guide.

The PDF should be generated after this spec is reviewed and approved.

The Markdown should remain agent-readable and overly specific.

The PDF should be human-readable and visually polished.

### 13.2 File Naming

Use dated file names.

Markdown source:

- `docs/2026-05-24-katy-technologies-brand-guide-spec.md`

Future PDF output:

- `docs/2026-05-24-katy-technologies-brand-guide.pdf`

Future PDF build source, if HTML/CSS is used:

- `docs/2026-05-24-katy-technologies-brand-guide.html`
- `docs/2026-05-24-katy-technologies-brand-guide.css`

### 13.3 PDF Build Requirements

When building the PDF:

- Use US Letter portrait.
- Use a full-page atmospheric cover.
- Include only the date on the cover as metadata.
- Keep interior pages compact and manual-like.
- Use Work Sans and Literata.
- Use logo asset files referenced in this spec.
- Include generated transparent SVG/PNG logo variants in the asset appendix.
- Include instructions for handwritten image placeholders.
- Include do/don't examples.
- Preserve accessibility rules.

### 13.4 PDF Cover Requirements

Cover must include:

- Atmospheric blueprint gradient.
- Fine dense grain.
- Subtle or partial grid.
- Watermark-style KT treatment with K cutout under T if used as a texture.
- Date: 2026-05-24.
- Title: "Katy Technologies Brand Guide".

Cover must not include:

- Version label.
- Photography.
- Extra accent colors beyond Warm Gray / Taupe.
- Generic abstract tech art.

## 14. Open Implementation Notes

These are not unresolved brand decisions; they are implementation notes for the PDF build.

- The final PDF should include visual examples derived from the approved browser mockups where useful.
- Handwritten workflow sketches should remain placeholders unless actual handwritten image assets are provided.
- If new logo exports are created later, preserve the approved layer order and cutout rules.
- The website overhaul should not be planned inside this brand guide spec except as component examples and visual usage rules.
- A separate website overhaul spec should be written after the brand guide PDF is approved.
