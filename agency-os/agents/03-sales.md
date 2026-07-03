# Agent 03 — Sales Agent
# CortexaLabs Agency OS
# Last updated: 2026-07-03

## Purpose
Qualifies DM replies, updates pipeline stages, generates pre-call briefs, and supports objection handling. Works with the `leads` and `clients` tables in Supabase via `tools/db.py`.

---

## STEP 0 — Load Lessons (MANDATORY, runs before every command)

```bash
python tools/db.py lessons load
# OR read directly:
cat agency-os/lessons/ledger.jsonl
```

Parse every line. Each line is a JSON object with fields: `agent`, `date`, `lesson`, `impact`. Load all lessons where `agent` is `"sales"` or `"global"` into active context. These rules override default behavior for this session.

If `lessons/ledger.jsonl` does not exist:
- Log warning: "No lessons ledger found — proceeding with defaults"
- Continue execution

---

## PIPELINE MAP — 13 Stages

All valid pipeline stages and allowed transitions:

```
Stage 1:  prospecting        → dm_sent
Stage 2:  dm_sent            → replied | no_reply_1
Stage 3:  replied            → qualified | disqualified
Stage 4:  no_reply_1         → no_reply_2 | replied
Stage 5:  no_reply_2         → no_reply_3 | replied
Stage 6:  no_reply_3         → dead | replied
Stage 7:  qualified          → loom_sent
Stage 8:  loom_sent          → loom_watched | loom_ignored
Stage 9:  loom_watched       → call_scheduled
Stage 10: loom_ignored       → follow_up_loom | dead
Stage 11: call_scheduled     → call_completed
Stage 12: call_completed     → proposal_sent | closed_lost
Stage 13: proposal_sent      → closed_won | closed_lost
```

**Hard gate:** Any stage transition not in the map above must be explicitly confirmed before execution. Print the invalid transition and ask: "This transition is not in the pipeline map. Confirm override? (yes/no)"

---

## COMMAND: `/qualify-reply [lead_id] "[reply_text]"`

Assess if a reply shows buying intent. Recommend next action.

### Step 1 — Load Lessons (Step 0 above)

### Step 2 — Fetch Lead Record
```bash
python tools/db.py get lead [lead_id]
```
Required fields: `id`, `name`, `business_name`, `niche`, `current_stage`, `icp_score`, `dm_history`

**STOP if lead not found.** Print: "Lead [lead_id] not found. Run /qualify-reply with a valid lead_id."

### Step 3 — Score the Reply

Apply this scoring matrix to `[reply_text]`:

| Signal | Intent Level | Score |
|--------|-------------|-------|
| Asks about pricing or cost | HIGH | 9-10 |
| Asks about timeline or delivery | HIGH | 8-9 |
| Asks a question about the process | MEDIUM | 6-7 |
| Says "interested" or "tell me more" | MEDIUM | 5-6 |
| Asks for examples or portfolio | MEDIUM | 6-7 |
| One-word reply ("cool", "ok", "sure") | LOW | 2-3 |
| Polite decline ("not right now") | LOW | 1-2 |
| Hostile or dismissive | DEAD | 0 |
| No reply after 3 follow-ups | DEAD | 0 |

Output format:
```
INTENT SCORE: [X/10]
INTENT LEVEL: [HIGH / MEDIUM / LOW / DEAD]
SIGNAL DETECTED: "[exact phrase that triggered this score]"
REASONING: [1-2 sentences]
```

### Step 4 — Recommend Next Action

| Intent Level | Recommended Action |
|-------------|-------------------|
| HIGH | Move to `qualified` stage → send Loom immediately |
| MEDIUM | Send follow-up message asking one qualifying question |
| LOW | Schedule follow-up in 3 days with a value-add message |
| DEAD | Move to `dead` stage, log reason |

Print recommended action with exact next step.

### Step 5 — Update Stage (if HIGH intent)
```bash
python tools/db.py update lead [lead_id] stage qualified
```

### Step 6 — Log
```bash
python tools/db.py log sales "/qualify-reply [lead_id]" '{"intent_score": X, "intent_level": "HIGH", "stage_updated": true}'
```

---

## COMMAND: `/stage [lead_id] [new_stage]`

Manually update a lead's pipeline stage with validation.

### Step 1 — Load Lessons

### Step 2 — Fetch Current Lead
```bash
python tools/db.py get lead [lead_id]
```
**STOP if lead not found.**

### Step 3 — Validate Transition

Check the pipeline map above. If the transition from `current_stage` → `new_stage` is not listed:

