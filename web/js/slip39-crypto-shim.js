/**
 * Browser shim for Node `crypto` APIs used by npm `slip39` (randomBytes, pbkdf2Sync, createHmac).
 * Bundled offline via esbuild --alias:crypto=…
 */
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { pbkdf2 } from "@noble/hashes/pbkdf2";

function toU8(data) {
  if (data instanceof Uint8Array) return data;
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  if (Array.isArray(data)) return Uint8Array.from(data);
  if (data && data.type === "Buffer" && Array.isArray(data.data)) {
    return Uint8Array.from(data.data);
  }
  return Uint8Array.from(data || []);
}

function randomBytes(length) {
  const out = new Uint8Array(length);
  crypto.getRandomValues(out);
  return out;
}

function pbkdf2Sync(password, salt, iterations, keylen, digest) {
  if (String(digest).toLowerCase() !== "sha256") {
    throw new Error("slip39-crypto-shim: only sha256 pbkdf2 supported");
  }
  return pbkdf2(sha256, toU8(password), toU8(salt), {
    c: iterations,
    dkLen: keylen,
  });
}

function createHmac(algorithm, key) {
  if (String(algorithm).toLowerCase() !== "sha256") {
    throw new Error("slip39-crypto-shim: only sha256 hmac supported");
  }
  const chunks = [];
  return {
    update(data) {
      chunks.push(toU8(data));
      return this;
    },
    digest() {
      let total = 0;
      for (const c of chunks) total += c.length;
      const msg = new Uint8Array(total);
      let off = 0;
      for (const c of chunks) {
        msg.set(c, off);
        off += c.length;
      }
      return hmac(sha256, toU8(key), msg);
    },
  };
}

const api = { randomBytes, pbkdf2Sync, createHmac };
export default api;
export { randomBytes, pbkdf2Sync, createHmac };
