# CROSS-REVIEW

**base:** origin/master v0.16.37 · **head:** uncommitted UC1/UC2 viz

## Blocker count: 0

### Security Guru

**none.** SVGs are static assets. CSP `img-src 'self'`. No mnemonic in sessionStorage.

### Maintainability Expert

**none (blocker).** Two viz builders — follow-up DRY.

#### Obsolete / cleanup (scoped)

| Path | Tier | conf | Evidence |
|------|------|------|----------|
| `uc1-concept-strip-preview.html` | C | 0.4 | Operator preview; not in nav. Keep for htmlpreview. |
| Whole-repo | — | — | run `/sweep` |

Tier A: **0**

### Domain Specialist

**none.** UC2 atoms: card object, hand≠photo/print, passphrase apart. Quiz does not leak which numbers are correct on a single right click.

## §9

1. V2 footer `0.17.0-v2` vs tag 0.16.38.
2. Classic Playwright not all-green.
3. `scripts/*.py` stay uncommitted.
4. Preview HTML is a deeplink demo, not the live strip (live uses `<img>`).
