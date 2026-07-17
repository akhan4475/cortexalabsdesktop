# Website Factory Brief: Landscaping

**Generated:** 2026-07-01
**Student:** Ayaan Khan
**Niche:** Landscaping (design/install, 1-20 employees)
**Template:** `website-factory/templates/landscaping/`
**Status:** Template brief. All `[MISSING]` fields are collected at Stage 1 intake.

---

## SECTION 1: Client Identity

These fields are `[MISSING]` because no real client is locked in yet. Stage 1 (intake agent) collects them. Every `[MISSING]` must be filled before Stage 7 (brand DNA) runs.

| Field | Value |
|---|---|
| Business name | [MISSING] |
| Short name (for NavBar logo) | [MISSING] |
| Tagline | [MISSING] |
| Website URL (if existing) | [MISSING] |
| Owner / founder name | [MISSING] |
| Owner first name (for "Meet Marcus"-style heading) | [MISSING] |
| Owner title | [MISSING] |
| Years of experience | [MISSING] |
| State contractor license number | [MISSING] |
| Phone (display format) | [MISSING] |
| Phone (tel: link format) | [MISSING] |
| Email | [MISSING] |
| Street address | [MISSING] |
| City | [MISSING] |
| State | [MISSING] |
| ZIP | [MISSING] |
| Primary service region label (e.g. "Dallas-Fort Worth Metroplex") | [MISSING] |
| Google Maps URL | [MISSING] |
| Google Maps embed URL | [MISSING] |
| Facebook URL | [MISSING] |
| Instagram URL | [MISSING] |
| Google review count | [MISSING] |
| Google average star rating | [MISSING] |

---

## SECTION 2: Services

**Required:** At least 3 services. Max: 8. Each needs a slug, a display name, and a one-line body.

Defaults from the niche playbook (swap or trim as needed per client):

| Slug | Display name | One-line body |
|---|---|---|
| `landscape-design` | Landscape Design | Full design and install -- from bare dirt to a yard you are proud of. |
| `lawn-maintenance` | Lawn Maintenance | Consistent mowing, edging, and seasonal care on your schedule. |
| `hardscaping` | Hardscaping | Patios, walkways, retaining walls, and outdoor kitchens built to last. |
| `irrigation` | Irrigation Systems | Smart irrigation that keeps your yard green without wasting water. |
| `sod-installation` | Sod Installation | Fresh sod installed and watered -- ready to walk on in days, not months. |
| `tree-care` | Tree Care | Trimming, shaping, and removal handled safely by a licensed crew. |

**Stage 1 instruction:** Ask the client which services they actually offer. Remove any they don't. Add any missing.

---

## SECTION 3: Service Areas

**Required:** 3-8 cities. The primary city drives every H1 headline and every service page title. Secondary cities get their own `/service-areas/:citySlug` landing pages for local SEO.

| Field | Value |
|---|---|
| Primary city (hero H1 token) | [MISSING] |
| Secondary cities (service area pages) | [MISSING] |
| Neighborhood list for primary city (optional) | [MISSING] |

**Stage 1 instruction:** Ask the client to list every city or town they actively serve. 5-8 is the sweet spot. More than 8 dilutes the local SEO signal per page.

---

## SECTION 4: Project Portfolio

**Required:** At least 4 before/after project photos to enable the portfolio section. 8-16 is ideal.

| Field | Value |
|---|---|
| Number of projects available | [MISSING] |
| Project photos source | [MISSING] (Instagram / Google / client sends directly) |
| Drone footage available? | [MISSING] |

**Photo quality rules (from `tools/qualify-photos.py`):**
- Minimum 1440px wide
- Sharp mow lines, defined bed borders, crisp hardscape
- Green against dark mulch or stone for contrast
- No people unless brand is lifestyle-oriented
- No watermarks, timestamps, or heavy filters

**If fewer than 4 photos available:** The portfolio section is hidden and the gallery block in HomePage.jsx is removed. The hero falls back to the deep-green gradient.

