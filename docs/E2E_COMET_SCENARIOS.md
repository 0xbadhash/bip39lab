# BIP39 Lab — E2E suite for Comet / Perplexity

**Canonical file in repo:** `docs/E2E_COMET_SCENARIOS.md`  
**Live apps:**  
- BIP39 Lab: https://bip39.catalyxt.xyz/  
- Multisig lab: https://bip39.catalyxt.xyz/multisig.html  
- Network (opt-in): https://bip39.catalyxt.xyz/network.html  

**GitHub (raw):** https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md  

| Suite | Playwright file | Scenarios |
|-------|-----------------|-----------|
| BIP39 Lab | `e2e/lab.spec.ts` | S0–S11, S14 |
| Multisig | `e2e/multisig.spec.ts` | S12, S12b |
| Network | `e2e/network.spec.ts` | S13, S13b–d |

Run: `npm run test:e2e` or `npm run test:e2e:live`

---

## PROMPT FOR COMET / PERPLEXITY (copy-paste)

```text
You are a browser QA agent. Execute the E2E suite in this document end-to-end.

SOURCE OF TRUTH: docs/E2E_COMET_SCENARIOS.md in 0xbadhash/bip39lab.
APPS UNDER TEST:
  - https://bip39.catalyxt.xyz/              (Lab + Tools + About — S0–S11, S14)
  - https://bip39.catalyxt.xyz/multisig.html (S12)
  - https://bip39.catalyxt.xyz/network.html  (S13)
Hard-refresh each app once, then run S0 through S14 in order.

RULES:
- Use ONLY the public abandon test mnemonic for Lab. Never use a real seed.
- Multisig: public keys only (samples in this file). Never WIF/xprv.
- Network: addresses only; never paste a seed into the address box.
- Lab/Tools/Multisig stay offline for crypto; Network may call mempool after opt-in.
- Mark PASS/FAIL with one line of evidence each. Final output = Report template.

Lab selectors:
  #btnGenerate #btnClear #btnDerive #mnemonic #passphrase #deriveNetwork
  #entropyMnemonic #addrTableBody #btnSeedQr #btnPrintBackup #btnSendNetwork
  .nav-item[data-nav="lab"|"multisig"|"network"|"tools"|"balance"|"about"]
  Tools: #pathPlayOut #btnDice #btnCmpPp #cmpPpOut #btnDescRefresh #descOut
  #psbtIn #btnPsbt #psbtOut #descExplainIn #btnDescExplain #chipAirgap #btnTheme

Multisig: #msParts #msM #msBip67 #msBuild #msP2sh #msP2wsh #msPolicy
Network: #btnFetchSnap #feeOut #feeBands #balAck #btnFetchBal #balAddrs

Begin with S0.
```

---

## Global rules

1. Hard-refresh before each app’s first scenario.  
2. Never paste a real funded recovery phrase.  
3. Lab CSP remains `connect-src 'none'`.  
4. Sidebar has **6** items: Lab, Multisig, Network, Tools, Balance, About.

### Public test mnemonic

```text
abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
```

### Golden (mainnet · account 0 · change 0 · index 0 · empty passphrase)

| Item | Expected |
|------|----------|
| BIP86 | `bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr` |
| BIP84 | `bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu` |
| Testnet BIP84 idx0 | starts with `tb1` when Network = Test |

---

## Scenarios

### S0 — Smoke
| Step | Expected |
|------|----------|
| Open Lab | Title BIP39; Generate visible |
| Sidebar | **6** items including Tools |
| Chips | Offline crypto + airgap/online chip |

### S1–S9
Unchanged lab flows (generate, abandon goldens, passphrase, pads, copy, QR, watch-only, hide/clear) — see prior suite detail; goldens above.

### S10 — Nav (6 items)
| Step | Expected |
|------|----------|
| Balance | CLI + Knots docs; UTXO blurb |
| Tools | Path playground visible |
| About | Threat model |
| Multisig | 6 nav; checklist |
| Network | 6 nav |
| Back Balance | full nav |

### S11 — Invalid mnemonic  
Unchanged.

### S12 — Multisig  
+ Policy readout after build; cosigner checklist visible; BIP67 note; 6 nav.

### S13 — Network  
+ fee bands after snapshot; UTXO reminder; 6 nav; S13b–d as before.

### S14 — Tools pack (new)
| Step | Action | Expected |
|------|--------|----------|
| 1 | Abandon on Lab mainnet | Goldens |
| 2 | Network → Test | Addresses `tb1…` for BIP84 |
| 3 | Tools panel | Path shows `…/1'/…` coin type |
| 4 | Refresh descriptors | `wpkh(` or `tr(` |
| 5 | Compare passphrase B=`test` | A/B lines; usually Different |
| 6 | PSBT paste minimal base64 | ok / educational parse |
| 7 | Descriptor explain `wpkh(…)` | mentions wpkh |
| 8 | Dice | pad shows `d6:` |
| 9 | Theme button (optional) | toggles label dark/light |

---

## Report template

```text
# BIP39 Lab E2E report
URLs:
  Lab: https://bip39.catalyxt.xyz/
  Multisig: https://bip39.catalyxt.xyz/multisig.html
  Network: https://bip39.catalyxt.xyz/network.html
Date (UTC):
Agent: Comet / Perplexity / other:

S0 Smoke: PASS|FAIL —
S1 Generate: PASS|FAIL —
S2 Abandon vectors: PASS|FAIL —
S3 Passphrase: PASS|FAIL —
S4 Controls: PASS|FAIL —
S5 Address type pads: PASS|FAIL —
S6 Copy: PASS|FAIL —
S7 QR: PASS|FAIL —
S8 Watch-only: PASS|FAIL —
S9 Clear/hide: PASS|FAIL —
S10 Nav (6 items + Tools): PASS|FAIL —
S11 Invalid: PASS|FAIL —
S12 Multisig (+ policy/checklist): PASS|FAIL —
S13 Network (+ fee bands): PASS|FAIL —
S14 Tools pack: PASS|FAIL —

Score: __ / 15 PASS
Blockers:
Notes:
```

## Operator one-liner

> Read https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md and execute PROMPT FOR COMET (S0–S14) against bip39.catalyxt.xyz Lab, Multisig, and Network. Return the Report template.

## Playwright

```bash
npm install && npx playwright install chromium
npm run build:web
npm run test:e2e
```

| Scenarios | File |
|-----------|------|
| S0–S11, S14 | `e2e/lab.spec.ts` |
| S12 | `e2e/multisig.spec.ts` |
| S13 | `e2e/network.spec.ts` |
