# Plan: Option C — Network tab

- **Spec:** `.agents/specs/2026-08-06-option-c-network-tab.md`
- **Status:** ready-for-agent

## Approach

1. Add `web/network.html` + `web/js/network.js` + shared CSS; nav links Lab ↔ Network.
2. CSP on network page: `connect-src https://mempool.space` (and blockstream if needed).
3. Fee + tip endpoints; batch address balance via existing Esplora-style API shape (mirror Python `fetch_mempool`).
4. Explicit checkboxes: “I understand addresses are visible to the API”.
5. Optional: bridge from Lab via `sessionStorage` key `bip39lab.derivedAddresses` (array of strings only).

## Risks

| Risk | Mitigation |
|------|------------|
| Lab CSP regression | Never open connect-src on index.html |
| Rate limits | Small batches; user-triggered only |
| User pastes seed into network page | UI has no mnemonic field; warn only addresses |