**Hero image requirement (Stage 9):** One 1440px+ wide, landscape-orientation, completed-project photo. Overhead or wide angle preferred. This is used as the hero background. If client has none, Stage 9 generates a synthetic hero via Gemini Image API using the niche hero composition spec.

---

## SECTION 5: Business Hours

| Field | Value |
|---|---|
| Weekday hours (Mon-Fri) | [MISSING] |
| Saturday hours | [MISSING] (null if closed) |
| Sunday hours | [MISSING] (null if closed) |
| IANA timezone | [MISSING] (e.g. America/Chicago) |
| Emergency badge (e.g. "24/7 irrigation repair") | [MISSING] (null if not offered) |

**Note:** `MobileBottomBar.jsx` uses `businessHours.tz`, `.open`, `.close` to compute `isBusinessOpen()`. Timezone must be a valid IANA string.

---

## SECTION 6: Owner Story

**Required for `FounderSection.jsx`.** Written by Stage 6 (copy-deck agent) from intake answers. The intake agent asks these questions directly:

1. How many years have you been doing landscaping?
2. What did you do before starting this business?
3. Why did you start your own company?
4. What do you do differently from larger crews?
5. What is your personal commitment to every job?

**Copy template (filled by Stage 6):**

- `copy.founder.para1`: Why they started + what they saw that others got wrong. 2-3 sentences.
- `copy.founder.para2`: How they operate differently. Small crew, owner on site, direct line. 2-3 sentences.
- `copy.founder.vision`: One sentence. The outcome they want for every client.
- `copy.founder.mission`: One sentence. How they operate on every job.

**Voice rule:** Calm and competent. First person plural ("we"). No buzzwords. No "passion" or "dedication."

**Founder photo:** One headshot or on-site action photo. Stage 4 (asset scraper) harvests from Google Business Profile or Instagram. If unavailable, FounderSection hides the image and runs text-only layout.

---

## SECTION 7: Reviews

**Required:** At least 3 review objects with `author`, `source`, `rating`, `text`.

The copy-deck agent writes the `reviews` heading and body from the actual review count and rating. The hero eyebrow is locked to: `[N] stars · [COUNT] Google Reviews` (from `copy-locks.json`).

**Review sourcing:** Stage 2 (research agent) scrapes Google Maps reviews via `tools/apify-scrape.py`. The copy-deck agent picks the 3-5 most specific reviews (not "great service!", but reviews that name what the crew did, how they communicated, and the outcome).

**Selection criteria:**
- Must mention a specific service (design, hardscaping, irrigation, etc.)
- Must mention responsiveness, communication, or outcome quality
- Must not contain emoji-heavy text that looks spammy
- Prefer reviews that use the customer's own words (not marketing language)

---

## SECTION 8: Copy -- Locked and Variable

### Locked copy (from `niche-playbook/copy-locks.json` -- do not change)

| Field | Value |
|---|---|
| Form header | "Get Your Free Landscape Estimate" |
| Form subtext | "We respond within 2 hours. No commitment, no hard sell." |
| Primary CTA button | "Get a Free Estimate" |
| Submit button | "Request My Free Estimate" |
| Privacy line | "We never share your info. No spam. No hard sell." |
| Mobile call label | "Call Now" |
| Available now label | "Available now" |
| Footer CTA | "Ready to transform your yard?" |
| Top bar CTA | "Call for a Free Estimate" |
| Hero trust chips | "Licensed & Insured", "Same-Day Response", "Free Estimates" |

### Locked formulas (copy-deck agent fills tokens)

| Formula | Pattern |
|---|---|
| Hero headline | "Transform Your [City] Yard" |
| Hero subheadline | "Responsive, on time, done right -- from first call to final cleanup." |
| Hero eyebrow | "[RATING] stars · [COUNT] Google Reviews" |

### Variable copy (Stage 6 writes from intake data)

