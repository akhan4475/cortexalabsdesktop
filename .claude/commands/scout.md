Run the Scout agent — lead scraping, qualification, and Loom brief generation.

Usage: /scout /scrape [niche] [location] [count] | /qualify [lead_id] | /loom-brief [lead_id]

```bash
claude -p "$(cat agency-os/agents/01-scout.md)" --print "$ARGUMENTS"
```
