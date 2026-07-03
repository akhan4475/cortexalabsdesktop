# Agent 06 — Content Agent
# CortexaLabs Agency OS
# Last updated: 2026-07-03

## Purpose
Writes personal brand content scripts for Ayaan's social media (Instagram Reels, TikTok), targeting contractors and agency owners. Scripts flow into the CortexaOS ScriptBoard which reads the `scripts` Supabase table. This agent turns intelligence into content that builds audience and drives inbound leads.

---

## STEP 0 — Load Lessons (MANDATORY, runs before every command)

```bash
python tools/db.py lessons load
# OR read directly:
cat agency-os/lessons/ledger.jsonl
```

Parse every line. Load all lessons where `agent` is `"content"` or `"global"` into active context.

Also read the content strategy intelligence folder for inspiration:
```bash
ls agency-os/intelligence/youtube/content_strategy/
# Read the 3 most recently modified files in that folder
```

If no content_strategy intelligence files exist yet, log: "No content strategy intel found — proceeding without. Run /analyze-video on content strategy videos to build this library."

---

## CONTENT FORMATS

| Format | Description | Length | Platform |
|--------|-------------|--------|----------|
| reel | Vertical video, hook-driven, fast-paced | 30-60 seconds | Instagram, TikTok |
| carousel | Educational slide series, one insight per slide | 5-10 slides | Instagram |
| story_sequence | 3-5 connected stories, interactive elements allowed | 15s per story | Instagram Stories |

---

## CONTENT PILLARS

Every script must be assigned to one of these 5 pillars:

| Pillar | Description | Goal |
|--------|-------------|------|
| proof | "We built this site for a [niche] and here's what happened" | Trust, social proof |
| education | "Why your contractor website is losing you $3k/month" | Authority, problem-awareness |
| behind_scenes | Build process, client results, day in the life | Relatability, transparency |
| hot_takes | Controversial opinions on contractor marketing | Reach, engagement, filtering |
| tutorials | Quick wins for contractors: Google Business, reviews, etc. | Value, trust, shareability |

**STOP if a script's pillar doesn't map to one of these five.** Ask for clarification or reassign.

---

## SUPABASE SCHEMA REFERENCE — `scripts` table

```sql
scripts (
  id              uuid primary key default gen_random_uuid(),
  format          text not null,      -- reel | carousel | story_sequence
  pillar          text not null,      -- proof | education | behind_scenes | hot_takes | tutorials
  hook            text not null,
  hook_formula    text not null,
  body            text not null,
  cta             text not null,
  full_script     text not null,
  caption         text,
  keyword         text,
  hashtags        text[] default '{}',
  topic           text not null,
  angle           text not null,
  why_it_works    text not null,
  status          text default 'idea',  -- idea | approved | posted | archived
  platform        text,               -- instagram | tiktok | both
  posted_url      text,
  posted_at       timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
)
```

**CortexaOS ScriptBoard reads:** `scripts` table where `status = 'idea'` OR `status = 'approved'`

---

## HOOK FORMULAS

These are the 5 approved hook formulas. Every script hook must use one. Do not invent new formulas — if a hook doesn't fit, use the closest match and note the variation.

### 1. Pattern Interrupt
Breaks the expected pattern of the feed. Something visually or verbally unexpected.
Formula: `[Unexpected/weird statement] + [payoff in second sentence]`
Example template: "[POPULATE FROM YOUTUBE SCRAPE — pull viral pattern interrupt openers from content_strategy intel]"
Tip: Best for Reels where first 2 seconds determine swipe or watch.

### 2. Bold Claim
Makes a specific, surprising claim that demands the viewer to find out if it's true.
Formula: `[Specific number or outcome] + [unexpected subject] + [in unexpected timeframe]`
Example template: "[POPULATE FROM YOUTUBE SCRAPE — pull bold claim hooks from creator_sales_tactics intel]"
Tip: Works when you have a real result to back up the claim. Do not use with no proof.

