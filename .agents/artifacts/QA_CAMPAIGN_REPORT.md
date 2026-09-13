# QA-CAMPAIGN-REPORT

**Marker:** QA-CAMPAIGN-REPORT  
**Date:** 2026-09-13  
**Product:** bip39lab on bip39.catalyxt.xyz after v0.16.88 / 0.17.137-v2  
**Brief:** `/tmp/qa-campaign-2026-09-13/BRIEF-W6-QA-CAMPAIGN-2026-09-13.md`

## Executive summary

Report-before-fix campaign on the static BIP-39 lab. Baseline **240 pytest green**. Held 2026-09-02 PASSes stay closed. **4 new defects** (3 HTML-sink escapes, 1 docs stamp). All 4 fixed with pytest locks. **E2E deferred** (no VERSION bump). Codebase **exhausted** honestly — not 200 filler bugs.

## Inventory

See `.agents/artifacts/QA_CAMPAIGN_INVENTORY.md`.

## Coverage

| Type | Result |
|------|--------|
| Unit | 242 passed |
| E2E | deferred |
| Security | copy/addr/glossary tip sinks escaped |
| Residual | uncommitted help-tip CSS already live via this tree; Playwright gated |

## Re-run

```bash
cd /home/debian/bip39lab
.venv/bin/python3 -m pytest -q
# E2E only if VERSION bumps:
# npx playwright test e2e/v2.spec.ts -g "V2-S1"
```

## Recommendations

- Keep display HTML on the same `escapeHtml` path as word grids.
- Do not reopen 2026-09-02 XSS/asset PASSes without a new FAIL.
- Next ship can commit help-tip CSS + this QA wave together if desired.

## Handoff

`python3 scripts/next_skill.py --after qa_campaign`
