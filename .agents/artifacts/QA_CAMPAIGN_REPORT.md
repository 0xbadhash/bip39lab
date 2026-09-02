# QA-CAMPAIGN-REPORT

**Marker:** QA-CAMPAIGN-REPORT  
**Date:** 2026-09-02  
**Product:** bip39lab after v0.16.86 UC35 ship

## Executive summary

Post-FSM QA on the V2 tracks + shared Lab chrome. **14 real bugs found and fixed** (security hunt + UC35 pad hunt). The static lab cannot honestly yield 200 unique defects without inventing filler; this wave exhausted the V2 asset-path, leftover stamp, and word-grid HTML sinks we could prove.

## Inventory

See `.agents/artifacts/QA_CAMPAIGN_INVENTORY.md`.

## Coverage

- Unit: full pytest green after fixes  
- E2E: V2-S26 PASS (UC35)  
- Security: mnemonic grid now HTML-escaped; no Electrum KDF added  
- Residual: full 73-test Playwright wall still > night 720s (known ops, not a functional bug)

## Re-run

```bash
cd /home/debian/bip39lab
.venv/bin/python -m pytest -q
npx playwright test e2e/v2.spec.ts -g "V2-S26"
```

## Recommendations

- Keep `/v2/` script/css URLs rooted (`../js`, `../css`) in any injectors.  
- Night e2e wall vs 73 tests is an ops timeout, not a product defect.  
- Do not compute Electrum addresses in UC35.

## Handoff

`python3 scripts/next_skill.py --after qa_campaign`