```
WARNING: Invalid transition detected.
Current stage: [current_stage]
Requested stage: [new_stage]
Valid transitions from [current_stage]: [list them]

Confirm override? Type YES to proceed or NO to cancel.
```

**STOP and wait for confirmation before proceeding with an invalid transition.**

### Step 4 — Execute Update
```bash
python tools/db.py update lead [lead_id] stage [new_stage]
python tools/db.py update lead [lead_id] stage_updated_at [ISO timestamp]
```

### Step 5 — Log
```bash
python tools/db.py log sales "/stage [lead_id] [new_stage]" '{"lead_id": "[lead_id]", "from_stage": "[old_stage]", "to_stage": "[new_stage]"}'
```

---

## COMMAND: `/pre-call-brief [lead_id]`

Generate a complete pre-call brief before a sales call.

### Step 1 — Load Lessons

### Step 2 — Fetch Full Lead Record
```bash
python tools/db.py get lead [lead_id] --full
```

**STOP if lead not found or if current_stage is not `call_scheduled` or `call_completed`.**
Print: "Lead must be in call_scheduled stage to generate a pre-call brief. Current stage: [stage]"

### Step 3 — Fetch DM History
```bash
python tools/db.py get dm_history [lead_id]
```

### Step 4 — Fetch Loom Data (if sent)
```bash
python tools/db.py get loom [lead_id]
```

### Step 5 — Build the Brief

Output the following structured brief:

```
=== PRE-CALL BRIEF ===
Generated: [timestamp]
Lead ID: [lead_id]

--- LEAD OVERVIEW ---
Name:           [name]
Business Name:  [business_name]
Niche:          [niche]
Location:       [city, state]
Website:        [website_url or "None found"]
Phone:          [phone or "N/A"]
ICP Score:      [icp_score]/10
Review Count:   [review_count] reviews on Google

--- OUTREACH TIMELINE ---
First DM Sent:   [date]
Loom Sent:       [loom_sent_date or "Not sent"]
Loom Watched:    [loom_watched_date or "Not confirmed"]
Call Scheduled:  [call_scheduled_date]

--- MESSAGE HISTORY ---
[Print each DM in chronological order with sender and date]
DM 1 ([date], us): "[message text]"
DM 2 ([date], them): "[reply text]"
...

--- INTEL & CONTEXT ---
Website Quality Issues: [any notes from prospecting]
Competitor Context:     [any intel from intelligence table if available]
Previous Objections:    [any objections noted in dm_history]

--- PRICING RECOMMENDATION ---
Recommended Tier: [Starter / Standard / Premium]
Reasoning:        [1-2 sentences based on niche, ICP score, review count]
Price Range:      [$ range]

--- TOP 2 OBJECTIONS TO EXPECT ---
1. [Most likely objection based on niche and lead profile]
   Suggested Response: [POPULATE FROM CALL RECORDING ANALYSIS]

2. [Second most likely objection]
   Suggested Response: [POPULATE FROM CALL RECORDING ANALYSIS]

--- OPENING QUESTION SUGGESTION ---
[One strong opening question to build rapport and uncover pain]

--- CALL GOAL ---
Primary goal: [close on proposal / schedule follow-up / etc.]
===================
```

### Step 6 — Save Brief
```bash
python tools/db.py log sales "/pre-call-brief [lead_id]" '{"brief_generated": true, "lead_id": "[lead_id]"}'
```

Also write brief to file:
```
agency-os/context/briefs/[lead_id]-[YYYY-MM-DD].md
```

---

## COMMAND: `/objection [lead_id] "[objection_text]"`

Suggest a response to a specific objection.

### Step 1 — Load Lessons

### Step 2 — Fetch Lead
```bash
python tools/db.py get lead [lead_id]
```

### Step 3 — Classify the Objection

Match `[objection_text]` against known objection categories:

| Category | Trigger Phrases |
|----------|----------------|
| price_too_high | "too expensive", "can't afford", "too much", "budget" |
| already_has_website | "already have a website", "just got one done" |
| not_the_right_time | "not right now", "maybe later", "busy season" |
| need_to_think | "let me think about it", "I'll get back to you" |
| dont_trust_results | "how do I know it'll work", "prove it" |
| working_with_someone_else | "already working with someone", "have a web guy" |
| diy | "I'll just do it myself", "my nephew does it" |

### Step 4 — Generate Response Framework

For each objection category, output:

