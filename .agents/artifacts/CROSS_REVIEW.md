# CROSS-REVIEW

**Command:** `/cross-review`  
**Base:** `f668e6e` … **Head:** `HEAD`  
**Secrets:** clean  

## Blocker count: 0

### Security Guru — none (blockers)

- Offline CSP pages unchanged for Lab crypto (`connect-src none` on Lab).  
- Network page remains opt-in mempool only.  
- Progress keys `bip39lab.*` hold no seed material.  
- Amber dock / ent quiz mark-return only writes quiz pass flags.

### Maintainability Expert — none (blockers)

**Obsolete / cleanup (scoped):**

| Item | Tier | Conf | Evidence |
|------|------|------|----------|
| Mid-page step-rails HTML/CSS | A (removed from HTML) | 0.9 | Rails deleted from all pages; CSS leftovers for `.step-rail` unused — Tier B cleanup later |
| Per-item “Back to quiz” buttons | A | 0.95 | Removed; dock remains |
| Footer host version strip | A | 0.95 | Removed; sidebar chip remains |
| Teach → Extra help rename | B | 0.8 | e2e accepts both labels |

Whole-repo cruft: run `/sweep` later for dead step-rail CSS.

### Domain Specialist — none (blockers)

- BIP-39 12-word **128 bits** / d6≈2.58 → ~50 rolls teaching is correct for classroom estimate (not CSPRNG).  
- BIP-86 default Taproot path still Lab default.  
- Q3 TOO LOW vs Q4 enough-bits split matches product lesson (“less is not better”).

## §9 Intentional oddities (≥3)

1. Quiz is **self-graded** — no automated crypto proof of understanding.  
2. Entropy pad uses **Math.random** — intentionally labeled simulated.  
3. Soft level gates keep advanced cards visible (dimmed) rather than hard-hide.  
4. Q3 mark enabled with 1–20 events when TOO LOW — broad window so users who keep clicking past 3 still can pass Q3.

## Follow-ups

- Delete unused `.step-rail` CSS in a chore.  
- Align E2E_COMET S63 to 4 quiz items.

## Handoff

```text
✅ CROSS-REVIEW DONE  blockers=0  obsolete_tier_a=3
NEXT_SKILL=/behavior_validator
```
