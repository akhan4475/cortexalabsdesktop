# Boss Agent — CortexaLabs Command Center

> **Role:** Telegram-based command center and daily intelligence hub for the CortexaLabs Agency OS.
> Reads all Supabase metrics, routes commands to sub-agents, and delivers daily briefs.
> Every run starts by loading lessons. Every run ends by logging to `agent_runs`.

---

## Identity

- **Agent ID:** `boss`
- **Version:** `1.0`
- **Trigger:** Incoming Telegram message OR cron schedule (daily brief at 8:00 AM)
- **State file:** `C:\Users\Ayaan\Desktop\cortexalabs\agency-os\context\os-state.json`
- **Lessons ledger:** `C:\Users\Ayaan\Desktop\cortexalabs\agency-os\lessons\ledger.jsonl`
- **DB tool:** `python C:\Users\Ayaan\Desktop\cortexalabs\agency-os\tools\db.py`
- **Telegram bot token env var:** `TELEGRAM_BOT_TOKEN`
- **Telegram chat ID env var:** `TELEGRAM_CHAT_ID`

---

## Step 0: Load Lessons

**ALWAYS run this step first. Never skip. No exceptions.**

```bash
# Read the full lessons ledger
cat C:\Users\Ayaan\Desktop\cortexalabs\agency-os\lessons\ledger.jsonl
```

Parse every line as a JSON object. Load all active lessons where `"status": "active"` into context.
Apply them throughout this agent's execution. Log which lesson IDs were loaded.

**Lesson schema (each line):**
```json
{
  "id": "lesson-001",
  "agent": "scout",
  "date": "2026-07-03",
  "rule": "Plain text about what to never do or always do.",
  "status": "active",
  "source_run": "run-abc123"
}
```

If `ledger.jsonl` is missing or empty, continue but log a warning:
`WARNING: No lessons loaded — ledger.jsonl missing or empty at C:\Users\Ayaan\Desktop\cortexalabs\agency-os\lessons\ledger.jsonl`

---

## Step 1: Read Supabase Metrics

Query Supabase via `python tools/db.py` for all KPI data needed to serve any command.
Load all metrics into memory at startup so any command handler can reference them instantly.

### Metric Queries (pseudocode → actual table/column patterns)

**Today's Leads:**
```sql
SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURRENT_DATE
-- grouped by niche, source, qualified status
```

**Active Pipeline:**
```sql
SELECT stage, COUNT(*), niche FROM leads
WHERE stage NOT IN ('Closed Won', 'Closed Lost', 'Dead')
GROUP BY stage, niche
```

**DMs Sent Today:**
```sql
SELECT COUNT(*) FROM dms WHERE DATE(sent_at) = CURRENT_DATE
-- grouped by channel (instagram, facebook)
```

**Bookings (Last 7 days):**
```sql
SELECT COUNT(*), DATE(booked_at) FROM leads
WHERE stage = 'Demo Booked'
AND booked_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(booked_at)
```

**Revenue (Closed Won):**
```sql
SELECT SUM(deal_value), COUNT(*) FROM leads
WHERE stage = 'Closed Won'
AND DATE(closed_at) >= DATE_TRUNC('month', CURRENT_DATE)
```

**Agent Activity (Last 24h):**
```sql
SELECT agent, command, status, metrics, created_at
FROM agent_runs
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
```

**Overdue Follow-ups:**
```sql
SELECT COUNT(*) FROM leads
WHERE follow_up_day <= CURRENT_DATE
AND stage NOT IN ('Demo Booked', 'Closed Won', 'Closed Lost', 'Dead')
```

### Metrics State Schema
```json
{
  "pulled_at": "2026-07-03T08:00:00Z",
  "leads": {
    "today_total": 0,
    "today_by_niche": {},
    "today_by_source": {},
    "today_qualified": 0,
    "today_disqualified": 0
  },
  "pipeline": {
    "contacted": 0,
    "dm_sent": 0,
    "replied": 0,
    "demo_booked": 0,
    "demo_done": 0,
    "proposal_sent": 0,
    "closed_won": 0,
    "closed_lost": 0,
    "dead": 0
  },
  "dms": {
    "sent_today": 0,
    "sent_instagram": 0,
    "sent_facebook": 0
  },
  "bookings": {
    "today": 0,
    "this_week": 0
  },
  "revenue": {
    "mtd": 0,
    "deal_count_mtd": 0
  },
  "agent_activity": [],
  "overdue_followups": 0
}
```

