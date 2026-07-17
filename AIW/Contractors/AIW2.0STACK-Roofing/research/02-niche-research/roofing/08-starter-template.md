ROOFING NICHE -- STARTER DESIGN TEMPLATE
Sub-task 8 of 8 | Generated: 2026-06-26

This document is the design brief for the roofing niche website template. It is the input to Module 2D (build-niche-template) and informs the Vite + React scaffold inside the factory.

---

## Page Structure (Section Order)

The section order is optimized for the roofing niche trust gap. Trust signals lead earlier than the universal wireframe because fear of being scammed is the #1 conversion barrier.

1. Sticky Header
2. Hero
3. Trust Bar (social proof + badges)
4. Services Grid
5. Why Us
6. Before/After Gallery
7. Reviews
8. Process Steps
9. Insurance Claim Section
10. FAQ
11. Final CTA + Form
12. Footer

---

## Section Specs

### 1. Sticky Header
- Logo (left)
- Phone number (center or right, click-to-call on mobile)
- "Get Free Estimate" button (primary color, right)
- Sticks on scroll. Disappears on scroll down, reappears on scroll up (mobile).

### 2. Hero
- Full-width background: real photo of crew working on roof or finished roof from street. No stock images.
- Overlay with headline and CTA.
- Headline template: "Roofing [City] Trusts -- [N] 5-Star Reviews, Free Inspections, No Games"
- Subheadline template: "Licensed, insured, and GAF certified. We handle storm damage, replacements, and repairs -- fast."
- Primary CTA button: "Get a Free Estimate"
- Secondary: click-to-call phone number
- Star rating + review count visible in hero (e.g., "4.9 stars -- 87 Google Reviews")

### 3. Trust Bar
- Horizontal row of badges immediately below hero.
- Left to right priority: Google rating + count | GAF certification | BBB A+ | Licensed & Insured | Years in business
- All badges clickable/linkable where applicable (Google profile, BBB listing).
- Background: dark (near-black or deep gray) for contrast.

### 4. Services Grid
- 2x3 or 3x2 card grid.
- Cards: Roof Replacement | Roof Repair | Storm Damage | Emergency Repair | Gutter Services | Free Inspection
- Each card: icon + title + one-line description + "Learn More" link.
- Mobile: single column stack.

### 5. Why Us
- 4 differentiators in a horizontal row (desktop) or 2x2 grid (mobile).
- Recommended differentiators:
  1. "Completed in 1 Day" -- speed signal (highest review mention rate)
  2. "Insurance Claim Help Included" -- pain removal, highest-ticket jobs
  3. "No Mess Left Behind" -- specific objection removal (nails in yard)
  4. "Lifetime Warranty on Every Install" -- risk reversal
- Each: icon + bold title + 1 sentence.

### 6. Before/After Gallery
- 6 image pairs minimum at launch. 12 pairs ideal.
- Each pair: side-by-side or slider toggle.
- Label each: city/neighborhood + service type + year.
- No stock photos. Real project photos only.
- CTA below gallery: "See More of Our Work" or "Get a Free Inspection"

### 7. Reviews
- 3-6 Google review tiles in a horizontal scroll or 2-column grid.
- Each tile: reviewer name + star rating + review excerpt + date.
- Pull from Google Maps. Screenshot tiles acceptable if embed is not available.
- Section header: "[N] Homeowners in [City] Trust [Company Name]"
- Link to Google profile: "Read All [N] Reviews on Google"

### 8. Process Steps
- 4 steps in a horizontal timeline (desktop) or numbered vertical list (mobile).
  1. Free Roof Inspection -- We assess damage and give you an honest estimate.
  2. Estimate Review -- We walk you through the scope and answer every question.
  3. Install Day -- Crew arrives on time, completes the job, cleans up fully.
  4. Final Walkthrough -- We inspect with you before we leave.
- Tone: calm, no pressure, transparent.

