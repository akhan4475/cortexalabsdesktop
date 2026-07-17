# Pool Services: Design Vocabulary

## Color Semantics

| Token | Hex | Use |
|---|---|---|
| `primary` | #0d6cb6 | Primary actions, links, section accents |
| `primary-dark` | #0a1628 | Hero backgrounds, footer, dark panels |
| `primary-slate` | #1a3a5c | Gradient midpoint, dark overlays |
| `accent` | #f58026 | CTAs, eyebrow labels, step numbers, star ratings |
| `accent-light` | #fdebd0 | Hover backgrounds, soft highlight states |
| `accent-dark` | #c45e0a | CTA hover state, active state |
| `neutral` | #f0f9ff | Section backgrounds (light sections) |
| `neutral-dim` | #e2edf7 | Borders, dividers, card edges |
| `silver` | #94a3b8 | Body text secondary, meta text, placeholders |
| `ink` | #0f172a | Primary body text, headings on light backgrounds |

**Accent usage rule:** Accent (#f58026) is reserved for:
1. Primary CTA buttons
2. Eyebrow / label text (uppercase, tracked)
3. Star icons
4. Step number circles
5. Hover state on interactive chips

Accent must not be used for decorative backgrounds except at very low opacity (< 15%).

## Typography

**Heading font:** Fjalla One (serif-style display)
- Use for: H1, H2, section headings, large stat numbers, card titles
- Do not use for body copy or small labels
- Letter-spacing: default (no tracking modification needed)

**Body font:** Inter (sans-serif)
- Use for: body copy, nav items, button labels, meta text, form labels, chips
- Weights: 400 (body), 500 (medium, nav), 600 (semibold, CTAs, labels), 700 (bold, only when emphasis is critical)

**Scale rules:**
- H1 homepage: 5xl / 6xl (3.5rem / 4.75rem)
- H2 section headings: 4xl / 5xl (2.5rem / 3.5rem)
- Card headings: xl / 2xl
- Body: sm / base (0.875rem / 1rem)
- Labels / eyebrows: xs uppercase tracked

## Icon Set

Use inline SVG only. No icon libraries (lucide-react is not in package.json).

Standard icons used in this template:
- **Checkmark circle:** trust chips, benefits lists
- **Phone:** contact elements, CTA
- **Arrow right:** read more links, CTA secondary
- **Star:** ratings
- **Shield check:** certifications
- **Clock:** hours, response time
- **Wrench:** repair services
- **Leaf:** eco-friendly
- **Users:** team / founder

Icon sizing: 14px nav / 16px inline / 20px benefit lists / 24px why-choose cards / 28px decorative

## Spacing

Section vertical padding: `py-section-gap` (4rem) on mobile, `lg:py-section-gap-lg` (6rem) on desktop.

Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

Card internal padding: `p-6` standard, `p-5` compact

Gap between cards: `gap-6` (24px) standard

## Shadow Tokens

| Class | Use |
|---|---|
| `shadow-card` | Default card shadow |
| `shadow-card-lg` | Card hover state |
| `shadow-floating` | Modals, drawers, sticky elements |

## Pool-Specific Design Motifs

The pool-services template uses subtle water-wave decorative elements in select sections:
- The CTABand footer has a subtle wave SVG at the bottom edge
- The hero right panel is a pool photo, not an abstract gradient
- Trust bar and pricing sections use the dark navy palette to evoke depth

Avoid cliche pool clipart or cartoon pool icons. Photography is always preferred over illustration.
