# Roofing Hero Composition

## Winner source

perth-roof-replacements hero treatment.

## Layout

Full-bleed dark. No sidebars. No split layouts. The photo fills the entire viewport.

## Overlay

`rgba(10,15,26,0.55)` applied via CSS `::before` pseudo-element or an absolutely-positioned `<div>`. The overlay is NOT baked into the image. This lets `inject-theme.mjs` swap the background without re-generating the overlay.

## Headline

- Font: Barlow Condensed Bold (700), uppercase
- Size: 64-72px desktop, 40-48px mobile
- Color: white
- Max width: 640px (prevents runaway line length on wide screens)
- Content formula: `[Service] in [City]. [Specific proof point].`
- Example: "Roof Replacement in Dallas. 4.9 Stars. Done in 1 Day."

## Subtext

- Font: Inter 400, 16-18px
- Color: `--silver` (#E5E7EB)
- Max width: 520px
- 1-2 sentences. State the outcome, not the feature. "Get a written estimate today. No pressure, no obligation."

## Social proof row

- Appears below the subtext, above or inline with the CTAs
- Contains: star row (5 stars in gold) + review count + "Google Reviews" label
- Example: `★★★★★  312 Google Reviews`

## CTAs

Dual horizontal layout:
- Primary: teal fill (`--primary` background, `--color-bg` text), text "Get a Free Estimate"
- Secondary: ghost white border (`border border-white/30`), text is the phone number
- Gap: 16px
- On mobile: stack vertically

## MobileStickyBar

Always pinned at the bottom on mobile (separate from the hero). Two-button: Call Now | Free Estimate.

## Photo direction

See `hero-mood-mapping.json` for full direction. Key rule: real job site, low angle, crew visible but not posed.

## SSIM target

>= 0.72 vs perth-roof-replacements reference screenshot (hero section only). Tested at Stage 10.4a.
