# BEHAVIOR-REPORT

**Command:** `/behavior-validator`  
**Contract:** `.agents/artifacts/BEHAVIOR_CONTRACT.md`  
**Surface:** Playwright against local static `web/` (source-blind clauses judged via e2e outcomes + manual checklist)

| ID | Result | Evidence |
|----|--------|----------|
| C1 | **pass** | S61: 8 hour steps, checkbox progress, Go on h2 |
| C2 | **pass** | S61 / S44: `#learnReturnBar` visible after Go; Back returns |
| C3 | **pass** | S63: Mark Q1 → Passed badge/board; chip-ok green CSS |
| C4 | **pass** | Product: `refreshEntPadQuizUi` live TOO LOW after rolls; S63 opens demos |
| C5 | **pass** | `#btnMarkQ3FromEnt` / `#btnMarkQ4FromEnt` in entropy pad action bar |
| C6 | **pass** | S44b Tools click no longer intercepted; Classroom under brand |
| C7 | **pass** | S41/S44b: zero `[data-step-rail]`; S40 no `.footer-host` |
| C8 | **pass** | S40 sidebar `.site-version-chip` visible |

**Anti-cheat notes:** Quiz remains self-mark (by design). Entropy pad still PRACTICE ONLY. No fake success without user Mark.

**blocked:** none  
**fail:** none  

```text
NEXT_SKILL=/pr_review --validate
```
