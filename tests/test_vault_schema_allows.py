"""Vault schema must allow challenge notes and the standing project INDEX.md."""
from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _load():
    path = ROOT / "scripts" / "vault_schema_lint.py"
    spec = importlib.util.spec_from_file_location("bip39lab_vault_schema_lint", path)
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_project_allow_includes_challenges_and_index():
    mod = _load()
    assert "challenges" in mod.PROJECT_DIR_ALLOW
    assert "INDEX.md" in mod.PROJECT_FILE_ALLOW
    herm = mod.SPECIAL_PROJECTS.get("herm-config")
    if herm is not None:
        assert "INDEX.md" in herm
