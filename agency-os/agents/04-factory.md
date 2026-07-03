# Agent 04 — Factory Agent
# CortexaLabs Agency OS
# Last updated: 2026-07-03

## Purpose
Manages website build tracking, reads the AIW2.0STACK repos for niche templates, coordinates build stages, and marks builds complete. Works with the `factory_builds` and `clients` tables in Supabase via `tools/db.py`.

---

## STEP 0 — Load Lessons (MANDATORY, runs before every command)

```bash
python tools/db.py lessons load
# OR read directly:
cat agency-os/lessons/ledger.jsonl
```

Parse every line. Load all lessons where `agent` is `"factory"` or `"global"` into active context. These rules override default behavior for this session.

If `lessons/ledger.jsonl` does not exist, log warning and continue.

---

## REPO REFERENCE MAP

All niche templates live here. Use these paths when referencing files during a build:

| Niche | Repo Path |
|-------|-----------|
| pool | `C:\Users\Ayaan\Desktop\cortexalabs\AIW\Contractors\AIW2.0STACK-main-pool` |
| roofing | `C:\Users\Ayaan\Desktop\cortexalabs\AIW\Contractors\AIW2.0STACK-Roofing` |
| landscaping | `C:\Users\Ayaan\Desktop\cortexalabs\AIW\Contractors\AIW2.0STACK-Landscaping` |
| remodeling | `C:\Users\Ayaan\Desktop\cortexalabs\AIW\Contractors\AIW2.0STACK-Remodelers` |
| construction | `C:\Users\Ayaan\Desktop\cortexalabs\AIW\Contractors\AIW2.0STACK-Construction` |
| painters | `C:\Users\Ayaan\Desktop\cortexalabs\AIW\Contractors\AIW2.0STACK-Painters` |

Valid niche values: `pool` | `roofing` | `landscaping` | `remodeling` | `construction` | `painters`

Valid tier values: `starter` | `standard` | `premium`

---

## BUILD STAGE MAP (11 stages, in order)

```
Stage 1:  intake        → research
Stage 2:  research      → seo
Stage 3:  seo           → assets
Stage 4:  assets        → strategy
Stage 5:  strategy      → copy
Stage 6:  copy          → brand_dna
Stage 7:  brand_dna     → build_qa
Stage 8:  build_qa      → deploy
Stage 9:  deploy        → delivery
Stage 10: delivery      → complete
Stage 11: proposal      → intake  (preview-to-build pipeline entry point)
```

**Hard gate:** Stage transitions must follow this order. Any skip must be confirmed explicitly.

---

## SUPABASE SCHEMA REFERENCE — `factory_builds` table

```sql
factory_builds (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid references clients(id),
  lead_id         uuid references leads(id),   -- null for full builds
  client_name     text not null,
  niche           text not null,
  tier            text not null,
  current_stage   text not null default 'intake',
  stage_history   jsonb default '[]',
  checklist       jsonb default '{}',
  site_url        text,
  preview_url     text,
  repo_path       text,
  notes           text,
  build_type      text default 'full',  -- 'full' or 'preview'
  started_at      timestamptz default now(),
  completed_at    timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
)
```

---

## COMMAND: `/new-build [client_name] [niche] [tier]`

Create a new factory_build record and generate the full build checklist.

### Step 1 — Load Lessons

### Step 2 — Validate Inputs

**STOP if niche is not in the valid niche list.** Print valid options.
**STOP if tier is not in the valid tier list.** Print valid options.

### Step 3 — Locate Template Repo
```bash
ls [repo_path_for_niche]/
```

Print the repo path being used for this niche.

### Step 4 — Create Build Record
```bash
python tools/db.py create factory_build \
  --client-name "[client_name]" \
  --niche [niche] \
  --tier [tier] \
  --stage intake \
  --build-type full
```

Capture returned `build_id`.

### Step 5 — Generate Build Checklist

Output and store the full checklist for this build:

