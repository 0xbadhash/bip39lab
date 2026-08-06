"""Address-only balance lookup — never accepts seed material."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class BalanceResult:
    status: str  # ok | unknown | error
    satoshis: int | None
    detail: str = ""


def looks_like_mnemonic(text: str) -> bool:
    parts = text.strip().split()
    return len(parts) >= 8 and all(p.isalpha() for p in parts)


def fetch_blockstream(address: str, opener: Callable = urlopen) -> BalanceResult:
    url = f"https://blockstream.info/api/address/{address}"
    try:
        req = Request(url, headers={"User-Agent": "bip39lab-address-only/0.3"})
        with opener(req, timeout=20) as resp:
            import json

            data = json.loads(resp.read().decode("utf-8"))
        chain = data.get("chain_stats") or {}
        funded = int(chain.get("funded_txo_sum", 0))
        spent = int(chain.get("spent_txo_sum", 0))
        return BalanceResult("ok", funded - spent, "blockstream")
    except (HTTPError, URLError, TimeoutError, ValueError, KeyError, TypeError) as e:
        return BalanceResult("unknown", None, f"blockstream failed: {e}")


def get_address_balance(
    address: str,
    *,
    backend: str = "none",
    acknowledge_leak: bool = False,
    opener: Callable = urlopen,
) -> BalanceResult:
    if looks_like_mnemonic(address):
        return BalanceResult(
            "error",
            None,
            "refusing mnemonic-like input; balance is address-only",
        )
    address = address.strip()
    if not address or " " in address:
        return BalanceResult("error", None, "invalid address")

    if backend in ("", "none", "offline"):
        return BalanceResult("unknown", None, "no backend (offline default)")

    if backend == "blockstream":
        if not acknowledge_leak:
            return BalanceResult(
                "error",
                None,
                "refusing network: pass acknowledge_leak=True / --i-understand-address-leak",
            )
        return fetch_blockstream(address, opener=opener)

    return BalanceResult("error", None, f"unknown backend: {backend}")
