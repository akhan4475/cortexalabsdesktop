# 09 - Template Spec: Pool Services Niche

Niche: pool-services
Mix source: Payan colors + Patriot CTA/nav + Pool Troopers hero/pricing + Desert Mountain form
Research base: research/02-niche-research/pool-gutter/

---

## Color System

| Token | Hex | Usage |
|---|---|---|
| primary | #0D6CB6 | Nav background, section headers, primary buttons |
| primary_dark | #0A1628 | Footer, headings, dark band sections |
| primary_slate | #1A3A5C | Mid-tone for gradients, card borders |
| accent | #F58026 | CTA buttons (primary action), icon accents, hover states |
| accent_light | #FDEBD0 | Button hover backgrounds, soft highlight bands |
| accent_dark | #C45E0A | Button hover/press states |
| neutral | #F0F9FF | Section background alternates, light band fills |
| neutral_dim | #E2EDF7 | Card backgrounds, divider fills |
| silver | #94A3B8 | Secondary text, captions, placeholder text |
| ink | #0F172A | Body copy, navigation text |

CSS variable names: `--color-primary`, `--color-primary-dark`, etc. All defined on `:root` in `src/index.css`.

---

## Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display headings (H1) | Fjalla One | 400 | 48px desktop / 32px mobile |
| Section headings (H2) | Fjalla One | 400 | 36px desktop / 26px mobile |
| Sub-headings (H3) | Inter | 700 | 22px desktop / 18px mobile |
| Body copy | Inter | 400 | 16px desktop / 15px mobile |
| Small/caption | Inter | 400 | 14px |
| Button text | Inter | 600 | 15px |
| Nav links | Inter | 500 | 15px |

Google Fonts URL fragment: `Fjalla+One&family=Inter:wght@400;500;600;700`

Line height: headings 1.15, body 1.65. Letter spacing: Fjalla One -0.01em.

---

## Motion Preset

Preset: restrained
- Fade-in on scroll: opacity 0 -> 1, translateY 16px -> 0, duration 400ms, easing ease-out
- Button hover: background transition 150ms ease, scale 1.02
- Card hover: box-shadow lift, translateY -2px, 200ms ease
- No parallax, no video autoplay
- `prefers-reduced-motion`: all transitions disabled, instant state changes only

---

## Theme Mode

