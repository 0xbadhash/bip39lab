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
APP UNDER TEST: https://bip39.catalyxt.xyz/
Do a hard refresh once, then run scenarios S0 through S11 in order.

RULES:
- Use ONLY the public abandon test mnemonic given in this file. Never use a real seed.
- Do not skip scenarios. For each, mark PASS or FAIL with one line of evidence.
- Prefer visible UI text and exact string matches for golden addresses.
- Lab crypto must stay offline (no explorer API calls from the Lab page while generating/deriving).
- Stop only if the site is unreachable; otherwise complete all scenarios.
- Final output MUST use the Report template at the bottom of this file.

When a step says “wait for re-derive”, wait ~0.5–1s after input changes.
Selectors (for automation): #btnGenerate #btnClear #btnDerive #mnemonic #passphrase
#entropyMnemonic #entropyPassphrase #addrTableBody #colBip49 #colBip44 #deriveAccount
#deriveChange #deriveCount #btnWatchOnly #watchOnlyList #qrModal #btnQrClose
.nav-item[data-tab=lab|balance|about]

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
| 3 | Address table | ≥5 rows (idx 0–4); `bc1p` and `bc1q` present |
| 4 | Columns | BIP86 + BIP84 on; BIP49/BIP44 off by default |

### S2 — Abandon golden addresses

| Step | Action | Expected |
|------|--------|----------|
| 1 | **Clear secrets** | Empty mnemonic |
| 2 | Paste abandon mnemonic; wait/derive | Table fills |
| 3 | idx 0 BIP86 | exact golden BIP86 above |
| 4 | idx 0 BIP84 | exact golden BIP84 above |
| 5 | Entropy | `128 bits (12-word BIP-39)` |

### S3 — Passphrase changes addresses

| Step | Action | Expected |
|------|--------|----------|
| 1 | Abandon phrase; note BIP84 idx 0 | equals golden BIP84 |
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

### S5 — Optional BIP49 / BIP44

| Step | Action | Expected |
|------|--------|----------|
| 1 | Default | BIP49/BIP44 headers hidden |
| 2 | Check BIP49 nested | Column visible; addresses like `3…` |
| 3 | Check BIP44 legacy | Column visible; addresses like `1…` |
| 4 | Uncheck both | Columns hidden |

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
| 1 | Default checkboxes | **BIP84 zpub** checked; BIP86/49/44 **unchecked** |
| 2 | Abandon phrase; **Refresh watch-only keys** | **One** card only (BIP84), not all four |
| 3 | BIP84 key | starts with `zpub` |
| 4 | Check BIP44 | Second card appears (`xpub`); still **no** `xprv` |
| 5 | Uncheck BIP84 | Only BIP44 card remains (or empty if all off) |

### S9 — Hide private + Clear

| Step | Action | Expected |
|------|--------|----------|
| 1 | Fill mnemonic; check Hide private | Mnemonic/passphrase hidden |
| 2 | Uncheck Hide private | Visible again |
| 3 | Clear secrets | Empty mnemonic; entropy `—`; empty table |

### S10 — Nav Balance + About

| Step | Action | Expected |
|------|--------|----------|
| 1 | Balance tab | CLI balance docs (mempool / bitcoind) |
| 2 | About tab | Security / no retention |
| 3 | Lab tab | Back to lab |

### S11 — Invalid mnemonic

| Step | Action | Expected |
|------|--------|----------|
| 1 | Clear; type garbage phrase | — |
| 2 | Entropy | not valid `128 bits (12-word BIP-39)` |
| 3 | Table | does not show golden abandon addresses |

---

## Report template (required final output)

```text
# BIP39 Lab E2E report
URL: https://bip39.catalyxt.xyz/
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
S10 Nav: PASS|FAIL — 
S11 Invalid: PASS|FAIL — 

Score: __ / 12 PASS
Blockers:
Notes:
```

---

## Operator one-liner for Comet

> Read https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md and execute the PROMPT FOR COMET section against https://bip39.catalyxt.xyz/. Return the Report template filled in.

---

## Playwright (developers)

```bash
cd bip39lab
npm install
npx playwright install chromium
npm run test:e2e              # local static web/ on :4173
npm run test:e2e:live         # https://bip39.catalyxt.xyz
```

Scenarios S0–S11 map to tests in `e2e/lab.spec.ts`.
