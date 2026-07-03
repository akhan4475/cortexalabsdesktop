# CRM Pipeline Operations Skill

## Purpose
Manage lead pipeline stages across all 13 stages. Every agent that touches a lead's pipeline_stage must use this skill to validate transitions and notify Boss.

---

## The 13 Pipeline Stages

| Code | Stage Name | Owner Agent | Description |
|---|---|---|---|
| `raw` | Raw Lead | Scout | Just scraped, not yet qualified |
| `qualified` | Qualified | Scout | Passed scoring threshold (score >= 50) |
| `contacted_d1` | Contacted Day 1 | Setter | First DM or cold outreach sent |
| `contacted_d3` | Contacted Day 3 | Setter | Day 3 follow-up sent |
| `contacted_d7` | Contacted Day 7 | Setter | Day 7 follow-up sent |
| `replied` | Replied | Setter | Lead responded to outreach |
| `loom_sent` | Loom Sent | Setter | Personalized Loom video delivered |
| `call_booked` | Call Booked | Setter | Discovery call scheduled on Cal.com |
| `call_held` | Call Held | Sales | Discovery call completed |
| `proposal_sent` | Proposal Sent | Sales | Proposal/pricing sent |
| `negotiating` | Negotiating | Sales | Active back-and-forth on deal |
| `closed_won` | Closed Won | Sales | Deal signed, project active |
| `closed_lost` | Closed Lost | Sales/Boss | Deal lost — log reason |

---

## Valid Transition Map

Only these forward transitions are allowed (backward moves blocked except specific exceptions):

```
raw           → qualified
qualified     → contacted_d1
contacted_d1  → contacted_d3, replied, closed_lost
contacted_d3  → contacted_d7, replied, closed_lost
contacted_d7  → replied, closed_lost
replied       → loom_sent, call_booked, closed_lost
loom_sent     → call_booked, replied, closed_lost
call_booked   → call_held, closed_lost
call_held     → proposal_sent, closed_lost
proposal_sent → negotiating, closed_won, closed_lost
negotiating   → closed_won, closed_lost
```

### Allowed Backward Moves (exceptions)
- `call_booked` → `loom_sent` (if call no-shows, resume Loom follow-up)
- `proposal_sent` → `call_held` (if they want another call)
- `closed_lost` → `qualified` (re-engage cold lead after 90+ days)

---

## Blocked Transitions

These will be rejected — never attempt them:

- Any jump more than 2 stages forward (except `qualified` → `contacted_d1`)
- `closed_won` → any other stage (finalized)
- `raw` → anything except `qualified` (must score first)
- Going from `contacted_d*` back to `qualified` or `raw`

---

## How to Update via db.py

```bash
# Update a lead's pipeline stage
python tools/db.py leads update <lead_id> '{"pipeline_stage": "contacted_d1", "contacted_at": "2026-07-03T09:00:00Z"}'

# Also log the transition in agent_runs
python tools/db.py log setter stage_transition '{"lead_id": "<id>", "from": "qualified", "to": "contacted_d1"}'
```

### Python Helper Pattern (for agents)

```python
import subprocess, json, sys

VALID_TRANSITIONS = {
    "raw": ["qualified"],
    "qualified": ["contacted_d1"],
    "contacted_d1": ["contacted_d3", "replied", "closed_lost"],
    "contacted_d3": ["contacted_d7", "replied", "closed_lost"],
    "contacted_d7": ["replied", "closed_lost"],
    "replied": ["loom_sent", "call_booked", "closed_lost"],
    "loom_sent": ["call_booked", "replied", "closed_lost"],
    "call_booked": ["call_held", "closed_lost"],
    "call_held": ["proposal_sent", "closed_lost"],
    "proposal_sent": ["negotiating", "closed_won", "closed_lost"],
    "negotiating": ["closed_won", "closed_lost"],
}

def transition(lead_id: str, from_stage: str, to_stage: str) -> bool:
    allowed = VALID_TRANSITIONS.get(from_stage, [])
    if to_stage not in allowed:
        print(f"BLOCKED: {from_stage} → {to_stage} is not a valid transition", file=sys.stderr)
        return False

    update = {"pipeline_stage": to_stage}
    # Add timestamp fields per stage
    stage_timestamps = {
        "contacted_d1": "contacted_at",
        "replied": "replied_at",
        "loom_sent": "loom_sent_at",
        "call_booked": "call_booked_at",
        "call_held": "call_held_at",
        "proposal_sent": "proposal_sent_at",
        "closed_won": "closed_at",
        "closed_lost": "closed_at",
    }
    if to_stage in stage_timestamps:
        from datetime import datetime, timezone
        update[stage_timestamps[to_stage]] = datetime.now(timezone.utc).isoformat()

    subprocess.run(
        ["python", "tools/db.py", "leads", "update", lead_id, json.dumps(update)],
        check=True
    )
    return True
```

---

## Stage Change Notification Format (for Boss Agent)

When any agent changes a pipeline stage, format the notification as:

```
STAGE CHANGE: {business_name} ({niche})
  {from_stage} → {to_stage}
  Lead ID: {id}
  Action taken: {what was done}
  Next action: {what should happen next}
  Next action due: {date}
```

Send this to Boss via the agent_runs log:
```bash
python tools/db.py log <agent> stage_change '{
  "lead_id": "...",
  "business_name": "...",
  "from": "...",
  "to": "...",
  "action": "..."
}'
```

---

## Conversion Rate Calculations

To calculate conversion rates between stages, query counts per stage:

```bash
# Get all leads grouped by stage (use leads list and count)
python tools/db.py leads list pool 500
# Then parse JSON and count by pipeline_stage
```

### Key Conversion Benchmarks to Track

| Funnel Step | Target Rate | Formula |
|---|---|---|
| raw → qualified | 40%+ | qualified / raw |
| qualified → replied | 15%+ | replied / contacted_d1 |
| replied → call_booked | 30%+ | call_booked / replied |
| call_booked → call_held | 70%+ | call_held / call_booked |
| call_held → proposal_sent | 60%+ | proposal_sent / call_held |
| proposal_sent → closed_won | 25%+ | closed_won / proposal_sent |

### Overall Pipeline Health Score
```
health = (closed_won / raw) * 100
target: > 3% (3 closes per 100 raw leads scraped)
```

---

## Stale Lead Detection

A lead is "stale" if it has been in a contact stage for too long without progress:

| Stage | Stale After |
|---|---|
| `contacted_d1` | 3 days (should move to d3 or replied) |
| `contacted_d3` | 4 days (should move to d7 or replied) |
| `contacted_d7` | 7 days (should close_lost or get creative) |
| `replied` | 2 days (hot — move fast to Loom) |
| `loom_sent` | 4 days (follow up if no reply) |
| `call_booked` | 2 days past scheduled call (likely no-show) |
| `proposal_sent` | 5 days (follow up if no response) |
| `negotiating` | 7 days (needs Boss intervention) |

Analyst agent runs stale lead detection daily and surfaces to Boss.
