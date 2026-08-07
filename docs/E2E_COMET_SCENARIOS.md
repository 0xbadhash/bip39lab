<!-- WEB_E2E_CONTRACT
version: 1
base_url: https://bip39.catalyxt.xyz
surfaces:
  - id: lab
    path: /
    playwright: e2e/lab.spec.ts
  - id: multisig
    path: /multisig.html
    playwright: e2e/multisig.spec.ts
  - id: network
    path: /network.html
    playwright: e2e/network.spec.ts
  - id: chrome
    path: /
    playwright: e2e/site-chrome.spec.ts
scenarios: S0–S55 exhaustive · 6-nav (Shamir after Multisig)
-->

# BIP39 Lab — Exhaustive E2E for Comet / Perplexity

**Canonical:** `docs/E2E_COMET_SCENARIOS.md`  
**Live:**  
- Lab: https://bip39.catalyxt.xyz/  
- Multisig: https://bip39.catalyxt.xyz/multisig.html  
- Shamir: https://bip39.catalyxt.xyz/shamir.html  
- Network: https://bip39.catalyxt.xyz/network.html  

### Sidebar (all pages) — **6 items**

| # | Nav | Notes |
|---|-----|--------|
| 1 | Lab | Generate / derive |
| 2 | Multisig | M-of-N explainer |
| 3 | **Shamir** | Educational share split (not SLIP-39) |
| 4 | Network | Fees / address balances (opt-in) + CLI/Knots notes |
| 5 | Tools | Path, PSBT, descriptors |
| 6 | **Glossary** | BIPs, acronyms, **security & threat model** |

| Area | Playwright | Scenario IDs |
|------|------------|--------------|
| Lab shell / chrome | `e2e/lab.spec.ts`, `e2e/site-chrome.spec.ts` | S0–S0c, S36–S40 |
| Lab mnemonic / table | `e2e/lab.spec.ts` | S1–S11, S15–S16 |
| Lab Tools | `e2e/lab.spec.ts` | S14, S17–S23 |
| Network CLI redirect / Glossary security | `e2e/lab.spec.ts` | S24–S25, S10 |
| Multisig | `e2e/multisig.spec.ts` | S12, S12b, S26–S31 |
| Network | `e2e/network.spec.ts` | S13b–d, S32–S35 |
| Help UX | `e2e/help-ux.spec.ts` | S41–S48 |
| Glossary | `e2e/glossary.spec.ts` | S49–S52 |
| Shamir | `e2e/shamir.spec.ts` | S53–S55 |

**Playwright:** `npm run test:e2e`  
**Live:** `npm run test:e2e:live`  
**Comet score denominator:** **S0–S55**

---

## PROMPT FOR COMET / PERPLEXITY

```text
You are a browser QA agent. Execute the FULL exhaustive suite in this document (S0–S52).

SOURCE OF TRUTH: docs/E2E_COMET_SCENARIOS.md (0xbadhash/bip39lab).
APPS:
  - https://bip39.catalyxt.xyz/
  - https://bip39.catalyxt.xyz/multisig.html
  - https://bip39.catalyxt.xyz/network.html
Hard-refresh each app once. Do not skip scenarios (S0–S52 including Help UX S41–S48 and Glossary S49–S52). Mark PASS/FAIL with evidence.

SIDEBAR: expect exactly **7** nav items on every page:
  Lab, Multisig, Network, Tools, Balance, Glossary.
S36 PASSes only if all 6 labels match (About content lives under Glossary).

Use ONLY the public abandon mnemonic for Lab. Multisig: public keys or demo generator only.
Network: addresses only — never paste a seed. Lab/Tools/Multisig crypto stay offline.
Final output MUST use the Report template (all S-ids listed; score __ / 57).

Test mnemonic:
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
```

### Goldens (mainnet · account 0 · change 0 · index 0 · empty passphrase)

| Type | Address |
|------|---------|
| BIP86 | `bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr` |
| BIP84 | `bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu` |
| BIP49 | `37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf` |
| BIP44 | `1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA` |
| Testnet BIP84 | starts with `tb1` when Network=Test |

