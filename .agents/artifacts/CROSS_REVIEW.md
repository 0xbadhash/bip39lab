# CROSS-REVIEW

**base:** origin/master · **head:** uncommitted V2 curriculum (UC4–UC7, quiz why, rail, Do/Do not)

**secrets:** clean (gitleaks origin/master...HEAD)

## Blocker count: 0

### Security Guru

**none.** Watch-only / zpub export stays public-only. Cosigner mnemonics live in RAM (`mem.cosigners`), cleared by Clear this / Clear all. `sessionStorage[bip39lab.v2]` is progress only. CSP `connect-src 'none'` unchanged on `/v2/`. Quiz why text is static HTML.

### Maintainability Expert

**none (blocker).** v2-app.js grew (~1000 lines in this ship) — follow-up: split UC modules later.

#### Obsolete / cleanup (scoped)

| Path | Tier | conf | Evidence |
|------|------|------|----------|
| `.v2-callout.one-line` in v2.css | C | 0.7 | Validate line no longer uses class |
| Make 3 throwaway xpubs `#v2Ms` | — | — | **removed** this ship (replaced by three cosigner cards) |
| Whole-repo cruft | — | — | run `/sweep` |

Tier A: **0**

### Domain Specialist

**none (blocker).** BIP-84 export on mainnet is **zpub** (SLIP-132), labeled as such. UC6 keys ≠ UC7 Shamir shares. Index path last component only. Quiz wrong path teaches, not “try again.”

## §9 intentional oddities

1. V2 footer remains `0.17.0-v2` while product tag is 0.16.x (parallel surface).
2. Classic Playwright suite still not all-green; this ship gates V2 spec only.
3. Three practice seeds on UC6 pad is the lesson (origin of zpubs); not a funded policy.
4. `scripts/*.py` stay uncommitted.

## Follow-ups

lab-strip 404 under `/v2/`; one-line CSS dead.
