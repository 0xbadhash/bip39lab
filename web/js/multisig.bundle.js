(() => {
  // node_modules/@noble/hashes/_u64.js
  var fromNumH = (n) => n / 2 ** 32 | 0;
  var fromNumL = (n) => n >>> 0;
  function setU64FromNum(view, byteOffset, n, isLE) {
    const h = fromNumH(n);
    const l = fromNumL(n);
    view.setUint32(byteOffset, isLE ? l : h, isLE);
    view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
  }

  // node_modules/@noble/hashes/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  var atitle = (title) => title ? `"${title}" ` : "";
  function anumber(n, title = "") {
    if (typeof n !== "number")
      throw new TypeError(atitle(title) + "expected number, got " + typeof n);
    if (!Number.isSafeInteger(n) || n < 0)
      throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
    return n;
  }
  function abytes(value, length, title = "") {
    if (isBytes(value) && (length === void 0 || value.length === length))
      return value;
    if (length !== void 0)
      anumber(length, "length");
    const bytes = isBytes(value);
    const ofLen = length !== void 0 ? ` of length ${length}` : "";
    const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
    const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  var aobject = (value, label) => {
    if (value === null || typeof value !== "object" || Array.isArray(value))
      throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
  };
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("hash was destroyed");
    if (checkFinished && instance.finished)
      throw new Error("digest() was already called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "output");
    const min = instance.outputLen;
    if (!(out.length >= min)) {
      throw new RangeError('"output" expected length >= ' + min);
    }
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function rotl(word, shift) {
    return word << shift | word >>> 32 - shift >>> 0;
  }
  function checkOpts(defaults, opts, title = "opts") {
    aobject(defaults, "defaults");
    if (opts !== void 0)
      aobject(opts, title);
    const merged = Object.assign(defaults, opts);
    return merged;
  }
  function createHasher(hashCons, info = {}) {
    if (typeof hashCons !== "function")
      throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
    info = checkOpts({}, info, "info");
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.canXOF = tmp.canXOF;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  var oidNist = (suffix) => ({
    // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
    // Larger suffix values would need base-128 OID encoding and a different length byte.
    oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
  });

  // node_modules/@noble/hashes/_md.js
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD = class {
    blockLen;
    outputLen;
    canXOF = false;
    padOffset;
    isLE;
    // For partial updates less than block size
    buffer;
    view;
    finished = false;
    length = 0;
    pos = 0;
    destroyed = false;
    constructor(blockLen, outputLen, padOffset, isLE) {
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      abytes(data);
      const { view, buffer, blockLen } = this;
      const len = data.length;
      let processed = false;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          processed = true;
          continue;
        }
        buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
          processed = true;
        }
      }
      this.length += data.length;
      if (processed)
        this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      buffer.fill(0, pos);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        buffer.fill(0);
      }
      setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
      this.process(view, 0);
      this.roundClean();
      const oview = out === buffer ? view : createView(out);
      const len = this.outputLen;
      const outLen = len / 4;
      const state = this.get();
      if (len % 4 || outLen > state.length)
        throw new Error("invalid outputLen");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneIntoMeta(to) {
      const { buffer, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (pos)
        to.buffer.set(buffer);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);

  // node_modules/@noble/hashes/sha2.js
  var SHA256_K = /* @__PURE__ */ Uint32Array.from([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA2_32B = class extends HashMD {
    // We cannot use array here since array allows indexing by variable
    // which means optimizer/compiler cannot use registers.
    // Numeric initializers matter: starting the fields as `undefined` changes
    // V8's field representation and makes sha256 3x slower (measured).
    A = 0;
    B = 0;
    C = 0;
    D = 0;
    E = 0;
    F = 0;
    G = 0;
    H = 0;
    constructor(outputLen, IV) {
      super(64, outputLen, 8, false);
      this.A = IV[0] | 0;
      this.B = IV[1] | 0;
      this.C = IV[2] | 0;
      this.D = IV[3] | 0;
      this.E = IV[4] | 0;
      this.F = IV[5] | 0;
      this.G = IV[6] | 0;
      this.H = IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    _cloneInto(to) {
      (to ||= new this.constructor()).set(...this.get());
      return this._cloneIntoMeta(to);
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      clean(SHA256_W);
    }
    destroy() {
      this.destroyed = true;
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      clean(this.buffer);
    }
  };
  var _SHA256 = class extends SHA2_32B {
    constructor() {
      super(32, SHA256_IV);
    }
  };
  var sha256 = /* @__PURE__ */ createHasher(
    () => new _SHA256(),
    /* @__PURE__ */ oidNist(1)
  );

  // node_modules/@noble/hashes/legacy.js
  var Rho160 = /* @__PURE__ */ Uint8Array.from([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]);
  var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
  var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
  var idxLR = /* @__PURE__ */ (() => {
    const L = [Id160];
    const R = [Pi160];
    const res = [L, R];
    for (let i = 0; i < 4; i++)
      for (let j of res)
        j.push(j[i].map((k) => Rho160[k]));
    return res;
  })();
  var idxL = /* @__PURE__ */ (() => idxLR[0])();
  var idxR = /* @__PURE__ */ (() => idxLR[1])();
  var shifts160 = /* @__PURE__ */ [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
  ].map((i) => Uint8Array.from(i));
  var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var Kl160 = /* @__PURE__ */ Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]);
  var Kr160 = /* @__PURE__ */ Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
  function ripemd_f(group, x, y, z) {
    if (group === 0)
      return x ^ y ^ z;
    if (group === 1)
      return x & y | ~x & z;
    if (group === 2)
      return (x | ~y) ^ z;
    if (group === 3)
      return x & z | y & ~z;
    return x ^ (y | ~z);
  }
  var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
  var _RIPEMD160 = class extends HashMD {
    h0 = 1732584193 | 0;
    h1 = 4023233417 | 0;
    h2 = 2562383102 | 0;
    h3 = 271733878 | 0;
    h4 = 3285377520 | 0;
    constructor() {
      super(64, 20, 8, true);
    }
    get() {
      const { h0, h1, h2, h3, h4 } = this;
      return [h0, h1, h2, h3, h4];
    }
    set(h0, h1, h2, h3, h4) {
      this.h0 = h0 | 0;
      this.h1 = h1 | 0;
      this.h2 = h2 | 0;
      this.h3 = h3 | 0;
      this.h4 = h4 | 0;
    }
    _cloneInto(to) {
      (to ||= new this.constructor()).set(...this.get());
      return this._cloneIntoMeta(to);
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        BUF_160[i] = view.getUint32(offset, true);
      let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
      for (let group = 0; group < 5; group++) {
        const rGroup = 4 - group;
        const hbl = Kl160[group], hbr = Kr160[group];
        const rl = idxL[group], rr = idxR[group];
        const sl = shiftsL160[group], sr = shiftsR160[group];
        for (let i = 0; i < 16; i++) {
          const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
          al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
        }
        for (let i = 0; i < 16; i++) {
          const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
          ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
        }
      }
      this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
    }
    roundClean() {
      clean(BUF_160);
    }
    destroy() {
      this.destroyed = true;
      clean(this.buffer);
      this.set(0, 0, 0, 0, 0);
    }
  };
  var ripemd160 = /* @__PURE__ */ createHasher(() => new _RIPEMD160());

  // web/js/multisig-core.mjs
  var OP_CHECKMULTISIG = 174;
  function opN(n) {
    if (n < 1 || n > 16) throw new Error("M and N must be between 1 and 16");
    return 80 + n;
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
    return Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  function looksPrivate(s) {
    const t = s.trim();
    if (/^(xprv|yprv|zprv|tprv)/i.test(t)) return true;
    if (/^[5KL][1-9A-HJ-NP-Za-km-z]{50,}$/.test(t)) return true;
    if (/^c[1-9A-HJ-NP-Za-km-z]{50,}$/.test(t)) return true;
    return false;
  }
  function parseCompressedPubkey(hex) {
    const raw = hexToBytes(hex);
    if (raw.length !== 33) throw new Error("pubkey must be 33-byte compressed (66 hex chars)");
    if (raw[0] !== 2 && raw[0] !== 3) throw new Error("pubkey must start with 02 or 03");
    return raw;
  }
  function pushData(buf) {
    if (buf.length < 76) {
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
  function sortPubkeysBIP67(pubs) {
    return pubs.slice().sort((a, b) => {
      const ha = bytesToHex(a);
      const hb = bytesToHex(b);
      return ha < hb ? -1 : ha > hb ? 1 : 0;
    });
  }
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
    payload[0] = 5;
    payload.set(h, 1);
    return base58check(payload);
  }
  function convertbits(data, frombits, tobits, pad) {
    let acc = 0, bits = 0;
    const ret = [];
    const maxv = (1 << tobits) - 1;
    for (const value of data) {
      acc = acc << frombits | value;
      bits += frombits;
      while (bits >= tobits) {
        bits -= tobits;
        ret.push(acc >> bits & maxv);
      }
    }
    if (pad && bits) ret.push(acc << tobits - bits & maxv);
    return ret;
  }
  function bech32Polymod(values) {
    const GEN = [996825010, 642813549, 513874426, 1027748829, 705979059];
    let chk = 1;
    for (const v of values) {
      const b = chk >> 25;
      chk = (chk & 33554431) << 5 ^ v;
      for (let i = 0; i < 5; i++) if (b >> i & 1) chk ^= GEN[i];
    }
    return chk;
  }
  function bech32Encode(hrp, data) {
    const hrpExpand = [...hrp].map((c) => c.charCodeAt(0) >> 5).concat([0], [...hrp].map((c) => c.charCodeAt(0) & 31));
    const polymod = bech32Polymod(hrpExpand.concat(data).concat([0, 0, 0, 0, 0, 0])) ^ 1;
    const checksum = [];
    for (let i = 0; i < 6; i++) checksum.push(polymod >> 5 * (5 - i) & 31);
    const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
    return hrp + "1" + data.concat(checksum).map((d) => charset[d]).join("");
  }
  function p2wshAddress(script) {
    const prog = sha256(script);
    const data = [0].concat(convertbits(prog, 8, 5, true));
    return bech32Encode("bc", data);
  }
  function buildMultisigFromText(partsText, m, options) {
    const bip67 = !options || options.bip67 !== false;
    const rawParts = partsText.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!rawParts.length) throw new Error("enter at least one compressed public key (hex)");
    for (const p of rawParts) {
      if (looksPrivate(p)) {
        throw new Error("private keys / xprv / WIF are not accepted \u2014 public keys only (safety)");
      }
    }
    let pubs = rawParts.map(parseCompressedPubkey);
    const n = pubs.length;
    const mNum = Number(m);
    if (!Number.isFinite(mNum) || mNum < 1 || mNum > n) {
      throw new Error("M must be between 1 and N (number of keys)");
    }
    const orderNote = bip67 ? "Keys sorted lexicographically (BIP67) \u2014 recommended so everyone builds the same address." : "Keys kept in the order you entered \u2014 every cosigner must use the same order.";
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
      summary: mNum + "-of-" + n + " multisig \xB7 " + (bip67 ? "BIP67 sorted" : "custom order") + " \xB7 offline"
    };
  }
  var MultisigLab = {
    buildMultisigFromText,
    looksPrivate,
    VERSION: "0.9.0-ms"
  };
  var g = typeof globalThis !== "undefined" ? globalThis : void 0;
  if (g) g.MultisigLab = MultisigLab;
  var multisig_core_default = MultisigLab;
})();
