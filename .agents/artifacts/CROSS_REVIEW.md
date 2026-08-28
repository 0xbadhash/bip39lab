# CROSS-REVIEW

Blockers: 0. Obsolete Tier A: 0.

### Security Guru
none — same leak-ack + `/api/mempool` then mempool.space; no mnemonic persist; no Sign.

### Maintainability Expert
none blocking — new rows are data; decode is localized.

### Obsolete / cleanup (scoped)
- Tier A: none

### Domain Specialist
none — OP_RETURN ASCII vs witness `ord` vs OP_13 are distinct; rune 0 skipped (zero txid).

## Things that look bad but are actually fine
1. Dual stamp
2. Six buttons vs “three examples” copy elsewhere
3. No Sign
