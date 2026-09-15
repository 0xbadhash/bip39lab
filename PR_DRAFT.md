# PR Draft — v0.16.90 UC32 SeedXOR live examples

**Range:** `d2a0e0d...HEAD`
**Spec:** `.agents/specs/2026-09-15-v2-uc32-live-examples.md`
**Plan:** `.agents/specs/2026-09-15-v2-uc32-live-examples-plan.md`
**Brief:** `/opt/second-brain/vault/agent-tasks/BRIEF-W6-BIP39-UC32-LIVE-EXAMPLES-2026-09-15.md`

## What Problem This Solves

UC32 split step hid the source phrase; split was 12-only; Recover/Hide/Combine were message stubs without visible word grids / match-fail.

## Why This Change Was Made

CEO verified gaps 2026-09-15. Classroom N-of-N must show the live seed, accept true 12–24 lengths (no silent truncate), and demonstrate hide-fail + combine-match on screen.

## User Impact

Learners see the source word grid on split, can split 15/18/21/24 practice cards, see hide-one fail in the recover lab, and see combine-all restore matching source words.

## Evidence

- Playwright V2-S23, V2-S52, V2-S52b (local green)
- `python3 scripts/check_web_e2e.py` PASS
- VERSION 0.16.90 lockstep site-version / comet / PLAYWRIGHT_LAST; V2 chip 0.17.139-v2

## Red-proof / TDD

- red_cmd: `git show d2a0e0d:web/v2/js/v2-app.js | rg -q v2XorSrcGrid`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S23|V2-S52"`
- TDD: red proved missing `#v2XorSrcGrid` / `#v2XorWordN` before impl; green 3 passed after uc32() + handlers.

## Traceability

| AC | Evidence |
|----|----------|
| AC-1 visible source on split | Playwright V2-S23/S52 `#v2XorSrcGrid` |
| AC-2 non-12 length | Playwright V2-S52b 24-word split + parts count 24 |
| AC-3 hide-one visible fail | `#v2XorNeedAll.msg-bad` + `#v2XorRecLab.is-fail` |
| AC-4 combine matching words | `#v2XorRecGrid .ww` equals source words |
| AC-5 VERSION lockstep | 0.16.90 + chip 0.17.139-v2 + comet + PLAYWRIGHT_LAST |
| AC-6 compare.md + locks | UC32 row updated; classroom only |

## Threat notes

- secrets: practice mnemonics stay in-memory; no funded seeds committed.
- xss: recovered/source words render via `escapeHtml` in `wordGridHtml`.
- supply-chain: no new deps; static lab only.

## Evidence pack

- hard_gates: see `python3 scripts/hard_gates.py --diff d2a0e0d...HEAD`
- smoke/web_e2e: `python3 scripts/check_web_e2e.py` PASS
- Playwright: V2-S23 S52 S52b PASS

## Cross-review

Blockers: 0. See `.agents/artifacts/CROSS_REVIEW.md`.

## Things that look bad but are actually fine

1. Dual stamp product 0.16.90 vs V2 chip 0.17.139-v2
2. Empty wordGridHtml 12 dash placeholder before MakeSrc
3. Hide-fail uses empty `#v2XorRecGrid` (0 `.ww`) for unambiguous e2e