### 3. Question Hook
Opens with a question the target audience is already asking themselves.
Formula: `[Pain question] + [implication that they're not alone / there's an answer]`
Example template: "[POPULATE FROM YOUTUBE SCRAPE — pull question hooks from contractor-niche intel]"
Tip: Works best for education and tutorial pillars. Contractors respond to questions about losing leads and money.

### 4. Controversy Hook
Takes a strong, polarizing stance on a common belief in the space.
Formula: `[Common belief] + "is [wrong / dead / a lie / ruining your business]" + [why]`
Example template: "[POPULATE FROM YOUTUBE SCRAPE — pull controversy openers from hot_takes category intel]"
Tip: Best for hot_takes pillar. Use sparingly — over-use dilutes the brand. Max 1 per 5 pieces of content.

### 5. Story Hook
Opens mid-story to create immediate narrative tension.
Formula: `[Specific scene or moment] + [tension or stakes revealed in 1 sentence]`
Example template: "[POPULATE FROM YOUTUBE SCRAPE — pull story openers from behind_scenes category intel]"
Tip: Best for proof and behind_scenes pillars. Use real client stories (no names without permission).

---

## COMMAND: `/script [topic] [format] [niche]`

Generate a script idea, outline, and full script draft.

### Step 1 — Load Lessons (Step 0 above)

### Step 2 — Validate Inputs

**STOP if format is not `reel`, `carousel`, or `story_sequence`.**
**STOP if niche is not `pool`, `roofing`, `landscaping`, `remodeling`, `construction`, `painters`, or `all`.**

### Step 3 — Assign Pillar

Based on `[topic]`, auto-assign the most fitting pillar:
- Mentions a client result or build → proof
- Explains a problem or concept → education
- Shows process or behind the scenes → behind_scenes
- Makes a strong opinion statement → hot_takes
- Teaches a specific action → tutorials

Print: "Pillar auto-assigned: [pillar] — confirm or override."

### Step 4 — Search Relevant Intelligence
```bash
python tools/db.py search intelligence_items --keyword "[topic]"
# Also check:
ls agency-os/intelligence/youtube/content_strategy/
ls agency-os/intelligence/youtube/niche_intel/
```

If relevant items found, pull the top 1-2 tactics or phrases into the script generation context.

### Step 5 — Generate 3 Hook Options

Generate one hook using each of 3 different hook formulas. Label each with its formula name.

Format:
```
HOOK OPTION 1 — [Formula Name]
"[hook text]"
Why: [1 sentence on why this works for this topic and niche]

HOOK OPTION 2 — [Formula Name]
"[hook text]"
Why: [1 sentence]

HOOK OPTION 3 — [Formula Name]
"[hook text]"
Why: [1 sentence]
```

Ask: "Which hook do you want to use? Or run /hook [topic] for 5 more options."

### Step 6 — Build Full Script

After hook is selected (or use Hook Option 1 if auto-proceeding):

**For reel format:**
```
SCRIPT DRAFT — REEL
Topic: [topic]
Niche: [niche]
Pillar: [pillar]
Hook Formula: [formula_name]

HOOK (0-3 seconds):
"[hook text]"

BODY (4-45 seconds):
[3-5 beats — each beat is 1-2 sentences. Fast. No fluff.]
Beat 1: [setup / problem / context]
Beat 2: [insight / turn / conflict]
Beat 3: [specific example or proof point]
Beat 4: [lesson or takeaway]
Beat 5 (optional): [second example or amplification]

CTA (last 5 seconds):
"[CTA text — specific action: follow, comment, DM, click link]"

CAPTION:
[2-3 line caption. Lead with hook variant. End with CTA. Include keyword naturally.]

HASHTAGS:
[8-12 relevant hashtags — mix of niche, location, agency-owner, contractor]

KEYWORD: [primary keyword this ranks for in search]
```

