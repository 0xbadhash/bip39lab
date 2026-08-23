# Use-case tracks V2 (parallel surface)

- **Product:** bip39lab
- **Created:** 2026-08-23
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work (Use-case tracks)
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete
- **Stamp (V2 only):** `0.17.0-v2`

## Problem Statement

Classic Lab (`/`) is a power-user room tour. Learners need a **use-case track** that practices the custody decision offline, then sends them to a wallet they trust — without replacing production root until the CEO promotes V2.

## Solution

A **real** (not mock) surface at `/v2/` (or `/v2/index.html`) using existing scure/Lab JS. Picker → per-track force ack → guided rail with pauses → existing crypto. Classic `/` unchanged.

**Mission (always visible on V2):** Practice the custody decision offline, then do the real thing in a wallet you trust.

## User Stories

1. As a first-time learner, I want a use-case picker, so I start with a job not a feature tour.
2. As a Starter, I want UC1 generate to show a numbered practice card before any receive address.
3. As a Starter, I want Validate gated until I ack that I looked at the backup card.
4. As a learner, I want a force-exit checkbox that I will not fund practice phrases/addresses.
5. As a power user, I want sidebar rooms (Lab / Multisig / Shamir / Network / Tools / Glossary) as deep links.
6. As CEO, I want `/` classic and `/v2/` comparable until an explicit promote ship.

## Implementation Decisions

- Serve `web/v2/` static files. Reuse `web/js/bip39lab.bundle.js`, `web/js/shamir-core.js`, `web/css/app.css` tokens. No new `--cx-*` families.
- Track progress in `sessionStorage` keys `bip39lab.v2.*` (never mnemonics/seeds).
- Deep link `/v2/?uc=3` opens UC3 after that track’s gate.
- Header: Classic lab → `/`. V2 footer stamp `0.17.0-v2` only (do not bump prod `web/VERSION` in this ship).
- Mocks (`web/mock-uc*.html`) are UX/flow specs, not shipped as the product.

## UX contract

1. Gate once per track: scope + Done when + Start.
2. Horizontal rail: number circles + names + arrows; progress N/M.
3. Concept strip: 3 cards; current `hi`.
4. Pause before advance: explicit ack; no silent rail jumps.
5. Generate → words first; Validate after “I looked at the backup card” (UC1/UC2).
6. Numbered backup card + practice stamp.
7. Exercises between concepts.
8. Quiz: green `--ok` / `msg-ok`; red `--bad` / `msg-bad`.
9. Force-exit checkbox before Finish; tease next UC.
10. Clear secrets: `.btn.danger`; Lab memory only.
11. Pads width = air-gap banner.
12. Hover-(i) OK-only where product already uses them.

## Testing Decisions

- Playwright: picker loads; UC1 generate hides addresses; Validate gated; quiz colors; force exit; `/` still classic `#btnGenerate`.
- pytest unchanged (no Python in this slice).
- Commands: `npx playwright test e2e/v2.spec.ts`

## Acceptance Criteria

- [ ] https://bip39.catalyxt.xyz/ still classic
- [ ] `/v2/` picker + UC1–UC10
- [ ] UC1 real BIP-39 generate → numbered card → pause → derive real addresses
- [ ] No jump to addresses on Generate alone
- [ ] Green/red quiz feedback
- [ ] Force-exit ack required
- [ ] Network remains explicit opt-in (V2 teaches; live lookups stay on Network page)
- [ ] Clear secrets red; practice stamps visible
- [ ] Mocks not shipped as the product
- [ ] Stamp `0.17.0-v2` on V2; e2e green for V2 smoke

## Out of Scope

- Replacing production root
- New skins / new CSS token families
- Production SLIP-39 / Trezor Suite claims
- Auto balance fetch without opt-in
- Storing or logging mnemonics on disk/server
- Second crypto stack

## Grill-me

**Status:** complete
**Date:** 2026-08-23

### G1 Outcome
- Q: What does the learner walk away able to do?
  - A: Practice one custody job offline, then use a wallet they trust — never fund the lab phrase.

### G2 Non-goal / kill
- Q: What must we refuse?
  - A: Replacing `/`, signing/broadcasting, storing seeds, new token families.

### G3 Wrong product
- Q: Could this be a docs site?
  - A: No — generate/derive must be real BIP-39 via existing Lab APIs.

### G4 Cheapest alternative
- Q: Ship mocks as /v2/?
  - A: No. Mocks are flow specs only.

### G5 Abuse / failure
- Q: What if someone funds a practice address?
  - A: Force-exit ack; stamps; Clear secrets; mission always visible.

### G6 Verify
- Q: How do we know V2 didn’t eat prod?
  - A: Playwright: `/` still has classic `#btnGenerate`; `/v2/` has picker.

### G7 Priority
- Q: Why P0 now?
  - A: Locked IA 2026-08-23; CEO needs a comparable real surface.

## Handoff

- Next: `/execute_dev`
- Then: reviews → `/pr_review --validate` → `/release_mgmt` (V2 stamp only) → `/sync_docs`
