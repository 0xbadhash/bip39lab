# PR Draft: Teach-surface jump-link consistency

**Range:** working tree → next commit (Lab/Network/Shamir jump-link rails)

## What Problem This Solves

Multisig teach UX (`v0.13.4`) already frames step rails as jump links. Lab, Network, and Shamir still looked like numbered wizards, so teach IA was inconsistent.

## Why This Change Was Made

Align all primary teach surfaces to the same “On this page — jump links (not a locked wizard)” pattern; tighten Network unknown-not-zero and Shamir use-case copy without crypto/CSP changes.

## User Impact

Learners can jump freely on Lab / Network / Shamir the same way as Multisig; clearer Network failure semantics and Shamir vs Multisig framing.

## Evidence

**Spec:** `.agents/specs/2026-08-09-teach-surface-jump-links.md`

| Check | Result |
|-------|--------|
| pytest teach surface | `python -m pytest tests/test_teach_surface_jump_links.py -q` |
| product smoke | `python scripts/product_smoke.py --root .` (as available) |

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 On this page + jump links | `test_lab/network/shamir_jump_link_rail` |
| AC-2 aria-label page sections | same (`page sections (jump links)`) |
| AC-3 no forced `1 ·` numbering; targets | same + data-step-target asserts |
| AC-4 Network unknown-not-zero; Shamir use-case | network/shamir tests |
| AC-5 smoke / no secrets / CSP | product smoke; HTML-only touch |

## Threat notes

- HTML/teach copy only — no new network egress; Lab/Multisig/Shamir CSP unchanged.
- Network remains opt-in address-only; copy re-states unknown ≠ silent zero.
- No mnemonics/seeds/keys logged or stored by this change.

## Red-proof

```text
red_cmd: python -m pytest tests/test_teach_surface_jump_links.py -q  # fails before HTML rail help
green_cmd: python -m pytest tests/test_teach_surface_jump_links.py -q
```

TDD: contracts assert Multisig-aligned jump-link strings on Lab/Network/Shamir.
