# Plan: UC7 amber three-share warning

**Spec:** `.agents/specs/2026-08-27-v2-uc7-amber-three-shares.md`

## Approach

Extend `paintTone` with `msg-warn`. When Try these 2 shares sees 3 filled lists that match the practice hex, tone is warn not empty/ok.

## Files

- `web/v2/js/v2-app.js`
- `web/v2/css/v2.css`
- `e2e/v2.spec.ts` V2-S45
