#!/usr/bin/env python3
"""
quick-mockup.py

Generates a prospect mockup by populating the niche template's brand-dna.js
with basic prospect data. The dev server hot-reloads instantly.

Each prospect is saved permanently to a week folder so nothing is lost.

Usage:
    python tools/quick-mockup.py                     # interactive prompts
    python tools/quick-mockup.py prospect.json       # from a saved JSON file
    python tools/quick-mockup.py --list              # list all saved prospects

Saved to: mockup-prospects/WEEK/prospect-slug/
    prospect.json          -- the raw data you entered
    brand-dna-snapshot.js  -- the exact brand-dna written to the template

To reload a saved prospect later:
    python tools/load-mockup.py mockup-prospects/6_23-6_29/abc-roofing-dallas/
"""

import json
import re
import shutil
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent  # website-factory/
ROUTES = ROOT / "config" / "template-routes.json"
PROSPECTS_DIR = ROOT / "mockup-prospects"
SHARED_ASSETS = ROOT / "mockup-prospects" / "_shared-assets"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}

# ── Niche copy defaults ──────────────────────────────────────────────────────

NICHE_DEFAULTS = {
    "roofing": {
        "tagline": "Licensed Roofing Contractors",
        "hero_eyebrow": "{city}'s Most-Trusted Roofer",
        "hero_headline": "YOUR {city_upper} ROOF.",
        "hero_headline_accent": "Done Once, Done Right.",
        "hero_subheadline": "Free inspections. Same-day estimates. {review_count}+ 5-star reviews.",
        "trust_chips": [
            "{review_count} Google Reviews",
            "Licensed & Insured",
            "Free Estimates",
            "Same-Day Response",
        ],
        "services": [
            {"slug": "roof-replacement", "name": "Roof Replacement", "body": "Full tear-off and replacement. Completed in one day for most homes."},
            {"slug": "roof-repair",      "name": "Roof Repair",       "body": "Leak fixes, flashing repair, and shingle replacement."},
            {"slug": "storm-damage",     "name": "Storm Damage",      "body": "Hail and wind damage assessment and full restoration."},
            {"slug": "emergency-roof-repair", "name": "Emergency Repair", "body": "24/7 emergency tarping and repair."},
            {"slug": "insurance-claims", "name": "Insurance Claims",  "body": "We guide you through the claim and work with your adjuster."},
        ],
        "why_choose_us": [
            "Licensed & Insured",
            "Free Written Estimates",
            "Same-Day Emergency Response",
            "Cleanup Every Day",
            "Honest Pricing, No Surprises",
        ],
        "process_steps": [
            {"n": 1, "title": "Free Estimate",    "body": "We inspect your roof and give you a clear written estimate."},
            {"n": 2, "title": "Agree on Price",   "body": "No hidden fees. The price we quote is the price you pay."},
            {"n": 3, "title": "Roof Gets Done",   "body": "Most replacements completed in one day."},
            {"n": 4, "title": "Final Walkthrough","body": "We walk the job with you before we consider it finished."},
        ],
        "faq": [
            {"q": "How long does a roof replacement take?",    "a": "Most full replacements are done in one day."},
            {"q": "Do you work with insurance?",               "a": "Yes. We document the damage and work directly with your adjuster."},
            {"q": "Are you licensed and insured?",             "a": "Yes. Licensed in {state}. Full liability and workers comp."},
            {"q": "What areas do you serve?",                  "a": "We serve {service_areas_text} and surrounding areas."},
            {"q": "How much does a roof replacement cost?",    "a": "Most single-family homes run between $8,000 and $14,000. We give you an exact number after the inspection."},
        ],
        "insurance_bullets": [
            "Free damage documentation for your claim",
            "We communicate directly with your adjuster",
            "Most homeowners pay only their deductible",
            "Full replacement if damage qualifies",
        ],
    }
}


# ── Week folder helpers ──────────────────────────────────────────────────────

def current_week_label() -> str:
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    def fmt(d):
        return f"{d.month}_{d.day}"
    return f"{fmt(monday)}-{fmt(sunday)}"


def prospect_slug(business_name: str) -> str:
    slug = business_name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    return slug[:40]


# ── Template resolution ──────────────────────────────────────────────────────

