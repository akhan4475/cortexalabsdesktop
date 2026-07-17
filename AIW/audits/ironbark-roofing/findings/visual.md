# Visual / Mobile Rendering Audit — Ironbark Roofing (perth-roofreplacments.vercel.app)

Captured: 2026-07-14 via Playwright Chromium (capture_screenshot.py + render_page.py)
Viewports tested: Desktop 1920x1080, Laptop 1366x768, Tablet 768x1024, Mobile 375x812 (2x DPR)

Screenshots: `AIW/audits/ironbark-roofing/screenshots/{desktop,laptop,tablet,mobile}.png` (above-fold)
and `*-fullpage.png` (full scroll capture).

## CRITICAL

1. **All "Call" CTAs are dead links — `tel:YOUR_PHONE_NUMBER` literal placeholder shipped to production.**
   Confirmed in rendered HTML (5 occurrences): desktop header call icon, mobile menu call button,
   hero secondary CTA ("Prefer to call? We're here."), and footer contact block (2x). Tapping any
   phone CTA on mobile will attempt to dial the literal string "YOUR_PHONE_NUMBER" — this fails
   silently or throws an invalid-number error on iOS/Android. Since phone-first contact is a primary
   conversion path for local trades (roofing emergencies, quote calls), this is a full functional
   break of a core CTA, not just a cosmetic issue.

2. **Displayed phone number is an unreplaced placeholder: "(08) XXXX XXXX"** — appears 7 times
   across the page (top bar is absent on mobile but present desktop/tablet/laptop header, hero
   secondary button implied number, footer contact block, and in `aria-label="Call us on (08) XXXX
   XXXX"` attributes). This placeholder is styled and positioned exactly like a real trust element
   (next to the phone icon, in the header, in the footer "contact us" block) — it reads as an
   intentional, live business number that simply hasn't been filled in. For a roofing contractor
   site this kills a primary trust/conversion signal: visitors either can't call at all, or
   perceive the business as unfinished/untrustworthy.
   Accessibility compounds this: screen-reader users hear "Call us on zero eight, X X X X, X X X X"
   read aloud verbatim from the `aria-label`.

3. **Geo mismatch between domain and content: domain implies Perth, page content is 100% Adelaide (SA).**
   Zero occurrences of "Perth" anywhere in the rendered page (checked full HTML). 39 occurrences of
   "Adelaide"; header top-bar says "Servicing all Adelaide metro suburbs"; hero copy says "Adelaide's
   registered roofing builders"; trust badge says "Registered Builder SA · BRN XXXXXXX" (South
   Australian builder registration, not WA). `<title>` tag: "Ironbark Roofing | Registered Roofing
   Builders SA". Domain is `perth-roofreplacments.vercel.app`. This looks like a templated
   multi-city rollout where the Perth instance was deployed with Adelaide copy left in place —
   would actively confuse/mismatch any Perth searcher who lands here expecting a WA roofer, and is
   a red flag for local SEO / NAP consistency if this domain is ever indexed as-is.

## Above-the-Fold — PASS (content structure is otherwise strong)

Desktop (1920x1080), Laptop (1366x768), and Tablet (768x1024) all show, without scrolling:
- H1 "YOUR ROOF REPLACED. Done Once. Done Right." — fully visible, high contrast (white/teal on
  dark roof photo overlay).
- Primary CTA "BOOK MY FREE ROOF INSPECTION" — solid teal button, fully visible, good contrast.
- Secondary CTA "Prefer to call? We're here." — visible immediately beside primary CTA (but see
  Critical #1/#2 — non-functional).
- Trust bar: 5.0 star rating, "47 Google reviews", "Registered Builder SA" — visible above fold.
- Sticky/top utility bar: "Servicing all Adelaide metro suburbs", star rating summary, BRN number —
  visible above fold on desktop/laptop/tablet (not present in mobile above-fold capture — see below).

Mobile (375x812): H1, subhead, description, primary CTA (full-width teal button), secondary call
button, and the 5.0-star review trust line are all visible without scrolling. Primary CTA is
full-width and comfortably sized for touch. This is a well-built above-the-fold mobile hero
structurally — the only problem is that the phone CTA within it is broken (see Critical #1).

## Mobile Responsiveness

- No horizontal scroll observed at 375px width.
- Hamburger menu icon present top-right on mobile nav; phone number is intentionally hidden on
  mobile header (`hidden md:inline-flex` class) — reasonable since it's a placeholder anyway, but
  means the only visible phone-adjacent element on mobile is the broken "Prefer to call" button.
- Primary CTA button height/width comfortably exceeds 48x48px touch target minimum.
- Base font sizes are legible (≥16px) across hero copy at mobile width.
- Full-page mobile screenshot captured (`mobile-fullpage.png`, ~750x15600px at 2x DPR) — no
  overlapping elements or obvious layout breaks observed in the hero/first-fold region; deeper
  sections were captured but not individually audited section-by-section in this pass.

## Layout / Contrast

- No overlapping elements, text cut-off, or broken images detected in hero region across any tested
  viewport.
- Text contrast in hero (white/teal on dark navy roof-photo overlay) and header (dark text on white)
  both read as comfortably passing WCAG AA at a glance.
- Responsive breakpoints (desktop → laptop → tablet → mobile) all preserve the same hero structure
  and CTA hierarchy consistently — no layout collapse or element reflow issues observed.

## Evidence / Artifacts

- `AIW/audits/ironbark-roofing/screenshots/desktop.png`, `mobile.png`, `laptop.png`, `tablet.png` — above-fold captures
- `AIW/audits/ironbark-roofing/screenshots/*-fullpage.png` — full-page captures per viewport
- `AIW/audits/ironbark-roofing/rendered.html` — rendered DOM used to confirm `tel:YOUR_PHONE_NUMBER` and Adelaide/Perth text search
