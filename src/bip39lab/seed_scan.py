"""Educational random-seed UTXO scan via Knots/Core scantxoutset (ops only).

Safety contract:
- Store only sha256(normalized mnemonic) under a gitignored path.
- Never log or return mnemonics in public summaries.
- Prefer abort while node is in IBD (incomplete UTXO set + slow scans).
- Not a product "wallet finder" — educational null-result sampling.
"""

from __future__ import annotations

import hashlib
import json
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .balance import btc_to_satoshis
from .bip39 import generate_mnemonic, normalize_mnemonic
from .derive import derive_address_for_type

# Default address set: single-index mainnet receives (keep scantxoutset small).
DEFAULT_DERIVATION_TYPES: tuple[str, ...] = ("bip84", "bip44")


class SeedScanError(RuntimeError):
    """Fail-closed preflight or scan configuration error."""


def normalize_for_hash(mnemonic: str) -> str:
    """Lowercase + collapse whitespace (stable hash input)."""
    return " ".join(normalize_mnemonic(mnemonic).lower().split())


def mnemonic_sha256_hex(mnemonic: str) -> str:
    return hashlib.sha256(normalize_for_hash(mnemonic).encode("utf-8")).hexdigest()


def load_hash_set(path: Path | str) -> set[str]:
    p = Path(path)
    if not p.is_file():
        return set()
    out: set[str] = set()
    for line in p.read_text(encoding="utf-8").splitlines():
        h = line.strip().lower()
        if len(h) == 64 and all(c in "0123456789abcdef" for c in h):
            out.add(h)
    return out


def append_hash(path: Path | str, digest_hex: str) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8") as f:
        f.write(digest_hex.strip().lower() + "\n")


def preflight_rpc(
    rpc_call: Callable[[str, list[Any]], Any],
    *,
    allow_ibd: bool = False,
) -> dict[str, Any]:
    """Require RPC auth + chain info. Fail closed while IBD unless allow_ibd."""
    try:
        info = rpc_call("getblockchaininfo", [])
    except Exception as e:
        raise SeedScanError(f"RPC preflight failed: {e}") from e
    if not isinstance(info, dict):
        raise SeedScanError("getblockchaininfo returned non-object")
    ibd = bool(info.get("initialblockdownload"))
    if ibd and not allow_ibd:
        blocks = info.get("blocks")
        headers = info.get("headers")
        prog = info.get("verificationprogress")
        raise SeedScanError(
            "Node is in IBD (initialblockdownload=true) — "
            f"blocks={blocks} headers={headers} verificationprogress={prog}. "
            "scantxoutset is incomplete/slow; re-run when synced "
            "(or pass allow_ibd=True for experimental ops only)."
        )
    # Clear stuck scans if any (best-effort; ignore abort failures)
    try:
        rpc_call("scantxoutset", ["abort"])
    except Exception as exc:  # noqa: BLE001
        _ = exc  # abort is optional preflight hygiene
    return info


@dataclass(frozen=True)
class ScanOneResult:
    mnemonic_hash: str
    total_satoshis: int
    address_count: int
    hit: bool
    detail: str = ""

    def as_public_dict(self) -> dict[str, Any]:
        return {
            "mnemonic_hash": self.mnemonic_hash,
            "total_satoshis": self.total_satoshis,
            "address_count": self.address_count,
            "hit": self.hit,
            "detail": self.detail,
        }


def practice_addresses(
    mnemonic: str,
    *,
    derivation_types: tuple[str, ...] = DEFAULT_DERIVATION_TYPES,
) -> list[str]:
    addrs: list[str] = []
    for dtype in derivation_types:
        addrs.append(
            derive_address_for_type(mnemonic, dtype, account=0, change=0, index=0)
        )
    return addrs


