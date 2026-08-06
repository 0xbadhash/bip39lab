/**
 * Offline BIP-39 / BIP-32 / address helpers (no network).
 * Educational; gated by the same abandon…about vectors as Python bip39lab.
 */
(function (global) {
  "use strict";

  const P = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
  const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
  const GX = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
  const GY = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;
  const HARDENED = 0x80000000;

  function mod(a, m) {
    const r = a % m;
    return r < 0n ? r + m : r;
  }

  function modInv(a, m) {
    let t = 0n,
      newt = 1n,
      r = m,
      newr = mod(a, m);
    while (newr !== 0n) {
      const q = r / newr;
      [t, newt] = [newt, t - q * newt];
      [r, newr] = [newr, r - q * newr];
    }
    if (r > 1n) throw new Error("not invertible");
    if (t < 0n) t += m;
    return t;
  }

  function pointAdd(p1, p2) {
    if (p1.inf) return p2;
    if (p2.inf) return p1;
    if (p1.x === p2.x && mod(p1.y + p2.y, P) === 0n) return { inf: true };
    let lam;
    if (p1.x === p2.x && p1.y === p2.y) {
      if (p1.y === 0n) return { inf: true };
      lam = mod(3n * p1.x * p1.x * modInv(2n * p1.y, P), P);
    } else {
      lam = mod((p2.y - p1.y) * modInv(p2.x - p1.x, P), P);
    }
    const x3 = mod(lam * lam - p1.x - p2.x, P);
    const y3 = mod(lam * (p1.x - x3) - p1.y, P);
    return { x: x3, y: y3, inf: false };
  }

  function scalarMult(k, point) {
    if (k % N === 0n) return { inf: true };
    let result = { inf: true };
    let addend = point;
    let kk = k;
    while (kk > 0n) {
      if (kk & 1n) result = pointAdd(result, addend);
      addend = pointAdd(addend, addend);
      kk >>= 1n;
    }
    return result;
  }

  const G = { x: GX, y: GY, inf: false };

  function toBytes(n, len) {
    let hex = n.toString(16).padStart(len * 2, "0");
    const out = new Uint8Array(len);
    for (let i = 0; i < len; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return out;
  }

  function fromBytes(bytes) {
    let hex = "";
    for (const b of bytes) hex += b.toString(16).padStart(2, "0");
    return BigInt("0x" + (hex || "0"));
  }

  function concatBytes(...arrs) {
    const len = arrs.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(len);
    let o = 0;
    for (const a of arrs) {
      out.set(a, o);
      o += a.length;
    }
    return out;
  }

  async function sha256(data) {
    const buf = await crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(buf);
  }

  async function hmacSha512(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, data);
    return new Uint8Array(sig);
  }

  async function pbkdf2Sha512(password, salt, iterations, dkLen) {
    const key = await crypto.subtle.importKey("raw", password, "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations, hash: "SHA-512" },
      key,
      dkLen * 8
    );
    return new Uint8Array(bits);
  }

  // RIPEMD160 pure JS (compact)
  function ripemd160(msg) {
    // Based on public domain compact implementation
    function f(j, x, y, z) {
      if (j < 16) return x ^ y ^ z;
      if (j < 32) return (x & y) | (~x & z);
      if (j < 48) return (x | ~y) ^ z;
      if (j < 64) return (x & z) | (y & ~z);
      return x ^ (y | ~z);
    }
    function K1(j) {
      if (j < 16) return 0;
      if (j < 32) return 0x5a827999;
      if (j < 48) return 0x6ed9eba1;
      if (j < 64) return 0x8f1bbcdc;
      return 0xa953fd4e;
    }
    function K2(j) {
      if (j < 16) return 0x50a28be6;
      if (j < 32) return 0x5c4dd124;
      if (j < 48) return 0x6d703ef3;
      if (j < 64) return 0x7a6d76e9;
      return 0;
    }
    const r1 = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5,
      2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4,
      13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
    ];
    const r2 = [
      5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12,
      4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5,
      12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
    ];
    const s1 = [
      11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15,
      9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14,
      15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
    ];
    const s2 = [
      8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12,
      7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14,
      6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
    ];
    function rol(x, n) {
      return (x << n) | (x >>> (32 - n));
    }
    function bytesToWords(bin) {
      const words = [];
      for (let i = 0; i < bin.length; i++) words[i >> 2] |= bin[i] << (24 - (i % 4) * 8);
      return words;
    }
    // pad
    const msgLen = msg.length;
    const withOne = new Uint8Array(((msgLen + 9 + 63) & ~63));
    withOne.set(msg);
    withOne[msgLen] = 0x80;
    const bitLen = msgLen * 8;
    // RIPEMD uses little-endian length
    withOne[withOne.length - 8] = bitLen & 0xff;
    withOne[withOne.length - 7] = (bitLen >>> 8) & 0xff;
    withOne[withOne.length - 6] = (bitLen >>> 16) & 0xff;
    withOne[withOne.length - 5] = (bitLen >>> 24) & 0xff;

    let h0 = 0x67452301,
      h1 = 0xefcdab89,
      h2 = 0x98badcfe,
      h3 = 0x10325476,
      h4 = 0xc3d2e1f0;

    const x = new Array(16);
    for (let i = 0; i < withOne.length; i += 64) {
      for (let j = 0; j < 16; j++) {
        const o = i + j * 4;
        x[j] =
          withOne[o] |
          (withOne[o + 1] << 8) |
          (withOne[o + 2] << 16) |
          (withOne[o + 3] << 24);
      }
      let al = h0,
        bl = h1,
        cl = h2,
        dl = h3,
        el = h4;
      let ar = h0,
        br = h1,
        cr = h2,
        dr = h3,
        er = h4;
      for (let j = 0; j < 80; j++) {
        let t = (al + f(j, bl, cl, dl) + x[r1[j]] + K1(j)) | 0;
        t = (rol(t, s1[j]) + el) | 0;
        al = el;
        el = dl;
        dl = rol(cl, 10);
        cl = bl;
        bl = t;
        t = (ar + f(79 - j, br, cr, dr) + x[r2[j]] + K2(j)) | 0;
        t = (rol(t, s2[j]) + er) | 0;
        ar = er;
        er = dr;
        dr = rol(cr, 10);
        cr = br;
        br = t;
      }
      const t = (h1 + cl + dr) | 0;
      h1 = (h2 + dl + er) | 0;
      h2 = (h3 + el + ar) | 0;
      h3 = (h4 + al + br) | 0;
      h4 = (h0 + bl + cr) | 0;
      h0 = t;
    }
    const out = new Uint8Array(20);
    const hs = [h0, h1, h2, h3, h4];
    for (let i = 0; i < 5; i++) {
      out[i * 4] = hs[i] & 0xff;
      out[i * 4 + 1] = (hs[i] >>> 8) & 0xff;
      out[i * 4 + 2] = (hs[i] >>> 16) & 0xff;
      out[i * 4 + 3] = (hs[i] >>> 24) & 0xff;
    }
    return out;
  }

  async function hash160(data) {
    return ripemd160(await sha256(data));
  }

  function base58check(payload) {
    // sync sha256 via subtle is async — use recursive double sha in async wrapper
  }

  async function base58checkAsync(payload) {
    const checksum = (await sha256(await sha256(payload))).slice(0, 4);
    const data = concatBytes(payload, checksum);
    const ALPH = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let n = fromBytes(data);
    let res = "";
    while (n > 0n) {
      const r = n % 58n;
      n = n / 58n;
      res = ALPH[Number(r)] + res;
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
    const hrpExpand = [...hrp].map((c) => c.charCodeAt(0) >> 5).concat(0, [...hrp].map((c) => c.charCodeAt(0) & 31));
    const values = hrpExpand.concat(data).concat([0, 0, 0, 0, 0, 0]);
    const polymod = bech32Polymod(values) ^ 1;
    const checksum = [];
    for (let i = 0; i < 6; i++) checksum.push((polymod >> (5 * (5 - i))) & 31);
    const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    return hrp + "1" + data.concat(checksum).map((d) => charset[d]).join("");
  }

  function compressedPub(priv) {
    const pub = scalarMult(priv, G);
    if (pub.inf) throw new Error("invalid key");
    const prefix = pub.y % 2n === 0n ? 0x02 : 0x03;
    return concatBytes(new Uint8Array([prefix]), toBytes(pub.x, 32));
  }

  async function masterFromSeed(seed) {
    const I = await hmacSha512(new TextEncoder().encode("Bitcoin seed"), seed);
    const key = fromBytes(I.slice(0, 32));
    const chain = I.slice(32);
    if (key === 0n || key >= N) throw new Error("invalid master");
    return { key, chain };
  }

  async function ckdPriv(parentKey, parentChain, index) {
    let data;
    if (index >= HARDENED) {
      data = concatBytes(new Uint8Array([0]), toBytes(parentKey, 32), toBytes(BigInt(index), 4));
    } else {
      data = concatBytes(compressedPub(parentKey), toBytes(BigInt(index), 4));
    }
    const I = await hmacSha512(parentChain, data);
    const il = fromBytes(I.slice(0, 32));
    const child = mod(il + parentKey, N);
    if (il >= N || child === 0n) throw new Error("invalid child");
    return { key: child, chain: I.slice(32) };
  }

  async function derivePath(seed, path) {
    let { key, chain } = await masterFromSeed(seed);
    for (const idx of path) {
      ({ key, chain } = await ckdPriv(key, chain, idx));
    }
    return key;
  }

  function wordlist() {
    if (!global.BIP39_ENGLISH || global.BIP39_ENGLISH.length !== 2048) {
      throw new Error("wordlist missing");
    }
    return global.BIP39_ENGLISH;
  }

  function bitsFromBytes(bytes) {
    let s = "";
    for (const b of bytes) s += b.toString(2).padStart(8, "0");
    return s;
  }

  async function entropyToMnemonic(entropy) {
    const words = wordlist();
    const entBits = bitsFromBytes(entropy);
    const csLen = (entropy.length * 8) / 32;
    const hash = await sha256(entropy);
    const cs = bitsFromBytes(hash).slice(0, csLen);
    const bits = entBits + cs;
    const out = [];
    for (let i = 0; i < bits.length; i += 11) {
      const idx = parseInt(bits.slice(i, i + 11), 2);
      out.push(words[idx]);
    }
    return out.join(" ");
  }

  async function generateMnemonic(wordCount) {
    const strength = { 12: 16, 15: 20, 18: 24, 21: 28, 24: 32 }[wordCount];
    if (!strength) throw new Error("bad word count");
    const entropy = new Uint8Array(strength);
    crypto.getRandomValues(entropy);
    return entropyToMnemonic(entropy);
  }

  async function validateMnemonic(mnemonic) {
    try {
      await mnemonicToEntropy(mnemonic);
      return true;
    } catch {
      return false;
    }
  }

  async function mnemonicToEntropy(mnemonic) {
    const parts = mnemonic.trim().split(/\s+/);
    const strengthMap = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 };
    if (!(parts.length in strengthMap)) throw new Error("bad length");
    const words = wordlist();
    const indexOf = (w) => {
      const i = words.indexOf(w);
      if (i < 0) throw new Error("bad word");
      return i;
    };
    let bits = "";
    for (const w of parts) bits += indexOf(w).toString(2).padStart(11, "0");
    const entLen = strengthMap[parts.length];
    const csLen = entLen / 32;
    const entBits = bits.slice(0, entLen);
    const csBits = bits.slice(entLen, entLen + csLen);
    const entBytes = new Uint8Array(entLen / 8);
    for (let i = 0; i < entBytes.length; i++) {
      entBytes[i] = parseInt(entBits.slice(i * 8, i * 8 + 8), 2);
    }
    const hash = await sha256(entBytes);
    if (bitsFromBytes(hash).slice(0, csLen) !== csBits) throw new Error("bad checksum");
    return entBytes;
  }

  async function mnemonicToSeed(mnemonic, passphrase) {
    if (!(await validateMnemonic(mnemonic))) throw new Error("invalid mnemonic");
    const pw = new TextEncoder().encode(mnemonic.trim());
    const salt = new TextEncoder().encode("mnemonic" + (passphrase || ""));
    return pbkdf2Sha512(pw, salt, 2048, 64);
  }

  async function p2pkh(priv) {
    const pub = compressedPub(priv);
    const h = await hash160(pub);
    return base58checkAsync(concatBytes(new Uint8Array([0x00]), h));
  }

  async function p2shP2wpkh(priv) {
    const pub = compressedPub(priv);
    const h = await hash160(pub);
    const redeem = concatBytes(new Uint8Array([0x00, 0x14]), h);
    const rh = await hash160(redeem);
    return base58checkAsync(concatBytes(new Uint8Array([0x05]), rh));
  }

  async function p2wpkh(priv) {
    const pub = compressedPub(priv);
    const h = await hash160(pub);
    const data = [0].concat(convertbits(h, 8, 5, true));
    return bech32Encode("bc", data);
  }

  function path(purpose, account, change, index) {
    return [purpose | HARDENED, 0 | HARDENED, account | HARDENED, change, index];
  }

  async function deriveAddresses(mnemonic, passphrase) {
    const seed = await mnemonicToSeed(mnemonic, passphrase || "");
    const a44 = await derivePath(seed, path(44, 0, 0, 0));
    const a49 = await derivePath(seed, path(49, 0, 0, 0));
    const a84 = await derivePath(seed, path(84, 0, 0, 0));
    return {
      bip44_p2pkh: await p2pkh(a44),
      bip49_p2sh_p2wpkh: await p2shP2wpkh(a49),
      bip84_p2wpkh: await p2wpkh(a84),
    };
  }

  global.BIP39Lab = {
    generateMnemonic,
    validateMnemonic,
    deriveAddresses,
    VERSION: "0.2.0",
  };
})(typeof window !== "undefined" ? window : globalThis);
