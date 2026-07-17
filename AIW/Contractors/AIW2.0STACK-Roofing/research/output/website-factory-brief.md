# Website Factory Brief -- Roofing Niche
# Module 5 output | Generated: 2026-06-26
# Student: Ayaan Khan
# Status: PENDING LOCK (awaiting student confirmation)

---

## Part A -- Niche Identity

```
niche: roofing
nicheLabel: Roofing Contractors
nicheCategory: home-services / trades / contractor

endCustomerProfile:
  who: Homeowners aged 35-65 facing a roof repair or replacement decision,
       typically triggered by storm damage, a discovered leak, or a GMB
       search while comparing 2-3 contractors.
  decisionMoment: The homeowner has already decided to hire a roofer.
                  They are on the website while waiting for a callback.
                  The website's only job is to make sure they call this
                  roofer instead of the next one on the list.
  topFears:
    - Being scammed or overcharged by a fly-by-night crew
    - Work taking longer than quoted or left unfinished
    - Insurance claim being denied or underpaid because of a bad contractor
  topPains:
    - Cannot tell which contractor is actually trustworthy from the outside
    - Previous bad experience with a roofer who left a mess or ghosted
    - Do not understand the insurance claim process and feel exposed

agencyPositioningSentence: "I help roofing companies win the trust of
  homeowners who are getting multiple quotes after a storm or a leak so
  they choose my client over the three other roofers that called them back."

agencyOneLiner: "I build websites for roofing companies that turn
  review-checkers into estimate requests."
```

---

## Part B -- Niche-Tailoring Directives

### Active template

- Path: `website-factory/templates/roofing/`
- Template version: 1
- Winner source: perth-roof-replacements (hero, color, typography) + priority-roofs-dallas (section order, form pattern, named team)
- Visual personality: Dark navy authority hero, teal primary CTAs, angular shapes, light content sections alternating with dark sections. Reads as direct, established, and confident -- not flashy.

---

### Trust stack (top 5, in order)

These appear in the TrustBar component and govern the copy agent's priority when writing trust copy. Order is non-negotiable.

