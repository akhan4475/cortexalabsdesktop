# Website Factory, Structure Overview

## What the Factory does

The factory runs a deterministic 13-stage per-client pipeline: it clones the active niche template, overlays per-client brand-dna and copy and assets, builds, validates, deploys to Vercel, and generates a proposal. Every stage is gate-locked; no stage proceeds until the prior one passes its exit criteria.

---

## Per-niche template

The factory does NOT carry a baseline template. Module 2D generates a per-niche template at `templates/{niche-slug}/` from captured niche research (top-of-niche sites, design tokens, niche playbook, niche-specific QA checklists). Stage 10.1 (`tools/build-from-template.py`) reads the active niche from the parent stack's `stack-state.json` and clones `templates/{niche-slug}/` into the client folder.

Active niche: **pool-services** (`templates/pool-services/`)

If no per-niche template exists for the active niche, Stage 10.1 halts with a clear error pointing back to `/build-niche-template`.

---

## Pipeline

The student runs `/build-all` from inside `website-factory/` to kick off the pipeline. It halts automatically at the Stage 7 approval gate if brand-dna confidence falls below 0.70.

| Stage | Name | Output path |
|-------|------|-------------|
| 1 | Intake | `Pipeline Data/intake/` |
| 2 | Research | `Pipeline Data/research/` |
| 3 | SEO planning | `Pipeline Data/seo/` |
| 4 | Asset harvest | `[Client Name] Assets/` |
| 5 | Strategy | `Pipeline Data/strategy/` |
| 6 | Copywriting | `Pipeline Data/copy/` |
| 7 | Brand DNA | `Pipeline Data/brand/` **[APPROVAL GATE: confidence < 0.70]** |
| 7.5 | Brand resonance (optional) | `Pipeline Data/brand-resonance/` |
| 9 | Hero image (runs before 10.1) | `Pipeline Data/hero-image/` |
| 10.1 | Build | `[Client Name] Website/dist/` |
| 10.2 | Personalise | SEO injection, schema markup, sitemap.xml |
| 10.3 | Uplift | Niche-specific polish per playbook |
| 10.4a | Design fidelity QA | SSIM vs niche reference render |
| 10.4b | SOP QA | Universal SOP layer + per-niche checklist |
| 10.4c | Build fidelity | DOM diff vs niche reference build |
| 10.4d | Perf | Lighthouse LCP < 3s desktop AND mobile |
| 11 | Deploy | `Pipeline Data/deploy/` |
| 12 | Delivery | `Pipeline Data/delivery/` |
| 13 | Proposal | `[Client Name] Proposal/` |

---

## Inputs the Factory needs (per client)

Each client lives at `clients/[Client Name]/`. The intake agent (Stage 1) requires exactly four fields:

| Field | Rule |
|-------|------|
| `businessName` | Non-empty; used as the folder name |
| `websiteUrl` | Non-empty; `https://` auto-prepended; reachability verified |
| `phone` | Non-empty; normalised to digits + `+` |
| `email` | Non-empty; must contain `@`; lowercased |

Intake writes `Pipeline Data/intake/intake-form.json`. Optional: `Pipeline Data/intake/notes.md` for special instructions.

Downstream stages populate:
- `Pipeline Data/research/research.json`
- `Pipeline Data/seo/audit-data.json`
- `Pipeline Data/strategy/strategy.json`
- `Pipeline Data/copy/copy-deck.md`
- `Pipeline Data/brand/brand-dna.json`
- `[Client Name] Assets/` (logo, badges, project-images, founder-photos)

---

## What the per-niche template + playbook supply

The active niche template at `templates/{niche-slug}/` carries:

- Niche-specific React components + pages (Vite + React + Tailwind)
- Tailwind config + foundation design tokens
- Niche-specific QA checklists at `.claude/checklists/`
- Niche playbook at `niche-playbook/` (see schemas below)

The niche playbook is the sole authority on niche-specific values. Pipeline SOPs and skills read from it for every niche-specific decision. SOP overrides live at `niche-playbook/sop-overrides/`.

### Niche playbook schemas (at `references/niche-playbook/schemas/`)

| Schema file | What it governs |
|-------------|-----------------|
| `copy-locks.schema.json` | Locked copy strings (form headers, CTAs, privacy line, section labels) |
| `hero-mood-mapping.schema.json` | Hero mood tags and image direction per segment |
| `motion-preset.schema.json` | Animation easing, duration, and entrance patterns |
| `photo-manifest.schema.json` | Required and optional photo categories + counts |
| `process.schema.json` | Service process steps shape |
| `proposal-pages.schema.json` | Proposal page content structure |
| `resonance-queries.schema.json` | Brand resonance visual query set |
| `theme.schema.json` | Palette, font pairing, shape_mode, motif library |
| `trust-signals.schema.json` | Trust badge categories, quantified trust templates |
| `vocabulary.schema.json` | Niche segment vocabulary, AI-vocab additions, tone |
| `asset-patterns.schema.json` | Asset category rules and naming patterns |

### Niche playbook contracts (at `references/niche-playbook/contracts/`)

