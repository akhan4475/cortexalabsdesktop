# CortexaLabs AI — CRM Pipeline

## Overview

The pipeline tracks every lead from first contact to closed deal. There are three channels — Calls, DMs, and Emails — each with their own stage progression. All stages are values in the `pipeline_stage` column of the `leads` table in Supabase.

Agents move leads between stages. No lead moves backward except under explicit Ayaan instruction. Boss monitors the pipeline distribution daily.

---

## Calls Channel

This channel tracks leads who are being worked toward a booked discovery call.

### Stage 1: New Lead

**What it means:** Lead was scraped and added to Supabase. Has not been contacted yet.

**Trigger in:** Scout writes the lead to Supabase after qualifying it (3+ reviews, correct niche, active business).

**Trigger out:** Setter begins outreach and sends the first DM.

**Agent responsible:** Scout (creates), Setter (moves out)

**What to do:** Review Loom brief. Assign to an active campaign. Confirm all required fields are populated (business_name, niche, city, instagram_handle or facebook_url, review_count, website_url).

---

### Stage 2: Qualified

**What it means:** Lead has been reviewed by the Setter and confirmed as a valid outreach target. All ICP criteria verified. Loom brief created.

**Trigger in:** Setter reviews the lead and confirms it passes all ICP checks.

**Trigger out:** First DM is sent.

**Agent responsible:** Setter

**What to do:** Write the personalized first DM. Record Loom video using the brief. Queue DM for sending.

---

### Stage 3: Loom Sent

**What it means:** First DM (with or without Loom) has been sent to the prospect. Awaiting reply.

**Trigger in:** Setter sends the first DM and/or Loom link.

**Trigger out:** Prospect replies (any reply moves to appropriate next stage). OR: Follow-Up #1 is sent on Day 3.

**Agent responsible:** Setter

**What to do:** Log `dm_sent_at` timestamp. Set `follow_up_1_at` = +3 days. Set `follow_up_2_at` = +7 days. Monitor for replies.

---

### Stage 4: Follow-Up

**What it means:** Initial DM was sent but no reply received. Follow-up sequence is active.

**Trigger in:** Day 3 passes with no reply.

**Trigger out:** Prospect replies (moves to next stage). OR: Day 14 passes with no reply (moves to Closed Lost).

**Agent responsible:** Setter

**What to do:** Send Day 3 follow-up. If still no reply, send Day 7 follow-up. If still no reply after Day 14 final message, mark Closed Lost.

---

### Stage 5: Demo Booked

**What it means:** Prospect has clicked the Cal.com link and booked a discovery call. Call is confirmed on the calendar.

**Trigger in:** Cal.com booking webhook fires and Sales agent logs the booking in Supabase.

**Trigger out:** Call happens and is logged.

**Agent responsible:** Sales

**What to do:** Pull lead data. Run call prep (review their business, pull their site, review ICP notes, anticipate objections). Set a reminder for Ayaan via Telegram 1 hour before the call.

**Telegram alert format:**
```
[CortexaLabs OS] CALL BOOKED
Business: [Name]
Niche: [niche]
City: [City, State]
Time: [Day, Date at Time]
Their site: [URL]
Review count: [N] | Rating: [X.X]
Prep notes: [2-3 bullet points from Sales agent]
```

---

### Stage 6: Demo Done

**What it means:** Discovery call happened. Outcome has been logged.

**Trigger in:** Ayaan logs the call outcome after it ends (via Boss `/log-call` command).

**Trigger out:** If interested: move to Proposal Sent. If not ready: move to On Hold. If not interested: move to Closed Lost.

**Agent responsible:** Sales

**What to do:** Log call notes in Supabase. If prospect is interested, write the proposal and send it within 24 hours. If prospect needs more time, set a follow-up reminder and move to On Hold.

---

### Stage 7: Proposal Sent

**What it means:** A formal proposal (tier recommendation, pricing, timeline) has been sent to the prospect.

**Trigger in:** Sales agent sends the proposal document or message.

**Trigger out:** Prospect accepts (Closed Won). Prospect declines (Closed Lost). Prospect goes silent (On Hold after 5 days).

