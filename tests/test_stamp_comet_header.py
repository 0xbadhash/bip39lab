"""Comet header must be stampable from VERSION + Playwright S-ids (no manual lag)."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_multisig_checklist_has_bip67_help_tip():
    html = (ROOT / "web/multisig.html").read_text(encoding="utf-8")
    assert "BIP67 sort agreed" in html
    # tip lives in the checklist, not only on the Build checkbox
    assert re.search(
        r"BIP67 sort agreed[\s\S]{0,400}?data-term=\"BIP67\"",
        html,
    )


def test_stamp_comet_header_updates_product_and_range():
    r = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "stamp_comet_header.py"), "--root", str(ROOT)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert r.returncode == 0, r.stderr + r.stdout
    comet = (ROOT / "docs" / "E2E_COMET_SCENARIOS.md").read_text(encoding="utf-8")
    ver = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    assert f"Product: {ver}" in comet
    assert "Scenarios: S" in comet
    assert "S70" in comet or "S69" in comet  # current max learning path
    assert re.search(r"(?m)^scenarios:\s*S0–", comet)
    assert "auto-stamped" in comet
    assert "Comet/Perplexity score sheet" in comet
    # Range must include S70 when that test exists
    learn = (ROOT / "e2e" / "learn.spec.ts").read_text(encoding="utf-8")
    if "S70" in learn:
        assert "S70" in comet


def test_stamp_site_version_invokes_comet_stamp():
    src = (ROOT / "scripts" / "stamp_site_version.py").read_text(encoding="utf-8")
    assert "stamp_comet_header" in src
    assert "stamp_comet_doc" in src
    assert "PLAYWRIGHT_LAST.md" in src
    assert 'web" / "VERSION' in src or "web/VERSION" in src


def test_http_version_and_playwright_last_match_sot():
    ver = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    web_ver = (ROOT / "web" / "VERSION").read_text(encoding="utf-8").strip()
    last = (ROOT / "web" / "PLAYWRIGHT_LAST.md").read_text(encoding="utf-8")
    assert web_ver == ver
    assert f"product: {ver}" in last
    assert f"=== {ver}" in last or f"=== {ver}\n" in last
