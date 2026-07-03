# CortexaLabs AI — Outreach Workflow

## Overview

Our outreach is a two-stage process: (1) personalized DM to start the conversation, (2) Loom video to prove we've done our homework and show what we'd build. Every touchpoint is personalized to the specific contractor's business.

The sequence runs over 14 days. If no reply after 14 days, the lead is marked `closed_lost` with reason `no_response` and moved out of active follow-up.

---

## The 14-Day Sequence

### Day 0 — Lead Qualification and Loom Brief

Scout completes:
- Lead scraped and qualified (3+ reviews, correct niche, local, active)
- Lead written to Supabase `leads` table with status `qualified`
- Setter creates Loom brief: what to show in the video (their current site/listing, specific issues, comparison angle)

**Loom brief format:**
```
Business: [Name]
City: [City, State]
Niche: [pool/roofing/etc.]
Current site: [URL or "none found"]
Issues to highlight: [3 bullet points from actual review of their site/listing]
Competitor to compare: [URL of a competitor in same city with a better site]
Recommendation angle: [Pro/Authority and why]
```

---

### Day 1 — First DM (Conversation Opener)

Platform: Instagram DM (primary). Facebook DM if no Instagram found.

Goal: Get a reply. Not a sale. Not a call. A reply.

**Structure:**
1. Personalized observation about their business (1 sentence)
2. Specific problem or opportunity you noticed (1 sentence)
3. Low-friction ask: "Mind if I send a quick video I made for you?" (1 sentence)

**Rules:**
- No pitch
- No price
- No link yet (unless using the "I made you a video" approach)
- No banned phrases (see voice.md)
- Must reference something specific and real about their business

**[DM TEMPLATES — POPULATE FROM YOUTUBE SCRAPE]**
Once Analyst runs `/analyze-video` on cold DM outreach videos, Content agent writes finalized templates to `scripts` table and appends to `skills/dm-copy.md`. Until then, Setter uses the structure above and the voice.md principles to write originals.

**Loom delivery:**
- If first DM gets a reply of any kind, send Loom in the next message
- If using "I made you a video" approach on first DM, include Loom link immediately
- Loom should be recorded fresh for each prospect, using their Loom brief

**After sending:**
- Update lead status to `loom_sent` in Supabase
- Set `follow_up_1_at` to Day 3 (current date + 3 days)
- Set `follow_up_2_at` to Day 7 (current date + 7 days)

---

### Day 3 — Follow-Up #1

**Trigger:** No reply received since Day 1 DM

**Goal:** Bump the conversation up in their inbox without seeming needy

**Tone:** Casual. One or two sentences. No re-pitch.

**Structure:**
- Reference what you sent ("sent you a quick video a few days back")
- Casual bump ("figured I'd follow up in case it got buried")
- Optional: one new specific detail or hook ("saw you guys just got another 5-star review — congrats")

**[FOLLOW-UP TEMPLATE — POPULATE FROM YOUTUBE SCRAPE]**

**After sending:**
- Log follow-up in Supabase (`follow_up_1_sent = true`, `follow_up_1_at = now()`)

---

### Day 7 — Follow-Up #2

**Trigger:** No reply after Day 3 follow-up

**Goal:** Create urgency without being pushy. This is the last real push.

**Tone:** Slightly more direct. Reference the business opportunity they're missing.

**Structure:**
- Short reminder you're still there
- One specific urgency angle (season, competitor, recent Google search volume)
- Clear next step ("happy to hop on a 10-minute call this week if you want")

**[FOLLOW-UP TEMPLATE — POPULATE FROM YOUTUBE SCRAPE]**

**After sending:**
- Log in Supabase (`follow_up_2_sent = true`, `follow_up_2_at = now()`)

---

### Day 14 — Final Follow-Up / Loop Close

**Trigger:** No reply after Day 7 follow-up

**Goal:** Close the loop professionally. Leave the door open for later.

**Tone:** Calm, no pressure, easy out.

