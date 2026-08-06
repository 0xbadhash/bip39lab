"""Bitcoin address encoding: P2PKH, P2SH-P2WPKH, native SegWit bech32."""

from __future__ import annotations

import hashlib

from .secp256k1 import priv_to_compressed_pub


def hash160(data: bytes) -> bytes:
    return hashlib.new("ripemd160", hashlib.sha256(data).digest()).digest()


def base58check(payload: bytes) -> str:
    alphabet = b"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    checksum = hashlib.sha256(hashlib.sha256(payload).digest()).digest()[:4]
    data = payload + checksum
    n = int.from_bytes(data, "big")
    res = bytearray()
    while n > 0:
        n, r = divmod(n, 58)
        res.append(alphabet[r])
    pad = 0
    for b in data:
        if b == 0:
            pad += 1
        else:
            break
    return (b"1" * pad + bytes(reversed(res))).decode("ascii")


def convertbits(data: bytes | list[int], frombits: int, tobits: int, pad: bool = True) -> list[int] | None:
    acc = 0
    bits = 0
    ret: list[int] = []
    maxv = (1 << tobits) - 1
    max_acc = (1 << (frombits + tobits - 1)) - 1
    for value in data:
        if value < 0 or (value >> frombits):
            return None
        acc = ((acc << frombits) | value) & max_acc
        bits += frombits
        while bits >= tobits:
            bits -= tobits
            ret.append((acc >> bits) & maxv)
    if pad:
        if bits:
            ret.append((acc << (tobits - bits)) & maxv)
    elif bits >= frombits or ((acc << (tobits - bits)) & maxv):
        return None
    return ret


def bech32_polymod(values: list[int]) -> int:
    gen = [0x3B6A57B2, 0x26508E6D, 0x1EA119FA, 0x3D4233DD, 0x2A1462B3]
    chk = 1
    for v in values:
        b = chk >> 25
        chk = ((chk & 0x1FFFFFF) << 5) ^ v
        for i in range(5):
            if (b >> i) & 1:
                chk ^= gen[i]
    return chk


def bech32_hrp_expand(hrp: str) -> list[int]:
    return [ord(x) >> 5 for x in hrp] + [0] + [ord(x) & 31 for x in hrp]


def bech32_create_checksum(hrp: str, data: list[int]) -> list[int]:
    values = bech32_hrp_expand(hrp) + data
    polymod = bech32_polymod(values + [0, 0, 0, 0, 0, 0]) ^ 1
    return [(polymod >> 5 * (5 - i)) & 31 for i in range(6)]


def bech32_encode(hrp: str, data: list[int]) -> str:
    combined = data + bech32_create_checksum(hrp, data)
    charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
    return hrp + "1" + "".join(charset[d] for d in combined)


def p2pkh_address(priv: int) -> str:
    pub = priv_to_compressed_pub(priv)
    return base58check(b"\x00" + hash160(pub))


def p2sh_p2wpkh_address(priv: int) -> str:
    pub = priv_to_compressed_pub(priv)
    redeem = b"\x00\x14" + hash160(pub)
    return base58check(b"\x05" + hash160(redeem))


def p2wpkh_address(priv: int) -> str:
    pub = priv_to_compressed_pub(priv)
    prog = hash160(pub)
    data = convertbits(prog, 8, 5)
    assert data is not None
    return bech32_encode("bc", [0] + data)
