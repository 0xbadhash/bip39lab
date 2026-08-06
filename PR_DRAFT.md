# PR Draft: Phase 4 local bitcoind balance

**Range:** `v0.4.0...HEAD` (phase-4 feature)

## What Problem This Solves

Operators with a local Bitcoin Core node had no first-class way to check an address balance without using a public explorer (or staying offline/`unknown`).

## Why This Change Was Made

ROADMAP Phase 4 / AGENTS.md preference: local bitcoind for address-only balance; fail-closed; never send seed material.

## User Impact

- New `--backend bitcoind` with `--rpc-url` / user / password / cookie (or env equivalents).
- Public explorer path unchanged (still requires leak acknowledgment).
- Default remains offline (`none`).

## Evidence

```text
red_cmd: python -m pytest -q tests/test_balance.py -k bitcoind
green_cmd: python -m pytest -q
```

33 tests green after implementation (mocked RPC; no live node in CI).

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance.md`

**Plan:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance-plan.md`

## Traceability

| AC | Evidence |
|----|----------|
| AC4.1 bitcoind backend CLI+lib | `test_bitcoind_*`, `test_cli_balance_bitcoind_backend` |
| AC4.2 offline default | `test_offline_default_unknown` |
| AC4.3 reject mnemonic | `test_bitcoind_rejects_mnemonic` |
| AC4.4 ok satoshis | `test_bitcoind_ok_mocked_rpc`, `test_btc_to_sats_decimal_safe` |
| AC4.5 fail-closed | `test_bitcoind_rpc_failure_unknown`, `test_bitcoind_rpc_error_object_unknown` |
| AC4.6 no secret logging | RPC password only in Authorization header; not logged; cookie read only |
| AC4.7 mocked tests | tests/test_balance.py |
| AC4.8 regression | full pytest suite |
| AC4.9 docs | README.md, SECURITY.md |

## Threat notes

- Address-only balance path; mnemonic-like input rejected before RPC.
- RPC credentials via flags/env/cookie; never printed; prefer cookie over password on CLI history.
- Public explorers still require explicit leak acknowledgment; bitcoind soft-warns non-loopback hosts in detail string.
- Fail-closed: transport/RPC errors → `unknown` with `satoshis is None`, never silent zero on failure (true empty UTXO set is `ok` with 0).

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_balance.py -k 'bitcoind or btc_to'
green_cmd: python -m pytest -q
```

## Cross-review

(filled by `/code_review` / `/cross_review`)

## Test plan

- [x] Mocked bitcoind success / failure / zero / mnemonic reject
- [x] CLI accepts bitcoind without leak flag
- [x] Full suite

## Things that look bad but are actually fine

1. `scantxoutset` only reports current UTXO sum (not lifetime received) — documented product choice for no-import address checks.
2. Default RPC URL 127.0.0.1:8332 — still fail-closed if node absent.
3. No live bitcoind in CI — intentional; mocked RPC is the contract.

```yaml
things_that_look_bad_but_are_fine:
  - file: "src/bip39lab/balance.py"
    concern: "scantxoutset not wallet history"
  - file: "tests/test_balance.py"
    concern: "no live node"
```
