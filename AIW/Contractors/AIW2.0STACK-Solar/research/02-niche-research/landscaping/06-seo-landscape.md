# 06 - SEO Landscape: Landscaping

Source: `raw/serp-rankings.json` (5 queries, ~40 organic results), `raw/maps-reviews.json` (GBP data from 3 cities).

---

## Primary Keyword Cluster

| Keyword | Intent | SERP character |
|---|---|---|
| "landscaping company near me" | High intent, local | Thumbtack, Angi, local Maps Pack |
| "lawn care service near me" | High intent, local | LawnStarter, Lawn Love (platforms dominate), Maps Pack |
| "best landscaping company" | Research intent | Directories + local roundups |
| "landscaping ideas cost" | Research/planning | Cost calculators, blog content |
| "lawn maintenance cost" | Research/planning | Angi, HomeAdvisor cost guides |

---

## Secondary / Long-Tail Clusters

| Keyword | Notes |
|---|---|
| "landscape design near me" | Design-intent, higher ticket |
| "hardscaping company near me" | High-ticket installation |
| "backyard landscaping cost [city]" | Planning phase, captures early funnel |
| "irrigation system installation near me" | Specialty, higher-ticket |
| "lawn mowing near me" | Maintenance, lower ticket |
| "landscape lighting installation [city]" | Premium add-on service |
| "retaining wall installation [city]" | Hardscaping, high ticket |
| "spring lawn cleanup near me" | Seasonal, high volume |
| "sod installation near me" | Specific service |
| "tree trimming near me" | Common add-on |

---

## Geographic Targets

Cities observed in SERP with active landscaping competition:
- Dallas, TX: 5 businesses found in Maps, moderate review volumes
- Atlanta, GA: 5 businesses found, higher design/install focus
- Phoenix, AZ: 5 businesses found, desert landscaping specialization

**Key insight:** Landscaping is highly fragmented. Unlike roofing (where large regional players exist), most landscaping is done by solo operators or crews under 10. This means Map Pack density is lower and easier to crack for a new client with a strong GMB + website.

**Platform threat:** LawnStarter and Lawn Love dominate "lawn care near me" SERPs nationally with their marketplace model. A client targeting design/install (not maintenance) sidesteps this competition entirely. The marketing angle should push clients toward design/install positioning, not commoditized lawn mowing.

---

## Title and H1 Patterns of Top-Ranking Pages

| Pattern | Example | Why it works |
|---|---|---|
| Service + city + "near me" | "Landscaping Company Near Me in Dayton" | Local intent match |
| Brand + city + service | "CLE Landscaping Co. -- Keeping Cleveland Beautiful" | Brand + geo anchor |
| Full-service list | "Design, Install, Maintain -- [City] Landscaping" | Comprehensive signal |
| Design-first H1 | "Landscape Design and Installation [City]" | High-ticket intent |
| Cost-first content | "Backyard Landscaping Cost Guide" | Informational capture |

---

## Schema Markup Recommended

- `LocalBusiness` (type: `LandscapeArchitect` or `HomeAndConstructionBusiness`)
- `Service` for each service (design, installation, maintenance, irrigation)
- `AggregateRating` for review display in SERP
- `FAQPage` for cost and service questions
- `GeoCoordinates` + `areaServed` for local relevance

---

## Content Gap Analysis

Topics ranking pages all cover:
- Service list + service area
- Free estimate CTA
- Gallery of past work
- Reviews section

Topics with gaps:
1. **Seasonal content.** "What to do with your lawn in [City] in spring/fall" -- captures early-funnel homeowners before they're in buying mode. Almost no local landscapers publish this.
2. **Design cost transparency.** "How much does a backyard redesign cost in [City]?" -- SERP shows heavy cost-content demand but most local landscapers avoid publishing prices. Transparent content builds early trust.
3. **Desert/regional landscaping specifics.** Phoenix area has distinct plant/material needs that generic landscapers don't address. Clients who specialize in regional needs (xeriscaping, desert plants) can rank on niche-specific terms.
4. **Before/after case studies with costs.** "We redesigned a 0.25-acre backyard in Dallas for $12,000. Here's everything we did." -- Very specific, very shareable, captures planning-phase buyers.

---

## Source Traceback
- `raw/serp-rankings.json`: 40 organic results across 5 queries
- `raw/maps-reviews.json`: GBP data from 3 cities, 15 businesses
