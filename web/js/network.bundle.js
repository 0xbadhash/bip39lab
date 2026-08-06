(() => {
  // web/js/network-api.mjs
  var MEMPOOL_BASE = "https://mempool.space/api";
  var EXAMPLE_VBYTES = 140;
  var SESSION_ADDR_KEY = "bip39lab.derivedAddresses";
  function feesUrl() {
    return MEMPOOL_BASE + "/v1/fees/recommended";
  }
  function tipHeightUrl() {
    return MEMPOOL_BASE + "/blocks/tip/height";
  }
  function mempoolUrl() {
    return MEMPOOL_BASE + "/mempool";
  }
  function addressUrl(addr) {
    return MEMPOOL_BASE + "/address/" + encodeURIComponent(addr);
  }
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
    return Math.round(Number(satPerVb) * Number(vbytes));
  }
  function satsToBtc(sats) {
    return (Number(sats) / 1e8).toFixed(8);
  }
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
        vsize: Number.isFinite(vsize) ? vsize : null
      };
    } catch (e) {
      return { status: "error", detail: String(e && e.message ? e.message : e) };
    }
  }
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
        detail: "mempool.space"
      };
    } catch (e) {
      return {
        status: "unknown",
        satoshis: null,
        detail: String(e && e.message ? e.message : e)
      };
    }
  }
  function looksLikeBtcAddress(s) {
    const t = String(s || "").trim();
    if (!t || t.length < 14 || t.length > 128) return false;
    if (/\s/.test(t)) return false;
    if (/xprv|yprv|zprv|tprv|mnemonic|seed/i.test(t)) return false;
    return /^(bc1|tb1|bcrt1)[a-z0-9]{11,}$/i.test(t) || /^[13mn2][a-km-zA-HJ-NP-Z1-9]{14,}$/.test(t);
  }
  function parseAddressList(text) {
    const parts = String(text || "").split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    const out = [];
    const seen = /* @__PURE__ */ Object.create(null);
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
  async function fetchJson(url, fetcher) {
    const f = fetcher || fetch;
    const res = await f(url, { method: "GET", credentials: "omit" });
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    const ct = res.headers && res.headers.get && res.headers.get("content-type") || "";
    if (ct.indexOf("json") >= 0 || url.indexOf("/address/") >= 0 || url.indexOf("fees") >= 0 || url.indexOf("mempool") >= 0) {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    }
    return res.text();
  }
  async function fetchText(url, fetcher) {
    const f = fetcher || fetch;
    const res = await f(url, { method: "GET", credentials: "omit" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.text();
  }
  var g = typeof globalThis !== "undefined" ? globalThis : void 0;
  var NetworkApi = {
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
    fetchText
  };
  if (g) g.NetworkApi = NetworkApi;
  var network_api_default = NetworkApi;
})();
