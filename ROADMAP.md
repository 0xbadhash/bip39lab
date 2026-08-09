# ROADMAP — secure BIP39 / entropy lab

Each **phase below is a separate ship**. For every phase the agent must run the **full harness FSM**, including **`/spec`** first (or an explicit Spec waiver for hotfix/chore/docs-only only).

```text
/spec → /execute_dev → (reviews via NEXT_SKILL) → /pr_review --validate
  → /release_mgmt → /sync_docs  [→ optional /qa_campaign]
```

Phase numbers here are **product milestones**, not `pipeline.json` states (`init` | `ready_for_review` | `approved` | `blocked` | `shipped`).

---

## Phase 0 — Correctness lab (CLI, offline, no secrets)

**Outcome:** Safe foundation for derivation and validation with **zero network** and **zero secret retention**.

**In scope:**

- Quarantine or gut legacy scanner retention (`tested_mnemonics.json`, mnemonic logging).
- Remove `eval` of config; disable external APIs by default.
- Vendor BIP-39 English wordlist + checksum validation.
- Audited-library (or well-tested) BIP39/BIP32 path + BIP fixtures.
- CLI: entropy/mnemonic → addresses for BIP44/49/84 index 0 (demo paths).
- Tests: golden vectors; no disk write of seed material.

**Out of scope:** Web UI, balance APIs, multi-index scan UX.

**Ship rule:** Full FSM including `/spec`.

---

## Phase 1 — Static site (self-hosted, client-only crypto)

**Outcome:** Offline-capable static page for generate/paste mnemonic, entropy UI, path table, hide-private-info.

**In scope:**

- Bundled JS/WASM or equivalent; no third-party runtime CDNs for crypto.
- CSP-friendly static layout; clear airgap / save-as usage notes.
- Secrets in memory only; clear-on-leave pattern.

**Out of scope:** Server-side derivation; analytics; automatic explorer calls.

**Ship rule:** Full FSM including `/spec`.

---

## Phase 2 — Optional address-only balance

**Outcome:** User-consented balance lookup that **never** sends mnemonic/seed/xprv.

**In scope:**

- Explicit opt-in; address-only requests.
- Prefer local node / trusted Electrum; public explorers behind warnings.
- Fail-closed (`unknown` ≠ `0`).

**Out of scope:** Background scanning of random mnemonics; secret logging.

**Ship rule:** Full FSM including `/spec`.

---

## Phase 3 — Hardening & release hygiene

**Outcome:** Reproducible build, strict CSP, dependency policy, signed/static release notes.

**Ship rule:** Full FSM including `/spec` (or `/qa_campaign` after ship if large).

---

## Open work

### [DONE] Shamir recombine (educational, non-SLIP-39)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-08-shamir-recombine.md`
- **Acceptance:**
  - [x] Verify recombine reconstructs practice secret offline from M educational shares
  - [x] Fill M from cards (or equivalent) + match/mismatch vs practice secret field
  - [x] Errors on empty/bad/under-threshold input; no fake success
  - [x] Banner remains educational / not SLIP-39 / not for real funds (no wallet-safety claim)
  - [x] CSP offline; unit + Playwright S56; product smoke green
- **Smoke:** product smoke (pytest + e2e) + S53–S56
- **Notes:** Completes demo loop after v1 split; **not** SLIP-39. Gap-checked on top of Comet polish (`edb7220`).

### [DONE] Shamir secret sharing — left-nav tab (v1 teach + demo split)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-07-shamir-share-tab.md`
- **Plan:** `.agents/specs/2026-08-07-shamir-share-tab-plan.md`
- **Acceptance:**
  - [x] Nav step 3 **Shamir** on all shells (Lab → Multisig → Shamir → Network → Tools → Glossary)
  - [x] Offline page: teach Shamir vs Multisig vs BIP-39; educational / not SLIP-39 banner
  - [x] M-of-N demo split of practice secret → N share cards (no recombine UI)
  - [x] CSP `connect-src 'none'`; no Lab mnemonic auto-use; unit + Playwright smoke
- **Smoke:** product smoke (pytest + e2e) + S53–S55
- **Notes:** Educational GF(256); not SLIP-39; tag with ship

### [DONE] Phase 0 — Offline correctness lab
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-06-phase-0-correctness-lab.md`
- **Plan:** `.agents/specs/2026-08-06-phase-0-correctness-lab-plan.md`
- **Acceptance:**
  - [x] Vendored wordlist + SHA-256
  - [x] BIP-39 checksum validation
  - [x] Golden abandon…about addresses BIP44/49/84
  - [x] Offline CLI generate/validate/derive
  - [x] No secret retention / no seed logging
  - [x] Legacy scanner quarantined
- **Smoke:** `python -m pytest -q` + product_smoke
- **Notes:** Full FSM ship #1

### [DONE] Phase 1 — Static site
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-06-phase-1-static-site.md`
- **Notes:** Full FSM ship #2 — web/ + scure bundle

### [DONE] Phase 2 — Address-only balance
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-06-phase-2-address-balance.md`

### [DONE] Phase 3 — Hardening
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-06-phase-3-hardening.md`

