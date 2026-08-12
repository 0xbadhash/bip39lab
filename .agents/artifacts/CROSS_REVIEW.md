# CROSS-REVIEW

**Marker:** CROSS-REVIEW  
**Base:** `v0.16.1` … **Head:** `HEAD`  

## Blocker count: 0

### Security Guru — none
- isLabIndexPage fix restores dock without weakening CSP  
- Shell chips are cosmetic status only  

### Maintainability Expert — none (blockers)
**Obsolete (scoped):**
| Item | Tier | Conf | Evidence |
|------|------|------|----------|
| Mid-page step rails | A | 0.95 | Already removed; S44b asserts absence |
| Stale Comet “Teach” / `/68` | A | 0.99 | Remediation table + stamp; fixed in doc |

Whole-repo cruft → `/sweep`.

### Domain Specialist — none
- S67 containment matches mobile Comet PARTIAL  
- S70 root cause (query strip on non-Lab pages) correctly scoped  

## §9 Intentional oddities
1. Self-graded quizzes.  
2. Network opt-in chip (not “Offline crypto”).  
3. Sidebar stays dark under light theme for brand chrome.  
4. Soft level gates.  

```text
✅ CROSS-REVIEW DONE  blockers=0  obsolete_tier_a=2
```
