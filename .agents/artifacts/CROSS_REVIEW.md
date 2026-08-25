# CROSS-REVIEW

- **base:** origin/master
- **scope:** uncommitted V2 path language (`v2-app.js`, `index.html`, `v2.css`, `e2e/v2.spec.ts`, `compare.md`)
- **secrets:** gitleaks clean

## Security Guru

**none** (blocker). Progress store is JSON in sessionStorage; hard refresh wipes it. No seed persistence. PSBT inspect never signs. CSP `connect-src 'none'` unchanged.

## Maintainability Expert

**none** (blocker). `GATES` + `TRACKS.done` + `nextInPath` are localized. `wantRail = true` on all PATHS is intentional.

### Obsolete / cleanup (scoped)

| Item | Tier | Confidence | Evidence |
|------|------|------------|----------|
| `#v2PathDemo` | C | 0.7 | UC4 step 0 now uses `#v2PathLine`; e2e updated. Dead id not referenced. Keep until `/sweep`. |
| About-pop Hard refresh copy | keep | — | Button moved to topbar; About still explains it. |

Whole-repo cruft: run `/sweep` — not this ship.

## Domain Specialist

**none** (blocker). Shamir split then combine; multisig is three phrases not shares; UC8 inspect-only; Continue is path-local.

## Severity

- blockers: 0
- major: 0
- nits: 0 (wide not requested)

## §9 intentional oddities

1. Dual stamp: product `0.16.x` vs V2 `0.17.N-v2` on `data-v2-version`.
2. Finish checkbox still “I will not send coins” on tracks without addresses.
3. `startDotClass` lock logic is Start-here ids; other paths only done/current/empty.

p0=0 obsolete_tier_A=0
