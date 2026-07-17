# 07 - Money Math: Landscaping

Source: `raw/serp-rankings.json` ("landscaping ideas cost" SERP data), `raw/maps-reviews.json` (transaction signals from reviews), `01-agencies.md`.

---

## Average Ticket Size

- **Lawn maintenance (recurring):** $50-200/visit, $150-500/month for regular service
- **Landscape design fee:** $850-6,000 for design plan alone (source: SERP "landscaping cost" result)
- **Landscape design + install:** $5,000-25,000 for a mid-size residential project (source: SERP "backyard landscaping cost" guide citing $5,000 budget range up to $100,000+)
- **Hardscaping (patios, retaining walls, pavers):** $3,000-20,000 per project
- **Irrigation system install:** $1,500-5,000
- **Full backyard redesign:** $10,000-40,000

**Working numbers:**
- Maintenance client: $2,400-6,000/year in recurring revenue
- Single install project: $8,000-15,000 average
- Blended (mixed maintenance + installs): $5,000-12,000 average ticket

---

## Estimated Close Rate per Qualified Lead

- Design/install segment: 20-30% from qualified consultation [inferred from review patterns -- multiple businesses mentioned in the context of "getting quotes"]
- Maintenance segment: 35-50% (lower consideration, customer just needs to trust the crew)
- **Working number: 25% close on design/install leads from website.**

---

## Leads Needed Per Month

For design/install at $10,000 average ticket x 25% close rate:
- Need 4 qualified consultations/month to close 1 job
- 1 new install job/month = $10,000 revenue

For maintenance:
- 1 new recurring client from website = $300-500/month recurring = $3,600-6,000/year LTV
- 5 new recurring clients from website per month = significant recurring book

**The maintenance angle is strong for the student's pitch: each website-generated maintenance client is worth $3,600-6,000/year in recurring revenue.**

---

## The Pitch Sentence

"If your website generates 4 qualified consultations a month and you close 1 install job, that's $10,000 in new revenue. And if it brings in just 5 new recurring maintenance clients, those are worth $18,000-30,000 a year combined. Your website costs you $800. It pays for itself with the first call."

---

## Supporting Evidence from Raw Data

- SERP "landscaping ideas cost" shows homeowners actively researching landscaping costs before hiring. They are in planning mode. A website with cost guidance captures them early.
- Review mentions of "reasonably priced" and "price is right" suggest price sensitivity -- transparent pricing or ranges on the website reduce friction.
- Platform competition (LawnStarter, Lawn Love) is in the maintenance segment. Design/install is not platform-threatened. The client should be positioned as a design/install specialist even if they also do maintenance.

---

## Source Traceback
- `raw/serp-rankings.json`: "landscaping ideas cost" and "landscaping company near me" results
- `raw/maps-reviews.json`: Transaction signal analysis from 49 reviews
- [inferred] Close rates from review frequency patterns + industry benchmark
