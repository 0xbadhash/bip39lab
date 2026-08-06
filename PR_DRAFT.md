# PR Draft: Phase 6 Lab entropy fields

**Range:** `v0.5.0...HEAD` (phase-6)

## What Problem This Solves

Lab users could not see BIP-39 ENT bits for a phrase, nor a separate strength readout when using an optional passphrase.

## Why This Change Was Made

Phase 6 ROADMAP / user request: calculate mnemonic entropy; recalculate passphrase contribution in a **different** field.

## User Impact

- Lab shows **Mnemonic entropy** (e.g. `128 bits (12-word BIP-39)`).
- Separate **Passphrase strength (estimate)** when passphrase non-empty.
- Live on https://bip39.catalyxt.xyz/ (static root).

## Evidence

```text
red_cmd: python -m pytest -q tests/test_entropy_ui.py
green_cmd: python -m pytest -q
```

40 tests green.

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | this PR_DRAFT + CODE-REVIEW + BEHAVIOR + red-proof |
| smoke | product_smoke / pytest |
| pytest | 40 passed |
| validate | full gates |

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields.md`

**Plan:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields-plan.md`

## Traceability

| AC | Evidence |
|----|----------|
| AC6.1 ENT map 12→128…24→256 | `test_ent_bits_table`, `test_format_mnemonic_entropy`, web `ENT_BITS_BY_WORDS` |
| AC6.2 invalid mnemonic | web refresh sets invalid label; length/checksum |
| AC6.3 separate fields | `#entropyMnemonic` vs `#entropyPassphrase` |
| AC6.4 empty passphrase → — | `test_passphrase_empty` |
| AC6.5 clear / hide-private | `clearSecrets` + `data-private` |
| AC6.6 English offline | labels EN; CSP unchanged |
| AC6.7 smoke | pytest |

## Threat notes

- Entropy/strength values are display-only; secrets stay in memory; no network.
- Passphrase estimate is pedagogical — not a security proof; labeled estimate.
- Does not display seed/xprv.

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_entropy_ui.py
green_cmd: python -m pytest -q
```

## Cross-review

**CROSS-REVIEW** blockers=0. CODE-REVIEW p0=0. BEHAVIOR-REPORT pass.

## Test plan

- [x] ENT table unit tests
- [x] passphrase estimate unit tests
- [x] full suite
- [x] live HTML contains fields

## Things that look bad but are actually fine

1. Passphrase “bits” are Shannon estimate, not BIP-39 ENT — labeled estimate.
2. PBKDF2 512-bit seed is not claimed as 512 bits of entropy — helper note on page.
3. No Playwright — pure functions + static deploy verified via curl/pytest.

```yaml
things_that_look_bad_but_are_fine:
  - file: "web/js/app.js"
    concern: "estimate not zxcvbn"
    why_fine: "offline no CDN"
    validation: "label estimate"
  - file: "src/bip39lab/entropy_ui.py"
    concern: "Python not used by web"
    why_fine: "shared contract + unit tests"
    validation: "test_entropy_ui"
  - file: "web/index.html"
    concern: "live without rebuild step"
    why_fine: "static root"
    validation: "curl bip39.catalyxt.xyz"
```
