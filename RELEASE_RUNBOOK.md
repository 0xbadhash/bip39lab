# RELEASE RUNBOOK — v0.5.0 (Phase 4 bitcoind balance)

**Date:** 2026-08-06  
**Pipeline score:** 100 (approved → shipped)  
**Spec:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance.md`

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 |
| validate | `python scripts/validate.py full` | 0 |
| product_smoke | `python scripts/product_smoke.py --root .` | 0 |

## Infra

None required (CLI library; no VPS).

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | ok (score 100) |
| smoke | pytest via product_smoke |
| pytest | 33 passed |
| validate | 5/5 gates |
| CODE-REVIEW / BEHAVIOR / CROSS-REVIEW | local artifacts |

## Version

- `VERSION` → `0.5.0`
- `pyproject.toml` → `0.5.0`
- Git tag: `v0.5.0`

## Rollback

```bash
git checkout v0.4.0
# or: git revert <release commit range>
```

## §9 Things that look bad but are fine

1. No live bitcoind in CI — mocked RPC contract.
2. scantxoutset is UTXO sum only, not lifetime received.
3. Public explorer path still present behind leak ack.

## Post

- Tag `v0.5.0` (local). Push tag/branch only when operator approves.
- `/sync_docs` → pipeline `init`.
