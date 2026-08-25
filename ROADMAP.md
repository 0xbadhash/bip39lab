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

### [DONE] V2 picker path chrome + visual sprint
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-25-v2-picker-visual.md`
- **Smoke:** `npx playwright test e2e/v2.spec.ts -g "V2-S0"`
- **Notes:** chip 0.17.53-v2; product 0.16.48

### [DONE] V2 P0–P2 forensic tracks UC16–UC31
- **Status:** done
- **Priority:** P0
- **Spec:** `.agents/specs/2026-08-25-v2-p0-p2-tracks.md`
- **Smoke:** `npx playwright test e2e/v2.spec.ts`
- **Notes:** chip 0.17.47-v2; product 0.16.47

### [OPEN] V2 UC14 dice / coin entropy
- **Status:** done
- **Priority:** P0
- **Next:** true
- **Spec:** `.agents/specs/2026-08-24-v2-uc-entropy-dice-coin.md`
- **Plan:** `.agents/specs/2026-08-24-v2-uc-entropy-dice-coin-plan.md`
- **Acceptance:**
  - [x] Few d6 TOO LOW
  - [x] Minted 12 words still TOO LOW
  - [x] ~50 d6 ≥ 128 bits; coin = 1 bit
- **Smoke:** `npx playwright test e2e/v2.spec.ts -g V2-S15`
- **Notes:** grill-me complete via execute-dev defaults


### [OPEN] V2 UC1 compact grid + entropy
- **Status:** open
- **Priority:** P0
- **Next:** true
- **Spec:** `.agents/specs/2026-08-23-v2-uc1-compact-entropy.md`
- **Acceptance:**
  - [x] 24-word card three lines at 1920px
  - [x] ≥3 addresses on one line; no scroll to see them on 1920×1080
  - [x] Entropy bits for 12/15/18/21/24
- **Smoke:** `npx playwright test e2e/v2.spec.ts -g V2-S9`
- **Notes:** grill-me complete (operator brief)

### [OPEN] V2 UC1 generate chrome
- **Status:** open
- **Priority:** P0
- **Next:** true
- **Spec:** `.agents/specs/2026-08-23-v2-uc1-generate-chrome.md`
- **Depends:** V2 tracks shell
- **Acceptance:**
  - [x] Clear secrets on UC1 Generate row, not sidebar
  - [x] Word count 12, 15, 18, 21, 24
  - [x] Plain-English generate explainer; BIP-39 (i)
  - [x] Regenerate matches selected length including 15/18/21/24
  - [x] Classic `/` unchanged; e2e/v2.spec.ts
- **Smoke:** `npx playwright test e2e/v2.spec.ts`
- **Notes:** grill-me complete (operator `/spec` brief)

### [OPEN] Use-case tracks (mission-aligned IA)
- **Status:** locked brief 2026-08-23 (picker · force ack · UC3 next · keep rooms)
- **Priority:** P0
- **Mission:** Practice the custody decision offline, then do the real thing in a wallet you trust.
- **Spec:** `.agents/specs/2026-08-23-use-case-tracks.md`
- **Depends:** none (replaces “generic First hour tours entire product”)
- **Next:** true
- **Acceptance (epic):**
  - [ ] Mission sentence in README + site chrome (later stamp)
  - [ ] Entry is use-case picker; sidebar rooms remain
  - [ ] UC1 force-ack exit before optional Beginner tracks
  - [ ] UC3 is next track after UC1/UC2; uses existing `#cardCmpPp`
  - [ ] No new wallet/signer/broadcast surface

#### Ship order (agile slices — separate specs later)

| ID | Slice | Level | Notes |
|----|--------|-------|-------|
| UC1 | First wallet (safe & easy) | Starter | Generate → numbered card → one receive table → force ack exit |
| UC2 | Paper backup discipline | Starter | Card is the backup; print optional after confirm |
| UC3 | Passphrase (25th word) | Beginner | Existing Compare passphrases only |
| UC4 | Path folders + BIP map | Beginner | Existing Path playground + one BIP SVG |
| UC5 | Watch-only | Beginner | Existing descriptor tools |
| UC6 | Shared custody multisig | Intermediate | Existing Multisig room; keys ≠ shares |
| UC7 | Split secret Shamir | Intermediate | Existing Shamir; not SLIP-39 unless that page |
| UC8 | PSBT inspect / air-gap model | Intermediate | Existing PSBT inspector; never sign |
| UC9 | master → child / xpub threat | Advanced | Strip + existing advanced face |
| UC10 | Network leak / fees / balances | Advanced | Existing Network; unknown ≠ 0 |

Out of scope for this epic: reinventing pads, SeedSigner chrome, new tokens, merging rooms into an SPA, funded wallet onboarding that stores keys.

