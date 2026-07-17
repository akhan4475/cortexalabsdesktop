# Website Factory Structure

**Generated:** 2026-07-01
**Niche:** landscaping
**Student:** Ayaan Khan
**Source:** Auto-scanned from `website-factory/` (excludes node_modules, dist, .git)

This document is the canonical map of the factory for the briefing agent (`/generate-wf-brief`). It lists every file that matters, what it does, and where the `/generate-wf-brief` agent should direct tailoring.

---

## Top-Level Layout

```
website-factory/
  CLAUDE.md                        Master config for the factory. Pipeline overview, agents table, commands table, skills table.
  .env.example                     Env var template. Student copies to .env.local.
  .gitignore
  .claude/                         Factory-level orchestration: agents, SOPs, skills, commands, checklists, lessons.
  clients/                         One subfolder per client. All pipeline outputs live here.
  config/
    template-routes.json           Maps niche slug -> template path. Updated by /build-niche-template.
  references/                      Universal reference materials. Never edited by pipeline runs.
  templates/
    landscaping/                   The active niche template. Built by Module 2D.
    proposal/                      Proposal HTML template.
  tools/                           Python CLI tools. Called by agents and SOPs.
```

---

## `.claude/` -- Factory Orchestration Layer

### Agents (`.claude/agents/`)

These are the per-stage instruction files Claude reads when running each pipeline stage. Each agent has a gate-locked entry check, a step-by-step procedure, and a gate-locked exit condition.

| File | Stage | What it does |
|---|---|---|
| `00-intake.md` | 1 | Scaffolds the client folder, runs intake interview, writes `intake.json` |
| `01-research.md` | 2 | Apify GBP + social + competitor scrape. Writes `research-report.md` and `research.json` |
| `02-seo-audit.md` | 3 | Local keyword audit, Maps Pack gap analysis, keyword architecture for all pages |
| `03-asset-scraper.md` | 4 | Logo, project photos, team photos, trust badges -- harvested via `tools/apify-scrape.py` |
| `04-strategy.md` | 5 | Business strategy, sitemap.json, section order decisions |
| `05-copy-deck.md` | 6 | Full site copy. Every H1, section body, FAQ, CTA, owner story |
| `brand-dna-agent.md` | 7 | Extracts brand DNA from logo + research + copy. Writes `brand-dna.json`. Halts if confidence < 0.70 |
| `07-5-brand-resonance.md` | 7.5 | Optional. Analyses old site visual identity. Informs brand-dna extraction |
| `08-hero-image.md` | 9 | Hero image generation via Gemini Image API. Writes `hero-final.png` |
| `09-build.md` | 10.1 | Clones niche template into client folder, overlays brand-dna, runs Vite build |
| `10-personalize.md` | 10.2 | Injects SEO metadata, schema markup, sitemap.xml |
| `11-uplift.md` | 10.3 | Niche-specific polish per niche playbook uplift rules |
| `design-fidelity-qa-agent.md` | 10.4a | SSIM comparison vs niche template reference render |
| `sop-qa-agent.md` | 10.4b | Universal + per-niche SOP compliance scoring |
| `10-4c-build-fidelity.md` | 10.4c | DOM structure diff vs niche template reference build |
| `10-4d-perf.md` | 10.4d | Lighthouse LCP < 3s gate (desktop + mobile) |
| `13-deploy.md` | 11 | Vercel CLI deploy to production |
| `12-delivery.md` | 12 | Delivery report for the client |
| `14-proposal.md` | 13 | Generates the HTML proposal via `tools/build-proposal.py` |

**Niche-specific agent overrides** (for landscaping):

| File | Purpose |
|---|---|
| `templates/landscaping/.claude/agents/05-copy-deck.md` | Landscaping-specific copy instructions: locked phrases, voice register, segment vocabulary |
| `templates/landscaping/.claude/agents/09-build.md` | Landscaping build agent: brand-dna overlay, Tailwind token map, gate checks |

