# V2 UC11–UC13 interactive labs

- **Product:** bip39lab
- **Created:** 2026-08-25
- **Status:** ready-for-agent
- **Plan:** `.agents/specs/2026-08-25-v2-uc11-13-interactive-plan.md`
- **Priority:** P0
- **Surface:** `web/v2/` only

## Problem Statement

UC11–UC13 were lecture pads. Learners needed to tap who holds keys, fail to leave an exchange, get locked out, and see a hot phone vs hardware steal — not reread Do/Do not.

## Solution

In-place rewrite. Same track IDs. Continue gated on the move.

- UC11: They/You taps (green/red). Company app: seed phrase, cannot open elsewhere, 5s auto lock. You-hold is the opposite of the exchange.
- UC12: Hot wallet on phone (balance then malware drain to 0). Hardware: device / USB watch-only / type-seed drain.
- UC13: sort four objects + brand trap.

## Acceptance Criteria

- [ ] UC11 They/You green ok / red bad; lock after timer; no `#v2ExFreeze`
- [ ] UC12 place phone shows 0.184 then malware → 0.000; USB air-gap; type-seed vault killed
- [ ] UC13 `#v2Sort-*` and `#v2TrapHot`/`#v2TrapCold`
- [ ] V2-S14 still that id; classic `/` unchanged
- [ ] Playwright V2 suite green

## Out of Scope

Classic `/`. Leftover `scripts/*.py`.
