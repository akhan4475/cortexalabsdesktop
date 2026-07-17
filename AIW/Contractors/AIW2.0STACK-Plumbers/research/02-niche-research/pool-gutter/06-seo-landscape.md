# 06 - SEO Landscape: Pool & Gutter

Source: `raw/serp-rankings.json` (5 queries, ~40 organic results), `raw/maps-reviews.json` (GBP data from 3 cities).

---

## Primary Keyword Cluster

| Keyword | Intent | SERP character |
|---|---|---|
| "pool cleaning service near me" | High intent, local | Maps Pack + directories (Yelp, Angi, Thumbtack) |
| "pool maintenance company" | High intent, local | National chains (America's Swimming Pool Co, Pinch A Penny) + local Maps |
| "gutter cleaning near me" | High intent, local | Thumbtack + national chains + local Maps |
| "best pool service company" | Research intent | Yelp/Angi roundups + local Maps |
| "gutter cleaning cost" | Research intent | Cost guide content (Forbes, Angi, HomeAdvisor dominate) |

---

## Secondary / Long-Tail Clusters

**Pool:**
| Keyword | Notes |
|---|---|
| "pool cleaning [city]" | Local intent, Maps Pack target |
| "weekly pool service near me" | Recurring intent |
| "pool chemical service near me" | Specialty, ongoing |
| "pool opening service near me" | Seasonal, spring |
| "pool closing service near me" | Seasonal, fall |
| "pool repair near me" | Repair intent, higher ticket |
| "pool resurfacing near me" | High-ticket, install |
| "CPO certified pool service [city]" | Credential-specific |

**Gutter:**
| Keyword | Notes |
|---|---|
| "gutter cleaning [city]" | Local, Maps Pack target |
| "gutter cleaning cost [city]" | Planning phase |
| "gutter guard installation near me" | Add-on service, higher ticket |
| "gutter repair near me" | Repair intent |
| "how much does gutter cleaning cost" | Informational, top-of-funnel |
| "best gutter cleaners near me" | Research + social proof |

---

## Geographic Targets

From Maps data:
- Dallas, TX: Pool services competitive. Gutter cleaning has thinner Maps Pack coverage. Warm climate = year-round pool service demand.
- Atlanta, GA: Gutter cleaning competitive (multiple active businesses found). Pool service present. Seasonal for gutters (fall primary).
- Phoenix, AZ: Pool service extremely active (hot climate, pool ownership rate high). Year-round demand. Gutter cleaning less relevant (low rainfall).

**Key insight:** Pool cleaning in Sun Belt markets (Phoenix, Dallas, Houston, Tampa, Orlando) is year-round, recession-resistant recurring revenue. Gutter cleaning is more seasonal but covers most of the US. A pool service client in Phoenix is a stronger long-term retainer story than a gutter cleaner in Boston.

---

## Title and H1 Patterns of Top-Ranking Pages

| Pattern | Example | Why it works |
|---|---|---|
| Brand + city + "#1 Choice" | "Tucson's #1 Choice for Pool Service" | Local + authority claim |
| Trust signal + tenure | "Family-owned and trusted since 1969" | Long tenure = reliability |
| Service + city | "Pool Cleaning Service in Tucson, AZ" | Exact match local SEO |
| National franchise | "America's Swimming Pool Company" | Brand recognition |
| Review-driven | "Top 10 Best Pool Service Near Austin" | Directory-style, drives traffic |

**Key threat:** National chains (Pinch A Penny, America's Swimming Pool Company) compete in pool maintenance SERPs. A local operator competes by owning the Maps Pack (review volume + GMB optimization) rather than organic rankings against these national players.

---

## Schema Markup Recommended

- `LocalBusiness` (type: `HomeAndConstructionBusiness`)
- `Service` for each service (weekly cleaning, opening/closing, repair, gutter cleaning, gutter guard)
- `AggregateRating` for SERP star display
- `FAQPage` (pricing, what's included, scheduling frequency)
- `PriceRange` (shows "$" or "$$" in Maps listings)

---

## Content Gap Analysis

Topics all ranking pages cover:
- Service list + pricing (some transparency)
- Free quote / booking CTA
- Service area
- Reviews

Topics with content gaps:
1. **Pool cost guides specific to city.** "How much does weekly pool service cost in Dallas?" -- local cost content captures planning-phase buyers that national cost guides miss.
2. **Chemical safety and pool health.** "What chemicals does your pool service use and why?" -- most pool companies don't explain their process. Content that addresses homeowner anxiety about pool chemicals is thin.
3. **Gutter guard ROI calculator.** "Should I get gutter guards? Cost vs. annual cleaning savings." -- captures planning-phase homeowners considering the upgrade.
4. **Storm season gutter prep.** "Before storm season: what you need to check on your gutters." -- seasonal content that earns organic traffic before demand peaks.

---

## Source Traceback
- `raw/serp-rankings.json`: 5 queries, ~40 organic results
- `raw/maps-reviews.json`: GBP density from 3 cities, 15 businesses
