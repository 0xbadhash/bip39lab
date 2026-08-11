# First hour — human path (bip39lab)

**Audience:** Starter → Beginner. **Time:** 15–30 minutes.  
**Rule:** Use only **practice** phrases. Never paste a funded recovery phrase on a machine you do not trust.

## What this is / isn’t

| Is | Isn’t |
|----|--------|
| Offline classroom for BIP-39 | A wallet (no send) |
| Practice generate / derive | Safe place for real seeds on a public PC |
| Educational Multisig / Shamir / SLIP-39 | Production SLIP-39 / Trezor Suite |
| Tools inspect PSBT structure | Signer or broadcaster |

## Checklist (in-app)

On Lab, **First hour checklist** mirrors this list. Each step has:

| Control | What it does |
|---------|----------------|
| **Go** | Jump to the card / Tools panel / Network page for that step |
| **Mark done** | Tick the step and return to this checklist |
| **Checkbox** | Same as Mark done (toggle); progress in `localStorage` only |
| **← Back to First hour** | Sticky bar while a step is open; also on Network when `?from=firsthour` |

1. Read the air-gap banner and **What this is / isn’t** on Lab.  
2. **Generate** a 12-word practice phrase.  
3. Confirm the address table fills (same phrase → same addresses).  
4. Open **Tools → Path playground** — read purpose / coin / account / change / index.  
5. **Tools → Passphrase compare**: leave A empty, B = `test` → addresses differ.  
6. Complete the three **quiz** self-checks (wrong pp, under-threshold Shamir, low entropy pad).  
   Same UX as this checklist: **Go try** → sticky **← Back to quiz** → keep experimenting until clear → **Mark passed**. Status board shows Not yet / Passed.  

7. Optional: **Network** fees; understand leak ack before any address query.  
8. Set **Level → Beginner** when ready (**Set Beginner** / **I’m ready for Beginner**).

Static copy (when the host serves `/docs/`): `web/docs/FIRST_HOUR.md`.  
Repo path: `docs/FIRST_HOUR.md`.

See also: `docs/LEARNING_PATH.md` (Starter → Advanced).
