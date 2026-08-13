# PR Draft: B–H classroom (depends on A / v0.16.4 map)

**Spec:** `.agents/specs/2026-08-13-b-recovery-drill.md`
Also: `2026-08-13-c-vendor-diversity.md` … `h-psbt-partial.md`

## What Problem This Solves

After the vault map exists, learners still needed: recover/fail drill, vendor-diversity Extra help, demo-not-vendor, M=1 warning, PIN/file/PP words, coordinator banner, 1-of-2 PSBT inspect.

## Why This Change Was Made

Transcript walkthrough + prior value table A–H. A shipped v0.16.4. B depends on A. C–H are Extra help / inspect only.

## User Impact

Multisig: rebuild/try-without-map, diversity line, demo note, M=1 warn, coordinator banner. Glossary PIN/COORDPW. Tools: 1-of-2 partial sample.

## Traceability

| Spec | S-id | Test |
|------|------|------|
| B | S73 | e2e + test_rebuild_from_map |
| C | S74 | e2e |
| D | S75 | e2e |
| E | S76 | e2e |
| F | S77 | e2e glossary |
| G | S78 | e2e |
| H | S79 | e2e lab |

## Red-proof

- red_cmd: `.venv/bin/python -m pytest -q tests/test_multisig.py::test_rebuild_from_map_and_without_map`
- green_cmd: `.venv/bin/python -m pytest -q tests/test_multisig.py::test_rebuild_from_map_and_without_map`

## Evidence pack

S73–S79 Playwright green. pytest green.

## Things that look bad but are actually fine

1. B–H one ship after isolated A — same Multisig/Tools surface; 8 full e2e cycles would only re-run the same 90 tests.
2. Canned PSBT is educational type-0x02, not a funded tx.
3. M=1 still builds (teaching anti-pattern).