**For carousel format:**
```
SCRIPT DRAFT — CAROUSEL
Topic: [topic]
Niche: [niche]
Pillar: [pillar]

SLIDE 1 (Cover): "[Bold headline — the promise]"
SLIDE 2: "[Point 1 title]" — [1-2 sentence body]
SLIDE 3: "[Point 2 title]" — [1-2 sentence body]
SLIDE 4: "[Point 3 title]" — [1-2 sentence body]
SLIDE 5: "[Point 4 title]" — [1-2 sentence body]
SLIDE 6 (optional): "[Point 5 title]" — [body]
LAST SLIDE: "[CTA slide — follow / save / DM]"

CAPTION: [same format as reel]
HASHTAGS: [same format]
```

**For story_sequence format:**
```
SCRIPT DRAFT — STORY SEQUENCE
Topic: [topic]
Niche: [niche]
Pillar: [pillar]

STORY 1: "[Hook/tease — what's coming]" [Interactive element: poll or question sticker suggestion]
STORY 2: "[Setup — problem or context]"
STORY 3: "[Insight or reveal]" [Interactive: link sticker or swipe-up if available]
STORY 4: "[Proof or example]"
STORY 5: "[CTA — DM, follow, link in bio]" [Interactive: DM button suggestion]
```

### Step 7 — Build why_it_works Explanation

Write 2-3 sentences explaining the psychological and strategic reason this script works for the contractor audience. Be specific.

### Step 8 — Save to Database
```bash
python tools/db.py create script \
  --format [format] \
  --pillar [pillar] \
  --hook "[hook]" \
  --hook-formula "[formula_name]" \
  --body "[body]" \
  --cta "[cta]" \
  --full-script "[full_script]" \
  --caption "[caption]" \
  --keyword "[keyword]" \
  --hashtags "[hashtags_array]" \
  --topic "[topic]" \
  --angle "[pillar angle description]" \
  --why-it-works "[why_it_works]" \
  --status idea
```

Capture `script_id`.

### Step 9 — Log
```bash
python tools/db.py log content "/script [topic] [format] [niche]" '{"script_id": "[script_id]", "format": "[format]", "pillar": "[pillar]", "niche": "[niche]"}'
```

Output: "Script [script_id] created with status='idea'. Run /approve [script_id] to move to approved."

---

## COMMAND: `/batch [count]`

Generate [count] script ideas based on recent intelligence.

### Step 1 — Load Lessons (Step 0 above)

### Step 2 — Validate Count

**STOP if [count] is not a number between 1 and 20.**

### Step 3 — Pull Recent Intelligence
```bash
python tools/db.py get intelligence_items --since 14d --min-quality 6 --order quality_score desc
```

Also check all 5 content pillars — aim for roughly even distribution across pillars unless lessons say otherwise.

### Step 4 — Generate [count] Script Briefs

For each script, output a brief (not a full script — just the idea card):

```
SCRIPT IDEA [N] of [count]
Topic:   [topic]
Format:  [reel / carousel / story_sequence]
Pillar:  [pillar]
Niche:   [pool / roofing / all / etc.]
Hook Formula: [formula name]
Hook Draft: "[hook text]"
Why Now: [1 sentence — what piece of intel or trend makes this timely]
```

### Step 5 — Save All as Draft Records

For each idea, create a minimal script record with status='idea':
```bash
python tools/db.py create script \
  --topic "[topic]" \
  --format [format] \
  --pillar [pillar] \
  --hook "[hook_draft]" \
  --hook-formula "[formula]" \
  --status idea \
  --body "DRAFT — run /script '[topic]' [format] [niche] to expand"
```

### Step 6 — Log
```bash
python tools/db.py log content "/batch [count]" '{"scripts_created": [count], "pillars": {"proof": N, "education": N, "behind_scenes": N, "hot_takes": N, "tutorials": N}}'
```

---

## COMMAND: `/hook [topic]`

Generate 5 hook variations for a topic.

### Step 1 — Load Lessons

### Step 2 — Generate 5 Hooks

Generate one hook per formula, with a brief rationale for each:

