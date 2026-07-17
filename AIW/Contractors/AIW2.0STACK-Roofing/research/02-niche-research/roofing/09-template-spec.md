ROOFING NICHE -- TEMPLATE DESIGN SPEC
Phase 5a, Module 2D | Generated: 2026-06-26
Winner: perth-roof-replacements + priority-roofs-dallas mix

---

## Color System

Primary palette derived from perth-roof-replacements capture + roofing niche trust requirements:

| Token | Hex | Usage |
|---|---|---|
| --color-bg | #0A0F1A | Page background, hero section |
| --color-surface | #111827 | Card backgrounds, dark sections |
| --color-surface-alt | #F9FAFB | Light content sections |
| --color-primary | #0ABFBC | Primary CTA buttons, accent links, teal highlight |
| --color-primary-dark | #089A97 | CTA hover state |
| --color-text-primary | #FFFFFF | Hero headline, dark-section body |
| --color-text-secondary | #E5E7EB | Hero subheadline, dark-section supporting text |
| --color-text-dark | #111827 | Light-section body copy |
| --color-text-muted | #6B7280 | Labels, secondary info on light sections |
| --color-border | #1F2937 | Dark section dividers |
| --color-border-light | #E5E7EB | Light section dividers |
| --color-trust-bg | #0F172A | Trust bar background |
| --color-star | #F59E0B | Star rating fill |

Rationale: Dark navy base (perth) projects authority and trust for a high-ticket purchase. Teal primary is distinctive in a niche where competitors default to red or blue. Light sections alternate to give the eye rest and separate conversion blocks from content blocks.

---

## Typography

Derived from perth-roof-replacements bold condensed treatment:

| Token | Value |
|---|---|
| --font-heading | 'Barlow Condensed', sans-serif |
| --font-body | 'Inter', sans-serif |
| --font-heading-weight | 700 |
| --font-body-weight | 400 |
| Google Fonts URL fragment | family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600 |

Heading sizes (desktop):
- H1 hero: 72px / 800 weight / uppercase / letter-spacing -0.02em
- H2 section: 40px / 700 weight / uppercase
- H3 card: 22px / 600 weight
- Body: 16px / 400 weight / line-height 1.6

Rationale: Barlow Condensed at large weight recreates the bold impactful hero treatment from perth. Inter for body ensures readability at all sizes. Both are free Google Fonts.

---

## Motion Preset

Preset: restrained

- Page load: fade-in only on hero text (opacity 0 -> 1, 400ms, ease-out). No slide or scale on load.
- Scroll reveals: fade-up (translateY 24px -> 0, opacity 0 -> 1, 350ms ease-out). Triggered at 20% element visibility.
- CTA hover: scale(1.03) + brightness(1.05), 150ms ease. No color change.
- Card hover: translateY(-4px) + box-shadow increase, 200ms ease.
- prefers-reduced-motion: all animations disabled. Static states only.

---

## Theme Mode

Mode: dark-hero / light-content hybrid

Hero, trust bar, and final CTA section: dark (--color-bg).
Services, why-us, process, FAQ, team: light (--color-surface-alt).
Reviews section: dark (--color-surface).
No dark mode toggle. Single theme.

---

## Shape Motif

Motif: angular / no-radius

- CTA buttons: border-radius 4px (near-square). Projects confidence and directness.
- Cards: border-radius 6px.
- Images: border-radius 0 (full bleed or square crops).
- No rounded pill buttons. No circular avatars -- use square or 4px radius crops.

Rationale: Angular shapes read as authoritative and direct -- matches the niche's homeowner trust pattern ("straight shooter" voice).

---

## Hero Composition

Reference: perth-roof-replacements desktop + mobile captures.

Layout: full-bleed dark hero, 100vh on desktop, auto-height on mobile.

Elements (top to bottom):
1. Sticky navbar (transparent on hero, dark on scroll)
2. Hero content: left-aligned on desktop, center-stacked on mobile
   - Eyebrow label (optional): small caps, teal, e.g. "Licensed & Insured Roofing Contractor"
   - H1 headline: uppercase, bold, 2 lines max. Template: "YOUR [CITY] ROOF. DONE ONCE, DONE RIGHT."
   - Subheadline: 18px, --color-text-secondary, max 2 lines. Template: "Free inspections. Same-day estimates. [N]+ 5-star reviews in [City]."
   - Star rating row: 5 stars (--color-star) + "[N] Google Reviews" in small text
   - Primary CTA button: teal, uppercase, "GET A FREE ESTIMATE"
   - Secondary CTA: ghost/outline button or plain text link: "Call [PHONE]"
