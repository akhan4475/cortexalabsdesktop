# Beginner Guide To Cold Outreach — 7 Components of an Outbound System
**Category:** follow_up
**Source Type:** youtube
**Source URL:** https://www.youtube.com/watch?v=HUh1XqppRtU
**Creator:** Charlie Morgan
**Date Captured:** 2026-07-04
**Applies To:** all
**Quality Score:** 7
**Tags:** outbound-system, cold-outreach, follow-up, metrics, crm, lead-sourcing, conversion-tracking, system-design

---

## Key Tactics

1. **Build a system, not a habit** — Outbound only works when all 7 components are in place simultaneously. Missing any one component = broken car. Don't start outreach until you have all 7.
2. **Pick ONE platform and master it** — Don't split between cold email, cold DM, and cold calls. Pick whichever platform your niche lives on and go deep. Contractor on Instagram → Instagram DMs only until you have that dialed.
3. **Lead quality is the #1 system variable** — Better copy on bad leads < worse copy on great leads. Find an "endless spring" of qualified leads before optimizing stimuli. For contractors: Google Maps via Apify is the spring.
4. **Track conversion at every stage, daily** — Four conversion stages: Sent → Replied → Booked → Closed. Calculate conversion rate between each pair. Know exactly where your system is breaking.
5. **Diagnose by stage, not by feel** — If reply rate is high but booking rate is low: the problem is in the reply-to-booking handoff (Calendly friction? Follow-up cadence? Proposed times?). Don't guess — use metrics.
6. **Simple CRM, used consistently, beats complex CRM used never** — A Google Sheet with: name, contact info, platform link, outreach date, follow-up date, booked (y/n), notes. Updated daily. That's all you need.
7. **Stimuli = the psychology of the niche** — Scripts, templates, Loom videos are not written for you. They're written based on what your prospect fears, wants, and hates. Start with niche psychology, then write copy.
8. **Scheduling software with reminders is non-negotiable** — Cal.com with email + text reminders. Include qualifying questions. Reduces no-shows and pre-qualifies prospects before you even talk to them.
9. **Delivery mechanism determines scale** — Manual sending caps your volume. Use delivery tools (Instantly for email, manual + VA for DMs at volume) to send more than you could solo.
10. **Follow-up is a stage, not an afterthought** — Treat "follow up with positive replies who haven't booked" as a daily task tracked in the CRM. Most bookings come from follow-up, not the first message.

---

## Frameworks

### The 7-Component Outbound System
```
1. Scheduler — Cal.com/Calendly with reminders + qualifying questions
2. Platform — ONE channel suited to your niche (Instagram for contractors)
3. Stimuli — Scripts/templates built on niche psychology (pain, fear, desire)
4. CRM Sheet — Simple spreadsheet: name, contact, sent date, replied, booked, notes
5. Lead Source — Endless supply of qualified leads (Google Maps via Apify for contractors)
6. Metric Tracker — Daily conversion rates: Sent→Reply, Reply→Booked, Booked→Closed
7. Delivery Mechanism — Tool to send outreach at volume (Instagram app, VA, or automation)
```

### Conversion Stage Tracking (Daily)
```
Day   | Sent | Replied | % | Booked | % | Closed | %
------|------|---------|---|--------|---|--------|---
07-04 |  50  |    4    | 8%|   1    |25%|   0    | 0%
07-05 |  50  |    6    |12%|   2    |33%|   1    |50%
...

Diagnose:
- Low reply rate → Fix stimuli (copy/question)
- High reply, low booking → Fix nurture process (speed, friction, proposed times)
- High booking, low close → Fix discovery/demo call
```

### Simple CRM Schema (Google Sheets)
```
A: Business Name
B: Platform Link (IG profile URL)
C: Owner Name (if known)
D: Niche
E: City
F: Date DMd
G: Replied? (Y/N)
H: Reply Content (brief)
I: Follow-Up 1 Date
J: Follow-Up 1 Sent? (Y/N)
K: Follow-Up 2 Date
L: Follow-Up 2 Sent? (Y/N)
M: Loom Sent? (Y/N)
N: Booked? (Y/N)
O: Call Date
P: Outcome (Won/Lost/No-Show/Follow-up)
Q: Notes
```

---

## Exact Phrases Worth Testing

> "The quality of a system is determined almost entirely by the quality of the inputs that go into that system."
> Context: Framing why lead quality matters more than copy quality. Useful when justifying time spent on scraping vs. writing.

> "You're looking for a spring — an endless flow of clean water. Not a puddle."
> Context: Lead sourcing analogy. For CortexaLabs: Google Maps via Apify is the spring. Random manual searches are the puddle.

---

## Raw Notes

Charlie Morgan built 30–40 outbound systems across cold email, DM, calling, even physical mail. This video is a high-level overview of the 7 required components — not a deep dive on any single one. Most value is in the frameworks (7 components, conversion tracking) and the mental model (system = car, components = parts).

Key follow-up insight buried: after someone responds positively but hasn't booked, treat them as an active follow-up case. Daily CRM review means you catch these before they go cold (48-hour window is critical).

Quality score 7: more systematic/structural than tactical. Good for building the overall outreach engine. Less good for specific copy or DM advice.

---

## How to Apply

CortexaLabs has Supabase as CRM — use `leads` table as the CRM sheet. The 7-component checklist maps directly:

1. **Scheduler** ✅ — Cal.com already configured
2. **Platform** ✅ — Instagram DMs (primary), Facebook (secondary)  
3. **Stimuli** — Build from dm-copy.md and loom-personalization.md skills files
4. **CRM** ✅ — Supabase `leads` table
5. **Lead Source** ⚠️ — Apify ready but needs APIFY_API_TOKEN in .env.local
6. **Metric Tracker** — Track in campaigns table: dms_sent, replies, bookings, closed
7. **Delivery Mechanism** — Manual DMs to start (Ayaan is the VA). VA hire at 50+ DMs/day volume.

**Follow-up cadence (based on system logic):**
- Day 0: Initial DM (question-based opener)
- Day 3: Follow-up 1 (if no reply) — different angle, still question-based
- Day 7: Follow-up 2 (if still no reply) — Loom permission request or walk-away
- After Loom sent: same-day call attempt → text with proposed times → reconfirm morning of call

**Diagnose weekly:**
- If DM reply rate < 5%: rewrite the opener
- If Loom watch rate < 60%: fix the permission request message
- If booked-to-show rate < 70%: add reconfirmation + day-of follow-up
- If show-to-close rate < 30%: fix the call structure
