# Roofing Niche -- SOP Compliance Checklist

Used by `sop-qa-agent` at Stage 10.4b. Each item is PASS / FAIL / WARN. Any FAIL blocks delivery.

## Copy locks (FAIL if any missing)

- [ ] "We never pressure you after a storm. We give you the facts and let you decide." appears verbatim on site
- [ ] "Insurance help is included at no extra charge." appears verbatim on site
- [ ] "Every estimate is written and itemized. No surprises on invoice." appears verbatim on site
- [ ] "We run a magnet over the yard and haul every shingle. We leave it cleaner than we found it." appears verbatim on site

## Trust signals (FAIL if any missing)

- [ ] License number visible in TrustBar
- [ ] License number visible in Footer
- [ ] Google review count visible in Hero or TrustBar
- [ ] Star rating visible in Hero or TrustBar
- [ ] At least one GAF/BBB badge or text fallback visible in Footer

## CRO (FAIL if any failing)

- [ ] Phone number is a `tel:` link in Nav
- [ ] Phone number is a `tel:` link in Hero
- [ ] Phone number is a `tel:` link in Footer
- [ ] MobileStickyBar present on all pages
- [ ] EstimateForm appears within first 3 sections on HomePage
- [ ] EstimateForm present on all service pages and ContactPage
- [ ] Form submit button text is "Request My Free Estimate" or "Get a Free Estimate" (not "Submit")
- [ ] Form success state replaces form (no page redirect)

## Copy voice (WARN if any failing)

- [ ] No em-dashes anywhere in copy
- [ ] No emojis anywhere in copy
- [ ] No words from vocabulary.json avoid list
- [ ] All trust claims are quantified (no vague superlatives)

## Sections (FAIL if any missing from HomePage)

- [ ] StickyNav renders
- [ ] Hero renders with H1
- [ ] TrustBar renders immediately below Hero
- [ ] EstimateForm renders
- [ ] ServicesGrid renders
- [ ] WhyUs renders
- [ ] BeforeAfterGallery renders (or placeholder if no photos)
- [ ] TeamSection renders
- [ ] ReviewTiles renders
- [ ] ProcessSteps renders
- [ ] InsuranceSection renders
- [ ] FAQAccordion renders
- [ ] FinalCTA renders
- [ ] Footer renders
- [ ] MobileStickyBar renders

## Accessibility (WARN if any failing)

- [ ] All images have alt text
- [ ] All interactive elements have focus-visible styles
- [ ] FAQAccordion uses proper aria-expanded / aria-controls
- [ ] ReviewTiles list uses role="list"
- [ ] All `<section>` elements have aria-labelledby pointing to their heading
