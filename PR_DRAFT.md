# PR Draft: v0.16.39 V2 UC3–UC10 atoms + step descriptions

**Spec:** `.agents/specs/2026-08-24-v2-uc3-uc10-viz-desc.md`
**Plan:** `.agents/specs/2026-08-24-v2-uc3-uc10-viz-desc-plan.md`

## What Problem This Solves

Tracks 3–10 had no App Shell strip. Teaching pads lacked a Generate-style description. Validate hid the seed/card/address split behind (i). Quizzes said “12 words.”

## Why This Change Was Made

Operator asked UC3–UC10 as proposed after UC2, then pad descriptions, then recovery-words wording.

## User Impact

Each UC 3–10 shows three atoms. Every teaching pad has a plain paragraph. Validate explains words, seed, and address without (i). Quizzes say recovery words.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 UC3–10 three atoms, atom 1 hi | V2-S13 |
| AC-2 UC8 PSBT prose | V2-S13 `#v2PsbtOut` |
| AC-3 Validate desc seed | V2-S1 `#v2DeriveHelp` |
| AC-4 classic `/` | V2-S0 |
| AC-5 pytest | `.venv/bin/python -m pytest -q` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT; V2 Playwright; pytest; hard_gates.

## Things that look bad but are actually fine

1. Classic full e2e not all-green.
2. `scripts/*.py` uncommitted.
3. V2 footer `0.17.0-v2`.
4. lab-strip 404 on `/v2/`.
5. Callouts remain under some desc paragraphs on purpose (Do/Do not + extra colour).

## Cross-review

Blockers 0. Obsolete Tier A 0.
