# RELEASE_RUNBOOK — v0.16.4 A vault map

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-13  
**Version:** 0.16.4  
**Tag:** v0.16.4  
**Spec:** `.agents/specs/2026-08-13-a-vault-map.md`  
**Score:** 100  

## Smoke table

| Step | Exit |
|------|------|
| pytest | 0 (101) |
| e2e | 0 (91) |
| check_web_e2e | 0 |

## Rollback
`git checkout v0.16.3`

## §9
1. Educational key ids are first 8 hex, not BIP32 fingerprints.  
2. Map is public on purpose.  
3. Bundle kept in lockstep with core source.
