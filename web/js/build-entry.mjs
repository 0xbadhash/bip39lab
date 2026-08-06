import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { HDKey } from "@scure/bip32";
import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { secp256k1, schnorr } from "@noble/curves/secp256k1.js";
import QRCode from "qrcode";

function hash160(data) {
  return ripemd160(sha256(data));
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

/** @param {'bech32'|'bech32m'} encoding */
function bech32Encode(hrp, data, encoding = "bech32") {
  const constXor = encoding === "bech32m" ? 0x2bc830a3 : 1;
  const hrpExpand = [...hrp]
    .map((c) => c.charCodeAt(0) >> 5)
    .concat([0], [...hrp].map((c) => c.charCodeAt(0) & 31));
  const polymod = bech32Polymod(hrpExpand.concat(data).concat([0, 0, 0, 0, 0, 0])) ^ constXor;
  const checksum = [];
  for (let i = 0; i < 6; i++) checksum.push((polymod >> (5 * (5 - i))) & 31);
  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  return hrp + "1" + data.concat(checksum).map((d) => charset[d]).join("");
}

function bytesToHex(b) {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function compressedPub(privBytes) {
  return secp256k1.getPublicKey(privBytes, true);
}

function p2pkh(privBytes) {
  const h = hash160(compressedPub(privBytes));
  const payload = new Uint8Array(21);
  payload[0] = 0x00;
  payload.set(h, 1);
  return base58check(payload);
}

function p2shP2wpkh(privBytes) {
  const h = hash160(compressedPub(privBytes));
  const redeem = new Uint8Array(22);
  redeem[0] = 0x00;
  redeem[1] = 0x14;
  redeem.set(h, 2);
  const rh = hash160(redeem);
  const payload = new Uint8Array(21);
  payload[0] = 0x05;
  payload.set(rh, 1);
  return base58check(payload);
}

function p2wpkh(privBytes) {
  const h = hash160(compressedPub(privBytes));
  const data = [0].concat(convertbits(h, 8, 5, true));
  return bech32Encode("bc", data, "bech32");
}

/** BIP86 key-path only Taproot (P2TR) address. */
function p2tr(privBytes) {
  const xonly = schnorr.getPublicKey(privBytes);
  const x = BigInt("0x" + bytesToHex(xonly));
  const P = schnorr.utils.lift_x(x);
  const tweak = schnorr.utils.taggedHash("TapTweak", xonly);
  const t = BigInt("0x" + bytesToHex(tweak));
  const Q = P.add(secp256k1.Point.BASE.multiply(t));
  const out = schnorr.utils.pointToBytes(Q);
  const data = [1].concat(convertbits(out, 8, 5, true));
  return bech32Encode("bc", data, "bech32m");
}

/**
 * @param {string} mnemonic
 * @param {string} [passphrase]
 * @param {{ count?: number, account?: number, change?: number }} [options]
 */
function deriveAddresses(mnemonic, passphrase, options) {
  if (!validateMnemonic(mnemonic, wordlist)) throw new Error("invalid mnemonic");
  const seed = mnemonicToSeedSync(mnemonic, passphrase || "");
  const root = HDKey.fromMasterSeed(seed);
  const account = Math.max(0, Math.floor(Number((options && options.account) || 0)));
  const change = Number((options && options.change) || 0) === 1 ? 1 : 0;
  let count = (options && options.count) != null ? options.count : 1;
  count = Math.max(1, Math.min(Number(count) || 1, 20));

  const rows = [];
  for (let i = 0; i < count; i++) {
    const k44 = root.derive(`m/44'/0'/${account}'/${change}/${i}`);
    const k49 = root.derive(`m/49'/0'/${account}'/${change}/${i}`);
    const k84 = root.derive(`m/84'/0'/${account}'/${change}/${i}`);
    const k86 = root.derive(`m/86'/0'/${account}'/${change}/${i}`);
    rows.push({
      index: i,
      bip86_p2tr: p2tr(k86.privateKey),
      bip84_p2wpkh: p2wpkh(k84.privateKey),
      bip49_p2sh_p2wpkh: p2shP2wpkh(k49.privateKey),
      bip44_p2pkh: p2pkh(k44.privateKey),
    });
  }
  return {
    rows,
    account,
    change,
    bip86_p2tr: rows[0].bip86_p2tr,
    bip84_p2wpkh: rows[0].bip84_p2wpkh,
    bip49_p2sh_p2wpkh: rows[0].bip49_p2sh_p2wpkh,
    bip44_p2pkh: rows[0].bip44_p2pkh,
  };
}

function generate(wordCount) {
  const strength = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 }[wordCount] || 128;
  return generateMnemonic(wordlist, strength);
}

function validate(m) {
  return validateMnemonic(m, wordlist);
}

/** Base58 alphabet decode → bytes (includes leading zero pad for '1's). */
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
  if (raw.length < 5) throw new Error("invalid base58check");
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

/** SLIP-132 version bytes (mainnet public). */
const SLIP132 = {
  xpub: [0x04, 0x88, 0xb2, 0x1e],
  ypub: [0x04, 0x9d, 0x7c, 0xb2],
  zpub: [0x04, 0xb2, 0x47, 0x46],
};

function toVersionedXpub(xpub, versionKey) {
  const data = b58checkDecode(xpub);
  if (data.length < 4) throw new Error("xpub too short");
  const ver = SLIP132[versionKey] || SLIP132.xpub;
  data[0] = ver[0];
  data[1] = ver[1];
  data[2] = ver[2];
  data[3] = ver[3];
  return b58checkEncode(data);
}

/**
 * Account-level watch-only public keys only (never returns xprv).
 * @returns {{ account: number, keys: Array<{purpose,path,label,key,note}> }}
 */
function exportWatchOnly(mnemonic, passphrase, options) {
  if (!validateMnemonic(mnemonic, wordlist)) throw new Error("invalid mnemonic");
  const seed = mnemonicToSeedSync(mnemonic, passphrase || "");
  const root = HDKey.fromMasterSeed(seed);
  const account = Math.max(0, Math.floor(Number((options && options.account) || 0)));

  const specs = [
    {
      purpose: 86,
      path: `m/86'/0'/${account}'`,
      label: "BIP86 Taproot (xpub)",
      version: "xpub",
      note: "Standard BIP32 xpub at account path — import as watch-only where supported.",
    },
    {
      purpose: 84,
      path: `m/84'/0'/${account}'`,
      label: "BIP84 native segwit (zpub)",
      version: "zpub",
      note: "SLIP-132 zpub for Sparrow / many mobile wallets (P2WPKH).",
    },
    {
      purpose: 49,
      path: `m/49'/0'/${account}'`,
      label: "BIP49 nested (ypub)",
      version: "ypub",
      note: "SLIP-132 ypub for nested segwit watch-only.",
    },
    {
      purpose: 44,
      path: `m/44'/0'/${account}'`,
      label: "BIP44 legacy (xpub)",
      version: "xpub",
      note: "Classic xpub for legacy P2PKH watch-only.",
    },
  ];

  const keys = specs.map((s) => {
    const node = root.derive(s.path);
    // Public export only — never return privateExtendedKey
    const xpubStd = node.publicExtendedKey;
    const key = s.version === "xpub" ? xpubStd : toVersionedXpub(xpubStd, s.version);
    return {
      purpose: s.purpose,
      path: s.path,
      label: s.label,
      key,
      note: s.note,
    };
  });

  return { account, keys };
}

/** Offline QR as SVG data URL (no canvas required). Public strings only. */
async function qrDataUrl(text, options) {
  if (!text || typeof text !== "string") throw new Error("empty qr payload");
  // Refuse private-looking payloads
  if (/^xprv/i.test(text) || /^yprv/i.test(text) || /^zprv/i.test(text)) {
    throw new Error("refusing to QR private extended keys");
  }
  const size = (options && options.width) || 220;
  const svg = await QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#0b0f14", light: "#ffffff" },
  });
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const api = {
  generateMnemonic: async (n) => generate(n),
  validateMnemonic: async (m) => validate(m),
  deriveAddresses: async (m, p, options) => deriveAddresses(m, p, options),
  exportWatchOnly: async (m, p, options) => exportWatchOnly(m, p, options),
  qrDataUrl: async (text, options) => qrDataUrl(text, options),
  VERSION: "0.8.0-scure",
};

const g = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : undefined;
if (g) g.BIP39Lab = api;
export default api;
