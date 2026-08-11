# E3 — Mobile Lab + Tools usable

- **Status:** done  
- **Priority:** P1  

## Problem
Layout is desktop-first; starters on phone cannot use step rails / dense Tools.

## Solution
CSS: single-column sidebar collapse/drawer or stack; touch-friendly rails; reduce dual columns under 720px.

## Acceptance
- [ ] `@media (max-width: 720px)` usable Lab + Tools  
- [ ] Sidebar not permanently crushing content  
- [ ] Step rails wrap / scroll horizontally if needed  
- [ ] e2e smoke still green (viewport test optional)  
