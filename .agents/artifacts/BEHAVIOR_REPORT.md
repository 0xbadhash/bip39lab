# BEHAVIOR-REPORT — GapFix Tools phrase source + teach clarity

**Marker:** BEHAVIOR-REPORT  
**Date:** 2026-08-09  
**Spec:** `.agents/specs/2026-08-09-gapfix-tools-phrase-source.md`  
**Surfaces:** Tools / Lab teach (`web/index.html`, `web/js/app.js`) — no secret retention  
**Method:** static contracts (`tests/test_tools_teach_copy.py`) + Playwright S17–S23 / S18c when e2e runs

## Contract clauses

| # | Clause | Result | Evidence |
|---|--------|--------|----------|
| 1 | Tools shows Phrase source + TEST DATA chip | pass | INDEX + test_tools_teach_copy |
| 2 | Compare/descriptors prefix `[TEST DATA]` or `[Lab phrase]` | pass | app.js + S18/S18b/S19 |
| 3 | Clear secrets notes next auto-gen TEST DATA | pass | clearSecrets + S18c |
| 4 | Entropy d6≈2.58 / coin=1 teach | pass | entPadMeta + S17 |
| 5 | Descriptor definition + Load example | pass | INDEX + btnDescExample + S22 |
| 6 | Lab G/D/?/Esc teach | pass | INDEX kbd + S23 |
| 7 | No secret retention / no new crypto | pass | copy-only + educational zpub |

## Runtime / black-box notes

- No network in path for this ship; address-only balance unchanged.
- Failure modes for balance remain **unknown**, not silent zero (out of scope for this GapFix).
