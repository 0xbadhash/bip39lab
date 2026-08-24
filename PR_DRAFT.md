# PR Draft: v0.16.40 V2 UC11–UC13 custody taxonomy

**Spec:** `.agents/specs/2026-08-24-v2-uc11-uc13.md`
**Plan:** `.agents/specs/2026-08-24-v2-uc11-uc13-plan.md`

## What Problem This Solves

V2 never taught the objects people mix: exchange IOU vs seed you hold, hot software vs hardware signer, hot vs cold.

## Why This Change Was Made

Operator asked wallet types, then new use cases, then “Go ahead with UC11 to UC13.”

## User Impact

Three Beginner tracks on `/v2/`. Picker has 13 cards. Chip `v0.17.22-v2`. Classic `/` unchanged.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 13 cards | V2-S0 `.uc-card` count 13 |
| AC-2 atoms UC11–13 | V2-S13 |
| AC-3 pads/quiz/exit | V2-S14 |
| AC-4 classic `/` | V2-S0 `#btnGenerate` |
| AC-5 pytest | `.venv/bin/python -m pytest -q` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

TDD N/A: curriculum pads added after taxonomy discussion, not a failing unit first.

## Threat notes

- secrets: no mnemonic in sessionStorage (`bip39lab.v2` progress only)
- xss: CSP `connect-src 'none'`; SVG `img-src 'self'`
- csrf: none (static)
- threat-tag: custody-confusion (exchange ≠ BIP-39)

## Evidence pack

- hard_gates / CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT
- `npx playwright test e2e/v2.spec.ts` 14 passed
- `.venv/bin/python -m pytest -q`
- `python3 scripts/check_web_e2e.py --root .`

## Things that look bad but are actually fine

1. Classic full Playwright not all-green; V2 suite is the ship gate for this change.
2. Leftover `scripts/*.py` stay uncommitted (FEATURE LOCK).
3. `/v2/js/lab-strip.js` 404 is pre-existing, not this track.
4. Product tag `0.16.40` vs V2 chip `0.17.22-v2` is intentional dual stamp.
5. Teaching pads have both Do/Do not and a `desc()` paragraph on purpose.

## Cross-review

Blockers 0. Obsolete Tier A 0.
