# How I Land Web Design Clients Using Methods Nobody Else Knows!
**Category:** lead_sourcing (new category — Google Maps/IG/FB scraping is covered elsewhere; this video is specifically about channels beyond that)
**Source Type:** youtube
**Source URL:** not provided (title: "How I Land Web Design Clients Using Methods Nobody Else Knows!")
**Creator:** Cameron Jeanes (5.11K subscribers, runs thewebagencyclub.com)
**Date Captured:** 2026-07-14
**Applies To:** Scout agent (prospecting channels) — not a copy/script skill, this is about where to find leads, not what to say to them
**Quality Score:** 7 — genuinely different acquisition channels than what's currently built (Google Maps/IG/FB via Apify), but two of the three require new tooling/manual process not currently in the Scout agent's scope
**Tags:** expired-domains, ad-hijacking, wayback-machine, facebook-ad-library, agency-outsourcing, b2b2b, lead-sourcing, prospecting-channels

---

## Key Tactics

### Method 1 — Expired Domains
1. Use expireddomains.net (free account) → filter by keyword (niche, e.g. "electrician," "plumbing," "dentist") + `.com` only + last 30 days + English + no numbers/hyphens. The filters exist to screen out spammy SEO/domain-squatter listings and surface real former businesses.
2. Fact-check candidates two ways: (a) Wayback Machine snapshot check on the expired domain — look for a snapshot showing a phone number, reviews, or other proof it was a real operating business (blue-marked snapshots tend to have more content than yellow/orange); (b) Google the business name to confirm it's still actively running (recent Facebook posts, active social accounts) even though the *website* is gone.
3. The pitch angle: this isn't cold outreach to "have no site" or "have a bad site" — it's a business that already had a site, already understood the value, and lost it. Positioned as solving an urgent, already-validated problem rather than educating them on why they need a website at all.

### Method 2 — Ad Hijack Sniping (creator's stated favorite)
1. Find businesses currently running paid ads (Facebook Ad Library with country + "all ads" toggle, Google search, or just noticing ads organically) where the ad sends traffic to no website, a low-quality website, or just their Instagram/Facebook page instead of a real landing page.
2. The core insight: these businesses are already paying for traffic and already have budget allocated to marketing — the argument isn't "you should spend money on a website," it's "you're already spending money and leaking it at the landing page." Framed as a straightforward ROI increase, not a new expense.
3. Pitch asset: a 1-2 minute Loom (or any short video) highlighting the specific leak — "I saw your ad, but noticed a problem that's likely costing you leads" — ideally paired with a quick mockup of what a converting landing page would look like. Creator notes the video doesn't have to be sent immediately/cold — it can follow an initial outreach message once there's a response, rather than always leading with video.

### Method 3 — Agency Outsource Method (B2B2B channel, not direct-to-business)
1. Target small-to-mid video/marketing/creative agencies that don't publicly list web design as a service (search Google Maps/Instagram/Facebook for "[service] agencies in [city]"). Small studios are the target — larger ones usually already have an in-house designer.
2. Positioning: offer to be their outsourced web design capacity, either as a pass-through contractor or a "lead web designer" they can present as part of their own team without hiring overhead. The agency keeps a cut of what their client pays (creator's example: client pays agency $3-4K, agency passes $500-1K to the web designer) — framed as a win-win-win even if the agency takes zero margin, since it's still free client flow for the web designer.
3. **Contact method matters as much as the message:** submit through the agency's own website contact form rather than cold email. Rationale given: agencies treat their own contact-form submissions as real inbound leads and reliably respond to them, whereas cold email has a high chance of landing in spam or being ignored as one of many outreach messages they receive daily.
4. Provided a verbatim outreach script (see below) and notes it converted to a booked call in his own experience.
5. On the call: lead with credibility — show past projects, systems, and position yourself explicitly as a "lead web designer," not just a freelancer being tested.

---

## Frameworks

### Expired Domain Qualification Sequence
```
1. expireddomains.net → filter: .com, last 30 days, English, no numbers/hyphens, keyword = niche
2. Wayback Machine → confirm real business (phone number, reviews, real content in a snapshot)
3. Google the business name → confirm still actively operating (recent social posts)
4. If site is gone but business is active → hot lead, reach out
```

### Ad Hijack Sequence
```
1. Facebook Ad Library (or Google/organic ad spotting) → find active ads in target niche/city
2. Click through the ad → identify where it lands (no site / bad site / just IG or FB profile)
3. Build a mockup or short Loom highlighting the specific leak
4. Outreach: lead with "saw your ad, noticed a leak" — send video either immediately or after first response, creator's choice
```

### Agency Outreach Script (verbatim, submitted via agency's own contact form)
```
Hey team, I've seen your agency pop up here and there for a while now and I've always been
impressed with the way you guys present your marketing services. I noticed that out of all the
offers you promote publicly, web design isn't one of them — whether you offer it on the side or
not, I wanted to reach out and introduce myself.

I'm a [nationality] web developer and I've worked with numerous credible businesses and large
profile creators [worldwide/region]. I'd love to explore ways I can help your clients, as web
design goes hand-in-hand with marketing services.

For example, I work with agencies that outsource projects to me directly, or if it makes sense,
bring me on as a lead web design team member to expand your service offering without the
overhead. Feel free to check out my own personal site so you can see my designs.

Would you be down for a quick chat?
Thanks, [name]
```

---

## Exact Phrases Worth Testing

> "We're not just cold pitching — we're solving an urgent problem for businesses that are losing customers daily."
> Context: framing for the expired-domains method — the pitch is inherently warmer because the business already validated the need for a website.

> "They're already spending money on ads. So fixing their landing page instantly increases their ROI and makes your offer a no-brainer."
> Context: ad hijack sniping's core value proposition — reframes the pitch from "new expense" to "ROI fix on existing spend."

---

## Raw Notes

This is a genuinely different category of content than everything else captured so far — it's about *where to find leads*, not what to say once you've found them. Methods 1 and 2 both require tooling CortexaLabs doesn't currently have built: Scout's Apify setup covers Google Maps, Instagram, and Facebook scraping per `agency_os_build_plan.md`, but not expired-domain monitoring (expireddomains.net) or ad-library scanning (Facebook Ad Library). These would need to be either manual research workflows or new Apify actors/scrapers, which is a Scout-agent scope decision, not something to fold into existing skills files.

Method 3 (agency outsourcing) is structurally different from CortexaLabs' current model — it's B2B2B (selling to agencies who resell to contractors) rather than direct-to-contractor outreach. This doesn't fit the current Setter/Sales pipeline built around direct contractor DMs and would require its own outreach track if pursued.

None of the three methods were promoted into `skills/` — nothing here is copy/script tactics for existing prospects, it's upstream of that (finding prospects in the first place). Recommend treating this as a Scout-expansion backlog item, not immediate action.

---

## How to Apply — CortexaLabs

Not implemented. Flagged as three possible future Scout-agent expansions, each requiring a scope/build decision before touching code:
1. **Expired domains monitoring** — would need a scraper/workflow against expireddomains.net + Wayback Machine cross-check, filtered to the 6 approved niches.
2. **Ad hijack sniping** — would need Facebook Ad Library scanning, likely a new Apify actor or manual weekly pass.
3. **Agency outsource channel** — a parallel, structurally different acquisition track (B2B2B) that doesn't reuse the existing Setter/Sales DM pipeline as-is.

None of these are copy changes — they're new lead-sourcing surface area. Worth a deliberate decision on whether/when to add rather than silently expanding Scout's scope.
