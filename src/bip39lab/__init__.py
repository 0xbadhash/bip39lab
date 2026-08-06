"""Offline BIP-39 / BIP-32 derivation lab — no network, no secret retention."""

from .bip39 import generate_mnemonic, mnemonic_to_seed, validate_mnemonic
from .derive import derive_address_for_type, derive_addresses

__all__ = [
    "derive_address_for_type",
    "derive_addresses",
    "generate_mnemonic",
    "mnemonic_to_seed",
    "validate_mnemonic",
]

__version__ = "0.1.0"
