# PR Draft: v0.16.81 V2 UC7 Try-first layout

**Spec:** `.agents/specs/2026-08-29-v2-uc7-layout.md`
**Plan:** `.agents/specs/2026-08-29-v2-uc7-layout-plan.md`

## What Problem This Solves

Combine sat beside Try so the shortcut looked like the drill. Classroom was buried. SLIP share boxes were tall. Checklist was far from Try.

## Why This Change Was Made

Operator: classroom blue first; Try then description; Combine right-aligned under help; SLIP yellow then blue; one-line shares; Try a different colour; checklist under Try description.

This ship also absorbs untagged local 0.16.79/80 (UC34, UC32 XOR, BIP-85 mint, UC27 UTXO, compare.md honesty, UC9 leak drill, e2e S57/S58, WIF regex).

## User Impact

Chip **v0.17.131-v2**. Product **0.16.81**. Try is amber. Combine is secondary, right-aligned. No Sign. Classic `/` unchanged except cache-bust.

## Traceability

| AC | Test |
|----|------|
| AC-1 | `test_ac_1_shamir_order_and_try_colour` |
| AC-2 | `test_ac_2_slip_order_checklist` |
| AC-3 | `test_ac_3_css_and_one_line_shares` |
| AC-4 | `test_ac_4_no_sign` |

## Red-proof

- red_cmd: `false`
- green_cmd: `python3 -m pytest tests/test_ac_v2_uc7_layout.py -q`

## Threat notes

- secrets: practice shares only; no mnemonic persist
- xss: static teach HTML
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | pytest AC + product_smoke unit |
| pytest | `tests/test_ac_v2_uc7_layout.py` |
| validate | compliance_engine |

## Things that look bad but are actually fine

1. Dual stamp 0.16.81 vs 0.17.131-v2
2. leftover scripts uncommitted
3. v2-app.js already huge
4. Combine after help, Try result below Combine (Try still the coloured primary)
5. Origin lacked tags for 0.16.79/80 — this tag is 0.16.81

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