### Multisig sample pubs (2-of-2 golden P2SH)

```text
0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5
→ P2SH 33RQmypKhD6f4tMquiR5a3C6dRT7eBpaiG
```

---

## Lab shell

### S0 — Smoke
Open Lab → title Offline BIP-39 lab; Generate; **6** nav (includes **Glossary**, no separate About); Offline crypto + airgap chips; CSP `connect-src 'none'` (View Source → meta Content-Security-Policy).

### S0b — Theme
Click Theme → label toggles dark/light; page still usable.

### S0c — Keyboard `?`
Focus body → `?` → Tools panel + path playground.

---

## Lab mnemonic & table

### S1 — Generate 12
Word count 12 → Generate → 12 words; entropy `128 bits (12-word BIP-39)`; ≥5 table rows; default `bc1p`.

### S1b — Generate 24
Word count 24 → Generate → 24 words; entropy `256 bits…`.

### S2 — Abandon all types
Clear → paste abandon → BIP86/84/49/44 pads match **all four goldens**.

### S3 — Passphrase
BIP84 golden → passphrase `test` → address ≠ golden; strength shows bits; clear passphrase → golden returns.

### S4 — Account / change / indices
Indices 10 → 10 rows; change 1 → path mentions change; account 1 → ≠ golden; reset 0/0/5 → golden.

### S5 — Mainnet / testnet
Main BIP84 golden → Network Test → `tb1…` + path coin type 1 → Main restores golden.

### S6 — Copy
Copy first address → **Copied** / `#copyFeedback` shows clipboard confirmation.

### S7 — QR address
QR → modal image + address text → Close hides modal.

### S8 — Watch-only
Refresh → BIP84 **zpub**, no xprv; pad BIP44 → **xpub**, no xprv.

### S9 — Hide + Clear
Hide private → mnemonic hidden; unhide; Clear → empty mnemonic, entropy `—`, empty table.

### S11 — Invalid mnemonic
Garbage phrase → entropy not valid 128-bit line; no abandon goldens in table.

### S15 — Seed QR
Seed QR → confirm dialog → modal (sensitive) → Close.

### S16 — Send → Network
Abandon derive → Send addresses → Network → ack → Load from Lab → `bc1…` without `abandon`.

---

## Lab Tools

### S14 — Tools path
Tools nav → path playground shows `m/…'`.

### S17 — Entropy pad
Dice ×2 + coin → pad `d6:` + `coin:`; Clear → `—`.

### S18 — Compare passphrases
B=`test` → Compare → A/B lines; usually Different.

### S19 — Descriptors
Refresh descriptors → `wpkh(` or `tr(` or `pkh(`.

### S20 — PSBT ok
Paste `cHNidP8BAAoCAAAAAA==` → Inspect → ok / educational.

### S21 — PSBT refuse xprv
Paste xprv-looking string → refuse/error/secret.

### S22 — Descriptor explain
`wpkh(zpub…/0/*)` → wpkh ok; private/xprv text → refuse.

### S23 — Shortcuts card
Tools shows Keyboard shortcuts (G/D/Esc/?).

---

## Lab Network CLI redirect / About / Nav

### S24 — Old Balance deep link
`#balance` redirects to Network `#netCardBal` (CLI Knots/mempool guidance lives there; no separate Balance nav).

### S25 — Glossary security & threat model
`#glossary` (or legacy `#about`) → no retention + Threat model bullets under Glossary.

### S10 — Full nav tour
Lab → Tools → Glossary (incl. security) → Multisig (**5** nav) → Network (**5** nav + CLI card).

---

## Multisig

### S26 — Shell
Open multisig → offline CSP; **6** nav (incl. Glossary); public-keys explainer; cosigner checklist; `#msPolicy`.

### S12 — Golden 2-of-2 + refuse private
Paste sample pubs, M=2, BIP67 → P2SH golden; P2WSH `bc1`; policy 2-of-2; paste WIF → private error.

### S12b — Demo N=3
N=3, 12 words → Generate → 3 cards + zpub; Build → P2SH `3…`, P2WSH `bc1`; policy of-3.