### [DONE] Phase 4 — Local bitcoind address-only balance
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance.md`
- **Plan:** `.agents/specs/2026-08-06-phase-4-bitcoind-balance-plan.md`
- **Acceptance:**
  - [x] Backend `bitcoind` via library + CLI
  - [x] Offline default unchanged; fail-closed RPC
  - [x] Address-only; no mnemonic on balance path
  - [x] Mocked unit tests; docs prefer local node
- **Smoke:** product smoke + `pytest -q`
- **Notes:** Full FSM ship #5 — tag `v0.5.0`


### [DONE] Phase 5 — Catalyxt web brand + domain + free balance path
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-06-phase-5-web-brand-rpc.md`
- **Plan:** `.agents/specs/2026-08-06-phase-5-web-brand-rpc-plan.md`
- **Acceptance:**
  - [x] Catalyxt-aligned dark card UI on static web
  - [x] Domain branding `bip39.catalyxt.xyz` (not .ltd) + nginx deploy artifact
  - [x] Free `mempool` address-only backend + honest no-public-bitcoind-RPC docs
  - [x] Local bitcoind RPC setup docs; suite green
- **Smoke:** product smoke + pytest; manual free mempool call optional
- **Notes:** Shipped (site live; mempool backend; TLS). Tag lineage `v0.6.0`+


### [DONE] Phase 6 — Lab entropy fields (mnemonic + passphrase)
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields.md`
- **Plan:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields-plan.md`
- **Acceptance:**
  - [x] Mnemonic BIP-39 ENT bits (12→128 … 24→256) on Lab
  - [x] Separate passphrase strength estimate field (does not overwrite mnemonic ENT)
  - [x] Clear / hide-private / invalid handling; English; offline
- **Smoke:** open Lab on bip39.catalyxt.xyz; pytest green
- **Notes:** Full FSM ship (Next cleared — Shamir tab is Next)


### [DONE] Phase 7 — HTML address table + Option A derivation UX
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-06-phase-7-address-table-derivation-a.md`
- **Plan:** `.agents/specs/2026-08-06-phase-7-address-table-derivation-a-plan.md`
- **Acceptance:**
  - [x] HTML table, nowrap addresses, horizontal scroll
  - [x] Account / change / count 5|10|20
  - [x] BIP86 Taproot column + BIP84/49/44
  - [x] Auto-derive; BIP86 abandon vector
- **Notes:** tag `v0.7.0`

### [DONE] Option B — Watch-only (xpub / zpub / QR)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-06-option-b-watch-only-xpub-qr.md`
- **Plan:** `.agents/specs/2026-08-06-option-b-watch-only-xpub-qr-plan.md`
- **Acceptance:**
  - [x] Account public extended keys (zpub/xpub; no xprv by default)
  - [x] Offline per-address QR
  - [x] English watch-only help; CSP offline
- **Smoke:** pytest + manual QR/export
- **Notes:** Full FSM — tag `v0.8.0`


### [DONE] Multisig explainer (educational M-of-N)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-06-multisig-explainer.md`
- **Plan:** `.agents/specs/2026-08-06-multisig-explainer-plan.md`
- **Acceptance:**
  - [x] Multisig nav + plain-English explainer
  - [x] P2SH + P2WSH from public keys only
  - [x] BIP67 sort; refuse WIF/xprv
  - [x] Offline CSP; tests
- **Notes:** Inspired by iancoleman.io/multisig but safer/teaching-first — tag `v0.9.0`

### [DONE] Option C — Network page (fees / traffic / address balances)
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-06-option-c-network-tab.md`
- **Plan:** `.agents/specs/2026-08-06-option-c-network-tab-plan.md`
- **Acceptance:**
  - [x] `network.html` separate page; Lab/Multisig CSP stay offline
  - [x] Opt-in fee + traffic snapshots (mempool.space)
  - [x] Address-only balances + leak ack; Lab sessionStorage bridge
  - [x] Fail-closed; tests + Comet S13
- **Smoke:** pytest 45 · e2e 16 (local, includes live mempool.space S13b)
- **Notes:** tag `v0.10.0` — Network CSP allowlists mempool.space only

### [DONE] v0.7.1 — Table polish (UX)
- **Status:** done
- **Priority:** P0
- **Acceptance:**
  - [x] Wider layout; Copy on addresses
  - [x] Optional BIP49/BIP44 columns (default off)
  - [x] Plain-English help for account/change/indices
- **Notes:** tag `v0.7.1` matches live site UX

### [DONE] Lab tools pack (path, PSBT, descriptors, theme, …)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-07-lab-tools-pack.md`
- **Acceptance:**
  - [x] Tools panel: path playground, entropy pad, passphrase compare, descriptors, PSBT, descriptor explain
  - [x] Mainnet/testnet toggle; seed QR + print backup; Lab→Network handoff
  - [x] Multisig policy + cosigner checklist; Network fee bands + UTXO blurb
  - [x] Airgap chip, theme toggle, keyboard shortcuts, threat model
  - [x] Playwright S14 + Comet S0–S14 (6-nav)
- **Notes:** tag `v0.11.0`

### [DONE] Help UX hybrid (P0–P4)
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-07-help-ux-hybrid.md`
- **Acceptance:**
  - [x] P0 help-tip + help-fold CSS/JS
  - [x] P1 Lab long copy → tips/`details`
  - [x] P2 step rails Lab + Multisig (+ Network)
  - [x] P3 Teach On/Off localStorage
  - [x] P4 Multisig + Network same system
  - [x] Playwright S41–S48 + Comet
- **Notes:** tag with next ship (`v0.12.0`); safety copy never hover-only

### [DONE] About → Glossary (option B)
- **Status:** done
- **Acceptance:**
  - [x] 6-nav: Lab · Multisig · Network · Tools · Balance · Glossary
  - [x] Security + threat model under Glossary (not teach-only)
  - [x] `#about` redirects to glossary; e2e + Comet updated
- **Notes:** `v0.12.2`

## Current focus

**Shipped:** Shamir left-nav tab v1 + educational recombine (non-SLIP-39).  
**Later (not this ship):** SLIP-39 standard (integrity-checked wordlists + fixtures); private Knots proxy for Network.