**V2 parallel surface (2026-08-23):** real tracks at `web/v2/` (`0.17.0-v2`). Classic `/` unchanged until CEO promote. Spec: `.agents/specs/2026-08-23-use-case-tracks-v2.md`.

This epic **does not implement UC1 UI** in the lock stamp. Next product work: separate `/spec` + `/execute_dev` for **UC1 only**.

### [OPEN] Slim Starter First-hour rail
- **Status:** open
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-21-slim-rail.md`
- **Plan:** `.agents/specs/2026-08-21-slim-rail-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] Slim 1–8 labels; one Go/Mark done for selected step
  - [ ] Clear secrets filled red; Mnemonic title
  - [ ] Stamp 0.16.24; leftovers hold
- **Smoke:** e2e/faces.spec.ts S102 + learn first-hour
- **Notes:** grill-me complete (locked brief)

### [OPEN] Gradual visual teach (Catalyxt skin)
- **Status:** open (draft — paint states await CEO lock)
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-22-gradual-visual-teach.md`
- **Depends:** Slim Starter First-hour rail
- **Next:** after slim-rail + paint-state yes
- **Acceptance:**
  - [ ] One `#labStrip`; `data-paint` Starter → Advanced
  - [ ] Unlit stages are hairline ghosts; lit stages use app-shell tokens only
  - [ ] Extra help Off hides captions, not the strip
  - [ ] No new `--cx-*`; no marketing/desk fork
- **Notes:** Teaching grows by lighting the same composition. A/B/C below are content, not skins.

### [OPEN] Teach-A — Pipeline interactivity
- **Status:** open
- **Priority:** P2
- **Depends:** Gradual visual teach
- **Acceptance:**
  - [ ] ENT slider paints entropy bar; checksum bits `--cx-ok`
  - [ ] LearnMeABitcoin *content* (bits → 11-bit → words → PBKDF2), Catalyxt *skin*
- **Notes:** Not a white textbook page.

### [OPEN] Teach-B — Numbered card specimen
- **Status:** open
- **Priority:** P2
- **Depends:** Gradual visual teach
- **Acceptance:**
  - [ ] Mnemonic is 3×4 / 4×6 numbered cells, not a textarea
  - [ ] Index badge; Intermediate bolds first-4 prefix
- **Notes:** Hardware-backup *object*, not wallet onboarding chrome.

### [OPEN] Teach-C — Air-gap actions on the card
- **Status:** open
- **Priority:** P2
- **Depends:** Teach-B + P0 lab-safety QR/print walls
- **Acceptance:**
  - [ ] Seed QR + print sit on the card object
  - [ ] Same `#3d8bfd` accent; no SeedSigner orange
- **Notes:** Instrument behavior, Catalyxt look.

### [DONE] Starter rail + Beginner/Advanced stills
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-sba-stills.md`
- **Plan:** `.agents/specs/2026-08-20-sba-stills-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] Starter 8-step rail beside live lab
  - [ ] Beginner three stills; Advanced PNG
  - [ ] Intermediate stills untouched; stamp 0.16.23
- **Smoke:** e2e/faces.spec.ts S102 S103 S104 S105
- **Notes:** grill-me complete (locked brief)

### [DONE] Intermediate app-shell stills
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-int-stills.md`
- **Plan:** `.agents/specs/2026-08-20-int-stills-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] Three locked PNGs visible on Intermediate
  - [ ] I1–I4 kept; 0.16.16–0.16.21 leftovers held
  - [ ] Stamp 0.16.22 + PW + comet
- **Smoke:** e2e/faces.spec.ts S104
- **Notes:** grill-me complete (locked brief)

### [DONE] Overlay OK-only
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-overlay-ok-only.md`
- **Plan:** `.agents/specs/2026-08-20-overlay-ok-only-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] One OK per overlay; no Cancel/Continue; OK runs action
  - [ ] 0.16.17 copy; Beginner 0.16.20 intact
  - [ ] Stamp 0.16.21 + PW + comet
- **Smoke:** e2e/faces.spec.ts S106 + lab overlay tests
- **Notes:** grill-me complete (locked brief)

### [DONE] Beginner visual (locked mock)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-beginner-visual.md`
- **Plan:** `.agents/specs/2026-08-20-beginner-visual-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] Tiles Q1–Q4 + visible key/dice/seed visual
  - [ ] No Guided quiz heading novel
  - [ ] Stamp 0.16.20 + PW + comet
- **Smoke:** e2e/faces.spec.ts S103 S108
- **Notes:** grill-me complete (locked brief)

### [DONE] Level faces (four gates)
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-level-faces.md`
- **Plan:** `.agents/specs/2026-08-20-level-faces-plan.md`
- **Acceptance:**
  - [ ] Four faces live at 0.16.19; later hidden until gate
  - [ ] 12-check not a fifth nav; 6 nav items
  - [ ] Local DS SVGs; PW + comet same ship
