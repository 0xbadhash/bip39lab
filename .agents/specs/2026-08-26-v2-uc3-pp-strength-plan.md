# Plan: V2 UC3 masked PP strength bar

**Spec:** `.agents/specs/2026-08-26-v2-uc3-pp-strength.md`

## Approach

Reuse classic `.pp-strength-bar-fill` + `pp-tier-*` from `app.css`. Keep A/B live compare. Mask inputs. Paint bar width from `estimatePassphraseBits`.

## Architecture

- `web/v2/js/v2-app.js` — password inputs, `paintPpBar`, bars in UC3 HTML
- `web/v2/css/v2.css` — compact bar in `.v2-cmp-fields`
- `web/v2/index.html` — chip `0.17.91-v2`
- `e2e/v2.spec.ts` — S29; S3 still fills
- `tests/test_ac_v2_uc3_pp_strength.py`

## Sequence

1. Spec + mask + bars in UC3 compare.
2. Playwright S29 + AC stubs.
3. Product stamp only at `/release_mgmt`.
