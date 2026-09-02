# Release runbook — v0.16.86 UC35 same words, wrong app

## Scope

V2 UC35: plain English (Electrum vs BIP-39 trap), illustration left of blue classroom. No Electrum KDF.

**Range:** `v0.16.85...HEAD`  
**Score:** 100

## Smoke

| Gate | Result |
|------|--------|
| pytest -q | 227 passed |
| V2-S26 UC35 | PASS |
| check_web_e2e | ok (175 S-ids) |
| playwright full | 73 passed (18.4m) |

## Infra

None. Static lab.

## Evidence pack

- hard_gates 100  
- unittest test_ac_v2_uc35  
- Playwright V2-S26  

## Version

0.16.86

## Rollback

`git checkout v0.16.85`

## §9

1. Does not run Electrum KDF.  
2. Does not fund practice phrases.  
3. Does not reopen catalyxt EmailJS.

## Next

`/sync_docs`
