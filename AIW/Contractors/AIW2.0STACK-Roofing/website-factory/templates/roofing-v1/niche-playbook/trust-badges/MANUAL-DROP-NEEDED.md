# Trust Badge Assets -- Manual Drop Needed

The following badge SVGs or PNGs must be sourced and dropped into this folder before Stage 10.3 (Uplift).

## Required per client

These come from the client's actual certifications. Stage 2 research surfaces whether the client has them.

| Badge | File name | Where to get it |
|---|---|---|
| GAF Certified Contractor | `gaf-certified.svg` | Download from GAF's contractor portal after confirming client's certification number |
| BBB Accreditation | `bbb-a-plus.svg` | Download from BBB's badge library using the client's accreditation |

## Optional

| Badge | File name | Notes |
|---|---|---|
| Owens Corning Preferred | `owens-corning-preferred.svg` | Only if client is OC certified |
| CertainTeed SELECT ShingleMaster | `certainteed-select.svg` | Only if client is SELECT level or above |
| Angi Super Service Award | `angi-super-service.svg` | Only if client has current year award |

## What happens if badges are missing

Components fall back to text equivalents (e.g., "GAF Certified" in a bordered text chip). The fallback is acceptable but weaker. Aim to have real badge assets for every client.

## Naming convention

`{badge-type}.{svg|png}` -- all lowercase, hyphens. Match the `imageFile` field in `brandDNA.trust_badges[]`.
