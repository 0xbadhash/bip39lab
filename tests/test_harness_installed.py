"""Smoke: harness install present; no secret-retention regression helpers required yet."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_ship_skills_manifest_present():
    ship = ROOT / ".agents" / "policy" / "ship_skills.txt"
    assert ship.is_file()
    skills = [
        line.strip()
        for line in ship.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]
    assert "spec" in skills
    assert "execute_dev" in skills
    for name in skills:
        assert (ROOT / ".agents" / "skills" / name / "SKILL.md").is_file(), name


def test_pipeline_init_phase():
    import json

    data = json.loads((ROOT / ".agents" / "state" / "pipeline.json").read_text(encoding="utf-8"))
    assert data.get("phase") in {
        "init",
        "ready_for_review",
        "approved",
        "blocked",
        "shipped",
    }


def test_product_plugin_requires_spec_policy():
    text = (ROOT / ".agents" / "product_plugin.yaml").read_text(encoding="utf-8")
    assert "bip39lab" in text
    assert "require_spec" in text or "full_fsm_per_roadmap_phase" in text


def test_agents_md_requires_full_fsm_with_spec():
    text = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
    assert "/spec" in text
    assert "Full FSM" in text or "full FSM" in text.lower()
