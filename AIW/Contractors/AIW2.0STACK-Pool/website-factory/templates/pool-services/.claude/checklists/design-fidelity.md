# Design Fidelity Checklist: Pool Services

Used by `design-fidelity-qa-agent` at Stage 10.4a. SSIM targets are region-weighted per the wireframe's SSIM weight table.

---

## SSIM Weight Table

| Section | SSIM Weight | Threshold | Priority |
|---|---|---|---|
| Hero | 0.30 | 0.82 | HALT if below |
| Services | 0.12 | 0.78 | WARN if below |
| Pricing / Offers | 0.10 | 0.76 | WARN if below |
| Reviews | 0.10 | 0.78 | WARN if below |
| Process | 0.08 | 0.75 | WARN if below |
| ContactForm | 0.08 | 0.76 | WARN if below |
| Gallery | 0.07 | 0.74 | WARN if below |
| Footer | 0.06 | 0.74 | WARN if below |
| NavBar | 0.05 | 0.78 | WARN if below |
| FAQ | 0.04 | 0.73 | INFO |

**Composite SSIM:** Weighted average across all sections. Threshold: 0.78.

---

## Hero fidelity checks (HALT)

- [HALT] Hero renders as a split layout (two distinct panels) on desktop
- [HALT] Left panel background is dark navy (primary-dark/primary-slate gradient)
- [HALT] Right panel shows a pool image (not a color block or placeholder)
- [HALT] H1 is visible in the hero above the fold on desktop (1440px viewport)
- [HALT] Primary CTA button (accent color) is visible above the fold on desktop
- [HALT] On mobile (390px viewport): content is legible over the background image

## NavBar fidelity checks

- [WARN] NavBar background is transparent when at top of page
- [WARN] NavBar background transitions to white when scrolled past 24px
- [WARN] Phone number is visible in navbar on desktop
- [WARN] CTA button is visible in navbar on desktop

## Services section checks

- [WARN] Services render as a card grid (minimum 2 columns on desktop)
- [WARN] Each service card has an icon or icon placeholder

## Pricing section checks

- [WARN] Pricing section has a dark background (primary-dark)
- [WARN] At least 1 offer card is visible

## Typography checks

- [WARN] Fjalla One font loaded and applied to h1, h2 elements (check computed font-family)
- [WARN] Inter font loaded and applied to body, button, nav elements

## Color system checks

- [WARN] Primary color (#0d6cb6 / rgb(13 108 182)) is present in rendered CSS
- [WARN] Accent color (#f58026 / rgb(245 128 38)) is applied to at least one CTA button
- [WARN] Dark primary (#0a1628) is used as hero and pricing backgrounds

## Mobile checks

- [WARN] NavBar hamburger button is visible at 390px viewport width
- [WARN] Mobile drawer opens and closes correctly
- [WARN] Footer CTA strip is readable on mobile

---

## How to run

1. Screenshot the built site at 1440x900 (desktop) and 390x844 (mobile).
2. Compare against the niche template's reference screenshots at `templates/pool-services/reference/`.
3. Calculate SSIM per section. Apply weights from the table above.
4. Report composite score. Any HALT item below threshold blocks deploy.
