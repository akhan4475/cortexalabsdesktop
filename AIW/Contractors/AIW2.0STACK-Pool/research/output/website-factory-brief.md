# Website Factory Brief
Module 5 | pool-services | Ayaan Khan | 2026-05-22

This brief drives the niche tailoring of the factory's SOPs, copy defaults,
trust badge registry, and brand-dna defaults. The active niche template is
already scaffolded. Per-client data (business name, URL, phone, address,
service areas) is filled at /run-factory intake, not here. Every per-client
field below is marked [MISSING, fill at /run-factory].

---

## Part A - Niche Identity

```
niche: pool-services
nicheLabel: Pool Service Companies
nicheCategory: home-services / trades / contractor

clientArchetype: [MISSING, declare at Stage 1 intake]
  Valid values:
    "service-only"       - cleaning, maintenance, repair, opening/closing only
    "install-only"       - pool construction and installation only
    "full-service"       - installs pools AND provides ongoing service/repair

endCustomerProfile:
  Service-only clients serve:
    who: Homeowners 30-65 with an existing pool, booking recurring maintenance
         or repair
    decisionMoment:
      - Online booking convenience removes friction to the first job
      - Before/after photo proof ("before and after pictures = peace of mind")
      - Price transparency (no hidden fees seen as a differentiator)
    topFears:
      - "Hit or miss" reliability - the defining industry reputation
      - Unskilled contractor showing up
      - Hidden fees on the invoice
    topPains:
      - Can't find someone who shows up consistently
      - Scheduling friction (phone-only operators lose to ones with online booking)

  Install-only clients serve:
    who: Homeowners 35-65 planning to add a new pool ($20k-80k+ decision,
         consideration cycle of weeks to months)
    decisionMoment:
      - Portfolio quality (do their builds look like what I want?)
      - Licensing and warranty (am I protected if something goes wrong?)
      - Timeline and process clarity (do they have a clear project process?)
    topFears:
      - Contractor disappears mid-project or goes over budget
      - Poor build quality that fails in year 2
      - Unlicensed or uninsured crew working on my property
    topPains:
      - Hard to compare contractors - most websites show no portfolio
      - No clear sense of timeline or what the process looks like
      - Unclear what is included in the quoted price

  Full-service clients serve both profiles above.

agencyPositioningSentence: "Pool service companies usually lose jobs to
competitors because their online presence looks amateur. I fix that - build
them a site that actually makes homeowners trust them before they even pick
up the phone."

agencyOneLiner: "I build websites for pool companies that help them win more
jobs."
```

---

## Part B - Niche-Tailoring Directives

### Active Template

- Path: `website-factory/templates/pool-services/`
- Source inspiration: Mix of Payan Pool colors, Patriot CTA/nav, Pool
  Troopers hero/pricing, Desert Mountain form
- Visual personality: Clean confidence. Blue-dominant, reliability-first.
  Not luxury, not extreme. The feel of a professional crew that shows up
  every time.

---

### Client Archetypes

The factory builds three distinct site variants for this niche. The archetype
is declared at Stage 1 intake and gates which pages are built, which copy
register is used, and which trust signals lead.

---

#### Archetype 1 - Service-Only

**Who this is:** A pool cleaning, maintenance, and repair company. They do not
install new pools. Revenue is recurring: weekly/monthly service contracts,
one-off repairs, seasonal opening/closing.

**Pages built:**
- / (homepage)
- /pool-cleaning
- /pool-maintenance
- /pool-repair
- /pool-opening-closing
- /service-areas/:citySlug (dynamic)
- /about, /reviews, /gallery, /contact, /faq, /blog (core pages)

**Pages NOT built:** /pool-installation

**Hero H1 pattern:** "Reliable Pool Service in [City]"
**Hero subline:** "Cleaning, maintenance, and repair - done right every time."
**Hero primary CTA:** "Book Online Now" or "Schedule Service"
**Hero secondary CTA:** "View Pricing"

**Trust signals priority (service-only):**
1. Before/after photo documentation per visit
2. Google review count + star rating
3. Transparent pricing (no hidden fees)
4. Insured + background-checked crew
5. Satisfaction guarantee / re-service promise

**Pricing section:** Required on homepage. Show cleaning/maintenance/repair
starting rates. "No hidden fees" stated explicitly.

**Services card grid:** 4 cards - Pool Cleaning, Pool Maintenance, Pool Repair,
Pool Opening/Closing. Each card: service name, 3 bullets of what is included,
"Learn More" link.

**Copy register:** Reliability and ease. "We actually show up." Low-friction
booking language. Recurring relationship framing ("for years", "consistent").

