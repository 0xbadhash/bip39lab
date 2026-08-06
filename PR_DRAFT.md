# PR Draft: Phase 2 address-only balance (v0.3.0)

**Range:** `v0.2.0...HEAD`

## Summary

- `bip39lab balance` address-only
- Fail-closed unknown vs zero
- Network requires explicit leak acknowledgment

## What Problem This Solves

Balance checks must not accept seeds or treat API failure as zero.

## Why This Change Was Made

Phase 2 ROADMAP.

## User Impact

Optional explorer check without seed path.

## Evidence

```text
red_cmd: python -m pytest -q tests/test_balance.py
green_cmd: python -m pytest -q
```

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | pr_review |
| smoke | pytest |
| pytest | 25 passed |

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-2-address-balance.md`

## Traceability

| AC | Test |
|----|------|
| AC2.1 reject mnemonic | test_rejects_mnemonic_like |
| AC2.2 fail closed | test_blockstream_http_failure_unknown |
| AC2.3 default none | test_offline_default_unknown |
| AC2.4 no mnemonic param | CLI balance address only |
| AC2.5 mocks | test_blockstream_ok_mocked |
| AC2.6 smoke | pytest |

## Threat notes

- Network backends leak address interest to third parties — requires explicit flag.
- Mnemonic-shaped input rejected on balance path.

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_balance.py
green_cmd: python -m pytest -q
```

## Cross-review

See artifacts.

## Test plan

- [x] unit mocks
- [x] CLI offline

## Things that look bad but are actually fine

1. Hardcoded Blockstream URL — only backend; gated by ack flag.
2. Exit code 2 for unknown — intentional fail-closed.
3. Web UI still offline CSP — balance not in browser Phase 2.

```yaml
things_that_look_bad_but_are_fine:
  - file: "src/bip39lab/balance.py"
    concern: "external URL"
    why_fine: "address-only optional backend"
    validation: "tests + ack flag"
  - file: "src/bip39lab/cli.py"
    concern: "network command"
    why_fine: "default backend none"
    validation: "test_cli_balance_offline"
  - file: "web/index.html"
    concern: "no balance in UI"
    why_fine: "CSP connect-src none preserved"
    validation: "index CSP"
```