- **Smoke:** product smoke + e2e/faces.spec.ts F1–F7
- **Notes:** grill-me complete (locked brief)

### [DONE] Hover-(i) tips
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-hover-info-tips.md`
- **Plan:** `.agents/specs/2026-08-20-hover-info-tips-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] All (i) hover/focus, click not required
  - [ ] S42 Extra help Off; overlays still click/Continue
  - [ ] Stamp 0.16.18 + Playwright + comet
- **Notes:** grill-me complete (locked brief)

### [DONE] Overlay copy density
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-overlay-copy-density.md`
- **Plan:** `.agents/specs/2026-08-20-overlay-copy-density-plan.md`
- **Next:** true
- **Acceptance:**
  - [ ] Three overlay bodies dense, distinct, locked intent
  - [ ] S100 + comet updated; S80 still after Generate overlay
  - [ ] Stamp 0.16.17 lockstep
- **Notes:** grill-me complete (locked brief)

### [DONE] Reset to Starter intro + three Lab action overlays
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-20-reset-starter-lab-overlays.md`
- **Plan:** none
- **Next:** true
- **Acceptance:**
  - [ ] Reset sets Starter and lands on Offline BIP-39 lab intro with exact `#panel-sub` receive-addresses sentence
  - [ ] Three distinct overlays for Generate / Validate & derive / Clear secrets; Continue vs Cancel
  - [ ] S80 native replace confirm after Generate overlay; S81 missing-data after Derive overlay Continue
  - [ ] Playwright + comet + stamp 0.16.16 lockstep
- **Smoke:** product smoke + S99–S102 (Reset/overlays) + existing S80/S81/S85/S89
- **Notes:** grill-me complete (operator brief; no live interview)

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

### [DONE] Multisig teach UX polish
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-09-multisig-teach-ux.md`
- **Acceptance:**
  - [x] Calculator-only banner; jump-link step rail
  - [x] Dual chips CSP offline + browser airgap
  - [x] BIP67 off warning; zpub ≠ xpub; before-fund verify
  - [x] Fair Ian Coleman note; CSP/crypto unchanged
  - [x] Unit + Playwright S26/S28 extended; product smoke
- **Smoke:** pytest + e2e
- **Notes:** Shipped `v0.13.4` — teach-first Multisig surface; no crypto path change

### [DONE] Teach-surface jump-link consistency
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-09-teach-surface-jump-links.md`
- **Acceptance:**
  - [x] Lab/Network/Shamir “On this page” jump-link help + rail aria
  - [x] Drop forced step numbers; keep data-step-target anchors
  - [x] Network unknown-not-zero + Shamir use-case teach tighten
  - [x] Smoke green; CSP/crypto unchanged
- **Smoke:** product smoke
- **Notes:** Shipped `v0.13.5`

### [DONE] GapFix — Tools phrase source + teach clarity
- **Status:** done (ready_for_review)
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-09-gapfix-tools-phrase-source.md`
- **Acceptance:**
  - [x] Phrase source blurb + TEST DATA chip; `[TEST DATA]` / `[Lab phrase]` prefixes
  - [x] Clear secrets → Tools outs + status note next auto-gen TEST DATA
  - [x] Entropy d6≈2.58 / coin=1 teach + meta formula
  - [x] Descriptor definition; explain shapes + Load example
  - [x] Lab G/D/?/Esc teach; Tools shortcuts Lab-scoped
  - [x] pytest + no secrets
- **Smoke:** pytest 63 · e2e S17–S23 (7)
- **Notes:** Human-intuitiveness GapFix; no crypto path change


### [DONE] SLIP-39 lab A — teach shell
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-10-slip39-a-teach-shell.md`
- **Acceptance:**
  - [x] Offline slip39.html danger banner + comparison table
  - [x] Jump rail + demo placeholders; Shamir→SLIP-39 link
  - [x] CSP offline; unit + S57; no 7-nav
- **Smoke:** pytest + e2e S57
- **Notes:** Shipped `v0.13.7`; lab only; crypto in B

### [DONE] SLIP-39 lab B — compatible core
- **Status:** done
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-10-slip39-b-compatible-core.md`
- **Acceptance:**
  - [x] 2-of-3 / 3-of-5 split+combine offline
  - [x] Golden vector pytest; fail-closed errors
- **Smoke:** pytest + e2e S58–S59 (+ S60 partial C)
- **Notes:** Library wrap only (`shamir-mnemonic` + npm `slip39`)

### [DONE] SLIP-39 lab C — passphrase + groups teach
- **Status:** done
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-10-slip39-c-passphrase-groups.md`
- **Acceptance:**
  - [x] Wrong passphrase fail demo (scripted S60 + manual S60b)
  - [x] Multi-group diagram (`#s39GroupDiagram` data-group 1-of-1 + 2-of-3)
