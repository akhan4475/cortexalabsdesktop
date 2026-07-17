# How to Send Personalised Loom Videos at Scale
**Category:** loom_structure
**Source Type:** youtube
**Source URL:** not provided
**Creator:** Ben Greening-James (2.15K subscribers, B2B lead gen / Precision Growth Method — LinkedIn & cold email outreach for B2B founders/consultants)
**Date Captured:** 2026-07-14
**Applies To:** future scaling reference — different vertical (B2B/cold email) and different tooling than CortexaLabs' current channel (IG/FB DM), not directly portable as-is
**Quality Score:** 6 — solid concrete workflow with real tool names and a stated result (6% reply rate, 12 opportunities from ~1,000 emails), but built for cold email + Apollo/LinkedIn lead sourcing, not local-contractor social DM outreach
**Tags:** loom-at-scale, personalized-landing-page, automated-video, apollo, instantly, sendr, cold-email, gif-embed, dynamic-logo, tooling-not-copy

---

## Key Tactics

1. **Core mechanism: one evergreen video, personalized landing page wrapper, sent at scale to a whole lead list.** Instead of recording a unique Loom per prospect, record ONE video once. A tool (creator uses Sendr; mentions Replicane and PitchLane as alternatives) auto-generates a personalized landing page per lead — pulling their name, company name, logo, and their actual website scrolling in the background behind the presenter's video — so it *looks* individually made without being individually recorded.
2. **Two stated reasons video works over plain cold email:** (1) it breaks pattern-recognition — prospects have learned to ignore generic cold email text, a video is unusual enough to pique curiosity; (2) seeing a real face/voice builds trust faster than text, making a call booking feel less risky.
3. **Delivery mechanism: embed a GIF preview of the video directly in the cold email** (via a tool like Instantly), not a plain link. The GIF shows the prospect's own logo/website in the background so the *email itself* looks personalized before they even click. Clicking the GIF takes them to the full personalized landing page with the video and a booking CTA.
4. **Workflow, end to end:**
   - Source lead list from Apollo or LinkedIn Sales Navigator (name, email, company, website)
   - Enrich each lead — pull company LinkedIn profile / logo via a data-enrichment step (creator describes the tool as "Clay and [Replicane] merged into one")
   - Map fields into a landing-page template: first name, company name, dynamic logo, video background (creator's own testing: their actual website scrolling in the background performs best), plus generate the GIF for email embedding
   - Run the enrichment/generation across the whole list in one batch ("run on all rows")
   - Export as CSV, upload into a cold email tool (Instantly), map the GIF into the email template as a personalization variable
   - Send at scale — "you can do this for thousands of prospects all in one go"
5. **Stated result from one test campaign:** ~1,000 emails sent → 6% reply rate → 12 opportunities. Cites real reply examples where prospects explicitly said they don't normally respond to cold outreach but made an exception because of the video.
6. **Framed as a 2026 differentiator** — the argument is that most B2B cold outreach is still plain text, so a personalized video/landing page stands out via effort signaling (law of reciprocity — prospect notices the sender put in visible effort and reciprocates with attention).

---

## Frameworks

### Automated Personalized Loom-at-Scale Pipeline
```
1. Lead list source     → Apollo / LinkedIn Sales Navigator (name, email, company, website)
2. Enrichment            → pull company logo / LinkedIn profile per lead
3. Landing page template → map: first name, company name, dynamic logo, video background (their website scrolling), generate GIF
4. Batch generation      → run across entire list at once
5. Email delivery        → cold email tool (Instantly), GIF embedded as personalization variable
6. Click-through         → personalized landing page: video + logo + website background + booking CTA
```

---

## Exact Phrases Worth Testing

> "I would never normally jump on a call with someone who reached out to me through a cold outreach form, but I was curious to actually go and jump on."
> Context: cited prospect reply — used as proof that novelty/effort-signaling video breaks normal cold-outreach resistance.

---

## Raw Notes

**Important vertical/channel mismatch — this is not a drop-in fit for CortexaLabs.** This entire system is built for B2B cold email + LinkedIn outreach to company decision-makers (Apollo-sourced lead lists, Instantly for email sending). CortexaLabs' actual outreach channel is Instagram DM primary / Facebook DM secondary to local contractors (`context/outreach.md`), sourced via Apify Google Maps/Instagram/Facebook scraping, not Apollo/LinkedIn. None of the specific tools named (Sendr, Apollo, Instantly, Replicane, PitchLane) are part of CortexaLabs' stack and none should be adopted based on this video alone.

What *is* portable, conceptually, is the underlying idea already flagged in the earlier-captured Hoani Taylor file (`2026-07-04-hoani-taylor-5000-calls-loom-video-outreach.md`, tactic #10: "automated Loom variant... software overlays your audio onto each prospect's website while scrolling it... no AI voice/face, keep it human"). This video is a second, more detailed source confirming the same underlying pattern — record once, auto-personalize the visual wrapper per lead (their site scrolling in the background, their logo, their name) — from a different creator and a different toolset. Two independent sources describing the same mechanism is a reasonable signal it's a real, working pattern, not a one-off gimmick.

This is a scaling-stage tactic, not a today tactic. CortexaLabs is currently sending fully manual, individually-recorded Looms per lead (per `skills/loom-personalization/SKILL.md`), which is appropriate at current pre-revenue/low-volume stage where personalization quality matters more than volume. This becomes relevant once DM volume outpaces what Ayaan can manually record — at that point, an IG/FB-DM-compatible version of this (screen-recorded scroll of the prospect's own site/Google listing behind a single evergreen voiceover, rather than a cold-email landing page) would need its own tooling research, since none of the tools mentioned here integrate with Instagram/Facebook DM delivery.

---

## How to Apply — CortexaLabs

Not implemented — flagged as a scaling-stage idea, not current-stage action:
- Do not adopt Apollo/Instantly/Sendr — wrong channel (B2B email/LinkedIn vs. IG/FB DM to local contractors)
- The *underlying mechanism* (one evergreen video + auto-personalized visual wrapper per lead) is worth revisiting once manual Loom recording becomes the outreach bottleneck — cross-reference against the Hoani Taylor automated-variant note when that happens, since two independent sources now describe the same pattern
- No changes made to `skills/loom-personalization/SKILL.md` — current fully-manual approach remains correct for current volume/stage
