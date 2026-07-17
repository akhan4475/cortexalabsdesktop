#!/usr/bin/env python3
"""Custom screenshot capture with UA override to bypass WAF blocking
default/stale Chromium UAs (Linux desktop UA or Chrome 110/120 builds)."""
import sys
import os
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36")

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080},
    "mobile": {"width": 375, "height": 812},
}

def capture(url, out_path, viewport_name, full_page=False, timeout=30000):
    vp = VIEWPORTS[viewport_name]
    result = {"url": url, "viewport": viewport_name, "success": False, "error": None}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                device_scale_factor=2 if viewport_name == "mobile" else 1,
                user_agent=UA,
            )
            page = context.new_page()
            resp = page.goto(url, wait_until="networkidle", timeout=timeout)
            result["status"] = resp.status if resp else None
            page.wait_for_timeout(1500)
            page.screenshot(path=out_path, full_page=full_page)
            result["success"] = True
            browser.close()
    except PWTimeout:
        result["error"] = f"Timeout after {timeout}ms"
    except Exception as e:
        result["error"] = str(e)
    return result

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--output", "-o", required=True)
    ap.add_argument("--viewport", "-v", choices=VIEWPORTS.keys(), default="desktop")
    ap.add_argument("--full", "-f", action="store_true")
    args = ap.parse_args()
    r = capture(args.url, args.output, args.viewport, full_page=args.full)
    print(r)
    if not r["success"]:
        sys.exit(1)