| Field | Notes |
|---|---|
| Company tagline | 8-12 words. City-specific. Calm register. No buzzwords. |
| Meta title | "[Business Name] | [City] Landscaping Design & Installation" |
| Meta description | 140-160 chars. Includes city, core service, license/insured, free estimate. |
| Why choose us (4 bullets) | Direct benefit statements. Starts with a verb. No adjectives alone ("We Show Up On Time", not "Reliable"). |
| Process step 1 title + body | "Free Consultation" + 2 sentences on what happens. |
| Process step 2 title + body | "Custom Design + Quote" + 2 sentences. |
| Process step 3 title + body | "We Build It Right" + 2 sentences. |
| FAQ (6 entries minimum) | Must include: cost in city, free estimate, timeline, licensed/insured, irrigation (if offered), service area. See Section 9. |
| Owner para 1 | Origin story. Why they started. 2-3 sentences. |
| Owner para 2 | Operating philosophy. Small crew, direct line. 2-3 sentences. |
| Owner vision | One sentence. |
| Owner mission | One sentence. |
| Services section heading | "Full-Service Landscaping for [City] Homeowners" |
| Reviews heading | "[COUNT] Happy Homeowners in [City]" |
| Reviews summary | "[RATING]-star average across [COUNT] Google reviews." |
| Service area body | "Not sure if we cover your neighborhood? Call us and we will confirm same day." |
| Gallery heading | "What We Have Built" |

---

## SECTION 9: FAQ

**Required:** 6 entries minimum. Stage 6 writes them from the intake data.

**Required FAQ topics (do not omit any):**

1. How much does landscaping cost in [City]? -- Answer must include a price range. Do not dodge.
2. Do you offer free estimates? -- Answer: yes, within 24 hours, no obligation.
3. How long does a project take? -- Answer: typical timeline by scope.
4. Are you licensed and insured? -- Answer must state the actual license number and coverage type.
5. [Service-specific question] -- e.g. "Do you install irrigation systems?" if irrigation is offered.
6. What areas do you serve? -- Answer must list all cities explicitly.

**Tone rule:** Plain answers to real questions about cost, timing, and credentials. No hedging. No "it depends" without a range.

---

## SECTION 10: Trust Signals

**Priority order (from `05-trust-signals.md`, never reorder):**

1. Before/after portfolio with named local projects (HIGHEST)
2. Google review count + star rating
3. Licensed + insured badge with state license number
4. Service area map or neighborhood list
5. Design expertise signal (named designer + free design consultation language)

**Trust badges to collect at Stage 4:**

| Badge | Priority | Collect from |
|---|---|---|
| Licensed & Insured badge (with license number) | Required | Client provides license number; badge is generated in-template |
| NALP member badge | Optional | Client's website or membership card |
| ISA Certified Arborist | Optional | Only if tree care is offered |
| Licensed Irrigation Contractor | Optional | Only if irrigation is offered |
| BBB Accredited | Optional | Client's BBB profile page |
| Google Guaranteed | Optional | Client's Google Business Profile |

**Note:** TrustBar.jsx currently reads `brandDNA.trust_badges[0]` for the badge slot in the top trust strip. If no badge image is available, the slot is hidden.

---

## SECTION 11: Design System

**These are fixed for all landscaping clients. Do not change per client.**

| Token | Value |
|---|---|
| Primary | `#0d3320` (deep forest green) |
| Primary dark | `#091f14` |
| Primary slate | `#1a4d30` |
| Accent | `#4ade80` (lime green) |
| Accent light | `#86efac` |
| Accent dark | `#16a34a` |
| Neutral | `#94a3b8` |
| Ink | `#f8fafc` |
| Heading font | Fraunces (serif, optical size, variable) |
| Body font | Plus Jakarta Sans |
| Motion preset | "restrained" -- duration 400ms, stagger 80ms |
| Shape motif | leaf |
| Theme mode | light |

**inject-theme.mjs** writes these into `index.css` `:root` block and Google Fonts imports automatically from `brand-dna.js`. No manual CSS editing needed.

---

## SECTION 12: SEO Architecture

**Stage 3 produces `keyword-architecture.md` for the client's specific city. This section is the niche framework that Stage 3 follows.**

