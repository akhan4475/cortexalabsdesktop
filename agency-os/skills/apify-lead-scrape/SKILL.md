# Apify Lead Scrape Skill

## Purpose
Run the Apify Google Maps Scraper to pull contractor business listings into the leads table. This is Scout agent's primary lead-generation tool.

---

## Actor Details
- **Actor ID:** `nwua9Gu5YkAT85Sp` (Google Maps Scraper by Apify)
- **Apify API Token location:** `agency-os/tools/.env.local` → `APIFY_API_TOKEN`
- **API Base URL:** `https://api.apify.com/v2`

---

## Input Schema

```json
{
  "searchStringsArray": ["pool contractors near Dallas TX"],
  "maxCrawledPlacesPerSearch": 100,
  "language": "en",
  "maxImages": 0,
  "maxReviews": 5,
  "exportPlaceUrls": false,
  "additionalInfo": false,
  "scrapeReviewerPersonalData": false
}
```

### Key Parameters
| Parameter | Description | Recommended Value |
|---|---|---|
| `searchStringsArray` | List of search queries | `["<niche> near <city> <state>"]` |
| `maxCrawledPlacesPerSearch` | Max results per query | 100 (stay under 200 to control cost) |
| `maxReviews` | Reviews to scrape per listing | 5 (enough for scoring, cheap) |
| `maxImages` | Images per listing | 0 (not needed) |

---

## Niche Search String Templates

```
pool contractors near {city} {state}
roofing contractors near {city} {state}
landscaping contractors near {city} {state}
general contractors near {city} {state}
remodeling contractors near {city} {state}
```

Batch cities: run 3-5 cities per niche per day to stay under Apify free tier.

---

## Rate Limits & Cost Estimates
- Free tier: ~$5/month credit
- Google Maps Scraper: ~$0.50 per 1,000 results
- 100 results per search × 5 searches = ~$0.25
- Run max 2 batches/day on free tier
- Always check Apify usage dashboard before large runs

---

## How to Run (via API)

```bash
# Start a run
curl -X POST "https://api.apify.com/v2/acts/nwua9Gu5YkAT85Sp/runs?token=$APIFY_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "searchStringsArray": ["pool contractors near Dallas TX"],
    "maxCrawledPlacesPerSearch": 100,
    "maxReviews": 5,
    "maxImages": 0
  }'

# Check run status (use run ID from above response)
curl "https://api.apify.com/v2/actor-runs/{runId}?token=$APIFY_API_TOKEN"

# Get dataset results
curl "https://api.apify.com/v2/actor-runs/{runId}/dataset/items?token=$APIFY_API_TOKEN&format=json"
```

---

## Output → Leads Schema Mapping

Raw Apify output fields → `leads` table columns:

| Apify Field | Leads Column | Notes |
|---|---|---|
| `title` | `business_name` | Required |
| `phone` | `phone` | Clean to digits only |
| `website` | `website_url` | May be null |
| `address` | `address` | Full string |
| `city` | `city` | Parse from address if needed |
| `state` | `state` | Parse from address |
| `totalScore` | `google_rating` | Float, e.g. 4.3 |
| `reviewsCount` | `review_count` | Integer |
| `reviews` | `review_dates` | Extract as JSONB array of dates |
| `categoryName` | `niche` | Map to: pool/roofing/landscaping/construction/remodeling |
| `url` | `google_maps_url` | Full GMaps link |

### Derived Fields to Add
```python
{
  "pipeline_stage": "raw",          # Always start here
  "source": "apify_gmaps",
  "scraped_at": "ISO timestamp",
  "score": compute_lead_score(row)  # See scoring section below
}
```

---

## Lead Scoring Logic

Score leads 0-100 before inserting. Higher = better prospect.

```python
def compute_lead_score(lead: dict) -> int:
    score = 0

    # Rating: good rating signals real business, not too perfect
    rating = lead.get("google_rating", 0)
    if 3.5 <= rating <= 4.5:
        score += 25
    elif rating > 4.5:
        score += 15  # Too perfect, may be less hungry
    elif rating < 3.5:
        score += 5

    # Review count: enough to be real, not huge brand
    reviews = lead.get("review_count", 0)
    if 10 <= reviews <= 80:
        score += 25
    elif reviews > 80:
        score += 10
    elif reviews >= 5:
        score += 15

    # Recent reviews (within 180 days): signals active business
    recent = count_recent_reviews(lead.get("review_dates", []), days=180)
    if recent >= 3:
        score += 25
    elif recent >= 1:
        score += 15

    # No website: major pain point, our best prospect
    if not lead.get("website_url"):
        score += 25
    else:
        score += 5  # Has website but may be bad

    return min(score, 100)
```

---

## Deduplication Logic

Before inserting, check if lead already exists:

```python
# Via db.py — check by business_name + phone
existing = db_query("leads", "list", filters={
    "business_name": lead["business_name"],
    "phone": lead["phone"]
})
if existing:
    # Skip insert, optionally update scraped_at
    continue
```

Using db.py CLI:
```bash
# Check for existing lead by phone (manual approach)
python tools/db.py leads list pool 200
# Then grep output for matching phone/name before inserting
```

---

## Full Run Example (Scout Agent)

```bash
# 1. Set env
export APIFY_API_TOKEN=$(grep APIFY_API_TOKEN agency-os/tools/.env.local | cut -d= -f2)

# 2. Run scraper for pool contractors in Dallas
python agency-os/agents/scripts/apify_run.py \
  --niche pool \
  --cities "Dallas TX" "Houston TX" "Austin TX" \
  --max-per-search 100

# 3. Script handles: API call → poll for completion → fetch results → deduplicate → insert via db.py
```

---

## Error Handling

- If run fails: check `status` field in run response — `FAILED`, `TIMED-OUT`, `ABORTED`
- If 429 rate limit: wait 60s, retry once
- If actor not found: verify actor ID `nwua9Gu5YkAT85Sp` is still valid
- Log all runs via: `python tools/db.py log scout apify_scrape '{"leads_found": N, "inserted": M}'`
