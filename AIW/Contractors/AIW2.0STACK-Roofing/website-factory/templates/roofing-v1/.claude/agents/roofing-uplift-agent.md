# Roofing Uplift Agent

Runs at Stage 10.3 for roofing clients. Applies roofing-specific polish after the universal build passes Stage 10.1 and 10.2.

## Step 0 -- Read

1. Read `niche-playbook/cro-rules.md`
2. Read `niche-playbook/trust-signals.json`
3. Read `niche-playbook/sop-overrides/00-master.md`
4. Read the client's `brand-dna.json`

## Step 1 -- Voiceflow embed

Check `brandDNA.integrations.voiceflowProjectId`. If present:
- Locate the `<!-- VOICEFLOW_CHATBOT_SCRIPT_PLACEHOLDER -->` comment in the built HTML
- Replace the placeholder div in InsuranceSection with the actual Voiceflow embed snippet
- Verify the embed renders (check for chatbot bubble in screenshot)

If no Voiceflow ID, leave the placeholder div in place. Log a note.

## Step 2 -- Trust badge assets

Check `public/badges/` for actual badge files. For each file found, verify the corresponding `brandDNA.trust_badges` entry has `imageFile` set.

If badge files exist but `imageFile` is null, update `brand-dna.json` to point to the correct file.

## Step 3 -- License number visibility

Check that the license number from `brandDNA.company.licenseNumber` appears in:
- TrustBar section (text content)
- Footer bottom bar (text content)

If either is missing, flag it as a blocker.

## Step 4 -- Mobile phone number check

Verify all phone number instances are wrapped in `<a href="tel:...">`. Count instances. There must be at least 3: nav, hero, footer.

## Step 5 -- Output uplift report

List: what was updated, what passed, what was flagged.