| Contract file | What it governs |
|---------------|-----------------|
| `copywriting.contract.md` | Universal copy rules every niche satisfies |
| `cro-rules.contract.md` | Conversion rate optimisation patterns |
| `design-vocabulary.contract.md` | Design language catalogue format |
| `hero-composition.contract.md` | Hero section composition rules |
| `proposal-pages.contract.md` | Proposal voice and structure standards |
| `quantified-trust-templates.contract.md` | Quantified social proof sentence templates |
| `copy-blocklist-additions.contract.md` | Niche-specific AI-vocab blocklist additions |

---

## Canonical brand-dna shape contract

Every React component in every niche template reads from the canonical shape at `references/brand-dna.shape.js`. Stage 7 (brand-dna-agent) writes per-client values into `Pipeline Data/brand/brand-dna.json`. Stage 10.1 fills `templates/{niche-slug}/src/config/brand-dna.js` from those values.

The shape covers these top-level keys (all required unless marked optional):

| Key | Description |
|-----|-------------|
| `meta` | title, description |
| `company` | name, shortName, tagline, url, licenseNumber (opt), description, serviceRegion |
| `contact` | phone, phoneTelLink, email, googleMapsUrl (opt), mapsEmbedUrl (opt) |
| `address` | street, city, state, zip, full, lat/lng (opt) |
| `hours` | weekday open/close, saturday (opt), display array, emergencyBadge (opt) |
| `businessHours` | tz, open, close (24h HH:MM for real-time "available now" indicator) |
| `social` | facebook, facebookReviews, instagram, linkedin, youtube (all opt) |
| `team` | founder details, founders array, group photo (opt), team_members (opt) |
| `theme_mode` | "light" or "dark" (derived from logo brightness) |
| `voice_register` | Copy tone register |
| `shape_motif` | Decorative motif slug from the niche template's asset library |
| `corner_overlay` | Decorative corner overlay motif, color, opacity |
| `palette` | primary, primary_dark, primary_slate, accent, accent_light, accent_dark, neutral, neutral_dim, silver, ink |
| `typography` | heading, body, headingFontUrl, bodyFontUrl |
| `reviews` | rating, googleCount, facebookCount, totalReviewCount, labels, stats, items array |
| `services` | Array of { slug, name, iconPath, body } |
| `serviceAreas` | Array of city-name strings |
| `trust_badges` | Array of { filename, alt } |
| `press_logos` | Array of { filename, alt } (opt) |
| `previous_projects` | Array of { filename, alt, type, caption, category } |
| `copy` | Per-section label/heading/body bundles (hero, trustChips, form, footer, blog, cta, faq, founder, gallery, offers, process, reviews, serviceAreas, services, whyChoose) |
| `process_steps` | Array of { n, title, body } |
| `why_choose_us` | Array of title strings |
| `special_offers` | Array of { label, description } |
| `faq` | Array of { q, a } |
| `blog_posts` | Array of post objects (slug, cover, title, date, category, excerpt, readTime, content) |
| `blog_categories` | Array of category strings |
| `location_pages` | Array of { slug, city, state, ... } |
| `pages` | Per-page copy bundles (about, serviceAreas, locationDetail, blogPost, blog, contact, services, financing) |
| `credit` | agency name, url (opt) |

A per-niche validator at `scripts/validate-brand-dna.mjs` walks this shape and halts on missing fields, wrong types, or surviving sentinels in strict mode.

---

## What the factory universals handle (every niche)

- Theme mode logic (light/dark from logo brightness)
- Vite + React + Tailwind build stack (via niche template's package.json)
- SEO injection and schema markup (Stage 10.2)
- Lighthouse perf gate: LCP < 3s desktop AND mobile (Stage 10.4d)
- Vercel production deploy (Stage 11)
- Proposal HTML generation (Stage 13)
- Universal AI-vocab blocklist + typographic standards
- Lessons ledger self-improvement (corrections fed back per agent via `.claude/lessons/`)

---

## SOPs

Stage SOPs live at `.claude/sops/`. Each stage has a corresponding `NN-[name].sop.md`. The sop-qa-agent reads them during Stage 10.4b. The niche playbook's `sop-overrides/` directory supplies any niche-specific overrides; overrides take precedence over universal SOPs.

Active SOPs: intake, research, seo, assets, strategy, copywriting, hero-image, design-fidelity, personalize, sop-qa, uplift, deploy, delivery, motion-system, proposal, seo-uplifts, copy-resonance.

---

## Outputs the Factory produces (per client)

| Output | Path |
|--------|------|
| Built site | `clients/[Client Name]/[Client Name] Website/dist/` |
| Vercel deploy URL | Written to `Pipeline Data/deploy/` |
| Proposal HTML | `clients/[Client Name]/[Client Name] Proposal/proposal.html` |
| Delivery report | `clients/[Client Name]/Pipeline Data/delivery/delivery-report.md` |

---

## Handoff format

The Module 5 brief lands at `research/output/website-factory-brief.md`. `/tailor-factory` reads it and updates factory-wide settings that must align with the niche (agency branding in the proposal template, etc.).
