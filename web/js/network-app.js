(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function updateAck() {
    const on = $("balAck").checked;
    $("btnFetchBal").disabled = !on;
    $("btnLoadLab").disabled = !on;
  }

  async function fetchSnapshot() {
    const api = globalThis.NetworkApi;
    if (!api) {
      setStatus($("snapStatus"), "Network API not loaded.", "err");
      return;
    }
    setStatus($("snapStatus"), "Fetching public data from mempool.space…", "");
    $("snapResult").hidden = true;
    try {
      const feesRaw = await api.fetchJson(api.feesUrl());
      const fees = api.parseFeesJson(feesRaw);
      if (fees.status !== "ok") {
        setStatus($("snapStatus"), "Fees unavailable: " + (fees.detail || "error"), "err");
        return;
      }

      let tipText = "";
      try {
        tipText = await api.fetchText(api.tipHeightUrl());
      } catch (e) {
        tipText = "";
      }
      const tip = api.parseTipHeight(tipText);

      let memRaw = null;
      try {
        memRaw = await api.fetchJson(api.mempoolUrl());
      } catch (e) {
        memRaw = null;
      }
      const mem = memRaw ? api.parseMempoolJson(memRaw) : { status: "error", detail: "mempool fetch failed" };

      const b = fees.bands;
      const vb = fees.exampleVbytes;
      $("feeOut").textContent = [
        "fastest     " + b.fastestFee + " sat/vB",
        "halfHour    " + b.halfHourFee + " sat/vB",
        "hour        " + b.hourFee + " sat/vB",
        "economy     " + b.economyFee + " sat/vB",
        "minimum     " + b.minimumFee + " sat/vB",
      ].join("\n");

      const ex = api.exampleFeeSats(b.halfHourFee, vb);
      $("feeExample").textContent =
        "Example at halfHourFee × " +
        vb +
        " vB ≈ " +
        ex +
        " sats (" +
        api.satsToBtc(ex) +
        " BTC). Estimate only — real txs vary.";

      const trafficLines = [];
      if (tip.status === "ok") trafficLines.push("Tip block height: " + tip.height);
      else trafficLines.push("Tip height: unknown (" + (tip.detail || "error") + ")");
      if (mem.status === "ok") {
        trafficLines.push("Mempool tx count: " + mem.count);
        if (mem.vsize != null) trafficLines.push("Mempool vsize: " + mem.vsize + " vB");
      } else {
        trafficLines.push("Mempool: unknown (" + (mem.detail || "error") + ")");
      }
      $("trafficOut").textContent = trafficLines.join("\n");
      $("snapResult").hidden = false;
      setStatus($("snapStatus"), "Snapshot OK (public API).", "ok");
    } catch (e) {
      setStatus(
        $("snapStatus"),
        "Snapshot failed: " + (e && e.message ? e.message : e) + " (not showing fake zeros).",
        "err"
      );
    }
  }

  function loadFromLab() {
    const api = globalThis.NetworkApi;
    if (!api) return;
    if (!$("balAck").checked) {
      setStatus($("balStatus"), "Acknowledge the address leak first.", "err");
      return;
    }
    const list = api.loadSessionAddresses();
    if (!list.length) {
      setStatus(
        $("balStatus"),
        "No Lab addresses in this browser session. Open Lab, Generate/derive, then return here.",
        "err"
      );
      return;
    }
    $("balAddrs").value = list.join("\n");
    setStatus($("balStatus"), "Loaded " + list.length + " address(es) from Lab session.", "ok");
  }

  function renderBalRows(rows) {
    const tbody = $("balTableBody");
    tbody.innerHTML = "";
    if (!rows.length) {
      const tr = document.createElement("tr");
      tr.className = "empty-row";
      const td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "No balances yet.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    rows.forEach((r, i) => {
      const tr = document.createElement("tr");
      const cells = [
        String(i),
        r.address,
        r.status,
        r.satoshis == null ? "—" : String(r.satoshis),
        r.detail || "",
      ];
      cells.forEach((text, j) => {
        const td = document.createElement("td");
        if (j === 1) {
          td.className = "addr";
          const span = document.createElement("span");
          span.className = "addr-text";
          span.textContent = text;
          td.appendChild(span);
        } else {
          td.textContent = text;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  async function fetchBalances() {
    const api = globalThis.NetworkApi;
    if (!api) return;
    if (!$("balAck").checked) {
      setStatus($("balStatus"), "Acknowledge the address leak first.", "err");
      return;
    }
    const addrs = api.parseAddressList($("balAddrs").value);
    if (!addrs.length) {
      setStatus($("balStatus"), "Add at least one address (not a seed phrase).", "err");
      return;
    }
    setStatus($("balStatus"), "Fetching " + addrs.length + " address(es)…", "");
    const rows = [];
    for (let i = 0; i < addrs.length; i++) {
      const address = addrs[i];
      try {
        const data = await api.fetchJson(api.addressUrl(address));
        const parsed = api.parseAddressBalanceJson(data);
        rows.push({
          address,
          status: parsed.status,
          satoshis: parsed.satoshis,
          detail: parsed.detail,
        });
      } catch (e) {
        rows.push({
          address,
          status: "unknown",
          satoshis: null,
          detail: e && e.message ? e.message : String(e),
        });
      }
      // gentle pacing
      if (i + 1 < addrs.length) {
        await new Promise((r) => setTimeout(r, 120));
      }
    }
    renderBalRows(rows);
    const okN = rows.filter((r) => r.status === "ok").length;
    const unk = rows.length - okN;
    setStatus(
      $("balStatus"),
      "Done: " + okN + " ok, " + unk + " unknown/error (fail-closed; no fake zeros on failure).",
      unk ? "" : "ok"
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("balAck").addEventListener("change", updateAck);
    updateAck();
    $("btnFetchSnap").addEventListener("click", () => fetchSnapshot().catch(console.error));
    $("btnLoadLab").addEventListener("click", loadFromLab);
    $("btnFetchBal").addEventListener("click", () => fetchBalances().catch(console.error));
    setStatus($("snapStatus"), "Idle — click Fetch when you want public fee/traffic data.", "");
    setStatus($("balStatus"), "Idle — ack leak, then load/paste addresses.", "");
  });
})();
