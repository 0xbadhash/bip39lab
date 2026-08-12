"""Property tests for BIP-39 validate/normalize (J14)."""
from __future__ import annotations

import pytest

pytest.importorskip("hypothesis")
from hypothesis import given, strategies as st

from bip39lab import bip39
from bip39lab import wordlist


@given(st.text(max_size=300))
def test_validate_mnemonic_never_crashes(text: str) -> None:
    """validate_mnemonic must not throw on arbitrary strings."""
    ok = bip39.validate_mnemonic(text)
    assert isinstance(ok, bool)


@given(st.sampled_from([12, 15, 18, 21, 24]))
def test_generate_then_validate(n: int) -> None:
    m = bip39.generate_mnemonic(n)
    assert bip39.validate_mnemonic(m) is True
    words = m.split()
    assert len(words) == n


def test_wordlist_load() -> None:
    w = wordlist.load_english_wordlist()
    assert len(w) == 2048
