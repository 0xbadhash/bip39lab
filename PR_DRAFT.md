# PR Draft: v0.16.83 UC25 BIP-352 silent payments

**Spec:** `.agents/specs/2026-08-30-v2-uc25-bip352.md`
**Plan:** `.agents/specs/2026-08-30-v2-uc25-bip352-plan.md`

## What Problem This Solves

UC25 was a calendar of two checkboxes. Silent payments (BIP-352) were missing as a track.

## Why This Change Was Made

Operator: replace UC25 with BIP-352 and test it. Full ship FSM.

## User Impact

Chip **v0.17.133-v2**. Product **0.16.83**. Reuse fail, two classroom sends differ, BIP-84 import refused. Not a live scanner. No Sign.

Also in this tag: UC19 compare/wait/dust; UC15 passphrase left of Layer table; UC5 change descriptors for 44/49/86.

## Traceability

| AC | Test |
|----|------|
| AC-1 | `test_uc25_is_bip352_not_calendar` |
| AC-2 | Playwright S58 two sends differ |
| AC-3 | S58 import refuse + scan ok |
| AC-4 | S58 + UC16/UC18 still exist |

## Red-proof

- red_cmd: `false`
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc25_bip352.py -q`

## Threat notes

- secrets: classroom `lab-sp1q` not a fundable silent address
- xss: static teach HTML
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | pytest AC + Playwright S58 |
| pytest | `tests/test_ac_v2_uc25_bip352.py` |
| validate | compliance_engine via venv |

## Things that look bad but are actually fine

1. Dual stamp 0.16.83 vs 0.17.133-v2
2. leftover scripts uncommitted
3. SHA-256 classroom mixer is not live ECDH — labeled
4. Full 232 Playwright wall
5. Yearly drills remain UC16/UC18, not UC25

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
