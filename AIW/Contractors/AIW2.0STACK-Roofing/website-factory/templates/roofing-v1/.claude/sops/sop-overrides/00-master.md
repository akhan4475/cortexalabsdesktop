# Roofing Niche -- SOP Overrides Master

These overrides apply to every pipeline stage for roofing clients. They supplement (not replace) the universal SOPs at `website-factory/.claude/sops/`.

## Copy overrides

- Apply `copywriting.md` voice contract at Stage 6. The copy agent must read it before writing a single line.
- Apply `copy-locks.json` verbatim locks. The 4 locked lines cannot be paraphrased.
- Apply `vocabulary.json` preferred/avoid lists throughout all copy stages.

## Trust override

- License number is mandatory in TrustBar and Footer. If Stage 2 research returns no license number, halt Stage 6 and flag it. A roofing site without a visible license number will fail the QA checklist.
- At least one before/after photo pair is required before Stage 10.3. If Stage 4 produced none, log a warning but do not halt -- the fallback placeholders hold.

## CRO override

- Phone number must be a `tel:` link. Plain text phone numbers fail the SOP QA.
- EstimateForm must appear within the first 3 sections on the home page. Position 2 (after TrustBar) is canonical.
- MobileStickyBar renders on all pages. Do not suppress it.

## Insurance section override

- InsuranceSection includes the chatbot anchor `id="chatbot"`. The Voiceflow embed placeholder is present in the component. At Stage 10.3 uplift, if the client has a Voiceflow widget ID in brand-dna, replace the placeholder div with the actual embed script.

## Hero image override

- Stage 9 generates the hero using the `hero-mood-mapping.json` composition spec and the `nano-banana` skill.
- Prompt must include: low-angle roofline, real job site, crew visible (not posed), golden hour or overcast lighting.
- The overlay is applied via CSS (not baked into the image). Do not ask Stage 9 to apply the overlay.
