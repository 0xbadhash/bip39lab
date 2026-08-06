# BIP39 Lab — E2E suite for Comet / Perplexity

**Canonical file in repo:** `docs/E2E_COMET_SCENARIOS.md`  
**Live apps:**  
- BIP39 Lab: https://bip39.catalyxt.xyz/  
- Multisig lab: https://bip39.catalyxt.xyz/multisig.html  

**GitHub (raw):** https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md  
**GitHub (blob):** https://github.com/0xbadhash/bip39lab/blob/master/docs/E2E_COMET_SCENARIOS.md  

| Suite | Playwright file | Scenarios |
|-------|-----------------|-----------|
| BIP39 Lab | `e2e/lab.spec.ts` | S0–S11 |
| Multisig | `e2e/multisig.spec.ts` | S12 |

Run: `npm run test:e2e` or `npm run test:e2e:live`

---

## PROMPT FOR COMET / PERPLEXITY (copy-paste or “read this file”)

```text
You are a browser QA agent. Execute the E2E suite in this document end-to-end.

SOURCE OF TRUTH: this file (docs/E2E_COMET_SCENARIOS.md in 0xbadhash/bip39lab).
APPS UNDER TEST:
  - https://bip39.catalyxt.xyz/           (BIP39 Lab — S0–S11)
  - https://bip39.catalyxt.xyz/multisig.html  (Multisig explainer — S12)
Do a hard refresh once on each app you open, then run scenarios S0 through S12 in order.

RULES:
- Use ONLY the public abandon test mnemonic given in this file for Lab scenarios. Never use a real seed.
- For Multisig (S12), use ONLY the sample compressed public keys in this file — never private keys/WIF.
- Do not skip scenarios. For each, mark PASS or FAIL with one line of evidence.
- Prefer visible UI text and exact string matches for golden values.
- Lab and Multisig crypto must stay offline (no explorer API calls while generating/deriving/building).
- Stop only if the site is unreachable; otherwise complete all scenarios.
- Final output MUST use the Report template at the bottom of this file.

When a step says “wait for re-derive”, wait ~0.5–1s after input changes.
Lab selectors: #btnGenerate #btnClear #btnDerive #mnemonic #passphrase
#entropyMnemonic #entropyPassphrase #addrTableBody #colBip49 #colBip44 #deriveAccount
#deriveChange #deriveCount #btnWatchOnly #watchOnlyList #woBip84 #woBip86 #qrModal #btnQrClose
.nav-item[data-tab=lab|balance|about]  and  a.nav-item[href="multisig.html"]
Multisig selectors: #msParts #msM #msBip67 #msBuild #msClear #msResult #msP2sh #msP2wsh #msStatus

Begin now with S0.
```

---

## Global rules

1. Open **https://bip39.catalyxt.xyz/** only (unless the operator gives another BASE_URL).
2. Hard-refresh once before the suite.
3. **Never** paste a real funded recovery phrase.
4. Record **PASS / FAIL** per scenario with evidence.
5. Lab tab must not call public explorers from the browser; Balance tab is documentation only.

### Public test mnemonic

```text
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
```

### Golden expectations (account 0 · change 0 · index 0 · empty passphrase)

| Item | Expected value |
|------|----------------|
| BIP86 (Taproot) | `bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr` |
| BIP84 (native) | `bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu` |
| BIP84 watch-only key | starts with `zpub` |
| Mnemonic entropy (12 words) | `128 bits (12-word BIP-39)` |

---

## Scenarios

### S0 — Smoke load

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open https://bip39.catalyxt.xyz/ | Page loads; title mentions BIP39 |
| 2 | Sidebar | Lab, Balance, About |
| 3 | Main | Generate button visible |

### S1 — Generate fills table + entropy

| Step | Action | Expected |
|------|--------|----------|
| 1 | Word count 12 → **Generate** | 12-word mnemonic appears |
| 2 | Mnemonic entropy | `128 bits (12-word BIP-39)` |
| 3 | Address table | ≥5 rows (idx 0–4); default pad BIP86 shows `bc1p` |
| 4 | Type pads | Segment tabs: BIP86 / BIP84 / BIP49 / BIP44 — only one address column at a time |

### S2 — Abandon golden addresses

| Step | Action | Expected |
|------|--------|----------|
| 1 | **Clear secrets** | Empty mnemonic |
| 2 | Paste abandon mnemonic; wait/derive | Table fills |
| 3 | Default pad BIP86 · idx 0 | exact golden BIP86 above |
| 4 | Click pad **BIP84 · native** · idx 0 | exact golden BIP84 above |
| 5 | Entropy | `128 bits (12-word BIP-39)` |

### S3 — Passphrase changes addresses

| Step | Action | Expected |
|------|--------|----------|
| 1 | Abandon phrase; select pad **BIP84**; note idx 0 | equals golden BIP84 |
| 2 | Passphrase = `test`; wait | BIP84 idx 0 **≠** golden |
| 3 | Entropy field | still `128 bits (12-word BIP-39)` |
| 4 | Passphrase strength | `~… bits (estimate)` not `—` |
| 5 | Clear passphrase; wait | BIP84 returns to golden |

### S4 — Account / change / indices

| Step | Action | Expected |
|------|--------|----------|
| 1 | Indices → 10 | 10 rows |
| 2 | Change → 1 · change | Path summary mentions change |
| 3 | Account → 1 | Addresses ≠ account 0 golden |
| 4 | Reset account 0, change 0, indices 5 | 5 rows; golden BIP84 again |

