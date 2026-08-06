# PR Draft: Phase 1 static offline web lab (v0.2.0)

**Range:** `v0.1.0...HEAD`

## Summary

- Static `web/` BIP39 lab (CSP, no CDN)
- Vendored `@scure`/`@noble` offline bundle
- Hide private / clear secrets; airgap notes

## What Problem This Solves

Operators needed a self-hosted Coleman-style UI without third-party trust.

## Why This Change Was Made

Phase 1 ROADMAP: client-only static site.

## User Impact

Open `web/index.html` offline (or static host); generate/derive without network.

## Evidence

```text
red_cmd: python -m pytest -q tests/test_web_vectors.py
green_cmd: python -m pytest -q
```

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | at pr_review |
| smoke | pytest |
| pytest | 19 passed |

## Spec

**Spec:** `.agents/specs/2026-08-06-phase-1-static-site.md`

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC1.1 offline static | `test_web_static_assets_present` |
| AC1.2–1.3 generate/derive vectors | `test_web_js_abandon_vectors` |
| AC1.4 hide/clear | HTML/UI presence |
| AC1.5 CSP | meta in index.html |
| AC1.6 airgap notes | warn copy |
| AC1.7 vectors | node pytest |
| AC1.8 no storage | no localStorage in app.js |

## Threat notes

- Seed material only in browser memory; Clear secrets zeros fields.
- Bundle is vendored offline — no runtime CDN.
- CSP blocks connect-src network for page scripts.

## Red-proof

```text
red_cmd: python -m pytest -q tests/test_web_vectors.py
green_cmd: python -m pytest -q
```

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`

## Test plan

- [x] abandon vectors via node
- [x] CSP + no CDN
- [x] full pytest

## Things that look bad but are actually fine

1. Large `bip39lab.bundle.js` — intentional offline audit/vendored crypto.
2. Educational `crypto-core.js` may remain unused — superseded by scure bundle.
3. node_modules gitignored — rebuild via esbuild + build-entry.mjs.

```yaml
things_that_look_bad_but_are_fine:
  - file: "web/js/bip39lab.bundle.js"
    concern: "minified blob"
    why_fine: "reproducible from build-entry + pinned npm versions"
    validation: "test_web_js_abandon_vectors"
  - file: "web/js/crypto-core.js"
    concern: "unused educational code"
    why_fine: "not loaded by index.html"
    validation: "index.html script tags"
  - file: "web/index.html"
    concern: "file:// CSP"
    why_fine: "script-src self works for relative scripts"
    validation: "manual offline open"
```
