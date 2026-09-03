# CODE-REVIEW

Date: 2026-09-03
Scope: V2 classroom cluster, UC32–34, spacing CSS
P0: 0

## Findings

- No Sign buttons introduced in UC33.
- Descriptors remain public (`wpkh`/`tr`/`pkh` of xpub/tpub).
- Face crop override is scoped to `.v2-face-after` so entropy lock tint crop stays.
- Secrets: Explain still refuses xprv/seed.

## Scope governor

In-scope: `web/v2/**`, `e2e/v2.spec.ts`, layout AC tests, specs.

## Verdict

Accept. Ready for `/pr_review --validate`.