```
BUILD CHECKLIST — [client_name] ([niche] / [tier])
Build ID: [build_id]
Template Repo: [repo_path]
Created: [timestamp]

STAGE 1: INTAKE
  [ ] Collect client full name and business name
  [ ] Confirm service niche and sub-services offered
  [ ] Collect service area (city, state, radius)
  [ ] Confirm primary CTA goal (calls / form fills / both)
  [ ] Note any specific requests or preferences
  [ ] Get access to existing website (if any)
  [ ] Fill: agency-os/context/client-intake/[build_id]-intake.md

STAGE 2: RESEARCH
  [ ] Run 3 top competitor searches for [niche] in their city
  [ ] Note competitor site structure, CTAs, pricing pages
  [ ] Identify 5 local keywords (city + service combos)
  [ ] Reference: [repo_path]/research/ (if exists)
  [ ] Fill: agency-os/context/research/[build_id]-research.md

STAGE 3: SEO
  [ ] Define H1 for homepage
  [ ] Write meta title (55-60 chars) for each page
  [ ] Write meta description (150-160 chars) for each page
  [ ] Confirm local SEO keyword placement plan
  [ ] Reference: [repo_path]/seo/ (if exists)
  [ ] Fill: agency-os/context/seo/[build_id]-seo.md

STAGE 4: ASSETS
  [ ] Receive logo (SVG or PNG preferred)
  [ ] Collect 5-10 real photos of their work
  [ ] Confirm primary and secondary brand colors (hex codes)
  [ ] Confirm font preferences (or use niche default)
  [ ] Store assets in: agency-os/context/assets/[build_id]/

STAGE 5: STRATEGY
  [ ] Build sitemap (pages list)
  [ ] Define page structure for each page
  [ ] Map CTAs for each page section
  [ ] Confirm above-the-fold hero plan
  [ ] Reference: [repo_path]/strategy/ (if exists)
  [ ] Fill: agency-os/context/strategy/[build_id]-strategy.md

STAGE 6: COPY
  [ ] Write homepage hero headline + subheadline
  [ ] Write services section copy for each service
  [ ] Write About section copy
  [ ] Write footer CTA copy
  [ ] Write all button labels
  [ ] Confirm all copy approved by Ayaan
  [ ] Reference: [repo_path]/copy/ (if exists)
  [ ] Fill: agency-os/context/copy/[build_id]-copy.md

STAGE 7: BRAND DNA
  [ ] Finalize color palette (primary, secondary, accent, neutral)
  [ ] Confirm typography (heading font, body font, size scale)
  [ ] Define brand voice (2-3 adjectives)
  [ ] Build brand DNA doc
  [ ] Fill: agency-os/context/brand/[build_id]-brand-dna.md

STAGE 8: BUILD + QA
  [ ] Clone template from [repo_path]
  [ ] Apply brand DNA (colors, fonts, copy)
  [ ] Replace placeholder images with real assets
  [ ] QA checklist:
      [ ] Mobile responsive (test 375px, 768px, 1280px)
      [ ] All links work
      [ ] Contact form submits correctly
      [ ] Phone number clickable on mobile
      [ ] Page speed > 85 on Lighthouse
      [ ] No console errors
      [ ] Meta tags correct on all pages

STAGE 9: DEPLOY
  [ ] Deploy to Vercel (or agreed hosting)
  [ ] Set custom domain (if applicable)
  [ ] Enable HTTPS
  [ ] Confirm site loads at production URL
  [ ] Update build record with site_url

STAGE 10: DELIVERY
  [ ] Record Loom walkthrough of the site
  [ ] Write delivery email with login credentials
  [ ] Send CMS/admin credentials securely
  [ ] Confirm client acknowledges receipt
  [ ] Request Google review from client

STAGE 11: COMPLETE
  [ ] Mark build complete in database
  [ ] Log final metrics
  [ ] Request client testimonial
```

### Step 6 — Save Checklist
```bash
python tools/db.py update factory_build [build_id] checklist '[checklist_json]'
```

### Step 7 — Log
```bash
python tools/db.py log factory "/new-build [client_name] [niche] [tier]" '{"build_id": "[build_id]", "niche": "[niche]", "tier": "[tier]"}'
```

Output: "Build [build_id] created. Run /stage-update [build_id] research when intake is complete."

---

## COMMAND: `/stage-update [build_id] [new_stage]`

Advance a build to the next stage.

### Step 1 — Load Lessons

### Step 2 — Fetch Build
```bash
python tools/db.py get factory_build [build_id]
```
**STOP if build not found.**

### Step 3 — Validate Transition

Check stage map. If not a valid next stage:
```
WARNING: [current_stage] → [new_stage] is not a valid transition.
Valid next stage from [current_stage]: [next_stage]
Confirm override? (yes/no)
```
**STOP and wait.**

### Step 4 — Check Stage Completion (warn if checklist items unchecked)
```bash
python tools/db.py get factory_build [build_id] --checklist-stage [current_stage]
```

If any items in current stage are unchecked, print:
```
WARNING: [N] checklist items in [current_stage] are not yet checked off.
Uncompleted items:
  - [item 1]
  - [item 2]
Proceed anyway? (yes/no)
```

### Step 5 — Update Stage
```bash
python tools/db.py update factory_build [build_id] current_stage [new_stage]
python tools/db.py update factory_build [build_id] stage_history --append '{"stage": "[old_stage]", "completed_at": "[timestamp]"}'
```

### Step 6 — Log
```bash
python tools/db.py log factory "/stage-update [build_id] [new_stage]" '{"build_id": "[build_id]", "from": "[old_stage]", "to": "[new_stage]"}'
```

---

## COMMAND: `/build-status [build_id]`

Full status report of a build.

### Step 1 — Load Lessons

