"""Display helpers for BIP-39 ENT bits and passphrase strength estimates.

Pedagogical UI values only — not a cryptographic security proof.
"""

from __future__ import annotations

import math
from collections import Counter

# BIP-39 ENT bits by word count (valid English mnemonics only).
ENT_BITS_BY_WORDS: dict[int, int] = {
    12: 128,
    15: 160,
    18: 192,
    21: 224,
    24: 256,
}


def mnemonic_entropy_bits(word_count: int) -> int | None:
    """Return BIP-39 ENT bits for a word count, or None if not a BIP-39 length."""
    return ENT_BITS_BY_WORDS.get(word_count)


def format_mnemonic_entropy(word_count: int) -> str:
    bits = mnemonic_entropy_bits(word_count)
    if bits is None:
        return "—"
    return f"{bits} bits ({word_count}-word BIP-39)"


def estimate_passphrase_bits(passphrase: str) -> float | None:
    """Shannon-style estimate of passphrase strength in bits.

    Returns None when empty. Caps display-oriented estimate at 256 bits.
    """
    if not passphrase:
        return None
    n = len(passphrase)
    if n == 0:
        return None
    counts = Counter(passphrase)
    h = 0.0
    for c in counts.values():
        p = c / n
        h -= p * math.log2(p)
    bits = h * n
    return min(bits, 256.0)


def format_passphrase_strength(passphrase: str) -> str:
    est = estimate_passphrase_bits(passphrase)
    if est is None:
        return "—"
    return f"~{round(est)} bits (estimate)"
