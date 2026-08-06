import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { HDKey } from "@scure/bip32";
import { sha256 } from "@noble/hashes/sha2.js";
import { ripemd160 } from "@noble/hashes/legacy.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";

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

function bech32Encode(hrp, data) {
  const hrpExpand = [...hrp].map((c) => c.charCodeAt(0) >> 5).concat([0], [...hrp].map((c) => c.charCodeAt(0) & 31));
  const polymod = bech32Polymod(hrpExpand.concat(data).concat([0, 0, 0, 0, 0, 0])) ^ 1;
  const checksum = [];
  for (let i = 0; i < 6; i++) checksum.push((polymod >> (5 * (5 - i))) & 31);
  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  return hrp + "1" + data.concat(checksum).map((d) => charset[d]).join("");
}

function compressedPub(privBytes) {
  const pub = secp256k1.getPublicKey(privBytes, true);
  return pub;
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
  return bech32Encode("bc", data);
}

/**
 * Derive receive addresses for account/change over consecutive indices.
 * @param {string} mnemonic
 * @param {string} [passphrase]
 * @param {{ count?: number, account?: number, change?: number }} [options]
 * @returns {{ rows: Array<{index,bip44_p2pkh,bip49_p2sh_p2wpkh,bip84_p2wpkh}>, bip44_p2pkh, bip49_p2sh_p2wpkh, bip84_p2wpkh }}
 */
function deriveAddresses(mnemonic, passphrase, options) {
  if (!validateMnemonic(mnemonic, wordlist)) throw new Error("invalid mnemonic");
  const seed = mnemonicToSeedSync(mnemonic, passphrase || "");
  const root = HDKey.fromMasterSeed(seed);
  const account = (options && options.account) || 0;
  const change = (options && options.change) || 0;
  let count = (options && options.count) != null ? options.count : 1;
  count = Math.max(1, Math.min(Number(count) || 1, 20));

  const rows = [];
  for (let i = 0; i < count; i++) {
    const k44 = root.derive(`m/44'/0'/${account}'/${change}/${i}`);
    const k49 = root.derive(`m/49'/0'/${account}'/${change}/${i}`);
    const k84 = root.derive(`m/84'/0'/${account}'/${change}/${i}`);
    rows.push({
      index: i,
      bip44_p2pkh: p2pkh(k44.privateKey),
      bip49_p2sh_p2wpkh: p2shP2wpkh(k49.privateKey),
      bip84_p2wpkh: p2wpkh(k84.privateKey),
    });
  }
  return {
    rows,
    // index-0 convenience (backward compatible with older UI)
    bip44_p2pkh: rows[0].bip44_p2pkh,
    bip49_p2sh_p2wpkh: rows[0].bip49_p2sh_p2wpkh,
    bip84_p2wpkh: rows[0].bip84_p2wpkh,
  };
}

function generate(wordCount) {
  const strength = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 }[wordCount] || 128;
  return generateMnemonic(wordlist, strength);
}

function validate(m) {
  return validateMnemonic(m, wordlist);
}

const api = {
  generateMnemonic: async (n) => generate(n),
  validateMnemonic: async (m) => validate(m),
  deriveAddresses: async (m, p, options) => deriveAddresses(m, p, options),
  VERSION: "0.6.1-scure",
};

const g = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : undefined;
if (g) g.BIP39Lab = api;
export default api;
