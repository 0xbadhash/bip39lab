# RELEASE_RUNBOOK — v0.13.6 GapFix Tools phrase source + teach clarity

**Date:** 2026-08-10  
**Version:** 0.13.6  
**Spec:** `.agents/specs/2026-08-09-gapfix-tools-phrase-source.md`  
**PR score:** 100 (approved via `pr_validator.py --update-pipeline`)

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| product_smoke | `python3 scripts/product_smoke.py --root .` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| validate full | `python3 scripts/validate.py full` | 0 (5/5) |
| hard_gates | `python3 scripts/hard_gates.py --diff HEAD` | ok |

## Infra

No product infra surface for this ship — static web lab only. Skip INFRA_RUNBOOK.

## Evidence pack (B5)

| Item | Result |
|------|--------|
| hard_gates | ok (CODE-REVIEW, red-proof, BEHAVIOR, secrets clean, web_e2e S18c synced) |
| pytest | suite green via compliance_engine + smoke:unit |
| smoke | unit + e2e both exit 0 |
| validate | 5/5 gates passed |

## What shipped

- Tools Phrase source + TEST DATA labeling on compare/descriptors
- Clear secrets notes for next auto-gen TEST DATA (S18c)
- Entropy d6≈2.58 / coin=1 teach
- Descriptor definition + Load example
- Lab G/D/?/Esc keyboard teach

## Rollback

1. `git checkout v0.13.5 -- web/index.html web/js/app.js e2e/lab.spec.ts docs/E2E_COMET_SCENARIOS.md tests/test_tools_teach_copy.py` (or full tree revert to tag `v0.13.5`)
2. Restore VERSION/pyproject/package.json to 0.13.5 and re-stamp site version
3. Redeploy previous static assets to bip39.catalyxt.xyz

## Things that look bad but are actually fine

1. Auto-gen still fills Lab mnemonic — session-shared by design; provenance labels are the fix.
2. Educational zpub may fail checksum — format teach only.
3. BEHAVIOR_REPORT rewritten for this GapFix (prior jump-link ship already tagged v0.13.5).
