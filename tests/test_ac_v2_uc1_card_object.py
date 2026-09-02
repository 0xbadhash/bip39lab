"""AC for 2026-08-31-v2-uc1-card-object.md (Option A)."""
from __future__ import annotations

from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_ac_uc1_step1_card_object_not_entropy_stack() -> None:
    i = APP.find("async function uc1(step)")
    chunk = APP[i : APP.find("async function uc2(step)")]
    step1 = chunk[chunk.find("if (step === 1)") : chunk.find("if (step === 2)")]
    assert "v2CardWhat" in step1
    assert "I have looked at the numbered cells" in step1
    assert "entropyHtml" not in step1
    assert "entropyChipHtml" in step1
    assert "Do not photograph" in step1
    assert "checksum" in step1
    assert "Next: show receive addresses" in step1


def test_ac_uc1_step2_no_lock_or_entropy_meter() -> None:
    i = APP.find("async function uc1(step)")
    chunk = APP[i : APP.find("async function uc2(step)")]
    step2 = chunk[chunk.find("if (step === 2)") : chunk.find("if (step === 3)")]
    assert "entropyHtml" not in step2
    assert "v2Derive" in step2
    assert "v2DeriveHelp" in step2


def test_ac_uc3_step0_uses_uc1_entropy_cluster() -> None:
    i = APP.find("async function uc3(step)")
    chunk = APP[i : APP.find("async function uc4(step)")]
    step0 = chunk[: chunk.find("if (step === 1)")]
    assert "uc1EntropyAfterHtml" in step0
    assert "entropyHtml" not in step0
    assert 'id="v2Generate"' in step0
    step2 = chunk[chunk.find("if (step === 2)") :]
    assert "quizBank" in step2
    assert "Where should you store the extra secret" in step2
    assert "two vaults, not a PIN" in step2


def test_ac_drain_is_loss_not_freeze() -> None:
    assert "function drainToZero" in APP
    assert "bar.classList.add(\"is-loss\")" in APP
    assert "0.000 BTC stolen" in APP
    assert "That is freeze, not a drain" in APP


def test_ac_mint_pads_use_uc1_entropy_cluster() -> None:
    assert APP.count("uc1EntropyAfterHtml(") >= 6
    i = APP.find("<h2>Try another length</h2>")
    j = APP.find("if (step === 4)", i)
    try_len = APP[i:j]
    assert "entropyHtml" not in try_len
    assert "uc1EntropyAfterHtml" in try_len
