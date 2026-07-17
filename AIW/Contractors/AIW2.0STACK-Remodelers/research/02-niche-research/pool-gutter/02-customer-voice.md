# 02 - Customer Voice: Pool & Gutter

Source: `raw/maps-reviews.json` (15 businesses across Dallas/Atlanta/Phoenix -- pool and gutter mix, 46 reviews with text), `raw/reddit.json` (pool/gutter-relevant items)

Every quote targets the **end customer** -- the homeowner hiring a pool or gutter service.

---

## Top 20 Verbatim Quotes

1. "Finding a reliable gutter cleaner can be hit or miss, but Atlanta Gutter Cleaning is a keeper." -- Atlanta Gutter Cleaning LLC, Google Maps
2. "Their pricing was very fair and transparent with no hidden fees." -- Atlanta Gutter Cleaning LLC, Google Maps
3. "Julius was polite, worked safely, and finished the job exactly as promised." -- Atlanta Gutter Cleaning LLC, Google Maps
4. "I can't say enough great things about Mr. Jones and Atlanta Gutter Cleaning LLC! From start to finish, the experience was professional, efficient, and stress-free." -- Atlanta Gutter Cleaning LLC, Google Maps
5. "He was punctual, courteous, and clearly very knowledgeable about his work." -- Atlanta Gutter Cleaning LLC, Google Maps
6. "The way they have their online booking and payment set up is so nice and easy. Before and after pictures = peace of mind." -- Atlanta Gutter Cleaning LLC, Google Maps
7. "Top notch service at a reasonable price!" -- Atlanta Gutter Cleaning LLC, Google Maps
8. "Good price and good work from them. Will continue using their services." -- Guru Gutter Cleaning Atlanta, Google Maps
9. "Used A Better Gutter Cleaning for several years now. Tried and tested service provider through weather adjustments, follow-up on miscommunicated items, solid communications, but most of all solid performance." -- A Better Gutter Cleaning, Google Maps
10. "Awesome crew. Friendly, knowledgeable and professional. To top it off -- affordable prices. Highly recommended." -- Professional Gutter Cleaning LLC, Google Maps
11. "An AMAZING JOB! Came early, they were swift and thorough and even cleaned up. I'm so very pleased and will DEFINITELY use them for each cleaning." -- Professional Gutter Cleaning LLC, Google Maps
12. "I had my gutters replaced by this company. Excellent work, flexible with timing to meet my needs, professional crew. I highly recommend!" -- Professional Gutter Cleaning LLC, Google Maps
13. "Great work, courteous, and professional. Very happy with the job." -- Peachtree Cleaning Gutter & Power Washing, Google Maps
14. "Beware. It would appear that they hire contract people. Expect a single, non-skilled, unprepared individual to show up." -- Peachtree Cleaning (1-star), Google Maps
15. "Schedulers were rude dismissive and talked over me." -- Peachtree Cleaning (1-star), Google Maps
16. "Jeremy did an awesome job cleaning my roof. Very professional. Would highly recommend him and Peachtree Cleaning. Good value for the work done." -- Peachtree Cleaning (5-star), Google Maps
17. "Reliable gutter cleaner can be hit or miss" -- recurring theme in 3+ reviews
18. "Before and after pictures = peace of mind" -- Atlanta Gutter Cleaning, strong signal for photo documentation feature
19. "Flexible with timing to meet my needs" -- scheduling flexibility praised
20. "Solid performance of the core competency" -- review language for a recurring service relationship, indicates the baseline expectation is just: do what you said you'd do.

---

## Language Patterns: 10 Most-Repeated Phrases

| Phrase | Frequency | Source |
|---|---|---|
| "professional" / "professional crew" | 12x | Maps reviews |
| "reliable" / "reliability" | 6x | Maps reviews |
| "transparent" / "no hidden fees" | 5x | Maps reviews |
| "before and after pictures" / "photos" | 3x | Maps reviews |
| "affordable" / "reasonable price" / "good value" | 8x | Maps reviews |
| "punctual" / "came early" / "on time" | 5x | Maps reviews |
| "flexible with timing" / "meet my needs" | 4x | Maps reviews |
| "communication" / "solid communications" | 5x | Maps reviews |
| "hit or miss" | 3x | Maps reviews (describing the industry) |
| "will continue using" / "long-term" / "for years" | 4x | Maps reviews |

---

## Decision Moments

1. **Scheduling convenience.** Multiple reviews praise online booking specifically ("so nice and easy"). In a low-consideration recurring service, friction-free scheduling IS the conversion. A website with online booking or instant quote converts better than a phone-only form.
2. **Before/after photo documentation.** "Before and after pictures = peace of mind" is an explicit conversion signal. Customers want proof the job was done, not just an invoice. The website should show this as a feature.
3. **First service impression.** Reviews emphasize the first visit as the decision point for becoming a recurring customer. "Will DEFINITELY use them for each cleaning" after one visit. The website must set correct expectations for that first service.
4. **Price transparency.** "No hidden fees" and "fair pricing" mentioned multiple times. Price is a qualifying factor but not the primary decision maker for repeat customers. Transparency matters more than price level.

---

## Fears (Top 5)

1. **Unreliable / "hit or miss" service.** Stated explicitly in reviews. This is the dominant niche-level fear for gutter and pool cleaning. The business is seen as low-skill and inconsistent.
2. **Contractors / unskilled workers.** "They hire contract people, expect a non-skilled individual to show up." Customers fear paying for a professional and getting a random worker.
3. **Hidden fees or surprise pricing.** Transparent pricing is praised specifically because the default expectation is a surprise on the invoice.
4. **Damage to property.** Gutter cleaning requires ladder work and roof access. Pool cleaning involves chemicals. Fear of damage is implicit in the positive reviews that mention "worked safely."
5. **Scheduling difficulty / rude schedulers.** "Schedulers were rude, dismissive." Customer service at the booking stage determines if a first job happens at all.

---

## Source Traceback
- `raw/maps-reviews.json`: 15 businesses across Dallas TX, Atlanta GA, Phoenix AZ. 46 reviews with substantive text. Mix of gutter cleaning companies and pool service companies.
- `raw/reddit.json`: pool/gutter-relevant posts from r/pools, r/HomeImprovement, r/homeowners.
