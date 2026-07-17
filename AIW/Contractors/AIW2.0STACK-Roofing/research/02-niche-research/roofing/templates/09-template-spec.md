# Roofing v2 Template Design Spec
# Module 2D, Phase 5 | Generated: 2026-07-15

Source: Silver Ridge (primary) + Panther Roof (inspection + transparency) + Horvath (Roof Care Club + scarcity)

---

## Design Philosophy

Trust before beauty. Every section must answer one homeowner question before asking for action:
1. Are these people qualified? (certifications, years, reviews)
2. Do they serve my area? (location-specific copy on every page)
3. What will this actually cost / how do I pay? (financing visible above fold)
4. What happens when I contact them? (named inspection process, transparency narrative)
5. Is there urgency? (scarcity copy, 24/7 emergency)

---

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | #1E3A5F | Nav, section headings, trust bar background |
| --color-accent | #D97706 | CTA buttons, badge highlights, hover states |
| --color-bg | #FFFFFF | Page background |
| --color-bg-secondary | #F8F9FA | Alternating sections, cards |
| --color-text | #1F2937 | Body copy |
| --color-text-muted | #6B7280 | Secondary text, captions |
| --color-trust-bar | #0F2645 | 4-badge trust strip (darker navy) |
| --color-cta | #D97706 | Button fill |
| --color-cta-hover | #B45309 | Button hover |
| --color-success | #059669 | Checkmarks, included items |
| --color-border | #E5E7EB | Card borders, dividers |

Override at brand-dna.js level per client. Template colors are professional defaults.

---

## Typography

Font stack: Inter (headings), Inter (body) -- Google Fonts, loaded via index.html.
Fallback: system-ui, -apple-system, sans-serif.

| Role | Class | Size | Weight |
|------|-------|------|--------|
| Hero H1 | hero-headline | 56px / 3.5rem | 900 (Black) |
| Hero H2 | hero-sub | 22px / 1.375rem | 400 |
| Section H2 | section-headline | 36px / 2.25rem | 700 |
| Section H3 | section-subheadline | 24px / 1.5rem | 600 |
| Body | body-text | 16px / 1rem | 400 |
| Badge label | badge-label | 11px / 0.6875rem | 700, uppercase, tracked |
| CTA button | cta-text | 15px / 0.9375rem | 700 |

---

## Component Library (Phase 6 targets)

### Global Components
- `Navbar` -- sticky, dark navy, logo left, phone right, services dropdown, CTA button
- `TrustBar` -- 4-badge strip below hero or in sticky header. Badges: [Cert1] | [Financing] | [24/7 Emergency] | [Years in Business]
- `DualReviewBadge` -- Google rating + count + Facebook rating + count, side by side
- `CTAButton` -- amber/gold, arrow icon, two variants: primary (solid) and ghost
- `Footer` -- dark navy, logo, services grid, locations grid, contact, certifications, license number

### Page-Level Components
- `HeroSection` -- dark roof photo overlay, H1 + sub + CTA + trust bar beneath
- `ReviewsStrip` -- scrollable row of named customer cards with star rating and location
- `TrustBadgesRow` -- horizontal row of certification/award logos
- `ProcessSection` -- 4-step named inspection process ("Pro Inspection" flow)
- `ServicesGrid` -- card grid with service name, icon, short description, "Learn More" link
- `ServicePageHeader` -- reusable: service headline + trust bar + "Get Your Free Quote" CTA
- `LocationsMap` -- grid of city/county cards with link to location page
- `RoofCareClub` -- membership program section: benefits list + CTA
- `BeforeAfterGallery` -- project photo pairs
- `FAQ` -- category tabs + accordion items
- `InsuranceClaims` -- dedicated section: storm damage / insurance process explainer
- `FormCTA` -- estimate form: name, phone, zip, service type, message. No email required above fold.
- `StickyPhoneBar` -- mobile-only. Fixed bottom bar: phone number + "Call Now" button

---

## Page Structure Rules

### Every page must have:
1. `Navbar` with phone number and "Free Estimate" CTA
2. `ServicePageHeader` or equivalent -- service/location name + trust bar + CTA above fold
3. `DualReviewBadge` or `ReviewsStrip` within first 3 sections
4. Geo-specific body copy (weather, local context)
5. `CTAButton` at end of every major section (not just bottom of page)
6. `Footer`

### Homepage only:
- `HeroSection` (dark overlay, full-width)
- `ReviewsStrip` (immediately after hero)
- `TrustBadgesRow` (certifications)
- `ProcessSection` (named 4-step inspection)
- `ServicesGrid`
- `RoofCareClub` section
- `BeforeAfterGallery`
- `LocationsMap`
- `FAQ` (top 5 questions only)
- `FormCTA` (before footer)

---

## Scarcity + Urgency Copy Patterns

These are Horvath-derived micro-copy patterns injected on service/location pages:

- Below CTA: "{service} schedules fill fast in {city}. Book today to secure your spot."
- Hero sub: "Serving {city} and surrounding areas since {year}."
- Form field label: "Limited inspection slots available this week."

All tokens populated from brand-dna.js at build time.

---

## Inspection Process Names

Silver Ridge gap: no named process. Template fills this with:

1. Schedule your [ClientName] Pro Inspection (free, no-obligation)
2. We document every issue -- photos, measurements, findings report
3. We show you the findings before we talk price
4. You choose: repair, replace, or we submit your insurance claim

Step names are injected from brand-dna.js: `brandDNA.process.steps[n].title/description`.

---

## Financing + Emergency Prominence Rules

Financing must appear:
- In the 4-badge trust bar on every page
- In the `ServicesGrid` card for "Roof Replacement" (biggest ticket)
- In the `FormCTA` section copy: "Financing available -- ask us for details"

24/7 Emergency must appear:
- In the 4-badge trust bar
- In the `Navbar` (desktop: top-right corner as a red/amber chip)
- On the `HomepageHero` CTA block

---

## SEO Architecture

Each page's `<title>` and `<h1>` are populated from brand-dna.js via the sitemap contract.
Meta descriptions are injected per page from `brandDNA.seo.pages[slug].metaDescription`.

Location page H1 pattern: "[Service] in [City], [State] | [CompanyName]"
Service page H1 pattern: "[Service] | [CompanyName] | [City], [State]"

Schema types to inject (Stage 10.2):
- LocalBusiness (homepage)
- Service (service pages)
- FAQPage (FAQ page and FAQ section on homepage)
- BreadcrumbList (all subpages)
- Review aggregation (homepage + service pages)
