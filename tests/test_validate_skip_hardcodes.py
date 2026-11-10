"""Night shift calls validate.py with --skip-hardcodes (hardcodes is its own gate)."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_validate_help_lists_skip_hardcodes() -> None:
    proc = subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "validate.py"), "--help"],
        capture_output=True,
        text=True,
        check=False,
    )
    assert proc.returncode == 0
    assert "--skip-hardcodes" in proc.stdout


def test_skip_hardcodes_omits_hardcode_gate(monkeypatch) -> None:  # noqa: ANN001
    """Argparse must accept the flag and skip only the hardcodes section."""
    sys.path.insert(0, str(ROOT / "scripts"))
    import validate  # noqa: E402

    calls: list[str] = []

    def fake_run(cmd, label):  # noqa: ANN001
        calls.append(label)
        return 0

    monkeypatch.setattr(validate, "_run", fake_run)
    monkeypatch.setattr(validate, "_dev_log_contract_gate", lambda: 0)
    monkeypatch.setattr(validate, "_vault_schema_lint_gate", lambda: 0)
    monkeypatch.setattr(sys, "argv", ["validate.py", "hygiene", "--skip-hardcodes"])
    assert validate.main() == 0
    assert "check_hardcodes" not in calls
    assert "check_repo_hygiene" in calls


def test_default_hygiene_still_runs_hardcodes(monkeypatch) -> None:  # noqa: ANN001
    sys.path.insert(0, str(ROOT / "scripts"))
    import validate  # noqa: E402

    calls: list[str] = []

    def fake_run(cmd, label):  # noqa: ANN001
        calls.append(label)
        return 0

    monkeypatch.setattr(validate, "_run", fake_run)
    monkeypatch.setattr(validate, "_dev_log_contract_gate", lambda: 0)
    monkeypatch.setattr(validate, "_vault_schema_lint_gate", lambda: 0)
    monkeypatch.setattr(sys, "argv", ["validate.py", "hygiene"])
    assert validate.main() == 0
    assert "check_hardcodes" in calls
