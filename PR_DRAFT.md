# PR Draft: v0.16.43 V2 UC11–UC13 interactive labs

**Spec:** `.agents/specs/2026-08-25-v2-uc11-13-interactive.md`
**Plan:** `.agents/specs/2026-08-25-v2-uc11-13-interactive-plan.md`

## What Problem This Solves

UC11–13 were unblocked lectures. Learners did not practice they-vs-you, exchange lock-out, or a hot-wallet steal.

## Why This Change Was Made

Operator called UC11–13 slop, then iterated: They/You colours, seed phrase + timer lock, you-hold contrast, phone drain, hardware two-pane.

## User Impact

UC11: tap They/You (green/red); company lock after 5s. UC12: phone balance then malware to 0; USB then type-seed drain. UC13: sort + trap. Chip v0.17.30-v2.

## Traceability

| AC | Test |
|----|------|
| AC-1 they/you + lock | V2-S14 |
| AC-2 phone drain + hardware | V2-S14 |
| AC-3 sort/trap | V2-S14 |
| AC-4 classic `/` | V2-S0 |
| AC-5 pytest | `.venv/bin/python -m pytest -q` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

TDD N/A on green tree: V2-S14 was extended in-place.

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT; V2 Playwright; pytest; hard_gates.

## Things that look bad but are actually fine

1. Fake 0.184 BTC drains — teaching only.
2. leftover `scripts/*.py` uncommitted.
3. lab-strip 404 on `/v2/`.
4. Dual stamp 0.16.43 vs 0.17.30-v2.
5. 5s lock and drain bars make S14 slower on purpose.

## Cross-review

Blockers 0. Obsolete Tier A 0.
