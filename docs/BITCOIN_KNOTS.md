# Bitcoin Knots + bip39lab balances

**Bitcoin Knots** is a Bitcoin Core–compatible full node with extra policy/knobs. For bip39lab it is a **drop-in** for balance checks: same **JSON-RPC** and **`scantxoutset`**.

You do **not** need a different bip39lab code path than Core.

| Question | Answer |
|----------|--------|
| Full archival node required for address balance? | **No.** A **pruned** full node is enough for *current* UTXO balance via `scantxoutset`. |
| Need an address index (Electrs/Fulcrum)? | **No** for occasional CLI checks. **Yes** if you want explorer-speed multi-address UI. |
| Works with `--backend bitcoind`? | **Yes.** Alias: `--backend knots` (same implementation). |
| Public internet RPC? | **Never expose** Knots/Core RPC to the world. Loopback or private network only. |

## What bip39lab calls

```text
scantxoutset start ["addr(<address>)"]
```

Sum of matching UTXOs → satoshis. Fail-closed if RPC fails (no fake zero).

## Minimal Knots config (balance-friendly)

Typical `bitcoin.conf` (adjust paths/user):

```ini
# ~/.bitcoin/bitcoin.conf  (Knots uses the same datadir layout as Core by default)
server=1
txindex=0
# Prune keeps the UTXO set; enough for scantxoutset current balances
prune=550

# RPC only on loopback
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
# Cookie auth is preferred (no password in shell history):
# datadir creates .cookie when server=1

# Optional: slightly longer RPC work for large scans
rpcworkqueue=16
```

Sync once (days on first run; pruned is smaller disk than archival).

Cookie file after start:

```text
~/.bitcoin/.cookie
```

If you set `datadir=/path/to/knots`, cookie is `/path/to/knots/.cookie`.

## CLI examples

```bash
# Same machine as Knots
python -m bip39lab balance bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu \
  --backend knots \
  --rpc-cookie ~/.bitcoin/.cookie

# Explicit URL (default http://127.0.0.1:8332)
python -m bip39lab balance bc1q… \
  --backend knots \
  --rpc-url http://127.0.0.1:8332 \
  --rpc-cookie ~/.bitcoin/.cookie

# Env form
export BIP39LAB_RPC_COOKIE=$HOME/.bitcoin/.cookie
export BIP39LAB_RPC_URL=http://127.0.0.1:8332
python -m bip39lab balance bc1q… --backend knots
```

`bitcoind` and `knots` backends are identical; pick the name that matches how you think about the node.

## Sanity checks with bitcoin-cli

```bash
bitcoin-cli -getinfo
bitcoin-cli getblockchaininfo   # expect "initialblockdownload": false when ready
bitcoin-cli scantxoutset start '["addr(bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu)"]'
```

(Binary may be named `bitcoin-cli` from the Knots package — same RPC port **8332** mainnet.)

## Web UI (Network page) vs CLI

| Surface | Knots today? |
|---------|----------------|
| **CLI** `python -m bip39lab balance … --backend knots` | **Yes** — preferred private path |
| **Lab** (`index.html`) | Offline; no balances |
| **Network** (`network.html`) | Public mempool proxy only today — does **not** call your Knots RPC from the browser (by design: no RPC in the static site) |

To use Knots for the **website** later you would add a **small local/private balance API** on the host (loopback-only) that the Network page calls with `connect-src 'self'` — never put cookie/RPC credentials in the browser.

## Resource ballpark

| Mode | Disk (order of magnitude) | Notes |
|------|---------------------------|--------|
| Pruned (~550 MB target blocks) | Tens of GB + UTXO | Enough for current balance |
| Full archival | ~600+ GB and growing | Only if you need full history / other apps |

First sync: plan bandwidth and several days unless you copy a trusted snapshot (advanced; know the trust tradeoff).

## Security

1. **RPC on 127.0.0.1 only** (or wireguard/VPN).  
2. Prefer **cookie** auth over long-lived passwords in env.  
3. Never paste mnemonics into balance tools — **address only**.  
4. Knots policy filters affect **relay/mempool**, not your ability to verify the chain or run `scantxoutset` for balances.

## Relation to Network “Failed to fetch”

Public fee/balance via mempool.space is independent. Knots replaces the **privacy-sensitive address balance** path on the CLI (and optionally a future private host API), not the public fee snapshot.
