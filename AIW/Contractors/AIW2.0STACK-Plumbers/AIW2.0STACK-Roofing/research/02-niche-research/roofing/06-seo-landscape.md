# 06 - SEO Landscape: Roofing

Source: `raw/serp-rankings.json` (5 queries, 42 organic results). GBP density from `raw/maps-reviews.json` (15 businesses across 3 cities).

---

## Primary Keyword Cluster

| Keyword | Intent | SERP character |
|---|---|---|
| "roof replacement near me" | High intent, local | Google Maps + local service ads dominate |
| "roofing contractor near me" | High intent, local | Maps pack + directory listings (Yelp, Angi, BBB) |
| "emergency roof repair" | Urgent, local | Service area pages + maps |
| "best roofing company" | Research intent | Listicles (Angi, Yelp, HomeAdvisor) dominate |
| "roof repair cost" | Research intent | How-much content from Angi, Forbes, HomeAdvisor |

---

## Secondary / Long-Tail Clusters

| Keyword | Notes |
|---|---|
| "emergency roof repair near me" | High urgency, same-day intent |
| "24 hour emergency roof repair" | Ultra-urgent, storm damage context |
| "emergency roof tarp" | Post-storm, immediate need |
| "roof tarping near me" | Same urgency tier |
| "roof replacement cost [city]" | Research + local |
| "GAF certified roofer near me" | Brand-certified searchers |
| "insurance claim roof repair" | High-value segment, insurance context |
| "metal roofing [city]" | Material-specific, higher ticket |
| "flat roof repair" | Commercial crossover |
| "storm damage roof repair" | High intent, post-event |

---

## Geographic Targets

Cities with high GBP density (from Maps data -- 5+ businesses per search):
- Dallas, TX: 5 roofing businesses found, avg 4.6 stars, competitive
- Atlanta, GA: 5 businesses found, avg 4.7 stars, competitive
- Phoenix, AZ: 5 businesses found, avg 4.8 stars, competitive

**Opportunity signal:** Any metro with population 200k-1M and fewer than 20 GMB-optimized roofers is a target. Sun Belt cities (Phoenix, Dallas, Atlanta, Houston, Tampa) have high storm frequency = high search volume for emergency and replacement terms. [inferred]

---

## Title and H1 Patterns of Top-Ranking Pages

| Rank pattern | Example | Why it works |
|---|---|---|
| Service + city + "near me" | "Emergency Roof Repair in Connecticut" | Hyper-local, matches intent |
| Brand + service + city | "JP Roofing: Roofing Company Near Me" | Brand recall + local anchor |
| Listicle title | "TOP 10 BEST Emergency Roof Repair in New York" | Directory content, informational |
| Problem + city | "Roof Replacement Near [City]" | Intent match |
| Cert + service | "GAF Certified Roofing Contractor Serving Dallas" | Credential-forward |

**Key insight:** The SERP for "roofing contractor near me" is dominated by directories (Angi, BBB, Yelp, GAF's own Find-a-Contractor tool). A single roofer's website typically ranks in the 4-8 position behind these aggregators. The Google Maps Pack (top 3 local results) is the real battleground. GMB optimization + reviews are more important than organic rankings for a small roofing operator.

---

## Schema Markup Commonly Used

- `LocalBusiness` (required)
- `RoofingContractor` (specific type -- use this, not just LocalBusiness)
- `Service` (for each service offered)
- `Review` / `AggregateRating` (to show stars in SERP)
- `FAQPage` (for the FAQ section)

---

## Content Gap Analysis

Topics ranking pages all cover:
- Service list (replacement, repair, storm, emergency, gutters)
- Free estimate CTA
- Service area / city pages
- Review display

Topics ranking pages miss or cover poorly:
1. **Insurance claim walkthrough.** Homeowners searching "insurance claim roof repair" find very thin content. A detailed guide ("How to file a roof insurance claim in [State]") is a genuine content gap.
2. **Roof type comparisons.** "Asphalt vs metal roofing cost" and "best shingles for [climate]" are under-served.
3. **Storm season preparation content.** Pre-season awareness content (spring/summer for hail zones, hurricane prep for coastal) captures early-funnel traffic before urgency hits.
4. **Contractor vetting checklist.** "10 questions to ask a roofer before hiring" (seen in Reddit) -- a format homeowners want but most roofing sites don't publish.

---

## Source Traceback
- `raw/serp-rankings.json`: 42 organic results across 5 queries
- `raw/maps-reviews.json`: GBP density + business data from 3 cities
