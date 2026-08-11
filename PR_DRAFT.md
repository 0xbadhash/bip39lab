# PR Draft: Knots educational seed-scan tooling (2000 campaign blocked on IBD)

**Range:** seed_scan module + CLI + tests + BITCOIN_KNOTS note  
**Spec:** `.agents/specs/2026-08-10-knots-2000-seed-scan.md`

## What Problem This Solves

Operators need a **safe, resumable** way to sample random practice seeds against local Knots `scantxoutset` with **hash-only** dedup — without logging mnemonics or shipping a public “wallet finder.”

## Why This Change Was Made

Prior 100/500 runs used ad-hoc ops; 2000 was deferred on RPC instability. Productize helpers with fail-closed **IBD preflight** so bulk runs cannot silently produce garbage balances.

## User Impact

- New library: `bip39lab.seed_scan` (hash store, preflight, batch scantxoutset).  
- CLI: `scripts/seed_scan_educational.py` (preflight / resume to target).  
- Docs: `docs/BITCOIN_KNOTS.md` educational scan section.  
- **Live bulk to 2000 not completed this ship:** Knots still **IBD** (`blocks≈941k` / `headers≈961k`); preflight exits 2; `scantxoutset` timed out at 300s during IBD. Hash file remains **500** lines.

## Evidence

- Unit: `tests/test_seed_scan.py` (7 passed)  
- Live preflight: `PREFLIGHT FAIL: … initialblockdownload=true`  
- Hash file: `.local/seed_scan/tested_mnemonic_sha256.txt` still 500 (gitignored)

## Traceability

| AC | Status / evidence |
|----|-------------------|
| AC-1 ≥2000 unique hashes | **blocked** — IBD; tooling ready; file still 500 |
| AC-2 Knots scantxoutset only | code path `scan_mnemonic_utxos` only scantxoutset |
| AC-3 No mnemonic in git/logs | unit asserts public dict; hash file only |
| AC-4 Summary counts | `summary_to_public_dict` / CLI JSON report |
| AC-5 Preflight IBD | `preflight_rpc` + live fail |
| AC-6 Docs note | `docs/BITCOIN_KNOTS.md` educational scan |

## Threat notes

- **secrets** — mnemonics never written; only sha256 hex; path gitignored.  
- **supply-chain** — reuses existing bip39lab derive + balance RPC; no new deps.  
- **xss** — N/A (ops CLI).  
- Fail closed on IBD prevents false “empty wallet” conclusions on incomplete UTXO set.

## Red-proof

```text
red_cmd: false
green_cmd: .venv/bin/python -m pytest tests/test_seed_scan.py -q
```

TDD: collection failed `ModuleNotFoundError bip39lab.seed_scan` → green 7 passed after implement.

## Evidence pack

- **hard_gates** / CODE-REVIEW  
- **pytest** `tests/test_seed_scan.py`  
- **smoke** product unit suite (targeted)  
- **validate** secrets scan on ship range  

## Things that look bad but are actually fine

1. **Target 2000 not met** — constitution prefers pause on unhealthy RPC over force-complete.  
2. **BIP86 not in address set** — Python core lacks BIP86; BIP84+BIP44 index 0 is documented minimal set.  
3. **Ops script under scripts/** — intentional; not web UI.  
