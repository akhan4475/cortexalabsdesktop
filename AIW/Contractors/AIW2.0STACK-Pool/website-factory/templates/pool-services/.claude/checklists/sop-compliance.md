# SOP Compliance Checklist: Pool Services

Used by `sop-qa-agent` at Stage 10.4b. Items marked `[HALT]` block deploy. Items marked `[WARN]` are logged but do not block.

---

## Universal checks

- [HALT] No `__REQUIRED__` sentinels survive in any built file
- [HALT] No em-dash character (`—`) in any built HTML
- [HALT] Build exits with code 0
- [HALT] `dist/index.html` exists
- [HALT] `validate-brand-dna.mjs` passes

## Copy checks

- [HALT] `brand-dna.copy.hero.headline` contains client's city name
- [HALT] `brand-dna.copy.buttonText` is non-empty
- [HALT] `brand-dna.copy.formHeader` is non-empty
- [HALT] `brand-dna.copy.privacyLine` is non-empty
- [WARN] `brand-dna.copy.hero.subheadline` is non-empty
- [WARN] `brand-dna.copy.footerCta` is non-empty

## Trust chip checks

- [HALT] `brand-dna.copy.heroTrustChips.length >= 3`
- [WARN] `brand-dna.copy.trustClaims.length >= 3`

## Contact / phone checks

- [HALT] `brand-dna.contact.phone` is non-empty
- [HALT] `brand-dna.contact.phoneTelLink` starts with `tel:`
- [HALT] Built homepage HTML contains `href="tel:` in nav element
- [WARN] Built homepage HTML contains `href="tel:` in footer element

## Services checks

- [HALT] `brand-dna.services.length >= 1` OR services fallback is rendering
- [WARN] Each service in brand-dna.services has a `slug`, `name`, and `body`

## Content checks

- [WARN] `brand-dna.reviews.items.length >= 1` OR fallback reviews rendering
- [WARN] `brand-dna.faq.length >= 5` OR fallback FAQ rendering
- [WARN] `brand-dna.serviceAreas.length >= 3`
- [WARN] `brand-dna.process_steps.length >= 3` OR fallback process steps rendering

## Gutter exclusion check (niche-specific)

- [HALT] No page, component, or copy contains the words "gutter", "gutters", or "gutter cleaning" (gutter is out of scope for this niche)

## Banned phrases check (from copy-blocklist-additions.md)

- [WARN] No instance of "#1 pool service" in built HTML (unsubstantiated claim)
- [WARN] No instance of "making a splash" in built HTML (cliche)
- [WARN] No instance of "pool paradise" in built HTML (cliche)

## Asset checks

- [WARN] `/hero/pool-hero.jpg` is referenced in built HTML
- [WARN] Hero image `alt` attribute is non-empty

---

Total HALT items: **9 universal + 3 niche = 12**
All 12 must pass before Stage 11 (deploy) runs.
