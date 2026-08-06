"""Golden vectors — abandon…about (BIP-39 / common wallet paths)."""

from bip39lab.bip39 import generate_mnemonic, mnemonic_to_seed, validate_mnemonic
from bip39lab.derive import derive_address_for_type, derive_addresses
from bip39lab.wordlist import EXPECTED_SHA256, load_english_wordlist
import hashlib
from pathlib import Path

ABANDON = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

# Well-known first receive addresses for abandon…about (empty passphrase)
# BIP44 m/44'/0'/0'/0/0
ADDR_BIP44 = "1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA"
# BIP49 m/49'/0'/0'/0/0
ADDR_BIP49 = "37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf"
# BIP84 m/84'/0'/0'/0/0
ADDR_BIP84 = "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu"


def test_wordlist_integrity():
    words = load_english_wordlist()
    assert len(words) == 2048
    raw = (Path(__file__).resolve().parents[1] / "src/bip39lab/data/english.txt").read_bytes()
    assert hashlib.sha256(raw).hexdigest() == EXPECTED_SHA256


def test_validate_abandon():
    assert validate_mnemonic(ABANDON) is True


def test_reject_bad_checksum():
    # last word wrong checksum
    bad = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"
    assert validate_mnemonic(bad) is False


def test_seed_length():
    seed = mnemonic_to_seed(ABANDON)
    assert len(seed) == 64


def test_derive_bip44():
    assert derive_address_for_type(ABANDON, "p2pkh") == ADDR_BIP44


def test_derive_bip49():
    assert derive_address_for_type(ABANDON, "p2sh") == ADDR_BIP49


def test_derive_bip84():
    assert derive_address_for_type(ABANDON, "bech32") == ADDR_BIP84


def test_derive_all():
    d = derive_addresses(ABANDON)
    assert d["bip44_p2pkh"] == ADDR_BIP44
    assert d["bip49_p2sh_p2wpkh"] == ADDR_BIP49
    assert d["bip84_p2wpkh"] == ADDR_BIP84


def test_generate_valid():
    m = generate_mnemonic(12)
    assert validate_mnemonic(m)
    assert len(m.split()) == 12
