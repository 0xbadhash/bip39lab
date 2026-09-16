# V2 Sovereign Sessions stamped UC polish (UC14 / UC6+A/B/C / UC21 / UC36)

- **Product:** bip39lab
- **Created:** 2026-09-16
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none (CEO stamp + existing OPEN specs)
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Surface:** `web/v2/` (+ Multisig A/B/C already shipped; mark DONE)
- **Brief:** `/opt/second-brain/vault/agent-tasks/briefs/BRIEF-W6-BIP39-SOVEREIGN-UC-STAMP-2026-09-16.md`
- **Learn SoT:** `/opt/second-brain/vault/raw/2026-09-16_learn-SovereignSessions-BIP39-UCs.md`

## Grill-me

**Status:** spike-skipped
**Date:** 2026-09-16
**Reason:** CEO stamped all four scope bullets in BRIEF-W6-BIP39-SOVEREIGN-UC-STAMP-2026-09-16; product decisions fixed in brief + learn SoT (no invent). Full grill deferred as stamp-complete spike.

## Problem Statement

Sovereign Sessions learn mapped concrete classroom gaps: UC14 missing offline-verify / online-bip39 Do-not; UC6 missing explicit vault-map (BSMS) + recovery-drill + vendor-diversity beats (classic Multisig A/B/C exist; V2 track under-teaches); UC21 missing phone/hardware/server shaped drills + cloud backup vs BIP-39 paper contrast; no UC for trusted recovery-contact practice (UC36 free after UC35).

## Solution

1. **UC14 polish** — Keep weak-pad indicator. Add SeedSigner-shaped + offline Ian Coleman verify storyboard step. Do/Do-not: never type funded words into online bip39 tools; lab = offline classroom.
2. **UC6 + OPEN A/B/C** — Classic Multisig already has `#msVaultMap` / rebuild / `#msVendorDiversity` (S72–S74). Finish by marking OPEN A/B/C DONE and adding V2 UC6 classroom step: map-as-object (BSMS vocabulary), rebuild-vs-without-map drill, vendor-diversity Extra help. Prefer finishing A/B/C over inventing a map UC#.
3. **UC21 polish** — BitKey-*shaped* 2-of-3 (phone / hardware / server) drills + encrypted cloud backup vs BIP-39 paper contrast. No BitKey/Casa branding requirement. Keep “this tab does not run BitKey/Casa.”
4. **UC36 new** — Trusted helper / recovery-contact practice drill (adjacent UC18). Practice only; no real social recovery. Picker UC1–UC35 → UC36 free.

## Locks

- P0 honesty / isolation / secret-export walls stay
- FROST = teach contrast only — no product FROST/SLIP claim
- No SeedXOR/SLIP invent; do not reopen UC32 PASSes
- No funded-phrase-on-website
- Dark/amber; VERSION bump site + V2 + Playwright + comet same ship

## Acceptance Criteria

- [ ] UC14 shows offline-verify storyboard + Do-not funded words into online bip39 tools; weak-pad TOO LOW still works (V2-S15 + new V2-S188)
- [ ] V2 UC6 teaches vault map/BSMS object + recovery drill + vendor diversity; classic S72–S74 still pass; ROADMAP OPEN A/B/C → done
- [ ] UC21 teaches phone/hardware/server 2-of-3 + cloud backup ≠ BIP-39 paper; copy says this tab does not run BitKey/Casa (V2-S189)
- [ ] UC36 in picker (36 cards on All); practice helper drill only; no real social recovery (V2-S190)
- [ ] site VERSION bump past 0.16.90; V2 past 0.17.138/139; chip === `/v2/VERSION` === Playwright expect === comet Product line lockstep with site

## Out of Scope

Real SeedSigner/Ian Coleman integration; real BitKey/Casa; FROST product; SeedXOR/SLIP changes; UC32 reopen; Boss/Bob messaging.

## Testing Decisions

- Extend `e2e/v2.spec.ts` (V2-S188…S190) + update card count 35→36; V2 version expect
- Keep `e2e/multisig.spec.ts` S72–S74
- Comet scenarios for new S-ids
- `npx playwright test e2e/v2.spec.ts` targeted + product_smoke

## Clarifications

### 2026-09-16 (CEO stamp defaults)
- Q: UC36 id free?
  - A: Yes — picker ends at UC35.
- Q: Brand BitKey/Casa?
  - A: No requirement; keep disclaimer.
- Q: Finish A/B/C vs new map UC?
  - A: Finish A/B/C + V2 UC6 classroom.

## Handoff

- Next: `/execute_dev`
