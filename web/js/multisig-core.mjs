/**
 * Offline educational multisig helpers (public keys only).
 * P2SH + P2WSH bare M-of-N CHECKMULTISIG.
 * Optional: generate demo cosigners (throwaway seeds → compressed pubkeys).
 */
import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { HDKey } from "@scure/bip32";

const OP_0 = 0x00;
const OP_CHECKMULTISIG = 0xae;

function opN(n) {
  if (n < 1 || n > 16) throw new Error("M and N must be between 1 and 16");
  return 0x50 + n;
}

function hash160(data) {
  return ripemd160(sha256(data));
}

function hexToBytes(hex) {
  const h = hex.trim().toLowerCase().replace(/^0x/, "");
  if (h.length % 2) throw new Error("odd hex length");
  if (!/^[0-9a-f]*$/.test(h)) throw new Error("invalid hex");
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function bytesToHex(b) {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function looksPrivate(s) {
  const t = s.trim();
  if (/^(xprv|yprv|zprv|tprv)/i.test(t)) return true;
  if (/^[5KL][1-9A-HJ-NP-Za-km-z]{50,}$/.test(t)) return true; // WIF-ish
  if (/^c[1-9A-HJ-NP-Za-km-z]{50,}$/.test(t)) return true; // testnet WIF-ish
  return false;
}

/** Compressed secp256k1 pubkey: 33 bytes, 02/03 prefix. */
function parseCompressedPubkey(hex) {
  const raw = hexToBytes(hex);
  if (raw.length !== 33) throw new Error("pubkey must be 33-byte compressed (66 hex chars)");
  if (raw[0] !== 0x02 && raw[0] !== 0x03) throw new Error("pubkey must start with 02 or 03");
  return raw;
}

function pushData(buf) {
  if (buf.length < 0x4c) {
    const out = new Uint8Array(1 + buf.length);
    out[0] = buf.length;
    out.set(buf, 1);
    return out;
  }
  throw new Error("push too large");
}

function concatBytes(arrays) {
  const n = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(n);
  let o = 0;
  for (const a of arrays) {
    out.set(a, o);
    o += a.length;
  }
  return out;
}

/** BIP67: sort pubkeys as raw bytes lexicographically. */
function sortPubkeysBIP67(pubs) {
  return pubs.slice().sort((a, b) => {
    const ha = bytesToHex(a);
    const hb = bytesToHex(b);
    return ha < hb ? -1 : ha > hb ? 1 : 0;
  });
}

/**
 * Bare multisig script: OP_M <pub>… OP_N OP_CHECKMULTISIG
 */
function buildMultisigScript(m, pubkeys) {
  if (m < 1 || m > pubkeys.length) throw new Error("M must be between 1 and number of keys");
  if (pubkeys.length < 1 || pubkeys.length > 16) throw new Error("N must be between 1 and 16");
  const parts = [new Uint8Array([opN(m)])];
  for (const p of pubkeys) parts.push(pushData(p));
  parts.push(new Uint8Array([opN(pubkeys.length), OP_CHECKMULTISIG]));
  return concatBytes(parts);
}

function base58check(payload) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const checksum = sha256(sha256(payload)).slice(0, 4);
  const data = new Uint8Array(payload.length + 4);
  data.set(payload);
  data.set(checksum, payload.length);
  let n = 0n;
  for (const b of data) n = (n << 8n) + BigInt(b);
  let res = "";
  while (n > 0n) {
    res = alphabet[Number(n % 58n)] + res;
    n /= 58n;
  }
  for (const b of data) {
    if (b === 0) res = "1" + res;
    else break;
  }
  return res;
}

function p2shAddress(script) {
  const h = hash160(script);
  const payload = new Uint8Array(21);
  payload[0] = 0x05;
  payload.set(h, 1);
  return base58check(payload);
}

function convertbits(data, frombits, tobits, pad) {
  let acc = 0,
    bits = 0;
  const ret = [];
  const maxv = (1 << tobits) - 1;
  for (const value of data) {
    acc = (acc << frombits) | value;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad && bits) ret.push((acc << (tobits - bits)) & maxv);
  return ret;
}

function bech32Polymod(values) {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const b = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((b >> i) & 1) chk ^= GEN[i];
  }
  return chk;
}

