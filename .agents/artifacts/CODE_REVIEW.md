# CODE-REVIEW

**Command:** `/code-review` (ship chain)  
**Base:** `f668e6e` (post v0.14.0 sync_docs)  
**Head:** `HEAD` (`dc1b2b8`)  
**Scope:** first-hour / quiz / classroom UX polish after v0.14.0  
**Secrets:** `check_secrets_diff.py --base f668e6e --head HEAD` → **clean** (gitleaks)

## Scope freeze

```text
n_files=20  non_test_loc≈2349  prose_only=false  skip_heavy_review=false
```

## P0 blockers

**None accepted.**

Reviewed risk areas:

| Area | Verdict |
|------|---------|
| Secrets / funded seeds | No server persistence of mnemonics; quiz/hour progress is prefs-only localStorage; pad words labeled practice |
| XSS | Path playground / entropy notes use controlled innerHTML for verdict markup (static template + numbers); no untrusted HTML from user strings into free-form HTML sinks |
| Quiz self-check integrity | Still self-graded (intentional); Q2/Q3/Q4 evidence is educational not cryptographic proof |
| Step rails removal | Navigation via left nav + Go try + amber dock — no broken mandatory wizard |
| Sidebar overlap | Classroom moved under brand; nav clickable (S44b) |

## Follow-ups (not ship blockers)

1. **Entropy pad `ENT_PAD_MAX=128`** — fine for 50 d6; if 24-word path wants 256 bits, max events may need bump later.  
2. **Full `npm run test:e2e`** — focused learn/help/chrome suites used in this closeout; full suite still release gate via `check_web_e2e`.  
3. **S63 Comet text** still says “three quiz items” in places — sync in this ship’s docs pass.  
4. **`Math.random` pad** remains labeled simulated — keep never-fund copy (already present).

## Tests / smoke this pass

- `check_secrets_diff` clean  
- Playwright: `e2e/learn.spec.ts` `e2e/help-ux.spec.ts` `e2e/site-chrome.spec.ts` (run in ship window)

## Handoff

```text
✅ CODE-REVIEW DONE  p0=0  follow_ups=4
NEXT_SKILL=/cross_review
```
