# Roofing Niche -- Design Fidelity Checklist

Used by `design-fidelity-qa-agent` at Stage 10.4a. Scored against the winner design: perth-roof-replacements hero + priority-roofs-dallas structure + colony-roofers trust stack.

## Color system (FAIL if any wrong)

- [ ] Hero background is dark navy (#0A0F1A) or darker
- [ ] Primary CTA color is teal (#0ABFBC) or within 10% perceptual distance
- [ ] Star rating color is gold (#F59E0B)
- [ ] Light content sections (EstimateForm, ProcessSteps, FAQ) have white or near-white background
- [ ] Dark sections (Hero, WhyUs, ReviewTiles, FinalCTA, Footer) are navy, not pure black

## Typography (FAIL if any wrong)

- [ ] All H1/H2/H3 headings are Barlow Condensed
- [ ] All headings are uppercase
- [ ] Body text is Inter
- [ ] Section overline labels are Inter, 600, uppercase, teal

## Shape motif (WARN if failing)

- [ ] Buttons have 4px border radius (not pill, not 0)
- [ ] Cards have 6px border radius
- [ ] No heavy drop shadows (border separators preferred)

## Section order -- HomePage (FAIL if wrong order)

Expected order:
1. Hero
2. TrustBar
3. EstimateForm
4. ServicesGrid
5. WhyUs
6. BeforeAfterGallery
7. TeamSection
8. ReviewTiles
9. ProcessSteps
10. InsuranceSection
11. FAQAccordion
12. FinalCTA
13. Footer

## Hero composition (WARN if failing)

- [ ] Hero is full-bleed dark with photo or color background
- [ ] Overlay present (text must be readable at WCAG AA 4.5:1 on hero)
- [ ] H1 is the dominant visual element
- [ ] Star + review count visible below or near CTA
- [ ] Dual CTA: primary (teal fill) + secondary (ghost white border)

## SSIM threshold

Target SSIM >= 0.72 against perth-roof-replacements reference screenshot for the hero section.
Score below 0.65: FAIL. Score 0.65-0.72: WARN. Score >= 0.72: PASS.
