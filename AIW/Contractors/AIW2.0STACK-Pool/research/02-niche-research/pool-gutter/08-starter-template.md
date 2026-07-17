# 08 - Starter Design Template: Pool Services

Niche slug: pool-services
Research source: Sub-tasks 01-07 in this folder (pool-gutter research, pool-only scope applied)

This template defines the page structure, section priorities, copy direction, and trust signal placement for the first pool services website build. It is a starting point, not a rigid spec. Module 2D will refine it further using live site captures via Apify.

---

## Page Architecture (Single-Page or 5-Page Site)

### Minimum viable set:

1. Home (primary conversion page)
2. Services (cleaning, maintenance, repair -- split clearly)
3. About (owner story, credentials, service area)
4. Reviews / Proof (Google review embeds or screenshot grid)
5. Contact / Book (form + phone number + optional booking widget)

### Optional additions once template matures:
- Pool Installation sub-page (if client does installs)
- Cost Guide page (captures "how much does pool cleaning cost" traffic)
- Service Area page (targets city + suburb keywords)

---

## Home Page Structure (top to bottom)

### 1. Nav Bar
- Logo left
- Phone number right (click-to-call on mobile, always visible)
- Single CTA button: "Get a Free Quote" or "Book a Service"
- Keep nav links minimal: Services, Reviews, Contact

### 2. Hero Section
Priority: This is the most important section on the page. Gets 80% of conversion weight.

- **Headline format:** [Benefit] + [Location] -- no puns, no wordplay
  - Example: "Reliable Pool Cleaning in [City]. Done Right, Every Visit."
  - Example: "Your Pool, Clean and Clear. [City]'s Trusted Pool Service."
- **Subheadline:** One sentence on response speed or reliability
  - Example: "We respond within 2 hours. Most clients book their first service the same day."
- **CTA:** Two buttons. Primary: "Get a Free Quote" (links to contact form). Secondary: "See Our Work" (scrolls to gallery).
- **Hero image:** A clean, sparkling pool shot. If the client has a real before/after, use it here. No stock photos of generic pools -- prospects can tell.
- **Trust strip below hero:** 5 trust icons in a horizontal row
  - "100+ 5-Star Reviews" / "Licensed & Insured" / "Same-Day Response" / "100% Satisfaction Guarantee" / "[X] Years Serving [City]"

### 3. Problem/Solution Block
Two-column or card layout. Left: the pain (green pool, missed service, unreliable provider). Right: the client's solution.

Copy direction:
- "Tired of showing up to a pool that looks like a swamp? That stops here."
- Lead with the customer's frustration, not the service list.

### 4. Services Section
Three cards minimum: Pool Cleaning, Pool Maintenance, Pool Repair. Each card has:
- Service name
- 2-3 bullet points of what is included
- Starting price range (optional but converts better when present)
- "Learn More" or "Book This Service" CTA

If client does installation: add a fourth card. Use a distinct visual treatment (larger card, different background) to signal it is a different purchase.

### 5. Before/After Gallery
Minimum 6 photos. Before/after pairs convert better than single shots.
- Green pool before / clean pool after
- Cloudy water before / crystal clear after
- Algae-covered tile before / clean tile after

Caption each photo with the problem and the outcome. No generic alt text.

### 6. Reviews Section
- Pull 6-10 Google reviews, minimum 4 stars
- Show reviewer name, star rating, and 2-3 lines of the review text
- Include a "See All [X] Reviews on Google" link to their GMB profile
- If client has video testimonials, embed one here

### 7. Why Us / Trust Block
3-4 short columns or a list with icons:
- "Licensed and fully insured"
- "Serving [City] and surrounding areas since [year]"
- "Satisfaction guaranteed -- we come back if the job isn't right"
- "Photo documentation of every service visit"

### 8. Service Area
A simple text block or map embed:
- "We serve [City], [Suburb 1], [Suburb 2], and [Suburb 3]."
- Optional: embed a Google Maps API map showing the service radius

### 9. Final CTA Section
Full-width band. One headline, one button.
- Headline: "Ready for a cleaner pool? Let's get started."
- Button: "Get Your Free Quote Today"

### 10. Footer
- Business name + phone + email
- Service links
- Privacy policy link (required for any site with a contact form)
- "Serving [City] and surrounding areas"

---

## Contact / Quote Form Fields

Keep it short. Long forms kill conversions in this niche.

Required fields:
1. First Name
2. Phone Number (primary -- this is a phone-call business)
3. Service Needed (dropdown: Cleaning / Maintenance / Repair / Other)
4. Message (optional, placeholder: "Tell us about your pool or question")

Do not add: Last name (unnecessary), full address (privacy concern at intake stage), pool size specs (adds friction). Collect those on the follow-up call.

---

## Color Direction

Pool services is a visual, trust-first category. Colors should communicate clean, professional, and local.

Recommended palette:
- Primary: Deep blue or teal (#1A5276 or #0E6655 range)
- Accent: Clean white (#FFFFFF)
- Secondary text: Dark gray (#2C3E50)
- CTA button: Bright accent that stands out -- orange (#E67E22) or electric blue (#2E86C1) both work

Avoid: Dark themes, overly corporate palettes, green (reads as algae in pool context).

---

## Typography

- Headings: Bold, geometric sans-serif (Inter, Poppins, or Nunito)
- Body: Clean readable sans-serif (Inter or Lato at 16px minimum)
- No script fonts, no decorative fonts. This is a trade services site, not a spa.

---

## Mobile-First Priorities

Most pool service searches happen on mobile (homeowner in the backyard, problem just surfaced).

- Phone number in nav must be click-to-call
- Hero CTA button must be full-width on mobile
- Gallery images must be swipeable
- Contact form must be single-column on mobile
- Page load target: under 2.5 seconds on mobile

---

## AI Chatbot Placement (Voiceflow)

Wire in the AI chatbot as a bottom-right floating widget. Default trigger: appears after 15 seconds or on scroll past 50%.

Opening message: "Hey! Have a question about your pool? I can help you book a service or get a quick quote."

Key flows to build:
1. Service inquiry -> lead capture (name + phone)
2. Pricing question -> "Prices vary by pool size and service. Give me your number and we will call you back with an exact quote in under 2 hours."
3. Emergency / green pool -> fast-path to phone number

This is the differentiation no competitor has. Lead with it in sales conversations.

---

## Content the Client Needs to Provide (Build Checklist)

Before starting the build, collect from the client:
- [ ] 6+ photos of their work (before/after preferred)
- [ ] Service list with any pricing they are comfortable displaying
- [ ] Service area (city + zip codes or radius)
- [ ] Business name, phone, email, physical address (if they want it shown)
- [ ] Google Business Profile link (for reviews embed)
- [ ] Any certifications or licenses they hold
- [ ] Year founded or years in business

If they have none of this: start with stock pool photos as placeholders, build the structure, replace on delivery.

---

## Source
Research basis: Sub-tasks 01-07, pool-gutter research folder. Pool-only scope applied. Gutter content excluded from this template.
