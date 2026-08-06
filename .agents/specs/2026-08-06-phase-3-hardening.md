# Phase 3 — Hardening & release hygiene

- **Product:** bitcoin-scripts
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P1

## Problem Statement

Ship needs explicit security policy, rebuild instructions, and operator README.

## Solution

SECURITY.md, README, VERSION pin, rebuild script for web bundle, threat model summary.

## Acceptance Criteria

- [ ] AC3.1 SECURITY.md with no-retention + offline-first policy
- [ ] AC3.2 README install/usage for CLI + web
- [ ] AC3.3 VERSION file + pyproject aligned
- [ ] AC3.4 Document bundle rebuild (esbuild + build-entry)
- [ ] AC3.5 scripts/rebuild_web_bundle.md or .sh/.ps1 notes
- [ ] AC3.6 Tests still pass

## Out of Scope

- Code signing infrastructure
- Full SBOM CI pipeline

## Handoff

`/execute_dev`