### S27 — Demo 24-word pad
N=2, 24-word tab → Generate → 256 bits / 24 mentioned.

### S28 — BIP67 off
Build with BIP67 unchecked → policy mentions BIP67 sort OFF.

### S29 — Clear
Build then Clear → result hidden; pubkey box empty.

### S30 — Copy P2SH
Build → Copy P2SH → copy feedback.

### S31 — Nav out
Multisig → Lab; Multisig → Network.

---

## Network

### S32 — Shell + gate
Network heading; **6** nav; CSP allows mempool/`self` (not Lab’s connect-src none); balances disabled until ack; Lab still connect-src none.

### S13b — Fee snapshot
Fetch snapshot → feeOut sat/vB; feeBands; traffic tip/mempool; feeExample; UTXO reminder; status OK.

### S13c — Balances
Mnemonic in box → reject; BIP84 golden + ack → row with ok|unknown|error (fail-closed).

### S13d — Session bridge
Lab abandon → Network Load from Lab → addresses, no abandon words.

### S33 — No ack
Load Lab button disabled without ack.

### S34 — Empty fetch
Ack + empty box → Fetch → need addresses.

### S35 — Network → Tools
Tools nav → Tools panel on Lab.

---

## Cross-page chrome

### S36 — Nav labels identical (6 items)
On Lab, Multisig, **and** Network: same **6** strong labels, in order:

**Lab · Multisig · Network · Tools · Balance · Glossary**

(About was merged into Glossary — security + threat model live there.)

**PASS if** all three pages show exactly these 6. **FAIL** if About reappears as a 7th item or Glossary is missing.

### S37 — CSP isolation (agent-friendly)
Do **not** require HTTP response headers. Use **View Page Source** (or DOM):

1. Lab (`/`) and Multisig: find  
   `<meta http-equiv="Content-Security-Policy" …>` containing **`connect-src 'none'`**.  
2. Network: same meta contains **`mempool.space`** and/or **`'self'`**, and must **not** be offline-only `connect-src 'none'` alone.  
3. Functional backup: Lab/Multisig make no explorer calls while generating/building; Network only contacts the public API after opt-in.

**PASS if** (1)+(2) from meta, or (1)+(2) partial + (3) clearly observed.

### S38 — Multisig aria-current
Multisig page: Multisig nav `aria-current=page`.

### S39 — Network aria-current
Network page: Network nav `aria-current=page`.

### S40 — Host branding
Lab footer / Multisig / Network mention bip39.catalyxt.xyz or English host branding.

---

## Help UX hybrid (P0–P4)

### S41 — Teach On + Lab step rail
Lab loads with **Teach: On**; process rail (4 steps) visible.

### S42 — Teach Off
Click Teach → **Off**; step rail hidden; air-gap **warn** still visible.

### S43 — ⓘ tip
Click mnemonic **i** → panel open with vault/air-gap text; **Esc** closes.

### S44 — Step rail jump
Click step “Watch-only” → `#watchOnlyPanel` in view; step active.

### S45 — Multisig rail + BIP67 tip
Multisig step rail; jump to Build; open BIP67 **i** tip.

### S46 — Cosigner checklist folded
Checklist is a collapsed `<details>`; open to see hardware/public bullets.

### S47 — Network rail + leak always on
Network steps visible; Privacy/leak line always shown; fee **i** tip works; Teach Off hides rail but keeps ack checkbox.

### S48 — Teach persists
Set Teach Off on Lab → Network still Off; toggle back On.

---

## Glossary (BIPs & acronyms)

### S49 — Glossary panel
Open **Glossary** nav (or `#glossary`) → list includes BIP-39/44/84/86, P2PKH/P2WPKH/P2TR, zpub/xpub, UTXO, sat/vB.

### S50 — Search
Search `multisig` → M-of-N / cosigner entries; search `BIP67` → sorted keys.

### S51 — Inline ⓘ from glossary
Lab mnemonic **i** shows BIP-39 recovery phrase explanation + link to full glossary.

### S52 — Address-type terms
BIP84 pad has glossary tip or Glossary lists BIP-84 / SegWit.

---

## Report template