**Agent responsible:** Sales

**What to do:** Follow up on proposal within 2 business days if no response. Use skills/proposal-close.md. Do not discount without explicit instruction from Ayaan.

---

### Stage 8: Closed Won

**What it means:** Prospect has agreed to move forward and deposit is confirmed.

**Trigger in:** Deposit received (50% of project fee) and logged.

**Trigger out:** This is a terminal stage for the Calls channel. Lead transitions to Factory workflow.

**Agent responsible:** Sales (logs win), Factory (takes over delivery)

**What to do:** Log `deal_value`, `closed_at` in Supabase. Update `revenue` in `campaigns` row. Queue build in `factory_builds` table. Send Telegram notification: "DEAL WON — [Business Name] / $[amount]". Notify Boss to update os-state.json gates.

---

### Stage 9: Closed Lost

**What it means:** This lead will not convert. Reason logged.

**Trigger in:** Prospect says no, goes silent after Day 14 follow-up, or proposal is declined.

**Trigger out:** Terminal stage. May be reactivated after 90 days if business profile is still active.

**Agent responsible:** Any agent who handles the final interaction

**What to do:** Log reason (`no_response`, `not_interested`, `budget`, `timing`, `went_with_competitor`). Set 90-day reactivation reminder if reason is `timing` or `budget`. Do not continue contacting.

---

### Stage 10: On Hold

**What it means:** Prospect is interested but not ready now. Specific follow-up date set.

**Trigger in:** Call outcome indicates timing issue. Prospect asks to be contacted in the future.

**Trigger out:** Follow-up date arrives (move back to Demo Done or Proposal Sent). Prospect goes silent past follow-up date (move to Closed Lost).

**Agent responsible:** Sales

**What to do:** Log specific reason and follow-up date. Set Telegram reminder for that date. Do not contact before the agreed date.

---

## DMs Channel

This channel tracks leads who came in via Instagram or Facebook DMs specifically — used when the DM itself generates a booking without going through a formal call prep stage.

### Stage 11: DM Sent

**What it means:** First outreach DM has been sent to this lead. Identical to "Loom Sent" in the Calls channel but tracked separately for analytics.

**Agent responsible:** Setter

---

### Stage 12: DM Replied

**What it means:** Lead responded to any DM. Could be a question, interest, or objection.

**Trigger in:** Any inbound message from the lead after our outreach.

**Trigger out:** Lead books a call (Booked From DM) or conversation goes cold (Closed Lost after 14 days of silence post-reply).

**Agent responsible:** Setter (handles reply, routes to Sales for booking)

**What to do:** Respond within same day. Use reply guidelines from voice.md. If lead shows buying intent, immediately send Cal.com link. If they ask price, give the range directly.

---

### Stage 13: Booked From DM

**What it means:** A booking was generated directly from the DM conversation, without a separate formal pitch stage.

**Trigger in:** Lead books on Cal.com after a DM exchange.

**Trigger out:** Merges into Demo Booked stage in the Calls channel (same process from here).

**Agent responsible:** Setter (logs booking), Sales (takes over from Demo Booked)

---

## Pipeline Health Rules

Boss monitors these thresholds daily and alerts Ayaan if any are breached:

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Leads in New Lead with no action > 3 days | > 5 leads | "Scout backlog — assign to campaign or discard" |
| Leads in Follow-Up past Day 14 | > 0 leads | "Overdue follow-ups — close or reactivate" |
| Leads in Demo Booked with no call notes 24h after scheduled time | > 0 leads | "Missed call log — update pipeline immediately" |
| Leads in Proposal Sent > 5 days with no response | > 3 leads | "Proposal follow-up needed" |
| Closed Won with no factory_builds row | > 0 leads | "Deal won but build not queued — fix immediately" |

---

## Pipeline Stage Reference (Quick Copy)

Valid values for `pipeline_stage` column:

```
new_lead
qualified
loom_sent
follow_up
demo_booked
demo_done
proposal_sent
closed_won
closed_lost
on_hold
dm_sent
dm_replied
booked_from_dm
```
