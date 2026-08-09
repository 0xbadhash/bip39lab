# Shamir recombine (educational, non-SLIP-39)

- **Product:** bip39lab
- **Created:** 2026-08-08
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** `ROADMAP.md` → Open work (**Next**)
- **Plan:** none (extend existing Shamir surface; stack already decided in v1 tab + plan)
- **Tracker:** local
- **Constitution:** AGENTS.md (no retention, offline-first crypto, no seed network)

## Problem Statement

v1 Shamir teaches split and shows N share cards, but learners cannot **prove** the threshold idea end-to-end: “any M shares rebuild the secret.” Without a recombine step, the demo loop is incomplete and easy to mistrust. Users must not confuse this lab format with production SLIP-39 / hardware recovery, or treat recombine as a wallet-safety claim.

## Solution

On the existing **Shamir** page (`shamir.html`), close the educational loop:

1. After a demo split, the learner can **verify recombine** from M (or more) share lines in `share:index:hex` form.
2. Recovered bytes are shown offline and, when the practice secret field is still filled, compared for a clear **match / mismatch**.
3. Optional helper: **Fill M shares from cards** so the happy path is one click after split.
4. Copy and chrome stay **educational / not SLIP-39 / not for real funds** — no wallet-safety claim.
5. CSP remains offline crypto (`connect-src 'none'`); no Lab mnemonic auto-use; no retention.

**Note for implementer:** Comet polish (`edb7220`) may already land UI + `combineShares` + Playwright **S56**. `/execute_dev` should **gap-check** against acceptance (unit + e2e + copy + step-rail + ROADMAP/Comet alignment), not re-implement blindly.

## User Stories

1. As a learner, after a 2-of-3 split I click **Verify recombine** (with M shares filled) so I see the practice secret reconstructed offline.
2. As a learner, I use **Fill M shares from cards** so I do not hand-copy share lines for the default demo.
3. As a learner, I paste any M of the N share lines (including non-consecutive indices) and still recombine correctly.
4. As a cautious user, I still see **not SLIP-39 / demo only / not for real funds** near recombine so I never treat this as hardware recovery.
5. As a learner with bad input (empty, wrong format, fewer than M, duplicate index), I get a clear error and no fake “OK”.
6. As a returning user, step rail / teach copy mentions recombine as step 4 of the teach loop without expanding nav beyond the existing 6 destinations.

## Implementation Decisions

- **Surface:** Same offline page `web/shamir.html` + `web/js/shamir-core.js` / `shamir-app.js`; Python mirror `src/bip39lab/shamir.py` already has `combine_shares` for tests.
- **Format:** Educational `share:index:hex` only — **not** SLIP-39 mnemonics, **not** BIP-39 words.
- **API seam:** `combineShares(shares[]) → bytes` (any ≥ M distinct indices; threshold encoded in share math / validated at combine time as today).
- **UX:** Primary CTA **Verify recombine**; helper **Fill M shares from cards**; status + pre output; match practice secret when field non-empty.
- **Safety copy:** Recombine must not claim production backup or wallet safety; danger banner remains page-level.
- **Offline / retention:** Unchanged AGENTS non-negotiables.
- **Step rail (optional polish):** Add step **4 · Recombine** targeting `#shCardRecombine` if missing.

## Testing Decisions

- **Seam:** Unit tests already cover `combine_shares` / any-M reconstruction / under-threshold refuse; keep green; add edge cases only if gaps (malformed lines, duplicate index).
- **E2E:** Playwright **S56** — generate → split 2-of-3 → recombine → matches practice secret; keep S53–S55.
- **Smoke:** product `smoke[]` (pytest + e2e).
- **Manual:** Local static server; DevTools network idle on recombine; no seed in console logs.

## Acceptance Criteria

- [ ] Shamir page exposes **Verify recombine** that reconstructs the practice secret offline from M valid educational share lines.
- [ ] Happy path after default 2-of-3 split: fill (or auto-fill) any 2 shares → recombine → **matches practice secret** (status + output).
- [ ] **Fill M shares from cards** (or equivalent) works after a successful split.
- [ ] Invalid / empty / under-threshold / bad format → clear error; no fake success.
- [ ] Page still banners **educational / not SLIP-39 / not for real funded seeds**; no wallet-safety claim on recombine.
- [ ] CSP offline (`connect-src 'none'`); no automatic Lab mnemonic; no secret retention or network of shares.
- [ ] Unit tests for combine (any M of N; under-threshold fails); Playwright **S56** green; product smoke green.
- [ ] Comet/E2E docs and ROADMAP open item aligned (recombine no longer “optional later” once shipped).
- [ ] No secrets committed.

## Out of Scope

- **SLIP-39** (Trezor-compatible wordlists, group schemes, integrity-checked SLIP wordlists, official fixtures) — **separate larger ship**; needs its own `/spec`.
- Production backup product, hardware restore, or “safe for funded seeds” claims.
- QR / SeedQR of shares; animated export; multi-device share sync.
- Pulling Lab live mnemonic into Shamir without an explicit danger gate (still prefer out of scope).
- Network / balance / Multisig policy changes.
- Non-English UI.

## Clarifications

### 2026-08-08

- Q: Scope of this ship?
  - A: **Shamir recombine** (still **non-SLIP-39**) to complete the demo loop; **no wallet-safety claim**.
- Q: Is SLIP-39 in this ship?
  - A: **No** — larger follow-up (integrity-checked wordlists + fixtures); track as separate OPEN later if needed.
- Q: Interview depth?
  - A: User supplied scope in-channel; recommended defaults applied (existing page, educational format, S56-style verify).

## Further Notes

- **Constitution:** Offline-first + no retention; hand-rolled GF(256) remains educational — label stays honest.
- **Confusion risk:** Multisig = M-of-N *keys*; Shamir recombine = M-of-N *shares of one secret*; SLIP-39 = *standard word shares* — keep all three distinct in copy.
- **Codebase state:** Split + recombine core/UI/tests may already exist post-`edb7220`; this spec formalizes ship acceptance and ROADMAP handoff for full FSM.
- **Risk:** Over-claiming recombine as production recovery → mitigate with fixed danger banner + output wording (“practice secret”, “educational”).

## Handoff

- Next: `/execute_dev` (gap-check vs acceptance; TDD only where red)
- Then: follow `python scripts/next_skill.py --after execute_dev` → `/code_review` … → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
