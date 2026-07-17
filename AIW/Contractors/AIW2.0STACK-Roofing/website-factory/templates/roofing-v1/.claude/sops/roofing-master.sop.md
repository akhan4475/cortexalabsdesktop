# Roofing Niche -- Master SOP

This SOP governs every pipeline stage for roofing niche clients. It supplements the universal SOPs at `website-factory/.claude/sops/`. Read this file first at every stage; then read the universal stage SOP. Where these conflict, this file wins.

## Stage 2 -- Research

Read `niche-playbook/trust-signals.json`. Flag if the client has no verifiable license number in GBP or their existing site. A roofing site without a license number visible is a trust-signal failure before Stage 6 even starts.

Scrape the client's Google Business Profile for:
- Verified review count and star average
- Whether they list their license number
- Whether they have before/after photos uploaded
- Service area coverage (used to populate `service_areas[]`)

## Stage 4 -- Assets

Priority order for photos:
1. Before/after job photos from the client's GBP or Facebook
2. Team photos (founder headshot minimum)
3. Service-specific photos (storm damage, replacement, repair)

Minimum deliverable: 3 before/after pairs in `public/images/gallery/`. Without them, BeforeAfterGallery renders with placeholder backgrounds.

## Stage 6 -- Copywriting

Load the following before writing a single line of copy:
1. `niche-playbook/copywriting.md` (voice contract)
2. `niche-playbook/copy-locks.json` (4 verbatim lines that must appear in the site)
3. `niche-playbook/vocabulary.json` (avoid list)
4. `niche-playbook/cro-rules.md` (conversion rules)

Apply the roofing copy agent at `.claude/agents/roofing-copy-agent.md`.

## Stage 7 -- Brand DNA

License number is required for roofing. If the client hasn't provided it, retrieve it from their GBP or state contractor board lookup. Set `brandDNA.company.licenseNumber` before Stage 10.1.

## Stage 9 -- Hero Image

Use `niche-playbook/hero-mood-mapping.json` and `niche-playbook/hero-composition.md` as the image direction brief. Pass to the nano-banana skill. Key constraint: overlay is applied via CSS, not baked into the image.

## Stage 10.3 -- Uplift

Run `.claude/agents/roofing-uplift-agent.md`. The roofing uplift checklist has 4 required steps:
1. Voiceflow embed (if client has a Voiceflow project ID)
2. Trust badge assets (populate `brandDNA.trust_badges[].imageFile`)
3. License number visibility verification
4. Mobile phone number tel-link check

## Stage 10.4b -- SOP QA

Load `.claude/checklists/sop-compliance.md` in addition to the universal checklist. The 4 copy-lock lines are FAIL if missing. License number in TrustBar and Footer is FAIL. Phone tel-link count below 3 is FAIL.

## Stage 13 -- Proposal

Use `niche-playbook/proposal-pages.json` for the 4-page structure. Page 2 requires a specific dollar-amount ROI calculation based on the client's average job value (get from the intake brief).