### S5 — Address type pads (one at a time)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Default | Pad **BIP86** active; table shows `bc1p…` only (one address column) |
| 2 | Click **BIP84 · native** | Table shows golden-style `bc1q…`; not Taproot |
| 3 | Click **BIP49 · nested** | Addresses like `3…` (abandon idx0: `37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf`) |
| 4 | Click **BIP44 · legacy** | Addresses like `1…` (abandon idx0: `1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA`) |

### S6 — Copy address

| Step | Action | Expected |
|------|--------|----------|
| 1 | Click **Copy** on first address in the table | Button label becomes **Copied** (green background) within ~0.5s and stays ~2s |
| 2 | Look under the table for live feedback | Line like `Copied to clipboard: bc1…` (`#copyFeedback`) |
| 3 | Clipboard (if readable by agent) | Matches the address text that was copied |

**Note:** If clipboard API is blocked by the agent environment, the UI must still show **Copied** or **Failed** (never stay on plain "Copy" with no feedback).

### S7 — QR modal

| Step | Action | Expected |
|------|--------|----------|
| 1 | Click **QR** on an address | Modal open; image shown |
| 2 | Modal text | Same address as cell |
| 3 | **Close** | Modal hidden |
| 4 | Optional Network tab | No explorer fetch for QR |

### S8 — Watch-only export

| Step | Action | Expected |
|------|--------|----------|
| 1 | Default watch-only pad | **BIP84 · zpub** active |
| 2 | Abandon phrase; **Refresh watch-only key** | **One** card only (zpub) |
| 3 | BIP84 key | starts with `zpub`; **no** `xprv` |
| 4 | Click pad **BIP44 · xpub** | Still one card; key starts with `xpub`; **no** `xprv` |

### S9 — Hide private + Clear

| Step | Action | Expected |
|------|--------|----------|
| 1 | Fill mnemonic; check Hide private | Mnemonic/passphrase hidden |
| 2 | Uncheck Hide private | Visible again |
| 3 | Clear secrets | Empty mnemonic; entropy `—`; empty table |

### S10 — Nav Balance + About + Multisig link

| Step | Action | Expected |
|------|--------|----------|
| 1 | Balance tab | CLI balance docs (mempool / bitcoind) |
| 2 | About tab | Security / no retention |
| 3 | Lab tab | Back to lab |
| 4 | Click **Multisig** in sidebar | Navigates to `/multisig.html`; heading “Multisig, explained” |

### S11 — Invalid mnemonic

| Step | Action | Expected |
|------|--------|----------|
| 1 | Clear; type garbage phrase | — |
| 2 | Entropy | not valid `128 bits (12-word BIP-39)` |
| 3 | Table | does not show golden abandon addresses |

### S12 — Multisig explainer (public keys only)

**URL:** https://bip39.catalyxt.xyz/multisig.html  

**Sample compressed public keys (not private):**
```text
0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5
```

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open multisig page | Explainer text about M-of-N / vault analogy; offline chip |
| 2 | Paste the two pubkeys; M = 2; BIP67 checked | — |
| 3 | **Build multisig address** | Result shows; **P2SH** = `33RQmypKhD6f4tMquiR5a3C6dRT7eBpaiG` |
| 4 | P2WSH field | starts with `bc1` |
| 5 | Status | mentions offline / no private keys |
| 6 | Replace parts with a WIF-looking string e.g. starts with `5Hue…` and Build | Error about **private** keys not accepted |
| 7 | Optional: Copy P2SH | “Copied” / confirmation behavior if present |

**PASS if:** Golden P2SH matches; private key input refused; page stays educational (no explorer discovery UI).

---

## Report template (required final output)

```text
# BIP39 Lab E2E report
URLs:
  Lab: https://bip39.catalyxt.xyz/
  Multisig: https://bip39.catalyxt.xyz/multisig.html
Date (UTC):
Agent: Comet / Perplexity / other:

S0 Smoke: PASS|FAIL — 
S1 Generate: PASS|FAIL — 
S2 Abandon vectors: PASS|FAIL — 
S3 Passphrase: PASS|FAIL — 
S4 Controls: PASS|FAIL — 
S5 Legacy columns: PASS|FAIL — 
S6 Copy: PASS|FAIL — 
S7 QR: PASS|FAIL — 
S8 Watch-only: PASS|FAIL — 
S9 Clear/hide: PASS|FAIL — 
S10 Nav (+ Multisig link): PASS|FAIL — 
S11 Invalid: PASS|FAIL — 
S12 Multisig explainer: PASS|FAIL — 

Score: __ / 13 PASS
Blockers:
Notes:
```

---

## Operator one-liner for Comet

> Read https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md and execute the PROMPT FOR COMET section (S0–S12) against https://bip39.catalyxt.xyz/ and https://bip39.catalyxt.xyz/multisig.html. Return the Report template filled in.

---

## Playwright (developers)

```bash
cd bip39lab
npm install
npx playwright install chromium
npm run test:e2e              # local static web/ on :4173
npm run test:e2e:live         # https://bip39.catalyxt.xyz
```

| Scenarios | File |
|-----------|------|
| S0–S11 | `e2e/lab.spec.ts` |
| S12 | `e2e/multisig.spec.ts` |
