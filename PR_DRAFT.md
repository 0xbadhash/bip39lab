# PR Draft: Intermediate I1–I4 + Advanced A1–A4 learning paths

**Spec:** `.agents/specs/2026-08-11-intermediate-advanced-paths.md`  
**Spec waiver:** chore  

## What Problem This Solves
Beginner has Guided quiz (Q1–Q4); Intermediate/Advanced unlocked Tour, BIP-85, Ops, PSBT but had no self-check “what’s next” path.

## Why This Change Was Made
Ship Intermediate “Three splits + Tools depth” (I1–I4) and Advanced “Ops mind offline” (A1–A4) as self-graded shells mirroring Guided quiz UX.

## User Impact
- Intermediate: `#cardIntQuiz` — I1 keys, I2 hex shares, I3 SLIP-39 words, I4 PSBT inspect-only  
- Advanced: `#cardAdvQuiz` — A1 BIP-85 idea, A2 watch-only, A3 Knots limits, A4 is-not  
- Amber return dock modes for Intermediate/Advanced; external return docks on Multisig/Shamir/SLIP-39 for intquiz  
- localStorage `bip39lab.intQuiz` / `bip39lab.advQuiz`; Reset + classroom reset  
- After I1–I4 all pass → Raise Level to Advanced  
- Playwright S68/S69 + Comet scenarios  

## Evidence pack
- pytest `tests/test_int_adv_paths.py` (red then green)  
- `npx playwright test e2e/learn.spec.ts` (S68/S69)  
- `check_web_e2e` + `product_smoke`  

## Evidence
| Check | Result |
|-------|--------|
| pytest test_int_adv_paths | 4 passed |
| e2e learn.spec S68/S69 | passed |
| check_web_e2e | ok (86 S-ids) |
| product_smoke | unit + e2e pass |

## Traceability
| AC | Test |
|----|------|
| AC-1 Intermediate card I1–I4 | test_int_adv_paths · e2e S68 |
| AC-2 Advanced card A1–A4 | test_int_adv_paths · e2e S69 |
| AC-3 Passed chips / summary / reset | e2e S68/S69 · learn-levels.js |
| AC-4 Go try dock / external from=intquiz | e2e S68 I4 dock · multisig/slip39/shamir docks |
| AC-5 Raise Advanced after I pass | `#intQuizNext` · btnIntGoAdvanced |
| AC-6 Playwright S68/S69 | e2e/learn.spec.ts |
| AC-7 Comet S68/S69 | docs/E2E_COMET_SCENARIOS.md |
| AC-8 Unit HTML/JS anchors | tests/test_int_adv_paths.py |

## Red-proof / TDD
| Phase | Command |
|-------|---------|
| red_cmd | `.venv/bin/python -m pytest tests/test_int_adv_paths.py -q` (4 failed before HTML/JS) |
| green_cmd | `.venv/bin/python -m pytest tests/test_int_adv_paths.py -q` (4 passed) + learn e2e |

## Untested paths
| Path | Reason |
|------|--------|
| Full Multisig I1 e2e navigate+mark | covered by unit + dock HTML; S68 marks in-page |
| Full BIP-85 crypto | out of scope (educational shell only) |

## Threat notes
- **secrets** — progress localStorage only; no mnemonics stored by quiz  
- **xss** — static teach copy; no untrusted HTML  
- **integrity** — self-check educational; soft level gates  

## Things that look bad but are actually fine
1. Self-graded Intermediate/Advanced quizzes (no auto crypto pass).  
2. BIP-85 demo is idea-only, not full HMAC derivation.  
3. Multisig/Shamir/SLIP-39 I1–I3 rely on return link + Mark on Lab (same pattern as Network first-hour).  
4. Soft level gates dim but remain readable.  

## Cross-review
Deferred to `/code_review` / `/cross_review` as NEXT_SKILL requires.
