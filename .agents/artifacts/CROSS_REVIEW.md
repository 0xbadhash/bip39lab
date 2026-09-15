# CROSS-REVIEW — UC32 SeedXOR live examples (v0.16.90)

**Marker:** CROSS-REVIEW
**Base…Head:** d2a0e0d…dad82a2
**Blockers:** 0

## Security Guru
- none (classroom practice XOR; no fund/QR; no secrets in diff; gitleaks clean)

## Maintainability Expert
- none ship-blocking
### Obsolete / cleanup (scoped)
- Tier A: none
- Note: `#v2XorMake12` id retained as fallback alias behind `#v2XorMakeSrc` — intentional compat; not dead.

## Domain Specialist
- none: N-of-N classroom preserved; 12–24 BIP-39 lengths; no Shamir/SeedXOR.com drift; compare.md UC32 row aligned

## §9 Intentional
1. Dual stamp product 0.16.90 vs V2 chip 0.17.139-v2 (existing product convention)
2. Empty wordGridHtml still shows 12 dash slots as placeholder before MakeSrc
3. Hide-fail recover region uses empty paragraph (0 `.ww`) rather than dashed grid so e2e fail is unambiguous

## Follow-ups (non-blocking)
- Optional: sync empty-grid dash count to selected N when source empty