### 9. Insurance Claim Section
- Dedicated section (not just a bullet in services).
- Headline: "We Handle the Insurance Process for You"
- Body: 3-4 sentences explaining the student's client guides the homeowner through the claim, communicates with the adjuster, and ensures nothing is missed.
- CTA: "Start Your Claim Walkthrough" -- links to contact form or AI chatbot trigger.
- This section is the AI chatbot anchor point. The Voiceflow chatbot, when added, launches from the CTA in this section.

### 10. FAQ
- 5-7 questions. Recommended:
  1. How long does a roof replacement take?
  2. Do you work with insurance companies?
  3. What roofing materials do you use?
  4. Do you offer a warranty?
  5. How do I know if I need a repair or a full replacement?
  6. Are you licensed and insured in [State]?
  7. How fast can you give me an estimate?
- Accordion format. One open at a time.

### 11. Final CTA + Form
- Repeated headline: "Get Your Free Roof Estimate Today"
- Subtext: "No pressure. No sales games. Just an honest assessment from a licensed local roofer."
- Form fields: Name | Phone | Service Needed (dropdown: Replacement / Repair / Storm Damage / Not Sure) | Best Time to Call
- Submit button: "Send My Request"
- Phone number displayed below form as alternative.

### 12. Footer
- Logo + tagline
- Nav links (Services, About, Gallery, FAQ, Contact)
- License number + "Licensed & Insured in [State]"
- GAF / BBB badges (small)
- Google review count + link
- Privacy Policy link

---

## Mobile-Specific Requirements

- Sticky bottom bar: two buttons side by side -- "Call Now" (click-to-call) | "Free Estimate" (scrolls to form)
- Hero CTA stacks vertically on mobile. Phone number is a tap-to-call link.
- Gallery on mobile: full-width single-image slider. No side-by-side pairs.
- Trust bar on mobile: horizontal scroll of badges. Do not stack vertically.
- Form on mobile: full-width fields, large tap targets.

---

## AI Chatbot Integration Point

The Voiceflow chatbot widget is embedded as a floating button (bottom right) across all pages.

Primary trigger points:
- Insurance Claim Section CTA button
- Hero secondary CTA (optional: "Chat with us")
- Mobile sticky bar (optional third button)

The chatbot script tag drops into the `<head>` or just before `</body>`. One placeholder comment in the template marks the insertion point:
```html
<!-- VOICEFLOW_CHATBOT_SCRIPT_PLACEHOLDER -->
```

---

## Color and Typography Direction

- Primary color: a strong, confident blue or dark slate (trust + authority). Avoid red/orange as primary -- too alarming for a $10k purchase decision.
- Accent color: high-contrast yellow or white for CTA buttons. Must pass WCAG AA contrast on primary background.
- Background: white or very light gray for content sections. Dark section for trust bar and final CTA.
- Body font: clean sans-serif (Inter, Poppins, or DM Sans). No decorative fonts.
- Heading font: same family, heavier weight, or a condensed variant for impact.
- Minimum body size: 16px. CTA buttons: 18px+.

---

## Template File Notes for Module 2D

When the factory scaffolds this template:
- Route: `/` (homepage, single-page scroll for most clients)
- Optional additional pages: `/services/roof-replacement`, `/services/storm-damage`, `/services/roof-repair`
- The config key in `template-routes.json` is `"roofing"`.
- Components to generate: HeroRoofing, TrustBar, ServicesGrid, WhyUs, GalleryBeforeAfter, ReviewTiles, ProcessSteps, InsuranceSection, FAQAccordion, ContactForm, FooterRoofing, MobileStickyBar.
- All placeholder content uses `[COMPANY_NAME]`, `[CITY]`, `[PHONE]`, `[REVIEW_COUNT]`, `[YEARS_IN_BUSINESS]` tokens. The student replaces these per client during factory run.

---

Source files used: 03-copy-patterns.md, 04-cro-patterns.md, 05-trust-signals.md, synthesis.md