### SOPs (`.claude/sops/`)

SOPs are the checklist layer that agents execute step-by-step. The `sop-qa-agent` reads them to score SOP compliance at Stage 10.4b.

| File | Covers |
|---|---|
| `00-master-blueprint.md` | Full pipeline orchestration rules, gate chain, approval gate protocol |
| `01-intake.sop.md` | Stage 1 intake procedure |
| `02-research.sop.md` | Stage 2 research procedure, Apify actor selection |
| `03-seo.sop.md` | Stage 3 SEO audit + keyword architecture |
| `04-assets.sop.md` | Stage 4 asset harvest, quality thresholds, fallback rules |
| `05-strategy.sop.md` | Stage 5 strategy + sitemap |
| `06-copywriting.sop.md` | Stage 6 copy deck generation rules |
| `08-hero-image.sop.md` | Stage 9 hero image generation protocol |
| `10a-design-fidelity.sop.md` | Stage 10.4a SSIM scoring, threshold, override protocol |
| `10b-personalize.sop.md` | Stage 10.2 SEO injection + schema markup |
| `10b-sop-qa.sop.md` | Stage 10.4b SOP compliance scoring procedure |
| `10c-uplift.sop.md` | Stage 10.3 niche uplift rules |
| `11-deploy.sop.md` | Stage 11 Vercel deploy procedure |
| `12-delivery.sop.md` | Stage 12 delivery report |
| `13-motion-system.sop.md` | Motion system rules (framer-motion, preset application) |
| `14-proposal.sop.md` | Stage 13 proposal generation |
| `14-seo-uplifts.sop.md` | SEO uplift rules applied during Stage 10.2 |
| `15-copy-resonance.sop.md` | Copy resonance scoring against niche voice |

### Skills (`.claude/skills/`)

Skills are deep capability documents. Agents invoke them for specialized knowledge. The `SKILL.md` file inside each folder is the entry point.

| Folder | Agent that reads it | What it covers |
|---|---|---|
| `frontend-design/` | build agent, design QA | Production-grade React patterns, anti-AI-aesthetic rules, layout quality |
| `impeccable/` | sop-qa-agent, design-fidelity-qa, proposal-agent | Full design intelligence system: visual hierarchy, spacing, motion, typography |
| `ui-ux-pro-max/` | build agent | 67 styles, 96 palettes, 57 font pairings, component-level UX rules |
| `copywriting/` | copy-deck agent | Universal copy contract: voice, banned words, CRO patterns |
| `design-synthesis/` | brand-dna-agent | Five-pass brand DNA extraction process |
| `design-language-extraction/` | Module 2D | Design vocabulary cataloguing from niche reference sites |
| `research/` | research agent | GBP + social + competitor research protocol |
| `asset-scraping/` | asset agent | Logo + photo harvest procedure, quality thresholds |
| `seo/` | seo-audit agent, personalize agent | Local SEO, Maps Pack, schema markup, keyword architecture |
| `nano-banana/` | hero-image agent | Hero image prompt construction, Gemini API call |
| `taste/` | build agent, design QA | Anti-slop design: layout variance, typography, motion direction |
| `vercel-deploy/` | deploy agent | Vercel CLI deploy procedure |

### Commands (`.claude/commands/`)

Slash commands the student runs inside the factory session.

| Command | Purpose |
|---|---|
| `/build-all` | End-to-end pipeline run. Halts at approval gates. |
| `/stage7` | Run brand DNA extraction only |
| `/approve-brand-dna` | Approval gate for low-confidence extractions |
| `/stage9` | Run hero image generation only |
| `/stage-10-1-build` | Run Stage 10.1 build via `tools/build-from-template.py` |
| `/stage10-4a-design-qa` | Run design fidelity QA loop |
| `/stage10-4b-sop-qa` | Run SOP compliance QA loop |
| `/diagnose-brand-dna` | Inspect brand-dna extraction confidence scores |
| `/override-design-fidelity` | Accept current build despite QA gap |
| `/override-sop` | Accept current build despite SOP gap |
| `/lesson "<correction>"` | Append a correction to the lessons ledger |
| `/lessons` | Print accumulated lessons per agent |