def get_template_path(niche: str) -> Path:
    if not ROUTES.exists():
        raise FileNotFoundError(f"template-routes.json not found at {ROUTES}")
    routes = json.loads(ROUTES.read_text(encoding="utf-8"))
    by_niche = routes.get("byNiche", {})
    if niche not in by_niche:
        available = list(by_niche.keys())
        raise ValueError(
            f"No template registered for niche '{niche}'.\n"
            f"Available niches: {available}\n"
            f"Run /build-niche-template to generate a new niche template."
        )
    rel = by_niche[niche]["templatePath"]
    return ROOT / rel


# ── Interactive prompt helpers ───────────────────────────────────────────────

def ask(prompt: str, default: str = "") -> str:
    suffix = f" [{default}]" if default else ""
    val = input(f"{prompt}{suffix}: ").strip()
    return val if val else default


def ask_int(prompt: str, default: int) -> int:
    val = input(f"{prompt} [{default}]: ").strip()
    try:
        return int(val) if val else default
    except ValueError:
        return default


def ask_float(prompt: str, default: float) -> float:
    val = input(f"{prompt} [{default}]: ").strip()
    try:
        return float(val) if val else default
    except ValueError:
        return default


def ask_list(prompt: str, example: str = "") -> list:
    hint = f" (comma-separated{', e.g. ' + example if example else ''})"
    val = input(f"{prompt}{hint}: ").strip()
    if not val:
        return []
    return [v.strip() for v in val.split(",") if v.strip()]


def collect_prospect_interactive() -> dict:
    print("\n── Prospect Info ─────────────────────────────────────")
    print("Fill in what you know. Press Enter to skip optional fields.\n")

    available_niches = []
    if ROUTES.exists():
        routes = json.loads(ROUTES.read_text(encoding="utf-8"))
        available_niches = list(routes.get("byNiche", {}).keys())
    niche_hint = "/".join(available_niches) if available_niches else "roofing"

    niche        = ask(f"Niche ({niche_hint})", "roofing")
    biz_name     = ask("Business name")
    short_name   = ask("Short name (for nav/logo)", biz_name.split()[0] if biz_name else "")
    phone        = ask("Phone (e.g. (410) 555-0192)")
    city         = ask("Primary city")
    state        = ask("State (2-letter code, e.g. MD)")
    rating       = ask_float("Google star rating", 4.9)
    review_count = ask_int("Google review count", 0)
    license_no   = ask("License number (optional, press Enter to skip)")
    service_areas_raw = ask_list("Service areas", "Baltimore, Towson, Columbia")
    owner_name   = ask("Owner first name (optional)")

    print("\nWhich services does this roofer offer?")
    defaults_obj = NICHE_DEFAULTS.get(niche, {})
    default_service_slugs = [s["slug"] for s in defaults_obj.get("services", [])]
    print("  Default:", ", ".join(default_service_slugs))
    override = ask("Override service slugs (or press Enter to use all defaults)", "")
    if override:
        service_slugs = [s.strip() for s in override.split(",")]
    else:
        service_slugs = default_service_slugs

    return {
        "niche":         niche,
        "business_name": biz_name,
        "short_name":    short_name,
        "phone":         phone,
        "city":          city,
        "state":         state,
        "rating":        rating,
        "review_count":  review_count,
        "license_number": license_no or None,
        "service_areas": service_areas_raw,
        "service_slugs": service_slugs,
        "owner_name":    owner_name or None,
    }


# ── Shared assets loader ────────────────────────────────────────────────────

