# PR Draft: Tools self-serve compare · 5-nav · online chip UX

**Range:** `origin/master...HEAD` (`c75fb07`…`e519de6`)

## What Problem This Solves

Tools **Compare** failed with “Need a valid mnemonic on the Lab panel first,” forcing a round-trip to Lab. The **Balance** nav item was only CLI documentation, duplicating Network and confusing users. The online/offline chip lacked clear colors and an explanation of why it exists.

## Why This Change Was Made

- Keep Tools self-sufficient for educational compare/descriptors.
- Drop a docs-only primary nav item; live balances and CLI notes belong on **Network**.
- Make browser online/offline state readable (green/red) with a permanent **(i)** safety tip.

## User Impact

- Compare / Refresh descriptors work without leaving Tools (auto-generate or explicit **Generate test phrase**).
- Sidebar is **5 items**: Lab · Multisig · Network · Tools · Glossary.
- Old `#balance` bookmarks redirect to Network’s balance + CLI card.
- Online chip: green = online, red = offline; **(i)** explains air-gap vs CSP.

## Evidence

- Playwright: compare S18/S18b, nav S0/S10/S36, S24 redirect, Network S32, Multisig S26, help-ux S48b.
- Secrets: `check_secrets_diff` clean on range.
- Hard gates + product smoke under release.

**Spec:** `.agents/specs/2026-08-06-option-c-network-tab.md`  
**Spec note:** Incremental UX/nav cleanup on the Option C / Network + Tools surface (not a new network protocol).

## Traceability

| AC | Test / smoke |
|----|----------------|
| Tools compare without Lab | `e2e/lab.spec.ts` S18, S18b |
| No Balance nav / 5-nav | helpers `NAV`, S0, S36, S10 |
| #balance → Network CLI | S24 |
| Online chip UX | S0 + HTML help-tip-safety |
| Lab CSP still offline | labCspOffline |

## Threat notes

- Lab remains `connect-src 'none'`; auto-generated mnemonics never leave the page via this change.
- Public balance still only on Network after leak ack; CLI remains address-only (no seed).
- Online chip is `navigator.onLine` only — not a security boundary; CSP is the crypto isolation.

## Red-proof

```text
red_cmd: Tools Compare with empty #mnemonic → "Need a valid mnemonic on the Lab panel first."
green_cmd: npx playwright test e2e/lab.spec.ts -g "S18"  → pass (auto-generate + A:/B:)
TDD N/A for pure HTML/CSS chip/nav (covered by S0/S36)
```

## Evidence pack

- **hard_gates:** `python3 scripts/hard_gates.py --diff origin/master...HEAD` (after artifacts)
- **smoke / e2e:** `npm run test:e2e` (product_plugin) · focused S18/S24/S0 green in ship cycle
- **pytest:** `python -m pytest -q` (unit smoke at release)
- **secrets:** `check_secrets_diff` clean origin/master...HEAD
- **CODE-REVIEW / BEHAVIOR / CROSS-REVIEW:** `.agents/artifacts/*`

## Things that look bad but are actually fine

1. **Online=green / offline=red** looks like “online is healthy”; product intent is connectivity readability — (i) still teaches air-gap caution.
2. **Auto-generate mutates Lab `#mnemonic`** from Tools — intentional shared field so Network handoff and Lab table stay consistent.
3. **Removing Balance nav** can look like feature loss — it was docs only; Network has live balances + richer CLI copy.
4. **S13b fee snapshot** may fail without mempool proxy — pre-existing env dependency, not this UX ship.

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md` — blockers=0, obsolete Tier A removals for Balance panel.