### Checklists (`.claude/checklists/`)

Universal QA checklists applied to every niche on every build.

| File | Purpose |
|---|---|
| `design-fidelity.universal.md` | Universal design fidelity gates (SSIM thresholds, color system, typography, layout) |
| `sop-compliance.universal.md` | Universal SOP compliance gates (hero, CTAs, form, mobile, SEO) |

**Niche-specific checklists** (landscaping, supplement the universal layer):

| File | Purpose |
|---|---|
| `templates/landscaping/.claude/checklists/sop-compliance.md` | Landscaping-specific HARD and SOFT gates |
| `templates/landscaping/.claude/checklists/design-fidelity.md` | Landscaping-specific SSIM targets per region |

---

## `templates/landscaping/` -- Active Niche Template

Built by Module 2D (`/build-niche-template`). Stage 10.1 clones this into the client folder and overlays brand-dna values.

### Root Files

| File | Purpose |
|---|---|
| `package.json` | Vite + React 19 + Tailwind 3 + framer-motion v11 deps. Scripts: dev, build, prebuild (inject-theme), predev (validate-brand-dna) |
| `vite.config.js` | Vite config, React plugin |
| `tailwind.config.js` | Custom tokens: colors (RGB triplets), fontFamily (Fraunces, Plus Jakarta Sans), shadow-card, py-section-gap-lg, p-card-pad |
| `postcss.config.js` | PostCSS config for Tailwind |
| `eslint.config.js` | ESLint config |
| `index.html` | HTML entry. Has `data-theme-mode`, `<title>`, `<meta name="description">`, JSON-LD schema block. `inject-theme.mjs` rewrites these per client. |
| `MANIFEST.json` | Template metadata: niche slug, mix sources, component list, validation status |

### `src/`

| File | Purpose |
|---|---|
| `src/main.jsx` | React entry, renders `<App />` inside `<BrowserRouter>` |
| `src/App.jsx` | Route map. All 13 routes declared. Dynamic routes: `/services/:slug`, `/service-areas/:citySlug`, `/blog/:slug` |
| `src/index.css` | Tailwind directives, CSS variable `:root` block (palette as RGB triplets), base styles |

### `src/config/`

| File | Purpose |
|---|---|
| `src/config/brand-dna.js` | Per-client values (currently filled with demo: Green Ridge Landscaping, Dallas TX). Stage 10.1 overwrites this from Pipeline Data/brand/brand-dna.json |
| `src/config/brand-dna.example.js` | Canonical 32-key shape contract. The validator and Gate 1 read this. Never modified per client. |

### `src/components/` -- 15 Components

