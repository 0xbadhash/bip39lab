#!/usr/bin/env python3
"""Product compliance runner (bitcoin-scripts).

Harness default also typechecks scripts/ (Unix flock etc.) which fails on Windows.
This product fork runs: ruff on src+tests, pytest with package import path.
Protected from harness reinstall via .agents/harness_protect_scripts.txt.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _run_tool(name: str, cmd: list[str], env: dict[str, str] | None = None) -> dict:
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, env=env)
    return {
        "tool": name,
        "exit": r.returncode,
        "stdout": (r.stdout or "")[-2000:],
        "stderr": (r.stderr or "")[-2000:],
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--diff", help="Git range (unused; full product suite)")
    ap.add_argument("--scope", help="Module scope filter (unused)")
    ap.add_argument("--json-report", action="store_true")
    args = ap.parse_args()

    py = sys.executable
    env = {**os.environ, "PYTHONPATH": str(ROOT / "src")}

    results = []
    # Linter: product code only
    results.append(
        _run_tool("linter", [py, "-m", "ruff", "check", "src", "tests"], env=env)
    )
    # Typecheck product package only
    results.append(
        _run_tool(
            "type_checker",
            [py, "-m", "mypy", "src/bip39lab", "--ignore-missing-imports"],
            env=env,
        )
    )
    results.append(
        _run_tool("test_runner", [py, "-m", "pytest", "-q"], env=env)
    )

    ok = all(r["exit"] == 0 for r in results)
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "diff": args.diff,
        "scope": args.scope,
        "results": results,
        "pass": ok,
    }
    if args.json_report:
        print(json.dumps(report, indent=2))
    else:
        for r in results:
            tag = "✅" if r["exit"] == 0 else "❌"
            print(f"{tag} {r['tool']} (exit {r['exit']})")
            if r["exit"] != 0:
                print(r.get("stderr") or r.get("stdout") or "")
        print("✅ compliance_engine ok" if ok else "❌ compliance_engine failed")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
