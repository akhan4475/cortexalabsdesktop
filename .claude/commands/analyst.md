Run the Analyst agent — YouTube analysis, competitor scanning, intelligence storage.

Usage: /analyst /analyze-video [url] [category] | /scan-competitor [name] [url] | /weekly-report | /search-intel [category] [keyword]

```bash
claude -p "$(cat agency-os/agents/05-analyst.md)" --print "$ARGUMENTS"
```