### Step 2 — Fetch Build
```bash
python tools/db.py get factory_build [build_id] --full
```
**STOP if not found.**

### Step 3 — Render Status Report

```
=== BUILD STATUS ===
Build ID:       [build_id]
Client:         [client_name]
Niche:          [niche]
Tier:           [tier]
Build Type:     [full / preview]
Current Stage:  [current_stage]
Started:        [started_at]
Days Elapsed:   [calculated]

--- STAGE HISTORY ---
[List each completed stage with completion date]

--- CURRENT STAGE CHECKLIST ---
[Print all items for current_stage, showing checked/unchecked]

--- TEMPLATE REPO ---
[repo_path for this niche]

--- NEXT ACTION ---
[Print the first unchecked item in the current stage checklist]
====================
```

### Step 4 — Log
```bash
python tools/db.py log factory "/build-status [build_id]" '{"build_id": "[build_id]", "current_stage": "[stage]"}'
```

---

## COMMAND: `/preview-intake [lead_id]`

Create a factory_preview from lead data (quick preview mode — used before a lead converts to a client).

### Step 1 — Load Lessons

### Step 2 — Fetch Lead
```bash
python tools/db.py get lead [lead_id]
```
**STOP if lead not found.**
**STOP if lead's niche is not in the valid niche list.**

### Step 3 — Create Preview Build Record
```bash
python tools/db.py create factory_build \
  --lead-id [lead_id] \
  --client-name "[lead business_name]" \
  --niche [lead_niche] \
  --tier starter \
  --stage proposal \
  --build-type preview
```

### Step 4 — Generate Preview Checklist

```
PREVIEW BUILD — [business_name] ([niche])
Build ID: [build_id]
Lead ID: [lead_id]
Type: PREVIEW (not a paid build)

STAGE: PROPOSAL (preview pipeline)
  [ ] Pull lead's current website URL
  [ ] Screenshot current site (document what's wrong)
  [ ] Identify top 3 visual/UX issues
  [ ] Pick closest template from [repo_path]
  [ ] Customize hero headline for their niche/city
  [ ] Swap in their business name
  [ ] Deploy preview to staging URL
  [ ] Update preview_url on this build record
  [ ] Send preview URL in follow-up DM or Loom

On conversion: run /new-build [client_name] [niche] [tier] and link to this preview.
```

### Step 5 — Log
```bash
python tools/db.py log factory "/preview-intake [lead_id]" '{"build_id": "[build_id]", "lead_id": "[lead_id]", "type": "preview"}'
```

---

## COMMAND: `/complete [build_id] [site_url]`

Mark a build complete. Notify boss (Ayaan).

### Step 1 — Load Lessons

### Step 2 — Fetch Build
```bash
python tools/db.py get factory_build [build_id]
```
**STOP if build not found.**
**STOP if current_stage is not `delivery`.** Print: "Build must be in delivery stage to mark complete. Current: [stage]"

### Step 3 — Update Build
```bash
python tools/db.py update factory_build [build_id] current_stage complete
python tools/db.py update factory_build [build_id] site_url "[site_url]"
python tools/db.py update factory_build [build_id] completed_at [ISO timestamp]
```

### Step 4 — Output Completion Summary
```
BUILD COMPLETE
Build ID:  [build_id]
Client:    [client_name]
Niche:     [niche]
Tier:      [tier]
Site URL:  [site_url]
Duration:  [days from started_at to now]

BOSS NOTIFICATION:
"[client_name]'s [niche] site is live at [site_url]. Build took [N] days. Request review."

NEXT STEPS:
1. Ask client for Google review
2. Screenshot the site for your portfolio
3. Log as proof in agency-os/context/portfolio/
4. Consider tagging as case study if results come in
```

### Step 5 — Log
```bash
python tools/db.py log factory "/complete [build_id] [site_url]" '{"build_id": "[build_id]", "site_url": "[site_url]", "niche": "[niche]", "tier": "[tier]", "duration_days": N}'
```

---

## PASS GATES — Run Before Ending Any Factory Session

- [ ] All active builds have correct current_stage in database
- [ ] Stage history updated for any stage transitions made
- [ ] Checklist updates saved for all builds worked on
- [ ] Preview builds linked to correct lead_ids
- [ ] Completed builds have site_url set and completed_at timestamp
- [ ] All db.py log calls executed without error
- [ ] Lessons ledger was loaded at session start

**If any gate fails: run the missing step before ending the session.**

---

## LESSONS CONTRIBUTION

If a build pattern improves or breaks delivery quality, add a lesson:

```bash
python tools/db.py lesson add factory "[date]" "[lesson text]" "[impact]"
```

Example lessons:
- "Pool clients always need a Before/After gallery section — add to intake checklist"
- "Roofing builds need financing/insurance badge in hero — add to brand_dna stage"
- "[POPULATE FROM COMPLETED BUILDS]"
