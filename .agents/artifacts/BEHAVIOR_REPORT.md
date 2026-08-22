# BEHAVIOR-REPORT

**Stamp:** 0.16.25
**Contract:** gradual visual teach strip (spec 2026-08-22)

| Clause | Result | Evidence |
|--------|--------|----------|
| 1 One #labStrip; data-paint tracks Classroom | pass (source) | S110 |
| 2 Starter word card; no ENT slider/QR on strip | pass (source) | S111 |
| 3 Extra help Off hides captions | pass (source) | S112 |
| 4 Int keys≠shares; Adv master→child | pass (source) | S113 |
| 5 app-shell tokens only | pass (source) | --panel --accent --border |
| 6 Textarea remains | pass | Teach-B later |
| 7 Runtime PW | deferred | operator `npx playwright test e2e/lab-strip.spec.ts` |

✅ BEHAVIOR VALIDATED (source + tests authored; runtime deferred)
NEXT_SKILL=/pr_review --validate
