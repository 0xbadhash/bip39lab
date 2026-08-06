"""Minimal secp256k1 ops for public-key derivation (not constant-time)."""

from __future__ import annotations

from dataclasses import dataclass

P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
GX = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
GY = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8


@dataclass(frozen=True)
class Point:
    x: int | None
    y: int | None
    infinity: bool = False

    @staticmethod
    def inf() -> "Point":
        return Point(None, None, True)


G = Point(GX, GY, False)


def _modinv(a: int, m: int) -> int:
    return pow(a % m, -1, m)


def point_add(p1: Point, p2: Point) -> Point:
    if p1.infinity:
        return p2
    if p2.infinity:
        return p1
    assert p1.x is not None and p1.y is not None
    assert p2.x is not None and p2.y is not None
    if p1.x == p2.x and (p1.y + p2.y) % P == 0:
        return Point.inf()
    if p1.x == p2.x and p1.y == p2.y:
        if p1.y == 0:
            return Point.inf()
        lam = (3 * p1.x * p1.x) * _modinv(2 * p1.y, P) % P
    else:
        lam = (p2.y - p1.y) * _modinv(p2.x - p1.x, P) % P
    x3 = (lam * lam - p1.x - p2.x) % P
    y3 = (lam * (p1.x - x3) - p1.y) % P
    return Point(x3, y3, False)


def scalar_mult(k: int, point: Point = G) -> Point:
    if k % N == 0 or point.infinity:
        return Point.inf()
    if k < 0:
        raise ValueError("negative scalar")
    result = Point.inf()
    addend = point
    while k:
        if k & 1:
            result = point_add(result, addend)
        addend = point_add(addend, addend)
        k >>= 1
    return result


def priv_to_compressed_pub(priv: int) -> bytes:
    pub = scalar_mult(priv % N)
    if pub.infinity or pub.x is None or pub.y is None:
        raise ValueError("invalid private key")
    prefix = b"\x02" if pub.y % 2 == 0 else b"\x03"
    return prefix + pub.x.to_bytes(32, "big")
