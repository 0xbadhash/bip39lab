# Phase 5 — Catalyxt-branded web lab + domain + balance RPC path

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-06-phase-5-web-brand-rpc-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

1. The static BIP39 lab looks generic and does not match the **Catalyxt / watchlist** visual system operators already use.
2. There is no first-class **public hostname** for the lab (only local `web/`).
3. Operators want a **working balance check** against a free remote endpoint for review, without running full Bitcoin Core yet — while still preferring real `bitcoind` when available.
4. True open Internet **Bitcoin Core JSON-RPC** (`scantxoutset`) is almost never free/public; users need a clear, safe substitute and honest docs.

## Solution

Ship a **visual + deploy + balance-path** slice:

1. **Web UI** restyled to Catalyxt palette (dark-first, card surfaces, sky/primary blues) — same family as catalyxt.ltd + watchlist loading/cards — without becoming a React SPA.
2. **Domain:** **`bip39.catalyxt.xyz`** only (operator DNS). **`catalyxt.ltd` is retired** for new work — do not brand or deploy there.
3. **Balance backends (CLI first, optional web address-only panel):**
   - Keep **`bitcoind`** (local/trusted JSON-RPC).
   - Keep **`blockstream`** (REST; leak ack).
   - Add **`mempool`** free public REST backend (`https://mempool.space/api`) for address balance — same address-only + leak-ack rules as explorers.
   - Document: **there is no reliable free public `bitcoind` JSON-RPC** for arbitrary Internet clients; free review path = **mempool.space** or **blockstream.info** REST, not Core RPC.
4. **RPC “setup properly”:** env file example, cookie vs user/pass, mainnet/regtest ports, fail-closed behavior, one-shot smoke commands against free REST and against local RPC when present.

## Domain (operator DNS)

| Hostname | Notes |
|----------|--------|
| **`bip39.catalyxt.xyz`** | Only brand domain. Same host pattern as `card.catalyxt.xyz`. |
| ~~`*.catalyxt.ltd`~~ | **Retired** for new products — ignore. |

**Operator:** DNS A for `bip39` → VPS (done).  
**Agent:** TLS + nginx static (card-style edge), English UI only.
## User Stories

1. As an operator, I open `https://bip39.catalyxt.ltd` and recognize Catalyxt dark cards/blues, with clear offline-secret warnings.
2. As a reviewer, I run CLI balance against a **free** public endpoint without owning a full node.
3. As a security-conscious user, I never send mnemonic/seed over the network; balance is address-only and opt-in.
4. As an operator with bitcoind later, I switch to `--backend bitcoind` without changing the product model.

## Implementation Decisions

### Visual (web)

- Map Catalyxt tokens into `web/css/app.css` CSS variables (dark default):
  - bg: `#15212a` (primary-darker)
  - panel/card: `#253a4b` / elevated borders
  - accent: `#1e5799` / sky `#b8e0f6` / lightBlue `#7fb1d6`
  - text: near `#fdfcfd` / muted `#7fb1d6`
  - danger/warn retained for secret warnings
- Card layout: main sections as bordered rounded panels (watchlist-style card, not table product).
- Optional light theme toggle only if low-risk (localStorage theme key like Catalyxt) — **default dark**.
- No third-party font CDNs if it breaks airgap story; system stack OK, or self-host later.

### Balance / “free RPC”

| Backend | Protocol | Free? | Use |
|---------|----------|-------|-----|
| `mempool` | REST `GET /api/address/{addr}` | Yes (public) | **Default free review target** |
| `blockstream` | REST (existing) | Yes | Alternate |
| `bitcoind` | JSON-RPC `scantxoutset` | Only **your** node | Preferred when available |
| Public Core RPC | JSON-RPC open | **No practical free host** | Do not pretend one exists |

**Canonical free review command (target for docs + acceptance):**

```bash
python -m bip39lab balance <address> \
  --backend mempool \
  --i-understand-address-leak
```