**Primary SEO targets:**
- pool service [city]
- pool cleaning service [city]
- pool maintenance [city]
- pool repair [city]
- weekly pool service [city]
- green pool recovery [city]

---

#### Archetype 2 - Install-Only

**Who this is:** A pool builder or construction contractor. They design and
install new pools. They do not provide ongoing cleaning or maintenance after
handoff. Revenue is project-based: $20k-80k+ per installation.

**Pages built:**
- / (homepage)
- /pool-installation
- /pool-installation/inground (optional, if they only do inground)
- /pool-installation/fiberglass (optional, if they specialize)
- /service-areas/:citySlug (dynamic)
- /about, /gallery, /contact, /faq (core pages)
- /blog (optional)

**Pages NOT built:** /pool-cleaning, /pool-maintenance, /pool-repair,
/pool-opening-closing

**Hero H1 pattern:** "Pool Installation in [City] - Built to Last"
**Hero subline:** "Custom inground pools designed and installed by licensed
contractors."
**Hero primary CTA:** "Get a Free Quote" (not "Book Online" - wrong register
for a $40k decision)
**Hero secondary CTA:** "See Our Portfolio"

**Trust signals priority (install-only):**
1. Portfolio / before-during-after project photos (replaces service before/after)
2. Licensed general contractor + state pool contractor license
3. Years in business / projects completed count
4. Warranty on workmanship and materials (stated explicitly)
5. Google review count + star rating

**Pricing section:** Do NOT show fixed pricing (project scope varies too much).
Replace pricing section with a "How We Price" or "What Affects Your Quote"
explainer. Include a "Get a Free Quote" CTA in that section instead of tiers.

**Services card grid:** Replaced by project type cards - Inground Pool
Installation, Custom Pool Design, Pool Renovation, Spa/Hot Tub Add-on
(conditional on what client offers). Each card: type, what is included,
"See Examples" link to gallery filtered by type.

**Copy register:** Quality, craftsmanship, accountability. Longer consideration
cycle - copy must address the process, not just the outcome. "This is a big
investment. Here is exactly what you get and how we protect it."

**Primary SEO targets:**
- pool installation [city]
- inground pool installation [city]
- pool installation cost [city]
- custom pool builder [city]
- fiberglass pool installation [city] (if applicable)
- pool contractor near me

