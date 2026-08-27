# V2 UC7 amber tone for three-share “not the exercise”

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P1
- **Plan:** `.agents/specs/2026-08-27-v2-uc7-amber-three-shares-plan.md`
- **Surface:** `web/v2/` UC7 SLIP-39 try-shares only
- **Grill-me:** complete (operator copy lock)

## Problem Statement

Trying all three SLIP-39 lists shows they are the full backup, not the 2-of-3 drill. That box was not green and not red — it looked unmarked. Operator wants **amber/orange** for that copy.

## Solution

`paintTone(..., "warn")` + `.msg-warn` / `pre.out.msg-warn` amber-orange. Two-share success stays green. Under-threshold stays red. Copy unchanged.

Chip `v0.17.117-v2`. Product stamp on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | Three filled lists + Try → `#v2S39TryOut` has `msg-warn`, not `msg-ok`. Copy still “not the exercise”. |
| AC-2 | Exactly two lists matching practice → `msg-ok`. |
| AC-3 | Fewer than two → `msg-bad`. No Sign. |

## Grill-me

**Status:** complete
**Date:** 2026-08-27

### G1 Outcome
- Q: Done?
  - A: That message is amber/orange.

### G2 Non-goal
- Q: Kill?
  - A: Do not change copy, combine-3, or make three-share look like drill success.

### G3 Surface
- Q: Classic Lab?
  - A: V2 UC7 only.

### G4 Cheap
- Q: Smallest?
  - A: CSS class + paintTone warn.

### G5 Abuse
- Q: Fail?
  - A: Still never fund; still refuse combining 3 as the exercise.

### G6 Verify
- Q: Proof?
  - A: V2-S45 class msg-warn.

### G7 Priority
- Q: Now?
  - A: Operator asked after UC14 ship.

## Testing Decisions

- Green: V2-S45 `msg-warn` on three lists
- pytest `tests/test_ac_v2_uc7_amber.py`
