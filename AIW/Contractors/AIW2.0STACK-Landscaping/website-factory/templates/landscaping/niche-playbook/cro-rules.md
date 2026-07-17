# CRO Rules: Landscaping Niche

These rules define how the landscaping template is optimised for lead conversion. Every component and page must follow these rules. They are derived from Module 2B research on residential landscaping buyer behaviour.

---

## Core insight

The landscaping end customer is a visual buyer spending $8-15k on a yard transformation. They make the decision emotionally (I want that) and justify it rationally (they're licensed, other people hired them, the price makes sense). Design for the emotional trigger first, the rational reassurance second.

## Funnel sequence on homepage

The section order is NOT arbitrary. Every section is a step in the conversion funnel:

1. Hero: Aspirational hook + primary CTA. Dual CTA (estimate + call) serves both form-fillers and phone-preferrers.
2. Trust bar inline: Immediate validation — rating, review count, years, license. Removes the first objection before the prospect even reaches services.
3. Services: Qualifies the lead. If they see their need here, they're in.
4. Portfolio: Visual proof. This is the primary conversion trigger for landscaping. Placed BEFORE Why Choose and Reviews because seeing is believing — social proof matters more after visual proof.
5. Why Choose: Addresses specific reliability fears (showing up, communication, cleanup).
6. Process: Removes friction. "I don't know what the process looks like" is a common stall. Three steps dissolves it.
7. Reviews: Social proof after visual proof. Reinforces the decision already forming.
8. Founder: Human trust. Homeowners want to know who is coming to their property.
9. Service areas: Local relevance. Closes the "do you serve my area?" loop without a call.
10. FAQ: Objection handling. Cost, timeline, insurance — the three questions that stall every landscaping sale.
11. CTA form: Conversion point. Dark background creates closure.

Do not reorder these sections without a specific conversion test reason.

## CTA rules

- Always dual: primary (form scroll) + secondary (click-to-call)
- Primary button: accent fill, rounded-full, minimum 48px height
- Never "Contact Us" or "Learn More" — always "Get a Free Estimate" (primary)
- Phone always visible: in trust bar, nav, hero secondary CTA, form section, footer
- Mobile: MobileBottomBar pins both CTAs to bottom at all times

## Form rules

- 6 fields maximum. Never 7+.
- No CAPTCHA at form level (use Cloudflare Turnstile at network level)
- Zip code field pre-qualifies geography without asking "are you in our area?"
- Service dropdown pre-segments the lead for the client's internal routing
- Privacy line below submit button: required
- Response time guarantee in subtext: required (creates urgency without pressure)

## Above-fold requirements

The hero must show three things above the fold on desktop at 1440x900:
1. Company name or logo
2. Primary CTA button
3. Trust signal (review count or license badge)

Failing any of these drops conversion significantly.

## Mobile rules

- MobileBottomBar fixed to bottom: always visible
- Both CTAs must be reachable with one thumb in the bottom third of the screen
- Hero CTAs stack vertically on mobile (primary full-width, secondary full-width below)
- Trust chips hide on mobile to reduce visual noise (they appear in trust-bar-inline instead)

## Trust bar rules

The trust bar above the nav is the #1 CRO element borrowed from Mountainscapers. Reasoning:
- It appears before the nav — unconditional visibility
- License number in the trust bar is a direct proxy for "not a fly-by-night operator"
- Phone number in accent color in the trust bar serves phoners who would otherwise bounce without scrolling

Do not move the trust bar into the nav. Do not remove it.

## Portfolio placement rule

Portfolio must appear before reviews. Research from Module 2B confirms: residential landscaping is a visual purchase. Prospects who see work they like THEN read reviews. Prospects who read reviews without seeing work are more price-sensitive and more likely to comparison-shop.

## AI chatbot placement

Voiceflow bubble: bottom-right, z-index above all scroll content.
Opens with: "Hi! What can I help you with?" + 3 chips: "Get a quote" / "See our work" / "Check if we serve your area"
Captures: name, phone, zip, service interest -> Make.com webhook -> client CRM or email.
Do not show the bubble on load. Trigger after 5 seconds or 40% scroll.
