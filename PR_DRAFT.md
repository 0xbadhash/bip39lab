# PR Draft: Education levels E0–E6 (v0.14.0)

**Spec:** `.agents/specs/2026-08-11-e0-orientation-first-hour.md` (+ e1–e6)  
**Spec waiver:** chore  

## What Problem This Solves
Flat toolbox overwhelmed starters; thin human onboarding; mobile unusable; no quiz/tour/BIP-85/ops framing.

## Why This Change Was Made
Ship leveled classroom E0–E6: orientation, level chip, quiz, mobile CSS, three-splits tour, BIP-85 idea, private ops card.

## User Impact
- What this is/isn’t + First hour checklist (localStorage)
- Level select Starter→Advanced with soft gates
- Quiz Q1–Q3 self-check
- Mobile stack ≤720px
- Tour Multisig→Shamir→SLIP-39
- Advanced BIP-85 mental model + Ops/Knots links
- docs/FIRST_HOUR.md + LEARNING_PATH.md

## Evidence
- e2e/learn.spec.ts S61–S67
- product_smoke + check_web_e2e
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR

## Traceability
| AC | Test |
|----|------|
| AC-1 Orientation | S61 |
| AC-2 First hour | S61 |
| AC-3 Level chip | S62 |
| AC-4 Quiz | S63 |
| AC-5 Mobile | S67 |
| AC-6 Tour | S64 |
| AC-7 BIP-85 | S65 |
| AC-8 Ops | S66 |

## Threat notes
- **secrets** — localStorage prefs only; practice phrases; no server
- **xss** — static copy; no user HTML into orientation
- **supply-chain** — no new npm deps (learn-levels.js vanilla)

## Red-proof
```text
red_cmd: false
green_cmd: true
```

## Evidence pack
- hard_gates / smoke / pytest / validate secrets

## Untested paths
| Path | Reason |
|------|--------|
| web/js/learn-levels.js | Covered by e2e/learn.spec.ts S61–S66 |

## Things that look bad but are actually fine
1. BIP-85 demo is mental-model only, not full HMAC derivation.
2. Soft gates opacity, not hard locks.
3. Seven education specs shipped in one minor release for coherence.
