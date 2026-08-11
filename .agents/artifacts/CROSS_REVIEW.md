# CROSS-REVIEW

**Base:** `e82fabe` … **Head:** `dc17369`  
**Secrets:** clean  

## Blocker count: 0

### Security Guru — none
- Progress keys `bip39lab.intQuiz` / `bip39lab.advQuiz` are booleans only  
- No mnemonic retention; external intquiz docks are return links only  
- Multisig/SLIP-39 CSP unchanged (`script-src 'self'`; dock logic in app JS)

### Maintainability Expert — none (blockers)
- Int/Adv quizzes reuse Guided quiz patterns (refreshPathQuiz, dock modes)  
- Slight growth in learn-levels.js expected for path parity  

### Domain Specialist — none
- I1–I4 teach keys ≠ shares ≠ share-words + PSBT inspect-only  
- A1–A4 teach ops mind offline (BIP-85 idea, watch-only, Knots, is-not)  
- Self-graded design intentional  

## §9 Intentional oddities
1. Self-graded Intermediate/Advanced quizzes.  
2. BIP-85 educational shell not full derivation.  
3. Soft level gates.  
4. External pages: Back dock + Mark on Lab (not auto-pass).  

```text
✅ CROSS-REVIEW DONE  blockers=0
NEXT_SKILL=/behavior_validator
```
