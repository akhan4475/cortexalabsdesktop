# 08 - Starter Design Template: Landscaping

Generated: 2026-06-30
Niche: Landscaping (design/install focus)
Sub-task: Module 2C, Sub-task 8

This document is the canonical design brief for the landscaping website template. It drives the factory build.

---

## Template Philosophy

Landscaping is an aspirational, visual purchase. The buyer is imagining their yard transformed, not reacting to an emergency. Every design decision must serve that: show them the outcome first, build trust second, make the ask third. Portfolio comes before pitch.

---

## Page Architecture (Single-page scroll, all sections)

### Section 1 -- Hero
**Purpose:** Capture attention, state the promise, drive to the first CTA.

- **Background:** Full-bleed before/after split image OR drone overhead of a completed yard. No stock. Placeholder: dark gradient overlay on a lush green yard photo.
- **Headline options (A/B test these):**
  - "Transform Your Outdoor Space -- Free Design Consultation in [City]"
  - "From Overgrown to Outstanding -- [City]'s Most-Reviewed Landscape Team"
- **Subline:** "Responsive, on time, and done right. Over [N] happy homeowners in [City area]."
- **Primary CTA button:** "Get a Free Estimate" (links to form or section anchor)
- **Secondary CTA link:** "See Our Work" (anchors to portfolio section)
- **Social proof badge:** Star rating + review count, Google logo, placed below headline.

---

### Section 2 -- Trust Bar
**Purpose:** Immediate credibility before the visitor scrolls further.

Four icons in a horizontal strip:
1. [N]+ 5-Star Reviews
2. Licensed & Insured
3. [X] Years Serving [City]
4. Free Estimates

---

### Section 3 -- Services Grid
**Purpose:** Tell the visitor what is offered without making them hunt.

3 or 6 cards (responsive grid). Core services for design/install focus:
- Landscape Design & Installation
- Lawn Maintenance
- Hardscaping (Patios, Pavers, Retaining Walls)
- Irrigation Systems
- Seasonal Cleanup
- Sod Installation

Each card: icon, service name, one-sentence description. Card links to dedicated service section or page (optional, can be MVP-suppressed).

---

### Section 4 -- Portfolio / Before & After Gallery
**Purpose:** Primary conversion section for a visual purchase. Comes before "Why Us."

- 8-16 image slots, before/after pairs preferred.
- Each image labeled: [Service type], [City/Neighborhood], [Year] -- e.g. "Backyard Hardscape, Plano TX, 2024."
- No stock images. If client has no photos at launch, use placeholder frames with "Photo coming soon" and get real photos in week 1.
- CTA below gallery: "Like what you see? Let's plan yours. [Get a Free Estimate]"

---

### Section 5 -- Why Us
**Purpose:** Address the fears. Responsive, communicates, shows up, does it right.

4 differentiators (icon + heading + 1 sentence each):
1. **We Respond Same Day** -- "Call or text us and hear back within hours, not days."
2. **On Time, Every Time** -- "We respect your schedule. Projects start and finish when we say they will."
3. **Design Expertise** -- "We don't just show up and cut -- we help you visualize the yard you actually want."
4. **No Mess Left Behind** -- "Every project ends with a full site cleanup. You get the result, not the rubble."

---

### Section 6 -- Google Reviews
**Purpose:** Third-party validation before the final ask.

- 3-5 review cards, Google branding, star rating, reviewer name (first name + last initial), review text excerpt.
- Heading: "[N] Happy Homeowners in [City Area]"
- Subline: "See all reviews on Google Maps."
- Link to Google Business Profile.

---

### Section 7 -- Process Steps
**Purpose:** Reduce friction for hesitant buyers by showing it is easy to get started.

3-step horizontal flow:
1. **Free Consultation** -- "Tell us what you want. We come to you, no obligation."
2. **Custom Design + Quote** -- "We design a plan for your space and give you an itemized quote."
3. **We Build It** -- "Sit back. Our crew handles everything start to finish."

CTA below: "Start With a Free Consultation"

---

### Section 8 -- Service Areas
**Purpose:** Local SEO anchor + lead pre-qualification.

