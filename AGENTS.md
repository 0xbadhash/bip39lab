# AGENTS.md — bip39lab + agent harness

Contract for any coding agent working in this repo.

**GitHub:** `0xbadhash/bip39lab` (local folder may still be named `bitcoin-scripts`).

## Product intent

**Secure, no-retention BIP-39 / entropy / derivation lab** (Ian Coleman–style capability), self-hosted and offline-first. Prefer **local bitcoind** for address balance when available. Users must be able to generate and inspect entropy, mnemonics, seeds, and addresses **without** third parties seeing seed material and **without** the tool retaining secrets.

**Not** a funded-wallet brute-force scanner. Random mnemonic “lottery” and secret logging are anti-goals.

### Security non-negotiables

1. **No retention** of mnemonics, entropy, seeds, xprv, or private keys (disk, logs, telemetry, default storage).
2. **Offline-first** crypto; network only for **opt-in, address-only** balance checks.
3. **No `eval` / executable config** for parsers or balance extractors.
4. **Vendored wordlists** with integrity checks (no silent network wordlist fetch).
5. **Production derivation path** uses audited libraries + BIP fixtures; hand-rolled ECC is educational only.
6. **Full BIP-39 checksum** validation; passphrase support when implementing seed derivation.
7. Balance/API failure must be **unknown**, never silently **zero**.
8. Never commit real RPC passwords or `tested_mnemonics.json`-style secret stores.

Legacy root files (`brute-force-btc.py`, conf, mnemonic log) are **debt** to retire or quarantine under Phase 0 — not the security model for the product.

## Agent harness (ship pipeline)

Portable skills under `.agents/skills/` from **agent-harness** (`HARNESS_VERSION` in `.agents/`).

```text
init
  → /spec                 # REQUIRED for features (or Spec waiver: hotfix|chore|docs-only)
  → /execute_dev          # implement (TDD); runs spec_gate
  → /code_review          # required closeout (non-prose)
  → /cross_review         # if NEXT_SKILL says so (large)
  → /behavior_validator   # if NEXT_SKILL says so (runtime)
  → /pr_review --validate # hard gates + score ≥ 95 → approved
  → /release_mgmt         # smoke + tag → shipped
  → /sync_docs            # docs stamps → init
  → /qa_campaign          # only if large ship (or --force-qa)
```

### Full FSM for every product phase

This product’s **ROADMAP.md phases** (0, 1, 2, …) are **not** a substitute for the ship FSM.  
**For each roadmap phase you implement, run a complete ship cycle**, always starting with **`/spec`** (unless an explicit Spec waiver applies):

```text
/spec → /execute_dev → NEXT_SKILL… → /pr_review --validate → /release_mgmt → /sync_docs
```

Do not batch multiple roadmap phases into one vague ship without separate specs.

**Start a feature:** `.agents/docs/start-a-feature.md`  
`python scripts/start_feature.py --slug my-feature --write-spec-stub`

**Any LLM:** load `SKILL.md` from `.agents/skills/<name>/` when the user names `/name`.  
**Do not invent the next step** — run:

```bash
python scripts/next_skill.py --after <skill_just_finished>
```

and follow the printed `NEXT_SKILL=…` line.

Docs: `.agents/docs/llm-bootstrap.md`, `.agents/docs/ship-flow.md`, `.agents/docs/start-a-feature.md`.

| Check | Command |
|-------|---------|
| Phase | `python scripts/pipeline_state.py get` |
| Skills | `python scripts/verify_skills.py` |
| Install health | `bash scripts/bootstrap_check.sh` |
| Smoke | `python scripts/product_smoke.py --root .` |
| Spec gate | `python scripts/spec_gate.py --root .` |

Pipeline state: `.agents/state/pipeline.json`  
Plugin: `.agents/product_plugin.yaml`  
Roadmap: `ROADMAP.md`

## One-shot user phrase (per roadmap phase)

```text
Full FSM for Phase <N> (<title>): /spec then /execute_dev then follow NEXT_SKILL
(/code_review, /cross_review, /behavior_validator as routed) then
/pr_review --validate then /release_mgmt then /sync_docs
```
