# Hero Composition: Landscaping

Source: GreenOasis (design) + Keane (section order) + Mountainscapers (trust placement)

---

## Layout

Full-bleed, 100vh. Asymmetric split: 55% text left, 45% image right bleeds through dark overlay.

## Overlay

`linear-gradient(to right, rgba(13,51,32,0.95) 0%, rgba(13,51,32,0.80) 55%, rgba(13,51,32,0.40) 100%)`

This creates a hard dark zone over the text block that fades into the image on the right.

## Content sequence (top to bottom, left column)

1. Eyebrow: 5-star star row + review count from `brandDNA.reviews.rating` and `brandDNA.reviews.googleCount`. Font-size 14px. Color: ink/80.
2. H1: `brandDNA.copy.hero.headline` — Fraunces, 56-64px (fluid), weight 600, ink.
3. Subheadline: `brandDNA.copy.hero.subheadline` — Plus Jakarta Sans, 18px, neutral.
4. Dual CTA row: Primary (accent filled, rounded-full, 48px) + Secondary (outlined, click-to-call, same height).
5. Trust chips row: `brandDNA.copy.heroTrustChips` mapped as chips with check icon.
6. Scroll indicator: animated chevron at page bottom center.

## Motion

- Eyebrow: opacity 0 -> 1, y 28 -> 0, delay 0.05s
- H1: same, delay 0.15s
- Subheadline: delay 0.25s
- CTAs: delay 0.32s
- Trust chips: delay 0.40s
- All use `transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}`

## Image

`brandDNA.previous_projects[0].filename` resolves to `/work/{filename}`. If missing, deep-green gradient fallback: `linear-gradient(135deg, #091f14 0%, #1a4d30 100%)`.

## Image requirements

- Completed project, wide or overhead angle
- Sharp edges: clean mow lines, defined bed borders, crisp hardscape
- Green against dark mulch/stone for contrast
- No people unless brand is lifestyle-oriented
- Minimum 1440px wide, landscape orientation

## CTA labels

- Primary: `brandDNA.copy.buttonText` -> "Get a Free Estimate"
- Secondary: `brandDNA.copy.mobileCallLabel` + `brandDNA.contact.phone`

## Above-fold SSIM

The hero is weighted 0.35 of the overall SSIM score. Threshold: 0.65.