- Heading: "Serving Homeowners in [City] and Surrounding Areas"
- Bulleted list of cities and neighborhoods (client populates this with their real service area)
- Embedded Google Map (optional, can be toggled off for MVP)
- Short paragraph: "Not sure if we serve your neighborhood? Call us -- we probably do."

---

### Section 9 -- Final CTA / Contact Form
**Purpose:** Capture the lead.

- Heading: "Get Your Free Landscape Estimate"
- Subline: "Fill out the form and we'll be in touch within 24 hours."
- Form fields:
  - Full Name (required)
  - Phone (required)
  - Email (required)
  - Zip Code (required -- crew scheduling pre-qualification)
  - Service Interested In (dropdown: Landscape Design / Lawn Maintenance / Hardscaping / Irrigation / Other)
  - Message / Tell us about your project (optional textarea)
  - Submit button: "Request My Free Estimate"
- Below form: Click-to-call button ("Prefer to call? [Phone number]")

---

### Section 10 -- Footer
- Logo, tagline
- Nav links: Services | Portfolio | About | Service Areas | Contact
- Phone number (prominent)
- Address (if applicable) or "Serving [City] and surrounding areas"
- License number: "Licensed & Insured | [State] License #[number]"
- Social icons: Facebook, Instagram, Google (links to GMB)
- Copyright line

---

## Sticky / Persistent UI

- **Sticky header (desktop):** Logo left, nav center, "Get Free Estimate" button right + phone number.
- **Sticky header (mobile):** Logo left, hamburger menu right.
- **Mobile bottom bar (fixed):** Phone icon + "Call Now" left, form icon + "Free Estimate" right.

---

## Color and Typography Direction

- **Primary palette:** Deep forest green (#2D5016 or similar), warm white (#FAFAF7), earthy neutral (#8B7355).
- **Accent:** Bright green (#5A8C1A) for buttons and highlights.
- **Typography:** Clean sans-serif for body (Inter or similar). Slightly heavier weight for headlines. No script fonts.
- **Feel:** Premium but approachable. Not corporate. Not cheap. Think "trusted local expert."

---

## AI Chatbot Placement (Voiceflow / Make.com)

- Bottom-right bubble, persistent on all scroll positions.
- Open state: "Hi! I'm here to help you plan your outdoor space. What are you looking for?" (dropdown options: Get a quote / See portfolio examples / Find out if we serve your area / Something else)
- Captures: name, phone, zip, service interest. Posts to client CRM or email via Make.com webhook.
- Differentiator copy (for student's sales pitch): "No competitor in this space has this. Your website answers questions and books leads 24/7, even when you're on a job."

---

## Pages (MVP vs Full Build)

### MVP (one-page, all sections above)
- Everything above on a single scroll page.
- Nav anchors to each section.
- Estimated build time: 2-3 days with Vite + React template.

### Full Build (multi-page, post-MVP)
- Home (above)
- Services (individual pages per service: landscape design, hardscaping, irrigation, etc.)
- Portfolio (expanded gallery page with filters by service type)
- About (owner bio, team photos, company story)
- Service Areas (individual pages per city for local SEO)
- Blog (optional, SEO content: "How much does landscaping cost in [City]?")
- Contact

---

## Key Differentiators vs Existing Agency Products

| Feature | Evergrow / Lawnline / Thrive | This Template |
|---|---|---|
| AI chatbot | None | Voiceflow chatbot, captures leads 24/7 |
| Portfolio-first layout | Some have galleries | Before/after gallery at section 4, above "Why Us" |
| Design consultation CTA | Generic "Free Estimate" | "Free Design Consultation" -- higher intent |
| Service area SEO | Generic | Named neighborhoods, embedded map, city list |
| Mobile bottom bar | Rarely used | Fixed call + estimate bar on all mobile pages |
| Price | $1,500-5,000/mo retainer | One-time $600-1,200 build |

---

## Source Traceback
- `02-customer-voice.md`: Fear + decision moment analysis
- `03-copy-patterns.md`: Headline and CTA options
- `04-cro-patterns.md`: Section sequence, form patterns, sticky elements
- `05-trust-signals.md`: Trust stack ordering, badge list
- `07-money-math.md`: ROI anchor for sales pitch
- `synthesis.md`: Niche summary and positioning rationale
