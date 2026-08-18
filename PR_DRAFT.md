# PR Draft: v0.16.7 comet range + Receive/Compare honesty

**Spec:** `.agents/specs/2026-08-18-comet-range-honesty.md`

## What Problem This Solves

Comet prompts still said S0–S71. Receive/Compare said nothing is sent.

## Why This Change Was Made

CEO leftovers. Increment to 0.16.7. Do not reopen P0 walls or S81/S11b rec-flow.

## Traceability

| AC | Evidence |
|----|----------|
| No S0–S71 | test_comet_and_agent_prompt_have_no_stale_s0_s71 |
| Honest copy | S82 |
| Stamps 0.16.7 | S0 + HTTP files |

## Red-proof

- red_cmd: `.venv/bin/python -m pytest -q tests/test_stamp_comet_header.py::test_comet_and_agent_prompt_have_no_stale_s0_s71`
- green_cmd: same

## Evidence pack

pytest 105 · Playwright 103 · check_web_e2e

## Things that look bad but are actually fine

1. Historical “Fixed” table now says S0–S82 after stamp replace — still a history row, not a live pin.
2. S81/S11b unchanged.
3. Dark/amber identity unchanged.
