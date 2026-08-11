# PR Draft: Tools teach UX pack + panel jump rails (v0.13.12)

**Range:** `fba40c0` (v0.13.11) … `204bbe0` (HEAD)  
**Spec waiver:** chore  

## What Problem This Solves

Tools became hard to learn: Lab jump rail (Phrase/Path/Addresses/Watch-only) still showed on Tools; PSBT/path/entropy/passphrase cards lacked clear teach steps; entropy pad could show empty results or stale-bundle errors; step-rail jumps needed clearer focus/scroll.

## Why This Change Was Made

Close Tools UX follow-ups from Comet feedback and code review: panel-scoped jump rails, educational samples, low-entropy honesty, cache-bust, without adding a 7th primary nav item.

## User Impact

- **Lab rail only on Lab**; **Tools rail** (Path · Entropy · Passphrase · Descriptors · PSBT · Explain).  
- Path playground: level-by-level table + “Open Lab path controls”.  
- Entropy pad: 3 steps, simulated rolls label, TOO LOW verdict, practice seed from pad (never fund).  
- Passphrase compare: 3 steps, plain-text A/B + address table + shoulder-surf note.  
- PSBT: teach fold + synthetic samples.  
- Step-rail: focus + flash + scroll-parent aware.  
- JS assets `?v=VERSION` cache-bust.

## Evidence

- Playwright: S14, S17, S17b, S18*, S20*, S23, S44, S44b (and suite via product_smoke at release)  
- `check_web_e2e`  
- CODE-REVIEW + CROSS-REVIEW p0=0 / blockers=0  
- secrets clean on range  

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 Tools rail ≠ Lab rail | `e2e/help-ux.spec.ts` S44b; `#labStepRail` hidden on Tools |
| AC-2 Lab rail jumps focus | S44 Phrase/Path/Addresses/Watch-only |
| AC-3 Entropy pad practice seed + TOO LOW | S17b |
| AC-4 Simulated rolls messaging | S17 contains “Simulated rolls” |
| AC-5 Passphrase compare steps + table | S18 / S18b / S18c |
| AC-6 PSBT samples + teach | S20 / S20b |
| AC-7 Path playground table | S14 |
| AC-8 Comet S-ids synced | `docs/E2E_COMET_SCENARIOS.md` S17b S44b; check_web_e2e |
| AC-9 Cache-bust scripts | HTML `js/*?v=`; stamp_site_version |

## Threat notes

- **secrets** — practice pad words labeled never-fund; no server retention; compare is offline.  
- **xss** — textContent/innerHTML only for controlled teach strings (verdict HTML uses fixed templates, not user HTML).  
- **supply-chain** — bundle rebuild from existing @scure/bip39 entropyToMnemonic; no new npm deps.  
- CSP offline on Lab/Tools unchanged; PSBT never signs/broadcasts.  
- Math.random dice labeled **simulated** (not physical / CSPRNG).  

## Red-proof

```text
red_cmd: false
green_cmd: true
```

TDD narrative: e2e extended for S17b/S44b/Tools rail; green under Playwright.

## Evidence pack

- **hard_gates** — CODE-REVIEW, CROSS-REVIEW, chore waiver, secrets, threat tags  
- **smoke** — product_smoke unit + e2e; check_web_e2e  
- **pytest** — unit suite in product_smoke  
- **validate** — secrets scan on `v0.13.11...HEAD`  

## Untested paths

| Path | Reason |
|------|--------|
| `web/js/glossary.js` | Tip bodies covered via browser UI e2e (help tips / glossary panel); no unit file — static content map only |
| `web/js/help-ui.js` | Covered by Playwright `e2e/help-ux.spec.ts` S41–S48 / S44 / S44b (step rail + teach); no separate pytest module |

## Things that look bad but are actually fine

1. **Large bip39lab.bundle.js diff** — rebuild after wordlist import path fix + entropyToMnemonic export.  
2. **Pad can emit valid BIP-39 from weak rolls** — intentional teach; TOO LOW verdict is the lesson.  
3. **Plain-text passphrases on Tools compare** — intentional; shoulder-surf disclosed.  
4. **Still 6 primary nav items** — Tools jump rail is in-panel only.  
