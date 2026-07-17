# Design Vocabulary: Landscaping Niche

Source: GreenOasis (primary), Keane Landscaping (nav/CTA), Mountainscapers (trust)

---

## Color

Primary: Dark forest green #0d3320 — evokes mature, premium landscaping without rustic cliche.
Accent: Bright green #4ade80 — nature, life, growth. Against dark primary this pops without garish contrast.
Ink: Slate-100 #f8fafc — softer than pure white on dark backgrounds.
Neutral: Slate-400 #94a3b8 — body text on dark sections.

Rule: Never use purple. Never use blue-to-purple gradients. Never use orange unless an accent on a specific niche variant.

## Typography

Heading: Fraunces 600 — optical-size variable serif, craft-connoting, nature-adjacent, premium without being rustic.
Body: Plus Jakarta Sans 400/500 — clean geometric humanist, pairs cleanly with Fraunces at any size.

Type scale: 1.25 modular. H1 on hero: 56-64px fluid. Section headings: 36-40px. Card headings: 18-20px. Body: 16px. Captions: 14px.

Rule: Only one font family ever at a time. If using Fraunces for a heading, the next element uses Plus Jakarta Sans. Never two display fonts on the same page.

## Layout

- Max content width: 7xl (1280px)
- Section padding: py-section-gap-lg (6rem vertical)
- Card padding: p-card-pad (1.5rem)
- Border radius: rounded-2xl for cards and images (16px), rounded-full for CTAs and pills
- Grid: 2-column for most sections, 3-column limited to services only

## Hero

- 100vh, full-bleed
- Asymmetric split: 55% text, 45% image through overlay
- Overlay: left-heavy gradient, dark primary to transparent
- Text column: max-width 640px

## Cards

- White background on `bg-primary-slate/5` sections
- `border border-silver` with `shadow-card` default
- `hover:shadow-card-lg` on interactive cards
- No rounded-3xl or rounded-sm — always rounded-2xl

## Motion

See motion-preset.json. Restrained. No bouncy spring. No page transitions. Section stagger-fade only.

## Anti-slop guards

These patterns are banned:
- Purple or blue gradient backgrounds
- Three-column icon grids repeated 3+ times on a single page
- Stock photo of happy family on generic lawn
- Generic "learn more" cards with no actual content
- Animated counter numbers with no context
- Spinning logos

## Section alternation

Light/dark sections alternate to create rhythm:
1. Hero: dark (primary)
2. Trust bar inline: light accent tint (primary-slate/20)
3. Services: white
4. Portfolio: primary-slate/5
5. Why Choose: white
6. Process: dark (primary)
7. Reviews: white
8. Founder: primary-slate/5
9. Service areas: white
10. FAQ: primary-slate/5
11. CTA form: dark (primary)
12. Footer: dark (primary)
