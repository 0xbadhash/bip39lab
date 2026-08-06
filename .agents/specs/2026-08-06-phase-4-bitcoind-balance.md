# Phase 4 — Local bitcoind address-only balance backend

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Operators who run their own Bitcoin Core node want UTXO balance for a single address **without** sending that address to a public explorer. Phase 2 only offers offline-default or Blockstream (with leak acknowledgment). There is no first-class path to query **your node**.

## Solution

Add a **`bitcoind` balance backend** that talks to a user-configured local (or trusted) Bitcoin Core JSON-RPC endpoint using **address-only** requests. Mnemonics/seeds remain forbidden on the balance path. RPC failures stay **fail-closed** (`unknown` / `error`, never invent zero). Default backend remains offline (`none`).

## User Stories

1. As an airgap-friendly operator, I want `bip39lab balance <addr> --backend bitcoind` so I can check funded addresses against my own node.
2. As a security-conscious user, I want credentials only via env/CLI flags (never logs or committed files) so RPC secrets do not leak into git or product logs.
3. As a user without bitcoind running, I want a clear `unknown`/`error` result so a failed RPC is never shown as zero balance.
4. As an offline-first user, I want the default backend to stay offline so a typo cannot phone home.

## Implementation Decisions

- **Surface:** CLI `balance` subcommand + `bip39lab.balance` library API (same `BalanceResult` contract as Phase 2).
- **Backend name:** `bitcoind` (alias documented if useful: `bitcoin-core`).
- **Transport:** Bitcoin Core JSON-RPC only (stdlib or minimal HTTP; no new hard dependency unless unavoidable).
- **RPC method preference:** address-only scan that does **not** require importing keys (e.g. `scantxoutset` with `addr(...)` / descriptor form). Document limitations (UTXO set only; no historical spent totals unless available without wallet import).
- **Auth / endpoint:** CLI flags and/or env vars for URL, user, password, cookie file — never print password/cookie contents.
- **Leak flag:** Public explorer backends still require `--i-understand-address-leak`. Local `bitcoind` does **not** require that flag (operator already trusts the node). Optional soft warning if URL host is non-loopback.
- **Constitution:** no retention; no mnemonic on balance path; fail-closed; never commit RPC passwords.

## Testing Decisions

- **Seam:** `get_address_balance(..., backend="bitcoind", rpc_*=...)` with injectable RPC transport (mock JSON-RPC responses).
- **Cases:** ok with known satoshis; RPC timeout/connection → `unknown`; auth failure → `unknown` or `error` with no invented zero; mnemonic-like input still rejected; CLI wiring for `--backend bitcoind` and credential flags/env.
- **Smoke:** product plugin unit smoke (`pytest -q`).
- **Manual (optional):** against a real regtest/mainnet node — not required for CI.

## Acceptance Criteria

- [ ] AC4.1 Backend `bitcoind` is selectable via library and CLI (`--backend bitcoind`).
- [ ] AC4.2 Default backend remains `none` (offline → `unknown`); no network unless `bitcoind` or existing opt-in backends are chosen.
- [ ] AC4.3 Balance path still rejects mnemonic-like input; never accepts seed/xprv parameters.
- [ ] AC4.4 Successful RPC returns `BalanceResult(status="ok", satoshis=<int>, …)` with non-negative satoshis from the node’s UTXO answer.
- [ ] AC4.5 RPC/transport/parse failures return `status` in `{unknown, error}` with `satoshis is None` — never silent zero on failure.
- [ ] AC4.6 RPC URL/user/password (or cookie path) configurable without hardcoding secrets; secrets never logged or written by the balance path.
- [ ] AC4.7 Unit tests mock JSON-RPC (no live bitcoind required in CI).
- [ ] AC4.8 Existing Phase 2 blockstream/offline tests remain green; product smoke green.
- [ ] AC4.9 Docs: README/SECURITY note that local bitcoind is preferred over public explorers; document flags/env.

## Out of Scope

- Importing private keys / descriptors into the wallet for spend
- Background multi-address scanning or mnemonic lottery
- Electrum protocol servers
- Changing the static web UI (stays offline; no balance fetch from browser)
- Shipping a bundled bitcoind binary
- Tor / multi-hop RPC packaging

## Clarifications

### 2026-08-06
- Q: Interview vs defaults for Phase 4?
  - A: User selected ROADMAP next candidate (A). Apply product defaults: local bitcoind, address-only, fail-closed, offline default; no interview delay.
- Q: Require `--i-understand-address-leak` for bitcoind?
  - A: No for loopback/trusted node. Keep flag mandatory for public explorers only.
- Q: Live node in CI?
  - A: No — mocked RPC only.
- Q: Balance meaning?
  - A: Current UTXO sum for the address (scantxoutset-style), reported in satoshis; document if dust/unconfirmed nuances apply.

## Further Notes

- Risks: `scantxoutset` can be heavy on large UTXO sets — document; keep single-address scope.
- Constitution: aligns with AGENTS.md “prefer local bitcoind”; strengthens Phase 2 without weakening no-retention rules.
- Version target: `0.5.0` on successful `/release_mgmt`.

## Handoff

- Next: `/execute_dev` (TDD: red tests for bitcoind backend → implement → green)
- Then: follow `NEXT_SKILL` → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