1. **Google review count + star rating** -- shown in hero section AND trust bar. The number must be visible before the first scroll. This is the #1 conversion signal in roofing.
2. **GAF Master Elite / Owens Corning Platinum certification** -- if client has it, shown as badge image. If not, substitute "Licensed & Insured" with license number.
3. **License number (visible, not just "licensed")** -- the actual number (e.g. MHIC #123456). Separates legitimate operators from storm chasers in the homeowner's mind.
4. **Years in business** -- shown as a stat or in the founder section. "18 years" outperforms "established 2006".
5. **Before/after gallery** -- real job photos with real location labels. Not stock. Not "local project". Real addresses signal accountability.

Supporting signals (use if available, not required):
- BBB A+ badge
- Emergency availability badge ("24/7 Emergency Service")

---

### Hero composition

Already built into the template's `Hero.jsx`. Reference here for the copy agent and hero image agent.

- Subject: Crew working on a roof OR aerial view of a finished roof from street level. No stock interiors. No smiling contractors in an office.
- Mood: Confident, direct, reassuring. Dark overlay on photo creates contrast. Teal CTA button is the only saturated color on the hero.
- Layout: Full-bleed dark hero, content left-aligned on desktop, center-stacked on mobile.
- H1 template: `YOUR [CITY] ROOF. DONE ONCE, DONE RIGHT.` (uppercase, Barlow Condensed, 72px desktop)
- Subheadline template: `Free inspections. Same-day estimates. [N]+ 5-star reviews in [City].`
- Primary CTA: `GET A FREE ESTIMATE` (teal button, scrolls to #estimate-form)
- Secondary CTA: `Call [PHONE]` (ghost outline button)
- Social proof inline: Star rating row with review count, immediately below CTAs
- Trust bar: Immediately below hero fold. 5 badges horizontal. Dark background.

---

### Copy voice

**Voice register:** Direct, plain, specific. Never vague. Every claim gets a number or a name. "Licensed" is weak. "MHIC Licensed #123456" is strong. "Fast" is weak. "Done in one day" is strong.

**Sample headlines (from 03-copy-patterns.md):**

1. "Your [City] Roof. Done Once, Done Right." -- fear reversal (no redo anxiety)
2. "Free Roof Inspection -- No Pressure, No Sales Games" -- removes objection upfront
3. "[N] [City] Homeowners Chose Us. Here's Why." -- social proof + local
4. "We Handle the Insurance Claim Process for You" -- pain removal for storm damage jobs
5. "Storm Damage? Get a Free Roof Assessment Today" -- trigger-event hook

**Sample CTAs:**

1. `Get a Free Estimate` -- primary CTA, every page
2. `Schedule Your Free Inspection` -- softer alternative for service pages
3. `Talk to a Roofing Expert` -- humanized, good for chat widget and mobile bar
4. `Start My Insurance Claim` -- insurance claims page specific
5. `Call [PHONE] Now` -- mobile bar secondary CTA

**End-customer phrases to echo verbatim (from 02-customer-voice.md):**

These exact phrases or their direct equivalents must appear somewhere in the site copy:

1. "no pressure, no unnecessary upselling"
2. "communication really set them apart"
3. "cleanup every day"
4. "done in one day"
5. "no mess left behind"
6. "got 3 quotes" (reference it -- "homeowners compare. here's why we win that comparison")
7. "honest" / "straightforward"
8. "insurance claim" / "worked with our adjuster"
9. "would highly recommend"
10. "it's not always easy to find a contractor you can trust"

**Section-by-section copy rules (for the copy agent, per HomePage route):**

| Section | What the copy must convey |
|---|---|
| Hero | Who they are, where they are, how many homeowners trust them, one reason to call now. H1 is city-anchored and fear-reversing. |
| TrustBar | 5 signals in priority order. Show the number (review count, license #, years). No generic "licensed and insured" without the number. |
| EstimateForm | Header: "Get Your Free Estimate". Subtext: removes fear of commitment. 3-4 fields max. Phone is the key capture field. |
| ServicesGrid | Service name + 1-sentence plain-language description per service. No jargon. No "solutions". |
| WhyUs | 3-4 differentiators grounded in specific claims, not adjectives. "Done in one day" not "fast". |
| BeforeAfterGallery | Real jobs. Real addresses. Real results. Labels must include neighborhood or city name. |
| TeamSection | Named founder or owner. Years of experience. Photo if available. Humanizes the brand. |
| ReviewTiles | 3-6 real reviews. Show author first name + last initial. Show Google star rating. Show "Google Review" source label. |
| ProcessSteps | 4 steps. Plain language. Time expectations where relevant. Last step confirms cleanup. |
| InsuranceSection | Addresses the fear of claim denial. Explains what the contractor does on the homeowner's behalf. AI chatbot anchor. |
| FAQAccordion | Answer the 5 questions every homeowner asks before calling. Include insurance claim question. Include "how long does it take" question. |
| FinalCTA | Repeat primary CTA. Phone number. Reinforce the no-pressure message. |
| Footer | License number visible. Service areas listed. Legal name. Copyright year. |

---

### SEO targets

**Primary keywords (per 06-seo-landscape.md + 09-sitemap.json):**

| Keyword | Target page |
|---|---|
| `roofing contractor [city]` | HomePage |
| `roof replacement [city]` | ServiceRoofReplacementPage |
| `roof repair [city]` | ServiceRoofRepairPage |
| `storm damage roof repair [city]` | ServiceStormDamagePage |
| `emergency roof repair [city]` | ServiceEmergencyRepairPage |
| `roof insurance claim [city]` | InsuranceClaimsPage |
| `roofing [suburb]` | AreaPage (per suburb) |

**Secondary / long-tail:**
- `emergency roof repair near me`
- `24 hour roof repair [city]`
- `GAF certified roofer [city]`
- `insurance claim roof repair [city]`
- `roof replacement cost [city]`
- `hail damage roof [city]`

**Service pages (already in template):**
- `/services/roof-replacement`
- `/services/roof-repair`
- `/services/storm-damage`
- `/services/emergency-roof-repair`
- `/insurance-claims`

**Service-area pages (template route):**
- `/areas/[city-slug]` -- one per suburb in the client's service area

**Schema markup required:**
- `RoofingContractor` (not just `LocalBusiness`)
- `AggregateRating` (review stars in SERP)
- `FAQPage` (FAQ section)
- `Service` (per service offered)

**Key insight for the factory's SEO stage:** The Google Maps Pack is the real battleground, not organic rankings. GMB optimization + review count matter more than on-page SEO for a small roofing operator. The SEO stage must output GBP optimization instructions alongside on-page keyword targets.

---

### Form pattern

Already implemented in `EstimateForm.jsx`. Factory's intake stage should confirm:

- 3-4 fields only: Name, Phone (primary capture), Service needed (dropdown), Best time to call
- Phone is the required field -- roofers follow up by phone, not email
- No email-only forms
- Submit button: "Send My Estimate Request" or "Get My Free Estimate"
- Privacy line below submit: "No spam. No pressure. We call you."
- Mobile: full-width button, large touch target, tel-link below form

---

### What the factory must NOT do

From `09-template-spec.md` and niche research:

1. **No stock interior photos in the hero.** The hero image must be a real roof or a crew at work.
2. **No generic trust claims.** "Licensed and insured" without the license number is a loser pattern.
3. **No email-only contact forms.** Phone capture is primary in this niche.
4. **No buzzwords.** "Seamless", "robust", "solutions", "leverage" are forbidden (see `niche-playbook/vocabulary.json` avoid list).
5. **No exit intent popups.** Not expected in this niche. Creates distrust.
6. **Do not hide review count.** It must be in the hero or immediately below -- not in the footer or on a separate Reviews page only.
7. **No multi-step wizards for the estimate form.** Single-page form, 3-4 fields, one submit.
8. **No dark mode toggle.** The template is a fixed dark-hero / light-content hybrid. No toggle.

---

## Part C -- Brand DNA Defaults for Roofing Niche

These are the niche-level defaults Stage 10.1 uses as a starting point before overlaying per-client values.

```yaml
palette:
  primary: "#0ABFBC"
  primary_dark: "#089A97"
  primary_slate: "#0D4D4B"
  accent: "#F59E0B"
  accent_light: "#FDE68A"
  accent_dark: "#D97706"
  neutral: "#6B7280"
  neutral_dim: "#9CA3AF"
  silver: "#E5E7EB"
  ink: "#111827"
  bg: "#0A0F1A"
  surface: "#111827"
  surface_alt: "#F9FAFB"

typography:
  heading: "Barlow Condensed"
  body: "Inter"
  headingFontUrl: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&display=swap"
  bodyFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"

voice_register: "direct"
shape_motif: "angular"
theme_mode_default: "dark-hero-light-content"
jsonLdType: "RoofingContractor"

defaultServices:
  - { slug: "roof-replacement", name: "Roof Replacement" }
  - { slug: "roof-repair", name: "Roof Repair" }
  - { slug: "storm-damage", name: "Storm Damage" }
  - { slug: "emergency-roof-repair", name: "Emergency Repair" }
  - { slug: "insurance-claims", name: "Insurance Claims" }

copyLocks:
  - "No pressure. No upsell."
  - "Cleanup every day."
  - "Free estimate. No obligation."
  - "Licensed, insured, and local."
```

---

## Part D -- Missing Fields

These fields are required at `/run-factory` time (per-client intake). They are deliberately `[MISSING]` here -- this is a niche-level brief, not a client brief.

| Field | Where used | How to supply |
|---|---|---|
| `company.name` | All CTAs, nav, footer | Stage 1 intake |
| `company.url` | JSON-LD, internal links | Stage 1 intake |
| `contact.phone` | All CTAs, tel-links | Stage 1 intake |
| `contact.phoneTelLink` | Mobile bar, CTA buttons | Stage 1 intake (auto-derived) |
| `contact.email` | Contact form destination | Stage 1 intake |
| `address.*` | Footer, JSON-LD, GBP | Stage 1 intake |
| `company.licenseNumber` | TrustBar, Footer | Stage 2 research (GMB or state board lookup) |
| `reviews.rating` | Hero, TrustBar | Stage 2 research (GBP scrape) |
| `reviews.googleCount` | Hero, TrustBar | Stage 2 research (GBP scrape) |
| `reviews.items[]` | ReviewTiles | Stage 2 research (GBP scrape) |
| `trust_badges[]` | TrustBar | Stage 4 assets (client supplies or student finds SVG) |
| `previous_projects[]` | BeforeAfterGallery | Stage 4 assets (client supplies photos) |
| `team.founder.*` | TeamSection | Stage 1 intake or Stage 2 research |
| `copy.hero.headline` | Hero H1 | Stage 6 copy agent (city-anchored) |
| `copy.hero.subheadline` | Hero subhead | Stage 6 copy agent |
| `serviceAreas[]` | Footer, AreaPages | Stage 1 intake |
| `faq[]` | FAQAccordion | Stage 6 copy agent (use niche defaults as base) |

No required fields are silently blank. All missing items are flagged above.

---

## Confirmation

Review the above and confirm:

- Part A identity values are correct for the roofing niche
- Part B trust stack order matches what you want the factory to enforce
- Part D missing fields list is complete (nothing known that should be filled in now)

Reply "lock it" to set `m5.factoryBriefLocked=true` and proceed to `/tailor-factory`.
