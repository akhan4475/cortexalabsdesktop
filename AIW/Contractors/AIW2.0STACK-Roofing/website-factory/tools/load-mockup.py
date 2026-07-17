#!/usr/bin/env python3
"""
load-mockup.py

Restores a saved prospect's brand-dna snapshot to the niche template
so the dev server shows that exact mockup again.

Usage:
    python tools/load-mockup.py mockup-prospects/6_23-6_29/abc-roofing-dallas/
    python tools/load-mockup.py --list

Use this when:
  - A prospect says yes and you want to re-record or hand off to /run-factory
  - You want to show the mockup again on a call

The prospect's JSON is also printed so you can copy it straight into
/run-factory's intake step.
"""

import json
import sys
from pathlib import Path

ROOT         = Path(__file__).parent.parent
ROUTES       = ROOT / "config" / "template-routes.json"
PROSPECTS_DIR = ROOT / "mockup-prospects"


def get_template_path(niche: str) -> Path:
    if not ROUTES.exists():
        raise FileNotFoundError(f"template-routes.json not found at {ROUTES}")
    routes = json.loads(ROUTES.read_text(encoding="utf-8"))
    by_niche = routes.get("byNiche", {})
    if niche not in by_niche:
        available = list(by_niche.keys())
        raise ValueError(f"No template for niche '{niche}'. Available: {available}")
    return ROOT / by_niche[niche]["templatePath"]


def list_prospects():
    if not PROSPECTS_DIR.exists() or not any(PROSPECTS_DIR.iterdir()):
        print("No prospects saved yet. Run quick-mockup.py first.")
        return
    print("\nSaved prospects:\n")
    for week_dir in sorted(PROSPECTS_DIR.iterdir()):
        if not week_dir.is_dir() or week_dir.name.startswith("_"):
            continue
        prospects = [p for p in week_dir.iterdir() if p.is_dir()]
        if not prospects:
            continue
        print(f"  Week {week_dir.name}:")
        for p in sorted(prospects):
            pjson = p / "prospect.json"
            if pjson.exists():
                data   = json.loads(pjson.read_text(encoding="utf-8"))
                name   = data.get("business_name", p.name)
                city   = data.get("city", "")
                state  = data.get("state", "")
                print(f"    {p.relative_to(ROOT)}  |  {name}, {city} {state}")
            else:
                print(f"    {p.relative_to(ROOT)}")
    print()


def main():
    args = sys.argv[1:]

    if not args or "--list" in args:
        list_prospects()
        return

    prospect_dir = Path(args[0])

    # Accept relative paths from ROOT or from CWD
    if not prospect_dir.is_absolute():
        if (ROOT / prospect_dir).exists():
            prospect_dir = ROOT / prospect_dir
        elif prospect_dir.exists():
            prospect_dir = prospect_dir.resolve()

    if not prospect_dir.exists():
        print(f"ERROR: Prospect folder not found: {prospect_dir}")
        print("Run 'python tools/load-mockup.py --list' to see saved prospects.")
        sys.exit(1)

    snapshot = prospect_dir / "brand-dna-snapshot.js"
    pjson    = prospect_dir / "prospect.json"

    if not snapshot.exists():
        print(f"ERROR: No brand-dna-snapshot.js found in {prospect_dir}")
        sys.exit(1)

    # Get niche from prospect.json
    niche = "roofing"
    if pjson.exists():
        p = json.loads(pjson.read_text(encoding="utf-8"))
        niche = p.get("niche", "roofing")

    # Resolve template
    try:
        template_path = get_template_path(niche)
    except (FileNotFoundError, ValueError) as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    # Write snapshot to template brand-dna.js
    dest = template_path / "src" / "config" / "brand-dna.js"
    dest.write_text(snapshot.read_text(encoding="utf-8"), encoding="utf-8")

    # Print prospect summary
    print(f"\nLoaded: {prospect_dir.name}")
    if pjson.exists():
        p = json.loads(pjson.read_text(encoding="utf-8"))
        print(f"  Business : {p.get('business_name', '')}")
        print(f"  City     : {p.get('city', '')}, {p.get('state', '')}")
        print(f"  Phone    : {p.get('phone', '')}")
        print(f"  Reviews  : {p.get('review_count', 0)} @ {p.get('rating', '')} stars")
        print(f"  Niche    : {niche}")
    print(f"\n  Wrote to : {dest.relative_to(ROOT)}")
    print("  Dev server hot-reloads automatically.\n")

    if pjson.exists():
        print("  ── Intake data for /run-factory ──────────────────────")
        print(f"  Business name : {p.get('business_name', '')}")
        print(f"  Phone         : {p.get('phone', '')}")
        print(f"  City          : {p.get('city', '')}")
        print(f"  State         : {p.get('state', '')}")
        print(f"  Service areas : {', '.join(p.get('service_areas', []))}")
        print(f"  License #     : {p.get('license_number') or '(not recorded)'}")
        print()


if __name__ == "__main__":
    main()
