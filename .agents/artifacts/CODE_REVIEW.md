# CODE-REVIEW — Multisig teach UX polish

**Spec:** `.agents/specs/2026-08-09-multisig-teach-ux.md`  
**Scope:** `web/multisig.html`, `web/js/multisig-app.js`, `tests/test_multisig.py`, `e2e/multisig.spec.ts`, roadmap/PR_DRAFT

## Verdict

**Approve** for `/pr_review` — teach/UI only; crypto path and CSP unchanged.

## Findings

### Blockers
None.

### Non-blockers
- N1: Airgap chip depends on `navigator.onLine` (spoofable); copy already disclaims guarantee.
- N2: Step rail remains teach-only (hidden when Teach Off) — intentional; calculator banner always visible.

## Security checklist
- [x] No mnemonic/seed/xprv retention or logging
- [x] CSP `connect-src 'none'` retained
- [x] Refuse private material still covered by S12 / unit golden
- [x] No eval of config; no secret commits

## Tests
- Unit: ` .venv/bin/python -m pytest tests/test_multisig.py -q` → 3 passed
- E2E: `npx playwright test e2e/multisig.spec.ts` → 8 passed
- `python3 scripts/check_web_e2e.py --root .` → ok (67 S-ids)

## Traceability
PR_DRAFT AC table maps AC-1…8 → unit + S26/S28/S12.
