ROOFING NICHE -- HOMEPAGE WIREFRAME
Phase 5a, Module 2D | Generated: 2026-06-26
Reference: perth-roof-replacements hero + priority-roofs-dallas structure

---

## Section 1: StickyNav

Layout variant: fixed-top, transparent-on-hero / dark-on-scroll

```
+------------------------------------------------------------------+
| [LOGO]          Services  About  Reviews  Contact    [PHONE BTN] |
+------------------------------------------------------------------+
```

Desktop:
- Logo left. Nav links center. Phone number as pill button right (teal border, white text).
- Background: transparent when hero is in viewport. Transitions to --color-bg (dark navy) on first scroll.
- Height: 64px.

Mobile:
- Logo left. Hamburger right. Phone number hidden in hamburger menu.
- Sticky. Dark background always on mobile (no transparent state).

Brand-dna paths: brandDNA.company.name, brandDNA.contact.phone, brandDNA.nav.links[]
SSIM region weight: excluded from SSIM (dynamic element)
prefers-reduced-motion: no transition on background color change (immediate swap)

---

## Section 2: Hero

Layout variant: full-bleed, left-content, dark overlay

```
+------------------------------------------------------------------+
|  [FULL-BLEED DARK ROOF PHOTO -- rgba(10,15,26,0.55) overlay]    |
|                                                                  |
|  [eyebrow: LICENSED & INSURED · [CITY], [STATE]]                |
|                                                                  |
|  YOUR [CITY] ROOF.                                              |
|  DONE ONCE, DONE RIGHT.                                         |
|                                                                  |
|  Free inspections. Same-day estimates.                          |
|  [N]+ 5-star reviews in [City].                                 |
|                                                                  |
|  ★★★★★  [N] Google Reviews                                      |
|                                                                  |
|  [GET A FREE ESTIMATE]      Call [PHONE]                        |
|                                                                  |
+------------------------------------------------------------------+
```

Desktop:
- Content left-aligned, max-width 640px, padding-left 80px.
- H1: Barlow Condensed 800 72px uppercase. Two lines.
- Subheadline: Inter 18px --color-text-secondary.
- Star row: 20px stars, teal color-star, "[N] Google Reviews" in 14px muted.
- Primary CTA: teal fill, 52px height, 20px padding horizontal, uppercase Barlow Condensed 600.
- Secondary CTA: plain text with arrow, white, 16px Inter.
- Hero min-height: 100vh.

Mobile (390px):
- Content centered.
- H1: 48px. Single or two lines.
- CTA: full width.
- Phone as plain text link below CTA.
- Min-height: 85vh (leaves trust bar peeking).

Brand-dna paths: brandDNA.copy.hero.headline, brandDNA.copy.hero.subheadline, brandDNA.copy.hero.eyebrow, brandDNA.contact.phone, brandDNA.reviews.count, brandDNA.reviews.rating, brandDNA.images.hero.background, brandDNA.cta.primary
SSIM region weight: 0.35 | threshold: 0.65

---

## Section 3: TrustBar

Layout variant: dark horizontal badge strip

```
+------------------------------------------------------------------+
| [GOOGLE ★★★★★ N reviews] | [GAF CERTIFIED] | [BBB A+] |        |
| [LICENSED & INSURED · Lic# XXXXX] | [X YEARS IN BUSINESS]      |
+------------------------------------------------------------------+
```