Endpoint base: `https://mempool.space` (mainnet). Optional later: `https://mempool.space/testnet/api` as `mempool-testnet` if needed — out of minimum slice unless free.

### Web vs network tension (constitution)

- **Default:** keep crypto offline; secrets never leave the page.
- **If web balance ships in this phase:** address-only control, explicit leak checkbox, CSP `connect-src` limited to `https://mempool.space` (and optionally blockstream) — **never** put RPC password in the browser; **never** call bitcoind from browser.
- Prefer **CLI balance** for v1 of free review if web CSP change is deferred; UI can still show “check balance via CLI” snippet. Spec allows either; plan prefers **CLI `mempool` + branded static site first**, web balance panel as stretch if time-safe.

### Domain / deploy

- `deploy/nginx-bip39.catalyxt.ltd.conf` (or under `deploy/`) serving `web/` static.
- README: DNS checklist for operator + deploy steps.
- Do not commit TLS private keys or live RPC passwords.

## Testing Decisions

- CSS tokens present in built/static CSS (grep or snapshot of key variables).
- `mempool` backend: mocked HTTP unit tests (success / fail-closed / requires ack / rejects mnemonic).
- Existing blockstream + bitcoind tests remain green.
- Product smoke pytest.
- Manual: free live call to mempool for a known address (optional, not CI-hard).

## Acceptance Criteria

- [ ] AC5.1 Web CSS uses Catalyxt-aligned tokens (documented mapping to catalyxt `primary*` / `secondary*` palette); dark card layout visible in `web/`.
- [ ] AC5.2 Branding copy references product hostname **`bip39.catalyxt.ltd`** (or agreed alternate) in README/web chrome.
- [ ] AC5.3 Deploy artifact: nginx (or equivalent) static site config for that hostname.
- [ ] AC5.4 New CLI backend `mempool` (free public REST) with leak ack, address-only, fail-closed.
- [ ] AC5.5 Docs list free review target (`mempool.space`) and honestly state **no free public bitcoind JSON-RPC**; document local bitcoind RPC setup (cookie/env).
- [ ] AC5.6 Mnemonics still never accepted on any balance path; offline default unchanged.
- [ ] AC5.7 Unit tests for mempool backend; full suite green; product smoke green.
- [ ] AC5.8 CSP policy documented: if web stays offline-only, `connect-src 'none'` preserved; if web balance added, `connect-src` is allowlist-only and secrets never transmitted.

## Out of Scope

- Shipping a full Bitcoin Core node or paid node subscription
- Browser → bitcoind RPC (password/cookie in browser)
- Electrum protocol (may be later phase)
- Multi-index derive UX expansion (separate `/spec` unless trivial)
- Changing Python derivation crypto libraries

## Clarifications

### 2026-08-06
- Q: Domain name?
  - A: Recommend **`bip39.catalyxt.ltd`**; operator configures DNS; agent owns static deploy + docs.
- Q: Free RPC node URL for true Core JSON-RPC?
  - A: **None reliable/public.** Free balance review uses **mempool.space REST** (and existing Blockstream). Local/trusted bitcoind remains the real JSON-RPC path.
- Q: Match Catalyxt exactly?
  - A: Same colour family and card/dark theme as catalyxt.ltd + watchlist cards; static HTML/CSS (not full Catalyxt React stack).
- Q: Interview depth?
  - A: User provided outcome in one message; defaults applied; no further interview blocking.

## Further Notes

- **Constitution tension:** opening `connect-src` for explorer REST weakens pure airgap web story — mitigate with explicit UI consent + address-only + docs “prefer airgap for real seeds.”
- Free public endpoints **see the address** (interest leak) — same class as Phase 2 explorers.
- Rate limits on mempool.space may apply; fail-closed on HTTP errors.

## Handoff

- Next: `/execute_dev` (TDD for `mempool` + visual/deploy docs)
- Then: `NEXT_SKILL` → … → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
- **Blocked on operator:** DNS for `bip39.catalyxt.ltd` before live TLS cutover (config can still land in repo).
