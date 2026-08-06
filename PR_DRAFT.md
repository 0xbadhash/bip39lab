# PR Draft: Phase 3 hardening (v0.4.0)

**Range:** `v0.3.0...HEAD`

## Summary

SECURITY.md, README, VERSION 0.4.0, web rebuild docs.

## What Problem This Solves

Operators lacked written policy and entry docs for the offline lab.

## Why This Change Was Made

Phase 3 ROADMAP.

## User Impact

Clear install, usage, and security expectations.

## Evidence

```text
red_cmd: python -m pytest -q tests/test_hardening_docs.py
green_cmd: python -m pytest -q
```

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | pr_review |
| smoke | pytest |
| pytest | suite green |

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-3-hardening.md`

## Traceability

| AC | Evidence |
|----|----------|
| AC3.1 SECURITY.md | test_hardening_docs |
| AC3.2 README | test_hardening_docs |
| AC3.3 VERSION | test_hardening_docs |
| AC3.4–3.5 REBUILD.md | file present |
| AC3.6 tests | pytest |

## Threat notes

- Docs restate no-retention and address-leak consent.
- Rebuild path keeps crypto offline-vendored.

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_hardening_docs.py
green_cmd: python -m pytest -q
```

## Cross-review

See artifacts.

## Test plan

- [x] docs tests
- [x] full suite

## Things that look bad but are actually fine

1. No code-signing yet — documented out of scope.
2. npm still needed only for rebuild, not runtime.
3. VERSION vs git tags manual — release tags v0.4.0.

```yaml
things_that_look_bad_but_are_fine:
  - file: "SECURITY.md"
    concern: "policy only"
    why_fine: "Phase 3 is hygiene"
    validation: "test_hardening_docs"
  - file: "web/REBUILD.md"
    concern: "npm mention"
    why_fine: "build-time only"
    validation: "bundle committed"
  - file: "VERSION"
    concern: "manual bump"
    why_fine: "aligned with pyproject"
    validation: "0.4.0"
```
