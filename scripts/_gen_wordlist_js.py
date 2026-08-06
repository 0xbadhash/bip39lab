import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
words = (root / "src/bip39lab/data/english.txt").read_text(encoding="utf-8").split()
body = (
    "// vendored BIP-39 English\n"
    "(function (g) { g.BIP39_ENGLISH = "
    + json.dumps(words)
    + "; })(typeof globalThis !== 'undefined' ? globalThis : window);\n"
)
out = root / "web/js/wordlist.js"
out.write_text(body, encoding="utf-8")
print(f"wrote {out} words={len(words)}")
