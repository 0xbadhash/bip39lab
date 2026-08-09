# bip39lab — offline BIP-39 / entropy lab

<!-- CURRENT_RELEASE -->
**Current release:** `v0.13.4` (docs synced via `/sync_docs`)
<!-- /CURRENT_RELEASE -->

**Repo:** [github.com/0xbadhash/bip39lab](https://github.com/0xbadhash/bip39lab)

Self-hosted, **no-retention** BIP-39 tooling (CLI + static web), inspired by public converters but without third-party trust for seed material.

**Public host:** [https://bip39.catalyxt.xyz/](https://bip39.catalyxt.xyz/) (English UI only). Brand domain is **`catalyxt.xyz`** — do not use `catalyxt.ltd` for new deploys.

**Not** a funded-wallet brute-force scanner. Legacy unsafe scanner is under `legacy/` only.

**Balance lookups:** prefer a **local Bitcoin node** — **Bitcoin Core or Bitcoin Knots** (`--backend bitcoind` or `--backend knots`; same JSON-RPC / `scantxoutset`). For free review without a node, use **`--backend mempool`** (mempool.space REST). Public explorers require leak acknowledgment. There is no free public Bitcoin Core/Knots JSON-RPC on the internet.

## Quick start (CLI)

```bash
# Windows PowerShell
$env:PYTHONPATH = "src"
python -m pip install -e .
python -m bip39lab generate --words 12
python -m bip39lab validate abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
python -m bip39lab derive abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
# Optional balance (address only — never pass a mnemonic):
python -m bip39lab balance bc1q... --backend none
# Free public review (REST — not Core RPC):
python -m bip39lab balance bc1q... --backend mempool --i-understand-address-leak
# Prefer your own node — Bitcoin Core or Bitcoin Knots (same RPC; cookie never logged):
python -m bip39lab balance bc1q... --backend bitcoind --rpc-cookie ~/.bitcoin/.cookie
python -m bip39lab balance bc1q... --backend knots --rpc-cookie ~/.bitcoin/.cookie
# Or env: BIP39LAB_RPC_URL BIP39LAB_RPC_USER BIP39LAB_RPC_PASSWORD BIP39LAB_RPC_COOKIE
# Alternate explorer:
python -m bip39lab balance bc1q... --backend blockstream --i-understand-address-leak
```

See **`docs/BITCOIN_KNOTS.md`** for running Knots (pruned is enough for current balances).

## Quick start (web)

**Hosted:** open [https://bip39.catalyxt.xyz/](https://bip39.catalyxt.xyz/) (same Catalyxt card shell as `card.catalyxt.xyz`).

Locally:

1. Open `web/index.html` in a browser (prefer airgapped machine).
2. Or serve static files: `python -m http.server 8080 --directory web`
3. Generate / paste mnemonic, derive first BIP44/49/84 addresses.
4. Use **Clear secrets** when done. Nothing is stored.

Host ops: `docs/BIP39_HOST.md` · TLS: `bash deploy/setup_bip39_tls.sh`

Rebuild offline bundle (after cloning scure/noble deps):

```bash
npx esbuild web/js/build-entry.mjs --bundle --format=iife --outfile=web/js/bip39lab.bundle.js
```

## Tests

```bash
python -m pytest -q
```

## Agent harness

This repo installs **agent-harness** under `.agents/`. Each ROADMAP phase ships via full FSM:

`/spec` → `/execute_dev` → reviews → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`

See `AGENTS.md`, `ROADMAP.md`, `.agents/docs/ship-flow.md`.

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) — software provided as-is for self-custody education and offline labs.
