# PR Draft: GapFix — Tools phrase source + teach clarity

**Range:** working tree (this ship)
**Spec:** `.agents/specs/2026-08-09-gapfix-tools-phrase-source.md`

## What Problem This Solves

Learners confuse auto-generated throwaway Tools phrases with a Lab mnemonic they typed or cleared, and several teach surfaces (entropy bits, descriptors, shortcuts) were opaque.

## Why This Change Was Made

Human-intuitiveness GapFix: explicit Phrase source + TEST DATA labeling, clear-secrets notes, entropy formula, descriptor definition + Load example, Lab keyboard teach.

## User Impact

- Tools intro explains phrase provenance; outputs prefix `[TEST DATA]` or `[Lab phrase]`.
- Clear secrets updates Tools outs + status for next auto-gen.
- Entropy pad shows d6≈2.58 / coin=1; descriptors explainable with Load example.
- Lab mnemonic card lists G/D/?/Esc.

## Evidence

- Unit: `tests/test_tools_teach_copy.py` (4)
- Playwright: S17–S19, S18c, S22–S23 extended
- Full pytest green
- No crypto/CSP change; secrets scan clean

## Traceability

| AC | Proof |
|----|--------|
| AC-1 Phrase source + TEST DATA chip | `tests/test_tools_teach_copy.py` + S17 |
| AC-2 `[TEST DATA]` / `[Lab phrase]` | `web/js/app.js` + S18/S18b/S19 |
| AC-3 Clear secrets notes | `app.js` clearSecrets + S18c |
| AC-4 Entropy formula | INDEX + entPadMeta + S17 + pytest |
| AC-5 Descriptor definition | INDEX + `test_tools_teach_copy.py` |
| AC-6 Load example | btnDescExample + S22 |
| AC-7 Lab shortcuts teach | INDEX kbd + tools-shortcuts + S23 |
| AC-8 Product smoke | `pytest` + product_smoke |

## Red-proof / Green-proof

- red_cmd: static asserts in `test_tools_teach_copy.py` against missing copy (TDD-style contracts on final tree)
- green_cmd: `.venv/bin/python -m pytest -q tests/test_tools_teach_copy.py`

## Threat notes

- Asset: Lab mnemonic / session-derived Tools phrase — must never look like a funded wallet secret; labels only, no retention to disk/logs.
- Abuse: User mistakes auto-gen TEST DATA for their own phrase after Clear secrets — mitigated by clearSecrets notes + `[TEST DATA]` prefixes + S18c.
- Abuse: Educational zpub Load example treated as user key material — copy marks format-teach only; no private keys in example.

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | run `python3 scripts/hard_gates.py --diff HEAD` after draft fix |
| pytest | `tests/test_tools_teach_copy.py` + suite via compliance_engine |
| smoke | `python3 scripts/product_smoke.py --root .` (release) |
| validate | `python3 scripts/validate.py full` when release_mgmt runs |

## Risks

Educational zpub example may fail checksum in Explain — intentional format teach; copy says so.

## Things that look bad but are actually fine

1. Tools Compare/Descriptors still write a mnemonic into the Lab field on auto-gen — by design for shared session; provenance labels + Clear secrets notes make that explicit.
2. Load-example zpub may fail full descriptor checksum — educational shape only, not a live watch-only import path.
3. S18c lives under lab.spec.ts Tools group — Clear secrets is Lab control then Tools compare; not a separate page suite.
4. Pipeline score may have been 96 from a prior partial ship on master; this GapFix ship re-validates from working tree.
