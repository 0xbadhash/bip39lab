# PR Draft: v0.16.38 V2 UC1/UC2 atoms, toolbar, inline addresses

**Spec:** `.agents/specs/2026-08-24-v2-uc1-uc2-viz.md`
**Plan:** `.agents/specs/2026-08-24-v2-uc1-uc2-viz-plan.md`

## What Problem This Solves

UC1 atoms existed on a branch but the live strip was text chips; the rail stole height; Generate hid BIP-39 (i); addresses stacked; UC2 quiz nags “select 2 and 3.”

## Why This Change Was Made

Operator validated UC1, asked UC2 the same way, then quiz silence on a single correct pick.

## User Impact

Visible Plan/Practice/Review SVGs on UC1 and UC2. Slim Track 1/6 rail. Generate + (i) left, Clear secrets right. `#n` beside `tb1q`, three pairs per row. UC2 quiz only scolds wrong answers.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 UC1 three atoms + viz step | V2-S12 `#uc1Viz` |
| AC-2 UC2 three atoms + print hi | V2-S8 `#uc2Viz` |
| AC-3 Generate toolbar + (i) | V2-S4 `#v2GenRow` `#wrapMnemonicI` |
| AC-4 three address pairs one row | V2-S9 |
| AC-5 no quiz nag 2 and 3 | V2-S8 |
| AC-6 classic `/` | V2-S0 |
| AC-7 pytest | `.venv/bin/python -m pytest -q` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`
- TDD: S8/S9/S12 updated with UI.

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none; img-src self
- csrf: none

## Evidence pack

- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT
- V2 Playwright; pytest 105
- hard_gates / pr_validator (venv python)

## Things that look bad but are actually fine

1. Classic full e2e still not all-green.
2. Harness scripts uncommitted.
3. V2 footer `0.17.0-v2`.
4. Preview HTML is optional operator file.
5. lab-strip 404 under `/v2/` is pre-existing relative URL.

## Cross-review

Blockers 0. Obsolete Tier A 0. See `.agents/artifacts/CROSS_REVIEW.md`.