def load_shared_gallery(niche: str, template_path: Path, city: str) -> dict:
    """
    Reads _shared-assets/{niche}/gallery/ subfolders:
      before-after/  → paired before/after copied to public/work/
      hero/          → first photo copied to public/images/hero-bg.jpg
      team/          → all photos copied to public/team/
      action/        → all photos copied to public/work/ (extra gallery content)

    Supports two naming conventions for before/after:
      01-before.jpg / 01-after.jpg   (number-first)
      before-1.jpg  / after-1.jpg    (type-first)

    Returns {
        "previous_projects": [{before_filename, after_filename, caption, category, year}, ...],
        "team_members":      [{filename, name, role, quote}, ...],
    }
    """
    gallery_src = SHARED_ASSETS / niche / "gallery"
    out: dict = {"previous_projects": [], "team_members": []}

    if not gallery_src.exists():
        return out

    # ── Hero ──────────────────────────────────────────────────────────────────
    hero_dir = gallery_src / "hero"
    if hero_dir.exists():
        hero_photos = sorted(
            f for f in hero_dir.iterdir() if f.suffix.lower() in IMAGE_EXTS
        )
        if hero_photos:
            dest = template_path / "public" / "images"
            dest.mkdir(parents=True, exist_ok=True)
            shutil.copy2(hero_photos[0], dest / "hero-bg.jpg")

    # ── Before / After ────────────────────────────────────────────────────────
    ba_dir = gallery_src / "before-after"
    if ba_dir.exists():
        ba_photos = sorted(
            f for f in ba_dir.iterdir() if f.suffix.lower() in IMAGE_EXTS
        )
        dest_work = template_path / "public" / "work"
        dest_work.mkdir(parents=True, exist_ok=True)

        befores: dict = {}
        afters:  dict = {}
        for photo in ba_photos:
            stem  = photo.stem.lower()
            parts = stem.split("-")
            if "before" in parts:
                # "01-before" → key="01"; "before-1" → key="1"
                key = parts[0] if parts[-1] == "before" else parts[-1]
                befores[key] = photo
            elif "after" in parts:
                key = parts[0] if parts[-1] == "after" else parts[-1]
                afters[key] = photo

        for key in sorted(set(befores) & set(afters)):
            b, a = befores[key], afters[key]
            shutil.copy2(b, dest_work / b.name)
            shutil.copy2(a, dest_work / a.name)
            out["previous_projects"].append({
                "before_filename": b.name,
                "after_filename":  a.name,
                "caption":         f"{city} Roofing Project",
                "category":        "Roof Replacement",
                "year":            "2024",
            })

    # ── Team ──────────────────────────────────────────────────────────────────
    team_dir = gallery_src / "team"
    if team_dir.exists():
        team_photos = sorted(
            f for f in team_dir.iterdir() if f.suffix.lower() in IMAGE_EXTS
        )
        if team_photos:
            dest_team = template_path / "public" / "team"
            dest_team.mkdir(parents=True, exist_ok=True)
            for photo in team_photos:
                shutil.copy2(photo, dest_team / photo.name)
                out["team_members"].append({
                    "filename": photo.name,
                    "name":     "Owner",
                    "role":     "Owner",
                    "quote":    None,
                })

    # ── Action ────────────────────────────────────────────────────────────────
    action_dir = gallery_src / "action"
    if action_dir.exists():
        action_photos = sorted(
            f for f in action_dir.iterdir() if f.suffix.lower() in IMAGE_EXTS
        )
        if action_photos:
            dest_work = template_path / "public" / "work"
            dest_work.mkdir(parents=True, exist_ok=True)
            for photo in action_photos:
                shutil.copy2(photo, dest_work / photo.name)

    return out


# ── Brand-DNA builder ────────────────────────────────────────────────────────

