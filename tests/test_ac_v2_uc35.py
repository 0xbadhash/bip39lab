"""AC anchors for UC35 plain English (spec 2026-09-02-v2-uc35-plain-english)."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "web" / "v2" / "js" / "v2-app.js").read_text(encoding="utf-8")
SVG = ROOT / "web" / "v2" / "assets" / "uc35-atom-same-words-two-apps.svg"


def test_ac_1_plain_english_title_and_classroom() -> None:
    assert "Same words, wrong app" in APP
    assert "Electrum-looking words" not in APP
    assert "what this exercise is about" in APP.lower()
    assert "different recipe" in APP
    assert "different wallet" in APP


def test_ac_2_image_left_of_blue_box() -> None:
    assert SVG.is_file()
    face = ROOT / "web" / "v2" / "assets" / "uc35-face-two-apps.svg"
    assert face.is_file() or "uc35-atom-same-words-two-apps.svg" in APP
    assert "uc35-face-two-apps.svg" in APP or "uc35-atom-same-words-two-apps.svg" in APP
    assert "faceClusterHtml" in APP or "v2-uc1-after v2-face-after" in APP
    assert '"v2ElTeach"' in APP


def test_ac_3_e2e_trap_copy() -> None:
    assert "wrong vault" in APP
    assert "does not run Electrum" in APP
    spec = (ROOT / "e2e" / "v2.spec.ts").read_text(encoding="utf-8")
    assert "V2-S26" in spec
    assert "v2ElBip39" in spec
