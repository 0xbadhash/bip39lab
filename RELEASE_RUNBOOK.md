# RELEASE RUNBOOK — v0.6.0 (Phase 6 lab entropy fields)

**Date:** 2026-08-06  
**Score:** 100  
**Spec:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields.md`

## Smoke

| Step | Exit |
|------|------|
| pytest -q | 0 |
| validate full | 0 |
| live HTML fields on bip39.catalyxt.xyz | present |

## Infra

Static nginx root — no process restart required.

## Evidence pack

hard_gates ok · pytest 40 · CODE-REVIEW · BEHAVIOR · CROSS-REVIEW

## Version

VERSION / pyproject → 0.6.0 · tag `v0.6.0`

## Rollback

`git checkout v0.5.0` and static files follow.

## §9

1. Passphrase bits are estimate only.
2. Python entropy_ui mirrors web for tests.
3. No separate CDN strength library.
