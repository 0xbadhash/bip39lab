"""Entropy display helpers — BIP-39 ENT map + passphrase estimate."""

from bip39lab.entropy_ui import (
    ENT_BITS_BY_WORDS,
    estimate_passphrase_bits,
    format_mnemonic_entropy,
    format_passphrase_strength,
    mnemonic_entropy_bits,
)


def test_ent_bits_table():
    assert ENT_BITS_BY_WORDS == {
        12: 128,
        15: 160,
        18: 192,
        21: 224,
        24: 256,
    }
    assert mnemonic_entropy_bits(12) == 128
    assert mnemonic_entropy_bits(24) == 256
    assert mnemonic_entropy_bits(11) is None


def test_format_mnemonic_entropy():
    assert format_mnemonic_entropy(12) == "128 bits (12-word BIP-39)"
    assert format_mnemonic_entropy(24) == "256 bits (24-word BIP-39)"
    assert format_mnemonic_entropy(13) == "—"


def test_passphrase_empty():
    assert estimate_passphrase_bits("") is None
    empty = format_passphrase_strength("")
    assert "Empty" in empty or "no extra secret" in empty
    assert "512" in empty  # teaches not to confuse with PBKDF2 size


def test_passphrase_estimate_increases_with_complexity():
    weak = estimate_passphrase_bits("1111")
    strong = estimate_passphrase_bits("Tr0ub4dor&3-extra-long-mix")
    assert weak is not None and strong is not None
    assert strong > weak
    s = format_passphrase_strength("abc123XYZ!")
    assert "estimate" in s
    assert "bits" in s
    assert format_passphrase_strength("abc123XYZ!") != format_mnemonic_entropy(12)


def test_passphrase_tier_labels():
    from bip39lab.entropy_ui import passphrase_strength_tier

    assert passphrase_strength_tier(None) == "empty"
    assert passphrase_strength_tier(10) == "weak"
    assert passphrase_strength_tier(50) == "fair"
    assert passphrase_strength_tier(100) == "strong"
