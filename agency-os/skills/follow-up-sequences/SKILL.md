# Follow-Up Sequences Skill

## Status: POPULATED — 2026-07-04
**Sources:** Charlie Morgan (follow_up, q7), Hoani Taylor (loom_structure, q9), Nik Setting (content_strategy, q7)
**Last updated:** 2026-07-04

---

## Core Philosophy

Follow-up is not a "nice to do." It is a system stage tracked daily in the CRM.

Most bookings come from follow-up, not from the first message. The 48-hour window after a positive reply is critical — if you don't follow up within 48h of a reply, conversion rate drops sharply. Build follow-up into your daily routine: every morning, check who replied yesterday and who's due for a follow-up.

**Never say "just following up."** Every message needs a new angle, new value, or new curiosity.

---

## Full Sequence Map

| Day | Stage | Action | Message Type |
|-----|-------|--------|-------------|
| Day 0 | `dm_sent` | Initial cold DM | Question-based opener |
| Day 3 | `dm_sent` → follow-up | Follow-up #1 if no reply | Different angle / new hook |
| Day 7 | `dm_sent` → follow-up | Follow-up #2 if still no reply | Loom permission request or walk-away |
| Day 14 | `closed_lost` | Archive | No message — move on |
| After positive reply | `dm_replied` | Respond within 2h | Discovery conversation |
| After Loom sent | `loom_sent` | Follow-up 48h if no watch | "Did the video go through?" |
| After Loom sent | `loom_sent` | Follow-up 48h if watched, no reply | "What did you think?" |
| After call booked | `call_booked` | Reconfirm evening before | Confirm message |
| Morning of call | `call_booked` | Manual follow-up if no reconfirm | Day-of nudge |
| No-show | `no_show` | Same-day rescue | Re-book attempt |
| Post-call no close | `demo_done` | Follow-up sequence | Back into nurture |

---

## Day 3 Follow-Up Templates (No Reply to Initial DM)

Different angle from the opener. Do NOT re-send the same message.

**Template 1 — New Question (Pain Shift)**
```
Hey [name] — random one. Do most of your [pool/roofing/landscaping] customers find you through referrals or do you get much from online?
```

**Template 2 — Observation**
```
[Name] — noticed [business name] doesn't have a Google review widget on the site. Most contractors miss that. Just thought it was worth mentioning.
```

**Template 3 — Loom Tease**
```
[Name] — I put together a quick 90-sec video on [business name]'s site specifically. Want me to send it over?
```

Pick whichever is most natural given what you know about the prospect. Template 3 works best if their site has obvious issues.

---

## Day 7 Follow-Up Templates (Still No Reply)

Last attempt before archiving. Either make a strong case or walk away clean.

**Template 1 — Loom Permission (Last Chance)**
```
Hey [name], last message from me — I made a quick video showing what I'd change about [business name]'s site to get it generating calls. Worth 90 seconds if you're curious. Want me to send it?
```

**Template 2 — Walk Away (Opens Curiosity)**
```
Hey [name] — I'll leave you alone after this. Just wanted to say I think [business name] is leaving jobs on the table with the current site. If you ever want to fix that, I'm around.
```

The walk-away often generates replies. It removes pressure and signals scarcity without being fake.

---

## After Positive Reply — Immediate Response Framework

Respond within 2 hours during business hours (Mon–Fri 8am–6pm). Same day is non-negotiable.

**If they said "yeah, not really getting much from the site":**
```
Yeah that's actually super common for [niche] contractors — most sites are just sitting there not doing anything.

What does most of your work come from right now, mostly referrals?
```

Ask one follow-up question. Listen. Understand their situation. Then:
```
Honestly what I've seen work really well for [niche] businesses in [city] is having a site that leads with actual project photos and Google reviews front-and-center. Would it be worth me shooting you a quick video showing what that could look like for [business name]?
```

