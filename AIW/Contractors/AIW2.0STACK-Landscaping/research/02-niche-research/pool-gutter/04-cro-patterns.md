# 04 - CRO Patterns: Pool & Gutter

Source: `raw/agencies-search.json`, `raw/maps-reviews.json`, `raw/serp-rankings.json`. No CRO crawl screenshots. [inferred]

---

## Most Common Section Sequence

1. **Hero** -- headline + primary booking/quote CTA + phone number
2. **Social proof bar** -- review count, star rating, years in business
3. **Services grid** -- pool cleaning, pool repair, pool opening/closing (pool); gutter cleaning, gutter guard install, downspout cleaning (gutter)
4. **Booking widget or instant quote** -- key differentiator from other home services; online booking is table stakes in this niche
5. **Before/after photo gallery** -- essential for gutter; useful for pool (green-to-clear)
6. **Why us / trust section** -- documented visits, photo proof, insured, no hidden fees
7. **Review section** -- Google reviews embedded
8. **Service area / pricing** -- transparent pricing more common here than in roofing or landscaping
9. **FAQ** -- recurring vs. one-time, what's included, chemicals used (pool)
10. **Final CTA** -- book or get quote

---

## Hero Composition

- **Imagery:** Clean sparkling pool, close-up of clean vs. clogged gutter before/after. Stock photos are common in this niche (lower visual bar than landscaping). Before/after imagery is high-converting.
- **Primary CTA:** "Book Online" or "Get an Instant Quote" -- this niche is more transactional than roofing or landscaping. Speed to booking is the conversion goal.
- **Secondary CTA:** Phone number. Click-to-call for older homeowners.
- **Booking widget placement:** Some pool/gutter sites embed a price calculator or booking widget directly in the hero. This is a strong conversion pattern. [inferred from ServiceAutopilot model]

---

## Key Difference from Roofing and Landscaping

Pool and gutter cleaning is a **recurring, low-consideration service**. The homeowner is not making a $10,000 decision -- they are booking a $150-300 service they will use repeatedly. This changes the CRO goal: reduce friction to the first booking as aggressively as possible. Online booking, instant pricing, and no-contract language are the primary conversion tools.

The emotional trigger is reliability, not transformation. "They actually show up every time" > "they transformed my pool." The website must communicate consistency, documentation, and ease of booking.

---

## Trust Stack Ordering

1. Review count + star rating (reliability signal)
2. Before/after photo documentation (proof of work done)
3. Insured + background-checked crew (safety)
4. Transparent pricing or pricing table (no hidden fees)
5. Years in business / local tenure
6. Satisfaction guarantee / re-service guarantee

---

## Form Patterns

- **Optimal form:** Address/zip + service type + desired frequency (weekly/monthly/one-time) + contact info.
- **Zip code:** Essential. Pool/gutter services are tightly geographic. Zip pre-qualifies the lead.
- **Online booking calendar:** Highest conversion. If the client uses scheduling software (Jobber, ServiceAutopilot), linking directly to book converts better than a generic contact form.
- **Instant quote tool:** "Enter your home size / gutter linear feet" → show price range. Converts well in price-sensitive niches where customers want numbers before calling.
- **No-contract language:** "No long-term contract required" reduces first-booking hesitation in the recurring service segment.

---

## Sticky Elements

- Sticky header: logo + phone + "Book Now" button.
- Mobile: Fixed bottom bar with "Book Online" + call button. Mobile booking is the primary conversion path for this niche.

---

## Divergence from Universal Converting Wireframe

Booking widget moves up to position 4 (before gallery) in high-converting pool/gutter sites -- earlier than in most niches. Price transparency section is more prominent than in roofing or landscaping. "No hidden fees" and pricing tiers appear mid-page, not buried in FAQs. The niche is transactional: reduce the path from landing to booking.

---

## Source Traceback
- `raw/maps-reviews.json`: Booking and scheduling signals from 46 reviews ("online booking so nice and easy")
- `raw/agencies-search.json`: ServiceAutopilot model + agency copy analysis
- `raw/serp-rankings.json`: Pool/gutter SERP title patterns
- [inferred] Section order + booking widget patterns from ServiceAutopilot positioning + niche transactional nature
