# CROSS-REVIEW

Personas: Security / Maintainability / Domain. P0-first.

## Security Guru
none — overlays are in-page HTML; S80 native confirm still after Generate overlay; Clear copy is Lab memory only.

## Maintainability Expert
none for this ship.

### Obsolete / cleanup (scoped)
- Tier C: unused `window.confirm` on Reset removed (replaced by setLevel starter). Confidence 0.9. Evidence: `resetClassroomProgress`.

## Domain Specialist
none — practice-lab overlays; P0 walls preserved.

## Blockers
0

## Follow-ups
- Esc to close overlays (not required).

## §9 Intentional oddities
1. Reset has no native confirm (brief: always return to Starter).
2. Three overlay dialogs instead of one generic modal.
3. S80 remains `window.confirm` after overlay Continue.
```