3. Hero image: background photo, full-bleed. Dark overlay (rgba(10,15,26,0.55)). Real roof photo -- dark shingles from above or aerial neighborhood shot. No stock interiors.
4. Trust bar: immediately below hero fold line. Dark background. 5 badges horizontal.

Desktop layout: hero content left 55%, image full bleed behind. Form NOT in hero (form is above fold in the Services/CTA section immediately below). This differs from the priority-dallas split -- perth's clean hero is preserved.

Mobile layout: content centered, headline 48px, CTA full-width. Star rating below CTA. Trust bar collapses to horizontal scroll.

---

## Section Composition (Homepage)

Section order derived from priority-roofs-dallas structure, adapted to perth visual treatment:

| # | Section slug | Layout variant | Above/below fold |
|---|---|---|---|
| 1 | StickyNav | fixed header | above |
| 2 | Hero | full-bleed dark, left-content | above |
| 3 | TrustBar | dark horizontal badge row | just below fold |
| 4 | EstimateForm | light section, split: left copy + right form | first scroll stop |
| 5 | ServicesGrid | light section, 2x3 card grid | second scroll |
| 6 | WhyUs | dark section, 4-column stat/icon row | third scroll |
| 7 | BeforeAfterGallery | light section, slider | fourth scroll |
| 8 | TeamSection | light section, headshot grid | fifth scroll |
| 9 | ReviewTiles | dark section, 3-column card row | sixth scroll |
| 10 | ProcessSteps | light section, 4-step horizontal timeline | seventh scroll |
| 11 | InsuranceSection | dark section, split: left copy + right CTA | eighth scroll |
| 12 | FAQAccordion | light section, single column | ninth scroll |
| 13 | FinalCTA | dark section, centered | tenth scroll |
| 14 | Footer | dark, 4-column | bottom |

Section 4 (EstimateForm) is the primary conversion surface. It sits immediately below the trust bar -- the homeowner sees the hero, sees the trust signals, then hits the form. This replicates the priority-dallas above-fold form intent without cluttering the hero.

---

## Fidelity Table (for Gate 5 SSIM)

| Region | Weight | Min SSIM threshold |
|---|---|---|
| Hero (top 900px) | 0.35 | 0.65 |
| TrustBar | 0.10 | 0.60 |
| EstimateForm section | 0.20 | 0.60 |
| ServicesGrid | 0.10 | 0.55 |
| ReviewTiles | 0.10 | 0.55 |
| Footer | 0.05 | 0.50 |
| Remaining sections | 0.10 | 0.50 |

---

## Strategy Section (for Stage 4 per-niche hints)

Default service list: Roof Replacement, Roof Repair, Storm Damage, Emergency Repair, Gutter Services, Free Inspection.

Default area strategy: homepage targets city-level (e.g. "Roofing in [City], [State]"). Service area pages target suburb-level. City pages target metro-level.

Insurance claim page: always included. High-value segment, under-served by competitors.

Chatbot anchor: InsuranceSection CTA. Voiceflow widget embeds as floating bottom-right bubble site-wide.

---

## Photo Direction

Hero background: aerial or elevated shot of dark asphalt shingles on a residential home. Overcast or golden-hour lighting. No workers visible in hero -- clean finished product shot.

Services cards: one real project photo per service type. Before/after pairs for Gallery section.

Team photos: square crop, outdoor or on-roof natural light. No studio headshots -- keeps the "local, real crew" feel.

No stock photo services (Shutterstock, Getty) for hero or gallery. Real project photos only. Placeholder: solid dark gradient with overlay text if photos not yet available.

---

## Manual Overrides (per-client at build time)

Tokens the factory fills per client run (Stage 10.1):
- [COMPANY_NAME]
- [CITY]
- [STATE]
- [PHONE]
- [REVIEW_COUNT]
- [STAR_RATING]
- [YEARS_IN_BUSINESS]
- [LICENSE_NUMBER]
- [GAF_CERTIFIED] (boolean -- shows/hides GAF badge)
- [OC_CERTIFIED] (boolean -- shows/hides Owens Corning badge)
- [BBB_RATING] (string -- shows/hides BBB badge)
- [TEAM_MEMBER_1..4] (name + title + photo path)
