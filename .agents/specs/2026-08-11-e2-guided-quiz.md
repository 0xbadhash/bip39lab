# E2 — Guided quiz shell

- **Status:** done  
- **Priority:** P1  

## Problem
Teach copy is passive; no short “exam” for wrong passphrase, under-threshold Shamir, low entropy.

## Solution
Quiz panel with 3 scenarios; links/actions into existing Tools/Shamir/entropy flows; pass/fail localStorage.

## Acceptance
- [ ] Quiz UI with Q1 wrong-pp, Q2 under-threshold Shamir, Q3 low-entropy pad  
- [ ] Each question has “Open demo” + mark pass when user confirms learning  
- [ ] e2e S63 quiz shell  

## Out of scope
Graded server backend; automatic detection of user actions without confirm
