# Rebuild offline web crypto bundle

Committed artifact: `js/bip39lab.bundle.js` (no CDN at runtime).

```bash
npm install --no-save esbuild @scure/bip39 @scure/bip32 @scure/base @noble/hashes @noble/curves
npx esbuild web/js/build-entry.mjs --bundle --format=iife --outfile=web/js/bip39lab.bundle.js
python -m pytest -q tests/test_web_vectors.py
```

Pin versions deliberately when shipping a release.
