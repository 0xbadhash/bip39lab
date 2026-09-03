#!/usr/bin/env python3
"""Free Lab Playwright port, run night e2e subset, fail closed before night wall.

Night readiness wraps product_smoke (~900–1200s). A hung Chromium/http.server on
4173 used to sit until that outer kill (exit 124, no Playwright tail).

Pattern mirrors catalyxt-website scripts/night_e2e.sh:
  - always free :4173 (no reuse of a stale listener)
  - shorter night subset (plugin web_e2e lab smoke = S0–S0c)
  - hard wall + kill process group so the step never hangs the night

Full suite: BIP39LAB_E2E_FULL=1 (or pass extra playwright args after --).
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
# Headroom under product_plugin smoke e2e timeout (and night product_smoke wall).
WALL_S = int(os.environ.get("BIP39LAB_E2E_SMOKE_TIMEOUT", "240"))
# Plugin web_e2e lab scenarios.id=smoke → S0–S0c shell (do not invent new smoke).
NIGHT_GREP = os.environ.get(
    "BIP39LAB_E2E_NIGHT_GREP",
    r"S0 smoke load|S0b theme|S0c keyboard",
)


def _port_held(port: int) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.settimeout(0.4)
        return s.connect_ex(("127.0.0.1", port)) == 0
    finally:
        s.close()


def free_port(port: int) -> None:
    """Always free :port (catalyxt night_e2e style). Never reuse a foreign listener."""
    for _ in range(6):
        if not _port_held(port):
            print(f"[run_e2e_smoke] :{port} is free", file=sys.stderr)
            return
        subprocess.run(
            ["fuser", "-k", f"{port}/tcp"],
            check=False,
            capture_output=True,
            text=True,
        )
        try:
            out = subprocess.run(
                ["lsof", "-t", f"-iTCP:{port}", "-sTCP:LISTEN"],
                check=False,
                capture_output=True,
                text=True,
            )
            for pid_s in (out.stdout or "").split():
                try:
                    pid = int(pid_s.strip())
                except ValueError:
                    continue
                try:
                    os.kill(pid, signal.SIGTERM)
                except OSError:
                    pass
                time.sleep(0.15)
                try:
                    os.kill(pid, signal.SIGKILL)
                except OSError:
                    pass
        except FileNotFoundError:
            pass
        time.sleep(0.25)
    print(f"[run_e2e_smoke] WARN: :{port} still busy after kill loop", file=sys.stderr)


def _kill_group(pid: int) -> None:
    try:
        os.killpg(pid, signal.SIGKILL)
    except OSError:
        try:
            os.kill(pid, signal.SIGKILL)
        except OSError:
            pass


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    os.chdir(ROOT)
    print(f"[run_e2e_smoke] always free :{PORT} (no reuse)", file=sys.stderr)
    free_port(PORT)

    full = os.environ.get("BIP39LAB_E2E_FULL", "").strip().lower() in ("1", "true", "yes")
    cmd = ["npx", "playwright", "test", "--reporter=line"]
    if not full:
        # Shorter night subset — plugin evidence: web_e2e lab scenarios smoke S0–S0c
        cmd.extend(["--grep", NIGHT_GREP])
        print(f"[run_e2e_smoke] night subset grep={NIGHT_GREP!r} wall={WALL_S}s", file=sys.stderr)
    else:
        print(f"[run_e2e_smoke] FULL suite wall={WALL_S}s", file=sys.stderr)
    if argv:
        cmd.extend(argv)

    # Popen + poll so a stuck process group cannot block past WALL_S
    # (subprocess.run timeout can hang waiting for orphans).
    proc = subprocess.Popen(
        cmd,
        cwd=ROOT,
        start_new_session=True,
    )
    deadline = time.monotonic() + WALL_S
    try:
        while True:
            rc = proc.poll()
            if rc is not None:
                free_port(PORT)
                return int(rc)
            if time.monotonic() >= deadline:
                _kill_group(proc.pid)
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    _kill_group(proc.pid)
                free_port(PORT)
                print(
                    f"❌ e2e smoke wall {WALL_S}s — killed hung Playwright/http.server "
                    f"(fail-closed before night product_smoke wall)",
                    file=sys.stderr,
                )
                return 124
            time.sleep(0.5)
    except KeyboardInterrupt:
        _kill_group(proc.pid)
        free_port(PORT)
        raise


if __name__ == "__main__":
    raise SystemExit(main())
