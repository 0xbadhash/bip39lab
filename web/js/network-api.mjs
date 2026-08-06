/**
 * mempool.space REST helpers + pure parsers (Option C).
 * No secrets — addresses and public chain data only.
 */

export const MEMPOOL_BASE = "https://mempool.space/api";
export const EXAMPLE_VBYTES = 140; // simple 1-in-2-out P2WPKH estimate
export const SESSION_ADDR_KEY = "bip39lab.derivedAddresses";

export function feesUrl() {
  return MEMPOOL_BASE + "/v1/fees/recommended";
}

export function tipHeightUrl() {
  return MEMPOOL_BASE + "/blocks/tip/height";
}

export function mempoolUrl() {
  return MEMPOOL_BASE + "/mempool";
}

export function addressUrl(addr) {
  return MEMPOOL_BASE + "/address/" + encodeURIComponent(addr);
}

/**
 * @returns {{ status: 'ok'|'error', bands?: object, exampleVbytes?: number, detail?: string }}
 */
export function parseFeesJson(data) {
  try {
    if (!data || typeof data !== "object") {
      return { status: "error", detail: "invalid fees payload" };
    }
    const keys = ["fastestFee", "halfHourFee", "hourFee", "economyFee", "minimumFee"];
    const bands = {};
    for (const k of keys) {
      if (data[k] == null || Number.isNaN(Number(data[k]))) {
        return { status: "error", detail: "missing fee field " + k };
      }
      bands[k] = Number(data[k]);
    }
    return { status: "ok", bands, exampleVbytes: EXAMPLE_VBYTES };
  } catch (e) {
    return { status: "error", detail: String(e && e.message ? e.message : e) };
  }
}

export function exampleFeeSats(satPerVb, vbytes) {
  return Math.round(Number(satPerVb) * Number(vbytes));
}

export function satsToBtc(sats) {
  return (Number(sats) / 1e8).toFixed(8);
}

/**
 * @returns {{ status: 'ok'|'error', height?: number, detail?: string }}
 */
export function parseTipHeight(text) {
  try {
    const n = parseInt(String(text).trim(), 10);
    if (!Number.isFinite(n) || n < 0) {
      return { status: "error", detail: "invalid tip height" };
    }
    return { status: "ok", height: n };
  } catch (e) {
    return { status: "error", detail: String(e && e.message ? e.message : e) };
  }
}

/**
 * @returns {{ status: 'ok'|'error', count?: number, vsize?: number, detail?: string }}
 */
export function parseMempoolJson(data) {
  try {
    if (!data || typeof data !== "object") {
      return { status: "error", detail: "invalid mempool payload" };
    }
    const count = Number(data.count);
    const vsize = Number(data.vsize);
    if (!Number.isFinite(count)) {
      return { status: "error", detail: "missing mempool count" };
    }
    return {
      status: "ok",
      count,
      vsize: Number.isFinite(vsize) ? vsize : null,
    };
  } catch (e) {
    return { status: "error", detail: String(e && e.message ? e.message : e) };
  }
}

/**
 * Fail-closed: never invent 0 on failure.
 * True empty UTXO set from valid API → ok, satoshis 0.
 * @returns {{ status: 'ok'|'unknown'|'error', satoshis: number|null, detail: string }}
 */
export function parseAddressBalanceJson(data) {
  try {
    if (!data || typeof data !== "object") {
      return { status: "unknown", satoshis: null, detail: "invalid address payload" };
    }
    const chain = data.chain_stats || {};
    if (chain.funded_txo_sum == null && chain.spent_txo_sum == null) {
      return { status: "unknown", satoshis: null, detail: "missing chain_stats sums" };
    }
    const funded = Number(chain.funded_txo_sum || 0);
    const spent = Number(chain.spent_txo_sum || 0);
    if (!Number.isFinite(funded) || !Number.isFinite(spent)) {
      return { status: "unknown", satoshis: null, detail: "non-numeric chain_stats" };
    }
    return {
      status: "ok",
      satoshis: funded - spent,
      detail: "mempool.space",
    };
  } catch (e) {
    return {
      status: "unknown",
      satoshis: null,
      detail: String(e && e.message ? e.message : e),
    };
  }
}

/** Shape-filter: addresses only — drop mnemonic words and secrets. */
export function looksLikeBtcAddress(s) {
  const t = String(s || "").trim();
  if (!t || t.length < 14 || t.length > 128) return false;
  if (/\s/.test(t)) return false;
  if (/xprv|yprv|zprv|tprv|mnemonic|seed/i.test(t)) return false;
  // Bech32 / Bech32m (bc1 / tb1 / bcrt1) or Base58 (1… / 3… / m… / n… / 2…)
  return /^(bc1|tb1|bcrt1)[a-z0-9]{11,}$/i.test(t) || /^[13mn2][a-km-zA-HJ-NP-Z1-9]{14,}$/.test(t);
}

export function parseAddressList(text) {
  const parts = String(text || "")
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const out = [];
  const seen = Object.create(null);
  for (const p of parts) {
    if (seen[p]) continue;
    if (!looksLikeBtcAddress(p)) continue;
    seen[p] = true;
    out.push(p);
  }
  return out;
}

export function loadSessionAddresses() {
  try {
    const raw = sessionStorage.getItem(SESSION_ADDR_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return parseAddressList(arr.join("\n"));
  } catch (e) {
    return [];
  }
}

export function saveSessionAddresses(addrs) {
  try {
    const list = parseAddressList((addrs || []).join("\n"));
    sessionStorage.setItem(SESSION_ADDR_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    return [];
  }
}

/** Browser fetch wrapper — inject for tests */
export async function fetchJson(url, fetcher) {
  const f = fetcher || fetch;
  const res = await f(url, { method: "GET", credentials: "omit" });
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }
  const ct = (res.headers && res.headers.get && res.headers.get("content-type")) || "";
  if (ct.indexOf("json") >= 0 || url.indexOf("/address/") >= 0 || url.indexOf("fees") >= 0 || url.indexOf("mempool") >= 0) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      // tip height is plain text number
      return text;
    }
  }
  return res.text();
}

export async function fetchText(url, fetcher) {
  const f = fetcher || fetch;
  const res = await f(url, { method: "GET", credentials: "omit" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

const g = typeof globalThis !== "undefined" ? globalThis : undefined;
export const NetworkApi = {
  MEMPOOL_BASE,
  EXAMPLE_VBYTES,
  SESSION_ADDR_KEY,
  feesUrl,
  tipHeightUrl,
  mempoolUrl,
  addressUrl,
  parseFeesJson,
  parseTipHeight,
  parseMempoolJson,
  parseAddressBalanceJson,
  looksLikeBtcAddress,
  parseAddressList,
  exampleFeeSats,
  satsToBtc,
  loadSessionAddresses,
  saveSessionAddresses,
  fetchJson,
  fetchText,
};
if (g) g.NetworkApi = NetworkApi;
export default NetworkApi;