| Component | What it renders |
|---|---|
| `TrustBar.jsx` | 40px strip above NavBar (desktop only). License number, phone, BBB badge. |
| `NavBar.jsx` | Sticky nav. Transparent on load, primary on 80px scroll. Logo left / links center / CTA right. Mobile hamburger with full-screen overlay. |
| `HeroSection.jsx` | 100vh full-bleed. Gradient overlay. Asymmetric split: text left, image right. Motion sequence (eyebrow, H1, sub, CTAs, trust chips). Dual CTA: accent-fill estimate + outlined click-to-call. |
| `TrustBarInline.jsx` | Mid-page trust strip. Star rating, review count, license, service area. |
| `ServicesSection.jsx` | Service cards grid. Reads `brandDNA.services`. Links to `/services/:slug`. |
| `PortfolioSection.jsx` | Project gallery. Before/after layout. Reads `brandDNA.previous_projects`. |
| `WhyChooseSection.jsx` | Differentiator grid. Reads `brandDNA.why_choose_us`. |
| `ProcessSection.jsx` | 3-step process. Reads `brandDNA.process_steps`. |
| `ReviewsSection.jsx` | Review cards. Reads `brandDNA.reviews.items`. Shows star rating + count. |
| `FounderSection.jsx` | Owner story. Reads `brandDNA.team.founder`, `brandDNA.copy.founder.*`. |
| `ServiceAreasSection.jsx` | City chip grid. Reads `brandDNA.serviceAreas`. |
| `FaqSection.jsx` | Accordion FAQ. Reads `brandDNA.faq` (6 entries minimum). |
| `CtaFinalSection.jsx` | 6-field lead form (name, phone, email, zip, service dropdown, project textarea). Dark bg. Reads `brandDNA.copy.formHeader`, `brandDNA.hours.display`. |
| `FooterSection.jsx` | Full footer. Logo, services list, service areas, social links, copyright. |
| `MobileBottomBar.jsx` | Fixed bottom bar (mobile only). Call Now + Get a Free Estimate buttons. `isBusinessOpen()` reads `brandDNA.businessHours`. |

### `src/pages/` -- 13 Pages

| Page | Route | Notes |
|---|---|---|
| `HomePage.jsx` | `/` | Renders all 14 sections in sequence |
| `AboutPage.jsx` | `/about` | Founder story, team, mission |
| `ServicesPage.jsx` | `/services` | Service card index |
| `ServiceDetailPage.jsx` | `/services/:slug` | Individual service page (SEO target) |
| `PortfolioPage.jsx` | `/portfolio` | Full project gallery |
| `ReviewsPage.jsx` | `/reviews` | All reviews, aggregate rating |
| `ServiceAreasPage.jsx` | `/service-areas` | City index |
| `ServiceAreaDetailPage.jsx` | `/service-areas/:citySlug` | Per-city landing page (local SEO target) |
| `BlogPage.jsx` | `/blog` | Blog post index |
| `BlogPostPage.jsx` | `/blog/:slug` | Individual blog post |
| `ContactPage.jsx` | `/contact` | Contact form + map embed |
| `FaqPage.jsx` | `/faq` | FAQ page (SEO target for cost queries) |
| `NotFoundPage.jsx` | `*` | 404 page |

### `scripts/`

| File | Purpose |
|---|---|
| `scripts/validate-brand-dna.mjs` | Runs predev + prebuild. Shape-validates brand-dna.js against brand-dna.example.js. Catches missing keys, wrong types, surviving sentinels. Uses `file://` URL import for Windows compatibility. |
| `scripts/inject-theme.mjs` | Runs prebuild. Reads brand-dna.js, rewrites CSS vars in index.css, updates `<title>`, `<meta name="description">`, JSON-LD block in index.html, Google Fonts imports. Uses function replacers to avoid `$` backreference bugs. |

### `niche-playbook/` -- 13 Playbook Files

The authoritative source for every niche-specific decision the factory makes. Agents read the playbook for copy locks, trust priorities, hero composition, motion preset, photo requirements, CRO rules, and vocabulary rules.