### Homepage target keyword
`[city] landscaping` or `landscaping company [city]`

### Service page keywords (one per service)
Pattern: `[service] [city]` or `[city] [service]`

Examples:
- `landscape design dallas`
- `hardscaping dallas tx`
- `irrigation system installation dallas`
- `sod installation dallas`
- `lawn maintenance dallas`

### Location page keywords
Pattern: `landscaping [secondary city]` or `lawn care [secondary city]`

One page per secondary city. 300+ words of unique content per page. Not thin duplicate pages.

### FAQ page targets
Pattern: `how much does landscaping cost in [city]` -- high-intent, pre-qualified buyer.

### Schema markup (Stage 10.2 injects all)
- `LocalBusiness` with `aggregateRating`, `openingHoursSpecification`, `areaServed`
- `Service` schema per service page
- `FAQPage` schema on FAQ page and homepage FAQ section
- `BreadcrumbList` on all inner pages

---

## SECTION 13: Hero Image Spec

**Stage 9 generates the hero if the client has no qualifying photo.**

From `niche-playbook/hero-composition.md`:

- Format: 1500x700px, photorealistic
- Subject: Completed landscaping project -- wide or overhead angle
- Requirements: Sharp mow lines, defined bed borders, crisp hardscape, green against dark mulch/stone
- No people unless brand is lifestyle-oriented
- No watermarks
- Mood: premium residential, confident, peaceful

Gemini prompt seed (hero-image agent expands from this):
> "Wide-angle photography of a premium residential landscaping project. Lush green lawn, defined stone border, mature ornamental trees, clean mulched beds. Photographed from a slight elevation angle. Golden hour light. Photorealistic, no logos, no text."

---

## SECTION 14: Pages to Build

**All 13 pages are included in every landscaping build. No pages are optional.**

| Page | Route | Primary SEO target |
|---|---|---|
| HomePage | `/` | `landscaping [city]` |
| AboutPage | `/about` | brand / trust |
| ServicesPage | `/services` | `landscaping services [city]` |
| ServiceDetailPage | `/services/:slug` | `[service] [city]` (one per service) |
| PortfolioPage | `/portfolio` | `landscaping before after [city]` |
| ReviewsPage | `/reviews` | `landscaping reviews [city]` |
| ServiceAreasPage | `/service-areas` | `areas we serve` |
| ServiceAreaDetailPage | `/service-areas/:citySlug` | `landscaping [secondary city]` |
| BlogPage | `/blog` | content hub |
| BlogPostPage | `/blog/:slug` | long-tail cost/how-to queries |
| ContactPage | `/contact` | `contact [business name]` |
| FaqPage | `/faq` | `how much does landscaping cost [city]` |
| NotFoundPage | `*` | 404 |

---

## SECTION 15: Pipeline Execution Checklist

When a real client is locked in, run these stages in order. Every stage must pass its gate before the next begins.

- [ ] **Stage 1 (intake):** Run `/build-all` or open `website-factory/` in a new Claude session. Collect all `[MISSING]` fields from Section 1-3.
- [ ] **Stage 2 (research):** Apify GBP scrape. Confirm review count, rating, services, service areas, hours. Outputs `research.json`.
- [ ] **Stage 3 (SEO):** Keyword architecture for the client's primary city and all secondary cities.
- [ ] **Stage 4 (assets):** Harvest logo, project photos, founder photo, trust badges. `qualify-photos.py` scores all project photos.
- [ ] **Stage 5 (strategy):** Confirm sitemap.json. Section order follows niche playbook.
- [ ] **Stage 6 (copy deck):** Write all copy. Locked strings from `copy-locks.json` are used verbatim. Variable copy follows Section 8 above. FAQ minimum 6 entries per Section 9.
- [ ] **Stage 7 (brand DNA):** Extract brand DNA from logo + research + copy. Confidence gate: 0.70+. If below, `/approve-brand-dna`.
- [ ] **Stage 7.5 (brand resonance):** Optional. Run if client has an existing website. Informs Stage 7.
- [ ] **Stage 9 (hero image):** Client photo preferred. If no qualifying photo, generate via Gemini.
- [ ] **Stage 10.1 (build):** `tools/build-from-template.py`. Clones landscaping template, overlays brand-dna, runs `npm run build`.
- [ ] **Stage 10.2 (personalize):** SEO injection, schema markup, sitemap.xml.
- [ ] **Stage 10.3 (uplift):** Niche-specific polish per niche playbook uplift rules.
- [ ] **Stage 10.4a-d (QA):** Design fidelity, SOP compliance, DOM fidelity, Lighthouse LCP < 3s.
- [ ] **Stage 11 (deploy):** Vercel CLI deploy. Student gets live URL.
- [ ] **Stage 12 (delivery):** Delivery report.
- [ ] **Stage 13 (proposal):** HTML proposal for the client.

