# CODE-REVIEW

**Marker:** CODE-REVIEW  
Date: 2026-09-13  
Scope: QA wave escapeHtml + help-tip 1.25rem + VERSION 0.16.89 / 0.17.138-v2  
P0: 0

## Findings

- copyQrRowHtml/addrHtml/termI/inlineI use escapeHtml for text; attributes stay attrEsc. Glossary bodies are first-party prose; escaping is defense in depth.
- Help-tip painted circle is 1.25rem; 44px hit is the host. V2 callout nowrap no longer applies to the panel.
- Dual stamp is existing product policy, not a mismatch.
- No Sign, no secret retention, no force-push.

## Secrets

`check_secrets_diff` on this ship range: expected clean (no mnemonics, no RPC passwords).

## Scope governor

In-scope: `web/v2/js/v2-app.js`, `web/css/app.css`, `web/v2/css/v2.css`, e2e V2-S1/S186, QA pytest, stamp files.

## Verdict

Accept. Ready for `/pr_review --validate`.
