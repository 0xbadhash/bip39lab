# Option C — Network tab (fees / traffic / address balances)

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-06-option-c-network-tab-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

The Lab is offline for secrets (correct), but users still want **current fee context**, light **network activity**, and optional **balances for addresses they already derived** — without pasting into random explorers manually every time.

## Solution

Add a separate **Network** nav tab (not mixed into the mnemonic card):

1. **Fee snapshot (opt-in):** fetch recommended sat/vB (e.g. mempool.space `/v1/fees/recommended`); show example cost for a typical simple tx size (document assumptions). Fail-closed on error.
2. **Network “traffic” (opt-in):** tip height, mempool tx count / vsize if available from same free API — educational only, not trading advice.
3. **Address-only balances for table rows (opt-in):** for addresses currently listed in Lab (or pasted address list), query free REST (`mempool` backend already in CLI) with **explicit leak acknowledgment**. Never send mnemonic/seed/xprv. Fail-closed (`unknown` ≠ 0).
4. **CSP:** Lab page stays strict; Network tab uses a document or meta policy that allowlists only chosen HTTPS hosts (or split `network.html` static page with tighter mental model). Prefer **split static page** `web/network.html` with its own CSP `connect-src` allowlist so the main Lab can keep `connect-src 'none'`.

## User Stories

1. As a user, I open Network, accept “fetch public data”, and see current fee bands.
2. As a user, I opt in to check balances for the 5 receive addresses I just derived — only addresses leave the machine.
3. As a user, main Lab generate/derive still works fully offline with no network.

## Implementation Decisions

- **Split page recommended:** `web/index.html` (Lab, offline CSP) vs `web/network.html` (opt-in network CSP) linked from nav.
- Reuse CLI patterns conceptually: leak ack, mempool REST, fail-closed.
- Pass addresses via `sessionStorage` only as optional convenience (addresses are public) or manual paste — **never** store mnemonic.
- English only; Catalyxt card shell.
- Rate limits: document; debounce batch balance.

## Testing Decisions

- Mock fetch for fees/balances unit tests (or pure functions + mock opener if shared JS module).
- Manual: network page with ack; Lab page still no connect.
- pytest suite remains green.

## Acceptance Criteria

- [ ] ACC.1 Network surface exists (tab and/or `network.html`) separate from secret entry.
- [ ] ACC.2 Fee snapshot works with opt-in; failures show unknown/error, not fake zeros.
- [ ] ACC.3 At least one “traffic” metric (e.g. tip height or mempool count) with opt-in.
- [ ] ACC.4 Balance check for one or more addresses requires leak ack; mnemonic never sent.
- [ ] ACC.5 Main Lab CSP remains offline for crypto (`connect-src 'none'` on lab document).
- [ ] ACC.6 English help: what is fee, what balance means, privacy cost of address queries.
- [ ] ACC.7 Tests/smoke green.

## Out of Scope

- Broadcasting transactions / PSBT builder
- Option B xpub (separate ship)
- Paid RPC providers as required dependency (optional later)
- Auto-refresh polling spam

## Clarifications

### 2026-08-06
- Q: Same page as Lab?
  - A: Prefer **split page** so Lab stays airgap-CSP.
- Q: Spec only now?
  - A: Yes — implement via `/execute_dev` later.

## Handoff

- Next: `/execute_dev` (Option C) — ideally after or independent of B
- Then: full FSM ship
