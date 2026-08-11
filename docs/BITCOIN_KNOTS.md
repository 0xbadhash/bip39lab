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

## Raspberry Pi / mini-PC ops checklist

Dedicated box for **pruned** Knots before bip39lab seed-scan or any private Network integration. Prefer **Pi 4/5 (4–8 GB) or small x86** + **USB/NVMe SSD** (not microSD for the datadir).

### 1. Disk layout

| Path | Purpose |
|------|---------|
| `/` (SD or eMMC) | OS only — keep small |
| `/data` or `/mnt/ssd` | **SSD mount** for blockchain |
| `/data/bitcoin` | Knots `datadir` (blocks, chainstate, `.cookie`) |

```bash
# Example: SSD as /data (adjust device; use UUID in /etc/fstab)
sudo mkdir -p /data
# sudo mkfs.ext4 /dev/sdX1   # only if new disk — destructive
# echo 'UUID=… /data ext4 defaults,noatime 0 2' | sudo tee -a /etc/fstab
sudo mount /data
sudo mkdir -p /data/bitcoin
sudo chown "$USER:$USER" /data/bitcoin   # or knots service user
```

Put in `bitcoin.conf`:

```ini
datadir=/data/bitcoin
server=1
txindex=0
prune=550
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
dbcache=512          # 512–1024 on 4–8 GB RAM; lower if OOM
maxconnections=40
rpcworkqueue=16
```

Cookie after start: **`/data/bitcoin/.cookie`** (not `~/.bitcoin/.cookie` when `datadir` is set).

### 2. systemd (sketch)

Install Knots for your arch (ARM64 on Pi). Point the unit at the conf/datadir your package expects, or override:

```ini
# /etc/systemd/system/bitcoind.service.d/override.conf  (names vary by package)
[Service]
# Example overrides — match upstream unit ExecStart
Environment=BITCOIN_DATA=/data/bitcoin
# or: ExecStart=… -datadir=/data/bitcoin -conf=/data/bitcoin/bitcoin.conf
Restart=on-failure
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now bitcoind    # or bitcoin-knots / package unit name
sudo systemctl status bitcoind
journalctl -u bitcoind -f               # watch first sync
```

Leave power + Ethernet stable for **days–weeks** of IBD. Do not unplug the SSD mid-write.

### 3. SSH tunnel (laptop/VPS → Pi RPC)

RPC stays **loopback on the Pi**. From a trusted machine:

```bash
# Local 18332 → Pi 127.0.0.1:8332 (pick any free local port)
ssh -N -L 18332:127.0.0.1:8332 pi@PI_HOST

# Other terminal — cookie file must match the Pi (scp once, mode 0600)
scp pi@PI_HOST:/data/bitcoin/.cookie /tmp/knots-pi.cookie
chmod 600 /tmp/knots-pi.cookie

python -m bip39lab balance bc1q… \
  --backend knots \
  --rpc-url http://127.0.0.1:18332 \
  --rpc-cookie /tmp/knots-pi.cookie
```

Or **Tailscale/WireGuard** to the Pi and use `http://100.x.y.z:8332` **only if** you also bind RPC carefully (prefer still `127.0.0.1` + tunnel). **Never** open `8332/tcp` on a public WAN interface.

### 4. “Ready” criteria (gate for bip39lab / seed-scan)

Run on the Pi (or via tunnel + cookie):

```bash
bitcoin-cli -datadir=/data/bitcoin getblockchaininfo
```

| Check | Ready value |
|-------|-------------|
| `initialblockdownload` | **`false`** |
| `blocks` vs `headers` | approximately **equal** (caught up) |
| `verificationprogress` | **≈ 1.0** (e.g. &gt; 0.999) |
| Cookie readable | `/data/bitcoin/.cookie` mode `0600` |
| RPC | `getblockcount` returns quickly |
| `scantxoutset` smoke | completes in reasonable time (not multi‑minute hang) |

```bash
# Smoke scantxoutset (abandon demo address — expect 0 or known result)
bitcoin-cli -datadir=/data/bitcoin scantxoutset start \
  '["addr(bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu)"]'

# bip39lab educational preflight (fails closed while IBD)
PYTHONPATH=src python3 scripts/seed_scan_educational.py \
  --rpc-cookie /data/bitcoin/.cookie --preflight-only
# expect: PREFLIGHT OK … ibd=False
```

**Not ready:** `initialblockdownload: true`, large `headers - blocks` gap, or `scantxoutset` timeouts — keep waiting; do not force seed-scan with `--allow-ibd` for production-quality results.

### 5. Quick ops checklist

- [ ] SSD mounted at `/data`, datadir `/data/bitcoin`  
- [ ] `prune=550` (or higher), `txindex=0`, RPC **127.0.0.1 only**  
- [ ] systemd enabled; node survives reboot  
- [ ] IBD finished (`initialblockdownload: false`)  
- [ ] Cookie path known; bip39lab `--rpc-cookie` points at it  
- [ ] Optional: SSH tunnel from operator laptop; no public `8332`  
- [ ] Then: seed-scan / private tools; **not** public Network tab RPC  

## Security

1. **RPC on 127.0.0.1 only** (or wireguard/VPN).  
2. Prefer **cookie** auth over long-lived passwords in env.  
3. Never paste mnemonics into balance tools — **address only**.  
4. Knots policy filters affect **relay/mempool**, not your ability to verify the chain or run `scantxoutset` for balances.  
5. **Pi datadir on SSD**, not SD card — reduces corruption risk during IBD.

## Educational seed UTXO scan (ops only — not a product feature)

Optional **hash-only** campaign: generate throwaway BIP-39 practice mnemonics, derive a tiny fixed address set (BIP84 + BIP44 index 0), run Knots `scantxoutset`, record **only** `sha256(normalized mnemonic)` under gitignored `.local/seed_scan/tested_mnemonic_sha256.txt`.

```bash
# Preflight (fails closed while IBD) — cookie path = your datadir
PYTHONPATH=src python3 scripts/seed_scan_educational.py \
  --rpc-cookie /data/bitcoin/.cookie --preflight-only

# Resume toward 2000 unique hashes (requires synced node — see Pi checklist §4)
PYTHONPATH=src python3 scripts/seed_scan_educational.py \
  --rpc-cookie /data/bitcoin/.cookie --target 2000
```

| Rule | Why |
|------|-----|
| **No mnemonic logging** | Constitution / AGENTS.md — never commit seed material |
| **Abort while IBD** | UTXO set incomplete; `scantxoutset` often times out under load |
| **Not a wallet finder** | Educational null-result sampling only; vanishingly unlikely hits are redacted hashes |

Spec: `.agents/specs/2026-08-10-knots-2000-seed-scan.md`.

## Relation to Network “Failed to fetch”

Public fee/balance via mempool.space is independent. Knots replaces the **privacy-sensitive address balance** path on the CLI (and optionally a future private host API), not the public fee snapshot.
