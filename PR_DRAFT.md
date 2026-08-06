# PR Draft: Phase 0 offline correctness lab (v0.1.0)

**Range:** `97b646d...HEAD`

## Summary

- Offline `bip39lab` package + CLI (generate/validate/derive)
- Vendored BIP-39 wordlist with SHA-256 integrity
- Legacy scanner quarantined under `legacy/`
- Golden vectors for abandon…about BIP44/49/84

## What Problem This Solves

Legacy root scanner retained mnemonics, logged seeds, used `eval`, and fetched the wordlist online. Operators lacked a safe offline derivation lab.

## Why This Change Was Made

Ship Phase 0 of ROADMAP: stdlib offline lab with fixtures, no network, no secret retention — foundation before any web UI or balance APIs.

## User Impact

Operators use `python -m bip39lab` for offline mnemonic tools. Unsafe scanner is under `legacy/` only.

## Evidence

TDD: vector + no-retention tests; full suite green.

```text
red_cmd: PYTHONPATH=src python -m pytest -q tests/test_bip39_vectors.py (written first against empty package — red then green)
green_cmd: PYTHONPATH=src python -m pytest -q
```

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | run at /pr_review |
| smoke | product_smoke / pytest |
| pytest | 17 passed |

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-0-correctness-lab.md`

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC0.1 Vendored wordlist + SHA-256 | `test_wordlist_integrity` |
| AC0.2 Checksum validation | `test_validate_abandon`, `test_reject_bad_checksum` |
| AC0.3 Golden addresses | `test_derive_bip44/49/84`, `test_derive_all` |
| AC0.4 CLI offline | `test_cli_derive_no_files`, `test_cli_validate` |
| AC0.5 No retention | `test_modules_have_no_open_write`, `test_cli_derive_no_files` |
| AC0.6 Legacy quarantine | `test_legacy_quarantined` |
| AC0.7 No eval/API in new CLI | code review + package surface |
| AC0.8 Smoke | `python -m pytest -q` |
| AC0.9 No secrets committed | gitignore + secrets scan |

## Threat notes

- Asset / trust boundary: mnemonics and private keys exist only in process memory for CLI lifetime; never written by `bip39lab`.
- Abuse case / mitigation: wrong derivation steals trust — mitigated by golden BIP address fixtures in CI.
- Supply chain: wordlist integrity via SHA-256 of vendored file (no network fetch).
- Logging: CLI logs omit mnemonic content.

## Red-proof (process honesty)

```text
red_cmd: PYTHONPATH=src python -m pytest -q tests/test_bip39_vectors.py
green_cmd: PYTHONPATH=src python -m pytest -q
```

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md` (marker CROSS-REVIEW).

## Test plan

- [x] pytest vectors
- [x] no-retention tests
- [x] CLI validate/derive
- [x] legacy path check

## Things that look bad but are actually fine

1. Hand-rolled secp256k1 — educational offline path; gated by golden vectors (Phase 0 scope).
2. Legacy scanner still in tree under `legacy/` — intentional quarantine, not default entrypoint.
3. No external bip-utils dependency — intentional minimal offline trust surface.

```yaml
things_that_look_bad_but_are_fine:
  - file: "src/bip39lab/secp256k1.py"
    concern: "custom ECC"
    why_fine: "fixture-tested; Phase 0 offline stdlib constraint"
    validation: "test_derive_bip44/49/84"
  - file: "legacy/brute-force-btc.py"
    concern: "unsafe code remains"
    why_fine: "quarantined + README; not product default"
    validation: "test_legacy_quarantined"
  - file: "src/bip39lab/cli.py"
    concern: "prints mnemonic on generate"
    why_fine: "stdout only, no file write; user-requested one-shot"
    validation: "test_cli_derive_no_files"
```
