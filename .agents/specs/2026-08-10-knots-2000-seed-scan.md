# Knots 2000-seed educational UTXO scan

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** ready-for-agent
- **Priority:** P2
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none (ops/script task; optional thin plan if productized CLI)
- **Tracker:** local
- **Constitution:** AGENTS.md (no secret retention; no funded-wallet brute force product)

## Problem Statement

Operators want a **larger educational null result** sample: random BIP-39 practice phrases → derive a few receive addresses → query **local Bitcoin Knots** `scantxoutset` for current UTXO balance. Prior runs covered **100** then **500** seeds with **hash-only** dedup under `.local/seed_scan/`. A **2000**-seed pass was deferred when RPC/tunnel became unstable under load/IBD. Without a written contract, re-runs risk logging mnemonics or treating the tool as a “wallet finder.”

## Solution

Run (or finish a resumable) **2000 unique** educational seeds against Knots with the same safety model as the 500-run:

1. Generate valid BIP-39 English mnemonics (throwaway practice entropy).  
2. Derive a **small fixed set** of mainnet receive addresses (e.g. BIP84/86 account 0 index 0 only — document exact set).  
3. For each address: Knots/Core JSON-RPC `scantxoutset` (address-only).  
4. Record **only** `sha256(mnemonic_normalized)` in `.local/seed_scan/tested_mnemonic_sha256.txt` (gitignored).  
5. Aggregate counts: unique new, hits (balance > 0), RPC errors, skip-already-hashed.  
6. **Never** log, print, or commit mnemonics, seeds, or raw addresses of hits in git or public artifacts (hits → redacted local note only).

## User Stories

1. As an operator, I resume toward **2000 unique hashes** without re-testing the same mnemonic.  
2. As an operator, I get a summary (N scanned, N hits, N errors) without secret material in the report.  
3. As a product owner, I never ship this as a “find free bitcoin” feature in the public web UI.

## Implementation Decisions

| Decision | Choice |
|----------|--------|
| Target count | **2000** unique mnemonic hashes total (resume from existing ~500 file) |
| Node | Bitcoin **Knots** (or Core) local/tunnel RPC — cookie auth preferred |
| Method | `scantxoutset` address-only — same as `bip39lab balance --backend knots` |
| Dedup store | `.local/seed_scan/tested_mnemonic_sha256.txt` — one hex sha256 per line |
| Hash input | Normalized mnemonic (NFKD optional; document: lowercase? space-collapse — match prior 500-run) |
| Address set | Minimal: at least BIP84 `m/84'/0'/0'/0/0` and BIP86 `m/86'/0'/0'/0/0` for each seed (or match prior scan script) |
| Parallelism | Low (1–2 concurrent scantxoutset) to avoid killing Knots under IBD |
| Product UI | **Out of scope** — operator script / subagent only |
| On hit | Stop batch optional; never write mnemonic to disk; alert operator privately |

## Clarifications

### 2026-08-10 (from prior ops history)

- Q: Why not 2000 already?  
  - A: 100 and 500 completed with 0 hits; 2000 aborted when RPC/tunnel died under scantxoutset load / IBD.  
- Q: Log mnemonics for audit?  
  - A: **No.** Hashes only (AGENTS.md / constitution).  
- Q: Public explorer fallback?  
  - A: **No** for this campaign (address leak + rate limits). Knots only.  
- Q: Is this a product ROADMAP feature?  
  - A: Optional open ops item; not a web surface. Fail closed if RPC unhealthy.

## Testing Decisions

- Unit (if script lands in repo): hash normalization + skip-if-seen; mock RPC → no mnemonic in outputs.  
- Ops verify: file line count ≥ 2000 after success; `grep` artifacts for BIP-39 word patterns → none.  
- Smoke: single seed end-to-end against live Knots before bulk.

## Acceptance Criteria

- [ ] Reach **≥ 2000** unique lines in `.local/seed_scan/tested_mnemonic_sha256.txt` (or document partial stop with RPC reason)  
- [ ] Run uses Knots/Core **scantxoutset** only (no public explorer)  
- [ ] **No mnemonic** in git, logs committed to repo, or public CI artifacts  
- [ ] Summary report: `scanned_new`, `skipped_dup`, `hits`, `rpc_errors` (hits detail redacted)  
- [ ] Preflight: `getblockchaininfo` / RPC auth ok; abort if IBD + operator policy says wait  
- [ ] Docs note in `docs/BITCOIN_KNOTS.md` or short ops note: educational null-scan, hash-only, not a product scanner  

## Out of Scope

- Web UI “seed scanner”  
- Legacy `tested_mnemonics.json` / mnemonic retention  
- Multi-index deep derivation trees (keep address set tiny)  
- Claiming statistical security proofs from 2000 samples  
- Force-completing 2000 while Knots is unhealthy (prefer pause + document)

## Risks

| Risk | Mitigation |
|------|------------|
| RPC die / tunnel drop | Preflight; batch size; resume by hash file |
| Accidental mnemonic log | Code review of script; redact logs; .gitignore `.local/seed_scan/` |
| Misread as product feature | ROADMAP notes + lab constitution language |
| Hit on random seed (vanishingly unlikely) | Redacted alert; do not publish address/mnemonic |

## Handoff

- Next: `/execute_dev` when Knots RPC is stable (cookie + not thrashing under IBD)  
- Prefer isolated subagent with hash-dedup; no seed logging  
- Then optional docs-only PR if a small script is promoted into `scripts/` (still no secrets)
