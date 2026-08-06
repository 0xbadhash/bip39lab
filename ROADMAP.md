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

### [PLANNED] Phase 3 — Hardening
- **Status:** planned
- **Priority:** P1

## Current focus

**In ship:** **Phase 0** — `/spec` ready → `/execute_dev`.
