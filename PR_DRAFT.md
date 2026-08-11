# PR Draft: Classroom UX polish + entropy quiz Q3/Q4 (post v0.14.0)

**Spec:** `.agents/specs/2026-08-11-e0-orientation-first-hour.md`  
**Spec waiver:** chore  

## What Problem This Solves
First-hour / quiz navigation was hard to follow (stacked sticky bars, ambiguous Teach rails, quiz without clear return/pass on entropy). Level/Teach chrome crowded the left nav. Entropy lesson stopped at “too low” without teaching that ~128 bits / ~50 d6 is required.

## Why This Change Was Made
Ship human-path UX polish after v0.14.0 education levels: navigable first hour + quiz, single amber return dock, slim Classroom pane, remove mid-page step rails, entropy Q3 live TOO LOW + Q4 enough-bits, green Passed chips.

## User Impact
- First hour: Go / Mark done / checkboxes; sticky amber Back dock  
- Quiz: status board, Go try, self-mark; Q2 Shamir evidence; Q3 live TOO LOW + pad Mark button; Q4 ~50 d6 / 128 bits  
- Classroom left pane: Level, Extra help, Reset — no Host/status chips over Glossary  
- Offline crypto + online chips in topbar; version only in sidebar  
- No mid-page step-rail path wizard  
- Passed chips solid green  

## Evidence pack
- hard_gates: `python3 scripts/hard_gates.py --diff f668e6e...HEAD`  
- smoke: product_smoke + check_web_e2e at release  
- Playwright: e2e/learn.spec.ts, help-ux.spec.ts, site-chrome.spec.ts  
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR_REPORT under `.agents/artifacts/`  

## Evidence
| Surface | Result |
|---------|--------|
| secrets diff f668e6e…HEAD | clean |
| CODE-REVIEW | p0=0 |
| CROSS-REVIEW | blockers=0 |
| BEHAVIOR | C1–C8 pass |
| Playwright focused | S61–S67 + help-ux + site-chrome after e2e fix |

## Traceability
| AC | Test |
|----|------|
| AC-FH First hour Go/Back/checkboxes | e2e/learn.spec.ts S61 |
| AC-QZ Quiz status + Mark passed green | e2e/learn.spec.ts S63 |
| AC-RAIL No mid-page step rails | e2e/help-ux.spec.ts S41 S44b |
| AC-SIDE Version sidebar only, no footer host | e2e/site-chrome.spec.ts S40 |
| AC-TEACH Extra help on/off | e2e/help-ux.spec.ts S42 S48 |
| AC-ENT Q3 TOO LOW + Q4 128 bits lesson | web entropy pad + quiz Q3/Q4 (manual demo; S63 shell) |
| AC-NAV Tools/Glossary clickable | e2e/help-ux.spec.ts S44b |

## Red-proof / TDD
**TDD N/A** — UI/UX chore on static web classroom; no new pure function contract requiring red-then-green unit cycle.  
**red_cmd:** N/A (chore UX)  
**green_cmd:** `npx playwright test e2e/learn.spec.ts e2e/help-ux.spec.ts e2e/site-chrome.spec.ts`  

## Untested paths
| Path | Reason |
|------|--------|
| web/js/glossary.js | Covered via tip open e2e (S43, S45) and term panels; no unit module import |
| web/js/help-ui.js | e2e/help-ux.spec.ts (Extra help, tips, no rails) |
| web/js/learn-levels.js | e2e/learn.spec.ts S61–S67 |

## Threat notes
- **secrets** — localStorage prefs/progress only; practice phrases; never fund pad words  
- **xss** — controlled verdict HTML from numbers/templates  
- **integrity** — quiz self-check is educational, not exam proctoring  

## §9 Intentional oddities
1. Self-graded quiz (no server).  
2. Math.random entropy pad (labeled simulated).  
3. Soft level gates (dim, not hard hide).  
4. Amber dock shared for hour + quiz (one mode at a time).  

## Cross-review
See `.agents/artifacts/CROSS_REVIEW.md` — blockers=0.  
