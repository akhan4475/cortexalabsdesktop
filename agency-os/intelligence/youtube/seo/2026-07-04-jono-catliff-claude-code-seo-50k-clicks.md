# Claude Code SEO System That Got 50,000 Clicks (2026)
**Category:** seo
**Source Type:** youtube
**Source URL:** https://www.youtube.com/watch?v=4IyJm1i__ag
**Creator:** Jono Catliff
**Date Captured:** 2026-07-04
**Applies To:** all niches (local service businesses)
**Quality Score:** 10
**Tags:** claude-code, seo-automation, blog-at-scale, service-pages, keyword-research, semrush, next-js, vercel, google-search-console, local-seo, static-site

---

## Key Tactics

1. **Two-tactic SEO system** — Blog posts at scale (informational content for authority) + Service pages (transactional conversions). Both are required. Blogs build trust and domain authority; service pages convert that traffic into leads.
2. **Keyword research criteria: SEMrush, difficulty ≤30, volume ≥100** — Target keywords where you can realistically rank. Informational intent for blogs (how-to, what-is, guide). Transactional/local intent for service pages (niche + city combos). No point chasing KD 60+ as a new site.
3. **Keyword clusters = one pillar post per cluster** — Group 5–10 related keywords around a central topic. One piece of content covers the whole cluster. Google ranks the pillar for the entire cluster, multiplying traffic per post.
4. **Voice training before writing** — Paste 3–5 examples of your own writing to Claude. Claude learns your voice and outputs content in it. This is the critical step to avoid AI slop detection. Without voice training, AI content reads as generic and Google is increasingly filtering it.
5. **Competitive analysis on top 3 ranking pages** — Before writing, analyze top 3 Google results for your target keyword. Extract: headings used, word count, topics covered, questions answered. Don't copy — identify gaps and cover them better.
6. **80+ on-page SEO signals checklist** — Every post must pass a checklist covering: target keyword in H1, URL slug, meta title, meta description, first 100 words, at least 1 H2; internal links to related posts; image alt text; Schema markup; mobile responsive; fast load time.
7. **Static site generation is required for Google crawling** — Next.js (SSG/SSR) not a CRA/SPA. Google can't crawl JavaScript-rendered pages properly. Next.js + Vercel = statically generated HTML that Google indexes instantly.
8. **Claude Code "blog" skill for automation** — Build a Claude Code slash command `/blog [keyword-cluster]` that: takes the cluster, pulls competitive research, writes the post in your voice, generates metadata, creates the MDX file, commits to GitHub, and Vercel auto-deploys. Full end-to-end in one command.
9. **Service × City zipper for service pages** — Create one page per [service] × [city] combination. Example: "pool cleaning Phoenix," "pool repair Scottsdale," "pool installation Tempe." Each page is unique content. 10 services × 20 cities = 200 indexed pages in your target geography.
10. **Gradual posting cadence** — Never dump 1,000 posts overnight. Google penalizes unnatural content spikes. Build up gradually: 1–3 posts/day for the first month, then scale. Consistent cadence beats bulk drops.
11. **sitemap.xml + robots.txt essential** — Generate sitemap automatically on every build. Submit sitemap to Google Search Console immediately. robots.txt must not block Googlebot. Without these, Google might not find your pages for weeks.
12. **Google Lighthouse target: 100/100 performance** — Use Next.js + Vercel for near-perfect scores by default. Lighthouse score directly correlates with Core Web Vitals, which is a ranking signal. Any score below 80 on performance is a problem.
13. **Google My Business + Google Search Console setup on day one** — GMB for local map pack visibility. GSC for monitoring which pages are indexed, which keywords you rank for, and submitting your sitemap. These are free and non-negotiable.
14. **GitHub → Vercel deployment pipeline** — All site files in a GitHub repo. Vercel connected to the repo. On every git push, Vercel auto-deploys. Claude Code commits directly to GitHub, triggering auto-deploy without any manual steps.
15. **Result: 50,000+ organic clicks** — This full system executed over 3–6 months produces significant organic traffic for local service businesses. The blog builds authority; the service pages capture local intent. The automation makes scale possible for a one-person operation.

