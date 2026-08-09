# PR Draft: Multisig teach UX polish

**Range:** `buzz/main...HEAD`  
**Spec:** `.agents/specs/2026-08-09-multisig-teach-ux.md`

## What Problem This Solves

Multisig page under-stated calculator-only scope, implied a locked wizard, and left BIP67-off / zpub-vs-xpub footguns under-documented.

## Why This Change Was Made

Teach-first Multisig surface after Shamir ship: align framing with Lab (dual CSP/airgap chips), reduce funded-demo misuse, keep crypto offline and pubkey-only.

## User Impact

- Clear **address calculator only** banner
- Jump-link step rail (not numbered wizard)
- Offline crypto + browser online/offline chips
- BIP67-off warning; zpub ≠ xpub; before-fund verify
- Fairer Ian Coleman comparison

## Evidence

- `python -m pytest tests/test_multisig.py -q`
- `npx playwright test e2e/multisig.spec.ts`
- `python3 scripts/check_web_e2e.py --root .`
- Product smoke at release

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 Calculator banner | `test_multisig_teach_ux_contracts` · e2e S26 |
| AC-2 Jump-link rail + section ids | unit + S26 aria-label |
| AC-3 Dual chips | unit chipAirgap/chipOffline · S26 |
| AC-4 BIP67 warn toggle | unit · e2e S28 |
| AC-5 zpub ≠ xpub · before-fund | unit HTML anchors · S12b |
| AC-6 Ian Coleman fair note | unit substring |
| AC-7 Golden + CSP | test_multisig_2of2 · S12 · connect-src none |
| AC-8 Smoke + no secrets | product smoke · secrets review |

## Threat notes

- **Assets:** demo mnemonics / pubkeys remain in page memory only; no disk retention; CSP `connect-src 'none'`.
- **Abuse:** calculator banner + “do not fund demo seeds” + before-fund verify reduce accidental funding of lab material; still refuse WIF/xprv paste.

## Red-proof

```text
red_cmd: (TDD) assert Address calculator only / chipAirgap / syncBip67Warn missing → fail; then green after HTML/JS
green_cmd: python -m pytest tests/test_multisig.py -q && npx playwright test e2e/multisig.spec.ts
```

## Things that look bad but are actually fine

1. Airgap chip can show “online” while Offline crypto chip stays CSP-safe — intentional dual signal.
2. Step rail no longer numbered 1·2·3 — jump links, not process lock-in.
3. No multisig.bundle.js change — teach/UI only; crypto path unchanged.
