# PR Draft: v0.16.41 V2 Clear secrets topbar + Test/Mainnet

**Spec:** `.agents/specs/2026-08-24-v2-clear-net.md`
**Plan:** `.agents/specs/2026-08-24-v2-clear-net-plan.md`

## What Problem This Solves

Clear secrets was only on some pads. Validate always used testnet.

## Why This Change Was Made

Operator asked Clear secrets right-aligned on all tracks, and Test/Mainnet beside Validate & Derive.

## User Impact

Red Clear secrets stays in the V2 header. Network dropdown: Test · tb1… / Mainnet · bc1…. Chip v0.17.23-v2.

## Traceability

| AC | Test |
|----|------|
| AC-1 topbar clear | V2-S0 |
| AC-2 net tb1/bc1 | V2-S4 |
| AC-3 classic `/` | V2-S0 |
| AC-4 pytest | `.venv/bin/python -m pytest -q` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

TDD N/A: chrome move after operator ask.

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT; V2 Playwright 14; pytest; hard_gates.

## Things that look bad but are actually fine

1. Classic full e2e not all-green.
2. leftover `scripts/*.py` uncommitted.
3. lab-strip 404 on `/v2/`.
4. Dual stamp 0.16.41 vs 0.17.23-v2.
5. Dice/coin UC is a separate draft spec, not this ship.

## Cross-review

Blockers 0. Obsolete Tier A 0.