**Do not apply:** Recurring service copy ("book weekly service", "schedule a
visit"), transparent pricing tiers, online booking widget language.

---

#### Archetype 3 - Full-Service

**Who this is:** A company that installs pools AND provides ongoing cleaning,
maintenance, and repair. They often service the pools they build. Revenue is
both project-based (installation) and recurring (service contracts).

**Pages built:**
- / (homepage - must address both buyer types above the fold)
- /pool-installation (install-register copy)
- /pool-cleaning (service-register copy)
- /pool-maintenance (service-register copy)
- /pool-repair (service-register copy)
- /pool-opening-closing (service-register copy)
- /service-areas/:citySlug (dynamic)
- /about, /reviews, /gallery, /contact, /faq, /blog (core pages)

**Homepage structure adjustment:** The services card grid splits into two
visual groups:
- Group 1 header: "New Pool Installation" - 1 card (Installation), with
  "Get a Free Quote" CTA
- Group 2 header: "Pool Service & Maintenance" - 4 cards (Cleaning,
  Maintenance, Repair, Opening/Closing), with "Book a Service" CTA
This prevents the two buyer types from conflating their journey.

**Hero H1 pattern:** "Pool Installation and Service in [City]"
**Hero subline:** "We build pools and keep them running - all from one crew."
**Hero primary CTA:** "Get a Free Quote" (installation lead is higher value)
**Hero secondary CTA:** "Book a Service" (for existing pool owners)

**Trust signals priority (full-service):**
1. Portfolio photos (installation quality + service documentation)
2. Licensed contractor + insured crew
3. Google review count + star rating
4. "We install it. We service it." differentiator statement
5. Transparent service pricing (show maintenance/cleaning rates, not install)

**Pricing section:** Show service pricing tiers only (cleaning/maintenance/repair
starting rates). Installation pricing addressed via "Get a Free Quote" flow,
not a tiers table.

**Copy register:** Dual-register. Installation sections = quality and
accountability. Service sections = reliability and ease. Do not mix them.
"We build your pool. Then we keep it perfect." is the brand summary sentence.

**Primary SEO targets (both sets apply):**
- pool installation [city]
- pool service [city]
- pool cleaning service [city]
- pool maintenance [city]
- pool repair [city]
- pool company [city] (captures both intent types)
- pool builder and service [city]

---

### Trust Stack by Archetype

| Trust Signal | Service-Only | Install-Only | Full-Service |
|---|---|---|---|
| Before/after service photos | #1 | - | #1 (service pages) |
| Portfolio / installation photos | - | #1 | #1 (install page) |
| Google review count + stars | #2 | #5 | #3 |
| Transparent pricing (no hidden fees) | #3 | replaced by quote flow | #5 (service only) |
| Licensed + insured crew | #4 | #2 | #2 |
| Contractor license + warranty | - | #3 | #2 (install page) |
| Years in business + jobs completed | #5 | #4 | #4 |
| Satisfaction guarantee / re-service | #5 | - | #5 (service pages) |

**Niche-specific certifications to surface if client holds them:**
- Certified Pool & Spa Operator (CPO) - High priority (all archetypes)
- State contractor / pool specialty license - High priority (install + full-service)
- PHTA Member - Medium priority
- Angi Verified / Screened - Medium priority
- BBB Accredited - Medium priority
- Google Guaranteed - Medium priority
- Liability insurance badge - High priority (all archetypes)

---

### Hero Composition by Archetype

All archetypes use the same layout: asymmetric split, left 55% copy + CTA on
dark navy gradient, right 45% full-height pool photo.

**Service-only:**
- Subject: Sparkling clean pool in residential backyard. No people required.
- Mood: Clean, reliable, trust-first
- H1: "Reliable Pool Service in [City]"
- Subline: "Cleaning, maintenance, and repair - done right every time."
- Trust chips: "Licensed & Insured" | "[X]+ 5-Star Reviews" | "Same-Day Response"
- Primary CTA: "Schedule Service" (orange)
- Secondary CTA: "View Pricing"

**Install-only:**
- Subject: Freshly completed inground pool install, residential backyard, wide
  shot showing surrounds. Shows craftsmanship.
- Mood: Quality, confidence, craftsmanship
- H1: "Pool Installation in [City] - Built to Last"
- Subline: "Custom inground pools designed and installed by licensed contractors."
- Trust chips: "Licensed & Insured" | "[X] Pools Built" | "Workmanship Warranty"
- Primary CTA: "Get a Free Quote" (orange)
- Secondary CTA: "See Our Portfolio"

**Full-service:**
- Subject: Beautiful completed pool with clear water and clean surrounds.
- Mood: Quality + reliability combined
- H1: "Pool Installation and Service in [City]"
- Subline: "We build pools and keep them running - all from one crew."
- Trust chips: "Licensed & Insured" | "[X]+ 5-Star Reviews" | "Install + Service"
- Primary CTA: "Get a Free Quote" (orange, targets higher-value install lead)
- Secondary CTA: "Book a Service"

---

### Copy Voice

**End-customer phrases to echo verbatim (service + full-service archetypes,
from real homeowner reviews):**
1. "hit or miss" - name the industry problem, then contrast
2. "before and after pictures = peace of mind"
3. "no hidden fees" / "fair and transparent pricing"
4. "reliable" / "reliability"
5. "professional crew"
6. "flexible with timing"
7. "will continue using" / "for years"
8. "solid communications"
9. "punctual" / "on time" / "came early"
10. "satisfaction guarantee"

**CTAs by archetype:**

Service-only:
- "Book Online Now" - highest
- "Get an Instant Quote" - high
- "Schedule Your Service" - strong default
- "Get a Free Estimate" - acceptable
- Never: "Contact Us"

Install-only:
- "Get a Free Quote" - highest (appropriate for a $40k+ decision)
- "See Our Portfolio" - strong secondary
- "Schedule a Consultation" - acceptable
- Never: "Book Online Now" (wrong register for major purchase)
- Never: "View Pricing" (prices are project-specific, not tiers)

Full-service:
- Installation CTAs: "Get a Free Quote", "See Our Portfolio"
- Service CTAs: "Book a Service", "Get an Instant Quote"
- Never mix them: install CTA buttons must not appear in service sections
  and vice versa

**Section-by-section copy rules (applies to service-only and service sections
of full-service; install sections follow install-only rules):**

| Section | Copy must convey |
|---|---|
| Hero | See archetype-specific H1 and subline above. |
| Trust Bar | Service/full-service: review count first. Install-only: projects completed first. |
| Services | Service-only: 4 cards (Cleaning, Maintenance, Repair, Opening/Closing). Install-only: project type cards. Full-service: 2 groups (see archetype 3 above). |
| Pricing | Service/full-service service section: "Simple, Transparent Pricing." "No hidden fees." Install-only: replace with "How We Price" explainer + quote CTA. |
| Process | Service: 3 steps - Schedule, We Show Up, Enjoy Your Pool. Install: 3-5 steps - Consultation, Design, Permits + Build, Final Inspection, Handoff. |
| Gallery | Service: before/after pairs labeled with outcome ("Green pool to crystal clear"). Install: completed project photos with caption ("2,400 sq ft inground, [City], 2025"). |
| Why Choose | Service: "We actually show up - every time." Install: "Licensed, on-time, and accountable from first shovel to final handoff." |
| Reviews | Lead with count + star average. "Read All Reviews on Google" link. |
| Contact Form | Service: "Get a Free Quote." Install: "Schedule a Consultation." Both: no contract required (service) / no obligation (install). |
| FAQ | Service: frequency, what is included, one-time vs recurring, chemicals, tech certification, satisfaction guarantee. Install: timeline, what is included, permits, payment schedule, warranty, who services after install. |
| CTA Band | Service: "Ready for a Cleaner Pool?" Install: "Ready to Build Your Dream Pool?" Full-service: match to the dominant revenue line of the specific client. |

---

### SEO Targets

**Service-only primary keywords:**
- pool service [city]
- pool cleaning service [city]
- pool maintenance [city]
- pool repair [city]
- weekly pool service [city]
- green pool recovery [city]
- pool chemical service [city]
- CPO certified pool service [city]

**Install-only primary keywords:**
- pool installation [city]
- inground pool installation [city]
- pool installation cost [city]
- custom pool builder [city]
- pool contractor near me
- fiberglass pool installation [city]

**Full-service primary keywords (both sets apply):**
- All service-only keywords above
- All install-only keywords above
- pool company [city]
- pool builder and service [city]

**Service pages built per archetype:**

| Page | Service-Only | Install-Only | Full-Service |
|---|---|---|---|
| /pool-cleaning | Yes | No | Yes |
| /pool-maintenance | Yes | No | Yes |
| /pool-repair | Yes | No | Yes |
| /pool-opening-closing | Yes | No | Yes |
| /pool-installation | No | Yes | Yes |
| /service-areas/:citySlug | Yes | Yes | Yes |

**Alias pages (fallback to pillar if not built standalone):**
- green-pool-recovery - fallback /pool-cleaning (service + full-service only)
- weekly-pool-service - fallback /pool-cleaning (service + full-service only)
- pool-chemical-service - fallback /pool-maintenance (service + full-service only)

**GBP optimization: yes (all archetypes)**
- Schema: LocalBusiness (type: HomeAndConstructionBusiness), Service per
  service, AggregateRating, FAQPage, PriceRange (service archetypes only)
- Review volume + recency is the primary Maps Pack lever vs. national chains

---

### Form Pattern

**Service-only and service sections of full-service:**
- 5 fields: First Name, Phone Number, Zip Code, Service Needed (select),
  Message (textarea, optional)
- Service Needed options: Pool Cleaning / Pool Maintenance / Pool Repair /
  Pool Opening/Closing / Other
- Submit: "Schedule Service" (orange, full-width)
- Sub-line: "No contract required."
- Zip code required - pre-qualifies lead geographically

**Install-only and install section of full-service:**
- 5 fields: First Name, Phone Number, Zip Code, Project Type (select),
  Message (textarea, optional - prompt "Tell us about your project")
- Project Type options: New Pool Installation / Pool Renovation / Spa / Hot Tub
  Add-on / Not Sure Yet
- Submit: "Request a Free Quote" (orange, full-width)
- Sub-line: "No obligation. We will get back to you within 24 hours."
- Zip code required

**Full-service homepage form:** Default to the install-only form variant
(higher value lead). Service booking form lives on individual service pages.

For clients using Jobber or ServiceAutopilot: wire the hero primary CTA
directly to their booking URL for the service flow. On-page form becomes
secondary. This is the highest-converting pattern for service bookings.

---

### What the Factory Should NOT Do

1. Never use generic "home services" or "contractor" copy. Name "pool"
   specifically on every page and every section.
2. Never mix install and service CTAs in the same button group. "Book Online
   Now" and "Get a Free Quote" target different buyer states. Keep them separate.
3. Never put online booking language on an install page. A homeowner spending
   $40k does not want to "book online in 60 seconds."
4. Never put portfolio-and-warranty language on a service page as the lead
   message. Service buyers want "you show up every time," not "we built 300 pools."
5. Never use "Contact Us" as a primary CTA anywhere. Too weak.
6. Never use luxury or resort framing ("backyard oasis", "dream escape"). The
   register is professional reliability, not lifestyle aspiration.
7. Never use a hero image that does not include a pool.
8. Never bury the pricing section in FAQs for service-only clients. Transparent
   pricing belongs on the homepage. Hiding pricing implies hidden fees.
9. Never treat the install page like a service page. Installation is a
   $20k-80k+ decision. Copy must address scope, timeline, licensing, and
   warranty - not just "schedule a visit."
10. Never use em-dashes in copy. Single dash or comma only.
11. Never use AI-vocab: "seamless", "robust", "leverage", "game-changer",
    "cutting-edge", "comprehensive solutions". These break the blue-collar
    trust register.

---

## Part C - Brand-DNA Defaults for pool-services Niche

These are the niche-level defaults scaffolded into
`website-factory/templates/pool-services/src/config/brand-dna.js`.
Stage 10.1 overlays per-client values on top of these at build time.

```
palette:
  primary:       "#0D6CB6"   // nav background, section headers, primary buttons
  primary_dark:  "#0A1628"   // footer, headings, dark band sections
  primary_slate: "#1A3A5C"   // mid-tone for gradients, card borders
  accent:        "#F58026"   // CTA buttons, icon accents, hover states
  accent_light:  "#FDEBD0"   // button hover backgrounds, soft highlight bands
  accent_dark:   "#C45E0A"   // button hover/press states
  neutral:       "#F0F9FF"   // section background alternates, light band fills
  neutral_dim:   "#E2EDF7"   // card backgrounds, divider fills
  silver:        "#94A3B8"   // secondary text, captions, placeholder text
  ink:           "#0F172A"   // body copy, navigation text

typography:
  displayFont:      "Fjalla One"
  bodyFont:         "Inter"
  displayWeights:   [400]
  bodyWeights:      [400, 500, 600, 700]
  googleFontsQuery: "Fjalla+One&family=Inter:wght@400;500;600;700"
  lineHeight:
    headings: 1.15
    body:     1.65
  letterSpacing:
    display: "-0.01em"

voice_register:      "commercial"
shape_motif:         "water-ripple"
theme_mode_default:  "light"

corner_overlay:
  motif:   "concentric-arc"
  color:   "#2EA3F2"
  opacity: 0.08

motion_preset: "restrained"
// fade-in on scroll: opacity 0->1, translateY 16px->0, 400ms ease-out
// button hover: background 150ms ease, scale 1.02
// no parallax, no video autoplay
// prefers-reduced-motion: all transitions disabled
```

---

## Part D - Missing Fields

**Niche-level missing:**

| Field | Action needed |
|---|---|
| clientArchetype | Declared at Stage 1 intake for each client. Valid values: "service-only", "install-only", "full-service". This gates which pages are built and which copy register is used. |

All other niche-level directives (trust stack, copy voice, SEO targets,
form patterns, brand-dna defaults) are complete for all three archetypes.

**Per-client fields (all [MISSING], fill at /run-factory):**

| Field | Filled at stage |
|---|---|
| clientArchetype | Stage 1 intake - required first |
| company.name, shortName, tagline, url, description | Stage 1 intake |
| company.licenseNumber | Stage 1 intake (required for install + full-service) |
| company.serviceRegion | Stage 1 intake |
| contact.phone, phoneTelLink, email | Stage 1 intake |
| contact.googleMapsUrl, mapsEmbedUrl | Stage 2 research |
| address.street, city, state, zip, full, lat, lng | Stage 1 intake |
| hours.weekday, display, emergencyBadge | Stage 1 intake |
| social.facebook, instagram, linkedin, youtube | Stage 2 research |
| team.founder, founders array, group photo | Stage 4 asset harvest |
| reviews.rating, googleCount, facebookCount, items | Stage 2 research |
| services (client-specific names + descriptions) | Stage 5 strategy |
| serviceAreas (client's city list) | Stage 5 strategy |
| trust_badges (client's actual certifications) | Stage 4 asset harvest |
| previous_projects (service before/after OR install portfolio photos) | Stage 4 asset harvest |
| copy.* (all per-section copy bundles, archetype-specific) | Stage 6 copywriting |
| faq (answers customized to client + archetype) | Stage 6 copywriting |
| location_pages | Stage 5 strategy + Stage 10.2 personalize |
| meta.title, meta.description (per-page) | Stage 10.2 personalize |

---

## Validation

All fields required by `research/_structure/Website_Factory_Structure.md`:
- Niche-level fields: complete for all three archetypes
- clientArchetype: correctly noted as [MISSING, declare at Stage 1 intake]
- Per-client fields: correctly marked [MISSING, fill at /run-factory]
- No required field is silently blank

Brief is valid for locking.