**Structure:**
- "Last follow-up from me"
- Acknowledge timing may be off
- Easy re-engage hook ("if fall season is when you'd want to revisit, just reply and I'll send options")

**After sending:**
- If no reply within 3 days of this message: Update lead status to `closed_lost`, reason `no_response`
- Set a 90-day reactivation reminder in Supabase if business profile still active

---

## Handling Replies

### Reply Type: Interested / Want More Info

Move lead to `qualified` or `dm_replied` (if already in `loom_sent`).
If Loom not yet sent: send Loom immediately.
If Loom already seen: move to booking. Send Cal.com link directly.

Response template: "Great — here's my calendar, grab a time that works for you: [CAL_COM_LINK]"

### Reply Type: "How much does it cost?"

This is a buying signal. Do not evade.
Response: "Depends on what you need — most contractors I work with end up around $700–$800. Happy to walk you through it on a quick call. Here's my link: [CAL_COM_LINK]"

### Reply Type: "Not interested"

Respect it. One soft follow-up maximum, 30 days later.
Response: "Got it, no worries. If that ever changes feel free to reach back out."
Mark lead: `closed_lost`, reason `not_interested`

### Reply Type: "Already have a website" / "We're good"

Acknowledge and pivot.
Response: "Totally fair. Do you mind if I ask — is it getting you calls consistently? A lot of contractors I've worked with thought they were covered until they compared it to what their competitors had."

### Reply Type: Aggressive / Rude

Do not engage. Mark `closed_lost`. Move on.

---

## Loom Video Structure

**Length:** 45–90 seconds. Hard cap at 90 seconds — beyond that, drop rate spikes.

**Recording setup:**
- Use Loom desktop app
- Start screen share on their website or Google listing
- Face cam ON (increases trust)
- Clean audio (no background noise)

**Script structure:**

**0–10 sec — Pull up their site:**
"Hey [First Name] — just pulled up [Business Name]'s website real quick, wanted to show you something."

**10–40 sec — Identify 2-3 specific problems:**
"So right off the bat: [Problem 1 — e.g., 'it's not loading right on mobile'], [Problem 2 — e.g., 'there's no easy way for someone to call you or fill out a form'], [Problem 3 — e.g., 'your reviews aren't showing up anywhere on the site']. These are costing you calls."

**40–65 sec — Show the comparison:**
"Here's what I'm seeing from [Competitor Business] in [City]. Notice how [specific element — e.g., 'their phone number is front and center, there's a review widget, and it loads clean on mobile']. This is why they're showing up first when someone searches [niche] in [city]."

**65–90 sec — The ask:**
"I've got a concept for what yours could look like. I can have something like this live in about 10 days for around $800. If you want to see what I have in mind, just reply and I'll send it over — or here's my calendar if you want to talk through it: [CAL_COM_LINK]"

---

## Multi-Channel Strategy

**Instagram DM:** Primary channel. Use for any contractor with an Instagram business profile (even if they don't post often — they check DMs).

**Facebook DM:** Secondary channel. Use for contractors who are more active on Facebook (older demographic, 45+). Also use as a second touchpoint if Instagram DM goes unanswered for 7+ days.

**Do NOT use:**
- Email cold outreach (low deliverability for this audience)
- LinkedIn (contractors are not there)
- SMS without explicit consent (compliance risk)

---

## Volume Targets (Daily)

| Activity | Target |
|----------|--------|
| New leads scraped | 50 |
| First DMs sent | 20 |
| Looms recorded and sent | 5 |
| Follow-ups sent | 10 |
| Replies handled | All same day |
| Bookings confirmed | As they come |

---

## Campaign Structure

Every batch of outreach is organized as a campaign. One campaign = one niche + one city + one time window.

Example: "Pool — Phoenix AZ — July 2026" = campaign ID `camp_001`

This allows performance tracking at the campaign level: how many leads, how many replies, how many bookings, how much revenue.

Boss creates campaigns. Scout fills them. Setter works them.
