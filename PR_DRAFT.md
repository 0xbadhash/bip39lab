# PR Draft — v0.16.90 UC32 SeedXOR live examples

**Range:** `d2a0e0d...HEAD` (task-base after spec commit)
**Spec:** `.agents/specs/2026-09-15-v2-uc32-live-examples.md`
**Plan:** none
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

- red_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S23|V2-S52" ` (failed: missing `#v2XorSrcGrid` / `#v2XorWordN` before impl)
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S23|V2-S52"` (3 passed after uc32() + handlers)

## Traceability

| AC | Evidence |
|----|----------|
| AC-a visible source on split | `#v2XorSrcGrid` in V2-S23/S52 |
| AC-b non-12 length | V2-S52b 24-word split + parts count 24 |
| AC-c hide-one visible fail | `#v2XorNeedAll.msg-bad` + `#v2XorRecLab.is-fail` |
| AC-d combine matching words | `#v2XorRecGrid .ww` equals source words |
| AC-e VERSION lockstep | 0.16.90 + chip 0.17.139-v2 + comet + PLAYWRIGHT_LAST |
| AC-f compare.md + locks | UC32 row updated; classroom only |

## Threat notes

- Practice XOR parts must not be funded or QRd (copy + existing refusals).
- No silent truncate of longer BIP-39 cards (fail closed on invalid length).
- No secrets committed; mnemonics stay in-memory practice only.

## Evidence pack

- hard_gates / check_web_e2e PASS
- Playwright V2-S23 S52 S52b PASS