Desktop:
- 5 items in a single horizontal row. Dividers between items (1px --color-border).
- Background: --color-trust-bg (#0F172A).
- Height: 64px.
- Each item: icon/logo left, text right. Font: Inter 13px --color-text-secondary.
- GAF and BBB badges: SVG or PNG, max-height 28px.

Mobile:
- Horizontal scroll. Items do not wrap. Scroll indicator (faded edge) on right.
- Height: 56px.

Brand-dna paths: brandDNA.trust.googleReviewCount, brandDNA.trust.googleRating, brandDNA.trust.badges[], brandDNA.trust.licenseNumber, brandDNA.trust.yearsInBusiness
SSIM region weight: 0.10 | threshold: 0.60

---

## Section 4: EstimateForm

Layout variant: light section, asymmetric split (55/45)

```
+------------------------------------------------------------------+
| GET YOUR FREE ROOF ESTIMATE         | Name ________________     |
|                                     | Phone ______________      |
| No pressure. No games. Just an      | Service needed [v]        |
| honest assessment from a licensed   | Best time to call [v]     |
| local roofer.                       |                           |
|                                     | [SEND MY REQUEST]         |
| [PHONE] or fill in the form.        | No spam. Ever.            |
+------------------------------------------------------------------+
```

Desktop:
- Left col 55%: H2 "GET YOUR FREE ROOF ESTIMATE" (Barlow Condensed 40px dark), reassurance copy, phone number.
- Right col 45%: 4-field form in white card with 2px --color-border-light border, 24px padding.
- Form fields: Name, Phone, Service needed (dropdown: Replacement / Repair / Storm Damage / Emergency / Not Sure), Best time to call (dropdown: Morning / Afternoon / Evening / ASAP).
- Submit button: teal, full width, "SEND MY REQUEST".
- Reassurance line: 12px muted text below button: "No spam. We call back within 2 hours."
- Background: --color-surface-alt.

Mobile:
- Single column. Form fields full width. Left copy stacks above form.

Brand-dna paths: brandDNA.copy.form.headline, brandDNA.copy.form.reassurance, brandDNA.contact.phone, brandDNA.copy.cta.formSubmit
SSIM region weight: 0.20 | threshold: 0.60

---

## Section 5: ServicesGrid

Layout variant: light section, 2x3 card grid

```
+------------------------------------------------------------------+
| OUR ROOFING SERVICES                                            |
|                                                                  |
| [Roof Replace]  [Roof Repair]   [Storm Damage]                  |
| [Emergency]     [Gutter Svcs]   [Free Inspect]                  |
+------------------------------------------------------------------+
```

Desktop:
- H2: Barlow Condensed 40px.
- 6 cards in 3-column x 2-row grid. Gap 24px.
- Each card: 240x200px. Service photo (real project) as card background with dark overlay. Title in Barlow Condensed 22px white. 1-line description Inter 14px --color-text-secondary. "Learn More" teal link.
- Hover: card lifts (translateY -4px), overlay slightly lighter.

Mobile:
- Single column stack. Cards 100% width, 160px height.

Brand-dna paths: brandDNA.services[] (title, description, image, slug)
SSIM region weight: 0.10 | threshold: 0.55

---

## Section 6: WhyUs

Layout variant: dark section, 4-column stat/icon row

```
+------------------------------------------------------------------+
| WHY [COMPANY NAME]?                                             |
|                                                                  |
| [icon]          [icon]          [icon]          [icon]          |
| Done in 1 Day   Insurance Help  No Mess Left    Lifetime Warranty|
| Speed on site   We guide you    Daily cleanup   On every install |
+------------------------------------------------------------------+
```

Desktop:
- Dark background (--color-surface). 4 columns. Each column: icon (SVG, teal, 40px), bold title (Barlow Condensed 20px white), 2-line description (Inter 14px --color-text-secondary).
- No borders between columns. Generous padding (80px vertical).

Mobile:
- 2x2 grid.

Brand-dna paths: brandDNA.differentiators[] (icon, title, description)
SSIM region weight: excluded (no direct reference in winner screenshot)

---

## Section 7: BeforeAfterGallery

Layout variant: light section, slider with toggle

```
+------------------------------------------------------------------+
| OUR WORK  [City] -- Real Projects, Real Results                 |
|                                                                  |
| [<]  [BEFORE | AFTER photo pair -- toggle slider]  [>]          |
|      Mockingbird Heights · Roof Replacement · 2024              |
|                                                                  |
| [See All Projects]                                              |
+------------------------------------------------------------------+
```

Desktop:
- 3 before/after pairs visible simultaneously. Left/right nav arrows.
- Each pair: side-by-side 50/50 with a center drag handle or click toggle.
- Label below each pair: neighborhood + service type + year.
- Min 6 pairs in the carousel.

Mobile:
- Single pair full width. Swipe to advance. Toggle on tap.

Brand-dna paths: brandDNA.gallery[] (beforeImage, afterImage, location, serviceType, year)
SSIM region weight: excluded (gallery content is per-client)

---

## Section 8: TeamSection

Layout variant: light section, headshot grid

```
+------------------------------------------------------------------+
| MEET YOUR [CITY] ROOFING TEAM                                   |
|                                                                  |
| [Photo]  [Photo]  [Photo]  [Photo]                             |
| Name     Name     Name     Name                                 |
| Title    Title    Title    Title                                 |
+------------------------------------------------------------------+
```

Desktop:
- 4-column grid. Each headshot: square crop, 200x200px, border-radius 4px.
- Name: Barlow Condensed 18px dark. Title: Inter 14px muted.
- Optional: 1-line quote below title in italics.

Mobile:
- 2x2 grid.

Brand-dna paths: brandDNA.team[] (name, title, photo, quote)
SSIM region weight: excluded (per-client content)

---

## Section 9: ReviewTiles

Layout variant: dark section, 3-column card row

```
+------------------------------------------------------------------+
| [N] HOMEOWNERS IN [CITY] TRUST [COMPANY NAME]                  |
|                                                                  |
| ★★★★★                ★★★★★                ★★★★★              |
| "Review excerpt      "Review excerpt      "Review excerpt       |
|  max 3 lines..."      max 3 lines..."      max 3 lines..."      |
| -- Reviewer Name     -- Reviewer Name     -- Reviewer Name      |
| 3 months ago         2 months ago         1 month ago           |
|                                                                  |
| [Read All N Reviews on Google]                                  |
+------------------------------------------------------------------+
```

Desktop:
- Dark background (--color-surface). 3 review cards in a row.
- Each card: white border 1px, 24px padding, teal star row, review text Inter 15px, reviewer name Inter 14px muted, date Inter 12px muted.
- Section headline: Barlow Condensed 40px white.

Mobile:
- Horizontal scroll. Cards 85vw each.

Brand-dna paths: brandDNA.reviews.items[] (text, reviewer, date, rating), brandDNA.reviews.count, brandDNA.reviews.googleUrl
SSIM region weight: 0.10 | threshold: 0.55

---

## Section 10: ProcessSteps

Layout variant: light section, 4-step horizontal timeline

```
+------------------------------------------------------------------+
| HOW IT WORKS                                                    |
|                                                                  |
| [1]----------[2]----------[3]----------[4]                      |
| Free          Estimate     Install       Final                   |
| Inspection    Review       Day           Walkthrough             |
| We assess     We walk you  Crew arrives  We inspect              |
| damage        through      on time       with you               |
+------------------------------------------------------------------+
```

Desktop:
- 4 steps in a horizontal row. Connected by a teal line.
- Step number: 40px circle, teal fill, white number, Barlow Condensed.
- Step title: Barlow Condensed 20px dark.
- Step description: Inter 14px muted, max 2 lines.

Mobile:
- Vertical stack. Line runs down the left side.

Brand-dna paths: brandDNA.process.steps[] (number, title, description)
SSIM region weight: excluded

---

## Section 11: InsuranceSection

Layout variant: dark section, split 50/50

```
+------------------------------------------------------------------+
| WE HANDLE THE                | Storm damage to your roof?       |
| INSURANCE PROCESS            |                                   |
| FOR YOU.                     | We guide you through every step  |
|                              | of the insurance claim process -- |
| Most homeowners don't know   | from first call to final sign-off.|
| what to say to their         |                                   |
| adjuster. We do.             | [START YOUR CLAIM WALKTHROUGH]   |
|                              |                                   |
|                              | <!-- VOICEFLOW_CHATBOT_TRIGGER -->|
+------------------------------------------------------------------+
```

Desktop:
- Dark background (--color-bg). Left col: H2 headline Barlow Condensed 48px white + bold subhead. Right col: body copy Inter 16px --color-text-secondary + teal CTA button.
- This section is the primary chatbot trigger point.

Mobile:
- Single column stack. Headline above, copy below, CTA full width.

Brand-dna paths: brandDNA.copy.insurance.headline, brandDNA.copy.insurance.body, brandDNA.cta.insurance
SSIM region weight: excluded

---

## Section 12: FAQAccordion

Layout variant: light section, single column

```
+------------------------------------------------------------------+
| FREQUENTLY ASKED QUESTIONS                                      |
|                                                                  |
| [+] How long does a roof replacement take?                      |
| [+] Do you work with insurance companies?                       |
| [+] What materials do you use?                                  |
| [+] Do you offer a warranty?                                    |
| [+] Repair or full replacement -- how do I know?                |
| [+] Are you licensed and insured in [State]?                    |
| [+] How fast can you give me an estimate?                       |
+------------------------------------------------------------------+
```

Desktop:
- Max-width 800px, centered. One accordion item open at a time.
- Item header: Inter 600 18px dark, + icon right. Expands to reveal answer Inter 16px muted.

Mobile:
- Full width. Same behavior.

Brand-dna paths: brandDNA.faq.items[] (question, answer)
SSIM region weight: excluded

---

## Section 13: FinalCTA

Layout variant: dark section, centered

```
+------------------------------------------------------------------+
|         GET YOUR FREE ROOF ESTIMATE TODAY                       |
|                                                                  |
|   No pressure. No games. Just an honest assessment.             |
|                                                                  |
|         [GET A FREE ESTIMATE]      [CALL [PHONE]]               |
+------------------------------------------------------------------+
```

Desktop:
- Full-width dark section (--color-bg). Content centered, max-width 640px.
- H2 Barlow Condensed 48px white. Subline Inter 18px --color-text-secondary.
- Two buttons side by side: primary teal, secondary ghost white border.

Mobile:
- Buttons stack vertically, full width.

Brand-dna paths: brandDNA.copy.cta.finalHeadline, brandDNA.copy.cta.finalSub, brandDNA.contact.phone, brandDNA.cta.primary
SSIM region weight: excluded

---

## Section 14: Footer

Layout variant: dark, 4-column

```
+------------------------------------------------------------------+
| [LOGO]          Services        Company        Contact          |
| [Tagline]       Replacement     About Us       [Phone]          |
|                 Repair          Reviews        [Email]          |
| [GAF] [BBB]     Storm Damage    FAQ            [Address]        |
|                 Emergency       Blog                            |
|                 Gutters                                         |
|                                                                  |
| Lic# [LICENSE] · Licensed & Insured in [State]                 |
| [N] 5-Star Google Reviews · © [YEAR] [COMPANY NAME]            |
| Privacy Policy                                                  |
+------------------------------------------------------------------+
```

Brand-dna paths: brandDNA.company.*, brandDNA.contact.*, brandDNA.nav.*, brandDNA.trust.licenseNumber, brandDNA.trust.badges[]
SSIM region weight: 0.05 | threshold: 0.50

---

## Mobile Sticky Bar (global)

Fixed to bottom of viewport on mobile only:

```
+-------------------------+
| [CALL NOW] [FREE QUOTE] |
+-------------------------+
```

Two buttons, full width, 56px height. Left: phone icon + "CALL NOW" (teal fill). Right: "FREE QUOTE" (dark fill, white text). Links to click-to-call and #estimate-form anchor respectively.

Brand-dna paths: brandDNA.contact.phone, brandDNA.cta.primary
