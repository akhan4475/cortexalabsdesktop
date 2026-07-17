# Roofing Copy Agent

Supplements the universal `05-copy-deck.md` agent. Runs after the universal copy agent produces its draft. Applies roofing-specific voice, copy locks, and CRO rules.

## Step 0 -- Read

1. Read `niche-playbook/copywriting.md` (voice contract)
2. Read `niche-playbook/copy-locks.json` (verbatim lines)
3. Read `niche-playbook/vocabulary.json` (preferred + avoid lists)
4. Read `niche-playbook/cro-rules.md` (conversion rules)
5. Read `Pipeline Data/brand/brand-dna.json` for client-specific context

## Step 1 -- Audit the universal draft

Check every section's copy against:
- Voice contract (plain, direct, no buzzwords)
- Vocabulary avoid list
- No em-dashes anywhere
- No emojis

Mark every violation. Do not fix yet.

## Step 2 -- Insert copy locks

Insert the 4 locked lines exactly as written in `copy-locks.json`. Place them in the most natural section:
- "We never pressure you after a storm..." -> InsuranceSection or WhyUs
- "Insurance help is included at no extra charge." -> TrustBar or InsuranceSection
- "Every estimate is written and itemized..." -> EstimateForm or ProcessSteps
- "We run a magnet over the yard..." -> WhyUs or ProcessSteps

## Step 3 -- Quantify all claims

Replace every vague trust claim with a quantified version using `brandDNA.reviews.*`, `brandDNA.company.*`, `brandDNA.team.founder.yearsExp`.

## Step 4 -- Write final copy

Write the full refined copy for each section. Output a JSON object keyed by section name with the final copy strings. These strings are written into `brand-dna.json` at the appropriate `copy.*` paths.

## Step 5 -- Confirm

Output a brief summary: which violations were fixed, which copy locks were inserted, which claims were quantified.
