# Agent: Personalisation + SEO Injection (Stage 10.2)

## Role
Inject all client-specific data, schema, location pages, sitemap, robots.txt, the SEO layer.

## Prerequisites
- Stage 10.1 (Build) passed
- READ `.claude/skills/seo/SKILL.md`

## Steps

### Step 0, Read accumulated lessons (REQUIRED)

Before any other step, read these two files if they exist and apply every
rule listed as an override to this agent spec:

1. `.claude/lessons/by-agent/10-personalize.md`, universal corrections that apply to every run of this agent
2. `clients/[Client Name]/Pipeline Data/lessons/notes.md`, corrections specific to this client only

Lessons take precedence over the default behaviour in this spec because they
are corrections the student made for a reason. If the universal rule and the
client-specific rule conflict, the client-specific rule wins.

If neither file exists, proceed to Step 1.

### Step 1, Inject meta tags on every page
Per the SEO skill's title and description formulas. Use React Helmet Async.

### Step 2, Inject schema markup
- Homepage: RoofingContractor + AggregateRating + areaServed
- Service pages: Service + FAQPage
- Location pages: LocalBusiness + GeoCoordinates
- All pages: BreadcrumbList
- Footer: Organization

### Step 3, Generate sitemap.xml + robots.txt
Per the SEO skill's specifications.

### Step 3.5, GEO layer (AI search visibility)

Runs after sitemap.xml and robots.txt are generated. See `.claude/skills/seo/SKILL.md`
§ 11 for the full spec. Steps here are the execution instructions.

**3.5.1 — robots.txt: allow all AI crawlers**

Replace the generated `dist/robots.txt` with the version from the SEO skill
§ 11.1. It must list explicit Allow rules for GPTBot, ClaudeBot, PerplexityBot,
CCBot, Bytespider, and Google-Extended before the wildcard User-agent rule.

**3.5.2 — Generate llms.txt**

Write `dist/llms.txt` using the template in the SEO skill § 11.2. Populate from:
- `Pipeline Data/brand/brand-dna.json` for company name, phone, description
- `Pipeline Data/strategy/sitemap.json` for the page and URL list
- `Pipeline Data/research/research-data.json` for review_count, rating, year
- `brand-dna.json` `serviceAreas[]` for the service area list

**3.5.3 — Speakable schema on homepage**

Add a `speakable` property to the homepage's existing LocalBusiness JSON-LD (see
§ 11.3). Also add CSS class `trust-bar-lead` to the first `<p>` inside TrustBar.jsx
so the cssSelector resolves.

**3.5.4 — QAPage schema on service pages**

For each FAQ question on each service page, add a QAPage JSON-LD block alongside
the existing FAQPage block (§ 11.4). Do not remove FAQPage — it still has AI/LLM
citation value.

**3.5.5 — Populate sameAs arrays**

Fill the Organization and LocalBusiness schema `sameAs` arrays from
`research-data.json`: GBP URL, Facebook, Yelp, BBB, Houzz if found. Skip any
platform absent from research. Never invent URLs.

**3.5.6 — Named entity pass**

Scan every page. If the business name, city, and primary service do not appear
together in the first 100 words, prepend one natural sentence to the intro copy
that does. Log which pages needed the fix in the QA report.

**3.5.7 — Pre-render gate (REQUIRED before Vercel deploy)**

Before running `vite build` for production, ensure the pre-render config is active
in `vite.config.js`. The pre-render plugin (`@prerenderer/plugin-vite`) must list
every URL from `sitemap.json` as a route. Without pre-rendering, Googlebot receives
`<div id="root"></div>` and the site ranks for nothing.

Steps:
1. Read `Pipeline Data/strategy/sitemap.json` to get all page URLs
2. Add `@prerenderer/plugin-vite` and `@prerenderer/renderer-puppeteer` to the
   client's `package.json` devDependencies (`"^2.0.0"`)
3. Update `vite.config.js` to include the prerender plugin with the full route list
4. Run `npm install` in the client website directory
5. Run `vite build` — each route now pre-renders to its own HTML file in `dist/`

Skip this step only for mockup localhost demos. Pre-rendering is mandatory for every
Vercel production deploy.

### Step 4, Image SEO
Rename all images to keyword-rich kebab-case. Add descriptive alt text with location.
WebP format, lazy loading, explicit dimensions.

### Step 5, Internal linking pass
- Service pages link to relevant locations
- Location pages link to all services + 3-5 adjacent locations
- Footer links to all top-level service and location pages
- Nav has dropdowns for Services and Locations

### Step 6, Verify zero placeholders
Search the build output for any unfilled `[BRACKET]`, `{placeholder}`, or "Lorem ipsum" patterns.

### Step 7, Sub-2s LCP guard (SOP 14)

Boot the dev server (or use the one already running from earlier), then run:

```bash
cd "clients/[Client Name]/[Client Name] Website"
npm run dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
# wait for ready
for i in {1..30}; do
  if curl -s -f -o /dev/null http://localhost:5173; then break; fi
  sleep 0.5
done

cd "$REPO_ROOT"
python3 tools/check-lcp.py --client "[Client Name]" --target 2000 --max-retries 3

# stop dev server when done
kill $DEV_PID 2>/dev/null
```

The script:
1. Runs Lighthouse mobile against `http://localhost:5173`
2. If LCP > 2000 ms, downgrades the hero image quality (90 → 78 → 66) and retries
3. Writes `clients/[Client Name]/Pipeline Data/logs/lcp-report.json` with the history

Exits 0 if LCP ≤ 2000 ms, exits 1 if budget still missed after 3 attempts. Stage 10.2 fails the gate if exit 1 (unless overridden via `/override-stage --stage=10.2 --reason=...`).

## Pass gate
- Zero placeholders remaining
- Every page has unique meta title + description
- Schema markup validates (use schema.org validator)
- sitemap.xml + robots.txt generated (robots.txt includes AI crawler Allow rules)
- `dist/llms.txt` generated and populated
- Speakable schema added to homepage JSON-LD
- QAPage schema added to all service page FAQ sections
- sameAs arrays populated from research data
- Named entity sentence present in first 100 words of every page
- Pre-render plugin configured and `vite build` pre-renders all routes (required for Vercel)
- Internal links audited
- **Mobile LCP ≤ 2000 ms** (per SOP 14)