---

## SECTION 16: Key Decisions Made by This Niche Research

These are baked into the template. The factory does not re-decide them per client.

**Section order on HomePage (from `cro-rules.md` -- fixed):**

1. TrustBar (above NavBar, desktop only)
2. NavBar
3. HeroSection
4. TrustBarInline (star rating + license)
5. ServicesSection
6. PortfolioSection (6 projects)
7. WhyChooseSection
8. ProcessSection (3 steps)
9. ReviewsSection
10. FounderSection
11. ServiceAreasSection
12. FaqSection
13. CtaFinalSection (6-field lead form)
14. FooterSection
15. MobileBottomBar (mobile only)

**Why this order:** Trust bar at top (Mountainscapers pattern) signals credentials before the customer even reads the headline. Portfolio before reviews because landscaping is a visual purchase. Founder after reviews so social proof validates the person. FAQ before CTA because cost questions are the primary pre-contact barrier.

**CTA rules:**
- Above-fold: 2 CTAs (accent-filled "Get a Free Estimate" + outlined click-to-call)
- One CTA per section mid-page
- CtaFinalSection is the primary lead capture form
- MobileBottomBar always visible on mobile

**Form fields (6, fixed):** Name, phone, email, zip code, service dropdown (6 options), project description textarea.

**AI chatbot:** Voiceflow widget. Wired at Stage 10.3 (uplift). Positioned fixed bottom-right, z-index below MobileBottomBar. Captures: name, phone, zip, service interest. Routes to email or CRM webhook.

---

## Validation Checklist

Before locking this brief and running the factory, confirm:

- [ ] All `[MISSING]` fields in Section 1 are filled (required before Stage 7)
- [ ] At least 3 services confirmed (Section 2)
- [ ] Primary city confirmed -- this token drives every H1 and every service page title (Section 3)
- [ ] At least 3 secondary cities listed for location pages (Section 3)
- [ ] Portfolio photo count known (Section 4)
- [ ] Business hours + timezone confirmed (Section 5)
- [ ] FAQ list has at least 6 topics with the client's actual license number (Section 9)
- [ ] State contractor license number confirmed (Section 10)

If any of the above are missing when the factory runs, Stage 1 catches them and halts until collected.

---

## Source Traceback

- `research/02-niche-research/landscaping/02-customer-voice.md`: Copy voice, locked phrases, customer language
- `research/02-niche-research/landscaping/05-trust-signals.md`: Trust priority order, badge list
- `research/02-niche-decision.md`: Prospect types, money math, niche positioning
- `research/03-offer-pack.md`: Positioning sentence, offer structure
- `research/_structure/Website_Factory_Structure.md`: Factory structure, all agents, SOPs, tools
- `website-factory/templates/landscaping/niche-playbook/copy-locks.json`: Locked copy strings
- `website-factory/templates/landscaping/niche-playbook/vocabulary.json`: Voice register, preferred terms, banned words
- `website-factory/templates/landscaping/niche-playbook/hero-composition.md`: Hero layout spec, image requirements
- `website-factory/templates/landscaping/niche-playbook/cro-rules.md`: Section order, CTA rules, form rules
