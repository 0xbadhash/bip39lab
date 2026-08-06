# Plan: Phase 4 — Local bitcoind address-only balance backend

- **Spec:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance.md`
- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent

## Stack & constraints

- Python ≥3.11, stdlib-first (existing `urllib` pattern for HTTP).
- No new runtime dependency unless stdlib JSON-RPC over HTTP is insufficient.
- Tests: pytest; inject RPC client/opener for mocks.
- Security: never log RPC password or cookie body; never accept mnemonic on balance path.

## Approach

Extend `bip39lab.balance` with a `bitcoind` backend that performs Bitcoin Core JSON-RPC `scantxoutset` for a single `addr(<address>)` descriptor, maps `total_amount` (BTC) → satoshis, and returns `BalanceResult`. Wire CLI flags/env for endpoint auth. Keep `none` default and existing `blockstream` path unchanged.

## Architecture decisions

| Decision | Choice |
|----------|--------|
| RPC method | `scantxoutset` action `start` with `["addr(<address>)"]` (or descriptor equivalent Core accepts) — no wallet import, no keys |
| HTTP | JSON-RPC 1.0/2.0 POST over HTTP(S) with Basic auth and/or cookie file (`.cookie`) |
| Config | CLI: `--rpc-url`, `--rpc-user`, `--rpc-password`, `--rpc-cookie`; env: `BIP39LAB_RPC_URL`, `BIP39LAB_RPC_USER`, `BIP39LAB_RPC_PASSWORD`, `BIP39LAB_RPC_COOKIE` |
| Defaults | URL default `http://127.0.0.1:8332` when backend is bitcoind and URL unset; still fail closed if node down |
| Injection | `rpc_call: Callable[[str, list], dict] \| None` or low-level `opener` for tests |
| Non-loopback | Optional detail warning in `BalanceResult.detail` if host not localhost — do not hard-block |
| Amount units | Core returns BTC float/string for scantxoutset `total_amount` — convert carefully to integer satoshis (avoid float drift: prefer Decimal or integer round of 1e8) |

### Explicit non-decisions

- No Electrum protocol
- No multi-address batch API this phase
- No web UI balance

## File / surface map (indicative)

| Area | Change |
|------|--------|
| `src/bip39lab/balance.py` | `fetch_bitcoind` / RPC helper; extend `get_address_balance` |
| `src/bip39lab/cli.py` | `--backend bitcoind`, RPC credential flags |
| `tests/test_balance.py` | Mocked RPC success/failure/auth cases |
| `README.md` / `SECURITY.md` | Document preferred local backend + env/flags |
| `VERSION` / `pyproject.toml` | Bump at release (0.5.0) via `/release_mgmt` |

## Implementation sequence

1. Red: tests for bitcoind ok / failure / missing creds behavior / mnemonic reject with backend bitcoind / CLI.
2. Green: implement JSON-RPC + scantxoutset mapping + CLI/env.
3. Docs touch (README/SECURITY).
4. Validate: pytest + product smoke.

## Testing plan

- Unit: mock `rpc_call` returning scantxoutset-shaped dict; boom/timeout → unknown; bad JSON → unknown.
- CLI: `main(["balance", addr, "--backend", "bitcoind", ...])` with injected path if needed.
- Smoke: `python -m pytest -q` (plugin).
- Manual: optional regtest scantxoutset — out of CI.

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Float BTC → sat drift | Decimal quantize to satoshi |
| scantxoutset slow/locked | Short timeout; fail closed; document |
| Cookie file permissions | Read-only open; never log contents |
| Operator points at remote RPC | Soft warning in detail; still address-only |

## Open questions

None — clarified in spec.
