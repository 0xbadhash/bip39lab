# Plan: UC2 PP example

**Spec:** `.agents/specs/2026-08-25-v2-uc2-pp-example.md`

## Approach

Collapse copy on UC2 step 1. `refreshPpExample` uses BIP39Lab.generateMnemonic first four words joined with `-`.

## Implementation

1. Cut duplicate paragraphs; align type; example + generate.
2. Wire `#v2PpExGen` in `wireStep`.
3. V2-S8 + stamp 0.16.49 / 0.17.54-v2 + compare.md.
