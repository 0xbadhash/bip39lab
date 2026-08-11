import {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeedSync,
  entropyToMnemonic,
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
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

/** @param {'main'|'test'} network */
function netParams(network) {
  const test = network === "test" || network === "testnet" || network === "signet";
  return {
    coin: test ? 1 : 0,
    hrp: test ? "tb" : "bc",
    p2pkhVer: test ? 0x6f : 0x00,
    p2shVer: test ? 0xc4 : 0x05,
    network: test ? "test" : "main",
  };
}

function p2pkh(privBytes, network) {
  const n = netParams(network);
  const h = hash160(compressedPub(privBytes));
  const payload = new Uint8Array(21);
  payload[0] = n.p2pkhVer;
  payload.set(h, 1);
  return base58check(payload);
}

function p2shP2wpkh(privBytes, network) {
  const n = netParams(network);
  const h = hash160(compressedPub(privBytes));
  const redeem = new Uint8Array(22);
  redeem[0] = 0x00;
  redeem[1] = 0x14;
  redeem.set(h, 2);
  const rh = hash160(redeem);
  const payload = new Uint8Array(21);
  payload[0] = n.p2shVer;
  payload.set(rh, 1);
  return base58check(payload);
}

function p2wpkh(privBytes, network) {
  const n = netParams(network);
  const h = hash160(compressedPub(privBytes));
  const data = [0].concat(convertbits(h, 8, 5, true));
  return bech32Encode(n.hrp, data, "bech32");
}

/** BIP86 key-path only Taproot (P2TR) address. */
function p2tr(privBytes, network) {
  const n = netParams(network);
  const xonly = schnorr.getPublicKey(privBytes);
  const x = BigInt("0x" + bytesToHex(xonly));
  const P = schnorr.utils.lift_x(x);
  const tweak = schnorr.utils.taggedHash("TapTweak", xonly);
  const t = BigInt("0x" + bytesToHex(tweak));
  const Q = P.add(secp256k1.Point.BASE.multiply(t));
  const out = schnorr.utils.pointToBytes(Q);
  const data = [1].concat(convertbits(out, 8, 5, true));
  return bech32Encode(n.hrp, data, "bech32m");
}

/**
 * @param {string} mnemonic
 * @param {string} [passphrase]
 * @param {{ count?: number, account?: number, change?: number, network?: string }} [options]
 */
function deriveAddresses(mnemonic, passphrase, options) {
  if (!validateMnemonic(mnemonic, wordlist)) throw new Error("invalid mnemonic");
  const seed = mnemonicToSeedSync(mnemonic, passphrase || "");
  const root = HDKey.fromMasterSeed(seed);
  const account = Math.max(0, Math.floor(Number((options && options.account) || 0)));
  const change = Number((options && options.change) || 0) === 1 ? 1 : 0;
  let count = (options && options.count) != null ? options.count : 1;
  count = Math.max(1, Math.min(Number(count) || 1, 20));
  const network = (options && options.network) || "main";
  const coin = netParams(network).coin;

  const rows = [];
  for (let i = 0; i < count; i++) {
    const k44 = root.derive(`m/44'/${coin}'/${account}'/${change}/${i}`);
    const k49 = root.derive(`m/49'/${coin}'/${account}'/${change}/${i}`);
    const k84 = root.derive(`m/84'/${coin}'/${account}'/${change}/${i}`);
    const k86 = root.derive(`m/86'/${coin}'/${account}'/${change}/${i}`);
    rows.push({
      index: i,
      bip86_p2tr: p2tr(k86.privateKey, network),
      bip84_p2wpkh: p2wpkh(k84.privateKey, network),
      bip49_p2sh_p2wpkh: p2shP2wpkh(k49.privateKey, network),
      bip44_p2pkh: p2pkh(k44.privateKey, network),
    });
  }
  return {
    rows,
    account,
    change,
    network: netParams(network).network,
    coin,
    bip86_p2tr: rows[0].bip86_p2tr,
    bip84_p2wpkh: rows[0].bip84_p2wpkh,
    bip49_p2sh_p2wpkh: rows[0].bip49_p2sh_p2wpkh,
    bip44_p2pkh: rows[0].bip44_p2pkh,
  };
}

/** Human path string for playground. */
function formatPath(purpose, network, account, change, index) {
  const coin = netParams(network).coin;
  const idx = index == null ? "i" : String(index);
  return `m/${purpose}'/${coin}'/${account}'/${change}/${idx}`;
}

/**
 * Output descriptors (public / watch-only style) from exportWatchOnly keys.
 * Educational — fingerprints omitted when unknown.
 */
function descriptorsFromWatchOnly(wo, network) {
  const coin = netParams(network).coin;
  const keys = (wo && wo.keys) || [];
  const account = (wo && wo.account) || 0;
  const out = [];
  for (const k of keys) {
    const key = k.key || "";
    if (k.purpose === 84) {
      out.push({
        purpose: 84,
        label: "BIP84 receive",
        descriptor: `wpkh(${key}/0/*)`,
        note: "Native segwit receive chain. Import as watch-only in Sparrow etc.",
      });
      out.push({
        purpose: 84,
        label: "BIP84 change",
        descriptor: `wpkh(${key}/1/*)`,
        note: "Change chain for the same account.",
      });
    } else if (k.purpose === 86) {
      out.push({
        purpose: 86,
        label: "BIP86 Taproot receive",
        descriptor: `tr(${key}/0/*)`,
        note: "Key-path Taproot receive (wallet support varies).",
      });
    } else if (k.purpose === 49) {
      out.push({
        purpose: 49,
        label: "BIP49 nested receive",
        descriptor: `sh(wpkh(${key}/0/*))`,
        note: "Nested segwit P2SH-P2WPKH.",
      });
    } else if (k.purpose === 44) {
      out.push({
        purpose: 44,
        label: "BIP44 legacy receive",
        descriptor: `pkh(${key}/0/*)`,
        note: "Legacy P2PKH.",
      });
    }
  }
  return { account, coin, network: netParams(network).network, descriptors: out };
}

/**
 * Educational PSBT inspector — no signing.
 * @returns {{ status: 'ok'|'error', magic?: string, globalKeys?: number, inputCount?: number, outputCount?: number, detail: string }}
 */
function inspectPsbt(input) {
  try {
    const raw = String(input || "").trim();
    if (!raw) return { status: "error", detail: "empty" };
    if (/xprv|mnemonic|seed/i.test(raw)) {
      return { status: "error", detail: "refusing secret-looking payload" };
    }
    let bytes;
    if (/^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0) {
      bytes = new Uint8Array(raw.length / 2);
      for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(raw.slice(i * 2, i * 2 + 2), 16);
    } else {
      // base64
      const bin = atob(raw.replace(/\s+/g, ""));
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    }
    // magic psbt\xff
    if (bytes.length < 5 || bytes[0] !== 0x70 || bytes[1] !== 0x73 || bytes[2] !== 0x62 || bytes[3] !== 0x74 || bytes[4] !== 0xff) {
      return { status: "error", detail: "not a PSBT (missing psbt\\xff magic)" };
    }
    // Count key-value maps until separator 0x00 (simplified educational scan)
    let i = 5;
    let maps = 0;
    let keysInMap = 0;
    let globalKeys = 0;
    const mapKeyCounts = [];
    while (i < bytes.length) {
      if (bytes[i] === 0x00) {
        mapKeyCounts.push(keysInMap);
        if (maps === 0) globalKeys = keysInMap;
        maps++;
        keysInMap = 0;
        i++;
        continue;
      }
      // compact size key length
      let keyLen = bytes[i++];
      if (keyLen === 0xfd) {
        if (i + 2 > bytes.length) break;
        keyLen = bytes[i] | (bytes[i + 1] << 8);
        i += 2;
      }
      i += keyLen;
      if (i >= bytes.length) break;
      let valLen = bytes[i++];
      if (valLen === 0xfd) {
        if (i + 2 > bytes.length) break;
        valLen = bytes[i] | (bytes[i + 1] << 8);
        i += 2;
      }
      i += valLen;
      keysInMap++;
    }
    // BIP174: maps = 1 global + inputs + outputs; we cannot split without unsigned_tx —
    // report map count as educational signal
    return {
      status: "ok",
      magic: "psbt\\xff",
      globalKeys,
      mapCount: maps,
      detail:
        "Educational parse only — not a wallet. " +
        maps +
        " key-value map(s) after magic; global keys ≈ " +
        globalKeys +
        ". Does not sign or broadcast.",
    };
  } catch (e) {
    return { status: "error", detail: String(e && e.message ? e.message : e) };
  }
}

/** Refuse private material in pasted “descriptors”. */
function explainDescriptor(text) {
  const t = String(text || "").trim();
  if (!t) return { status: "error", detail: "empty" };
  if (/xprv|yprv|zprv|tprv|mnemonic|WIF|5[HJK]/i.test(t)) {
    return { status: "error", detail: "refusing private keys / seed material in descriptor box" };
  }
  const kinds = [];
  if (/wpkh\s*\(/i.test(t)) kinds.push("wpkh (native segwit)");
  if (/tr\s*\(/i.test(t)) kinds.push("tr (taproot)");
  if (/sh\s*\(/i.test(t)) kinds.push("sh (script hash / nested)");
  if (/pkh\s*\(/i.test(t)) kinds.push("pkh (legacy)");
  if (/multi\s*\(/i.test(t) || /sortedmulti\s*\(/i.test(t)) kinds.push("multi/sortedmulti (multisig)");
  if (/xpub|ypub|zpub|tpub/i.test(t)) kinds.push("extended public key present");
  if (!kinds.length) {
    return {
      status: "ok",
      kinds: [],
      detail: "No common descriptor keywords found. Public descriptors often look like wpkh(zpub…/0/*).",
    };
  }
  return {
    status: "ok",
    kinds,
    detail: "Looks like: " + kinds.join("; ") + ". This lab does not import wallets — education only.",
  };
}

function generate(wordCount) {
  const strength = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 }[wordCount] || 128;
  return generateMnemonic(wordlist, strength);
}

function validate(m) {
  return validateMnemonic(m, wordlist);
}

/**
 * Educational: BIP-39 mnemonic from raw entropy bytes (16/20/24/28/32).
 * Callers must not claim this is suitable for funded wallets.
 */
function mnemonicFromEntropyBytes(bytes) {
  const arr =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  const n = arr.length;
  if (![16, 20, 24, 28, 32].includes(n)) {
    throw new Error("entropy must be 16, 20, 24, 28, or 32 bytes");
  }
  return entropyToMnemonic(arr, wordlist);
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
  const network = (options && options.network) || "main";
  const coin = netParams(network).coin;
  // SLIP-132 versioned pubs are mainnet-oriented; on test use standard xpub only
  const useSlip = netParams(network).network === "main";

  const specs = [
    {
      purpose: 86,
      path: `m/86'/${coin}'/${account}'`,
      label: "BIP86 Taproot (xpub)",
      version: "xpub",
      note: "Standard BIP32 xpub at account path — import as watch-only where supported.",
    },
    {
      purpose: 84,
      path: `m/84'/${coin}'/${account}'`,
      label: useSlip ? "BIP84 native segwit (zpub)" : "BIP84 native segwit (xpub)",
      version: useSlip ? "zpub" : "xpub",
      note: useSlip
        ? "SLIP-132 zpub for Sparrow / many mobile wallets (P2WPKH)."
        : "Test network: standard xpub at BIP84 account path.",
    },
    {
      purpose: 49,
      path: `m/49'/${coin}'/${account}'`,
      label: useSlip ? "BIP49 nested (ypub)" : "BIP49 nested (xpub)",
      version: useSlip ? "ypub" : "xpub",
      note: "Nested segwit watch-only.",
    },
    {
      purpose: 44,
      path: `m/44'/${coin}'/${account}'`,
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

  return { account, network: netParams(network).network, coin, keys };
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
  mnemonicFromEntropyBytes: (bytes) => mnemonicFromEntropyBytes(bytes),
  deriveAddresses: async (m, p, options) => deriveAddresses(m, p, options),
  exportWatchOnly: async (m, p, options) => exportWatchOnly(m, p, options),
  descriptorsFromWatchOnly: (wo, network) => descriptorsFromWatchOnly(wo, network),
  formatPath: (purpose, network, account, change, index) =>
    formatPath(purpose, network, account, change, index),
  inspectPsbt: (input) => inspectPsbt(input),
  explainDescriptor: (text) => explainDescriptor(text),
  netParams: (network) => netParams(network),
  qrDataUrl: async (text, options) => qrDataUrl(text, options),
  VERSION: "0.11.0-scure",
};

const g = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : undefined;
if (g) g.BIP39Lab = api;
export default api;
