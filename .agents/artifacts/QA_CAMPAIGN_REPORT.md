# QA-CAMPAIGN-REPORT

**Marker:** QA-CAMPAIGN-REPORT  
**Date:** 2026-08-11  
**Product:** bip39lab (offline BIP-39 lab)  
**Baseline release:** v0.16.0  
**Campaign type:** post-ship explicit `/qa_campaign`  

## Executive summary

| | |
|--|--|
| Bugs found | **6** (all real) |
| Bugs fixed | **6** |
| Residual open | **0** in-scope |
| ≥200 target | **Not applicable** — product is a static offline lab (~30k LOC incl. vendored bundles). Campaign **exhausted** applicable surfaces rather than inventing filler. |
| Baseline | pytest 88→91 · Playwright S-ids 86→87 · check_web_e2e ok |
| Pipeline | **unchanged** (`init`) — QA does not ship/tag |

## Severity distribution

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 2 (quizReturn consistency; hour vs quiz dock) |
| P2 | 4 (fees, satsToBtc, entropy dock noise, S70 coverage) |

## Inventory (root cause → fix)

See `.agents/artifacts/QA_CAMPAIGN_INVENTORY.md` rows QA-001…QA-006.

### Highest impact: quizReturn drift (QA-001/002)

When Intermediate/Advanced paths landed, LearnLevels began writing `sessionStorage bip39lab.quizReturn = "quiz"|"intquiz"|"advquiz"`, but:

- Entropy pad / Q1 dock in `app.js` only treated `"1"` as active  
- First-hour resume treated any non-`"1"` as “quiz inactive,” so hour dock could appear over Intermediate return  
- Shamir `markQ2AndReturn` still wrote `"1"`

**Fix:** single predicate `isQuizReturnValue` + aligned writers; keep legacy `"1"` for old sessions.

### Network fee math (QA-003/004)

`exampleFeeSats` / `satsToBtc` could surface `NaN` or fake zero BTC for null. Guarded and UI shows `—` / unavailable copy.

### Entropy dock thrash (QA-005)

Dock opened on every dice event even outside Guided quiz, forcing “Back to Guided quiz” chrome for Intermediate Tools users. Dock now opens only for quiz return or Q3/Q4 readiness.

## Coverage matrix

Documented in inventory. Out of scope (honest): stress, chaos, multi-node concurrency, OpenAPI contracts, observability backends.

## Residual risks / not fully exercised

1. Live mempool.space rate limits / 429 on public Network (ops, not offline crypto).  
2. Full BIP-85 crypto still educational stub (product scope).  
3. SLIP-39 / Shamir under adversarial share corruption beyond existing under-threshold tests.  
4. Multi-tab localStorage races (classroom prefs only).  

## Recommendations

1. Keep `tests/test_quiz_return_keys.py` green on any classroom dock change.  
2. Prefer mode strings (`quiz|intquiz|advquiz`) over magic `"1"` in new code.  
3. Rebuild `network.bundle.js` only via the historical IIFE shape (or document esbuild flags) — global-name esbuild breaks `NetworkApi` shape.  
4. Optional follow-up: Mark I1–I3 on external docks (today Back + Mark on Lab).  

## Re-run commands

```bash
cd /home/debian/bip39lab
.venv/bin/python -m pytest -q
npx playwright test
.venv/bin/python scripts/check_web_e2e.py --root .
.venv/bin/python scripts/product_smoke.py --root .
```

## Handoff

```text
✅ QA-CAMPAIGN DONE  found=6  fixed=6  residual=0
NEXT_SKILL=(done)
```
