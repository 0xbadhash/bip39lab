# CODE-REVIEW

command: `/code_review` 0.16.81 UC7 Try-first layout
base: origin/master
secrets: clean (check_secrets_diff)

## Findings accepted
None.

## Findings rejected
- **v2-app.js ≫ 1k lines.** Pre-existing. Layout restack stays in `uc7()`. Extract later.
- **innerHTML teach strings.** Static copy, no user interpolation on those nodes.

## P0 count
0

## Follow-ups
Classic Lab Playwright full 232 still flaky (Lab/faces/help timeouts) — not this UC.
SLIP-39 Suite remains docked, not cloned.
UC19 P3 live lookup still skipped.

## Smoke
`pytest tests/test_ac_v2_uc7_layout.py` plus prior Playwright V2-S39/S40/S44/S45/S50.

## Things that look bad but are actually fine
1. Dual stamp 0.16.81 vs 0.17.131-v2
2. leftover scripts uncommitted
3. Try result `<pre>` after Combine so Combine sits under help as specified
4. Absorb of 0.16.79/80 untagged commits into this tag
