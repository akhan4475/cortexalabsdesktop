# Content Engine, Structure Overview

Generated: 2026-05-22
Source: content-engine/ (Next.js 16 + React 19 + Supabase + Claude + Apify + AssemblyAI)

---

## What the Engine does

A single-tenant web app you deploy to your own Vercel project, backed by your own Supabase database. You drop context into seven role-defined buckets, then type a generation request (e.g. "5 reels about why pool companies lose leads online") and the engine pulls the most relevant context, runs Claude in your voice, and drops ready-to-film scripts into a pipeline kanban.

---

## Five things the engine does

1. **Context Library** - seven role-defined buckets. Drop YouTube URLs, Instagram reels, voice memos, PDFs, or text. The engine ingests, summarises, and indexes every item.
2. **Generator** - chat-based script generation. Pulls relevant context across buckets, runs Claude with your voice profile, outputs scripts with hook formula, body, CTA, shot ideas, and a why_it_works explanation.
3. **Pipeline kanban** - every script flows through Idea → Approved → Shot → Edited → Posted. Drag between columns, edit inline.
4. **Content Radar** - every 6 hours, scrapes your niche's hashtags and creators, scores by velocity, surfaces what is spiking. One click writes a version in your voice.
5. **Performance loop** - paste the post URL after you publish. Engine pulls metrics every hour for 30 days, classifies winners and flops, writes the lesson back into the Feedback bucket. Future generations get sharper over time.

---

## Content types the engine produces

- Instagram reels (short: 15-25s ~55 words, medium: 30-45s ~100 words, long: 60-90s ~200 words)
- Carousels (8-10 slides; slide 1 hook, slide 2 deepest value, second-to-last comment-CTA, final save+share CTA)
- Story sequences (5-7 frames; sticker at frame 3-4; final frame = bio/link swipe)
- Long-form YouTube / podcast outlines (5-15 min; cold-open hook, 3-7 sections, pattern interrupts at 90s / 4min / 8min)

---

## The 7 buckets

| Bucket | Slug | Purpose | Accepted source types | UI color |
|---|---|---|---|---|
| Video Ideas | `video_ideas` | One-line topic dumps. Generator uses these as topic spines before inventing anything. | text, IG reel, TikTok, YouTube URL, link | amber |
| Inspiration | `inspiration` | Competitor reels analyzed for structure only. Generator lifts hook formulas and body patterns, never topics or phrasing. | IG reel, TikTok, YouTube URL, link, text | purple |
| Expert Brain | `expert_brain` | Long-form sources: frameworks, models, principles, podcasts. Generator maps every script body to a named framework from here. | YouTube URL, PDF, link, text, audio, video | blue |
| My Voice & Content | `my_voice` | Your past posts, captions, voice memos. PRIMARY voice anchor - overrides all other voice cues including your own tone descriptor. | text, audio, video, IG reel, TikTok, YouTube URL, link | emerald |
| Context | `context` | Your business identity: niche, avatar, offer, lead magnet, proof points, case studies, service details. This is the relevance layer every script must serve. | text, PDF, link, audio, video, YouTube URL | orange |
| Instructions / Intent | `instructions` | Hard rules that override everything: "always end with comment WEB", "no swearing", banned phrases, sign-off format. | text only | zinc |
| Feedback | `feedback` | Auto-written performance learnings from posted content. Outranks all other inputs except hard instructions. Populated automatically by the performance loop. | text only | rose |

**Note on `context` vs `my_business`:** The engine's live bucket is called `context` (not `my_business`). All niche context, avatar definition, offer copy, and service details go into the `context` bucket.

---

## How the generator uses buckets (priority order)

When a generation request comes in, the generator composes context in this priority:

1. `feedback` - performance learnings outrank everything except hard instructions
2. `instructions` - hard rules, override all other cues
3. `my_voice` - voice_signature rules extracted at ingest are BINDING. If voice_signature conflicts with tone_descriptor, voice_signature wins.
4. `video_ideas` - if a seed topic matches, use it as spine instead of inventing
5. `expert_brain` - every script body must map to a named framework from here
6. `inspiration` - lift structural patterns (hook formula, body shape, CTA type), never topics or phrasing
7. `context` - anchor every script to this avatar and offer. Specificity is mandatory: use real numbers, real service names, real proof points from context before inventing any.

---

## Voice / style metadata the engine expects

The engine extracts a `voice_signature` at ingest from MY_VOICE items:

| Field | What it captures |
|---|---|
| `avg_sentence_length` | Target word count per sentence (±2 words enforced) |
| `opening_patterns` | Recurring openers from your real content |
| `closing_patterns` | Recurring closers / sign-offs |
| `profanity_level` | none / light / moderate / heavy - enforced strictly |
| `signature_phrases` | Catchphrases and recurring language dropped naturally into scripts |
| `distinctive_moves` | Structural tics: rhetorical questions, contrast structures, lists of three, callbacks |

The richer your MY_VOICE bucket, the tighter the voice match. Raw transcripts beat summaries - the engine uses raw content for MY_VOICE ingest.

---

## Hook formulas the generator uses

Every reel is tagged with one of these formulas:

- `contrarian` - challenges a commonly held belief
- `curiosity_gap` - opens a loop the body closes
- `pain_point` - names a fear or frustration directly
- `secret_value` - promises information most people don't have
- `time_bound_result` - specific outcome in specific time
- `mistake_callout` - "you're doing X wrong"
- `numbered_list` - "3 reasons why..."

---

## Content formats

Every script specifies one of: `talking_head`, `process_demo`, `storytelling`, `list_breakdown`, `walk_and_talk`, `duo_dialog`, `broll_voiceover`, `before_after`

---

## Source ingestion pipelines

| Source type | Processing |
|---|---|
| `text` | Directly stored; framework extraction for expert_brain |
| `youtube_url` | Free captions via youtube-transcript → summarized, tagged; expert_brain items get framework extraction |
| `instagram_reel` | Apify scrapes metadata + audio; deep_analysis extracts hook, body pattern, CTA, reusable_hook_template |
| `tiktok_url` | Apify scrapes metadata + audio; same deep_analysis as IG |
| `pdf` | Extracted, chunked, summarized |
| `audio_file` | AssemblyAI transcription → then processed as text |
| `video_file` | AssemblyAI transcription → then processed as text |
| `link` | Web content extracted → summarized |

---

## Handoff format

The brief lands at `research/output/content-engine-brief.md` structured by the seven buckets. The `/walk-engine` command walks you through pasting each bucket's section into the live dashboard one at a time.

---

## Required env vars (for deploy)

| Var | Required | Purpose |
|---|---|---|
| `SUPABASE_URL` | Yes | Database connection |
| `SUPABASE_ANON_KEY` | Yes | Client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side writes |
| `ANTHROPIC_API_KEY` | Yes | All generation |
| `APIFY_TOKEN` | Yes | IG reel + TikTok scraping, Content Radar |
| `ASSEMBLYAI_API_KEY` | No | Audio/video transcription only |
| `CRON_SECRET` | Yes | Protects the /api/cron endpoint from outside triggers |

The app boots without paid API keys. Anything that needs Anthropic / Apify / AssemblyAI runs in stub mode until you add the key via the in-app Settings page.

---

## Cost estimate

~$16/month at typical usage. Breakdown in `content-engine/docs/SETUP.md`.