def build_brand_dna(p: dict, template_path: Path = None) -> dict:
    niche        = p.get("niche", "roofing")
    biz_name     = p["business_name"]
    short_name   = p.get("short_name", biz_name.split()[0])
    phone        = p.get("phone", "")
    city         = p.get("city", "")
    state        = p.get("state", "")
    rating       = float(p.get("rating", 4.9))
    review_count = int(p.get("review_count", 0))
    license_no   = p.get("license_number")
    service_areas = p.get("service_areas", [])
    service_slugs = p.get("service_slugs", [])
    owner_name   = p.get("owner_name", "The Owner")

    # Load photos from shared gallery subfolders
    gallery = (
        load_shared_gallery(niche, template_path, city)
        if template_path
        else {"previous_projects": [], "team_members": []}
    )
    # Apply prospect's owner name to the first team member photo
    if gallery["team_members"] and owner_name:
        gallery["team_members"][0]["name"] = owner_name
        gallery["team_members"][0]["role"] = "Owner"

    d = NICHE_DEFAULTS.get(niche, NICHE_DEFAULTS["roofing"])

    # Build phone tel link
    digits = re.sub(r"[^\d]", "", phone)
    tel_link = f"tel:+1{digits}" if len(digits) == 10 else f"tel:{digits}"

    # Resolve services list
    all_services = d["services"]
    if service_slugs:
        services = [s for s in all_services if s["slug"] in service_slugs]
        if not services:
            services = all_services
    else:
        services = all_services

    service_areas_text = ", ".join(service_areas) if service_areas else city

    # Interpolate copy defaults
    def interpolate(text: str) -> str:
        return (text
            .replace("{city}", city)
            .replace("{city_upper}", city.upper())
            .replace("{state}", state)
            .replace("{review_count}", str(review_count))
            .replace("{service_areas_text}", service_areas_text))

    hero_eyebrow         = interpolate(d["hero_eyebrow"])
    hero_headline        = interpolate(d["hero_headline"])
    hero_headline_accent = d.get("hero_headline_accent", "")
    hero_subheadline     = interpolate(d["hero_subheadline"])
    trust_chips     = [interpolate(c) for c in d["trust_chips"]]

    if license_no:
        trust_chips = [license_no if "Licensed" in c else c for c in trust_chips]

    faq = [{"q": interpolate(f["q"]), "a": interpolate(f["a"])} for f in d["faq"]]

    return {
        "meta": {
            "title": f"{biz_name} | Roofing Contractor in {city}, {state}",
            "description": f"Licensed roofing contractor in {city}. Free inspections, same-day estimates, {review_count}+ 5-star reviews. Call {phone}.",
        },
        "company": {
            "name":          biz_name,
            "shortName":     short_name,
            "tagline":       d["tagline"],
            "url":           f"https://www.{prospect_slug(biz_name)}.com",
            "licenseNumber": license_no,
            "legalName":     biz_name,
            "description":   f"Licensed roofing contractor serving {city} and the surrounding {state} area.",
            "serviceRegion": f"{city}, {state}",
        },
        "contact": {
            "phone":         phone,
            "phoneTelLink":  tel_link,
            "email":         f"info@{prospect_slug(biz_name)}.com",
            "address":       None,
            "hours":         "Mon-Fri 7am-6pm",
            "googleMapsUrl": None,
            "mapsEmbedUrl":  None,
        },
        "address": {
            "street": "",
            "city":   city,
            "state":  state,
            "zip":    "",
            "full":   f"{city}, {state}",
            "lat":    None,
            "lng":    None,
        },
        "hours": {
            "weekday": {
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                "opens":  "07:00",
                "closes": "18:00",
            },
            "saturday":     None,
            "display":      [{"label": "Mon - Fri", "value": "7:00 AM - 6:00 PM"}],
            "emergencyBadge": "24/7 Emergency Service",
        },
        "businessHours": {"tz": "America/New_York", "open": "07:00", "close": "18:00"},
        "social": {"facebook": None, "facebookReviews": None, "instagram": None, "linkedin": None, "youtube": None},
        "team": {
            "founder": {
                "name":        owner_name or "The Owner",
                "displayName": (owner_name or "The Owner").split()[0],
                "title":       "Owner",
                "yearsExp":    "10+",
                "expLabel":    f"years roofing {city}",
            },
            "founders": [],
        },
        "team_group_photo": None,
        "team_members":     gallery["team_members"],
        "theme_mode":       "light",
        "voice_register":   "direct",
        "shape_motif":      "angular",
        "corner_overlay":   {"motif": "angular", "color": "#5AB4AE", "opacity": 0.08},
        "palette": {
            "primary":      "#5AB4AE",
            "primary_dark": "#4AA09A",
            "primary_slate":"#2D7874",
            "accent":       "#F59E0B",
            "accent_light": "#FDE68A",
            "accent_dark":  "#D97706",
            "neutral":      "#627280",
            "neutral_dim":  "#8FA0AD",
            "silver":       "#E2E6EA",
            "ink":          "#1D2B38",
        },
        "typography": {
            "heading":        "Barlow Condensed",
            "body":           "Inter",
            "accent":         "Cormorant Garamond",
            "headingFontUrl": "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&display=swap",
            "bodyFontUrl":    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
            "accentFontUrl":  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500;1,600&display=swap",
        },
        "reviews": {
            "rating":           rating,
            "googleCount":      review_count,
            "facebookCount":    0,
            "totalReviewCount": review_count,
            "googleLabel":      "Google Reviews",
            "facebookLabel":    "Facebook Reviews",
            "googleStat":       f"{rating} stars on Google",
            "facebookStat":     "",
            "googleUrl":        None,
            "items":            p.get("reviews", []),
        },
        "services":        services,
        "serviceAreas":    service_areas,
        "service_areas":   service_areas,
        "trust_badges":    [],
        "press_logos":     [],
        "previous_projects": gallery["previous_projects"],
        "copy": {
            "hero": {
                "eyebrow":        hero_eyebrow,
                "headline":       hero_headline,
                "headlineAccent": hero_headline_accent,
                "subheadline":    hero_subheadline,
                "imageAlt":       f"Roofing crew working on a {city} home",
            },
            "heroTrustChips": trust_chips,
            "trustClaims":    [
                "No pressure. No upsell.",
                "Cleanup every day.",
                "Done in one day for most roofs.",
                "We work with your insurance adjuster.",
            ],
            "formHeader":        "Get Your Free Estimate",
            "formSubtext":       "Most estimates delivered within 24 hours. No pressure.",
            "buttonText":        {"getEstimate": "Get Free Estimate", "callNow": "Call Now"},
            "submitButton":      "Send My Estimate Request",
            "privacyLine":       "Your info is never shared. No spam.",
            "mobileCallLabel":   "Call for a Free Estimate",
            "availableNow":      "Available Now",
            "footerCta":         "Ready to fix your roof?",
            "copyright":         f"{biz_name}. All rights reserved.",
            "topBar":            {"cta": f"Free Estimates -- Call {phone}"},
            "blog":              {"label": "Roofing Tips", "heading": f"Helpful Guides for {city} Homeowners", "body": "Straight answers on roofing costs, insurance claims, and what to expect.", "featuredLabel": "Featured"},
            "cta":               {"label": "Get Started", "heading": "Ready for a Roof You Can Count On?", "body": "Free estimate. No pressure. Most jobs completed in one day."},
            "faq":               {"label": "Common Questions", "heading": "Answers Before You Call"},
            "founder":           {"label": "Who We Are", "heading": f"Roofing {city} Homes Right", "para1": f"{biz_name} serves {city} homeowners with honest roofing work.", "para2": "We clean up every day and do not leave until the job is right.", "visionLabel": "Our Standard", "vision": "Every roof we touch is one a homeowner can trust for 20 years.", "missionLabel": "Our Promise", "mission": "No pressure. No upsell. Honest work at a fair price."},
            "gallery":           {"label": "Our Work", "heading": "Before and After -- Real Jobs", "body": "Every photo is a real job. Real results."},
            "offers":            {"label": "Current Offer", "heading": "Free Roof Inspection", "body": "Full inspection, photo documentation, written report. No charge.", "detail": "No obligation."},
            "process":           {"label": "How It Works", "heading": "Simple. No Surprises.", "body": "Four steps from first call to finished roof.", "badgeText": "1-Day", "badgeSubtext": "Most replacements"},
            "reviews":           {"label": "What Homeowners Say", "heading": f"{review_count} Homeowners Can't Be Wrong" if review_count else "What Homeowners Say", "body": f"Real reviews from real {city} homeowners.", "summary": f"{rating} stars across {review_count} Google reviews"},
            "serviceAreaCard":   {"heading": "Serving Your Neighborhood", "body": f"We cover {city} and the surrounding {state} area."},
            "serviceAreas":      {"label": "Where We Work", "heading": f"Roofing {city} and Surrounding Areas", "body": service_areas_text},
            "services":          {"label": "What We Do", "heading": "Full Roofing Services", "body": "Replacement, repair, storm damage, and insurance claims."},
            "whyChoose":         {"label": "Why Us", "heading": "What Sets Us Apart", "body": "Local, licensed, and we do not cut corners."},
            "insurance":         {"label": "Insurance Claims", "heading": "We Handle the Hard Part", "body": "Storm damage is stressful. We guide you through the entire insurance claim process.", "bullets": d["insurance_bullets"], "ctaText": "Start My Insurance Claim", "stat1Value": "94%", "stat1Label": "of claims approved", "stat2Value": "$0", "stat2Label": "out of pocket for most clients"},
            "finalCta":          {"label": "Get Started Today", "heading": "Free Estimate. No Pressure.", "subtext": f"Call us or fill out the form. Most estimates back within 24 hours.", "footnote": None},
            "footer":            {"tagline": "Licensed. Local. Done Right."},
            "about":             {"subtext": f"Serving {city} homeowners.", "storyHeading": "Built on Honest Work", "storyParagraphs": [f"{biz_name} serves {city} with honest roofing work at a fair price."]},
        },
        "process_steps":   d["process_steps"],
        "why_choose_us":   d["why_choose_us"],
        "special_offers":  [{"label": "Free Inspection", "description": "Full roof inspection with written report. No charge, no obligation."}],
        "faq":             faq,
        "blog_posts":      [],
        "blog_categories": [],
        "location_pages":  [],
        "pages":           {"about": {}, "serviceAreas": {}, "locationDetail": {}, "blogPost": {}, "blog": {}, "contact": {}, "services": {}, "financing": {}},
        "credit":          {"agency": "Built by Cortexa Labs", "url": None},
    }


