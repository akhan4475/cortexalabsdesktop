# Pool Services: Hero Composition

## Canonical Hero Pattern

**Layout:** Asymmetric horizontal split
- Left panel: 55% width, dark navy gradient (primary-dark to primary-slate), all copy
- Right panel: 45% width, pool photography, full-height, edge-to-edge

**Left panel content order (top to bottom):**
1. Eyebrow label (uppercase, tracked, accent color) from `brandDNA.copy.hero.eyebrow`
2. H1 headline from `brandDNA.copy.hero.headline`
3. Subheadline from `brandDNA.copy.hero.subheadline`
4. Trust chip row from `brandDNA.copy.heroTrustChips` (pill badges, white/10 bg)
5. Dual CTA row: primary button (accent) + secondary outline link
6. Phone number with icon

**Left panel gradient:**
```css
background: linear-gradient(135deg, rgb(var(--primary-dark)) 0%, rgb(var(--primary-slate)) 100%);
```

**Right panel:**
- Image source: `/hero/pool-hero.jpg`
- Object-fit: cover, fills full panel height
- Left edge blend: linear-gradient(to right, primary-dark 0%, transparent 18%)
- No caption, no overlay text

## Mobile Adaptation

On screens below 768px (md breakpoint):
- Right panel image becomes full-bleed background (`absolute inset-0`)
- Dark overlay at 85% opacity: `bg-primary-dark/85`
- Copy remains legible over the image
- Trust chips wrap to 2-3 per row
- CTA buttons stack vertically

## Framer Motion Entrance

On mount, the left panel content animates in as a stagger sequence:
- Duration per item: 0.4-0.45s
- Easing: cubic-bezier(0.16, 1, 0.3, 1) (premium-out)
- Stagger delay: 0.07s between items
- Initial state: opacity 0, y 20
- `useReducedMotion()` must be checked: if true, stagger is 0 and initial state is {}

## Photo Brief for Nano Banana

**Prompt template:**
"A sparkling residential swimming pool in [city or region]. [mood_lighting_brief]. Crystal clear blue water, resort-quality. Clean pool deck. Lush landscaping or clear sky in background. Wide angle composition, pool fills the foreground. Photorealistic. No people required."

**Mood mapping:** See `hero-mood-mapping.json`.

**Default mood by region:**
- Arizona, Nevada, Texas (hot/sunny climates): bright_midday_clean
- Florida, Southeast: golden_hour_warm
- All others: golden_hour_warm

## SSIM Weight

The hero section carries **0.30 SSIM weight** (highest of all sections). A render that passes the hero fidelity check is likely passing overall. A render that fails the hero check is a gate failure.