```text
# BIP39 Lab E2E report (exhaustive)
URLs:
  Lab: https://bip39.catalyxt.xyz/
  Multisig: https://bip39.catalyxt.xyz/multisig.html
  Network: https://bip39.catalyxt.xyz/network.html
Date (UTC):
Agent: Comet / Perplexity / other:

S0 Smoke (6-nav + Glossary): PASS|FAIL —
S0b Theme: PASS|FAIL —
S0c Keyboard ?: PASS|FAIL —
S1 Generate 12: PASS|FAIL —
S1b Generate 24: PASS|FAIL —
S2 Abandon 4 types: PASS|FAIL —
S3 Passphrase: PASS|FAIL —
S4 Account/change/indices: PASS|FAIL —
S5 Mainnet/testnet: PASS|FAIL —
S6 Copy: PASS|FAIL —
S7 QR address: PASS|FAIL —
S8 Watch-only: PASS|FAIL —
S9 Hide/clear: PASS|FAIL —
S10 Full nav tour: PASS|FAIL —
S11 Invalid: PASS|FAIL —
S12 Multisig golden+refuse: PASS|FAIL —
S12b Demo N=3: PASS|FAIL —
S13b Fees+bands: PASS|FAIL —
S13c Balances: PASS|FAIL —
S13d Lab bridge: PASS|FAIL —
S14 Tools path: PASS|FAIL —
S15 Seed QR: PASS|FAIL —
S16 Send→Network: PASS|FAIL —
S17 Entropy pad: PASS|FAIL —
S18 Compare PP: PASS|FAIL —
S19 Descriptors: PASS|FAIL —
S20 PSBT ok: PASS|FAIL —
S21 PSBT refuse: PASS|FAIL —
S22 Desc explain: PASS|FAIL —
S23 Shortcuts card: PASS|FAIL —
S24 Balance panel: PASS|FAIL —
S25 Glossary threat/security: PASS|FAIL —
S26 Multisig shell: PASS|FAIL —
S27 Demo 24w: PASS|FAIL —
S28 BIP67 off: PASS|FAIL —
S29 Multisig clear: PASS|FAIL —
S30 Copy P2SH: PASS|FAIL —
S31 Multisig nav: PASS|FAIL —
S32 Network shell: PASS|FAIL —
S33 No ack: PASS|FAIL —
S34 Empty fetch: PASS|FAIL —
S35 Network→Tools: PASS|FAIL —
S36 Nav labels (6 incl. Glossary): PASS|FAIL —
S37 CSP isolation (meta + functional): PASS|FAIL —
S38 Multisig current: PASS|FAIL —
S39 Network current: PASS|FAIL —
S40 Host branding: PASS|FAIL —
S41 Teach On + step rail: PASS|FAIL —
S42 Teach Off: PASS|FAIL —
S43 Help tip: PASS|FAIL —
S44 Step rail jump: PASS|FAIL —
S45 Multisig rail + BIP67 tip: PASS|FAIL —
S46 Checklist folded: PASS|FAIL —
S47 Network rail + leak: PASS|FAIL —
S48 Teach persists: PASS|FAIL —
S49 Glossary panel: PASS|FAIL —
S50 Glossary search: PASS|FAIL —
S51 Mnemonic glossary tip: PASS|FAIL —
S52 BIP terms: PASS|FAIL —

Score: __ / 57 PASS
Blockers:
Notes:
```

---

## Operator one-liner

> Read https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md and execute PROMPT FOR COMET (exhaustive **S0–S52**) against https://bip39.catalyxt.xyz/ Lab, Multisig, and Network. Return the Report template with all S-ids.

## Playwright developers

```bash
npm install && npx playwright install chromium
npm run test:e2e              # local :4173
npm run test:e2e:live         # production
```

| File | Covers |
|------|--------|
| `e2e/helpers.ts` | abandon goldens, nav, CSP helpers |
| `e2e/lab.spec.ts` | S0–S25 Lab + Tools |
| `e2e/multisig.spec.ts` | S12–S31 Multisig |
| `e2e/network.spec.ts` | S13–S35 Network |
| `e2e/site-chrome.spec.ts` | S36–S40 chrome |