# ── Write brand-dna.js ───────────────────────────────────────────────────────

def write_brand_dna(template_path: Path, data: dict) -> Path:
    brand_dna_path = template_path / "src" / "config" / "brand-dna.js"
    js = "export const brandDNA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n\nexport default brandDNA;\n"
    brand_dna_path.write_text(js, encoding="utf-8")
    return brand_dna_path


# ── Save prospect ────────────────────────────────────────────────────────────

def save_prospect(p: dict, brand_dna: dict) -> Path:
    week = current_week_label()
    slug = prospect_slug(p["business_name"])
    folder = PROSPECTS_DIR / week / slug
    folder.mkdir(parents=True, exist_ok=True)

    (folder / "prospect.json").write_text(
        json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    js = "export const brandDNA = " + json.dumps(brand_dna, indent=2, ensure_ascii=False) + ";\n\nexport default brandDNA;\n"
    (folder / "brand-dna-snapshot.js").write_text(js, encoding="utf-8")

    return folder


# ── List saved prospects ─────────────────────────────────────────────────────

def list_prospects():
    if not PROSPECTS_DIR.exists() or not any(PROSPECTS_DIR.iterdir()):
        print("No prospects saved yet.")
        return
    for week_dir in sorted(PROSPECTS_DIR.iterdir()):
        if not week_dir.is_dir() or week_dir.name.startswith("_"):
            continue
        prospects = [p for p in week_dir.iterdir() if p.is_dir()]
        if not prospects:
            continue
        print(f"\nWeek {week_dir.name} ({len(prospects)} prospects):")
        for p in sorted(prospects):
            pjson = p / "prospect.json"
            if pjson.exists():
                data = json.loads(pjson.read_text(encoding="utf-8"))
                name   = data.get("business_name", p.name)
                city   = data.get("city", "")
                state  = data.get("state", "")
                count  = data.get("review_count", 0)
                rating = data.get("rating", 0)
                print(f"  {p.name}  |  {name}  |  {city}, {state}  |  {count} reviews @ {rating}*")
            else:
                print(f"  {p.name}")


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    args = sys.argv[1:]

    if "--list" in args:
        list_prospects()
        return

    # Load prospect data
    if args and not args[0].startswith("--"):
        src = Path(args[0])
        if not src.exists():
            print(f"ERROR: File not found: {src}")
            sys.exit(1)
        p = json.loads(src.read_text(encoding="utf-8"))
        print(f"Loaded prospect from {src}")
    else:
        p = collect_prospect_interactive()

    if not p.get("business_name"):
        print("ERROR: business_name is required.")
        sys.exit(1)

    niche = p.get("niche", "roofing")

    # Resolve template
    try:
        template_path = get_template_path(niche)
    except (FileNotFoundError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    # Build and write brand-dna
    brand_dna = build_brand_dna(p, template_path)
    written   = write_brand_dna(template_path, brand_dna)

    # Save prospect permanently
    saved_folder = save_prospect(p, brand_dna)

    gallery_count = len(brand_dna.get("previous_projects", []))
    print(f"\n  Business : {p['business_name']}")
    print(f"  City     : {p.get('city', '')+', '+p.get('state', '')}")
    print(f"  Reviews  : {p.get('review_count', 0)} @ {p.get('rating', '')} stars")
    print(f"  Template : {template_path.name}")
    print(f"  Gallery  : {gallery_count} photos loaded from shared assets")
    print(f"  Saved to : {saved_folder.relative_to(ROOT)}")
    print(f"  brand-dna: {written.relative_to(ROOT)}")
    print()
    print("  Dev server hot-reloads automatically.")
    print("  Record your Loom, then load the next prospect.")
    print()
    print(f"  To reload this prospect later:")
    print(f"    python tools/load-mockup.py {saved_folder.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
