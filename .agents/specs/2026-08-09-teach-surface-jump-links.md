# Teach-surface jump-link consistency (Lab · Network · Shamir)

- **Product:** bip39lab
- **Created:** 2026-08-09
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Multisig (`v0.13.4`) already teaches step rails as **jump links** (not a locked wizard). Lab, Network, and Shamir still number steps like a forced path and omit the “On this page” framing, so learners get inconsistent IA across teach surfaces.

## Solution

Align Lab, Network, and Shamir step rails with Multisig: short “On this page — jump links” help, non-wizard `aria-label`, drop forced step numbers, keep existing section targets. Small Network/Shamir teach-copy tighten (unknown-not-zero, fees IP note, Shamir use-case vs Multisig) without crypto or CSP changes.

## User Stories

1. As a learner on Lab, Network, or Shamir, I see the same jump-link rail pattern as Multisig, so I know I can scroll freely.
2. As a learner on Network, I understand balance failure is unknown (never silent zero) and fees do not send my addresses.
3. As a learner on Shamir, I understand backup-vs-spend vs Multisig and that recombine can be opened with an empty box.

## Implementation Decisions

- Surfaces: `web/index.html`, `web/network.html`, `web/shamir.html` only (HTML/teach copy).
- Match Multisig copy pattern; no JS bundle/crypto/CSP changes.
- Non-goals: new wizard state machine; SLIP-39; Multisig rework.

## Testing Decisions

- Unit: static HTML contracts for jump-link help + aria-label on Lab/Network/Shamir (extend existing teach/HTML tests if present).
- Smoke: product smoke + `check_web_e2e.py` if e2e asserts step numbers.
- TDD: red on missing “jump links” / wizard-deny strings if tests exist; else add focused contracts.

## Acceptance Criteria

- [ ] AC-1: Lab, Network, Shamir each show “On this page” + “jump links (not a locked wizard)” help above the rail.
- [ ] AC-2: Each rail `aria-label` says page sections (jump links), not “process” wizard language.
- [ ] AC-3: Rail buttons are label+small only (no `1 ·` forced numbering); `data-step-target` IDs still resolve.
- [ ] AC-4: Network lede/help keeps unknown-not-zero + leak-ack/fees clarify; Shamir teach adds use-case vs Multisig without claiming SLIP-39.
- [ ] AC-5: Product smoke green; no secrets; CSP unchanged.

## Out of Scope

- Multisig further depth; SLIP-39; balance backend; crypto path changes

## Clarifications

### 2026-08-09
- Q: Separate ship from Multisig v0.13.4?
  - A: Yes — Multisig already shipped; this is consistency follow-on on other pages.
- Q: Full FSM or waiver?
  - A: Real `/spec` then implement (user: real or waived FSM + this slug).

## Further Notes

- Dirty tree already held the HTML diff; freeze behind AC + contracts.
- Security: still no retention; Network remains opt-in address-only.

## Handoff

- Next: `/execute_dev`
- Then: `/code_review` → NEXT_SKILL → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
