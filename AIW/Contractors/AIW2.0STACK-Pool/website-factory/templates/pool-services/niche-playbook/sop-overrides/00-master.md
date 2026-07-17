# Pool Services: SOP Override Master

This file lists every override this niche makes to the factory's universal SOPs. The SOP QA agent applies these on top of the base SOPs.

## Stage 2 (Research) Overrides

**GBP categories to check:**
- Primary: "Swimming Pool Service & Repair"
- Secondary: "Pool Cleaning Service", "Swimming Pool Contractor", "Swimming Pool Repair Service"

**Competitor count:** Pull at minimum 10 local competitors from Google Maps. Pool service markets are active and dense.

**Key competitor data points:**
- Review count and rating (pool buyers check reviews carefully)
- Whether pricing is listed (most competitors hide it, listing it is a differentiator)
- Seasonal availability claims (important for pool opening/closing market)
- Emergency response claims (green pool recovery is a high-urgency category)

## Stage 4 (Asset Harvest) Overrides

**Photo categories required (pool-services specific):**
- Hero: 1 required. Brief: `hero-mood-mapping.json` defaultMood.
- Before/After: 2 required. Green pool recovery before/after is highest priority.
- Completed pools: 3 required.
- Founder/team: 1 required.

**If no before/after photos exist:** Flag as `MANUAL-DROP-NEEDED` and add to photo-shoot brief. Do not use stock photos for before/after.

## Stage 6 (Copywriting) Overrides

**Hero H1 format:** "[Service type] in [City] You Can Actually Count On" (from copy-locks.json heroH1Format)

**Required copy modules:**
- Risk reversal line (after process section): from copy-locks.json riskReversalLine
- Pricing disclosure: Every site must show at least one pricing anchor or starting-price claim
- Emergency availability: If client offers green pool recovery or same-day service, flag this prominently in hero subheadline or trust chips

**Copy register:** Knowledgeable neighbor. See `copywriting.md`.

## Stage 9 (Hero Image) Overrides

**Composition:** Wide-angle sparkling residential pool. Full-height right panel (45% of desktop viewport width). No people required. No equipment visible in hero (equipment photos go to gallery/work). See `hero-composition.md`.

**Lighting:** Use `hero-mood-mapping.json` defaultMood or regional override if client's state matches.

## Stage 10.3 (Uplift) Overrides

**Pool-specific uplift checks:**
1. Pricing anchor visible within first 3 sections after hero
2. Before/after photos present in gallery component (or MANUAL-DROP-NEEDED logged)
3. "No contracts" claim present in at least 2 separate locations
4. Trust bar visible on all 4 pillar service pages
5. FAQ contains minimum 5 items (pool buyers have specific questions)

## Stage 10.4b (SOP QA) Overrides

**Niche-specific QA checks:**
- `heroTrustChips.length >= 3` (CRO rule from `cro-rules.md`)
- `brandDNA.copy.privacyLine` matches copy-locks.json `formPrivacy`
- Hero H1 contains city name (local SEO requirement)
- Phone number is a `tel:` link in nav
- `brandDNA.reviews.items.length > 0` OR fallback reviews are rendering