---

## Frameworks

### Two-Tactic SEO Architecture
```
TACTIC 1: Blog at Scale
  → Keyword research (SEMrush, KD ≤30, Vol ≥100, informational intent)
  → Group into clusters (5-10 keywords per cluster)
  → Write pillar post per cluster (voice-trained Claude)
  → Competitive analysis on top 3 pages
  → On-page checklist (80+ signals)
  → Publish via GitHub → Vercel auto-deploy
  → Build topical authority over time

TACTIC 2: Service × City Pages
  → List all services offered (e.g., 10 services)
  → List all target cities (e.g., 20 cities)
  → Generate one page per combination (200 pages)
  → Each page: unique intro, local references, CTAs
  → Submit sitemap → GSC indexes all 200 pages
  → Ranks for "[service] [city]" transactional queries
```

### Claude Code Blog Skill (Automation)
```
/blog [keyword-cluster]
  1. Pull cluster keywords
  2. Analyze top 3 ranking pages for main keyword
  3. Extract: headings, word count, topics covered
  4. Load voice training examples
  5. Write full post in owner's voice
  6. Generate: meta title, meta description, URL slug
  7. Create MDX file with proper frontmatter
  8. Run on-page SEO checklist
  9. git commit + push → Vercel auto-deploys
```

### On-Page SEO Signal Checklist (Key Points)
```
Title/Meta:
  ✓ Keyword in H1 (exact or close variant)
  ✓ Keyword in meta title (under 60 chars)
  ✓ Compelling meta description (under 155 chars)
  ✓ Keyword in URL slug
  ✓ Keyword in first 100 words of body

Structure:
  ✓ Clear H2/H3 hierarchy
  ✓ Keyword variations in H2s naturally
  ✓ At least 1 internal link to related post
  ✓ At least 1 internal link FROM related post

Technical:
  ✓ Image alt text with keyword
  ✓ Schema markup (Article or LocalBusiness)
  ✓ sitemap.xml updated
  ✓ Mobile responsive
  ✓ Lighthouse performance ≥ 90
```

---

## How to Apply — CortexaLabs

**Immediate application:**
- Build a static Next.js site for CortexaLabs itself — never a CRA or WordPress
- Create a `/blog` Claude Code skill for generating SEO posts on contractor topics
- Start with informational blog clusters: "how to find a good pool contractor," "pool cleaning vs pool maintenance," "how much does pool resurfacing cost"
- Create service × city pages for every contractor client: "[service] [city]" format

**For contractor clients (upsell):**
- SEO maintenance $297/mo tier = blog at scale (4 posts/month) + service page expansion
- Use this exact system: keyword research → clusters → Claude Code blog skill → auto-deploy
- Show GSC data as proof of progress at 30/60/90 day check-ins

**Keyword research starting point for contractors:**
- SEMrush: search "[niche] [city]" variations, KD ≤30, Vol ≥100
- Informational: "how to," "what is," "cost of," "signs you need," "how often"
- Transactional: "[niche] [city]," "[service] near me," "best [niche] contractor [city]"

---

## Raw Notes

Jono Catliff achieved 50,000 organic clicks using Claude Code to automate the entire SEO workflow. The key insight is that SEO at scale requires automation — a human writing 200 service pages manually is not feasible, but a Claude Code skill can generate and deploy them in hours.

The voice training step is what separates this from spam content farms. AI-written content in the owner's voice reads as authentic and passes Google's quality filters. Without voice training, AI content gets filtered.

Static site generation is non-negotiable. Any JavaScript-rendered SPA will have crawling issues. Next.js SSG solves this completely and Vercel's free tier handles 99% of contractor site traffic loads.

Quality score 10: directly applicable to CortexaLabs, specific technical implementation, proven results (50k clicks), and includes the automation angle that makes it scalable as a productized service upsell.
