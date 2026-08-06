# Option B — Watch-only export (xpub / zpub / QR)

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-06-option-b-watch-only-xpub-qr-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Users can derive receive addresses in the lab but cannot export **watch-only** account keys for import into Sparrow / BlueWallet / etc., nor show an **offline QR** of an address for easy phone capture — without pasting long strings.

## Solution

On the Lab (English, offline):

1. **Account-level public extended keys** for the selected account (and current passphrase), per purpose:
   - BIP84 → **zpub** (preferred label) with path `m/84'/0'/account'`
   - BIP86 → **xpub** or documented SLIP-132 if standard exists for Taproot (document exact form)
   - BIP44 → **xpub** at `m/44'/0'/account'`
   - Optional BIP49 → **ypub**
2. **Never show xprv / private keys by default.** No private export in this phase unless behind a hard double-confirm (default: **no private export at all**).
3. **QR codes (offline):** for a selected address in the table (or “QR” button per row/column), render QR of the address string only — no network, no third-party CDN (local QR lib vendored or pure JS).
4. Plain-English: “watch-only = see money, not spend; like a bank statement login without transfer rights.”

## User Stories

1. As a user, after a valid mnemonic + account, I copy a **zpub** for BIP84 account 0 into Sparrow as watch-only.
2. As a user, I tap **QR** on a receive address and scan it with my phone camera.
3. As a user, I never accidentally see or copy an xprv.

## Implementation Decisions

- Surface: web Lab first (same card shell); CLI optional follow-up.
- Reuse current account / passphrase / derive controls.
- QR: vendor a small offline library into `web/js/` (no CDN); CSP `script-src 'self'` stays.
- Hide private fields still hides mnemonic/passphrase; public xpub/zpub may remain visible (they are public) — still respect hide-private if user prefers minimal UI (optional).
- English only.

## Testing Decisions

- Unit / vector: known abandon…about BIP84 account 0 zpub (or xpub) against published vector if available.
- QR: presence of canvas/SVG + address payload unit test or smoke.
- No network in tests.
- pytest + web static checks.

## Acceptance Criteria

- [ ] ACB.1 Show/copy account public extended key for BIP84 (zpub or clearly labeled xpub+path) for selected account.
- [ ] ACB.2 At least one of BIP86 / BIP44 public export as well (document which).
- [ ] ACB.3 No xprv displayed or copyable in default UI.
- [ ] ACB.4 Per-address QR (offline) for addresses currently shown in the table.
- [ ] ACB.5 English help: watch-only vs spend; passphrase changes all exports.
- [ ] ACB.6 Offline CSP preserved (no CDN).
- [ ] ACB.7 Tests/smoke green.

## Out of Scope

- Option C network/fees
- Multisig descriptors (may follow)
- Hardware wallet USB bridge
- Showing seed QR

## Clarifications

### 2026-08-06
- Q: Private keys?
  - A: Out of default UI entirely this phase.
- Q: Spec only now?
  - A: Yes — implement later via `/execute_dev`.

## Handoff

- Next: `/execute_dev` (Option B)
- Then: reviews → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
