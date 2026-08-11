# E1 — Level chip + soft gates

- **Status:** done  
- **Priority:** P0  

## Problem
All depth is visible at once; starters drown; advanced content competes with Lab core.

## Solution
Level chip: `starter | beginner | intermediate | advanced` in `localStorage` (`bip39lab.level`). Soft-gate Advanced/Intermediate cards with “unlock” banners (can skip).

## Acceptance
- [ ] Level control in topbar (all index pages that share chrome: Lab shell)  
- [ ] Soft gates dim/hide advanced Tools cards (entropy pad build, PSBT deep) for starter  
- [ ] Multisig/Shamir/SLIP soft gate banner for starter  
- [ ] e2e S62 level chip  

## Out of scope
Hard locks that block power users permanently without skip
