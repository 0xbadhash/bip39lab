# PR Draft: Multisig explainer lab

**Range:** `v0.8.0...HEAD`

## What Problem This Solves

Users need an educational M-of-N multisig explanation and offline address builder without pasting private keys (safer than dense Coleman-style tools).

## Why This Change Was Made

User request: full FSM for A/B (already done) plus explanatory multisig inspired by iancoleman.io/multisig.

## User Impact

- New Multisig page + nav from BIP39 Lab
- Public-key-only M-of-N → P2SH + P2WSH
- BIP67 sort; refuses WIF/xprv

## Evidence

```text
red_cmd: python -m pytest -q tests/test_multisig.py
green_cmd: python -m pytest -q
```

43 unit tests; 13 e2e live.

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | PR_DRAFT + CODE-REVIEW + BEHAVIOR + red-proof |
| smoke | pytest |
| pytest | 43 passed |
| e2e | 13 passed |

## Spec

**Spec:** `.agents/specs/2026-08-06-multisig-explainer.md`

## Traceability

| AC | Evidence |
|----|----------|
| ACM.1–6 | multisig.html / multisig-core |
| ACM.7 | test_multisig.py |
| A/B already DONE | ROADMAP |

## Threat notes

- Public keys only; private material rejected
- No blockchain discovery / no network

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_multisig.py
green_cmd: python -m pytest -q
```

## Cross-review

blockers=0

## Things that look bad but are actually fine

1. Not a full PSBT signer — intentional teaching scope.
2. Options A/B not re-shipped — already complete.
3. Option C still open.

```yaml
things_that_look_bad_but_are_fine:
  - file: "web/multisig.html"
    concern: "simpler than Coleman"
    why_fine: "explanatory product goal"
  - file: "ROADMAP.md"
    concern: "A/B not re-run"
    why_fine: "already shipped"
  - file: "web/js/multisig-core.mjs"
    concern: "bare multisig only"
    why_fine: "education first"
```
