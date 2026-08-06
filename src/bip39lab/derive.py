"""High-level derivation for BIP44 / BIP49 / BIP84 (BTC mainnet, account 0)."""

from __future__ import annotations

from .address import p2pkh_address, p2sh_p2wpkh_address, p2wpkh_address
from .bip32 import HARDENED, derive_path
from .bip39 import mnemonic_to_seed, normalize_mnemonic, validate_mnemonic


def _path(purpose: int, account: int = 0, change: int = 0, index: int = 0) -> list[int]:
    return [
        purpose | HARDENED,
        0 | HARDENED,  # coin_type BTC
        account | HARDENED,
        change,
        index,
    ]


def derive_address_for_type(
    mnemonic: str,
    derivation_type: str,
    *,
    passphrase: str = "",
    account: int = 0,
    change: int = 0,
    index: int = 0,
) -> str:
    mnemonic = normalize_mnemonic(mnemonic)
    if not validate_mnemonic(mnemonic):
        raise ValueError("invalid mnemonic")
    seed = mnemonic_to_seed(mnemonic, passphrase)
    dtype = derivation_type.lower()
    if dtype in ("p2pkh", "bip44", "legacy"):
        priv = derive_path(seed, _path(44, account, change, index))
        return p2pkh_address(priv)
    if dtype in ("p2sh", "p2sh-p2wpkh", "bip49", "nested"):
        priv = derive_path(seed, _path(49, account, change, index))
        return p2sh_p2wpkh_address(priv)
    if dtype in ("bech32", "p2wpkh", "bip84", "native"):
        priv = derive_path(seed, _path(84, account, change, index))
        return p2wpkh_address(priv)
    raise ValueError(f"unknown derivation_type: {derivation_type}")


def derive_addresses(
    mnemonic: str,
    *,
    passphrase: str = "",
    account: int = 0,
    change: int = 0,
    index: int = 0,
) -> dict[str, str]:
    return {
        "bip44_p2pkh": derive_address_for_type(
            mnemonic, "p2pkh", passphrase=passphrase, account=account, change=change, index=index
        ),
        "bip49_p2sh_p2wpkh": derive_address_for_type(
            mnemonic, "p2sh", passphrase=passphrase, account=account, change=change, index=index
        ),
        "bip84_p2wpkh": derive_address_for_type(
            mnemonic, "bech32", passphrase=passphrase, account=account, change=change, index=index
        ),
    }
