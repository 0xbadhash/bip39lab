# RELEASE_RUNBOOK — v0.1.0 (Phase 0)

## Smoke

| Step | Command | Result |
|------|---------|--------|
| unit | `python -m pytest -q` | exit 0 (17 passed) |
| product_smoke | `python scripts/product_smoke.py --root .` | exit 0 |
| compliance | `python scripts/compliance_engine.py` | exit 0 |

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | ok |
| smoke | ok |
| pytest | 17 passed |
| pr_validator | score 100 → approved |

## Infra

None (offline CLI product).

## Rollback

`git checkout v0.1.0^` or previous tag; remove `src/bip39lab` if needed.

## §9

See PR_DRAFT.md things_that_look_bad_but_are_fine (≥3).
