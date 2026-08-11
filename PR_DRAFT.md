# PR Draft: Hygiene — Comet SLIP-39 pass + stamp drift + 6-nav clarity

**Spec waiver:** chore  
**Range:** docs + slip39.html UX nit + e2e S57 assert

## What Problem This Solves

1. ROADMAP “Current focus” still said **v0.13.9** after site **v0.13.10**.  
2. Stashed harness script noise risked accidental apply.  
3. Comet-style SLIP-39 review: clarify **why there is no 7th nav item**.  
4. SLIP-39 page had no sidebar “you are here” cue.

## Why This Change Was Made

Housekeeping after feature-complete SLIP-39 A–D; no new product surface.

## User Impact

- ROADMAP focus matches **v0.13.10** + Pi/Knots next step.  
- SLIP-39: Shamir nav highlighted as **deep-link parent**; teach text says sidebar stays 6 items.  
- Harness drift stashes **dropped** (not applied).  
- Playwright S57 asserts 6 nav items and no `data-nav="slip39"`.

## Evidence

- `npx playwright test e2e/slip39.spec.ts` (S57+ suite)  
- Live: 6 `nav-item` on `/` and `/slip39.html`  
- Comet note in `docs/E2E_COMET_SCENARIOS.md` (2026-08-11)

## Traceability

| AC | Evidence |
|----|----------|
| Stamp drift fixed | ROADMAP Current focus v0.13.10 |
| Comet pass documented | E2E_COMET human pass note |
| No 7th nav | S57 e2e + teach copy |
| Stash noise cleared | `git stash list` empty of harness WIP |

## Threat notes

- **secrets** — no secrets in docs/UI copy.  
- **xss** — text-only HTML copy change.  
- No CSP change; offline SLIP-39 retained.

## Red-proof

```text
TDD N/A for pure copy; e2e extended
red_cmd: false
green_cmd: true
```

## Evidence pack

- **hard_gates** / CODE-REVIEW  
- **smoke** / check_web_e2e  
- **pytest** N/A (no py change)  

## Things that look bad but are actually fine

1. **Shamir “active” on SLIP-39 page** — intentional parent cue; not a 7th step.  
2. **Dropped stashes** — harness reinstall noise, not product WIP.  
3. **7th-nav SLIP-39 never shipped** — by design (see below).  

### What is “7th-nav SLIP-39”?

The site sidebar is fixed at **6** destinations: Lab → Multisig → Shamir → Network → Tools → Glossary.  
**SLIP-39 lab** lives at `/slip39.html` but is **not** step 7 in that rail — entry is **deep-link from Shamir** (`#shLinkSlip39`). That keeps Multisig vs Shamir vs SLIP-39 from overcrowding the primary IA and avoids implying SLIP-39 is a first-class funded-wallet backup path.
