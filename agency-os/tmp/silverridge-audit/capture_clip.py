#!/usr/bin/env python3
import sys
from playwright.sync_api import sync_playwright

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36")

url = sys.argv[1]
out = sys.argv[2]
width = int(sys.argv[3])
height = int(sys.argv[4])
clip_h = int(sys.argv[5]) if len(sys.argv) > 5 else height

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": width, "height": height}, user_agent=UA)
    page = context.new_page()
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(1000)
    page.screenshot(path=out, clip={"x": 0, "y": 0, "width": width, "height": clip_h})
    browser.close()
print("done")
