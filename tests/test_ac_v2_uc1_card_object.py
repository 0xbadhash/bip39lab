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
