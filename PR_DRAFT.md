# PR Draft: v0.15.1 classroom dock + quiz mark reliability

**Spec:** `.agents/specs/2026-08-11-e0-orientation-first-hour.md`  
**Spec waiver:** chore  

## What Problem This Solves
Post-v0.15.0: Mark Q1–Q4 dock buttons often failed to pass/return; Shamir/related pages HTML shell broken; duplicate top return bars; unclear path after Set Beginner.

## Why This Change Was Made
Patch release for classroom reliability and layout integrity.

## User Impact
- Mark Q1/Q3/Q4 on bottom dock actually marks Passed and returns to quiz  
- Mark Q2 on Shamir dock saves + navigates with `?marked=q2`  
- Dock pinned to viewport bottom (body)  
- Shamir/Multisig/Network/SLIP-39 sidebar HTML repaired  
- Network/Shamir: no top duplicate Back bar  
- Set Beginner auto-completes step 8 + “what’s next”  
- All four quiz Passed → first-hour step 6 auto-done  
- Extra help beside Theme  

## Evidence pack
- hard_gates / smoke / pytest / check_web_e2e  
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR_REPORT  

## Evidence
| Check | Result |
|-------|--------|
| secrets v0.15.0…HEAD | clean |
| CODE-REVIEW | p0=0 |
| CROSS-REVIEW | blockers=0 |
| BEHAVIOR | B1–B7 pass |

## Traceability
| AC | Test |
|----|------|
| AC-1 Shamir page usable | e2e/shamir.spec.ts S53–S56 · pytest shell |
| AC-2 Quiz dock mark Q1–Q4 | learn-levels passQuiz · app.js markQuizFromEntPad · e2e learn S63 |
| AC-3 Q2 Shamir mark return | shamir-app markQ2AndReturn · marked=q2 |
| AC-4 No top Network back bar | network.html · network-app.js |
| AC-5 Beginner what’s next | firstHourNext · graduateToBeginner |
| AC-6 Hour step 6 auto | syncHourQuizStep · e2e learn |
| AC-7 HTML shell fix | structure balance · e2e shamir/multisig |
| AC-8 Extra help foot | e2e/help-ux.spec.ts |

## Red-proof / TDD
TDD N/A — UI reliability chore; green via pytest + playwright smoke.

## Untested paths
| Path | Reason |
|------|--------|
| web/js/learn-levels.js | e2e/learn.spec.ts |
| web/js/app.js | e2e/lab.spec.ts + learn |
| web/js/shamir-app.js | e2e/shamir.spec.ts |
| web/js/network-app.js | e2e/network.spec.ts |

## Threat notes
- **secrets** — quiz/hour localStorage only; practice demos  
- **xss** — static UI strings; no untrusted HTML in mark path  
- **integrity** — self-check quiz educational  

## Things that look bad but are actually fine
1. Self-graded quiz (no server).  
2. Math.random entropy pad (labeled simulated).  
3. Soft level gates.  
4. Dual localStorage + `?marked=` for Shamir→Lab Q2 handoff.  

## Cross-review
See `.agents/artifacts/CROSS_REVIEW.md` — blockers=0.
