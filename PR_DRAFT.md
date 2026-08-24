# PR Draft: v0.16.37 V2 UC4–UC7 curriculum, quiz why, rail back-nav

**Spec:** `.agents/specs/2026-08-24-v2-uc6-uc7-fsm.md`
**Also:** UC1–UC10 Do/Do not first; quiz why; UC4 index increment; UC5 export why; address index chips

## What Problem This Solves

UC6 hid three seeds behind “throwaway xpubs” (actually zpub) and did not teach M-of-N. Quizzes said “Not that one.” Concept chips could not go back. Validate put Do/Do not under other callouts. Index `#n` sat on the same line as `tb1q`.

## Why This Change Was Made

Operator asked a full FSM: three visible cosigner phrases → BIP-84 zpub, Shamir room as footer, wrong-quiz explanations, rail/chip back-nav, Do/Do not on top, Catalyxt number chips for receive indexes.

## User Impact

Learners can mint three practice phrases, see zpub origin, increment path index, jump back via rail and concept chips, and read why a quiz answer is wrong.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 UC4 index increments and resets to 0 | Playwright V2-S10 |
| AC-2 UC6 three BIP-84 zpubs from three phrases | Playwright V2-S11 |
| AC-3 rail / concept back-nav visited steps | Playwright V2-S11, V2-S12 |
| AC-4 quiz wrong answer explains why | Playwright V2-S12 |
| AC-5 UC1 Validate Do/Do not first; where-addresses is prose | V2-S1 `#v2DeriveHelp` |
| AC-6 receive `#n` is nav-step above address | V2-S9 cells still 3-up |
| AC-7 secret-wall no mnemonic in sessionStorage | V2-S6 |
| AC-8 classic `/` still Lab | V2-S0 |
| AC-9 pytest smoke | `python -m pytest -q` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`
- TDD: V2-S10–S12 written with the UI; 12 passed.

## Threat notes

- secrets: no mnemonic in sessionStorage; cosigners RAM-only
- xss: CSP connect-src none on /v2/
- csrf: none

## Evidence pack

- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT in `.agents/artifacts/`
- smoke: `npx playwright test e2e/v2.spec.ts` (12 passed)
- pytest: `python -m pytest -q`

## Things that look bad but are actually fine

1. Full classic Playwright suite is still not all-green (pre-existing).
2. Harness `scripts/*.py` stay uncommitted.
3. V2 footer remains `0.17.0-v2` (parallel surface stamp).
4. Three practice seeds on UC6 is the pedagogy, not a funded 2-of-3.
5. `/v2/js/lab-strip.js` 404 is classic CSS relative URL; follow-up.

## Cross-review

Blockers 0. Obsolete Tier A 0. See `.agents/artifacts/CROSS_REVIEW.md`.
