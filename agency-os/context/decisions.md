# CortexaLabs AI — Locked Decisions

These decisions are final. They cannot be overridden by any agent, any command, or any prospect request. If a situation arises that seems to require violating one of these, escalate to Ayaan — do not proceed.

---

## Business Model Decisions

### 1. No recurring retainers for web design

Web design is a one-time fee. We do not offer monthly retainer pricing for website builds, updates, or redesigns. Upsells (hosting, SEO, ads) are recurring — but the build itself is not.

**Why:** Retainers for web design create scope creep, client dependency, and low margins. Our model is built on volume and speed, not hourly billing.

**If a prospect asks for a monthly plan:** Explain that we do one-time builds. Offer the hosting + SEO upsell as an ongoing relationship if they want continuous support. Do not create custom payment plans that turn a one-time build into a retainer.

---

### 2. Local businesses only — no national brands or franchises

We exclusively work with locally owned and operated businesses. We do not work with franchise locations, regional chains, or national brands — even if they are in one of our target niches.

**Why:** Franchise sites are controlled at the brand level. Decisions require corporate approval. Sales cycles are long. The local owner rarely has the authority or budget to make this decision. These deals waste time.

**Disqualifiers:** Business name appears in a known franchise list. Google listing shows "Part of a chain." Websites redirect to a corporate brand domain. The owner says "I need to check with my franchisor."

---

### 3. No specific SEO ranking guarantees

We never promise a contractor they will rank #1 (or any position) on Google. We promise SEO best practices, Google Business integration, proper meta structure, and citation-clean site architecture.

**Why:** Google ranking is influenced by dozens of factors outside our control (domain age, backlinks, competitor spend, algorithm changes). Any ranking promise is a lie and a liability.

**What we say instead:** "We'll build the site with all the right SEO foundations. You'll be in a position to rank. The timeline for that depends on your market and how competitive it is."

---

### 4. No e-commerce stores

We do not build online stores, product catalogs, payment-gated content, or any site that requires WooCommerce, Shopify, or Stripe product flows. Our templates are service business sites only.

**Why:** E-commerce adds significant complexity, timeline, and ongoing maintenance. It's outside our niche expertise. It pulls us away from contractors.

---

### 5. Only the 6 approved niches

We target exactly: pool contractors, roofing contractors, landscaping contractors, remodeling contractors, general contractors/construction, painters.

We do not pivot to plumbers, electricians, HVAC, dentists, restaurants, retail, or any other vertical — even if a prospect asks.

**Why:** Our ICP, templates, scripts, and intelligence are all niche-specific. Expanding niches means rebuilding all of that from scratch. We go deep, not wide.

---

### 6. Minimum 3 recent reviews required

A lead must have at least 3 Google reviews (total) to qualify for outreach. "Recent" means at least 1 review in the last 6 months.

**Why:** Fewer than 3 reviews signals a very new or inactive business. These owners are harder to sell, less likely to have budget, and more likely to ghost. The data shows reply rates are significantly lower below this threshold.

**This rule is absolute.** Scout does not add sub-threshold leads to the pipeline. Setter does not DM them.

---

### 7. All bookings via Cal.com only

When a prospect wants to schedule a call, they get a Cal.com link. Ayaan does not accept calls booked through Instagram DMs with a time suggestion, Facebook messages, or text messages.

**Why:** Cal.com syncs to Ayaan's calendar, sends reminders, and logs in Supabase. Informal bookings get forgotten and no-showed.

**The Cal.com link is the single source of truth for call scheduling.**

---

### 8. All client communication logged in Supabase

Every substantive interaction with a lead or client — DMs, call outcomes, proposal status, deal values — is logged in Supabase. No important information lives only in Ayaan's head or in a phone DM.

**Why:** As the business scales, undocumented client history becomes a liability. The CRM is the business.

**Agents are responsible for logging.** If an agent completes an action without logging it, the action did not happen from the OS's perspective.

---

### 9. No work starts without 50% deposit

Before any website build begins, the client pays 50% of the project fee. The remaining 50% is due on delivery.

**Factory agent does not queue a build until the deposit is confirmed.** Sales agent logs deposit confirmation in Supabase `leads` table (`deposit_received: true`).

---

### 10. Pricing is not negotiable below floor

The floor pricing is:
- Starter: $550 (do not go below this)
- Pro: $725 (do not go below this)
- Authority: $950 (do not go below this)

Small discounts (up to 10%) are acceptable to close hesitant prospects. Below the floor — do not do it. Discounting beyond floor devalues the service and signals desperation.

**If a prospect won't pay the floor:** Let them walk. The right clients are out there.

---

### 11. No speculative work or free mockups

We do not build free mockup sites, free landing pages, or "just to show you what it could look like" free work to close a deal.

We show examples from our portfolio, competitor examples, and describe what we'd build. That is the pitch. The Loom video is the demo. We do not build for free.

**Why:** Free work attracts clients who don't value what we do. If they won't buy without a free sample, they are not the right client.
