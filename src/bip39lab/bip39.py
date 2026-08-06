"""BIP-39 mnemonic generate / validate / seed (offline)."""

from __future__ import annotations

import hashlib
import secrets

from .wordlist import load_english_wordlist, word_index

_STRENGTH = {12: 128, 15: 160, 18: 192, 21: 224, 24: 256}


def _bits_from_bytes(data: bytes) -> str:
    return bin(int.from_bytes(data, "big"))[2:].zfill(len(data) * 8)


def generate_mnemonic(word_count: int = 12) -> str:
    if word_count not in _STRENGTH:
        raise ValueError("word_count must be one of 12,15,18,21,24")
    strength = _STRENGTH[word_count]
    entropy = secrets.token_bytes(strength // 8)
    return entropy_to_mnemonic(entropy)


def entropy_to_mnemonic(entropy: bytes) -> str:
    if len(entropy) not in (16, 20, 24, 28, 32):
        raise ValueError("entropy length must be 16/20/24/28/32 bytes")
    words = load_english_wordlist()
    ent_bits = _bits_from_bytes(entropy)
    cs_len = len(entropy) * 8 // 32
    hash_bits = _bits_from_bytes(hashlib.sha256(entropy).digest())
    bits = ent_bits + hash_bits[:cs_len]
    out: list[str] = []
    for i in range(0, len(bits), 11):
        idx = int(bits[i : i + 11], 2)
        out.append(words[idx])
    return " ".join(out)


def validate_mnemonic(mnemonic: str) -> bool:
    try:
        _mnemonic_to_entropy(mnemonic)
        return True
    except ValueError:
        return False


def _mnemonic_to_entropy(mnemonic: str) -> bytes:
    parts = mnemonic.strip().split()
    if len(parts) not in _STRENGTH:
        raise ValueError(f"invalid mnemonic length: {len(parts)} words")
    words = load_english_wordlist()
    word_set = set(words)
    for w in parts:
        if w not in word_set:
            raise ValueError(f"invalid word: {w!r}")
    bits = "".join(bin(word_index(w))[2:].zfill(11) for w in parts)
    ent_len = _STRENGTH[len(parts)]
    cs_len = ent_len // 32
    ent_bits = bits[:ent_len]
    cs_bits = bits[ent_len : ent_len + cs_len]
    entropy = int(ent_bits, 2).to_bytes(ent_len // 8, "big")
    hash_bits = _bits_from_bytes(hashlib.sha256(entropy).digest())
    if cs_bits != hash_bits[:cs_len]:
        raise ValueError("invalid BIP-39 checksum")
    return entropy


def mnemonic_to_seed(mnemonic: str, passphrase: str = "") -> bytes:
    """PBKDF2-HMAC-SHA512 (BIP-39). Does not log or persist secrets."""
    if not validate_mnemonic(mnemonic):
        raise ValueError("invalid mnemonic")
    salt = ("mnemonic" + passphrase).encode("utf-8")
    return hashlib.pbkdf2_hmac(
        "sha512",
        mnemonic.strip().encode("utf-8"),
        salt,
        2048,
        dklen=64,
    )


def normalize_mnemonic(mnemonic: str) -> str:
    return " ".join(mnemonic.strip().split())