def scan_mnemonic_utxos(
    mnemonic: str,
    *,
    rpc_call: Callable[[str, list[Any]], Any],
    derivation_types: tuple[str, ...] = DEFAULT_DERIVATION_TYPES,
) -> ScanOneResult:
    """Derive fixed addresses and run one scantxoutset batch. No mnemonic in return."""
    digest = mnemonic_sha256_hex(mnemonic)
    addrs = practice_addresses(mnemonic, derivation_types=derivation_types)
    descriptors = [f"addr({a})" for a in addrs]
    result = rpc_call("scantxoutset", ["start", descriptors])
    if not isinstance(result, dict) or "total_amount" not in result:
        raise SeedScanError("unexpected scantxoutset result shape")
    sats = btc_to_satoshis(result["total_amount"])
    return ScanOneResult(
        mnemonic_hash=digest,
        total_satoshis=sats,
        address_count=len(addrs),
        hit=sats > 0,
        detail="scantxoutset batch",
    )


@dataclass
class ScanSummary:
    scanned_new: int = 0
    skipped_dup: int = 0
    hits: int = 0
    rpc_errors: int = 0
    target: int = 2000
    hash_file_lines: int = 0
    stopped_reason: str = ""
    # Redacted hit hashes only (never mnemonics)
    hit_hashes: list[str] = field(default_factory=list)


def summary_to_public_dict(summary: ScanSummary) -> dict[str, Any]:
    return {
        "scanned_new": summary.scanned_new,
        "skipped_dup": summary.skipped_dup,
        "hits": summary.hits,
        "rpc_errors": summary.rpc_errors,
        "target": summary.target,
        "hash_file_lines": summary.hash_file_lines,
        "stopped_reason": summary.stopped_reason,
        "hit_hashes": list(summary.hit_hashes),
    }


def run_campaign(
    *,
    hash_path: Path | str,
    target: int = 2000,
    rpc_call: Callable[[str, list[Any]], Any],
    word_count: int = 12,
    allow_ibd: bool = False,
    max_new: int | None = None,
    on_progress: Callable[[ScanSummary], None] | None = None,
) -> ScanSummary:
    """Resume until unique hash count >= target (or max_new new successes)."""
    preflight_rpc(rpc_call, allow_ibd=allow_ibd)
    seen = load_hash_set(hash_path)
    summary = ScanSummary(target=target, hash_file_lines=len(seen))
    attempts = 0
    # Bound attempts to avoid infinite loop if RNG somehow collides (should not)
    max_attempts = max(target * 5, 10_000)
    while len(seen) < target and attempts < max_attempts:
        if max_new is not None and summary.scanned_new >= max_new:
            summary.stopped_reason = "max_new reached"
            break
        attempts += 1
        mn = generate_mnemonic(word_count)
        digest = mnemonic_sha256_hex(mn)
        if digest in seen:
            summary.skipped_dup += 1
            continue
        try:
            one = scan_mnemonic_utxos(mn, rpc_call=rpc_call)
        except Exception as e:  # noqa: BLE001 — count and continue/stop
            summary.rpc_errors += 1
            summary.stopped_reason = f"rpc_error: {type(e).__name__}"
            # fail closed after first transport failure in bulk (IBD kill pattern)
            break
        append_hash(hash_path, digest)
        seen.add(digest)
        summary.scanned_new += 1
        summary.hash_file_lines = len(seen)
        if one.hit:
            summary.hits += 1
            summary.hit_hashes.append(digest)
        if on_progress and summary.scanned_new % 10 == 0:
            on_progress(summary)
        # wipe local mnemonic reference (best-effort; GC)
        del mn
    else:
        if len(seen) >= target:
            summary.stopped_reason = "target reached"
        elif not summary.stopped_reason:
            summary.stopped_reason = "max_attempts"
    summary.hash_file_lines = len(load_hash_set(hash_path))
    return summary


def public_report_json(summary: ScanSummary) -> str:
    return json.dumps(summary_to_public_dict(summary), indent=2, sort_keys=True) + "\n"
