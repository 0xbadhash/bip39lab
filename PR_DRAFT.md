# PR Draft: SLIP-39 lab C — wrong passphrase + multi-group teach

**Range:** `68f47b8`…`HEAD`  
**Spec:** `.agents/specs/2026-08-10-slip39-c-passphrase-groups.md`  
**Tag intent:** `v0.13.9`

## What Problem This Solves

Learners who finished SLIP-39 B (single-group split/combine) still miss two mental-model gaps vs BIP-39: **passphrase is applied at combine** (wrong passphrase → different master secret, not a quiet 25th-word derivation tweak), and **groups** (e.g. 1-of-1 owner + 2-of-3 heirs).

## Why This Change Was Made

Complete roadmap item C: formalize teach that was partially present after B (S60), add **manual** wrong-passphrase path (S60b), structured group diagram labels, and shell marker `c`.

## User Impact

- **S60** scripted “Run wrong-passphrase demo” + structured `#s39GroupDiagram` (`data-group` 1 / 2 + `data-policy`).
- **S60b** manual: split with `correct` → combine with `wrong` → mismatch (recovered ≠ expected).
- Split mirrors passphrase into combine field so happy path still matches.
- Lab-only / not Trezor Suite copy retained.

## Evidence

- Unit: `tests/test_slip39_lab.py::test_wrong_passphrase_mismatches_expected`
- E2E: S57–S60b in `e2e/slip39.spec.ts` (6 passed)
- Comet: `docs/E2E_COMET_SCENARIOS.md` S60 / S60b
- product_plugin slip39 surface includes S60 + S60b

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 Wrong pp fail (scripted) | `e2e/slip39.spec.ts` S60; pytest `test_wrong_passphrase_mismatches_expected` |
| AC-2 Wrong pp fail (manual) | `e2e/slip39.spec.ts` S60b |
| AC-3 Multi-group diagram | S60 asserts `#s39GroupDiagram [data-group='1'|'2']` + `[data-policy]` |
| AC-4 Lab-only copy | S57 danger banner; shell copy tests |
| AC-5 Comet sync | `docs/E2E_COMET_SCENARIOS.md` S60/S60b; `check_web_e2e` |

## Threat notes

- Offline CSP `connect-src 'none'` unchanged on SLIP-39 page.
- No production multi-group split; diagram is teach-only (no silent over-claim of full SLIP-39 policy designer).
- Wrong passphrase yields a different secret (library decrypt) — UI compares to expected so operators never see a silent false “Match”.
- Practice secrets only; danger banner retained.

## Red-proof

```text
red_cmd: npx playwright test e2e/slip39.spec.ts -g 'S60 wrong' → fail missing [data-group='1']
green_cmd: npx playwright test e2e/slip39.spec.ts → 6 passed; pytest tests/test_slip39_lab.py → 7 passed
```

## Evidence pack

- hard_gates / CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT  
- product_smoke unit + e2e  
- check_web_e2e  
- secrets scan on ship range  

## Things that look bad but are actually fine

1. **C mostly lived under B commit** — partial S60 shipped with B; this tag formalizes C + S60b + structured diagram.  
2. **Multi-group is diagram-only** — full group live split is out of scope; avoids fake designer UX.  
3. **Wrong passphrase often does not throw** — SLIP-39 decrypts to a different secret; mismatch vs expected is the correct teach signal.  
4. **VERSION 0.13.9 patch** — teach polish + AC closeout, not new crypto surface.  
