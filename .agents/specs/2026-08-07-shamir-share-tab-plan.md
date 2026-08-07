# Plan: Shamir share tab (v1 teach + demo split)

- **Spec:** `.agents/specs/2026-08-07-shamir-share-tab.md`
- **Product:** bip39lab
- **Created:** 2026-08-07
- **Status:** ready-for-agent

## Stack & constraints

- **Languages:** Python (CLI/tests optional), static web (HTML/CSS/JS) as today.
- **Crypto page CSP:** `connect-src 'none'` (Lab/Multisig class).
- **No** new network backend; no RPC; no seed retention.
- **Not** SLIP-39 in v1 — educational GF-based or documented toy SSS over bytes.

## Approach

Add `shamir.html` + offline bundle/app JS that exposes a pure **split** API. Teach UI mirrors Multisig card density (step rail, help tips, danger banner). Wire **6-nav** on every shell page. Unit-test the split seam; Playwright the shell + happy-path split.

## Architecture decisions

| Decision | Choice |
|----------|--------|
| Page | `web/shamir.html` + `web/js/shamir-app.js` (+ small pure module / bundle if needed) |
| Split algorithm | Educational Shamir over secret **bytes** (document field size, e.g. GF(256)); encode shares as hex or `index:hex` lines |
| Recombine | **No UI**; optional pure `combine` used only in unit tests to prove correctness |
| Secret source | “Generate practice” (CSPRNG bytes) + textarea for practice text; **no** Lab bridge in v1 |
| Nav order | 1 Lab · 2 Multisig · **3 Shamir** · 4 Network · 5 Tools · 6 Glossary |
| Glossary | Term entries: Shamir, threshold, share (vs cosigner) |

### Explicit non-decisions (deferred)

- SLIP-39 wordlists / Trezor interop  
- Share QR / print sheet  
- Using Lab mnemonic as secret  
- Recombine UI  

## File / surface map (indicative)

| Area | Change |
|------|--------|
| `web/shamir.html` | New page: teach, M/N, generate, split, share cards |
| `web/js/shamir-*.js` | Pure split (+ test-only combine) + UI wiring |
| `web/index.html`, `multisig.html`, `network.html` | Nav item + renumber steps |
| `web/css/app.css` | Share cards if needed (reuse card patterns) |
| `web/js/glossary.js` | Shamir-related terms |
| `e2e/helpers.ts` + specs | NAV length 6; `shamir` id; S* scenarios |
| `docs/E2E_COMET_SCENARIOS.md` | Shamir surface |
| `tests/` | Unit tests for split/combine math |
| `.agents/product_plugin.yaml` | web_e2e surface for shamir |

## Implementation sequence

1. **TDD:** implement pure `split` (+ internal `combine`) with pytest or node tests — fixed vectors + random round-trip.
2. **Page shell:** `shamir.html` offline CSP, brand, 6-nav, teach copy, danger banner.
3. **UI wire:** M/N controls, generate practice secret, split → N cards + copy.
4. **Nav parity:** all pages + helpers + Comet.
5. **Glossary + Teach tips** on Shamir labels.
6. **E2E** smoke + product smoke green.

## Testing plan

| Layer | What |
|-------|------|
| Unit | split/combine round-trip; reject M>N, M<2, empty secret |
| E2E | S-shell CSP, nav 6, split 2-of-3 shows 3 cards, banner text |
| Smoke | plugin unit + e2e |
| Manual | DevTools Network empty; clear page leaves no secrets on disk |

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Users trust demo shares for real funds | Permanent danger banner; not SLIP-39; no “print recovery” framing for production |
| Buggy SSS | Unit round-trips; cap N; educational labeling |
| Nav thrash vs v0.12.3 | Document 6-nav feature addition in release notes |
| Confusion with Multisig | Side-by-side teach table on page |

## Open questions

None for v1 — deferred SLIP-39 / recombine UI explicitly out of scope.
