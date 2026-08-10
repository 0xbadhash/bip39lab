# BEHAVIOR-REPORT

**Marker:** BEHAVIOR-REPORT  
**Contract:** `.agents/artifacts/BEHAVIOR_CONTRACT.md`  
**Mode:** Playwright black-box + live static files

| Clause | Result | Evidence |
|--------|--------|----------|
| Group diagram 1-of-1 + 2-of-3 + policy | pass | S60 `#s39GroupDiagram [data-group]` / `[data-policy]` |
| Scripted wrong-pp demo mismatch | pass | S60 `#btnS39WrongPp` → err class + mismatch text |
| Manual wrong-pp combine | pass | S60b recovered ≠ expected; status err |
| Happy path still Match | pass | S58 2-of-3 Match |
| Lab-only banner | pass | S57 `#s39Danger` |
| Offline CSP | pass | S57 `labCspOffline` |

fail: 0 · blocked: 0

```text
NEXT_SKILL=/pr_review --validate
```
