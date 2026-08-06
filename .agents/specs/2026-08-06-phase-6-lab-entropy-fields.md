# Phase 6 — Lab entropy fields (mnemonic + passphrase)

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

In the hosted lab (`bip39.catalyxt.xyz`), users generate or paste a BIP-39 phrase but never see **how much entropy** that phrase carries. When they add an optional **BIP-39 passphrase**, they need a **separate** readout (not overwriting the mnemonic figure) so they understand the extra secret’s contribution.

## Solution

On the **Lab** panel (English UI only):

1. **Mnemonic entropy** — a dedicated read-only field that shows BIP-39 entropy for the current phrase (when valid / after generate).
2. **Passphrase strength** — a **different** read-only field that updates when the optional passphrase is non-empty; stays empty/hidden or “n/a” when no passphrase.

Both stay offline, in-memory only, and respect **Hide private fields** / **Clear secrets**.

## User Stories

1. As a user, after **Generate** or a valid paste, I see **mnemonic entropy** (bits, and word-count basis) without leaving the Lab.
2. As a user, when I type a **passphrase**, a **separate field** shows a recalculated passphrase strength estimate; the mnemonic entropy field does not disappear or get replaced.
3. As a user, clearing secrets or emptying the passphrase clears the passphrase field; invalid mnemonics clear or mark mnemonic entropy as invalid.

## Implementation Decisions

### Surface

- **Primary:** static web Lab (`web/index.html` + `app.js` + CSS card shell).
- **Optional parity:** CLI could print entropy later — **out of minimum** unless trivial.

### What “entropy” means here (product definition)

| Field | Meaning | When shown |
|-------|---------|------------|
| **Mnemonic entropy** | BIP-39 **ENT** bits from word count for a **valid** English mnemonic: 12→128, 15→160, 18→192, 21→224, 24→256. Optionally show ENT size in bytes. Not Shannon over the English text (that would mislead). | After Generate, or after Validate when checksum+wordlist OK |
| **Passphrase strength** | **Estimated** strength of the optional passphrase alone (bits), using a documented offline estimator (length + charset diversity / Shannon-style). Label clearly as **estimate**, not BIP-39 ENT. | Passphrase length &gt; 0 |
| Combined | Do **not** invent a single fake “total bits” that claims to be BIP-39 standard. Optional short note: seed is always 64-byte PBKDF2 output; security depends on secrecy of mnemonic **and** passphrase. | Optional helper text |

### UI (English only)

- Label examples:
  - `Mnemonic entropy` → e.g. `128 bits (12-word BIP-39)`
  - `Passphrase strength (estimate)` → e.g. `~42 bits (estimate)` or `—` when empty
- Place mnemonic entropy under the mnemonic box; passphrase strength under the passphrase box (separate fields).
- Update live on input (debounce OK) and on Generate / Validate & derive / Clear.
- Hidden with `data-private` when “Hide private fields” is on (same as secrets).

### Non-goals / constraints

- No network; no logging of phrase or passphrase.
- No other languages in UI.
- Do not claim passphrase bits are “BIP-39 entropy.”
- Do not show raw seed hex by default (retention / shoulder-surfing risk).

## Testing Decisions

- Unit (JS or pure function extractable): word-count → ENT bits table; invalid mnemonic → no ENT claim.
- Passphrase estimator: empty → n/a; longer mixed → higher estimate than short numeric (smoke thresholds).
- Manual on https://bip39.catalyxt.xyz Lab panel after deploy.

## Acceptance Criteria

- [ ] AC6.1 After generating a 12-word mnemonic, **Mnemonic entropy** shows **128 bits** (and indicates 12-word BIP-39). Same mapping for 15/18/21/24 → 160/192/224/256.
- [ ] AC6.2 Invalid mnemonic (bad word or checksum) does not show a valid ENT claim (shows error/empty/invalid).
- [ ] AC6.3 **Passphrase strength** is a **separate** field from mnemonic entropy; adding a passphrase does not overwrite the mnemonic entropy value.
- [ ] AC6.4 Empty passphrase → passphrase field empty / “—” / hidden; non-empty → estimate updates offline.
- [ ] AC6.5 Clear secrets resets both fields; hide-private hides both with other private UI.
- [ ] AC6.6 English labels only; still offline CSP; no secret retention.
- [ ] AC6.7 Product smoke / relevant tests green.

## Out of Scope

- Multi-language UI
- zxcvbn CDN or any network strength API
- Showing seed hex / xprv by default
- Changing BIP-39 generation crypto
- Electrum-style seed versions

## Clarifications

### 2026-08-06
- Q: Mnemonic entropy = Shannon of words or BIP-39 ENT?
  - A: **BIP-39 ENT bits** from valid word count (standard lab definition).
- Q: Passphrase in same field or different?
  - A: **Different field** (user requirement). Mnemonic ENT stays; passphrase gets its own estimate.
- Q: CLI required?
  - A: Web Lab first; CLI optional follow-up.
- Q: Interview more?
  - A: No — outcome clear enough for ready-for-agent.

## Further Notes

- Users often confuse “512-bit seed” (PBKDF2 output size) with “512 bits of entropy.” Copy must not conflate them.
- Passphrase estimator is pedagogical; real security depends on attacker models.

## Handoff

- Next: `/execute_dev`
- Then: `NEXT_SKILL` → … → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
