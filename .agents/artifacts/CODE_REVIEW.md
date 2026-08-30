# CODE-REVIEW

command: `/code_review` 0.16.83 UC25 BIP-352
base: origin/master
secrets: scan on commit range

## Findings accepted
None.

## Findings rejected
- **Implement live BIP-352 ECDH.** Out of scope; labeled classroom mixer. Stop-and-escalate if product wants a scanner.

## P0 count
0

## Follow-ups
UC28 still slogan-thin. Kid-voice on remaining UCs.

## Smoke
pytest AC; Playwright S58 this session.

## Things that look bad but are actually fine
1. Dual stamp
2. leftover scripts uncommitted
3. `lab-sp1q` prefix so nobody funds it
