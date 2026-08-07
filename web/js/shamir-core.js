/**
 * Educational Shamir secret sharing over GF(256) — NOT SLIP-39.
 * Mirrors src/bip39lab/shamir.py for offline browser demos.
 */
(function (global) {
  "use strict";

  var MAX_N = 7;
  var MIN_M = 2;

  function gfMul(a, b) {
    var p = 0;
    a &= 0xff;
    b &= 0xff;
    for (var i = 0; i < 8; i++) {
      if (b & 1) p ^= a;
      var hi = a & 0x80;
      a = (a << 1) & 0xff;
      if (hi) a ^= 0x1b;
      b >>= 1;
    }
    return p;
  }

  function gfInv(a) {
    a &= 0xff;
    if (a === 0) throw new Error("gf inv 0");
    var r = 1;
    var base = a;
    var exp = 254;
    while (exp) {
      if (exp & 1) r = gfMul(r, base);
      base = gfMul(base, base);
      exp >>= 1;
    }
    return r;
  }

  function evalPoly(coeffs, x) {
    var y = 0;
    for (var i = coeffs.length - 1; i >= 0; i--) {
      y = gfMul(y, x) ^ (coeffs[i] & 0xff);
    }
    return y;
  }

  function lagrangeAtZero(xs, ys) {
    var secret = 0;
    var k = xs.length;
    for (var i = 0; i < k; i++) {
      var num = 1;
      var den = 1;
      var xi = xs[i];
      for (var j = 0; j < k; j++) {
        if (i === j) continue;
        var xj = xs[j];
        num = gfMul(num, xj);
        den = gfMul(den, xi ^ xj);
      }
      var li0 = gfMul(num, gfInv(den));
      secret ^= gfMul(ys[i] & 0xff, li0);
    }
    return secret;
  }

  function utf8Encode(str) {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(str);
    }
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c < 0x80) out.push(c);
      else if (c < 0x800) {
        out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
      } else {
        out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
      }
    }
    return new Uint8Array(out);
  }

  function toHex(u8) {
    var s = "";
    for (var i = 0; i < u8.length; i++) {
      s += (u8[i] & 0xff).toString(16).padStart(2, "0");
    }
    return s;
  }

  function fromHex(hex) {
    hex = String(hex || "").replace(/\s+/g, "");
    if (hex.length % 2) throw new Error("odd hex length");
    var out = new Uint8Array(hex.length / 2);
    for (var i = 0; i < out.length; i++) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
  }

  function randomBytes(n) {
    var out = new Uint8Array(n);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(out);
    } else {
      for (var i = 0; i < n; i++) out[i] = (Math.random() * 256) | 0;
    }
    return out;
  }

  function splitSecret(secretU8, m, n) {
    if (!secretU8 || !secretU8.length) throw new Error("secret is empty");
    m = m | 0;
    n = n | 0;
    if (m < MIN_M) throw new Error("threshold M must be >= " + MIN_M);
    if (n < m) throw new Error("N must be >= M (threshold)");
    if (n > MAX_N) throw new Error("N exceeds max " + MAX_N + " for demo");

    var len = secretU8.length;
    var payloads = [];
    var i, bi, x;
    for (i = 0; i < n; i++) payloads.push(new Uint8Array(len));

    for (bi = 0; bi < len; bi++) {
      var coeffs = [secretU8[bi] & 0xff];
      var rnd = randomBytes(m - 1);
      for (i = 0; i < m - 1; i++) coeffs.push(rnd[i]);
      for (i = 0; i < n; i++) {
        x = i + 1;
        payloads[i][bi] = evalPoly(coeffs, x);
      }
    }

    var shares = [];
    for (i = 0; i < n; i++) {
      shares.push({ index: i + 1, payload: payloads[i] });
    }
    return shares;
  }

  function combineShares(shares) {
    if (!shares || !shares.length) throw new Error("need shares to combine");
    if (shares.length < MIN_M) throw new Error("need at least M=" + MIN_M + " shares");
    var byIdx = {};
    for (var s = 0; s < shares.length; s++) {
      var sh = shares[s];
      var idx = sh.index | 0;
      if (idx < 1 || idx > 255) throw new Error("invalid share index");
      byIdx[idx] = sh.payload;
    }
    var keys = Object.keys(byIdx)
      .map(function (k) {
        return parseInt(k, 10);
      })
      .sort(function (a, b) {
        return a - b;
      });
    if (keys.length < MIN_M) throw new Error("need at least M=" + MIN_M + " distinct shares");
    var length = byIdx[keys[0]].length;
    if (!length) throw new Error("empty share payload");
    var xs = keys;
    var out = new Uint8Array(length);
    for (var bi = 0; bi < length; bi++) {
      var ys = [];
      for (var i = 0; i < xs.length; i++) ys.push(byIdx[xs[i]][bi]);
      out[bi] = lagrangeAtZero(xs, ys);
    }
    return out;
  }

  function encodeShare(share) {
    return "share:" + (share.index | 0) + ":" + toHex(share.payload);
  }

  function parseShare(line) {
    line = String(line || "").trim();
    var parts = line.split(":");
    if (parts.length !== 3 || parts[0] !== "share") {
      throw new Error("share format must be share:<index>:<hex>");
    }
    return { index: parseInt(parts[1], 10), payload: fromHex(parts[2]) };
  }

  function generatePracticeSecret(byteLen) {
    byteLen = byteLen || 16;
    return toHex(randomBytes(byteLen));
  }

  var api = {
    MAX_N: MAX_N,
    MIN_M: MIN_M,
    VERSION: "0.1.0-edu",
    splitSecret: splitSecret,
    combineShares: combineShares,
    encodeShare: encodeShare,
    parseShare: parseShare,
    utf8Encode: utf8Encode,
    toHex: toHex,
    fromHex: fromHex,
    generatePracticeSecret: generatePracticeSecret,
    randomBytes: randomBytes,
  };

  global.ShamirLab = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
