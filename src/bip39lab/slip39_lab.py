"""Thin offline wrap around Trezor ``shamir-mnemonic`` (SLIP-39).

Lab only: practice master secrets, no BIP-39 import, no secret retention.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

from shamir_mnemonic import combine_mnemonics, generate_mnemonics

# Demo presets: single-group (group threshold 1, one group with M-of-N members).
PRESET_2_OF_3 = (2, 3)
PRESET_3_OF_5 = (3, 5)


class Slip39LabError(ValueError):
    """Fail-closed lab error (bad input / under-threshold / library refuse)."""


@dataclass(frozen=True)
class Slip39SplitResult:
    """Single-group split: list of share mnemonics (space-separated words)."""

    master_secret_hex: str
    threshold: int
    share_count: int
    mnemonics: list[str]
    passphrase_used: bool


def _require_even_hex(hex_str: str) -> bytes:
    raw = (hex_str or "").strip().lower().replace("0x", "")
    if not raw:
        raise Slip39LabError("Master secret hex is empty.")
    if len(raw) % 2 != 0 or any(c not in "0123456789abcdef" for c in raw):
        raise Slip39LabError("Master secret must be even-length hex.")
    if len(raw) < 32:
        raise Slip39LabError("Master secret must be at least 16 bytes (32 hex chars).")
    if len(raw) % 4 != 0:
        # SLIP-39 secret length must be multiple of 2 bytes and typically 16/32.
        raise Slip39LabError("Master secret hex length must be a multiple of 4 chars (2 bytes).")
    return bytes.fromhex(raw)


def _passphrase_bytes(passphrase: str | None) -> bytes:
    if passphrase is None:
        return b""
    return passphrase.encode("utf-8")


def split_single_group(
    master_secret_hex: str,
    threshold: int,
    share_count: int,
    passphrase: str | None = None,
) -> Slip39SplitResult:
    """Split practice master secret into one SLIP-39 group (M-of-N members)."""
    if threshold < 1 or share_count < 1 or threshold > share_count:
        raise Slip39LabError("Need 1 ≤ threshold ≤ share_count.")
    if share_count > 16:
        raise Slip39LabError("Demo caps share_count at 16.")
    secret = _require_even_hex(master_secret_hex)
    try:
        # group_threshold=1, one group with (member_threshold, member_count)
        groups = generate_mnemonics(
            1,
            [(threshold, share_count)],
            secret,
            passphrase=_passphrase_bytes(passphrase),
        )
    except Exception as exc:  # library raises various Exception subclasses
        raise Slip39LabError(f"Split failed: {exc}") from exc
    if len(groups) != 1 or len(groups[0]) != share_count:
        raise Slip39LabError("Unexpected split shape from library.")
    return Slip39SplitResult(
        master_secret_hex=secret.hex(),
        threshold=threshold,
        share_count=share_count,
        mnemonics=list(groups[0]),
        passphrase_used=bool(passphrase),
    )


def combine_shares(
    mnemonics: Sequence[str],
    passphrase: str | None = None,
) -> bytes:
    """Combine share mnemonics → master secret bytes. Fail-closed on bad input."""
    cleaned = [m.strip() for m in mnemonics if m and m.strip()]
    if not cleaned:
        raise Slip39LabError("No share mnemonics provided.")
    try:
        return combine_mnemonics(cleaned, passphrase=_passphrase_bytes(passphrase))
    except Exception as exc:
        raise Slip39LabError(f"Combine failed: {exc}") from exc


def combine_to_hex(
    mnemonics: Sequence[str],
    passphrase: str | None = None,
) -> str:
    return combine_shares(mnemonics, passphrase=passphrase).hex()


def match_expected(
    recovered_hex: str,
    expected_hex: str,
) -> bool:
    """Constant-time-ish equality of practice secrets (lab UI)."""
    a = recovered_hex.strip().lower().replace("0x", "")
    b = expected_hex.strip().lower().replace("0x", "")
    if len(a) != len(b):
        return False
    diff = 0
    for x, y in zip(a.encode("ascii"), b.encode("ascii")):
        diff |= x ^ y
    return diff == 0
