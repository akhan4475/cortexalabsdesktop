#!/usr/bin/env python3
"""
Module 2D, Phase 2: Capture niche candidate sites via Apify playwright-scraper.

Reads research/02-niche-research/{research_folder}/templates/candidates.json.
For each candidate runs apify/playwright-scraper at desktop (1440x900) and
mobile (390x844). Saves per-site outputs to:
  research/02-niche-research/{research_folder}/templates/raw/{site-slug}/
    desktop/screenshot.png, dom.html, colors.json, fonts.json, result.json
    mobile/screenshot.png, dom.html, colors.json, fonts.json, result.json

Usage:
    py tools/capture-niche-sites.py \
        --research-folder pool-gutter \
        --niche-slug pool-services \
        [--skip-existing] [--cost-cap 8.0]
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ENV_PATH = REPO_ROOT / ".env.local"
API_BASE = "https://api.apify.com/v2"
ACTOR_ID = "apify~playwright-scraper"
MAX_POLL_SEC = 300
POLL_INTERVAL = 6
MAX_RETRIES = 3
DEFAULT_COST_CAP = 8.0


def load_env():
    if not ENV_PATH.exists():
        sys.exit(f"ERROR: .env.local not found at {ENV_PATH}")
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def get_token():
    token = os.environ.get("APIFY_TOKEN") or os.environ.get("APIFY_API_TOKEN")
    if not token:
        sys.exit("ERROR: APIFY_TOKEN not set in .env.local")
    return token


def http_post(url, body, token):
    req = Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())


def http_get_json(url, token):
    req = Request(url, headers={"Authorization": f"Bearer {token}"})
    with urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())


def http_get_bytes(url, token):
    req = Request(url, headers={"Authorization": f"Bearer {token}"})
    with urlopen(req, timeout=120) as resp:
        return resp.read()


def build_input(url, viewport_width, viewport_height):
    page_fn = (
        "async function pageFunction(context) {"
        "  const { page, request } = context;"
        "  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});"
        "  const html = await page.content();"
        "  const colors = await page.evaluate(() => {"
        "    const counts = {};"
        "    document.querySelectorAll('*').forEach(el => {"
        "      const s = getComputedStyle(el);"
        "      [s.color, s.backgroundColor, s.borderColor].forEach(c => {"
        "        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent')"
        "          counts[c] = (counts[c]||0)+1;"
        "      });"
        "    });"
        "    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,20);"
        "  });"
        "  const fonts = await page.evaluate(() =>"
        "    Array.from(document.fonts).map(f => ({ family: f.family, weight: f.weight, style: f.style }))"
        "  );"
        "  return { html, colors, fonts, url: request.url };"
        "}"
    )
    return {
        "startUrls": [{"url": url}],
        "linkSelector": "",
        "pageFunction": page_fn,
        "launchContext": {"useChrome": True, "stealth": True},
        "preNavigationHooks": (
            f"[async ({{ page }}) => {{ await page.setViewportSize({{ width: {viewport_width}, height: {viewport_height} }}); }}]"
        ),
        "saveSnapshots": True,
        "snapshotterOptions": {"fullPageScreenshot": True},
    }


def start_run(run_input, token):
    url = f"{API_BASE}/acts/{ACTOR_ID}/runs"
    resp = http_post(url, run_input, token)
    run = resp.get("data", {})
    run_id = run.get("id")
    if not run_id:
        raise RuntimeError(f"Failed to start run: {resp}")
    return run_id


def poll_run(run_id, token):
    elapsed = 0
    while elapsed < MAX_POLL_SEC:
        time.sleep(POLL_INTERVAL)
        elapsed += POLL_INTERVAL
        resp = http_get_json(f"{API_BASE}/actor-runs/{run_id}", token)
        run = resp.get("data", {})
        status = run.get("status")
        print(f"  [{elapsed}s] status={status}", flush=True)
        if status == "SUCCEEDED":
            return run
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            raise RuntimeError(f"Run {status}: {run.get('statusMessage')}")
    raise TimeoutError(f"Run {run_id} did not finish in {MAX_POLL_SEC}s")


def get_dataset_items(dataset_id, token):
    url = f"{API_BASE}/datasets/{dataset_id}/items"
    data = http_get_json(url, token)
    return data if isinstance(data, list) else []


def get_screenshot(kv_store_id, token):
    keys_url = f"{API_BASE}/key-value-stores/{kv_store_id}/keys"
    keys_data = http_get_json(keys_url, token)
    keys = [r["key"] for r in keys_data.get("items", [])]
    # Find screenshot keys: SNAPSHOT- or SCREENSHOT- prefixed
    screenshot_keys = [k for k in keys if re.match(r"(SNAPSHOT|SCREENSHOT)-", k, re.IGNORECASE)]
    if not screenshot_keys:
        print(f"  WARNING: No screenshot key found in KV store {kv_store_id}. Keys: {keys}", flush=True)
        return None
    # Prefer the last snapshot (usually the full page one)
    key = screenshot_keys[-1]
    record_url = f"{API_BASE}/key-value-stores/{kv_store_id}/records/{key}"
    return http_get_bytes(record_url, token)


def estimate_cost(run):
    usage = run.get("usage", {})
    for k in ("totalUsd", "computeUnitsUsd"):
        if k in usage:
            try:
                return float(usage[k])
            except (TypeError, ValueError):
                pass
    cu = (run.get("stats") or {}).get("computeUnits") or 0
    try:
        return float(cu) * 0.25
    except (TypeError, ValueError):
        return 0.0


def capture_one(url, slug, out_dir, viewport_w, viewport_h, token):
    """Run playwright-scraper for one URL + viewport. Save results to out_dir."""
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"  Capturing {url} @ {viewport_w}x{viewport_h} ...", flush=True)

    run_input = build_input(url, viewport_w, viewport_h)
    last_err = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            run_id = start_run(run_input, token)
            print(f"  run_id={run_id}", flush=True)
            run = poll_run(run_id, token)

            dataset_id = run.get("defaultDatasetId")
            kv_store_id = run.get("defaultKeyValueStoreId")
            cost = estimate_cost(run)

            items = get_dataset_items(dataset_id, token) if dataset_id else []
            item = items[0] if items else {}

            # Save result.json
            (out_dir / "result.json").write_text(json.dumps({"run_id": run_id, "cost_usd": cost, "items": items}, indent=2))

            # Save dom.html
            if item.get("html"):
                (out_dir / "dom.html").write_text(item["html"], encoding="utf-8")

            # Save colors.json
            if item.get("colors"):
                (out_dir / "colors.json").write_text(json.dumps(item["colors"], indent=2))

            # Save fonts.json
            if item.get("fonts"):
                (out_dir / "fonts.json").write_text(json.dumps(item["fonts"], indent=2))

            # Save screenshot
            if kv_store_id:
                png = get_screenshot(kv_store_id, token)
                if png:
                    (out_dir / "screenshot.png").write_bytes(png)
                    print(f"  screenshot saved ({len(png)//1024}KB)", flush=True)
                else:
                    print("  WARNING: screenshot not retrieved", flush=True)

            print(f"  done. cost=${cost:.4f}", flush=True)
            return cost

        except (HTTPError, URLError, RuntimeError, TimeoutError) as e:
            last_err = e
            if attempt < MAX_RETRIES:
                wait = 10 * (2 ** (attempt - 1))
                print(f"  [attempt {attempt} failed] {e} -- retrying in {wait}s", flush=True)
                time.sleep(wait)
            else:
                print(f"  FAILED after {MAX_RETRIES} attempts: {e}", flush=True)
                (out_dir / "CAPTURE-FAILED.txt").write_text(f"Error: {last_err}\n")
                return 0.0


def main():
    parser = argparse.ArgumentParser(description="Module 2D Phase 2: capture niche candidate sites")
    parser.add_argument("--research-folder", required=True, help="e.g. pool-gutter")
    parser.add_argument("--niche-slug", required=True, help="e.g. pool-services")
    parser.add_argument("--skip-existing", action="store_true", help="Skip sites that already have screenshot.png")
    parser.add_argument("--cost-cap", type=float, default=DEFAULT_COST_CAP, help="Halt if total cost exceeds this USD amount")
    parser.add_argument("--only", help="Comma-separated list of site slugs to capture (for partial runs)")
    args = parser.parse_args()

    load_env()
    token = get_token()

    research_dir = REPO_ROOT / "research" / "02-niche-research" / args.research_folder
    candidates_file = research_dir / "templates" / "candidates.json"
    if not candidates_file.exists():
        sys.exit(f"ERROR: candidates.json not found at {candidates_file}")

    candidates = json.loads(candidates_file.read_text())["candidates"]
    only_slugs = [s.strip() for s in args.only.split(",")] if args.only else None
    if only_slugs:
        candidates = [c for c in candidates if c["slug"] in only_slugs]

    raw_dir = research_dir / "templates" / "raw"
    cost_log = research_dir / "templates" / "capture-cost.json"

    total_cost = 0.0
    results = []

    for c in candidates:
        slug = c["slug"]
        url = c["url"]
        print(f"\n=== {slug} ({url}) ===", flush=True)

        site_dir = raw_dir / slug

        for viewport_label, vw, vh in [("desktop", 1440, 900), ("mobile", 390, 844)]:
            out_dir = site_dir / viewport_label
            screenshot_path = out_dir / "screenshot.png"

            if args.skip_existing and screenshot_path.exists():
                print(f"  [{viewport_label}] skipping -- screenshot exists", flush=True)
                continue

            if total_cost >= args.cost_cap:
                print(f"\nHALT: cost cap ${args.cost_cap} reached (total=${total_cost:.4f}). Stopping.", flush=True)
                break

            cost = capture_one(url, slug, out_dir, vw, vh, token)
            total_cost += cost
            results.append({"slug": slug, "viewport": viewport_label, "cost_usd": cost, "status": "done"})

            # Small pause between runs to avoid throttling
            time.sleep(3)

        else:
            continue
        break

    # Write cost log
    cost_log.write_text(json.dumps({
        "niche_slug": args.niche_slug,
        "total_cost_usd": round(total_cost, 4),
        "runs": results,
        "ts": int(time.time()),
    }, indent=2))

    print(f"\n=== Phase 2 complete. Total cost: ${total_cost:.4f} ===")
    print(f"Cost log: {cost_log}")

    # Update candidates.json status
    candidates_data = json.loads(candidates_file.read_text())
    candidates_data["status"] = "captured"
    candidates_data["capture_cost_usd"] = round(total_cost, 4)
    candidates_file.write_text(json.dumps(candidates_data, indent=2))


if __name__ == "__main__":
    main()