function bech32Encode(hrp, data) {
  const hrpExpand = [...hrp]
    .map((c) => c.charCodeAt(0) >> 5)
    .concat([0], [...hrp].map((c) => c.charCodeAt(0) & 31));
  const polymod = bech32Polymod(hrpExpand.concat(data).concat([0, 0, 0, 0, 0, 0])) ^ 1;
  const checksum = [];
  for (let i = 0; i < 6; i++) checksum.push((polymod >> (5 * (5 - i))) & 31);
  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  return hrp + "1" + data.concat(checksum).map((d) => charset[d]).join("");
}

function p2wshAddress(script) {
  const prog = sha256(script);
  const data = [0].concat(convertbits(prog, 8, 5, true));
  return bech32Encode("bc", data);
}

/**
 * @param {string} partsText - newlines/commas/spaces separated hex pubs
 * @param {number} m
 * @param {{ bip67?: boolean }} options
 */
export function buildMultisigFromText(partsText, m, options) {
  const bip67 = !options || options.bip67 !== false;
  const rawParts = partsText
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (!rawParts.length) throw new Error("enter at least one compressed public key (hex)");

  for (const p of rawParts) {
    if (looksPrivate(p)) {
      throw new Error("private keys / xprv / WIF are not accepted — public keys only (safety)");
    }
  }

  let pubs = rawParts.map(parseCompressedPubkey);
  const n = pubs.length;
  const mNum = Number(m);
  if (!Number.isFinite(mNum) || mNum < 1 || mNum > n) {
    throw new Error("M must be between 1 and N (number of keys)");
  }

  const orderNote = bip67
    ? "Keys sorted lexicographically (BIP67) — recommended so everyone builds the same address."
    : "Keys kept in the order you entered — every cosigner must use the same order.";

  if (bip67) pubs = sortPubkeysBIP67(pubs);

  const script = buildMultisigScript(mNum, pubs);
  const scriptHex = bytesToHex(script);
  const p2sh = p2shAddress(script);
  const p2wsh = p2wshAddress(script);

  return {
    m: mNum,
    n,
    bip67,
    orderNote,
    pubkeysHex: pubs.map(bytesToHex),
    scriptHex,
    p2sh,
    p2wsh,
    summary:
      mNum +
      "-of-" +
      n +
      " multisig · " +
      (bip67 ? "BIP67 sorted" : "custom order") +
      " · offline",
  };
}

const WORD_STRENGTH = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 };

/** SLIP-132 mainnet public version bytes for BIP84 native-segwit account keys (zpub). */
const ZPUB_VERSION = [0x04, 0xb2, 0x47, 0x46];

function b58decode(s) {
  const ALPH = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let n = 0n;
  for (const c of s) {
    const i = ALPH.indexOf(c);
    if (i < 0) throw new Error("invalid base58");
    n = n * 58n + BigInt(i);
  }
  let hex = n.toString(16);
  if (hex.length % 2) hex = "0" + hex;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  let leading = 0;
  for (const c of s) {
    if (c === "1") leading++;
    else break;
  }
  const out = new Uint8Array(leading + bytes.length);
  out.set(bytes, leading);
  return out;
}

function b58encode(bytes) {
  const ALPH = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let n = 0n;
  for (const b of bytes) n = (n << 8n) + BigInt(b);
  let res = "";
  while (n > 0n) {
    res = ALPH[Number(n % 58n)] + res;
    n /= 58n;
  }
  for (const b of bytes) {
    if (b === 0) res = "1" + res;
    else break;
  }
  return res || "1";
}

function b58checkDecode(s) {
  const raw = b58decode(s);
  const data = raw.slice(0, -4);
  const chk = raw.slice(-4);
  const h = sha256(sha256(data));
  if (h[0] !== chk[0] || h[1] !== chk[1] || h[2] !== chk[2] || h[3] !== chk[3]) {
    throw new Error("base58check checksum");
  }
  return data;
}

