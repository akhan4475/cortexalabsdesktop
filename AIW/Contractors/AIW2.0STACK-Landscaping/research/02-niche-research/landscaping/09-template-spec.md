# 09 - Template Spec: Landscaping
Generated: 2026-06-30 | Mix: GreenOasis (design) + Keane (CTA/nav) + Mountainscapers (trust)

---

## 1. Design intent

A dark-forest-green lead-generation site for residential landscaping design/install companies. The palette is premium and earthy without being rustic. Every section is optimised as a step in a single funnel: aspirational hero -> visual proof (portfolio) -> trust validation (reviews + badges) -> low-friction conversion (form + call). The AI chatbot handles 24/7 lead capture between sections.

Target client: 1-20 employee landscaping company, $200k-2M/year, design/install focus.
Target end customer: Homeowner, $8-15k project budget, visual buyer, anxious about reliability.

---

## 2. Color system (from GreenOasis)

| Token | Hex | Use |
|---|---|---|
| primary | #0d3320 | Nav background, hero overlay, footer, section backgrounds |
| primary_dark | #091f14 | Hover states, pressed buttons |
| primary_slate | #1a4d30 | Secondary section backgrounds, card backgrounds |
| accent | #4ade80 | Primary CTA buttons, active nav, highlights |
| accent_light | #86efac | Hover state on accent, trust chips |
| accent_dark | #16a34a | CTA hover, link underlines |
| neutral | #94a3b8 | Body text on dark backgrounds |
| neutral_dim | #475569 | Muted labels, captions |
| silver | #cbd5e1 | Dividers, input borders |
| ink | #f8fafc | Primary text on dark backgrounds |