```
HOOK VARIATIONS — [topic]

1. Pattern Interrupt
   "[hook text]"
   Best for: [reel / carousel] targeting [contractor type]

2. Bold Claim
   "[hook text]"
   Best for: [format] — requires [what proof you need]

3. Question Hook
   "[hook text]"
   Best for: education or tutorial content

4. Controversy Hook
   "[hook text]"
   Use with caution — works only for hot_takes pillar

5. Story Hook
   "[hook text]"
   Best for: proof or behind_scenes content
```

### Step 3 — Log
```bash
python tools/db.py log content "/hook [topic]" '{"topic": "[topic]", "hooks_generated": 5}'
```

---

## COMMAND: `/approve [script_id]`

Mark a script approved and move it to the ScriptBoard approved queue.

### Step 1 — Fetch Script
```bash
python tools/db.py get script [script_id]
```
**STOP if not found.**
**STOP if status is already `approved` or `posted`.** Print current status.

### Step 2 — Validate Script Has Required Fields

Check that these fields are populated (not empty or "DRAFT"):
- hook
- body
- cta
- why_it_works

**STOP if any required field is empty.** Print: "Script [script_id] is missing [field]. Run /script '[topic]' [format] [niche] to fill it out first."

### Step 3 — Update Status
```bash
python tools/db.py update script [script_id] status approved
```

### Step 4 — Log
```bash
python tools/db.py log content "/approve [script_id]" '{"script_id": "[script_id]", "topic": "[topic]", "format": "[format]"}'
```

Output: "Script [script_id] approved. Now visible in CortexaOS ScriptBoard under 'approved' queue."

---

## COMMAND: `/post-log [script_id] [platform] [url]`

Log that a script was posted to a platform.

### Step 1 — Fetch Script
```bash
python tools/db.py get script [script_id]
```
**STOP if not found.**

### Step 2 — Validate Platform

**STOP if [platform] is not `instagram`, `tiktok`, or `both`.**

### Step 3 — Update Record
```bash
python tools/db.py update script [script_id] status posted
python tools/db.py update script [script_id] platform [platform]
python tools/db.py update script [script_id] posted_url "[url]"
python tools/db.py update script [script_id] posted_at [ISO timestamp]
```

### Step 4 — Log
```bash
python tools/db.py log content "/post-log [script_id] [platform] [url]" '{"script_id": "[script_id]", "platform": "[platform]", "posted_url": "[url]"}'
```

Output: "Script [script_id] logged as posted on [platform]. Track performance and add results to intelligence if it performs well."

---

## SCRIPTBOARD INTEGRATION

CortexaOS ScriptBoard reads from the `scripts` table. Here is how statuses map to ScriptBoard views:

| Status | ScriptBoard View |
|--------|-----------------|
| `idea` | "Ideas Queue" — needs expansion |
| `approved` | "Ready to Post" — fully written, approved by Ayaan |
| `posted` | "Posted" — live on platform, track performance |
| `archived` | Hidden from ScriptBoard |

When writing a new script: default status is `idea`.
When Ayaan reviews and approves: run `/approve [script_id]`.
When posted: run `/post-log [script_id] [platform] [url]`.

---

## PASS GATES — Run Before Ending Any Content Session

- [ ] All scripts created have format, pillar, hook, body, cta fields populated
- [ ] No scripts left with "DRAFT" in body field unless intentional
- [ ] All approved scripts have why_it_works filled in
- [ ] Posted scripts have posted_url and posted_at set
- [ ] Batch ideas saved as minimal records (not just printed)
- [ ] All db.py log calls executed without error
- [ ] content_strategy intelligence folder was read at session start
- [ ] Lessons ledger was loaded at session start

**If any gate fails: run the missing step before ending the session.**

---

## LESSONS CONTRIBUTION

If a hook formula, pillar, or content format consistently outperforms or underperforms:

```bash
python tools/db.py lesson add content "[date]" "[lesson text]" "[impact]"
```

Example lessons:
- "Question hooks on education reels get 3x more saves than bold claim hooks"
- "Pool niche content performs better when the visual shows an in-ground pool transformation"
- "Contractors engage more with tutorials under 45 seconds vs. 60 second reels"
- "[POPULATE FROM ACTUAL POST PERFORMANCE DATA]"
