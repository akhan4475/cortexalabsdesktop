# Zero to $10K/Month With WAS — 5-Step Blueprint (GoHighLevel-Based)
**Category:** offer_design
**Source Type:** youtube (transcript pasted by user)
**Source URL:** not provided
**Creator:** Armando Garcia (mandobiz)
**Date Captured:** 2026-07-14
**Applies To:** all
**Quality Score:** 6 (strong sales philosophy; delivery mechanics are GoHighLevel-specific and NOT applicable to CortexaLabs' stack)
**Tags:** acquisition-channels, preview-first, sell-the-outcome, dm-script, gohighlevel-snapshot, crm-stickiness, revenue-math, upsell-mention

---

## Key Tactics

1. **5-step blueprint:** (1) Acquisition — find prospects with no/bad websites via Google Maps, Instagram, Facebook groups, and TikTok. (2) Make a preview within 5 minutes using a pre-built snapshot template. (3) Pitch the preview via DM. (4) Collect payment — $500 up front / $500 on delivery (his pricing). (5) Collect $99/mo recurring to keep it running.
2. **"Sell the outcome, not the website."** Core reframe: prospects don't care about the website itself, they care about getting more customers/revenue. Analogy used: "you could go out in a trash boat, but if you catch the best fish, doesn't matter" — the product is invisible, the result is what's being sold.
3. **Businesses that already have a website are still viable prospects** — if their existing site is weak, pitch a rebuild + automations rather than skipping them for having "some" web presence.
4. **TikTok as an acquisition channel** — local businesses post on TikTok hoping to go viral and don't; that audience is reachable and underexploited compared to Google Maps/IG.
5. **The CRM/automation layer is the actual retention driver, not the website.** Exact framing used: "We're not selling the website. We're selling the connection." When a lead fills out a form, the system auto-messages the lead AND notifies the client — described as replacing a full-time assistant. This is why the monthly fee doesn't get cancelled: "you become an operational cost instead of just another expense on the table that people will cut off."
6. **Revenue math cited:** 20 sites sold = $20K upfront + $2K/mo recurring (at $99/mo each). 10 sites = $10K upfront + $1K/mo recurring. One month's actual report cited: avg sale $99, $22K in recurring revenue that month.
7. **Pricing was raised over time** — started at $99/mo, later increased to $197/mo for hosting (mentioned as a topic for a separate video, not detailed here).

---

## Frameworks

### 5-Step Zero-to-$10K Blueprint
```
1. Acquisition   — Google Maps / Instagram / Facebook groups / TikTok, target no-website or bad-website businesses
2. Preview        — build a 5-minute preview site from a template before any pitch
3. Pitch          — send the preview via DM, let it do the selling
4. Payment         — 500 upfront / 500 on delivery (his pricing — not CortexaLabs')
5. Recurring       — monthly fee to keep the site + CRM/automations running
```

### DM Script (verbatim from source)
```
Opener: "Hey man, I noticed you didn't have an existing website for your business. So I want to show you this front page I made for you. Let me know what you think."
Typical reply cited: "Oh wow, how much does this all cost?"
```

---

## Exact Phrases Worth Testing

> "We're not selling the website. We're selling the connection."
> Context: reframes the monthly fee as buying a lead-response system, not site upkeep. Same underlying idea as the WAS breakdown video's "replaces a full-time assistant" framing — reinforcing, not new.

> "You become an operational cost instead of just another expense on the table that people will cut off."
> Context: explains recurring-revenue stickiness — the client keeps paying because canceling breaks something they now depend on operationally, not because they're loyal to "a website."

> "They care about the outcome. They don't care about the boat. You could go out in a trash boat, but if you catch the best fish, it doesn't matter."
> Context: general sales-philosophy line for reframing any pushback about the build itself (tech stack, platform, tooling) back to results.

---

## Raw Notes

**Important divergence from CortexaLabs' actual stack:** this entire delivery model (snapshots, CRM automations, hosting) is built on GoHighLevel. CortexaLabs builds on React/Vite and explicitly does not use GoHighLevel — this is confirmed in `agency-os/CLAUDE.md` non-negotiables and `context/offer.md`. The mechanics here (import a "snapshot," GHL handles fulfillment) are not directly portable and should not be treated as a delivery instruction — only the sales philosophy and acquisition-channel ideas transfer.

This video overlaps heavily with the two other Armando Garcia videos captured earlier today (`2026-07-14-armando-garcia-was-business-model-breakdown.md`, `2026-07-14-armando-garcia-90-day-was-agency-plan.md`) — same $1,000/$99mo pricing reference, same preview-first method, same "replaces a full-time assistant" framing for the CRM upsell. Treat as reinforcement of an already-captured pattern, not new direction, except for: TikTok as a channel, the "sell the outcome not the website" framing, and the "pitch even businesses with an existing bad site" point.

---

## How to Apply — CortexaLabs

- **"Sell the outcome, not the website"** and **"we're selling the connection"** — worth adding as a positioning note to `skills/offer-design/SKILL.md` Positioning section; reinforces the ROI-framing approach already there without needing new pricing.
- **TikTok as an acquisition channel** — not currently in CortexaLabs' scraping/outreach setup (Apify covers Google Maps + Instagram + Facebook per `agency_os_build_plan.md`). Flagging as a possible Scout expansion, not implementing — would need its own qualification/scrape approach and is a build decision, not a content one.
- **Pitching businesses with an existing-but-bad site** — already implicitly covered ("bad OR no website" is the standing disqualification logic per `context/icp.md`), no change needed.
- **Do not adopt GoHighLevel snapshot/CRM delivery mechanics** — out of scope for CortexaLabs' stack (Supabase + React/Vite, no GHL dependency).
