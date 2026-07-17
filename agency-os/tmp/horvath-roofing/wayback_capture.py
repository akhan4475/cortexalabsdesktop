#!/usr/bin/env python3
"""Capture Wayback Machine snapshots with the toolbar hidden, at multiple viewports."""
import sys
import os
from playwright.sync_api import sync_playwright

HIDE_CSS = """
#wm-ipp-base, #wm-ipp, #wm-ipp-print, .wm-ipp-base, #donato { display: none !important; }
html { margin-top: 0 !important; }
body { margin-top: 0 !important; }
"""

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080},
    "mobile": {"width": 375, "height": 812},
}

def capture(url, output_prefix, timeout=45000):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for vp_name, vp in VIEWPORTS.items():
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                device_scale_factor=2 if vp_name == "mobile" else 1,
            )
            page = context.new_page()
            try:
                page.goto(url, wait_until="networkidle", timeout=timeout)
            except Exception as e:
                print(f"  warning: networkidle wait failed for {vp_name}: {e}")
            page.wait_for_timeout(1500)
            page.add_style_tag(content=HIDE_CSS)
            page.wait_for_timeout(300)
            out_path = f"{output_prefix}_{vp_name}.png"
            page.screenshot(path=out_path, full_page=False)
            print(f"  saved {out_path}")
            # also full page for above-fold context on mobile menu check
            out_path_full = f"{output_prefix}_{vp_name}_full.png"
            page.screenshot(path=out_path_full, full_page=True)
            print(f"  saved {out_path_full}")
            context.close()
        browser.close()

if __name__ == "__main__":
    url = sys.argv[1]
    prefix = sys.argv[2]
    capture(url, prefix)
