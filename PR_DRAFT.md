# PR Draft: v0.16.84 UC1 Option 1 + card object pad

**Spec:** `.agents/specs/2026-08-31-v2-uc1-card-object.md`
**Plan:** `.agents/specs/2026-08-31-v2-uc1-card-object-plan.md`

## What Problem This Solves

UC1 pad 0 taught BIP-39, entropy, generate, and paste at once. Pad 1 repeated the entropy stack and talked about receive addresses before any address existed.

## Why This Change Was Made

Operator: Option 1 one-column generate path, then pad 1 Option A (look at the numbered card). Full ship FSM.

## User Impact

Chip **v0.17.134-v2**. Product **0.16.84**. Pad 0: generate → card → lock+blue+orange entropy of *that* list → paste. Pad 1: classroom + `N words · B bits` chip, no lock/meter, checkbox “numbered cells.” Also in this tag: UC21 you-hold-2 collab, UC28 UTXO combine/obfuscation, UC29 two-vault PIN/wipe (uncommitted vs 0.16.83).

## Traceability

| AC | Test |
|----|------|
| AC-1 pad 1 classroom | `test_ac_uc1_step1_card_object_not_entropy_stack` |
| AC-2 no entropy stack on pad 1 | same + Playwright V2-S1 |
| AC-3 photo don’t + checkbox | same |
| Pad 0 generate/paste | V2-S1, V2-S9, V2-S27 |

## Red-proof

- red_cmd: `false`
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc1_card_object.py tests/test_ac_v2_uc1_uc7_classroom.py -q`

## Threat notes

- secrets: practice mnemonics only; paste still checksum-gates
- xss: static teach HTML
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | pytest AC + Playwright V2-S1 |
| pytest | `tests/test_ac_v2_uc1_card_object.py` |
| validate | compliance_engine via venv |

## Things that look bad but are actually fine

1. Dual stamp 0.16.84 vs 0.17.134-v2
2. leftover `scripts/*.py` uncommitted
3. Pad 2 still has entropyHtml(false) lock+meter — address pad, not the look-at-card pad
4. Full classic Playwright 232 still not this ship’s gate
5. UC21/28/29 ride along; not Option C hide/uncover

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
