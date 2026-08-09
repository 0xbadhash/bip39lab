# CODE_REVIEW — teach-surface jump-link consistency

**Date:** 2026-08-09  
**Spec:** `.agents/specs/2026-08-09-teach-surface-jump-links.md`  
**Verdict:** APPROVE (teach HTML only)

## Scope

- `web/index.html`, `web/network.html`, `web/shamir.html` — jump-link rail help, drop forced step numbers, small teach copy.
- `tests/test_teach_surface_jump_links.py` — static HTML contracts.
- Roadmap: Multisig teach → DONE; new OPEN for this slice (closed by this ship once released).

## Checks

- [x] No crypto/bundle/CSP change
- [x] No secret retention / no new network from Lab or Shamir
- [x] Multisig pattern parity (On this page / jump links / aria)
- [x] pytest contracts + product smoke unit+e2e green

## Residual

- Full `/pr_review --validate` + `/release_mgmt` version bump (0.13.5) still operator-follow for tag ship if desired as separate release.
