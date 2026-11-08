"""Challenge helper paths stay portable: env and home-relative roots, no host paths."""
from __future__ import annotations

import importlib.util
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


def _load():
    path = ROOT / "scripts" / "challenge.py"
    spec = importlib.util.spec_from_file_location("bip39lab_challenge", path)
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def test_challenge_source_has_no_absolute_home_or_literal_deepseek_url():
    text = (ROOT / "scripts" / "challenge.py").read_text(encoding="utf-8")
    assert "/home/" not in text
    assert "https://api.deepseek.com" not in text


_KEY = "CHALLENGE_TEST_ONLY_KEY"


def test_env_key_reads_hermes_env_file(tmp_path, monkeypatch):
    mod = _load()
    env_file = tmp_path / "hermes.env"
    env_file.write_text(f'{_KEY}="from-file"\n', encoding="utf-8")
    monkeypatch.delenv(_KEY, raising=False)
    monkeypatch.setenv("HERMES_ENV", str(env_file))
    monkeypatch.setenv("HERMES_ROOT", str(tmp_path / "unused-root"))
    assert mod._env_key(_KEY) == "from-file"


def test_env_key_reads_hermes_root_dotenv_before_home(tmp_path, monkeypatch):
    mod = _load()
    hermes = tmp_path / "hermes"
    hermes.mkdir()
    (hermes / ".env").write_text(f"{_KEY}=from-root\n", encoding="utf-8")
    home = tmp_path / "home"
    home.mkdir()
    (home / ".env").write_text(f"{_KEY}=from-home\n", encoding="utf-8")
    monkeypatch.delenv(_KEY, raising=False)
    monkeypatch.delenv("HERMES_ENV", raising=False)
    monkeypatch.setenv("HERMES_ROOT", str(hermes))
    monkeypatch.setattr(mod.Path, "home", lambda: home)
    assert mod._env_key(_KEY) == "from-root"


def test_ask_glm_script_uses_env_then_hermes_root(tmp_path, monkeypatch):
    mod = _load()
    script = tmp_path / "ask_glm.py"
    script.write_text("# stub\n", encoding="utf-8")
    monkeypatch.setenv("ASK_GLM_SCRIPT", str(script))
    assert mod._ask_glm_script() == script

    monkeypatch.delenv("ASK_GLM_SCRIPT", raising=False)
    monkeypatch.setenv("HERMES_ROOT", str(tmp_path))
    assert mod._ask_glm_script() == tmp_path / "scripts" / "ask_glm.py"


def test_deepseek_endpoint_default_and_override(monkeypatch):
    mod = _load()
    monkeypatch.delenv("CHALLENGE_DEEPSEEK_URL", raising=False)
    monkeypatch.setenv("CHALLENGE_DEEPSEEK_HOST", "")
    assert mod._deepseek_endpoint() == "https://api.deepseek.com/chat/completions"
    monkeypatch.setenv("CHALLENGE_DEEPSEEK_URL", "https://example.com/v1/chat")
    assert mod._deepseek_endpoint() == "https://example.com/v1/chat"


def test_missing_key_raises_without_using_host_path(tmp_path, monkeypatch):
    mod = _load()
    home = tmp_path / "home"
    home.mkdir()
    monkeypatch.delenv(_KEY, raising=False)
    monkeypatch.setenv("HERMES_ENV", str(tmp_path / "missing.env"))
    monkeypatch.setenv("HERMES_ROOT", str(tmp_path / "hermes"))
    (tmp_path / "hermes").mkdir()
    monkeypatch.setattr(mod.Path, "home", lambda: home)
    with pytest.raises(mod.ModelError, match=f"{_KEY} not found"):
        mod._env_key(_KEY)