Google Fonts URL: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap`

Heading font: Fraunces (serif display, weight 600 -- conveys craft, premium, nature-connected)
Body font: Plus Jakarta Sans (clean modern sans, weight 400/500/600)

Rationale: Fraunces is an optical-size variable serif inspired by early 20th century type. It reads premium and nature-adjacent without being rustic. Plus Jakarta Sans pairs cleanly at any size.

---

## 3. Trust bar (from Mountainscapers)

A thin strip ABOVE the nav (not inside it). 40px height. Dark background (primary). Three columns:
- Left: License number + "Licensed, Bonded & Insured" text (14px, neutral)
- Center: Phone number with phone icon (14px, accent -- clickable)
- Right: BBB badge image (monochrome white SVG, 28px height)

Hides on mobile (info redundant with sticky bottom bar). Desktop and tablet only.

---

## 4. Navigation

Sticky on scroll. Transparent over hero, dark (primary) background after 80px scroll.

- Left: Logo (leaf icon SVG + wordmark in Fraunces)
- Center: Residential | Commercial | Portfolio | About | Blog
- Right: Phone number (small, ink) + "Get a Free Quote" button (accent fill, rounded)

Mobile: Hamburger menu. Slides in from right. Full-screen dark overlay. CTA button full-width at bottom of menu.

---

## 5. Hero (from GreenOasis palette, original composition)

Full-bleed, 100vh. Dark overlay on a full-page landscape photo (real project -- before/after or overhead drone of completed yard).

Layout: Left 55% reserved for text, right 45% image bleeds through overlay.

```
[TRUST BAR above nav]
[NAV - transparent, sticky]
[                              |                    ]
[  EYEBROW: 5-star + N reviews |  [PROJECT PHOTO]  ]
[  H1: Transform Your          |                    ]
[     [City] Yard              |                    ]
[  Subline: Responsive,        |                    ]
[  on time, done right.        |                    ]
[                              |                    ]
[  [Get a Free Estimate] [Call Now]                 ]
[  [trust chips row]                                ]
[                              |                    ]
```

Trust chips (3 inline icons + text): "Licensed & Insured" | "Same-Day Response" | "Free Estimates"

Scroll indicator (animated chevron) at bottom center.

---

## 6. Section sequence (from Keane nav/sitemap, CRO research)

| # | Section slug | Purpose | Conversion role |
|---|---|---|---|
| 1 | hero | Aspirational entry, primary CTA | Hook |
| 2 | trust-bar-inline | Star rating + review count + 3 badges | Immediate validation |
| 3 | services | Services grid (6 cards) | Qualify + anchor |
| 4 | portfolio | Before/after gallery (8-16 pairs) | Visual proof = primary conversion trigger |
| 5 | why-choose | 4 differentiators with icons | Address fears |
| 6 | process | 3-step How it works | Remove friction |
| 7 | reviews | Google review cards (3-5) | Social proof |
| 8 | founder | Owner bio + credentials | Human trust |
| 9 | service-areas | City/neighborhood list + map | Local SEO + pre-qualify |
| 10 | faq | 6 questions (cost, timeline, insurance) | SEO + objection handling |
| 11 | cta-final | Form + click-to-call | Conversion |
| 12 | footer | Nav + contact + license + social | Retention |

---

## 7. Portfolio section (primary conversion section)

Position 4, before Why Choose and Reviews. This is intentional -- visual proof before pitch.

Grid: Masonry or 2-column alternating layout. Desktop: 2 columns. Mobile: 1 column.
Each card: Before/After toggle (click to flip or side-by-side split). Label: City + Service Type + Year.
Below grid: "Like what you see? Let's plan yours." + primary CTA button.

---

## 8. CTA pattern (from Keane)

Dual button everywhere: primary (filled accent) + secondary (outlined, click-to-call).
- Primary: "Get a Free Estimate" (navigates to #contact-form)
- Secondary: "Call [phone]" (tel: link, phone icon left)

Sizing: Primary 48px height, 20px horizontal padding. Secondary same height, outlined 1.5px.
Gap between buttons: 12px.

Mobile: Stack vertically. Primary full-width. Secondary full-width below.

---

## 9. Form (Section 11)

Heading: "Get Your Free Landscape Estimate" (Fraunces, 32px)
Subline: "We respond within 2 hours. No commitment, no hard sell."

Fields:
1. Full Name (required)
2. Phone (required, tel input)
3. Email (required)
4. Zip Code (required, numeric, 5-digit -- pre-qualifies geography)
5. Service (dropdown: Landscape Design / Lawn Maintenance / Hardscaping / Irrigation / Sod Installation / Other)
6. Tell us about your project (textarea, optional)
7. Submit: "Request My Free Estimate"

Privacy line: "We never share your info. No spam. No hard sell."
Below form: Click-to-call fallback "Prefer to call? [phone number]"

---

## 10. Motion preset

Preset: restrained (premium landscaping -- calm, editorial, not bouncy)
- Scroll reveal: section-stagger-fade (0.08s stagger, 400ms duration, premium ease out)
- CTA hover: scale 1.02, accent-dark fill, 180ms
- Portfolio card hover: subtle lift (translateY -4px), shadow increase, 200ms
- Nav: background fade on scroll, 300ms
- Trust chips: fade in sequence on hero load, 80ms stagger
- Tier 2 enabled: scroll-headline-reveal, section-stagger-fade
- honorsReducedMotion: true

---

## 11. SEO architecture

Primary keyword targets:
- "[city] landscaping company"
- "[city] landscape design"
- "[city] lawn care"
- "[city] hardscaping"

Page structure:
- Homepage: Primary local landing, targets city-level keywords
- /services: Services overview
- /services/[slug]: Per-service pages (6 slugs)
- /portfolio: Full gallery with filter by service type
- /about: Founder story, credentials, team
- /service-areas: Hub page + links to city pages
- /service-areas/[city-slug]: Per-city pages (local SEO silos)
- /blog: Seasonal and cost-content articles
- /contact: Full contact form + map
- /faq: Cost + process FAQs (featured snippet targets)

Schema: LocalBusiness (LandscapeArchitect type), AggregateRating, Service per service, FAQPage, GeoCoordinates.

---

## 12. AI chatbot placement

Voiceflow bubble: bottom-right, persistent across all scroll positions.
Opens: "Hi! What can I help you with?" (3 quick-reply chips: "Get a quote" / "See our work" / "Check if we serve your area")
Captures: name, phone, zip, service interest. POSTs to Make.com webhook -> client CRM or email.

Bubble color: accent (#4ade80). Icon: leaf SVG. Z-index above all content.

---

## 13. Fidelity thresholds (for Phase 11 SSIM gate)

| Region | Weight | Threshold |
|---|---|---|
| Hero (top 40% of page) | 0.35 | 0.65 |
| Trust bar inline (section 2) | 0.15 | 0.70 |
| Portfolio section | 0.25 | 0.60 |
| CTA final section | 0.15 | 0.70 |
| Footer | 0.10 | 0.55 |

Overall SSIM target: >= 0.70 (Gate 5 WARN threshold).