**If they asked "how much does it cost":**
Do NOT give price in DM.
```
Depends on what you need — we've worked with [niche] contractors from $600 up to $1,100 depending on what the site needs. Easier to give you a real answer on a quick 15-min call — worth it?
```

**If they said "I've tried website companies before and it didn't work":**
```
That's interesting — what didn't work about it?
```
Just that. Listen to their answer. This becomes your case study for why CortexaLabs is different.

---

## Post-Loom Sequence

Loom was sent. Now we're in lead nurture mode.

**48h, Loom not opened:**
```
Hey [name] — don't think the video came through properly. Mind if I try again?
```

**48h, Loom watched (>50%) but no reply:**
```
Hey [name] — curious what you thought of the video. Any of that ring true for what you're seeing with [business name]?
```

**72h after positive Loom reply but no call booked:**
```
[Name] — [Thursday at 3pm] or [Friday at 11am] work for a quick 20-min call? I'll walk you through exactly what I'd do for [business name]'s site.
```

Always propose specific times. Never send booking link as the first message after a reply.

---

## Call Reconfirmation Sequence

**Evening before the call:**
```
Hey [name] — just confirming we're still on for [time] tomorrow. Looking forward to it.
```

**Morning of call (if they haven't reconfirmed):**
```
Hey [name] — we're on for [time] today. Talk soon.
```

**If they no-showed:**
```
Hey [name] — looks like we missed each other. No worries at all — want to reschedule? I can do [time] or [time] this week.
```

Only offer to reschedule once. If they don't respond to the reschedule attempt within 48h, move to `closed_lost` and add to nurture list.

---

## Post-Call No-Close Sequence (Demo Done → Not Converted)

Based on Nik Setting's system: no-closes go back into the top of the content ecosystem (IG follow, newsletter if applicable). In CortexaLabs context:

**24h after call (if they said "I need to think about it"):**
```
Hey [name] — good talking earlier. Just wanted to say no pressure at all — if you want to see an example of a site we've built for a [niche] contractor, happy to send that over while you're thinking.
```

**5 days after (if still no decision):**
```
Hey [name] — checking back in. Still thinking things over, or is this off the table for now?
```

If they say "off the table": 
```
Totally fine. Reach out if that changes — happy to help when the timing's right.
```

Then mark `closed_lost` with notes and set a 60-day reminder to follow up.

---

## Conversion Stage Tracking

Track these daily in the campaigns table:

| Stage | Metric | Healthy Rate | Fix If Lower |
|-------|--------|-------------|-------------|
| DM sent → Reply | Reply rate | 5–10% | Rewrite opener |
| Reply → Loom watched | Watch rate | 60–80% | Fix Loom permission message |
| Loom watched → Call booked | Book rate | 20–40% | Fix post-Loom nurture speed |
| Call booked → Show | Show rate | 70%+ | Add reconfirmation steps |
| Show → Close | Close rate | 20–30% | Fix call structure |

If ANY stage is underperforming, diagnose that specific handoff — don't rewrite everything.

---

## Quality Checklist

- [ ] Each follow-up message is different from the previous (new angle)
- [ ] Never use "just following up" or "circling back"
- [ ] Each message adds a new hook, observation, or question
- [ ] Reply response sent within 2h during business hours
- [ ] Proposed specific times — no raw Cal.com link as first action
- [ ] Loom watch status checked before sending follow-up
- [ ] Post-call follow-up logged in Supabase with outcome

---

## Sources
- [Charlie Morgan: 7 components of an outbound system](../intelligence/youtube/follow_up/2026-07-04-charlie-morgan-7-components-outbound-system.md)
- [Hoani Taylor: Loom outreach system and lead nurture](../intelligence/youtube/loom_structure/2026-07-04-hoani-taylor-5000-calls-loom-video-outreach.md)
- [Nik Setting: Profile funnel follow-up loop](../intelligence/youtube/content_strategy/2026-07-04-nik-setting-profile-funnel-ig-consulting-clients.md)
