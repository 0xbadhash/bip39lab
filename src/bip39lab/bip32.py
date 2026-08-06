"""BIP-32 hierarchical deterministic keys (private CKD)."""

from __future__ import annotations

import hashlib
import hmac
import struct

from .secp256k1 import N, priv_to_compressed_pub

HARDENED = 0x80000000


def master_from_seed(seed: bytes) -> tuple[int, bytes]:
    I = hmac.new(b"Bitcoin seed", seed, hashlib.sha512).digest()
    il, ir = I[:32], I[32:]
    key = int.from_bytes(il, "big")
    if key == 0 or key >= N:
        raise ValueError("invalid master key")
    return key, ir


def ckd_priv(parent_key: int, parent_chain: bytes, index: int) -> tuple[int, bytes]:
    if index >= HARDENED:
        data = b"\x00" + parent_key.to_bytes(32, "big") + struct.pack(">I", index)
    else:
        data = priv_to_compressed_pub(parent_key) + struct.pack(">I", index)
    I = hmac.new(parent_chain, data, hashlib.sha512).digest()
    il, ir = I[:32], I[32:]
    child = (int.from_bytes(il, "big") + parent_key) % N
    if int.from_bytes(il, "big") >= N or child == 0:
        raise ValueError("invalid child key")
    return child, ir


def derive_path(seed: bytes, path: list[int]) -> int:
    key, chain = master_from_seed(seed)
    for idx in path:
        key, chain = ckd_priv(key, chain, idx)
    return key


def parse_path(path: str) -> list[int]:
    """Parse m/44'/0'/0'/0/0 style paths."""
    s = path.strip().replace("m/", "").replace("M/", "")
    if not s or s == "m":
        return []
    out: list[int] = []
    for part in s.split("/"):
        hardened = part.endswith("'") or part.endswith("h")
        num = int(part[:-1] if hardened else part)
        if hardened:
            num |= HARDENED
        out.append(num)
    return out