- **Smoke:** e2e S60/S60b + pytest wrong-passphrase
- **Notes:** Shipped `v0.13.9`; diagram-only multi-group (no live group split)

### [DONE] SLIP-39 lab D — docs/release notes
- **Status:** done
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-10-slip39-d-docs-release.md`
- **Acceptance:**
  - [x] ROADMAP A–C (and D) marked done; lab-only language retained
  - [x] README pages table + SLIP-39 offline page
  - [x] Comet S57–S60b + process flow Page 7
- **Smoke:** docs review + `check_web_e2e`
- **Notes:** Docs-only hygiene after A–C; no new crypto

### [OPEN] Knots 2000-seed educational UTXO scan
- **Status:** open (tooling shipped; bulk blocked on IBD)
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-10-knots-2000-seed-scan.md`
- **Acceptance:**
  - [ ] ≥2000 unique mnemonic **hashes** in `.local/seed_scan/` (resume from ~500) — **blocked 2026-08-11:** IBD + scantxoutset timeout
  - [x] Knots `scantxoutset` only; no mnemonic logging/commit — `bip39lab.seed_scan` + CLI
  - [x] Summary counts only; hits redacted — `summary_to_public_dict`
  - [x] Preflight fails closed on IBD — live verified
  - [x] Docs note — `docs/BITCOIN_KNOTS.md`
- **Smoke:** `scripts/seed_scan_educational.py --preflight-only`; pytest `tests/test_seed_scan.py`
- **Notes:** Ops only. Re-run CLI when `initialblockdownload=false`. Hash file still **500**.

### [DONE] Education levels E0–E6 (leveled classroom)
- **Status:** done
- **Specs:** `.agents/specs/2026-08-11-e0-orientation-first-hour.md` … `e6-private-knots-ops.md`
- **Notes:** Orientation, level chip, quiz, mobile CSS, three-splits tour, BIP-85 idea, ops card

### [OPEN] P0 lab-safety
- **Status:** open
- **Priority:** P0
- **Next:** true
- **Spec:** `.agents/specs/2026-08-18-p0-lab-safety.md`
- **Acceptance:**
  - [ ] Honest Lab banner
  - [ ] Seed QR / print walls + live mnemonic
  - [ ] Testnet default; session only on handoff
  - [ ] Leak-ack proxy + contrast

### [OPEN] A — Vault map object
- **Status:** open
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-13-a-vault-map.md`
- **Next:** true
- **Acceptance:**
  - [ ] `#msVaultMap` after Build
  - [ ] S72 Playwright + Comet

### [OPEN] B — Recovery drill
- **Status:** open
- **Priority:** P1
- **Spec:** `.agents/specs/2026-08-13-b-recovery-drill.md`
- **Depends:** A
- **Acceptance:**
  - [ ] Rebuild from map matches P2WSH
  - [ ] Without-map errors
  - [ ] S73

### [OPEN] C — Vendor-diversity Extra help
- **Status:** open
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-13-c-vendor-diversity.md`

### [OPEN] D — Demo ≠ multi-vendor
- **Status:** open
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-13-d-demo-not-vendor.md`

### [OPEN] E — M=1 policy warning
- **Status:** open
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-13-e-m1-policy.md`

### [OPEN] F — PIN / file password / BIP39 PP
- **Status:** open
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-13-f-password-words.md`

### [OPEN] G — Coordinator vs signer
- **Status:** open
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-13-g-coordinator.md`

### [OPEN] H — PSBT 1-of-2 partial sample
- **Status:** open
- **Priority:** P2
- **Spec:** `.agents/specs/2026-08-13-h-psbt-partial.md`

## Current focus

**Shipped:** through **`v0.13.10`** (SLIP-39 lab A–D docs stamp + Pi/Knots ops checklist in `docs/BITCOIN_KNOTS.md`). Live web stamp lineage **0.16.23**.  
**Next (UI):** Slim Starter rail **0.16.24**, then **Gradual visual teach** if paint states lock.  
**Next (ops):** Pruned Knots on Pi/SSD until IBD complete → finish **2000-seed** hash campaign.  
**Later:** Teach-A/B/C content modules inside app-shell; private Knots balance proxy — not public Network.  
**Out of scope:** 7th sidebar nav for SLIP-39; new visual skins (SeedSigner / Ian / marketing variant).
