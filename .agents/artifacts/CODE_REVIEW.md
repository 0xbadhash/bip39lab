# CODE-REVIEW

**Marker:** CODE-REVIEW  
**Command:** `/code_review` after Intermediate I1–I4 + Advanced A1–A4  
**Base:** `e82fabe` · **Head:** `dc17369`  
**Date:** 2026-08-11  

## Scope (review_scope)

- Non-prose code ship: `web/index.html`, `web/js/learn-levels.js`, multisig/shamir/slip39 dock hooks, e2e/unit/docs  
- `skip_heavy_review=false`  

## Secrets

```text
python3 scripts/check_secrets_diff.py --base e82fabe --head HEAD → clean
```

## Findings

### P0 (blockers)
**None.**

### Accepted
- N/A (no P0/P1 blockers)

### Rejected
- N/A

### Follow-ups (not blocking)
1. Optional Mark I1/I2/I3 on external docks (today: Back + Mark on Lab) — same as Network first-hour style.  
2. BIP-85 still idea-only (intentional / out of scope).  

## Smoke / tests run

| Check | Result |
|-------|--------|
| pytest `tests/test_int_adv_paths.py` | 4 passed (TDD red→green) |
| e2e `learn.spec.ts` S68/S69 | passed |
| product_smoke unit+e2e | passed |
| check_web_e2e | ok |

## Verdict

**p0=0** · Accept for `/pr_review --validate`.

```text
✅ CODE-REVIEW DONE  p0=0  follow_ups=2
```
