# PR Draft — v0.16.87 V2 classroom cluster, clock, descriptor tabs

**Range:** `v0.16.86...HEAD`  
**Spec:** `.agents/specs/2026-09-03-v2-classroom-cluster-fsm.md`  
**Plan:** `.agents/specs/2026-09-03-v2-classroom-cluster-fsm-plan.md`

## What Problem This Solves

Classroom faces looked missing (lock crop). Shamir/XOR/timelock dumped controls. UC34 listed every descriptor. Help text sat on the button. UC33 three equal buttons were unreadable.

## Why This Change Was Made

Operator: `[image][blue box]` on every classroom, progressive pads, BIP then receive/change, 0.85rem after stacked buttons, UC33 as an animated clock.

## User Impact

Learners see the whole face next to the story. UC32 Show parts has a picture. UC33: heir fails, bar fills 90 days, heir again, owner reset — no Sign. UC34: one public recipe per BIP × chain.

## Evidence

- pytest `tests/test_ac_v2_uc7_layout.py` `tests/test_ac_v2_uc1_card_object.py`
- Playwright V2-S0, V2-S24, V2-S25 / V2-S53

## Red-proof / TDD

- red_cmd: layout AC asserts `.v2-pad > button.btn + *` and `0.85rem !important` (would fail on pre-CSS tree)
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc7_layout.py tests/test_ac_v2_uc1_card_object.py -q`
- TDD: tests landed with implementation on a dirty tree; AC is the contract.

## Traceability

| AC | Evidence |
|----|----------|
| AC-1 | `v2.css` `.v2-face-after > .v2-lock img` contain |
| AC-2 | `uc32-face-*.svg` + `v2XorPartsTeach` |
| AC-3 | `uc33()` + V2-S24 |
| AC-4 | `descTypeTabsHtml` / `data-desc-chain` + V2-S25 |
| AC-5 | `test_ac_button_then_help_gap` |
| AC-6 | `e2e/v2.spec.ts` S0 S24 S25 S53 |

## Threat notes

- **secrets:** practice phrases; public descriptors only; UC34 refuses xprv/seed in Explain
- **xss:** static SVG + existing teach HTML escape on word grids
- **csrf:** n/a offline lab
- **sign:** UC33 never signs or broadcasts

## Evidence pack

- hard_gates + pytest layout AC + Playwright V2-S24/S25
- smoke at `/release_mgmt` (`python -m pytest -q` + `scripts/run_e2e_smoke.py`)
- validate: `scripts/validate.py full` at release

## Untested paths

| Path | Reason |
|------|--------|
| classic 232 Playwright | not this ship; V2 subset + unit |
| leftover scripts/*.py | uncommitted by policy |
| scripts/green_checkpoint.py | harness reinstall in range; not this classroom ship |
| scripts/ops_dashboard.py | harness reinstall in range; not this classroom ship |

## Things that look bad but are actually fine

1. Dual stamp: product `0.16.87` vs V2 chip `0.17.N-v2` is intentional.
2. Generic classroom SVGs remain on some pads; contain CSS makes them visible; XOR/clock/2-of-3 were redrawn.
3. `config/` and leftover `scripts/*.py` stay untracked.

## §9

1. Does not add Sign or live CSV.
2. Does not compute Electrum KDF.
3. Does not force-push or commit leftover scripts.