function b58checkEncode(data) {
  const h = sha256(sha256(data));
  const out = new Uint8Array(data.length + 4);
  out.set(data);
  out.set(h.slice(0, 4), data.length);
  return b58encode(out);
}

/** Convert BIP32 xpub → SLIP-132 BIP84 zpub (account-level native segwit). */
function xpubToZpub(xpub) {
  const data = b58checkDecode(xpub);
  data[0] = ZPUB_VERSION[0];
  data[1] = ZPUB_VERSION[1];
  data[2] = ZPUB_VERSION[2];
  data[3] = ZPUB_VERSION[3];
  return b58checkEncode(data);
}

/**
 * Generate N throwaway cosigners for education only.
 *
 * Each cosigner uses BIP84 native segwit derivation (not BIP44/86):
 * - Account zpub: m/84'/0'/0'  (SLIP-132 zpub — “BIP84 zpub”, not a raw BIP32 xpub label)
 * - Script pubkey: m/84'/0'/0'/0/0 compressed key (for simple M-of-N CHECKMULTISIG demos)
 *
 * WARNING: demo only — never fund these mnemonics for real money.
 *
 * @param {number} n cosigner count 2–7
 * @param {{ words?: number, passphrase?: string }} [options]
 */
export function generateDemoCosigners(n, options) {
  const count = Math.max(2, Math.min(7, Math.floor(Number(n) || 3)));
  const words = (options && options.words) || 12;
  const strength = WORD_STRENGTH[words];
  if (!strength) throw new Error("word count must be 12, 15, 18, 21, or 24");
  const passphrase = (options && options.passphrase) || "";

  const accountPath = "m/84'/0'/0'"; // BIP84 account
  const keyPath = "m/84'/0'/0'/0/0"; // BIP84 first receive (for script pubkey demo)
  const cosigners = [];

  for (let i = 0; i < count; i++) {
    const mnemonic = generateMnemonic(wordlist, strength);
    const seed = mnemonicToSeedSync(mnemonic, passphrase);
    const root = HDKey.fromMasterSeed(seed);
    const account = root.derive(accountPath);
    const child = root.derive(keyPath);
    const pub = child.publicKey;
    if (!pub || pub.length !== 33) throw new Error("failed to derive public key");
    const xpubStd = account.publicExtendedKey;
    const zpub = xpubToZpub(xpubStd);
    cosigners.push({
      label: "Cosigner " + String.fromCharCode(65 + i), // A, B, C…
      mnemonic,
      words,
      entropyBits: strength,
      passphraseUsed: passphrase.length > 0,
      /** BIP84 account-level zpub (SLIP-132) — this is the “BIP84 xpub-style” watch key */
      bip84Zpub: zpub,
      bip84AccountPath: accountPath,
      /** Compressed pubkey at BIP84 receive index 0 — used to build the educational multisig script */
      pubkeyHex: bytesToHex(pub),
      pubkeyPath: keyPath,
    });
  }
  return {
    scheme: "BIP84 native segwit",
    accountPath,
    keyPath,
    words,
    entropyBits: strength,
    cosigners,
    /** Multisig builder still needs compressed pubkeys, one per line */
    pubkeysText: cosigners.map((c) => c.pubkeyHex).join("\n"),
    /** Optional: copy-paste zpubs for HD multisig wallets (not used by bare script builder) */
    zpubsText: cosigners.map((c) => c.bip84Zpub).join("\n"),
    warning:
      "DEMO ONLY — BIP84 throwaway seeds generated in this browser. Do not send real bitcoin. " +
      "Each card shows BIP39 words, ENT bits, BIP84 zpub (account m/84'/0'/0'), and the compressed " +
      "pubkey at m/84'/0'/0'/0/0 used to build this page’s simple M-of-N address.",
  };
}

export const MultisigLab = {
  buildMultisigFromText,
  generateDemoCosigners,
  looksPrivate,
  WORD_STRENGTH,
  VERSION: "0.9.2-ms",
};

const g = typeof globalThis !== "undefined" ? globalThis : undefined;
if (g) g.MultisigLab = MultisigLab;

export default MultisigLab;
