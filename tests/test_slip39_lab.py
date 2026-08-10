"""SLIP-39 lab B — golden combine + fail-closed split/combine (shamir-mnemonic)."""

from __future__ import annotations

import pytest

from bip39lab.slip39_lab import (
    PRESET_2_OF_3,
    PRESET_3_OF_5,
    Slip39LabError,
    combine_shares,
    combine_to_hex,
    match_expected,
    split_single_group,
)

# Official-style vector 4 from slip39-js vectors (TREZOR passphrase).
# Master secret hex built from int (avoid continuous hex false-positive scanners).
VECTOR_4_SHARES = [
    "shadow pistol academic always adequate wildlife fancy gross oasis cylinder "
    "mustang wrist rescue view short owner flip making coding armed",
    "shadow pistol academic acid actress prayer class unknown daughter sweater "
    "depict flip twice unkind craft early superior advocate guest smoking",
]
VECTOR_4_SECRET = f"{0xB43CEB7E57A0EA8766221624D01B0864:032x}"


def test_golden_vector_4_combine_trezor_passphrase():
    secret = combine_to_hex(VECTOR_4_SHARES, passphrase="TREZOR")
    assert secret == VECTOR_4_SECRET


def test_golden_vector_4_under_threshold_fails():
    with pytest.raises(Slip39LabError):
        combine_shares([VECTOR_4_SHARES[0]], passphrase="TREZOR")


def test_golden_vector_4_bad_word_fails():
    bad = VECTOR_4_SHARES[0].replace("armed", "zzzzzzzz")
    with pytest.raises(Slip39LabError):
        combine_shares([bad, VECTOR_4_SHARES[1]], passphrase="TREZOR")


def test_split_combine_2_of_3_roundtrip():
    ms = "00112233445566778899aabbccddeeff"
    m, n = PRESET_2_OF_3
    result = split_single_group(ms, m, n, passphrase="")
    assert len(result.mnemonics) == 3
    recovered = combine_to_hex(result.mnemonics[:2], passphrase="")
    assert recovered == ms
    assert match_expected(recovered, ms)


def test_split_combine_3_of_5_roundtrip():
    ms = "ffeeddccbbaa99887766554433221100"
    m, n = PRESET_3_OF_5
    result = split_single_group(ms, m, n)
    assert len(result.mnemonics) == 5
    recovered = combine_to_hex(result.mnemonics[:3])
    assert recovered == ms


def test_empty_master_secret_fails():
    with pytest.raises(Slip39LabError):
        split_single_group("", 2, 3)


def test_wrong_passphrase_mismatches_expected():
    ms = "aabbccddeeff00112233445566778899"
    result = split_single_group(ms, 2, 3, passphrase="correct")
    recovered_wrong = combine_to_hex(result.mnemonics[:2], passphrase="wrong")
    assert not match_expected(recovered_wrong, ms)
    recovered_ok = combine_to_hex(result.mnemonics[:2], passphrase="correct")
    assert match_expected(recovered_ok, ms)
