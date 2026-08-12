#!/usr/bin/env python3
"""CLI: educational Knots seed UTXO scan (hash-only).

Example:
  PYTHONPATH=src python3 scripts/seed_scan_educational.py \\
    --rpc-cookie /tmp/knots.cookie --target 2000 --preflight-only

Never prints mnemonics. Writes only sha256 hex lines under .local/seed_scan/.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

from bip39lab.balance import make_json_rpc_call  # noqa: E402
from bip39lab.seed_scan import (  # noqa: E402
    SeedScanError,
    public_report_json,
    run_campaign,
)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--hash-file",
        type=Path,
        default=ROOT / ".local" / "seed_scan" / "tested_mnemonic_sha256.txt",
    )
    ap.add_argument("--target", type=int, default=2000)
    ap.add_argument("--max-new", type=int, default=None, help="Stop after N new hashes this run")
    ap.add_argument("--rpc-url", default=os.environ.get("BIP39LAB_RPC_URL", "http://127.0.0.1:8332"))
    ap.add_argument("--rpc-cookie", default=os.environ.get("BIP39LAB_RPC_COOKIE", "/tmp/knots.cookie"))
    ap.add_argument("--allow-ibd", action="store_true", help="Experimental: scan while IBD")
    ap.add_argument("--preflight-only", action="store_true")
    ap.add_argument("--timeout", type=float, default=120.0, help="RPC timeout seconds")
    ap.add_argument(
        "--report",
        type=Path,
        default=ROOT / ".local" / "seed_scan" / "last_run_summary.json",
        help="Write public summary JSON (no secrets)",
    )
    args = ap.parse_args(argv)

    rpc = make_json_rpc_call(
        rpc_url=args.rpc_url,
        rpc_cookie=args.rpc_cookie,
        timeout=args.timeout,
    )

    if args.preflight_only:
        from bip39lab.seed_scan import preflight_rpc

        try:
            info = preflight_rpc(rpc, allow_ibd=args.allow_ibd)
        except SeedScanError as e:
            print(f"PREFLIGHT FAIL: {e}", file=sys.stderr)
            return 2
        print(
            "PREFLIGHT OK",
            f"blocks={info.get('blocks')}",
            f"headers={info.get('headers')}",
            f"ibd={info.get('initialblockdownload')}",
            f"progress={info.get('verificationprogress')}",
        )
        return 0

    try:
        summary = run_campaign(
            hash_path=args.hash_file,
            target=args.target,
            rpc_call=rpc,
            allow_ibd=args.allow_ibd,
            max_new=args.max_new,
        )
    except SeedScanError as e:
        print(f"SCAN ABORT: {e}", file=sys.stderr)
        return 2

    report = public_report_json(summary)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(report, encoding="utf-8")
    # stdout is the public summary only
    sys.stdout.write(report)
    return 0 if summary.rpc_errors == 0 or summary.hash_file_lines >= summary.target else 1


if __name__ == "__main__":
    raise SystemExit(main())
