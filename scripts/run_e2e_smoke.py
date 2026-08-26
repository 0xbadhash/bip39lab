#!/usr/bin/env python3
"""Free the Lab Playwright port, then run e2e with a hard wall clock.

Night readiness wraps product_smoke at 900s. A hung Chromium/http.server on
4173 used to sit until that outer kill (exit 124, no Playwright tail).
This script fails closed *before* that wall and kills the process group.
"""
from __future__ import annotations

import os
import signal
import socket
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PORT = 4173
# Leave headroom under night_shift default smoke_timeout=900s (unit + e2e).
WALL_S = int(os.environ.get("BIP39LAB_E2E_SMOKE_TIMEOUT", "720"))


def _port_held(port: int) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.settimeout(0.4)
        return s.connect_ex(("127.0.0.1", port)) == 0
    finally:
        s.close()


def free_port(port: int) -> None:
    if not _port_held(port):
        return
    subprocess.run(
        ["fuser", "-k", f"{port}/tcp"],
        check=False,
        capture_output=True,
        text=True,
    )
    for _ in range(20):
        if not _port_held(port):
            return
        time.sleep(0.1)


def main() -> int:
    os.chdir(ROOT)
    free_port(PORT)
    cmd = ["npx", "playwright", "test", "--reporter=line"]
    try:
        proc = subprocess.run(
            cmd,
            cwd=ROOT,
            timeout=WALL_S,
            check=False,
            start_new_session=True,
        )
        return int(proc.returncode)
    except subprocess.TimeoutExpired as exc:
        pid = getattr(exc, "pid", None) or getattr(getattr(exc, "process", None), "pid", None)
        if pid:
            try:
                os.killpg(pid, signal.SIGKILL)
            except OSError:
                pass
        free_port(PORT)
        print(
            f"❌ e2e smoke wall {WALL_S}s — killed hung Playwright/http.server "
            f"(was night product_smoke 900s/124)",
            file=sys.stderr,
        )
        return 124


if __name__ == "__main__":
    raise SystemExit(main())
