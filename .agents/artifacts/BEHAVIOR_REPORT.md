# BEHAVIOR-REPORT — Multisig teach UX

## Surface
`web/multisig.html` offline calculator

## Runtime checks
| Behavior | Result |
|----------|--------|
| Calculator banner visible | pass (S26) |
| Dual chips present | pass (S26) |
| BIP67 warn on uncheck | pass (S28) |
| 2-of-2 golden P2SH | pass (S12) |
| Refuse WIF | pass (S12) |
| Demo N=3 | pass (S12b) |

## Residual risk
Demo seeds still render on page for teaching; banner + copy discourage funding.