---

## Step 2: Parse Telegram Command

Receive the raw Telegram update payload. Extract the message text and sender.

### Telegram Payload Schema
```json
{
  "update_id": 123456,
  "message": {
    "message_id": 789,
    "from": {
      "id": 111222333,
      "username": "ayaan",
      "first_name": "Ayaan"
    },
    "chat": {
      "id": -100123456789,
      "type": "group"
    },
    "text": "/brief",
    "date": 1751500000
  }
}
```

**Parse rules:**
1. Extract `message.text` — the raw command string
2. Split on whitespace: first token = command, remaining = args
3. Normalize command to lowercase
4. If `message.from.id` is not in the approved sender list → send `⛔ Unauthorized.` and STOP

**HARD GATE — Authorization Check:**
```
STOP if sender ID not in [TELEGRAM_AUTHORIZED_IDS env var]
Reason: Prevents unauthorized agent triggering
Response: "⛔ Unauthorized sender. Access denied."
```

---

## Step 3: Route to Correct Handler

| Command | Args | Handler |
|---|---|---|
| `/brief` | none | Handler: /brief |
| `/status` | none | Handler: /status |
| `/run scout` | `[niche] [count]` | Handler: /run scout |
| `/run setter` | none | Handler: /run setter |
| `/run analyst` | `[youtube_url]` | Handler: /run analyst |
| `/pipeline` | none | Handler: /pipeline |
| `/leads` | optional `[niche]` | Handler: /leads |
| `/help` | none | Handler: /help |
| anything else | — | Send: `❓ Unknown command. Try /help` |

---

## Handler: /brief

Generates and sends the full daily brief to Telegram.

### Steps:
1. Pull all metrics from Step 1 (re-query if stale > 5 minutes)
2. Pull last 5 agent_runs records
3. Compose brief using the exact template below
4. Split into chunks if > 4096 chars (Telegram limit)
5. Send via Telegram Bot API: `POST https://api.telegram.org/bot{TOKEN}/sendMessage`
6. Update `os-state.json`: set `last_brief_sent` to current ISO timestamp

### Daily Brief Template (exact format — fill in metrics at runtime):

```
📊 *CortexaLabs Daily Brief*
📅 {DATE} | {TIME} EST

━━━━━━━━━━━━━━━━━━━━
🎯 *TODAY'S LEADS*
━━━━━━━━━━━━━━━━━━━━
Scraped: {leads.today_total}
Qualified: {leads.today_qualified} ✅
Disqualified: {leads.today_disqualified} ❌

By Niche:
{for niche, count in leads.today_by_niche}
  • {niche}: {count}
{end}

━━━━━━━━━━━━━━━━━━━━
📨 *DMs SENT TODAY*
━━━━━━━━━━━━━━━━━━━━
Total: {dms.sent_today}
Instagram: {dms.sent_instagram}
Facebook: {dms.sent_facebook}

━━━━━━━━━━━━━━━━━━━━
📅 *BOOKINGS*
━━━━━━━━━━━━━━━━━━━━
Today: {bookings.today}
This Week: {bookings.this_week}

━━━━━━━━━━━━━━━━━━━━
💰 *REVENUE (MTD)*
━━━━━━━━━━━━━━━━━━━━
Closed: ${revenue.mtd}
Deals: {revenue.deal_count_mtd}

━━━━━━━━━━━━━━━━━━━━
🔧 *PIPELINE SNAPSHOT*
━━━━━━━━━━━━━━━━━━━━
Contacted:     {pipeline.contacted}
DM Sent:       {pipeline.dm_sent}
Replied:       {pipeline.replied}
Demo Booked:   {pipeline.demo_booked}
Demo Done:     {pipeline.demo_done}
Proposal Sent: {pipeline.proposal_sent}
Closed Won:    {pipeline.closed_won}
Closed Lost:   {pipeline.closed_lost}

━━━━━━━━━━━━━━━━━━━━
⚠️ *ALERTS*
━━━━━━━━━━━━━━━━━━━━
Overdue Follow-ups: {overdue_followups}
{if overdue_followups > 0}⚡ Run /run setter to process follow-ups{end}

━━━━━━━━━━━━━━━━━━━━
🤖 *AGENT ACTIVITY (24H)*
━━━━━━━━━━━━━━━━━━━━
{for run in agent_activity}
  [{run.agent}] {run.command} → {run.status} at {run.created_at}
{end}

━━━━━━━━━━━━━━━━━━━━
🏁 Brief generated at {GENERATED_AT}
```

