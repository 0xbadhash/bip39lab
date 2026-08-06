"""Vendored BIP-39 English wordlist with integrity check."""

from __future__ import annotations

import hashlib
from functools import lru_cache
from pathlib import Path

# SHA-256 of official BIP-39 english.txt (2048 words, LF-terminated lines)
EXPECTED_SHA256 = "2f5eed53a4727b4bf8880d8f3f199efc90e58503646d9ff8eff3a2ed3b24dbda"

_DATA = Path(__file__).resolve().parent / "data" / "english.txt"


class WordlistError(RuntimeError):
    """Wordlist missing or integrity failure."""


@lru_cache(maxsize=1)
def load_english_wordlist() -> tuple[str, ...]:
    if not _DATA.is_file():
        raise WordlistError(f"missing vendored wordlist: {_DATA}")
    raw = _DATA.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != EXPECTED_SHA256:
        raise WordlistError(
            f"wordlist integrity check failed: got {digest}, expected {EXPECTED_SHA256}"
        )
    words = tuple(w.strip() for w in raw.decode("utf-8").splitlines() if w.strip())
    if len(words) != 2048:
        raise WordlistError(f"wordlist must have 2048 words, got {len(words)}")
    return words


def word_index(word: str) -> int:
    words = load_english_wordlist()
    try:
        return words.index(word)
    except ValueError as e:
        raise ValueError(f"not a BIP-39 English word: {word!r}") from e
