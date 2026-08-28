# BEHAVIOR-REPORT

| ID | Result | Evidence |
|----|--------|----------|
| AC-1 | pass | V2-S41 six named buttons |
| AC-2 | pass | V2-S41c OP_RETURN ASCII in live pane |
| AC-3 | pass | V2-S41c ord + OP_13 |
| AC-4 | pass | no Sign; chip 0.17.126-v2 |
| AC-5 | pass | git status no scripts/*.py |

**summary:** Playwright S41 group vs 4173; pytest AC stubs.

## Things that look bad but are actually fine
1. Dual stamp
2. Snapshot MIME is truncated witness prefix
3. S41 mock live JSON still works for First transfer
