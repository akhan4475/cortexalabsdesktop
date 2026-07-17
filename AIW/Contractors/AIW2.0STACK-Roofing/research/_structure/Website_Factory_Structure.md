# Website Factory -- Structure Overview
# Module 4 output | Generated: 2026-06-26

---

## What the Factory does

The factory runs a deterministic per-client pipeline: it clones the active niche template, overlays per-client brand-dna, copy, and assets, then builds, validates, and deploys a production site -- from intake to live URL.

---

## Per-niche template

The factory carries no shared baseline. Module 2D generates a per-niche template at `website-factory/templates/{niche-slug}/` from captured niche research (top-of-niche site captures, design tokens, niche playbook, niche-specific QA checklists).

Stage 10.1 clones the active niche template for each client. If no template exists for the active niche, Stage 10.1 halts and points back to `/build-niche-template`.

**Current registered templates:**

| Niche | Path | Version | Gates passed |
|---|---|---|---|
| roofing | `templates/roofing/` | 1 | 1, 2, 3, 6 (4+5 warn) |

---

## Pipeline (Stages 1-13)

| Stage | Name | Output |
|---|---|---|
| 1 | Intake | `clients/[Name]/Pipeline Data/intake/intake-form.json` |
| 2 | Research | `Pipeline Data/research/research.json`, GBP + competitor data |
| 3 | SEO | `Pipeline Data/seo/audit-data.json`, keyword strategy |
| 4 | Assets | `[Name] Assets/` -- logo, photos, team photo, project photos |
| 5 | Strategy | `Pipeline Data/strategy/strategy.json`, sitemap |
| 6 | Copywriting | `Pipeline Data/copy/copy-deck.md` |
| 7 | Brand DNA | `Pipeline Data/brand/brand-dna.json` (approval gate if confidence < 0.70) |
| 7.5 | Brand Resonance | Optional: old-site visual analysis |
| 9 | Hero Image | `Pipeline Data/hero-image/` (runs before Stage 10.1) |
| 10.1 | Build | `[Name] Website/dist/` -- clones niche template, overlays brand-dna, Vite build |
| 10.2 | Personalise | SEO injection, schema markup, sitemap.xml |
| 10.3 | Uplift | Niche-specific polish per playbook (Voiceflow, trust badges, tel-links) |
| 10.4a | Design QA | SSIM comparison vs niche reference render |
| 10.4b | SOP QA | Universal + per-niche SOP checklist |
| 10.4c | Build Fidelity | DOM diff vs niche template reference build |
| 10.4d | Perf | Lighthouse LCP < 3s desktop + mobile |
| 11 | Deploy | Vercel production deploy |
| 12 | Delivery | Delivery report |
| 13 | Proposal | `[Name] Proposal/proposal.html` |

Student runs `/build-all` inside the factory to kick off the full pipeline. Approval gate at Stage 7 can be manually passed with `/approve-brand-dna`.

---

## Inputs the Factory needs (per client)

Each client gets a folder at `website-factory/clients/[Client Name]/`.

**Required at Stage 1 (intake):**

| Field | Where used |
|---|---|
| `businessName` | Folder naming, all stages |
| `websiteUrl` | Stage 2 research, Stage 7.5 brand resonance |
| `phone` | Brand DNA, all CTAs, tel-links |
| `email` | Contact section |

**Populated by downstream stages:**

- `Pipeline Data/research/research.json` -- GBP data, competitor URLs, review counts
- `Pipeline Data/seo/audit-data.json` -- keyword targets, H1 strategy, meta template
- `Pipeline Data/strategy/strategy.json` -- sitemap, section order, service list, service areas
- `Pipeline Data/copy/copy-deck.md` -- full site copy, written from niche playbook voice contract
- `Pipeline Data/brand/brand-dna.json` -- canonical 32-key data shape (fills niche template at build)
- `[Client Name] Assets/` -- logo file, hero photo, before/after pairs, team photo, trust badge SVGs

---

## What the per-niche template + playbook supply

The active niche template at `templates/{niche-slug}/` provides:

