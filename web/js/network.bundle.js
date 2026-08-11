(() => {
  // web/js/network-api.mjs (IIFE bundle)

const MEMPOOL_PUBLIC = "https://mempool.space/api";
const MEMPOOL_PROXY_PATH = "/api/mempool";
const EXAMPLE_VBYTES = 140; // simple 1-in-2-out P2WPKH estimate
const SESSION_ADDR_KEY = "bip39lab.derivedAddresses";
const FETCH_TIMEOUT_MS = 20_000;

/** @deprecated use resolveMempoolBase() — kept for tests/docs */
const MEMPOOL_BASE = MEMPOOL_PUBLIC;

/**
 * Prefer same-origin proxy on Catalyxt hosts; otherwise public API.
 */
function resolveMempoolBase() {
  try {
    if (typeof location !== "undefined" && location.protocol && location.protocol.indexOf("http") === 0) {
      const host = String(location.hostname || "");
      if (host === "bip39.catalyxt.xyz" || /\.catalyxt\.xyz$/i.test(host) || host === "catalyxt.xyz") {
        return MEMPOOL_PROXY_PATH;
      }
    }
  } catch (e) {
    /* ignore */
  }
  return MEMPOOL_PUBLIC;
}

function feesUrl(base) {
  return (base || resolveMempoolBase()) + "/v1/fees/recommended";
}

function tipHeightUrl(base) {
  return (base || resolveMempoolBase()) + "/blocks/tip/height";
}

function mempoolUrl(base) {
  return (base || resolveMempoolBase()) + "/mempool";
}

function addressUrl(addr, base) {
  return (base || resolveMempoolBase()) + "/address/" + encodeURIComponent(addr);
}

/**
 * If primary base fails, try the other (proxy ↔ public).
 */
function alternateBase(primary) {
  const p = String(primary || "");
  if (p.indexOf("/api/mempool") === 0 || p.indexOf("/api/mempool") >= 0 && p.indexOf("mempool.space") < 0) {
    return MEMPOOL_PUBLIC;
  }
  if (p.indexOf("mempool.space") >= 0) {
    try {
      if (typeof location !== "undefined" && location.origin) {
        return location.origin + MEMPOOL_PROXY_PATH;
      }
    } catch (e) {
      /* ignore */
    }
    return MEMPOOL_PROXY_PATH;
  }
  return null;
}

/**
 * @returns {{ status: 'ok'|'error', bands?: object, exampleVbytes?: number, detail?: string }}
 */
function parseFeesJson(data) {
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

function exampleFeeSats(satPerVb, vbytes) {
  const a = Number(satPerVb);
  const b = Number(vbytes);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) return null;
  return Math.round(a * b);
}

function satsToBtc(sats) {
  if (sats == null || sats === "") return "—";
  const n = Number(sats);
  if (!Number.isFinite(n)) return "—";
  return (n / 1e8).toFixed(8);
}

/**
 * @returns {{ status: 'ok'|'error', height?: number, detail?: string }}
 */
function parseTipHeight(text) {
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
function parseMempoolJson(data) {
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
function parseAddressBalanceJson(data) {
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
function looksLikeBtcAddress(s) {
  const t = String(s || "").trim();
  if (!t || t.length < 14 || t.length > 128) return false;
  if (/\s/.test(t)) return false;
  if (/xprv|yprv|zprv|tprv|mnemonic|seed/i.test(t)) return false;
  // Bech32 / Bech32m (bc1 / tb1 / bcrt1) or Base58 (1… / 3… / m… / n… / 2…)
  return /^(bc1|tb1|bcrt1)[a-z0-9]{11,}$/i.test(t) || /^[13mn2][a-km-zA-HJ-NP-Z1-9]{14,}$/.test(t);
}

function parseAddressList(text) {
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

function loadSessionAddresses() {
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

function saveSessionAddresses(addrs) {
  try {
    const list = parseAddressList((addrs || []).join("\n"));
    sessionStorage.setItem(SESSION_ADDR_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    return [];
  }
}

function rewriteUrlBase(url, fromBase, toBase) {
  if (!fromBase || !toBase || fromBase === toBase) return null;
  const u = String(url);
  if (u.indexOf(fromBase) !== 0) return null;
  return toBase + u.slice(fromBase.length);
}

async function fetchOnce(url, fetcher, asText) {
  const f = fetcher || fetch;
  const opts = { method: "GET", credentials: "omit", cache: "no-store" };
  let timer = null;
  if (typeof AbortController !== "undefined") {
    const ctrl = new AbortController();
    opts.signal = ctrl.signal;
    timer = setTimeout(function () {
      try {
        ctrl.abort();
      } catch (e) {
        /* ignore */
      }
    }, FETCH_TIMEOUT_MS);
  }
  try {
    const res = await f(url, opts);
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    if (asText) {
      return res.text();
    }
    const ct = (res.headers && res.headers.get && res.headers.get("content-type")) || "";
    const text = await res.text();
    if (
      ct.indexOf("json") >= 0 ||
      url.indexOf("/address/") >= 0 ||
      url.indexOf("fees") >= 0 ||
      url.indexOf("mempool") >= 0
    ) {
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    }
    return text;
  } catch (e) {
    const name = e && e.name ? e.name : "";
    const msg = e && e.message ? e.message : String(e);
    if (name === "AbortError" || /aborted/i.test(msg)) {
      throw new Error("timeout after " + FETCH_TIMEOUT_MS / 1000 + "s");
    }
    // Browser TypeError: Failed to fetch → clearer
    if (/Failed to fetch|NetworkError|Load failed/i.test(msg)) {
      throw new Error("network blocked or unreachable (" + url + ")");
    }
    throw e instanceof Error ? e : new Error(msg);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Browser fetch wrapper — inject for tests; retries alternate base once */
async function fetchJson(url, fetcher) {
  try {
    return await fetchOnce(url, fetcher, false);
  } catch (first) {
    const primary = resolveMempoolBase();
    const alt = alternateBase(primary);
    const altUrl = alt ? rewriteUrlBase(url, primary, alt) : null;
    if (!altUrl || altUrl === url) throw first;
    try {
      return await fetchOnce(altUrl, fetcher, false);
    } catch (second) {
      throw first;
    }
  }
}

async function fetchText(url, fetcher) {
  try {
    return await fetchOnce(url, fetcher, true);
  } catch (first) {
    const primary = resolveMempoolBase();
    const alt = alternateBase(primary);
    const altUrl = alt ? rewriteUrlBase(url, primary, alt) : null;
    if (!altUrl || altUrl === url) throw first;
    try {
      return await fetchOnce(altUrl, fetcher, true);
    } catch (second) {
      throw first;
    }
  }
}

const g = typeof globalThis !== "undefined" ? globalThis : undefined;
const NetworkApi = {
  MEMPOOL_BASE,
  MEMPOOL_PUBLIC,
  MEMPOOL_PROXY_PATH,
  EXAMPLE_VBYTES,
  SESSION_ADDR_KEY,
  FETCH_TIMEOUT_MS,
  resolveMempoolBase,
  alternateBase,
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

})();
