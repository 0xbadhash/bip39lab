# PR Draft: Phase 7 HTML table + Option A derivation

**Range:** `v0.6.0...HEAD`

## What Problem This Solves

ASCII address dump wrapped badly; no Taproot / path controls.

## Why This Change Was Made

User: proper HTML table without wrap; full FSM Option A; park B/C on roadmap.

## User Impact

- Wide HTML table (BIP86/84/49/44), nowrap + horizontal scroll
- Account, change, indices 5/10/20
- Auto-derive unchanged

## Evidence

```text
red_cmd: python -m pytest -q tests/test_web_vectors.py
green_cmd: python -m pytest -q
```

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | PR_DRAFT + CODE-REVIEW + BEHAVIOR + red-proof |
| smoke | pytest |
| pytest | 40 passed |
| validate | 5/5 |

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-7-address-table-derivation-a.md`

**Plan:** `.agents/specs/2026-08-06-phase-7-address-table-derivation-a-plan.md`

## Traceability

| AC | Evidence |
|----|----------|
| AC7.1–7.2 table nowrap | HTML `#addrTable`, CSS `white-space: nowrap` |
| AC7.3 BIP86 column | build-entry p2tr + vector |
| AC7.4 controls | deriveAccount/Change/Count |
| AC7.5 BIP86 abandon | `bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr` |
| AC7.6 auto-derive | app.js generate/passphrase |
| AC7.7 B/C roadmap | ROADMAP OPEN |
| AC7.8 tests | pytest |

## Threat notes

- Offline derivation only; no seed export.
- BIP86 key-path only (standard BIP86).

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_web_vectors.py
green_cmd: python -m pytest -q
```

## Cross-review

CODE-REVIEW p0=0; CROSS-REVIEW blockers=0; BEHAVIOR pass.

## Things that look bad but are actually fine

1. Content max-width 72rem — table still scrolls if needed.
2. Option B/C not built — intentional park.
3. No free-form custom path yet — out of scope this phase.

```yaml
things_that_look_bad_but_are_fine:
  - file: "web/css/app.css"
    concern: "wide layout"
    why_fine: "user asked no wrap"
  - file: "ROADMAP.md"
    concern: "B/C open"
    why_fine: "user request"
  - file: "web/js/build-entry.mjs"
    concern: "hand-rolled p2tr"
    why_fine: "BIP86 vector tested"
```