| File | What it controls |
|---|---|
| `theme.json` | Palette hex values, typography (heading/body), Google Fonts fragments, shape_motif, theme_mode |
| `motion-preset.json` | Animation preset ("restrained"), duration_ms (400), stagger_ms (80) |
| `copy-locks.json` | Locked copy strings. Hero headline formula, CTA button text, form header, hero chips, footer CTA. Cannot be rewritten by copy-deck agent. |
| `vocabulary.json` | Preferred and banned words. Segment voice (homeowner language). AI vocab additions. |
| `trust-signals.json` | Priority order: portfolio (1), Google reviews (2), license badge (3), service area (4), design expertise (5) |
| `hero-composition.md` | Hero layout spec: 100vh, gradient overlay values, asymmetric split rules, motion sequence timing |
| `hero-mood-mapping.json` | Mood -> image direction mapping for hero generation |
| `photo-manifest.json` | Required and optional photo categories: previous_projects, team, founder, service photos |
| `asset-patterns.json` | Logo placement rules, badge placement, icon style |
| `process.json` | 3 process steps: Free Consultation, Design + Quote, Build It Right |
| `design-vocabulary.md` | Layout patterns, typography notes, section alternation rules, motion idioms from mix sources (GreenOasis, Keane, Mountainscapers) |
| `cro-rules.md` | CRO section order rationale, CTA rules (2 per above-fold), form field rules, mobile bottom bar rules, AI chatbot placement |
| `copywriting.md` | Niche voice grammar, homeowner vocabulary, tone register (calm and competent), banned marketing phrases |

**Note:** `trust-badges/` subfolder holds any badge image assets for the niche.

### `.claude/` (Niche-Level)

Niche-specific agent overrides and checklists that supplement the factory-level equivalents.

| File | Purpose |
|---|---|
| `.claude/agents/05-copy-deck.md` | Landscaping copy agent override: voice, locked phrases, copy-blocklist additions |
| `.claude/agents/09-build.md` | Landscaping build agent override: brand-dna overlay procedure, Tailwind token map, Gate 6 skill keywords |
| `.claude/checklists/sop-compliance.md` | 12 HARD gates + 3 SOFT gates for landscaping builds |
| `.claude/checklists/design-fidelity.md` | Color system, typography, layout, motion, SSIM thresholds per region |

---

## `references/` -- Universal Reference Materials

Read-only. Never modified by pipeline runs.

| Path | Purpose |
|---|---|
| `references/brand-dna.shape.js` | Canonical 32-key brand-dna shape contract. The authoritative definition every component reads from. |
| `references/copy/ai-vocab-blocklist.md` | Universal banned word list. Niches append via `niche-playbook/vocabulary.json`. |
| `references/copy/typographic-standards.md` | Smart quotes, en-dash rules, tabular-nums, line-height standards. |
| `references/cro-sops/universal-cro-sops.md` | Universal CRO rules applicable to all niches. |
| `references/factory-blueprint/` | Blueprint template files. `generate-factory.py` reads these when scaffolding a new niche template. |
| `references/schemas/brand-dna.schema.json` | JSON schema for brand-dna validation |
| `references/niche-playbook/schemas/` | JSON schemas for each playbook file (theme, motion, copy-locks, vocabulary, trust-signals, hero-mood-mapping, asset-patterns, photo-manifest, process, proposal-pages) |
| `references/niche-playbook/contracts/` | Markdown contracts for non-JSON playbook files (copywriting, cro-rules, design-vocabulary, hero-composition, proposal-pages, copy-blocklist-additions, quantified-trust-templates, sop-overrides/) |
| `references/web-design-research-mapping.md` | Research-to-design mapping rules used by Module 2D |

---

## `tools/` -- Python CLI Tools

All tools are called by agents via `python tools/<name>.py [args]`. None are run directly by the student.