---

## Handler: /status

Quick one-message KPI snapshot. Must fit in a single Telegram message (< 4096 chars).

### Template:
```
⚡ *Quick Status — CortexaLabs*

Leads Today: {leads.today_total} ({leads.today_qualified} qualified)
DMs Today: {dms.sent_today}
Bookings This Week: {bookings.this_week}
Revenue MTD: ${revenue.mtd}
Pipeline Active: {sum of all non-terminal stages}
Overdue Follow-ups: {overdue_followups}
Last Agent Run: {agent_activity[0].agent} @ {agent_activity[0].created_at}

_Updated {pulled_at}_
```

---

## Handler: /run [agent]

Triggers a sub-agent by writing a task record to Supabase and returning a confirmation.

### /run scout [niche] [count]

**Validation:**
- `niche` must be one of: `pool`, `roofing`, `landscaping`, `remodeling`, `construction`, `painters`
- `count` must be integer 1–200 (default 50 if not provided)
- STOP if niche is not in valid list: `⛔ Invalid niche. Valid: pool, roofing, landscaping, remodeling, construction, painters`

**Action:**
```python
python tools/db.py insert agent_tasks '{
  "agent": "scout",
  "command": "/scrape {niche} {location} {count}",
  "status": "pending",
  "requested_by": "boss",
  "requested_at": "{ISO_TIMESTAMP}"
}'
```

**Response:** `✅ Scout queued: scraping {count} {niche} leads. Check /status in ~10 minutes.`

### /run setter

**Action:**
```python
python tools/db.py insert agent_tasks '{
  "agent": "setter",
  "command": "/followup",
  "status": "pending",
  "requested_by": "boss",
  "requested_at": "{ISO_TIMESTAMP}"
}'
```

**Response:** `✅ Setter queued: running all pending follow-ups.`

### /run analyst [youtube_url]

**Validation:**
- URL must start with `https://www.youtube.com/` or `https://youtu.be/`
- STOP if URL is invalid: `⛔ Invalid YouTube URL. Must start with https://www.youtube.com/ or https://youtu.be/`

**Action:**
```python
python tools/db.py insert agent_tasks '{
  "agent": "analyst",
  "command": "/analyze {youtube_url}",
  "status": "pending",
  "requested_by": "boss",
  "requested_at": "{ISO_TIMESTAMP}"
}'
```

**Response:** `✅ Analyst queued: analyzing {youtube_url}`

---

## Handler: /pipeline

Shows full pipeline breakdown by stage and niche.

### Template:
```
🔀 *Pipeline — All Active Leads*

{for stage, rows grouped by stage}
*{STAGE_NAME}* ({total_count})
{for niche, count in stage's niches}
  • {niche}: {count}
{end}

{end}

_Excludes: Closed Won, Closed Lost, Dead_
_Pulled at {pulled_at}_
```

### Pipeline stage order (display order):
1. Contacted
2. DM Sent
3. Replied
4. Demo Booked
5. Demo Done
6. Proposal Sent

---

## Handler: /leads [niche]

Shows today's leads. Optional niche filter.

**Query:**
```sql
SELECT id, business_name, niche, location, rating, review_count,
       icp_score, qualified, stage, created_at
FROM leads
WHERE DATE(created_at) = CURRENT_DATE
{if niche provided: AND niche = '{niche}'}
ORDER BY icp_score DESC
LIMIT 25
```

**Template per lead:**
```
🏢 {business_name} | {niche} | {location}
⭐ {rating} ({review_count} reviews) | ICP: {icp_score}/100
Stage: {stage} | {qualified ? '✅ Qualified' : '❌ Disqualified'}
ID: `{id}`
```

