# 03 - Copy Patterns: Roofing

Source: `raw/agencies-search.json` (agency homepage descriptions), `raw/serp-rankings.json` (top-ranking roofing business titles + meta descriptions). Facebook Ads data not collected (no fb-ads.json). Patterns inferred from SERP + agency crawl. [inferred where noted]

---

## Top 10 Hero Headlines (Observed and Pattern-Derived)

| # | Headline | Pattern |
|---|---|---|
| 1 | "Roofing You Can Trust -- Licensed, Local, and Ready to Help" | Trust + local anchor + urgency |
| 2 | "Emergency Roof Repair -- 24/7 Response, Same-Day Estimates" | Urgency + speed + low barrier CTA |
| 3 | "Get Your Roof Done Right the First Time" | Fear reversal (no redo anxiety) |
| 4 | "Free Roof Inspection -- No Pressure, No Sales Games" | Removes objection upfront |
| 5 | "GAF Certified Roofing Contractor Serving [City]" | Cert + local anchor |
| 6 | "Roof Replacement Completed in One Day" | Speed proof (observed in reviews) |
| 7 | "Your Neighbors Trust Us -- [N] 5-Star Reviews in [City]" | Social proof + local |
| 8 | "We Handle the Insurance Claim Process for You" | Pain removal for insurance jobs |
| 9 | "New Roof, Zero Surprises -- Transparent Pricing, Real Warranties" | Anti-fear framing |
| 10 | "Storm Damage? Get a Free Roof Assessment Today" | Trigger-event hook |

---

## Top 10 CTAs Observed Across SERP

| # | CTA | Pattern |
|---|---|---|
| 1 | "Get a Free Estimate" | Low commitment, industry standard |
| 2 | "Schedule Your Free Inspection" | Slightly softer than estimate |
| 3 | "Call Now" | Urgency, direct |
| 4 | "Get Your Free Quote Today" | Adds time pressure |
| 5 | "Contact Us" | Generic, weak (loser pattern) |
| 6 | "Request a Free Estimate" | Slight friction (form implied) |
| 7 | "See Our Work" | Portfolio-first CTA for visual trust |
| 8 | "Check Availability" | Low barrier, implies scarcity |
| 9 | "Get Started" | Generic (loser pattern) |
| 10 | "Talk to a Roofing Expert" | Humanizes the next step |

---

## Top 10 Value Props

| # | Value Prop | Framing |
|---|---|---|
| 1 | Licensed and insured | Safety / liability protection |
| 2 | Free estimate / inspection | Lowers barrier to first contact |
| 3 | GAF / Owens Corning certified | Third-party credibility |
| 4 | BBB A+ rated | Trust badge |
| 5 | Local (city-specific) | Community trust |
| 6 | Fast scheduling / same-day | Urgency resolution |
| 7 | Cleanup included | Removes pain point (nails in yard) |
| 8 | Insurance claim assistance | Pain removal for storm victims |
| 9 | Warranty on labor + materials | Risk reversal |
| 10 | Years in business / reviews count | Social proof |

---

## Common Ad Hook Structures [inferred from SERP patterns]

1. **Event trigger:** "Storm hit your neighborhood? Here's what to do first." Connects to urgency moment.
2. **Fear reversal:** "Most homeowners get overcharged on roof replacements. Here's why ours is different."
3. **Social proof + geo:** "247 homeowners in [City] chose us this year. Here's why."
4. **Comparison hook:** "We got 3 quotes. This is what we learned." (Speaks to review-reading behavior.)
5. **Speed hook:** "New roof in one day. No mess left behind."

---

## Swipeable Hero Headline Templates

1. "Roofing [City] Trusts -- [N] 5-Star Reviews, Free Inspections, No Games"
2. "Storm Damage? We Handle the Whole Process -- Free Assessment, Insurance Claim Help"
3. "[Company Name]: [City]'s GAF Certified Roofer. Get Your Free Estimate Today."
4. "New Roof, Done Right, Done Fast -- Lifetime Warranty on Every Install"
5. "Tired of Roofers Who Don't Show Up? We're Different. [Phone Number]"

---

## Source Traceback
- `raw/agencies-search.json`: 28 organic results, agency homepage descriptions analyzed
- `raw/serp-rankings.json`: 42 organic results across 5 keyword queries, title + meta patterns extracted
- [inferred] Ad hooks derived from review language in `raw/maps-reviews.json` + SERP pattern analysis