**Build surface:**
- React components + pages (niche-specific layouts, section order from wireframe)
- Tailwind config + CSS variable foundation (palette injected by `inject-theme.mjs`)
- `scripts/validate-brand-dna.mjs` -- shape validator
- `scripts/inject-theme.mjs` -- palette + font injector (prebuild hook)

**Niche playbook at `templates/{niche-slug}/niche-playbook/`:**

| File | Purpose |
|---|---|
| `copy-locks.json` | 4 verbatim lines that must appear in every site in this niche |
| `trust-signals.json` | Priority order + display rules for trust signals |
| `vocabulary.json` | Preferred/avoid word lists + segment voice |
| `process.json` | 4-step roofing process for ProcessSteps component |
| `theme.json` | Full color system + typography |
| `motion-preset.json` | Animation level ("restrained" for roofing) |
| `hero-mood-mapping.json` | Hero image composition spec |
| `photo-manifest.json` | Every image slot the template needs |
| `asset-patterns.json` | Asset requirements per section |
| `proposal-pages.json` | 4-page proposal structure |
| `hero-composition.md` | Full hero image direction brief |
| `copywriting.md` | Voice contract for copy agent |
| `cro-rules.md` | Conversion rules for this niche |
| `design-vocabulary.md` | Design language reference |

**Per-niche QA checklists at `templates/{niche-slug}/.claude/checklists/`:**
- `sop-compliance.md` -- copy locks, license number, tel-link count (FAIL thresholds)
- `design-fidelity.md` -- SSIM targets, trust stack requirements

**Per-niche agents at `templates/{niche-slug}/.claude/agents/`:**
- `roofing-copy-agent.md` -- drives Stage 6 copy for roofing clients
- `roofing-uplift-agent.md` -- drives Stage 10.3 polish (Voiceflow, badges, license)

---

## Universal factory references

These ship with the factory and apply to every niche:

| Reference | Purpose |
|---|---|
| `references/brand-dna.shape.js` | Canonical 32-key data shape all components read from |
| `references/niche-playbook/schemas/` | JSON schemas for the 11 playbook files Module 2D writes |
| `references/niche-playbook/contracts/` | Markdown contracts for playbook prose files |
| `references/copy/ai-vocab-blocklist.md` | Universal AI-vocab ban list |
| `references/copy/typographic-standards.md` | Smart quotes, dash rules, tabular-nums |

---

## Universal SOPs

Located at `website-factory/.claude/sops/`:

| SOP | Stage |
|---|---|
| `00-master-blueprint.md` | Universal -- read first at every stage |
| `01-intake.sop.md` | Stage 1 |
| `02-research.sop.md` | Stage 2 |
| `03-seo.sop.md` | Stage 3 |
| `04-assets.sop.md` | Stage 4 |
| `05-strategy.sop.md` | Stage 5 |
| `06-copywriting.sop.md` | Stage 6 |
| `08-hero-image.sop.md` | Stage 9 |
| `10a-design-fidelity.sop.md` | Stage 10.4a |
| `10b-personalize.sop.md` | Stage 10.2 |
| `10b-sop-qa.sop.md` | Stage 10.4b |
| `10c-uplift.sop.md` | Stage 10.3 |
| `11-deploy.sop.md` | Stage 11 |
| `12-delivery.sop.md` | Stage 12 |
| `14-proposal.sop.md` | Stage 13 |

Niche-specific overrides come from the niche template's `.claude/sops/sop-overrides/` directory.

---

## Outputs the Factory produces (per client)

| Output | Path |
|---|---|
| Built site | `clients/[Name]/[Name] Website/dist/` |
| Live URL | Vercel deploy (returned by Stage 11) |
| Proposal HTML | `clients/[Name]/[Name] Proposal/proposal.html` |
| Delivery report | `clients/[Name]/Pipeline Data/delivery/delivery-report.md` |

---

## Handoff format

The Module 5 brief lands at `research/output/website-factory-brief.md`.
`/tailor-factory` reads it and updates factory-wide settings to align with the niche (agency branding in proposal template, default niche slug, etc.).