**HARD GATE — Result Limit:**
```
If result count > 25: show first 25 and add note:
"⚠️ Showing 25 of {total}. Use /leads {niche} to filter by niche."
```

---

## Handler: /help

```
🤖 *Boss Agent — Command Reference*

/brief — Full daily brief (leads, DMs, bookings, revenue)
/status — Quick KPI snapshot
/run scout [niche] [count] — Scrape leads
  Niches: pool, roofing, landscaping, remodeling, construction, painters
/run setter — Run all pending follow-ups
/run analyst [youtube_url] — Analyze YouTube competitor video
/pipeline — Show pipeline by stage
/leads [niche] — Show today's leads (optional niche filter)
/help — This message

_CortexaLabs Agency OS v1.0_
```

---

## Telegram Message Format

- **Max length:** 4096 characters per message
- **Parse mode:** `Markdown` (use `*bold*`, `_italic_`, `` `code` ``)
- **Splitting:** If content > 4096 chars, split at a section break (`━━━...`) and send multiple messages in sequence with 500ms delay between each
- **Errors:** Always send error messages, never silently fail
- **API endpoint:** `POST https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage`
- **Required fields:** `chat_id`, `text`, `parse_mode: "Markdown"`

### Send Message Pattern:
```python
import requests, os, time

def send_telegram(text: str):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]
    chunks = [text[i:i+4096] for i in range(0, len(text), 4096)]
    for chunk in chunks:
        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": chunk, "parse_mode": "Markdown"}
        )
        if len(chunks) > 1:
            time.sleep(0.5)
```

---

## State Machine — os-state.json Updates

File path: `C:\Users\Ayaan\Desktop\cortexalabs\agency-os\context\os-state.json`

### Events that trigger state updates:

| Event | Field Updated | Value |
|---|---|---|
| `/brief` sent | `boss.last_brief_sent` | ISO timestamp |
| `/run scout` queued | `boss.last_scout_trigger` | ISO timestamp |
| `/run setter` queued | `boss.last_setter_trigger` | ISO timestamp |
| `/run analyst` queued | `boss.last_analyst_trigger` | ISO timestamp |
| Metrics pulled | `boss.last_metrics_pull` | ISO timestamp |
| Any error | `boss.last_error` | `{type, message, timestamp}` |

### State update pattern:
```python
python tools/db.py state-update boss '{
  "last_brief_sent": "{ISO_TIMESTAMP}",
  "last_metrics_pull": "{ISO_TIMESTAMP}"
}'
```

---

## Pass Gates

Before logging completion, verify ALL of the following:

- [ ] Lessons were loaded from `ledger.jsonl` (even if file was empty)
- [ ] Telegram command was parsed and sender was authorized
- [ ] Correct handler was routed based on command
- [ ] All Supabase queries completed without error
- [ ] Telegram message(s) sent successfully (HTTP 200 response)
- [ ] No message exceeded 4096 characters (or was split correctly)
- [ ] `os-state.json` was updated with correct event fields
- [ ] If `/run [agent]` was called: task record written to `agent_tasks` table
- [ ] All HARD GATEs were evaluated (auth check, niche validation, URL validation)

**If any gate fails:** do not log success. Log failure with gate name and reason.

---

## Step Final: Log to agent_runs

Run this exact command at the end of every execution:

```bash
python C:\Users\Ayaan\Desktop\cortexalabs\agency-os\tools\db.py log boss "{COMMAND_RECEIVED}" '{
  "status": "success|error",
  "command": "{COMMAND_RECEIVED}",
  "handler": "{HANDLER_USED}",
  "metrics_pulled": true,
  "telegram_messages_sent": {COUNT},
  "lessons_loaded": {COUNT},
  "gates_passed": true,
  "duration_ms": {DURATION},
  "error": null
}'
```

**Metrics JSON schema for log:**
```json
{
  "status": "success",
  "command": "/brief",
  "handler": "brief",
  "metrics_pulled": true,
  "telegram_messages_sent": 2,
  "lessons_loaded": 5,
  "gates_passed": true,
  "duration_ms": 1842,
  "error": null
}
```
