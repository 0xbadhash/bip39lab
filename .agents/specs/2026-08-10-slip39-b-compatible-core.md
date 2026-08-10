# SLIP-39 lab B — Compatible core (split/combine)

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** implemented
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none (library wrap)
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Teach shell alone cannot demonstrate real SLIP-39 share mnemonics. Learners need offline round-trip split/combine with golden vectors — without claiming hardware restore safety.

## Solution

Wrap a vetted SLIP-39 implementation (Python `slip39` for CLI/tests; npm `slip39` for web bundle). Enable 2-of-3 (and 3-of-5) single-group split → share word lists → combine M shares → master secret hex match/mismatch. Fail-closed on bad input.

## User Stories

1. As a learner, I want to split a practice master secret into SLIP-39 words, so I see the real format.
2. As a learner, I want to recombine M shares and see match/mismatch, so threshold is tangible.
3. As a tester, I want golden vectors, so the path stays format-compatible.

## Implementation Decisions

- `src/bip39lab/slip39_lab.py` thin wrap; CLI subcommands optional/minimal.
- `web/js/slip39-core` via esbuild of npm `slip39`; `slip39-app.js` wires UI.
- Never auto-pull Lab BIP-39; CSPRNG or paste hex only.
- Wordlist via library (no silent network fetch at runtime).

## Testing Decisions

- pytest: golden split/combine vectors; under-threshold / bad words fail.
- Playwright: S58 happy 2-of-3 demo; S59 under-threshold error.
- No secret retention tests if disk paths exist.

## Acceptance Criteria

- [x] 2-of-3 (and 3-of-5) split+combine offline on web demo
- [x] At least one official-style golden vector passes in pytest
- [x] Fail-closed: under-threshold / bad mnemonic → error, no fake secret
- [x] Lab danger copy still present; no wallet-safety claim
- [x] Product smoke green; no secrets committed

## Out of Scope

- Multi-group designer UI, passphrase UX (C)
- BIP-39↔SLIP migration tool; Network/balance

## Clarifications

### 2026-08-10
- Q: Hand-rolled crypto?
  - A: No — library wrap only for “compatible” path.

## Handoff

- Next: `/execute_dev` then `/code_review`
