"""Address-only balance lookup — never accepts seed material."""

from __future__ import annotations

import base64
import json
import os
from collections.abc import Callable
from dataclasses import dataclass
from decimal import ROUND_DOWN, Decimal, InvalidOperation
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class BalanceResult:
    status: str  # ok | unknown | error
    satoshis: int | None
    detail: str = ""


def looks_like_mnemonic(text: str) -> bool:
    parts = text.strip().split()
    return len(parts) >= 8 and all(p.isalpha() for p in parts)


def btc_to_satoshis(amount: Any) -> int:
    """Convert BTC amount (int/float/str/Decimal) to integer satoshis without float drift."""
    try:
        d = Decimal(str(amount))
    except (InvalidOperation, ValueError, TypeError) as e:
        raise ValueError(f"invalid BTC amount: {amount!r}") from e
    if d < 0:
        raise ValueError("negative BTC amount")
    sats = (d * Decimal(100_000_000)).to_integral_value(rounding=ROUND_DOWN)
    return int(sats)


def _fetch_esplora_style(
    address: str,
    *,
    base_url: str,
    label: str,
    opener: Callable = urlopen,
) -> BalanceResult:
    """Esplora-compatible address API (Blockstream, mempool.space)."""
    url = f"{base_url.rstrip('/')}/address/{address}"
    try:
        req = Request(url, headers={"User-Agent": "bip39lab-address-only/0.5"})
        with opener(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        chain = data.get("chain_stats") or {}
        funded = int(chain.get("funded_txo_sum", 0))
        spent = int(chain.get("spent_txo_sum", 0))
        return BalanceResult("ok", funded - spent, label)
    except (HTTPError, URLError, TimeoutError, ValueError, KeyError, TypeError) as e:
        return BalanceResult("unknown", None, f"{label} failed: {e}")


def fetch_blockstream(address: str, opener: Callable = urlopen) -> BalanceResult:
    return _fetch_esplora_style(
        address,
        base_url="https://blockstream.info/api",
        label="blockstream",
        opener=opener,
    )


def fetch_mempool(address: str, opener: Callable = urlopen) -> BalanceResult:
    """Free public review endpoint (REST). Not Bitcoin Core JSON-RPC."""
    return _fetch_esplora_style(
        address,
        base_url="https://mempool.space/api",
        label="mempool",
        opener=opener,
    )


def _read_cookie_file(path: str | Path) -> tuple[str, str]:
    raw = Path(path).read_text(encoding="utf-8").strip()
    if ":" not in raw:
        raise ValueError("cookie file must be user:password")
    user, password = raw.split(":", 1)
    return user, password


def _is_loopback_host(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return host in ("127.0.0.1", "localhost", "::1", "0.0.0.0")


def make_json_rpc_call(
    *,
    rpc_url: str,
    rpc_user: str | None = None,
    rpc_password: str | None = None,
    rpc_cookie: str | None = None,
    opener: Callable = urlopen,
    timeout: float = 60.0,
) -> Callable[[str, list[Any]], Any]:
    """Return a callable(method, params) -> result that talks JSON-RPC to bitcoind."""

    user = rpc_user
    password = rpc_password
    if rpc_cookie:
        user, password = _read_cookie_file(rpc_cookie)

    def rpc_call(method: str, params: list[Any]) -> Any:
        body = json.dumps(
            {"jsonrpc": "1.0", "id": "bip39lab", "method": method, "params": params}
        ).encode("utf-8")
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "bip39lab-address-only/0.5",
        }
        if user is not None and password is not None:
            token = base64.b64encode(f"{user}:{password}".encode()).decode("ascii")
            headers["Authorization"] = f"Basic {token}"
        req = Request(rpc_url, data=body, headers=headers, method="POST")
        try:
            with opener(req, timeout=timeout) as resp:
                payload = json.loads(resp.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, OSError, json.JSONDecodeError) as e:
            raise RuntimeError(f"RPC transport failed: {e}") from e
        if not isinstance(payload, dict):
            raise TypeError("RPC response not an object")
        if payload.get("error"):
            err = payload["error"]
            raise RuntimeError(f"RPC error: {err}")
        return payload.get("result")

    return rpc_call


def fetch_bitcoind(
    address: str,
    *,
    rpc_call: Callable[[str, list[Any]], Any] | None = None,
    rpc_url: str | None = None,
    rpc_user: str | None = None,
    rpc_password: str | None = None,
    rpc_cookie: str | None = None,
    opener: Callable = urlopen,
) -> BalanceResult:
    """Query Bitcoin Core scantxoutset for current UTXO sum (address-only)."""
    try:
        call = rpc_call
        if call is None:
            url = rpc_url or os.environ.get("BIP39LAB_RPC_URL") or "http://127.0.0.1:8332"
            user = rpc_user if rpc_user is not None else os.environ.get("BIP39LAB_RPC_USER")
            password = (
                rpc_password
                if rpc_password is not None
                else os.environ.get("BIP39LAB_RPC_PASSWORD")
            )
            cookie = rpc_cookie if rpc_cookie is not None else os.environ.get("BIP39LAB_RPC_COOKIE")
            call = make_json_rpc_call(
                rpc_url=url,
                rpc_user=user,
                rpc_password=password,
                rpc_cookie=cookie,
                opener=opener,
            )
            detail_host = url
        else:
            detail_host = rpc_url or "injected"

        scan_obj = f"addr({address})"
        result = call("scantxoutset", ["start", [scan_obj]])
        if not isinstance(result, dict):
            return BalanceResult("unknown", None, "bitcoind: unexpected scantxoutset result")
        if "total_amount" not in result:
            return BalanceResult("unknown", None, "bitcoind: missing total_amount")
        sats = btc_to_satoshis(result["total_amount"])
        detail = "bitcoind"
        if isinstance(detail_host, str) and detail_host.startswith("http") and not _is_loopback_host(
            detail_host
        ):
            detail = "bitcoind (non-loopback RPC)"
        return BalanceResult("ok", sats, detail)
    except (TimeoutError, OSError, ValueError, TypeError, RuntimeError, KeyError) as e:
        return BalanceResult("unknown", None, f"bitcoind failed: {e}")


def get_address_balance(
    address: str,
    *,
    backend: str = "none",
    acknowledge_leak: bool = False,
    opener: Callable = urlopen,
    rpc_call: Callable[[str, list[Any]], Any] | None = None,
    rpc_url: str | None = None,
    rpc_user: str | None = None,
    rpc_password: str | None = None,
    rpc_cookie: str | None = None,
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

    if backend in ("blockstream", "mempool"):
        if not acknowledge_leak:
            return BalanceResult(
                "error",
                None,
                "refusing network: pass acknowledge_leak=True / --i-understand-address-leak",
            )
        if backend == "mempool":
            return fetch_mempool(address, opener=opener)
        return fetch_blockstream(address, opener=opener)

    if backend in ("bitcoind", "bitcoin-core"):
        return fetch_bitcoind(
            address,
            rpc_call=rpc_call,
            rpc_url=rpc_url,
            rpc_user=rpc_user,
            rpc_password=rpc_password,
            rpc_cookie=rpc_cookie,
            opener=opener,
        )

    return BalanceResult("error", None, f"unknown backend: {backend}")
