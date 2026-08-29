"""AC for 2026-08-29-v2-uc1-uc7-classroom.md."""
from __future__ import annotations

from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_ac_1_uc1_one_bip39_box_and_entropy() -> None:
    i = APP.find("async function uc1(step)")
    chunk = APP[i : APP.find("async function uc2(step)")]
    assert "v2Bip39What" in chunk
    assert "v2Uc1Teach" not in chunk
    assert "v2Bip39Spec" in chunk
    assert "v2EntropyWhat" in APP
    assert "bip-0039.mediawiki" in chunk


def test_ac_2_paste_checksum_copy() -> None:
    assert "failed the BIP-39 check" in APP
    assert "Need 12, 15, 18, 21, or 24 words" in APP


def test_ac_3_shamir_skips_bad_lines() -> None:
    assert "skipped.push" in APP
    assert "Need at least " in APP


def test_ac_4_uc16_and_xor() -> None:
    i = APP.find("async function uc16")
    chunk = APP[i : APP.find("function uc17")]
    assert chunk.find("wordCountSelectHtml()") < chunk.find('id="v2Generate"')
    assert "function restoreWordCount" in APP
    assert 'id="v2XorMake12"' in APP