Light mode only. Dark sections use `--color-primary-dark` (#0A1628) as background with white text -- not a full dark-mode theme switch.

---

## Shape Motif

Motif: water-ripple
Decorative: subtle concentric-arc SVG corner overlays on dark sections (footer, CTA band). Color: #2EA3F2 at 8% opacity. Does not affect readability.

---

## Hero Section

Design: asymmetric split -- left 55% copy + CTA, right 45% image.
Background: linear-gradient(135deg, #0A1628 0%, #0D6CB6 100%) on left panel.
Image: clean sparkling pool photo, full-height right panel.
Overlay: none on image side.

**Content:**
- Eyebrow chip: "[City] Pool Service" (from brandDNA.company.serviceRegion)
- H1: brandDNA.copy.hero.headline (e.g. "Reliable Pool Service in [City]")
- Subline: brandDNA.copy.hero.subheadline (e.g. "Cleaning, maintenance, and repair -- done right every time.")
- Trust chips: 3 horizontal pills from brandDNA.copy.heroTrustChips (e.g. "Licensed & Insured", "5-Star Rated", "Same-Day Response")
- Primary CTA: orange button (#F58026), text from brandDNA.copy.buttonText
- Secondary CTA: text link with right arrow, "View Pricing"
- Phone: click-to-call from brandDNA.contact.phone, always visible below CTAs

Mobile reflow: stack vertically, image moves to bottom (50vw height), CTAs full-width buttons.

**SSIM region weight: 0.30** (hero is 30% of total fidelity score)

---

## NavBar Section

Layout: full-width sticky. Height 64px desktop, 56px mobile.
Background: white with bottom border (#E2EDF7) when scrolled, transparent over hero.

Left: logo (brandDNA.company.name + pool icon SVG)
Center: nav links from sitemap primary routes
Right: phone number (click-to-call) + "Schedule Service" button (accent #F58026)

Mobile: hamburger menu, drawer slides from right, phone + CTA button pinned at drawer bottom.

---

## Trust Bar Section

Layout: centered horizontal strip, 5 items with icon + text.
Background: #F0F9FF (neutral).
Border top + bottom: 1px solid #E2EDF7.

Items (from brandDNA.trust_badges + brandDNA.copy.trustClaims):
1. Shield icon + "Licensed & Insured"
2. Star icon + "[X]+ 5-Star Reviews"
3. Clock icon + "Same-Day Response"
4. Check icon + "100% Satisfaction Guarantee"
5. Badge icon + "[X] Years Serving [City]"

Mobile: 2-column grid (3 top row, 2 bottom row).

**SSIM region weight: 0.05**

---

## Services Section

Layout: 3-column card grid (4th card if installation offered).
Background: white.
H2: brandDNA.copy.services.heading
Body: brandDNA.copy.services.body

Each card (from brandDNA.services[]): icon, service name, 3-bullet description, "Learn More" link.
Primary services: Pool Cleaning, Pool Maintenance, Pool Repair.
Optional 4th: Pool Opening/Closing (seasonal card, conditionally rendered).

Card style: white background, #E2EDF7 border, 8px radius, #0D6CB6 icon color, hover shadow lift.

Mobile: single column stack.

**SSIM region weight: 0.10**

---

## Pricing Transparency Section

Layout: centered, 3-tier pricing cards (Pool Troopers pattern adapted for solo operator).
Background: #0A1628 (dark navy band).
H2: white. Body: #94A3B8.

Cards: Basic / Standard / Premium service tiers OR: Cleaning / Maintenance / Repair starting prices.
Each card: service type, "Starting at $___/mo" or "From $___", bullet list of what's included, "Schedule This Service" CTA.

Design note: pricing is operator-entered at build time (brandDNA.special_offers[]). If client declines to show pricing, this section swaps to a "Get an Exact Quote in 24 Hours" variant (controlled by a boolean in brand-dna).

Mobile: single column stack.

**SSIM region weight: 0.05**

---

## Process Section

Layout: horizontal 3-step strip with numbered icons + connectors.
Background: #F0F9FF (neutral).
H2: brandDNA.copy.process.heading

Steps (from brandDNA.process_steps[]):
1. "Schedule" -- pick a time online or call
2. "We Show Up" -- certified tech arrives on time, every time
3. "Enjoy Your Pool" -- sparkling clean, photo documentation sent

Badge: brandDNA.copy.process.badgeText (e.g. "100% On-Time Guarantee")

Mobile: vertical stack with connecting line.

**SSIM region weight: 0.05**

---

## Gallery / Before-After Section

Layout: 2-column before/after pairs (minimum 3 pairs = 6 images).
Background: white.
H2: brandDNA.copy.gallery.heading

Images: from brandDNA.previous_projects[]. Each with before/after label overlay.
Caption: problem + outcome (e.g. "Green pool to crystal clear in 1 visit").
CTA below gallery: "See More Work" links to /gallery.

If fewer than 3 pairs available: render as standard 3-column photo grid instead.

Mobile: single column, full-width images.

**SSIM region weight: 0.08**

---

## Why Choose Us Section

Layout: split -- left 40% image of tech at work, right 60% bullet list + stat chips.
Background: white.
H2: brandDNA.copy.whyChoose.heading

Items (from brandDNA.why_choose_us[]): icon + one-line reasons.
Stat chips: 3 horizontal chips (review count, years, response time).

Mobile: image collapses to top banner (200px height), content below.

**SSIM region weight: 0.05**

---

## Reviews Section

Layout: 3-column card grid, star ratings, author name, source badge.
Background: #F0F9FF.
H2: brandDNA.copy.reviews.heading
Summary stat: brandDNA.reviews.googleStat + brandDNA.reviews.googleLabel

Cards (from brandDNA.reviews.items[]): stars, quote text, author name, source (Google/Facebook).
"Read All [X] Reviews on Google" link to brandDNA.contact.googleMapsUrl.

Mobile: horizontal scroll carousel (snap-scroll, 1 card visible at a time).

**SSIM region weight: 0.07**

---

## Contact Form Section (on-page)

Layout: split -- left 40% trust/reassurance block, right 60% form.
Background: white.
H2: brandDNA.copy.formHeader
Body: brandDNA.copy.formSubtext

Form fields (5 max):
1. First Name (text, required)
2. Phone Number (tel, required)
3. Zip Code (text, required -- pre-qualifies lead geographically)
4. Service Needed (select: Pool Cleaning / Pool Maintenance / Pool Repair / Pool Opening/Closing / Other)
5. Message (textarea, optional, placeholder from brandDNA)

Submit: brandDNA.copy.submitButton (accent orange button, full-width)
Privacy line: brandDNA.copy.privacyLine (small, #94A3B8)

Left block content: phone number large, hours, 3 trust claims from brandDNA.copy.trustClaims.

Mobile: form goes full-width, trust block stacks above.

**SSIM region weight: 0.10**

---

## Service Areas Section

Layout: centered, heading + city grid (3-4 columns of city chips/links).
Background: #0A1628 (dark navy).
H2: white. brandDNA.copy.serviceAreas.heading

Cities: from brandDNA.serviceAreas[]. Each chip links to /service-areas/[city-slug].
Body text: brandDNA.copy.serviceAreas.body

Mobile: 2-column chip grid.

**SSIM region weight: 0.03**

---

## FAQ Section

Layout: accordion, 2-column on desktop (left Q, right A expands inline).
Background: white.
H2: brandDNA.copy.faq.heading

Items: from brandDNA.faq[]. 6-8 items minimum.
Schema: FAQPage markup baked in.

Mobile: single column accordion.

**SSIM region weight: 0.02**

---

## Final CTA Band

Layout: full-width dark band, centered copy + button.
Background: linear-gradient(135deg, #0D6CB6, #0A1628).
Text: white.

H2: brandDNA.copy.cta.heading (e.g. "Ready for a cleaner pool?")
Body: brandDNA.copy.cta.body
Button: large accent orange, brandDNA.copy.buttonText
Sub-line: phone number, click-to-call

**SSIM region weight: 0.05**

---

## Footer

3-column layout:
- Left: logo + tagline + social links (brandDNA.social.*)
- Center: navigation links grouped by category
- Right: contact info (phone, email, address, hours)

Bottom strip: copyright (brandDNA.copy.copyright) + privacy policy link + agency credit (brandDNA.credit.agency).
Background: #0A1628. Text: white/slate.

---

## Fidelity Thresholds

| Section | SSIM Weight | Min Threshold |
|---|---|---|
| Hero | 0.30 | 0.70 |
| NavBar | 0.05 | 0.65 |
| Trust Bar | 0.05 | 0.65 |
| Services | 0.10 | 0.70 |
| Pricing | 0.05 | 0.65 |
| Process | 0.05 | 0.65 |
| Gallery | 0.08 | 0.68 |
| Why Choose | 0.05 | 0.65 |
| Reviews | 0.07 | 0.68 |
| Contact Form | 0.10 | 0.70 |
| Service Areas | 0.03 | 0.60 |
| FAQ | 0.02 | 0.60 |
| CTA Band | 0.05 | 0.65 |
| Total | 1.00 | 0.68 aggregate |

---

## Strategy Section

Per-niche service page strategy: each primary service (Cleaning, Maintenance, Repair, Opening/Closing) gets its own route. Each service page uses the service page template with: hero (service-specific headline), service detail, process, FAQs, reviews, contact form.

Per-city page strategy: service-areas/[city] pages use the location page template. Keyword anchor: "[service] in [city]". Schema: LocalBusiness with areaServed set to city.

---

## Photo Direction

- Hero: outdoor pool, daytime, sparkling blue water, residential backyard context. No people required.
- Gallery pairs: green/cloudy pool BEFORE, crystal-clear AFTER. Lighting consistent within pairs.
- Process: clean tech uniform, professional equipment, no clutter.
- Why Choose Us: tech servicing equipment at poolside, safety gear visible.

---

## Motif and Asset Surface

Corner overlays: concentric arc SVG, `--color-primary` at 8% opacity. Placed bottom-right of dark sections.
Background texture: subtle water-ripple pattern on hero dark panel, 4% opacity.
Icons: Lucide React icon set. Pool-specific: `Droplets`, `Wrench`, `Star`, `Shield`, `Clock`, `Check`, `MapPin`, `Phone`.
