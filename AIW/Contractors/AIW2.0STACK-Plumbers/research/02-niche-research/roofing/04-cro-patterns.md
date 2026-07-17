# 04 - CRO Patterns: Roofing

Source: `raw/agencies-search.json` (agency site descriptions + case study references), `raw/serp-rankings.json` (top-ranking roofing company titles). CRO-crawl screenshots not collected. Patterns inferred from SERP analysis, agency outputs, and review voice data. [inferred where noted]

---

## Most Common Section Sequence

Based on analysis of top-ranking roofing sites referenced in SERP and agency portfolios [inferred from agency descriptions + SERP patterns]:

1. **Hero** -- headline + primary CTA ("Get Free Estimate") + phone number
2. **Social proof bar** -- star rating + review count + certification badges (GAF, BBB)
3. **Services grid** -- roof replacement, roof repair, storm damage, emergency, gutters
4. **Why us** -- 3-4 differentiators (local, licensed, cleanup, warranty)
5. **Gallery / before & after** -- photo proof of work quality
6. **Review section** -- Google reviews embedded or screenshot tiles
7. **Process steps** -- "How it works" (inspection, estimate, install, cleanup)
8. **FAQ** -- insurance claims, timeline, warranty questions
9. **Final CTA** -- repeat of primary CTA with phone + form

---

## Hero Composition

- **Imagery subject:** Crew working on roof, finished roof from street view, or aerial shot of neighborhood. Rarely stock photos on high-performing sites. [inferred]
- **Primary CTA:** "Get a Free Estimate" or "Free Inspection" -- always above the fold.
- **Secondary CTA:** Phone number, often click-to-call. Displayed prominently in header.
- **Social proof placement:** Star rating + review count within hero section or immediately below. GAF/BBB badges in hero bar or sticky header.

---

## Trust Stack Ordering

Priority order observed across winning roofing sites:

1. Google review count + star rating (most visible, highest frequency signal)
2. GAF Master Elite / Owens Corning Platinum / manufacturer certification
3. BBB accreditation
4. Years in business
5. Licensed + insured statement
6. Before/after gallery
7. Warranty terms

---

## Form Patterns

- **Optimal form:** 3-4 fields. Name, phone, service needed (dropdown), best time to call.
- **Field count:** Fewer fields outperform longer forms. Phone is the key capture field -- roofers prefer to call back, not email.
- **Form placement:** Hero section (primary), bottom of page (secondary). Sticky mobile CTA bar with click-to-call + short form link.
- **What to avoid:** Email-only forms. Roofers with mobile audiences need click-to-call as primary conversion path. [inferred from review data showing phone-based scheduling]

---

## Sticky Elements

- **Sticky header:** Logo + phone number + "Get Free Estimate" CTA. Phone number always visible on desktop.
- **Mobile CTA bar:** Fixed bottom bar with click-to-call button and "Free Estimate" link. Critical for mobile traffic.
- **Exit intent:** Not common in this niche [inferred]. Not recommended for first build.

---

## Divergence from Universal Converting Wireframe

The universal wireframe places testimonials in section 4-5. Roofing wins by moving social proof (review count + badges) to the hero section or immediately below -- earlier than most niches. The trust gap is the #1 conversion barrier in roofing, so trust signals lead the page rather than follow the offer.

---

## Source Traceback
- `raw/serp-rankings.json`: 42 organic results analyzed for site structure signals via title/meta
- `raw/agencies-search.json`: Agency site descriptions + case study references
- `raw/maps-reviews.json`: Review language used to infer form and CTA preferences
- [inferred] Section order and sticky patterns derived from agency portfolio descriptions and SERP winner patterns
