/**
 * Browser IIFE entry: wraps npm slip39 for offline lab demos.
 * Bundled to web/js/slip39.bundle.js via esbuild.
 */
import slip39 from "../../node_modules/slip39/src/slip39.js";

function hexToBytes(hex) {
  const raw = String(hex || "")
    .trim()
    .toLowerCase()
    .replace(/^0x/, "");
  if (!raw) throw new Error("Master secret hex is empty.");
  if (raw.length % 2 !== 0 || /[^0-9a-f]/.test(raw)) {
    throw new Error("Master secret must be even-length hex.");
  }
  if (raw.length < 32) {
    throw new Error("Master secret must be at least 16 bytes (32 hex chars).");
  }
  const out = [];
  for (let i = 0; i < raw.length; i += 2) {
    out.push(parseInt(raw.slice(i, i + 2), 16));
  }
  return out;
}

function bytesToHex(bytes) {
  if (!bytes) return "";
  // slip39 recover returns number[] or Uint8Array-like
  if (typeof bytes.slip39DecodeHex === "function") {
    // encoded form with prototype helpers
  }
  const arr = Array.from(bytes);
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomMasterHex(byteLen) {
  const n = byteLen || 16;
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return bytesToHex(buf);
}

/**
 * Single-group M-of-N split. Returns mnemonic strings.
 */
function splitSingleGroup(masterHex, threshold, shareCount, passphrase) {
  const secret = hexToBytes(masterHex);
  if (threshold < 1 || shareCount < 1 || threshold > shareCount) {
    throw new Error("Need 1 ≤ threshold ≤ shareCount.");
  }
  const slip = slip39.fromArray(secret, {
    passphrase: passphrase || "",
    threshold: 1, // one group required
    groups: [[threshold, shareCount]],
  });
  const mnemonics = [];
  for (let i = 0; i < shareCount; i++) {
    const m = slip.fromPath("r/0/" + i).mnemonics;
    if (!m || !m[0]) throw new Error("Missing mnemonic at index " + i);
    mnemonics.push(m[0]);
  }
  return mnemonics;
}

function combineShares(mnemonics, passphrase) {
  const cleaned = (mnemonics || []).map((s) => String(s || "").trim()).filter(Boolean);
  if (!cleaned.length) throw new Error("No share mnemonics provided.");
  const recovered = slip39.recoverSecret(cleaned, passphrase || "");
  return bytesToHex(recovered);
}

function matchExpected(recoveredHex, expectedHex) {
  const a = String(recoveredHex || "")
    .trim()
    .toLowerCase()
    .replace(/^0x/, "");
  const b = String(expectedHex || "")
    .trim()
    .toLowerCase()
    .replace(/^0x/, "");
  if (a.length !== b.length || !a.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const api = {
  splitSingleGroup,
  combineShares,
  matchExpected,
  randomMasterHex,
  hexToBytes,
  bytesToHex,
  PRESETS: { "2of3": { m: 2, n: 3 }, "3of5": { m: 3, n: 5 } },
};

if (typeof globalThis !== "undefined") {
  globalThis.Slip39Lab = api;
}

export default api;
