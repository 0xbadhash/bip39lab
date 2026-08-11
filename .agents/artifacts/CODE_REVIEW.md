# CODE-REVIEW

**Command:** `/code-review`  
**Base:** `v0.15.0`  
**Head:** `HEAD` (`58cfe4f`)  
**Secrets:** `check_secrets_diff.py --base v0.15.0 --head HEAD` → **clean**

## Scope freeze
```text
n_files=12  non_test_loc≈832  prose_only=false
```

Post-v0.15.0 classroom UX polish: dock position, quiz mark buttons (Q1–Q4), Beginner next-path, Shamir HTML repair, Network/Shamir top-bar removal.

## P0 blockers
**None accepted.**

| Area | Verdict |
|------|---------|
| Quiz mark + return | In-page `LearnLevels.passQuiz`; Shamir `marked=q2` URL + localStorage dual write |
| Dock placement | `#learnReturnBar` on `body`; `position:fixed !important; bottom` |
| Shamir layout | Extra `</div>` after brand removed; structure balanced |
| Secrets | Progress keys only; no seed persistence |

## Follow-ups
1. Dead `.ent-quiz-action-bar` CSS can be removed in a chore.  
2. Optional e2e for dock Mark Q1–Q4 click → Passed (manual verified in product).  

## Tests
- secrets clean  
- unit/e2e to be re-run at smoke  

```text
✅ CODE-REVIEW DONE  p0=0  follow_ups=2
NEXT_SKILL=/cross_review
```
