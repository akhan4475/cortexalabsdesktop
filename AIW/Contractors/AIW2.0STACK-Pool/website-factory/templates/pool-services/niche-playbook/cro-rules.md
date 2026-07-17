# Pool Services: CRO Rules

These rules govern conversion-critical decisions for every pool-services client site. The SOP QA agent checks compliance.

## Above-the-Fold Rules

1. **Primary CTA must be visible without scroll on desktop and mobile.** No exception. If the hero is taller than 100vh, the CTA must still be in the first viewport.
2. **Phone number in top nav on desktop.** Must be a `tel:` link, not just display text.
3. **Mobile sticky CTA bar.** During business hours: "Call Now" + phone number. After hours: primary CTA button linking to /contact. Determined by `brandDNA.businessHours`.
4. **Trust chip row under H1.** Minimum 3 chips. Never more than 6. Must include licensing/insurance claim as the first chip.

## Pricing Visibility Rule

**Pool service leads filter hard on price.** Sites that show starting pricing convert significantly better than those that do not. Every pool-services site must show one of:
- A starting price ("Cleaning from $X/month")
- A special offer with visible value
- A clear promise ("Free quote within 24 hours")

The Pricing section (id="pricing") must appear above the fold on a desktop scroll or within the first 3 sections after the hero.

## Form Rules

1. **4 fields maximum above the fold in the form.** Name, phone, email, service type. Message field is below the fold within the form.
2. **Response time promise in the form header.** Example: "We respond within one business day."
3. **Privacy line below the submit button.** Must say: "No contracts. No spam." verbatim (from copy-locks.json).
4. **No captcha.** Use honeypot field if spam protection is needed.

## Mobile Rules

1. **Hero must be full-height on mobile** (100dvh or 100svh preferred). Do not shrink the hero to a card on mobile.
2. **Hero image on mobile.** Use the same hero image as a full-bleed background with a dark overlay. The left-panel text floats over it.
3. **Sticky call bar.** Exactly 56px tall. Font: Inter, 14px, font-weight 600. Must not obscure content below.
4. **Touch targets.** All interactive elements minimum 44x44px.

## Review Section Rules

1. **Minimum 3 reviews on the homepage.** If fewer than 3 real reviews exist in brandDNA.reviews.items, use the fallback reviews from the Reviews component until real reviews are populated.
2. **Aggregate stat.** Show Google rating + review count above the review grid. Use tabular-nums class on numbers.
3. **Platform attribution.** Every review card must show the source platform (Google, Facebook, etc.).

## Trust Signal Placement Priority

Order of placement by conversion weight (most important first):
1. Licensed & Insured claim (hero trust chips)
2. Google rating + count (reviews section stat)
3. Response time promise (form header)
4. No-contracts promise (multiple placements)
5. Certification badges (trust bar)

Never remove #1 or #2. The others may be adjusted per client.
