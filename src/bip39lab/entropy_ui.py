"""Display helpers for BIP-39 ENT bits and passphrase strength estimates.

Pedagogical UI values only — not a cryptographic security proof.
Keep in sync with web/js/app.js (estimatePassphraseBits / formatPassphraseStrength).
"""

from __future__ import annotations

import math
import re
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


def _charset_pool_size(passphrase: str) -> int:
    pool = 0
    if re.search(r"[a-z]", passphrase):
        pool += 26
    if re.search(r"[A-Z]", passphrase):
        pool += 26
    if re.search(r"[0-9]", passphrase):
        pool += 10
    if re.search(r"[^a-zA-Z0-9]", passphrase):
        pool += 33  # rough printable-symbol budget for teaching
    return max(pool, 2)


def estimate_passphrase_bits(passphrase: str) -> float | None:
    """Conservative pedagogical estimate of passphrase strength in bits.

    Combines Shannon entropy of the string with a charset-size × length bound.
    Returns None when empty. Caps at 256 bits for display.
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
    shannon_bits = h * n
    charset_bits = math.log2(_charset_pool_size(passphrase)) * n
    # Prefer the lower of the two so repeats / tiny alphabets stay “weak”
    bits = min(shannon_bits, charset_bits)
    return min(bits, 256.0)


def passphrase_strength_tier(bits: float | None) -> str:
    """empty | weak | fair | strong — UI class names."""
    if bits is None:
        return "empty"
    if bits < 40:
        return "weak"
    if bits < 80:
        return "fair"
    return "strong"


def format_passphrase_strength(passphrase: str) -> str:
    est = estimate_passphrase_bits(passphrase)
    if est is None:
        return "Empty — no extra secret (not the 512-bit PBKDF2 seed size)"
    tier = passphrase_strength_tier(est)
    label = {"weak": "weak", "fair": "fair", "strong": "stronger"}[tier]
    return f"~{round(est)} bits · {label} (estimate only — not a security guarantee)"
