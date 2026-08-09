# Multisig teach UX polish

- **Product:** bip39lab
- **Created:** 2026-08-09
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Multisig page still reads like a mini-wizard and under-states that it is an **address/script calculator**, not a spendable wallet. Learners confuse BIP84 **zpub** with BIP44 **xpub**, miss BIP67 sort risk, and may fund demo material. Step rail numbering implies locked order; Ian Coleman comparison over-claims “safer than his tool.”

## Solution

Offline Multisig page teaches M-of-N with clearer framing: calculator-only banner, jump-link step rail (no forced wizard), dual chips (CSP offline crypto + browser online/offline), BIP67 off warning, zpub ≠ xpub callout, stronger before-fund verify copy, fairer Ian Coleman note. No change to crypto policy (pubkeys only, refuse secrets, CSP `connect-src 'none'`).

## User Stories

1. As a learner, I see “address calculator only” up front, so I do not treat this page as a funded wallet.
2. As a learner, I can jump among Learn / Keys / Build / Result without a locked wizard, so I can re-read freely.
3. As a learner, I understand BIP84 zpub is not BIP44 xpub, so I avoid wrong imports.
4. As a cosigner, when BIP67 sort is off I see a clear warning, so I do not mismatch addresses across tools.
5. As an airgap user, I see browser online/offline separately from CSP offline crypto, so I do not confuse network status with crypto egress policy.

## Implementation Decisions

- Surfaces: `web/multisig.html`, `web/js/multisig-app.js` only (no bundle crypto change unless tests demand).
- Keep public-keys-only, BIP67 default on, refuse WIF/xprv (existing).
- Airgap chip uses `navigator.onLine` + online/offline events (same idea as Lab).
- No network CSP relaxation; no private key fields.

## Testing Decisions

- Unit: extend `tests/test_multisig.py` static HTML/JS contracts for new IDs/copy anchors.
- E2E: extend `e2e/multisig.spec.ts` for calculator banner, airgap chip, BIP67 warn visibility.
- Smoke: product unit + e2e; `check_web_e2e.py`.
- Comet: map new S-ids if any; prefer reusing S26–S31 with assertions.

## Acceptance Criteria

- [ ] AC-1: Page shows calculator-only / not-a-wallet warning (visible, not teach-only only).
- [ ] AC-2: Step rail is jump links (aria-label / copy clarifies not a locked wizard); section targets present (`#msCardIntro`, keys/demo/build, result).
- [ ] AC-3: Dual status chips: Offline crypto (CSP) + airgap (`#chipAirgap`) with online/offline classes.
- [ ] AC-4: BIP67 unchecked reveals `#msBip67Warn`; checked hides it.
- [ ] AC-5: Demo help states BIP84 zpub is **not** an xpub; after-build “verify before funding” copy present.
- [ ] AC-6: Ian Coleman comparison does not claim his tool is “unsafe by nature.”
- [ ] AC-7: Existing golden 2-of-2 / refuse private still pass; CSP `connect-src 'none'` unchanged.
- [ ] AC-8: Product smoke (pytest + e2e) green; no secrets committed.

## Out of Scope

- SLIP-39 / Shamir changes
- PSBT cosign / spending wallet
- Descriptor multisig export beyond current
- Network balance for multisig addresses
- Changing P2SH/P2WSH crypto or BIP67 sort algorithm

## Clarifications

### 2026-08-09
- Q: New feature vs chore polish?
  - A: Full FSM with formal spec (user asked Full FSM first); small UX ship, not new crypto.
- Q: Ship before further Multisig depth?
  - A: Yes — land teach UX, then later Multisig work can stack.

## Further Notes

- Dirty tree already held most HTML/JS edits; this ship freezes them behind AC + tests.
- Security: still no retention; demo mnemonics memory-only.

## Handoff

- Next: `/execute_dev` (TDD on static + e2e contracts)
- Then: `/code_review` → NEXT_SKILL → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
