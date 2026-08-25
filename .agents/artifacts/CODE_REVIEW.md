# CODE-REVIEW

- **command:** `/code_review` vs origin/master (working tree)
- **secrets:** restore typed words not written to sessionStorage; dock is id+step only
- **engine:** same session

## Accepted P0

**none**

- New tracks reuse existing atoms; no new connect-src.
- Restore uses BIP39Lab.validateMnemonic + deriveAddresses; practice phrase only.
- UC19 simulated credit is DOM text, not a network call.
- UC23 explicitly never signs.

## Follow-ups

- leftover `scripts/*.py` stashed
- lab-strip 404
- classic full e2e not V2 gate
- UC17–31 quizzes are 3 questions, not 5

p0=0 follow_ups=4

## Smoke

`npx playwright test e2e/v2.spec.ts` — 20 passed