| Tool | Called by | What it does |
|---|---|---|
| `apify-scrape.py` | research agent, asset agent | Runs Apify actors (Google Places, Instagram, website crawl). Writes JSON output. |
| `build-from-template.py` | Stage 10.1 build agent | Clones niche template into client folder. Overlays brand-dna values. Runs `npm run build`. |
| `build-proposal.py` | Stage 13 proposal agent | Generates HTML proposal from proposal template + client data |
| `check-lcp.py` | Stage 10.4d perf agent | Runs Lighthouse, extracts LCP metric, exits non-zero if > 3s |
| `clean-transparent-jpeg.py` | asset agent | Removes transparency artifacts from logos saved as JPEG |
| `copy-lint.py` | copy-deck agent | Lints copy output against ai-vocab-blocklist and niche vocabulary rules |
| `derive-accent-stops.py` | Module 2D | Derives Tailwind accent stop values from primary palette hex |
| `extract-niche-design-tokens.py` | Module 2D | Extracts design tokens from niche reference site screenshots |
| `extract-resonance.py` | brand-resonance agent | Extracts visual resonance signals from the client's existing site |
| `generate-factory.py` | Module 2D | Scaffolds the niche template from blueprint. Runs token substitution and brand-dna stamp. |
| `generate-hero.py` | Stage 9 hero agent | Calls Gemini Image API with the constructed hero prompt |
| `old-site-resonance.py` | Stage 7.5 agent | Analyses old site for palette, typography, motif signals |
| `optimise-image.py` | asset agent, hero agent | Resizes, compresses, converts to WebP |
| `personalize.py` | Stage 10.2 personalize agent | Injects SEO meta, city tokens, schema markup per page |
| `qualify-photos.py` | asset agent | Scores project photos for quality (resolution, contrast, subject clarity). Flags rejects. |
| `validate-niche-template.py` | Module 2D | 6-gate validator for the niche template (brand-dna shape, component count, Gate 6 skill keywords, anti-slop scan) |

---

## `clients/` -- Per-Client Pipeline Outputs

Every client gets a dedicated subfolder. Stage 1 scaffolds the folder structure.

```
clients/
  README.md                                    Explains the folder convention.
  _agency/                                     Agency-level assets (student's own logo, brand, etc.)
  [Client Name]/
    Pipeline Data/
      intake/           intake.json, raw intake answers
      research/         research-report.md, research.json
      seo/              keyword-architecture.md, seo-plan.json
      strategy/         sitemap.json, strategy.md
      copy/             copy-deck.md, all page copy
      brand/            brand-dna.json, extraction-report.md
      brand-resonance/  resonance-report.md (Stage 7.5, optional)
      hero-image/       hero-final.png, prompt-used.txt
      deploy/           vercel deploy log, live URL
      delivery/         delivery-report.md
      lessons/          notes.md (client-specific corrections)
    [Client Name] Assets/
      logo/             Original + cleaned logo files
      projects/         Project photos (qualified by qualify-photos.py)
      team/             Founder + team photos
      badges/           Trust badge images
    [Client Name] Website/
      (cloned + built niche template)
      dist/             Vite build output (deployed to Vercel)
    [Client Name] Proposal/
      proposal.html     Final HTML proposal
```

---

## `config/`

| File | Purpose |
|---|---|
| `config/template-routes.json` | Maps niche slug to template path. Currently: `{ "byNiche": { "landscaping": "templates/landscaping" } }`. Module 2D updates this when a new niche template is built. Stage 10.1 reads it to find the correct template to clone. |

---

## Key Data Flow (Brief Summary)

```
Client intake (Stage 1)
  -> Apify research (Stage 2): research.json
  -> SEO audit (Stage 3): keyword-architecture.md
  -> Asset harvest (Stage 4): logo, photos, badges
  -> Strategy (Stage 5): sitemap.json
  -> Copy deck (Stage 6): copy-deck.md
  -> Brand DNA (Stage 7): brand-dna.json  [APPROVAL GATE if confidence < 0.70]
  -> Brand resonance (Stage 7.5, optional)
  -> Hero image (Stage 9): hero-final.png
  -> Build (Stage 10.1): templates/landscaping/ cloned + brand-dna overlaid + Vite build
  -> Personalise (Stage 10.2): SEO injection, schema markup, sitemap.xml
  -> Uplift (Stage 10.3): niche polish
  -> QA (Stage 10.4a-d): design fidelity, SOP compliance, DOM fidelity, Lighthouse LCP
  -> Deploy (Stage 11): Vercel production URL
  -> Delivery (Stage 12): delivery report
  -> Proposal (Stage 13): HTML proposal for the client
```
