# PR Draft: SLIP-39 lab A — teach shell

**Range:** this ship (working tree → HEAD)
**Spec:** `.agents/specs/2026-08-10-slip39-a-teach-shell.md`

## What Problem This Solves

Learners confuse educational Shamir (`share:index:hex`) with Trezor SLIP-39 share words. The Shamir “not SLIP-39” banner had no sibling lab destination.

## Why This Change Was Made

Ship offline `web/slip39.html` teach shell: danger banner, BIP-39 / educational Shamir / SLIP-39 comparison table, jump rail, demo placeholders, Shamir deep-link. **No split/combine crypto** (B/C).

## User Impact

- Dedicated SLIP-39 lab page (lab only · not funded wallets · not Trezor Suite).
- Comparison table keeps three backup models distinct.
- Shamir → SLIP-39 deep-link continues the “not SLIP-39” story.

## Evidence

- Unit: `tests/test_slip39_shell_copy.py` (5)
- Playwright: `e2e/slip39.spec.ts` S57 / S57b
- No crypto bundle; CSP `connect-src 'none'`
- Secrets scan clean

## Traceability

| AC | Proof |
|----|--------|
| Danger banner lab/funds/Trezor | `test_slip39_html_danger_banner` + S57 |
| Comparison table topics | `test_slip39_comparison_table_topics` + S57 |
| Jump rail + placeholders | `test_slip39_jump_rail_and_placeholders` |
| Shamir → slip39.html | `test_shamir_links_to_slip39_lab` + S57b |
| Six-nav only (no 7th) | `test_slip39_keeps_six_nav` + S57 |
| Plugin surface + Comet | product_plugin slip39 + E2E_COMET S57 |

## Red-proof / Green-proof

- red_cmd: static asserts fail if banner/table/Shamir link missing
- green_cmd: `.venv/bin/python -m pytest -q tests/test_slip39_shell_copy.py`

## Threat notes

- Asset: no mnemonic/seed/xprv on this surface in ship A (placeholders only).
- Abuse: user mistakes page for production SLIP-39 restore — danger banner + lab-only chips + not Trezor Suite copy.
- Abuse: network exfil of pasted secrets later — CSP `connect-src 'none'`; no third-party scripts.

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | `python3 scripts/hard_gates.py --diff HEAD` |
| pytest | `tests/test_slip39_shell_copy.py` |
| smoke | product_smoke at release_mgmt |
| validate | validate full at release_mgmt |

## Risks

Demo cards say “Coming in ship B/C” — intentional incomplete crypto path.

## Things that look bad but are actually fine

1. No 7th top-level nav item — deep-link only, keeps 6-nav contract.
2. Specs B–D committed as stubs — not claimed done; ROADMAP still OPEN for B–D.
3. `slip39-app.js` is chrome-only shell marker — crypto is B.
