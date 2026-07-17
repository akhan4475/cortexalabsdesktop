# Copy-deck rules for pool-services

Seeded from AIW 2.0 research stack for niche pool-services.
Every copy-deck for a client in this niche must satisfy the rules below.
Generated: 2026-05-22.

---

## Hero headline pattern

Pull from `copy-locks.json -> heroH1Format`:

```
[Service type] in [City] You Can Actually Count On
```

Variants per archetype:
- Service-only: "Reliable Pool Service in [City]"
- Install-only: "Pool Installation in [City] - Built to Last"
- Full-service: "Pool Service and Installation in [City] - Done Right"

Never write a headline that leads with the company name. Always lead with what the end customer gets or the city they are in.

---

## Primary and secondary CTAs

Pull from `copy-locks.json`:
- Primary CTA: "Get a Free Quote" (install-only and full-service) / "Book Online Now" or "Schedule Service" (service-only)
- Secondary CTA: "View Pricing" (service-only) / "See Our Portfolio" (install-only)
- Mobile call label: "Call Now"

Do not invent alternate CTA text. These are locked phrases tested against the research.

---

## End-customer phrases to echo

Use these words and phrases in body copy, section intros, and FAQ answers. They come directly from review language customers used unprompted:

1. "reliable" / "actually shows up" - the dominant anxiety in the niche is inconsistency
2. "transparent" / "no hidden fees" - price transparency is a differentiator, state it explicitly
3. "before and after photos" / "photo-documented" - customers want proof the work was done
4. "professional crew" / "certified technicians" - signals this is not a random contractor
5. "flexible with timing" / "same-week scheduling" - scheduling friction is a top drop-off point

---

## End-customer fears to address in FAQ

These five fears must each have at least one FAQ item that directly disarms them:

1. "Will you actually show up every time?" (unreliable / hit-or-miss service fear)
   - Answer pattern: cite review count + years in business + on-time guarantee
2. "Who is actually coming to my property?" (unskilled contractor fear)
   - Answer pattern: background-checked, certified, employee (not random contractor)
3. "Are there any hidden fees?" (surprise invoice fear)
   - Answer pattern: quote pricing structure, state "no hidden fees" verbatim
4. "What if you damage my property?" (property damage fear)
   - Answer pattern: fully insured, licensed, satisfaction guarantee
5. "What if I am not happy with the service?" (first-booking risk)
   - Answer pattern: re-service guarantee, verbatim from copy-locks.json -> riskReversalLine

---

## Banned phrases

Do not use any of the following in any copy-deck output for this niche:

- "cutting-edge" or "state-of-the-art" (generic, no pool customer says this)
- "leverage" / "synergize" / "seamless" (AI-slop blocklist - see references/copy/ai-vocab-blocklist.md)
- "we strive to" / "we aim to" (weak, non-committal - customers want proof, not aspiration)
- "team of experts" without qualification (says nothing - pair with cert or review count)
- Any pricing language that implies negotiation on recurring service ("starting from" is fine for installs, not for monthly service - use fixed or range instead)

---

## Trust elements to lead with (by archetype)

Service-only priority order:
1. Before/after photo documentation ("photo-documented every visit")
2. Google review count + star rating
3. Transparent pricing + "no hidden fees"
4. Insured + background-checked crew
5. Satisfaction guarantee / re-service promise

Install-only priority order:
1. Portfolio / project gallery (before-during-after photos)
2. Licensed general contractor + state pool contractor license
3. Years in business / projects completed count
4. Workmanship + materials warranty (stated explicitly, with duration)
5. Google review count + star rating

Full-service: use service-only order for the homepage hero; install-only order for /pool-installation.

---

## Section order (homepage)

Required sequence per `09-template-spec.md`:

1. NavBar (sticky)
2. Hero (asymmetric split, copy left / image right)
3. Trust Bar (5-item strip: licensed, stars, same-day, guarantee, years)
4. Services (3-4 card grid)
5. Pricing Transparency (3-tier or "Get a Quote" variant)
6. Process (3-step strip)
7. Gallery / Before-After
8. Why Choose Us (split: image left, bullets + stat chips right)
9. Reviews (3-column card grid)
10. Contact Form (split: trust block left, form right)
11. Service Areas (dark navy band, city chip grid)
12. FAQ (accordion)
13. Final CTA Band (full-width gradient)
14. Footer (3-column)

Do not reorder sections without a documented reason in the client-specific lessons file.

---

## Canonical sources (do not duplicate data here - build agent reads these directly)

- Locked phrases: `templates/pool-services/niche-playbook/copy-locks.json`
- Voice + tone: `templates/pool-services/niche-playbook/copywriting.md`
- Per-niche SOP for copy: `templates/pool-services/.claude/sops/06-copywriting.sop.md`
- Customer voice raw data: `research/02-niche-research/pool-gutter/02-customer-voice.md`
- Trust signals: `templates/pool-services/niche-playbook/trust-signals.json`
- Template spec: `research/02-niche-research/pool-gutter/09-template-spec.md`
