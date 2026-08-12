# QA-CAMPAIGN-REPORT

**Marker:** QA-CAMPAIGN-REPORT  
**Date:** 2026-08-12  
**Product:** bip39lab v0.16.1  
**Stop:** exhausted (static offline lab; real bugs only)

## Executive summary

| | |
|--|--|
| Found | **4** |
| Fixed | **4** |
| Residual | **0** |
| Baseline | 96 pytest · 89/90 e2e (S70 fail) · web_e2e fail S40b |
| After | S70 green · learn 11/11 · check_web_e2e ok (90 S-ids) |

## Highest impact: QA-201 (S70)

Classroom shells now load `learn-levels.js`. Lab-return handlers for `?from=intquiz` ran on Multisig, cleared the query string via `replaceState` **before** `multisig-app.js` could show the dock.  

**Fix:** only apply Lab return navigation/strip on the Lab index page (`isLabIndexPage()`).

## Other fixes

- Comet **S40b** documented for Classroom sidebar panel  
- Passphrase strength display avoids `~0 bits`; clear resets bar  

## Out of scope / residual risks

- Live mempool 404 for balance in local playwright proxy (pre-existing; S13c still validates statuses)  
- Full BIP-85 crypto still educational stub  
- Multi-tab localStorage races  

## Re-run

```bash
.venv/bin/python -m pytest -q
npx playwright test
.venv/bin/python scripts/check_web_e2e.py --root .
```

```text
✅ QA-CAMPAIGN DONE  found=4  fixed=4  residual=0
NEXT_SKILL=(done)
```
