# Pool Services: Quantified Trust Templates

Quantified trust claims are critical for this niche. Pool service buyers are making a recurring purchase decision (weekly/monthly) and need to feel the provider is established and proven.

## Stat Templates

Fill with per-client data at Stage 5 (strategy) or Stage 6 (copy). Fallback values listed for placeholder use.

| Stat type | Template | Fallback display | Notes |
|---|---|---|---|
| Total pools served | `{N}+ pools serviced` | "100+ pools serviced" | Source from client intake or estimate |
| Years in business | `{N}+ years serving {region}` | "10+ years serving the area" | Client intake |
| Google rating | `{rating}-star rated on Google` | "5-star rated on Google" | brandDNA.reviews.rating |
| Google review count | `{N}+ Google reviews` | "50+ Google reviews" | brandDNA.reviews.googleCount |
| Response time | "Free quotes within {N} hours" | "Free quotes within 24 hours" | Client intake or copy-locks default |
| Satisfaction claim | "Satisfaction guaranteed or we return free" | same | Copy-locks locked phrase |

## Hero Trust Chip Order

Always render in this priority order in `heroTrustChips`:
1. Certification claim (e.g. "Licensed & Insured")
2. Google rating (e.g. "5-Star Google Rated")
3. Experience claim (e.g. "10+ Years in Business")
4. No-contract promise (e.g. "No Contracts Required")
5. Same-week scheduling (e.g. "Same-Week Scheduling")

Maximum 5 chips. Minimum 3. Never show a chip unless the supporting data is confirmed.

## Process Badge

The Process section includes a badge in the left panel. Template:
- `badgeText`: The satisfaction guarantee number or stat (e.g. "100%")
- `badgeSubtext`: "Satisfaction Guaranteed"

If no specific stat is available, the default is "100% / Satisfaction Guaranteed."

## Review Section Stat Block

Render above the review grid with two side-by-side stat blocks:
- Left: `{rating} / 5.0` + "Google Rating"
- Right: `{totalReviewCount}+` + "Reviews Across Platforms"

Use `tabular-nums` class on all numbers. Use `font-heading` for the number, `font-body text-xs` for the label.
