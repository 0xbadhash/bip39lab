# PR Draft: Option B — Watch-only xpub/zpub + offline QR

**Range:** `v0.7.1...HEAD`

## What Problem This Solves

Users could not export watch-only account keys or show offline address QRs from the lab.

## Why This Change Was Made

ROADMAP Option B / full FSM after harness reinstall.

## User Impact

- Watch-only panel: BIP86 xpub, BIP84 zpub, BIP49 ypub, BIP44 xpub (no xprv)
- Copy + QR on addresses and keys
- Offline SVG QR; CSP `img-src 'self' data:`

## Evidence

```text
red_cmd: python -m pytest -q tests/test_web_vectors.py
green_cmd: python -m pytest -q
```

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | PR_DRAFT + CODE-REVIEW + BEHAVIOR + red-proof |
| smoke | pytest |
| pytest | 41 passed |
| validate | 5/5 |

## Spec

**Spec:** `.agents/specs/2026-08-06-option-b-watch-only-xpub-qr.md`

**Plan:** `.agents/specs/2026-08-06-option-b-watch-only-xpub-qr-plan.md`

## Traceability

| AC | Evidence |
|----|----------|
| ACB.1 zpub BIP84 | test_web_js_watch_only_and_qr |
| ACB.2 BIP86/44 xpub | exportWatchOnly keys list |
| ACB.3 no xprv | test noXprv + refuse QR xprv |
| ACB.4 QR offline | qrDataUrl SVG data URL |
| ACB.5 English help | watch-only panel copy |
| ACB.6 CSP | connect-src none; img data for QR |
| ACB.7 tests | 41 passed |

## Threat notes

- Public keys/addresses only; private extended keys refused in QR.
- Watch-only is not spending capability.

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_web_vectors.py::test_web_js_watch_only_and_qr
green_cmd: python -m pytest -q
```

## Cross-review

CODE-REVIEW p0=0; CROSS-REVIEW blockers=0; BEHAVIOR pass.

## Things that look bad but are actually fine

1. Bundle ~250KB with qrcode — offline vendor, no CDN.
2. BIP86 uses standard xpub not a special SLIP-132 (documented).
3. Option C still open.

```yaml
things_that_look_bad_but_are_fine:
  - file: "web/js/bip39lab.bundle.js"
    concern: "size"
    why_fine: "offline QR encoder"
  - file: "web/js/build-entry.mjs"
    concern: "BIP86 xpub not vpub"
    why_fine: "no standard SLIP for all wallets"
  - file: "ROADMAP.md"
    concern: "C still open"
    why_fine: "separate ship"
```
