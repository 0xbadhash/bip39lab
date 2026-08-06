# Phase 1 — Static offline BIP-39 site

- **Product:** bitcoin-scripts
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md
- **Plan:** none (stack fixed: static HTML/JS, no CDN)
- **Constitution:** AGENTS.md

## Problem Statement

Operators need a browser UI like Ian Coleman’s tool that never phones home and never retains seeds, self-hosted from this repo.

## Solution

A static `web/` app: generate/validate mnemonic, show BIP44/49/84 first addresses, entropy notes, hide-private toggle, clear-secrets — all client-side, bundled wordlist, no third-party scripts.

## User Stories

1. As an operator, I open `web/index.html` offline and generate a 12/24 word mnemonic.
2. As an operator, I paste a mnemonic and see first receive addresses for BIP44/49/84.
3. As an operator, I can hide private fields and clear them from the page.
4. As an operator, I never load scripts from a CDN.

## Acceptance Criteria

- [ ] AC1.1 `web/index.html` works offline (no external script/src network for crypto)
- [ ] AC1.2 Generate 12/24 word valid mnemonic (Web Crypto CSPRNG)
- [ ] AC1.3 Validate + derive abandon…about → known addresses
- [ ] AC1.4 Hide private info + Clear secrets controls
- [ ] AC1.5 CSP meta disallowing external scripts
- [ ] AC1.6 Airgap usage notes in page
- [ ] AC1.7 Automated test of pure JS derivation vectors (node or python bridge)
- [ ] AC1.8 No localStorage/sessionStorage of mnemonic by default

## Out of Scope

- Balance APIs (Phase 2)
- Multi-index tables, multi-coin
- Server-side rendering

## Clarifications

### 2026-08-06
- Q: CDN libraries?
  - A: Forbidden; pure vendored JS only.
- Q: Storage?
  - A: Memory only; clear button zeros fields.

## Handoff

- Next: `/execute_dev`
