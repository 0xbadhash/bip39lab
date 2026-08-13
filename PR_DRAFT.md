# PR Draft: A — vault map object

**Spec:** `.agents/specs/2026-08-13-a-vault-map.md`

## What Problem This Solves

Learners saw addresses but no public **map** (descriptor) to back up with each key.

## Why This Change Was Made

Sovereign Sessions walkthrough treats the config/descriptor as first-class. This lab now emits `wsh(sortedmulti|multi(…))` after Build.

## User Impact

Multisig result shows Vault map + Extra help. Copy map is public-only.

## Traceability

| AC | Evidence |
|----|----------|
| Map after 2-of-2 | `test_vault_map_descriptor_public_only` + S72 |
| Hidden on Clear | S72 |
| Comet | S72 in E2E_COMET_SCENARIOS.md |

## Red-proof

- red_cmd: `.venv/bin/python -m pytest -q tests/test_multisig.py::test_vault_map_descriptor_public_only`
- green_cmd: `.venv/bin/python -m pytest -q tests/test_multisig.py::test_vault_map_descriptor_public_only`

## Evidence pack

- pytest targeted green
- Playwright S72 pass
- hard_gates at /pr_review

## Things that look bad but are actually fine

1. Descriptor uses raw compressed hex, not xpub origins — educational key ids are first 8 hex.
2. Bundle patched in lockstep with `multisig-core.mjs` (esbuild wordlist export blocked).
3. Map is public policy; it is supposed to look like an address recipe.

## Evidence

S72 green. No secrets.
