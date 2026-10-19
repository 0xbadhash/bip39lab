"""
Educational Shamir secret sharing over GF(256) — NOT SLIP-39 / Trezor-compatible.

Split a secret byte string into N shares such that any M reconstruct it.
For teaching only; do not use for real recovery seed backups.
"""

from __future__ import annotations

import re
import secrets
from collections.abc import Mapping, Sequence
from itertools import combinations
from typing import Any

MAX_N = 7
MIN_M = 2


def _gf_mul(a: int, b: int) -> int:
    """Multiply in GF(2^8) with AES polynomial 0x11b."""
    p = 0
    a &= 0xFF
    b &= 0xFF
    for _ in range(8):
        if b & 1:
            p ^= a
        hi = a & 0x80
        a = (a << 1) & 0xFF
        if hi:
            a ^= 0x1B
        b >>= 1
    return p


def _gf_inv(a: int) -> int:
    """Fermat: a^(254) in GF(256)."""
    a &= 0xFF
    if a == 0:
        raise ZeroDivisionError("gf inv 0")
    # a^254 = a^(2^8 - 2)
    r = 1
    base = a
    exp = 254
    while exp:
        if exp & 1:
            r = _gf_mul(r, base)
        base = _gf_mul(base, base)
        exp >>= 1
    return r


def _eval_poly(coeffs: Sequence[int], x: int) -> int:
    """f(x) = c0 + c1 x + c2 x^2 + …  (c0 = secret byte). Horner in GF(256)."""
    y = 0
    for c in reversed(coeffs):
        y = _gf_mul(y, x) ^ (c & 0xFF)
    return y


def _lagrange_at_zero(xs: Sequence[int], ys: Sequence[int]) -> int:
    """
    f(0) via Lagrange:
      f(0) = Σ yi * Π_{j≠i} (0 - xj) / (xi - xj)
    In char 2: 0 - x = x, xi - xj = xi ⊕ xj.
    """
    secret = 0
    k = len(xs)
    for i in range(k):
        num = 1
        den = 1
        xi = xs[i]
        for j in range(k):
            if i == j:
                continue
            xj = xs[j]
            num = _gf_mul(num, xj)  # (0 - xj)
            den = _gf_mul(den, xi ^ xj)
        li0 = _gf_mul(num, _gf_inv(den))
        secret ^= _gf_mul(ys[i] & 0xFF, li0)
    return secret


def split_secret(
    secret: bytes,
    m: int,
    n: int,
    *,
    rng: Any | None = None,
) -> list[dict[str, Any]]:
    """
    Split secret into n shares; any m reconstruct.

    Returns list of dicts: {index: 1..n, payload: bytes same length as secret}.
    """
    if not secret:
        raise ValueError("secret is empty")
    if m < MIN_M:
        raise ValueError(f"threshold M must be >= {MIN_M}")
    if n < m:
        raise ValueError("N must be >= M (threshold)")
    if n > MAX_N:
        raise ValueError(f"N exceeds max {MAX_N} for demo")

    rnd = rng if rng is not None else secrets.SystemRandom()

    def rand_byte() -> int:
        if hasattr(rnd, "randbelow"):
            return int(rnd.randbelow(256))
        if hasattr(rnd, "getrandbits"):
            return int(rnd.getrandbits(8)) & 0xFF
        return secrets.randbelow(256)

    shares_payload: list[bytearray] = [bytearray(len(secret)) for _ in range(n)]
    for bi, sb in enumerate(secret):
        # Leading coeff must be nonzero or the polynomial degree drops below M-1.
        high = [rand_byte() for _ in range(m - 2)]
        lead = rand_byte()
        while lead == 0:
            lead = rand_byte()
        coeffs = [sb & 0xFF] + high + [lead]
        for i in range(n):
            x = i + 1
            shares_payload[i][bi] = _eval_poly(coeffs, x)

    return [{"index": i + 1, "payload": bytes(shares_payload[i])} for i in range(n)]


def _combine_points(items: Sequence[tuple[int, bytes]]) -> bytes:
    length = len(items[0][1])
    if length == 0:
        raise ValueError("empty share payload")
    for _, payload in items:
        if len(payload) != length:
            raise ValueError("share payload length mismatch")
    out = bytearray(length)
    xs = [idx for idx, _ in items]
    for bi in range(length):
        ys = [payload[bi] for _, payload in items]
        out[bi] = _lagrange_at_zero(xs, ys)
    return bytes(out)


def combine_shares(shares: Sequence[Mapping[str, Any]], *, m: int | None = None) -> bytes:
    """Reconstruct from exactly M consistent shares. Extra shares must agree or raise."""
    if not shares:
        raise ValueError("need shares to combine")
    if len(shares) < MIN_M:
        raise ValueError(f"need at least M={MIN_M} shares (threshold)")

    by_idx: dict[int, bytes] = {}
    for s in shares:
        idx = int(s["index"])
        payload = s["payload"]
        if not isinstance(payload, (bytes, bytearray)):
            raise TypeError("share payload must be bytes")
        if idx < 1 or idx > 255:
            raise ValueError("invalid share index")
        blob = bytes(payload)
        prev = by_idx.get(idx)
        if prev is not None and prev != blob:
            raise ValueError("inconsistent shares")
        by_idx[idx] = blob

    items = list(by_idx.items())
    count = len(items)
    if m is None:
        m = count
    if m < MIN_M:
        raise ValueError(f"threshold M must be >= {MIN_M}")
    if count < m:
        raise ValueError(f"need exactly M={m} consistent shares")
    if count == m:
        return _combine_points(items)

    outs = [_combine_points(group) for group in combinations(items, m)]
    if any(got != outs[0] for got in outs[1:]):
        raise ValueError("inconsistent shares")
    return outs[0]


def encode_share(share: Mapping[str, Any]) -> str:
    """Human-readable: share:<index>:<hex>"""
    idx = int(share["index"])
    hx = bytes(share["payload"]).hex()
    return f"share:{idx}:{hx}"


def parse_share(line: str) -> dict[str, Any]:
    line = (line or "").strip()
    parts = line.split(":")
    if len(parts) != 3 or parts[0] != "share":
        raise ValueError("share format must be share:<index>:<hex>")
    idx = int(parts[1], 10)
    hx = parts[2]
    if not re.fullmatch(r"[0-9a-fA-F]+", hx or "") or len(hx) % 2:
        raise ValueError("share payload is not hex")
    payload = bytes.fromhex(hx)
    return {"index": idx, "payload": payload}
