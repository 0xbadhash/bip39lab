# PR Draft: SLIP-39 lab B — compatible core

**Product:** bip39lab  
**Spec:** `.agents/specs/2026-08-10-slip39-b-compatible-core.md`  
**spec_sha256:** pin optional  
**Version target:** `v0.13.8`

## What Problem This Solves

Teach shell alone could not show real SLIP-39 share mnemonics. Learners need offline round-trip split/combine with golden vectors — without claiming hardware restore safety.

## Why This Change Was Made

Ship offline-compatible single-group M-of-N (2-of-3 / 3-of-5) using vetted libraries only (no hand-rolled SLIP crypto).

## User Impact

- Demo: generate practice master secret hex → Split → share word cards → Combine M shares → match/mismatch.
- Fail-closed under-threshold / bad words (no fake secret).
- Danger banner retained; lab only; not Trezor Suite / not funded wallets.
- Bonus teach (partial C): wrong-passphrase demo + multi-group diagram (still lab-only).

## Traceability

| AC | Test / smoke |
|----|----------------|
| 2-of-3 / 3-of-5 split+combine offline | `tests/test_slip39_lab.py` roundtrip + Playwright S58 |
| Official-style golden vector | `test_golden_vector_4_combine_trezor_passphrase` |
| Fail-closed under-threshold / bad mnemonic | `test_golden_vector_4_under_threshold_fails` + S59 |
| Lab danger copy; no wallet-safety claim | `tests/test_slip39_shell_copy.py` + S57 |
| Product smoke green; no secrets committed | `python scripts/product_smoke.py` |

## Threat notes

- **secrets:** practice master secret hex and SLIP-39 share mnemonics exist only in browser/CLI memory for the demo; never auto-imported from Lab BIP-39; no disk retention.
- **supply-chain:** crypto via pinned `shamir-mnemonic` + npm `slip39` offline bundle (esbuild); no runtime wordlist fetch; CSP `connect-src 'none'`.
- **xss:** static CSP (`script-src 'self'`); share text rendered as `textContent` only, not `innerHTML` of user strings as HTML.
- Abuse: user mistakes page for production Trezor restore — danger banner + lab-only chips; fail-closed under-threshold (no fake secret).

## Evidence pack

- **pytest:** `.venv/bin/python -m pytest -q tests/test_slip39_lab.py tests/test_slip39_shell_copy.py` → 13 passed
- **Playwright:** `npx playwright test e2e/slip39.spec.ts` → S57–S60 passed
- **smoke:** `python scripts/product_smoke.py --root .` → unit + e2e exit 0
- **web_e2e:** `python scripts/check_web_e2e.py --root .` → ok

### Red-proof / green

- red_cmd: `false` (TDD red marker; suite designed to fail without library wrap)
- green_cmd: `.venv/bin/python -m pytest -q tests/test_slip39_lab.py`

## Untested paths

| Path | Reason |
|------|--------|
| Full multi-group UI designer | Out of scope (ship C) |
| BIP-39 ↔ SLIP migration | Out of scope |
| Hardware device restore | Explicit non-goal |

## Implementation notes

- Python: `src/bip39lab/slip39_lab.py` wraps `shamir-mnemonic`
- Web: esbuild `web/js/slip39-entry.mjs` → `slip39.bundle.js` (npm `slip39`) + `slip39-app.js`
- Never auto-imports Lab BIP-39; CSPRNG or paste hex only

## Out of scope (deferred)

- Full multi-group designer UI (C remainder)
- BIP-39↔SLIP migration; Network/balance
- Docs polish D
