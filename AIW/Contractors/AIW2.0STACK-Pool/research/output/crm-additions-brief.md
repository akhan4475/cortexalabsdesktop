# CRM Additions Brief
## Cortexa Labs - AI Web Design Agency for Pool Service Companies

---

## Context

I run a web design agency called Cortexa Labs. I build websites exclusively for pool service companies (cleaning, maintenance, repair, opening/closing, liner installation). My business model is unique:

- I find pool companies with no website or a bad one
- I cold DM them on Instagram/Facebook
- I build a free custom mockup of their site BEFORE asking for money
- They approve it, then pay $900 one-time (no monthly fee at Stage 1)
- I build and launch in 3 days

My outreach is primarily cold DM on social. I also post reels on Instagram daily to pull inbound leads. When people comment "POOL" on my reels, I DM them.

My CRM already has:
- Cold caller dialer
- Scripts
- Lead database
- Basic analytics

I need to add features specific to this business model. Below are the exact additions I want, in priority order.

---

## Addition 1 - Custom Pipeline Stages (Highest Priority)

Replace or extend the current pipeline stages with these exact stages, in this order:

| Stage | Description |
|---|---|
| Prospect | Lead identified. Pool company with no website or bad website. Not yet contacted. |
| Qualified | Confirmed they have no website or a weak one. Ready to DM. |
| DM Sent | First DM sent. Waiting for reply. |
| Replied | They responded to the DM. Conversation active. |
| Mockup Building | I am building their custom site mockup. |
| Mockup Sent | Mockup delivered. Waiting for their reaction. |
| Approved | They said yes. Invoice sent. |
| Paid | Payment received. Full build in progress. |
| Launched | Site is live. 30-day support window starts. |
| Review Requested | Asked for Google/Facebook review. |
| Closed - Referral Ask | Final stage. Asked for referral to another pool company. |
| Lost | Prospect went cold or said no. Capture reason. |

Each lead card should show: business name, owner name, city/state, DM platform (Instagram/Facebook/LinkedIn), website status (none/bad/ok), date added, days in current stage.

---

## Addition 2 - Follow-Up Automation Rules

Add automatic follow-up reminders based on stage + time elapsed. I do not want leads to go cold because I forgot to follow up.

Rules:

| Trigger | Action |
|---|---|
| DM Sent, no reply after 3 days | Flag with reminder: "Follow up - no reply" |
| Replied, no update after 2 days | Flag: "Conversation went cold" |
| Mockup Sent, no reply after 48 hours | Flag: "Mockup follow-up needed" |
| Approved, invoice not paid after 3 days | Flag: "Chase invoice" |
| Launched, 30 days have passed | Flag: "Request Google review" |
| Launched, 45 days have passed | Flag: "Ask for referral" |

Show overdue flags clearly on the lead card and in a daily digest view: "You have X follow-ups due today."

---

## Addition 3 - Lead Source Tracking

Add a "Lead Source" field to every lead record. Options:

- Cold DM - I found them and messaged first
- Reel - Commented on my Instagram reel, I then DMed them
- Referral - Referred by an existing client or contact
- Inbound - They messaged me first
- Cold Call - From the dialer

For Reel leads: add a second field "Reel Topic" (free text) so I can log which content piece drove the lead. Example: "Why pool companies lose leads online."

Over time I want to see which lead sources convert best and which reel topics produce the most replies.

---

## Addition 4 - Mockup Tracker

Add a Mockups section or tab. Every lead in the "Mockup Building" or "Mockup Sent" stage should appear here.

Fields per mockup:

| Field | Type |
|---|---|
| Business name | Text (linked to lead record) |
| Mockup started date | Date |
| Mockup sent date | Date |
| Preview URL | URL (link to live mockup) |
| Client reaction | Dropdown: Pending / Loved it / Wants changes / Rejected |
| Rejection reason | Text (only shown if Rejected) |
| Change requests | Text area |

This gives me a single view of all in-flight mockups without digging through individual lead cards.

---

## Addition 5 - Lead Quality Score on Add

When I add a new lead, show a simple quality score (1-10) based on inputs I enter manually (no scraping needed):

| Input | Weight |
|---|---|
| Has no website | +4 points |
| Has a website but it looks bad/old | +2 points |
| Has fewer than 10 Google reviews | +2 points |
| Last Facebook post was more than 30 days ago | +1 point |
| Is in a Sun Belt market (TX, FL, MD, VA, AZ, CA) | +1 point |

Display the score as a colored badge on the lead card: 8-10 = green (hot), 5-7 = yellow (warm), 1-4 = gray (cold).

This is entered manually by me when I qualify a lead. No API calls needed.

---

## Addition 6 - Simple Revenue Dashboard

Add a Revenue tab with:

- Total deals closed (count of leads in Paid or Launched stage)
- Total revenue collected (count x $900)
- Deals closed this month
- Revenue this month
- Pipeline value: count of leads in Approved stage x $900 (money I am about to collect)
- Average days from first DM to Paid

No complex charts needed. Just these numbers as large stat cards. Updated in real time as I move leads through the pipeline.

---

## Addition 7 - Objection Log on Lost Leads

When I move a lead to "Lost", require me to select a rejection reason from a dropdown:

- No budget
- Already has someone building their site
- Not interested in a website at all
- Did not respond after multiple follow-ups
- Bad timing - call back later
- Other (free text)

Show an Objection Summary in the analytics section: breakdown of how many leads were lost for each reason. This tells me which objection to address in my content and scripts.

---

## Do Not Build Yet

- Email automation (closing via DM, not email, at Stage 1)
- Automated Google/Apify scraping on lead add (manual scoring is fine for now)
- Client portal or external-facing features
- Invoicing or payment processing (using separate tool)

---

## Tone and UI Notes

- Keep it fast. I am checking this on my phone between DMs. Every click should matter.
- Dark mode preferred.
- No unnecessary modals. Inline editing where possible.
- Mobile-first layout for the pipeline view.