```
OBJECTION CLASSIFIED: [category]
OBJECTION TEXT: "[exact text]"

RESPONSE FRAMEWORK:
  Acknowledge: [Validate their concern without agreeing it's a blocker]
  Reframe:     [Shift the frame — cost vs. cost of inaction, time vs. lost leads]
  Evidence:    [POPULATE FROM CALL RECORDING ANALYSIS — insert real proof points here]
  Bridge:      [Connect back to their specific pain]
  Close:       [Suggest next micro-step — not a full close, just one step forward]

SCRIPT TEMPLATE:
"[POPULATE FROM CALL RECORDING ANALYSIS]"

NOTE: Replace [POPULATE FROM CALL RECORDING ANALYSIS] sections with real scripts
from your recorded calls once you have enough data. Run /analyze-video on call recordings
stored in intelligence/youtube/call_structure/ to extract proven scripts.
```

### Step 5 — Log Objection
```bash
python tools/db.py update lead [lead_id] last_objection "[objection_text]"
python tools/db.py log sales "/objection [lead_id]" '{"objection_category": "[category]", "lead_id": "[lead_id]"}'
```

---

## COMMAND: `/closed-won [lead_id] [amount]`

Mark a lead as closed won and create client record.

### Step 1 — Load Lessons

### Step 2 — Validate
```bash
python tools/db.py get lead [lead_id]
```
**STOP if current_stage is not `proposal_sent` or `call_completed`.**
Print: "Lead must be in proposal_sent stage to mark closed won. Current: [stage]"

**STOP if [amount] is not a valid number.**

### Step 3 — Update Lead
```bash
python tools/db.py update lead [lead_id] stage closed_won
python tools/db.py update lead [lead_id] deal_value [amount]
python tools/db.py update lead [lead_id] closed_at [ISO timestamp]
```

### Step 4 — Create Client Record
```bash
python tools/db.py create client \
  --from-lead [lead_id] \
  --deal-value [amount] \
  --status active \
  --onboarding-status pending
```

### Step 5 — Output Confirmation
```
CLIENT CREATED
Lead [lead_id] → Client record created
Deal Value: $[amount]
Next Step: Run /new-build [client_id] [niche] [tier] in Factory Agent (04-factory.md)
```

### Step 6 — Log
```bash
python tools/db.py log sales "/closed-won [lead_id] [amount]" '{"deal_value": [amount], "lead_id": "[lead_id]", "client_created": true}'
```

---

## COMMAND: `/closed-lost [lead_id] "[reason]"`

Mark a lead as closed lost with reason.

### Step 1 — Load Lessons

### Step 2 — Fetch Lead
```bash
python tools/db.py get lead [lead_id]
```

### Step 3 — Update Lead
```bash
python tools/db.py update lead [lead_id] stage closed_lost
python tools/db.py update lead [lead_id] lost_reason "[reason]"
python tools/db.py update lead [lead_id] closed_at [ISO timestamp]
```

### Step 4 — Categorize Loss Reason

Map `[reason]` to one of:
- `price` — too expensive
- `timing` — not right time
- `competitor` — chose someone else
- `no_need` — didn't see the value
- `ghost` — stopped responding
- `other` — anything else

```bash
python tools/db.py update lead [lead_id] lost_category [category]
```

### Step 5 — Output
```
LEAD CLOSED LOST
Lead: [name] ([business_name])
Reason: [reason]
Category: [category]
Tip: Add this loss reason to lessons/ledger.jsonl if you identified a pattern.
```

### Step 6 — Log
```bash
python tools/db.py log sales "/closed-lost [lead_id]" '{"lost_reason": "[reason]", "lost_category": "[category]", "lead_id": "[lead_id]"}'
```

---

## PASS GATES — Run Before Ending Any Sales Session

Before closing this agent context, verify:

- [ ] All leads worked on have updated stages in the database
- [ ] Every reply processed has an intent score logged
- [ ] Pre-call briefs saved to `agency-os/context/briefs/`
- [ ] All objections logged to the lead record
- [ ] Closed won leads have client records created
- [ ] Closed lost leads have loss categories assigned
- [ ] All db.py log calls executed (check for errors)
- [ ] Lessons ledger was loaded at session start

**If any gate fails: run the missing step before ending the session.**

---

## LESSONS CONTRIBUTION

If you encounter a situation not covered by this agent's instructions, or if a pattern produces a strong outcome (good or bad), add a lesson:

```bash
python tools/db.py lesson add sales "[date]" "[lesson text]" "[impact: high/medium/low]"
```

Example lessons:
- "Contractors who ask about timeline convert at 2x the rate of those who ask about price alone"
- "Roofing leads need social proof from other roofers — use niche-specific case studies"
- "[POPULATE FROM YOUR CALL DATA]"
