# Plan: Phase 5 — Catalyxt web brand + domain + free balance path

- **Spec:** `.agents/specs/2026-08-06-phase-5-web-brand-rpc.md`
- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent

## Stack & constraints

- Static `web/` (HTML/CSS/JS); no new SPA framework.
- Python CLI balance in `src/bip39lab/balance.py` + `cli.py`.
- Constitution: no seed retention; address-only network; fail-closed balances.
- Catalyxt palette source: `catalyxt.ltd/src/index.css` `@theme` colors.

## Approach

1. Restyle `web/css/app.css` (+ light HTML structure for cards) using Catalyxt tokens.
2. Add `mempool` REST backend parallel to `blockstream`.
3. Document free review + local bitcoind RPC; add nginx deploy snippet for `bip39.catalyxt.ltd`.
4. Defer browser balance panel unless trivial after CLI; keep CSP `connect-src 'none'` unless web balance is explicitly implemented with allowlist.

## Architecture decisions

### Free “node” for balance review

| Choice | Detail |
|--------|--------|
| Primary free | **mempool.space** REST: `GET https://mempool.space/api/address/{address}` → map `chain_stats.funded_txo_sum - spent_txo_sum` (same model as blockstream) |
| Alternate free | Existing **blockstream.info** |
| Real JSON-RPC | User’s **bitcoind** only (`--backend bitcoind`) |
| Not offered | Fake “public Core RPC URL” — does not exist safely free |

### CSS token map (Catalyxt → bip39lab)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#15212a` | page background (primary-darker) |
| `--panel` | `#253a4b` | cards (primary-dark) |
| `--panel-border` | `#3f586e` | card border (primary) |
| `--fg` | `#fdfcfd` | body text (neutral-white) |
| `--muted` | `#7fb1d6` | labels (secondary-lightBlue) |
| `--accent` | `#1e5799` | buttons (secondary-blue) |
| `--accent-hi` | `#b8e0f6` | tags / focus (secondary-skyBlue) |
| `--danger` | keep red | clear secrets |
| Watchlist card | rounded, border, elevated panel | `.card` class |

### Deploy

```text
deploy/nginx-bip39.catalyxt.ltd.conf
  root → path to bip39lab/web
  try_files $uri $uri/ =404;
  add_header Content-Security-Policy "..." (match or tighten web meta CSP)
```

TLS: certbot once DNS live (operator).

### File map

| Area | Change |
|------|--------|
| `web/css/app.css` | Catalyxt tokens + card layout |
| `web/index.html` | Card structure, hostname in title/footer |
| `src/bip39lab/balance.py` | `fetch_mempool` + backend wiring |
| `src/bip39lab/cli.py` | `--backend mempool` |
| `tests/test_balance.py` | mempool mocks |
| `README.md` / `SECURITY.md` | free review + RPC honesty |
| `deploy/nginx-*.conf` | static host |
| `ROADMAP.md` | OPEN → DONE at ship |

## Implementation sequence

1. Red tests for mempool backend.
2. Green implementation + CLI.
3. Web visual restyle.
4. Deploy config + docs (domain, free endpoint, bitcoind cookie).
5. Smoke / validate.

## Testing plan

- Unit: mempool ok / HTTP fail unknown / no ack error / mnemonic error.
- Visual: manual open `web/index.html` (or static server).
- Optional live: `balance … --backend mempool --i-understand-address-leak` (not CI gate).

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| User expects free Core RPC | Spec/docs explicit “REST free; RPC = your node” |
| CSP vs web balance | Prefer CLI-only network in this slice |
| Rate limits | Fail-closed; document |
| Brand drift | Token table from catalyxt SoT |

## Open questions

None blocking.
