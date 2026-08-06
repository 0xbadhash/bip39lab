# Option C — Network page (fees / traffic / address balances)

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Updated:** 2026-08-06 (re-spec for current site)
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work (**Next:** true)
- **Plan:** `.agents/specs/2026-08-06-option-c-network-tab-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

BIP39 Lab and Multisig stay **offline for secrets** (correct). Users still want:

1. **Current fee context** (sat/vB bands),
2. Light **network “traffic”** (tip / mempool size),
3. Optional **balances** for addresses they already derived or paste,

without leaving the Catalyxt lab or pasting seeds into random explorers. Today **Balance** on the Lab is CLI documentation only.

## Solution

Ship a **separate static page** `web/network.html` (same card shell as Lab/Multisig) with its **own CSP** that allowlists public HTTPS APIs. Keep `index.html` and `multisig.html` on `connect-src 'none'`.

### Feature blocks (progressive disclosure)

| Block | Default | User action |
|-------|---------|-------------|
| **A. Fees** | Collapsed / idle | Checkbox “Fetch fee snapshot” → GET recommended fees |
| **B. Traffic** | Collapsed / idle | Checkbox or shared “Fetch network snapshot” → tip height + mempool count |
| **C. Balances** | Empty | Paste addresses **or** import from Lab `sessionStorage`; require **leak ack**; then Fetch |

English, bank-style help: fee ≠ price of bitcoin; balance check **reveals interest in those addresses** to the API host.

### Backend (free public)

- Primary: **mempool.space** Esplora-compatible REST (same family as CLI `--backend mempool`).
- Fail-closed: transport/parse errors → `unknown` / error UI, **never invent 0 sat**.
- No mnemonic / seed / xprv fields on Network page at all.

### Bridge from Lab (optional)

After Lab derive, store **only** `string[]` of addresses under:

```text
sessionStorage key: bip39lab.derivedAddresses
```

Network page may offer **“Load addresses from Lab (this browser tab session)”** — never mnemonics.

## User Stories

1. As a user, I open Network, opt in, and see fee bands + a simple “example tx cost” (documented vbytes).
2. As a user, I see tip height / mempool size for context (“how busy is the network”).
3. As a user, I check balances for addresses I just derived on Lab without retyping (session bridge) **after** acknowledging address leak.
4. As a user, Lab generate/derive still works fully offline with no network.

## Implementation Decisions

### Surfaces

- **New:** `web/network.html`, `web/js/network-app.js`, small `web/js/network-api.mjs` (fetch helpers, pure parse).
- **Nav:** Lab + Multisig + Network + About/Balance docs (Balance panel may link to Network for live checks).
- **nginx:** serve `network.html` under same `bip39.catalyxt.xyz` static root; CSP header for that path or meta-only (meta is enough if consistent with Lab).

### CSP (Network page only)

```text
default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:;
connect-src https://mempool.space;
base-uri 'none'; form-action 'none'
```

Lab/Multisig: **unchanged** `connect-src 'none'`.

### Fee display

- Endpoint e.g. `GET https://mempool.space/api/v1/fees/recommended` → fastestFee / halfHourFee / hourFee / economyFee / minimumFee (document actual fields used).
- Example costs: assume **~140 vB** simple 1-in-2-out P2WPKH (label as estimate).
- Show sat/vB and example total sats + BTC string.

### Traffic display

- Tip height: `GET /api/blocks/tip/height`
- Mempool: `GET /api/mempool` → count / vsize if present
- Educational disclaimer: not financial advice.

### Balances

- Per address: `GET /api/address/{addr}` → chain_stats funded − spent (same as Python mempool backend).
- Batch: sequential with small delay or Promise pool max 3; user-triggered only.
- Table: address | status | sats | detail; Copy on address.
- Leak ack checkbox required before enable Fetch.

### Privacy / safety copy

- Addresses leave the machine to mempool.space.
- Do not paste seeds here (no field provided).
- Prefer local bitcoind CLI for sensitive balances (link to Lab Balance docs).

## Testing Decisions

- Unit: pure parsers for fee JSON, address balance JSON, fail-closed on bad JSON.
- Node/js or Python mirror of parse helpers.
- Playwright: Network page loads; without ack balances disabled; with mock route optional OR live soft-skip if offline CI.
- Regression: Lab e2e still green; Lab HTML still `connect-src 'none'`.
- Manual: live fee fetch on VPS.

## Acceptance Criteria

- [ ] ACC.1 `web/network.html` live under bip39.catalyxt.xyz with Catalyxt shell + nav links from Lab/Multisig.
- [ ] ACC.2 Lab (`index.html`) and Multisig keep `connect-src 'none'` (grep/test).
- [ ] ACC.3 Fee snapshot: user opt-in → sat/vB bands + example cost; failure shows error/unknown, not 0.
- [ ] ACC.4 Traffic snapshot: at least tip height; optional mempool count; failure fail-closed.
- [ ] ACC.5 Address balance: requires leak ack; accepts paste and/or Lab sessionStorage list; never sends mnemonic.
- [ ] ACC.6 Balance failure ≠ silent zero; ok with true zero UTXOs allowed when API returns valid empty sum.
- [ ] ACC.7 English help for fees, traffic, privacy; English only.
- [ ] ACC.8 Unit tests for parsers + static CSP tests; product pytest green; extend Comet/Playwright with S13 Network (or document follow-up).
- [ ] ACC.9 ROADMAP Option C → DONE on ship; version bump (e.g. v0.10.0).

## Out of Scope

- Broadcasting / PSBT / coin control
- Automatic polling every N seconds
- bitcoind JSON-RPC from the browser (keep CLI)
- Multi-provider UI (mempool only for v1; blockstream optional later)
- Paying API keys

## Clarifications

### 2026-08-06 (initial)
- Q: Same page as Lab?
  - A: **No** — split `network.html` so Lab CSP stays airgap.
- Q: Spec only?
  - A: Yes until `/execute_dev`.

### 2026-08-06 (re-spec)
- Q: Product state now?
  - A: Lab + Multisig + watch-only shipped; Balance is docs-only; CLI mempool exists. Spec targets that layout.
- Q: Defaults for UI density?
  - A: Progressive disclosure; fee/traffic behind explicit fetch; balances behind leak ack.
- Q: Provider?
  - A: mempool.space only for v1 free public REST.

## Further Notes

- Constitution tension: network weakens privacy by design → mitigated by separate page + opt-in + no seeds.
- Rate limits: user-triggered only; show friendly error if 429.
- Comet E2E: add S13 after implement.

## Handoff

```text
next: /execute_dev
then: NEXT_SKILL → /pr_review --validate → /release_mgmt → /sync_docs
```
