(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const ENT_BITS_BY_WORDS = {
    12: 128,
    15: 160,
    18: 192,
    21: 224,
    24: 256,
  };

  const titles = {
    lab: {
      title: "Offline BIP-39 lab",
      sub: "Generate, validate, and derive receive addresses — English wordlist only.",
    },
    tools: {
      title: "Lab tools",
      sub: "Paths, entropy pad, descriptors, PSBT inspect, passphrase compare — all offline.",
    },
    glossary: {
      title: "Glossary & security",
      sub: "BIPs, acronyms, no-retention model, and threat notes — plain English.",
    },
  };

  let deriveTimer = null;
  let lastRows = null;
  let entEvents = [];
  const ENT_PAD_MAX = 128;

  function setPrivateVisible(show) {
    document.querySelectorAll("[data-private]").forEach((el) => {
      el.classList.toggle("hidden-private", !show);
    });
  }

  function formatMnemonicEntropy(wordCount) {
    const bits = ENT_BITS_BY_WORDS[wordCount];
    if (!bits) return "—";
    return bits + " bits (" + wordCount + "-word BIP-39)";
  }

  function estimatePassphraseBits(passphrase) {
    if (!passphrase) return null;
    const n = passphrase.length;
    if (n === 0) return null;
    const counts = Object.create(null);
    for (let i = 0; i < n; i++) {
      const ch = passphrase[i];
      counts[ch] = (counts[ch] || 0) + 1;
    }
    let h = 0;
    for (const k in counts) {
      const p = counts[k] / n;
      h -= p * (Math.log(p) / Math.LN2);
    }
    return Math.min(h * n, 256);
  }

  function formatPassphraseStrength(passphrase) {
    const est = estimatePassphraseBits(passphrase);
    if (est == null) return "—";
    return "~" + Math.round(est) + " bits (estimate)";
  }

  function setEntropyMnemonic(text, invalid) {
    const el = $("entropyMnemonic");
    el.textContent = text;
    el.classList.toggle("is-invalid", !!invalid);
  }

  function setEntropyPassphrase(text) {
    $("entropyPassphrase").textContent = text;
  }

  function clearEntropyFields() {
    setEntropyMnemonic("—", false);
    setEntropyPassphrase("—");
  }

  function getDeriveOptions() {
    const account = Math.max(0, parseInt($("deriveAccount").value, 10) || 0);
    const change = $("deriveChange").value === "1" ? 1 : 0;
    let count = parseInt($("deriveCount").value, 10) || 5;
    if (![5, 10, 20].includes(count)) count = 5;
    const network = $("deriveNetwork") && $("deriveNetwork").value === "test" ? "test" : "main";
    return { account, change, count, network };
  }

  const ADDR_TYPE_META = {
    bip86: {
      label: "BIP86 · Taproot",
      help: "Taproot (bc1p…) — newest common format (like a modern IBAN). Path m/86'/0'/account'/change/index.",
      field: "bip86_p2tr",
      purpose: 86,
    },
    bip84: {
      label: "BIP84 · native segwit",
      help: "Native segwit (bc1q…) — widely used. Path m/84'/0'/account'/change/index.",
      field: "bip84_p2wpkh",
      purpose: 84,
    },
    bip49: {
      label: "BIP49 · nested",
      help: "Nested segwit (addresses start with 3) — older compatibility style. Path m/49'/…",
      field: "bip49_p2sh_p2wpkh",
      purpose: 49,
    },
    bip44: {
      label: "BIP44 · legacy",
      help: "Legacy (addresses start with 1) — oldest style still seen on chain. Path m/44'/…",
      field: "bip44_p2pkh",
      purpose: 44,
    },
  };

  const WO_TYPE_META = {
    84: {
      help: "BIP84 zpub — usual Sparrow / mobile watch-only import for native segwit.",
    },
    86: {
      help: "BIP86 xpub — Taproot account public key (watch-only where supported).",
    },
    49: {
      help: "BIP49 ypub — nested segwit account (older wallets).",
    },
    44: {
      help: "BIP44 xpub — legacy P2PKH account public key.",
    },
  };

  function getActiveAddrType() {
    const active = document.querySelector(".seg-tab[data-addr-type].active");
    const t = active && active.getAttribute("data-addr-type");
    return ADDR_TYPE_META[t] ? t : "bip86";
  }

  function getActiveWatchPurpose() {
    const active = document.querySelector(".seg-tab[data-wo-type].active");
    const p = active && parseInt(active.getAttribute("data-wo-type"), 10);
    return [84, 86, 49, 44].indexOf(p) >= 0 ? p : 84;
  }

  function setSegActive(selector, attr, value) {
    document.querySelectorAll(selector).forEach((btn) => {
      const on = btn.getAttribute(attr) === String(value);
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function updateAddrTypeChrome() {
    const t = getActiveAddrType();
    const meta = ADDR_TYPE_META[t];
    const help = $("addrTypeHelp");
    if (help) help.innerHTML = meta.help;
    const hdr = $("addrColHeader");
    if (hdr) hdr.textContent = "Address · " + meta.label;
  }

  function updateWatchTypeChrome() {
    const p = getActiveWatchPurpose();
    const help = $("woTypeHelp");
    if (help && WO_TYPE_META[p]) help.innerHTML = WO_TYPE_META[p].help;
  }

  function updatePathSummary(opts, rowCount) {
    const last = Math.max(0, (rowCount || opts.count) - 1);
    const chWord = opts.change === 1 ? "change (internal leftovers)" : "receive (for people paying you)";
    const t = getActiveAddrType();
    const meta = ADDR_TYPE_META[t];
    const net = opts.network || "main";
    const pathStr =
      typeof BIP39Lab !== "undefined" && BIP39Lab.formatPath
        ? BIP39Lab.formatPath(meta.purpose, net, opts.account, opts.change, "i")
        : "m/" + meta.purpose + "'/" + (net === "test" ? "1" : "0") + "'/" + opts.account + "'/" + opts.change + "/index";

    if ($("derivePathSummary")) {
      $("derivePathSummary").textContent =
        "Showing account " +
        opts.account +
        " · " +
        chWord +
        " · address numbers 0 through " +
        last +
        " · type: " +
        meta.label +
        " · network: " +
        (net === "test" ? "testnet/signet paths" : "mainnet") +
        ". Path pattern: " +
        pathStr;
    }
    updatePathPlayground(opts);
  }

  function updatePathPlayground(opts) {
    const o = opts || getDeriveOptions();
    const t = getActiveAddrType();
    const meta = ADDR_TYPE_META[t];
    const el = $("pathPlayOut");
    if (!el) return;
    const path0 =
      typeof BIP39Lab !== "undefined" && BIP39Lab.formatPath
        ? BIP39Lab.formatPath(meta.purpose, o.network, o.account, o.change, 0)
        : "m/" + meta.purpose + "'/…";
    el.textContent = path0 + "   … through index " + (o.count - 1);
    const help = $("pathPlayHelp");
    if (help) {
      help.textContent =
        meta.label +
        " · coin_type " +
        (o.network === "test" ? "1 (test)" : "0 (main)") +
        " · account " +
        o.account +
        " · change " +
        o.change;
    }
  }

  function setPlainStatus(text, kind) {
    const el = $("deriveStatusPlain");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  /** Visible copy feedback (button label + aria-live strip). Always updates UI even if clipboard API hangs. */
  function setCopyFeedback(btn, state, detail) {
    const idle = btn && (btn.dataset.copyIdle || "Copy");
    if (btn) {
      if (!btn.dataset.copyIdle) btn.dataset.copyIdle = (btn.textContent || "Copy").replace(/^Copied$|^Failed$|^Copying…$/, "Copy") || "Copy";
      btn.classList.remove("copied", "copy-failed", "copying");
      if (state === "ok") {
        btn.textContent = "Copied";
        btn.classList.add("copied");
        btn.setAttribute("aria-label", "Copied to clipboard");
      } else if (state === "err") {
        btn.textContent = "Failed";
        btn.classList.add("copy-failed");
        btn.setAttribute("aria-label", "Copy failed");
      } else if (state === "pending") {
        btn.textContent = "Copying…";
        btn.classList.add("copying");
      } else {
        btn.textContent = btn.dataset.copyIdle || idle || "Copy";
        btn.setAttribute("aria-label", "Copy address to clipboard");
      }
    }
    const live = $("copyFeedback");
    if (live) {
      if (state === "ok") {
        live.textContent = "Copied to clipboard: " + (detail || "").slice(0, 72) + ((detail || "").length > 72 ? "…" : "");
        live.className = "copy-feedback ok";
      } else if (state === "err") {
        live.textContent = "Copy failed — select the text and copy manually.";
        live.className = "copy-feedback err";
      } else if (state === "pending") {
        live.textContent = "Copying…";
        live.className = "copy-feedback";
      } else {
        live.textContent = "";
        live.className = "copy-feedback";
      }
    }
  }

  function copyAddress(addr, btn) {
    if (!addr) return;
    const restoreMs = 2000;
    const idleLabel =
      btn && btn.dataset.copyIdle
        ? btn.dataset.copyIdle
        : btn && btn.textContent && !/^(Copied|Failed|Copying…)$/.test(btn.textContent)
          ? btn.textContent
          : btn && btn.getAttribute("aria-label") && /key/i.test(btn.getAttribute("aria-label") || "")
            ? "Copy key"
            : "Copy";
    if (btn) btn.dataset.copyIdle = idleLabel;

    setCopyFeedback(btn, "pending", addr);

    const succeed = () => {
      setCopyFeedback(btn, "ok", addr);
      window.clearTimeout(btn && btn._copyTimer);
      if (btn) {
        btn._copyTimer = window.setTimeout(() => setCopyFeedback(btn, "idle"), restoreMs);
      } else {
        window.setTimeout(() => setCopyFeedback(null, "idle"), restoreMs);
      }
    };

    const fail = () => {
      setCopyFeedback(btn, "err", addr);
      setStatus("Could not copy — select the address manually.", "err");
      window.clearTimeout(btn && btn._copyTimer);
      if (btn) {
        btn._copyTimer = window.setTimeout(() => setCopyFeedback(btn, "idle"), restoreMs);
      }
    };

    // Prefer sync fallback first (more reliable for some automation agents / permission edge cases),
    // then try async clipboard API.
    let wrote = false;
    try {
      wrote = fallbackCopySync(addr);
    } catch (e) {
      wrote = false;
    }

    if (wrote) {
      succeed();
      // Best-effort modern API (ignore result)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).catch(function () {});
      }
      return;
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      const p = navigator.clipboard.writeText(addr);
      if (p && typeof p.then === "function") {
        p.then(succeed).catch(fail);
        // If the promise never settles (some agents), still show outcome after timeout
        window.setTimeout(function () {
          if (btn && btn.textContent === "Copying…") {
            // leave pending only briefly — attempt fail so user sees feedback
            fail();
          }
        }, 2500);
        return;
      }
    }
    fail();
  }

  function fallbackCopySync(addr) {
    const ta = document.createElement("textarea");
    ta.value = addr;
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.padding = "0";
    ta.style.border = "none";
    ta.style.outline = "none";
    ta.style.boxShadow = "none";
    ta.style.background = "transparent";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, addr.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
    return !!ok;
  }

  function addrFromRow(row, typeKey) {
    const meta = ADDR_TYPE_META[typeKey] || ADDR_TYPE_META.bip86;
    return row[meta.field] || "";
  }

  function makeAddrRow(row) {
    const typeKey = getActiveAddrType();
    const addr = addrFromRow(row, typeKey);
    const tr = document.createElement("tr");

    const tdIdx = document.createElement("td");
    tdIdx.className = "idx";
    tdIdx.textContent = String(row.index);
    tr.appendChild(tdIdx);

    const tdAddr = document.createElement("td");
    tdAddr.className = "addr";
    const wrap = document.createElement("div");
    wrap.className = "addr-cell";
    const span = document.createElement("span");
    span.className = "addr-text";
    span.textContent = addr;
    span.title = addr;
    wrap.appendChild(span);
    tdAddr.appendChild(wrap);
    tr.appendChild(tdAddr);

    const tdAct = document.createElement("td");
    tdAct.className = "col-actions";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-copy";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy address to clipboard");
    btn.addEventListener("click", () => copyAddress(addr, btn));
    const btnQr = document.createElement("button");
    btnQr.type = "button";
    btnQr.className = "btn-copy";
    btnQr.textContent = "QR";
    btnQr.setAttribute("aria-label", "Show address QR code");
    btnQr.addEventListener("click", () =>
      showQr(addr, "Receive address · " + (ADDR_TYPE_META[typeKey] || {}).label).catch(console.error)
    );
    tdAct.appendChild(btn);
    tdAct.appendChild(document.createTextNode(" "));
    tdAct.appendChild(btnQr);
    tr.appendChild(tdAct);

    return tr;
  }

  async function showQr(text, label) {
    if (!text) return;
    if (!BIP39Lab.qrDataUrl) {
      setStatus("QR not available in this build.", "err");
      return;
    }
    const url = await BIP39Lab.qrDataUrl(text, { width: 220 });
    $("qrModalLabel").textContent = label || "QR";
    $("qrModalText").textContent = text;
    $("qrModalImg").src = url;
    $("qrModal").hidden = false;
  }

  function hideQr() {
    $("qrModal").hidden = true;
    $("qrModalImg").removeAttribute("src");
  }

  /** Last full exportWatchOnly result (all purposes); UI filters by checkboxes. */
  let lastWatchExport = null;

  function renderWatchOnlyList(exp) {
    const list = $("watchOnlyList");
    if (!list) return;
    list.innerHTML = "";
    updateWatchTypeChrome();

    if (!exp || !exp.keys || !exp.keys.length) {
      list.innerHTML =
        "<p class=\"control-help\">Generate or paste a valid phrase, then refresh (or wait for auto-derive).</p>";
      return;
    }

    const purpose = getActiveWatchPurpose();
    const k = exp.keys.find((x) => x.purpose === purpose);
    if (!k) {
      list.innerHTML =
        "<p class=\"control-help\">No key for this type. Refresh after generating a phrase.</p>";
      return;
    }

    const item = document.createElement("div");
    item.className = "watch-item";
    item.setAttribute("data-purpose", String(k.purpose));
    item.innerHTML =
      "<div class=\"watch-item-title\"></div>" +
      "<div class=\"watch-item-path\"></div>" +
      "<div class=\"watch-item-key\"></div>" +
      "<p class=\"watch-item-note\"></p>" +
      "<div class=\"row\"></div>";
    item.querySelector(".watch-item-title").textContent = k.label;
    item.querySelector(".watch-item-path").textContent = k.path + " · account " + exp.account;
    item.querySelector(".watch-item-key").textContent = k.key;
    item.querySelector(".watch-item-note").textContent = k.note;
    const row = item.querySelector(".row");
    const bCopy = document.createElement("button");
    bCopy.type = "button";
    bCopy.className = "btn-copy";
    bCopy.textContent = "Copy key";
    bCopy.dataset.copyIdle = "Copy key";
    bCopy.setAttribute("aria-label", "Copy key to clipboard");
    bCopy.addEventListener("click", () => copyAddress(k.key, bCopy));
    const bQr = document.createElement("button");
    bQr.type = "button";
    bQr.className = "btn-copy";
    bQr.textContent = "QR";
    bQr.setAttribute("aria-label", "Show key QR code");
    bQr.addEventListener("click", () => showQr(k.key, k.label + " · " + k.path).catch(console.error));
    row.appendChild(bCopy);
    row.appendChild(bQr);
    list.appendChild(item);
  }

  async function refreshWatchOnly() {
    const list = $("watchOnlyList");
    if (!list) return;
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    const account = getDeriveOptions().account;
    if (!m) {
      lastWatchExport = null;
      list.innerHTML =
        "<p class=\"control-help\">Generate or paste a valid phrase, then refresh (or wait for auto-derive).</p>";
      return;
    }
    if (!BIP39Lab.exportWatchOnly) {
      list.innerHTML = "<p class=\"control-help\">Watch-only export not available in this build.</p>";
      return;
    }
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        lastWatchExport = null;
        list.innerHTML =
          "<p class=\"control-help\">Invalid recovery phrase — cannot export watch-only keys.</p>";
        return;
      }
      lastWatchExport = await BIP39Lab.exportWatchOnly(m, pp, {
        account,
        network: getDeriveOptions().network,
      });
      renderWatchOnlyList(lastWatchExport);
    } catch (e) {
      lastWatchExport = null;
      list.innerHTML =
        "<p class=\"control-help\">Export failed: " +
        (e && e.message ? e.message : e) +
        "</p>";
    }
  }

  function clearAddressTable(message) {
    lastRows = null;
    const tbody = $("addrTableBody");
    tbody.innerHTML = "";
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = 3;
    td.textContent =
      message ||
      "Generate or paste a valid recovery phrase to list receive addresses (like printing cheque numbers from a pad).";
    tr.appendChild(td);
    tbody.appendChild(tr);
    updateAddrTypeChrome();
  }

  function fillAddressTable(result) {
    const tbody = $("addrTableBody");
    tbody.innerHTML = "";
    const rows = result.rows || [];
    lastRows = rows;
    updateAddrTypeChrome();
    if (!rows.length) {
      clearAddressTable();
      return;
    }
    for (const r of rows) {
      tbody.appendChild(makeAddrRow(r));
    }
  }

  async function refreshMnemonicEntropy() {
    const m = $("mnemonic").value.trim();
    if (!m) {
      setEntropyMnemonic("—", false);
      return false;
    }
    const parts = m.split(/\s+/).filter(Boolean);
    const n = parts.length;
    if (!ENT_BITS_BY_WORDS[n]) {
      setEntropyMnemonic("Invalid length (need 12/15/18/21/24 words)", true);
      return false;
    }
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        setEntropyMnemonic("Invalid (wordlist or checksum)", true);
        return false;
      }
      setEntropyMnemonic(formatMnemonicEntropy(n), false);
      return true;
    } catch (e) {
      setEntropyMnemonic("Invalid (wordlist or checksum)", true);
      return false;
    }
  }

  function refreshPassphraseEntropy() {
    setEntropyPassphrase(formatPassphraseStrength($("passphrase").value));
  }

  async function deriveNow(opts) {
    const quiet = opts && opts.quiet;
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    const path = getDeriveOptions();
    updatePathSummary(path, path.count);
    if (!m) {
      clearAddressTable();
      setPlainStatus("No phrase yet — generate one or paste a valid recovery phrase.", "");
      return;
    }
    if (!quiet) setStatus("Working…", "");
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        if (!quiet) setStatus("Invalid mnemonic (wordlist or checksum).", "err");
        clearAddressTable("Invalid recovery phrase — fix words/checksum to list addresses.");
        setPlainStatus("Invalid phrase — addresses cannot be listed until it checks out.", "err");
        await refreshMnemonicEntropy();
        return;
      }
      const result = await BIP39Lab.deriveAddresses(m, pp, path);
      fillAddressTable(result);
      // Bridge for Network page: addresses only (never mnemonic)
      saveSessionAddresses(result);
      updatePathSummary(path, (result.rows && result.rows.length) || path.count);
      const plain =
        "Done offline. Listed " +
        path.count +
        " address numbers (0–" +
        (path.count - 1) +
        ") for account " +
        path.account +
        ", " +
        (path.change === 1 ? "change (internal)" : "receive (for payments)") +
        ". Same phrase + settings always give the same list — like a fixed chequebook. " +
        "A passphrase acts like a secret second password and changes every address. " +
        "This table does not show balances or spend coins.";
      setPlainStatus(plain, "ok");
      if (!quiet) {
        setStatus(
          "Derived offline · " +
            path.count +
            " addresses · account " +
            path.account +
            " · change " +
            path.change +
            ".",
          "ok"
        );
      }
      await refreshMnemonicEntropy();
      refreshPassphraseEntropy();
      await refreshWatchOnly();
    } catch (e) {
      if (!quiet) setStatus("Error: " + (e && e.message ? e.message : e), "err");
      clearAddressTable("Derivation failed.");
      setPlainStatus("Something went wrong while deriving addresses.", "err");
      await refreshMnemonicEntropy();
    }
  }

  function scheduleDerive() {
    if (deriveTimer) clearTimeout(deriveTimer);
    deriveTimer = setTimeout(() => {
      deriveNow({ quiet: true }).catch(console.error);
    }, 280);
  }

  function clearSecrets() {
    $("mnemonic").value = "";
    $("passphrase").value = "";
    clearAddressTable();
    clearEntropyFields();
    setPlainStatus("Cleared — nothing was saved to disk.", "");
    setStatus("Cleared (memory fields only; nothing was stored).", "");
  }

  function setStatus(text, kind) {
    const el = $("status");
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function saveSessionAddresses(result) {
    try {
      const addrs = [];
      const seen = Object.create(null);
      (result.rows || []).forEach((r) => {
        ["bip86_p2tr", "bip84_p2wpkh", "bip49_p2sh_p2wpkh", "bip44_p2pkh"].forEach((k) => {
          const a = r[k];
          if (a && !seen[a]) {
            seen[a] = true;
            addrs.push(a);
          }
        });
      });
      if (addrs.length) {
        sessionStorage.setItem("bip39lab.derivedAddresses", JSON.stringify(addrs));
      }
      return addrs;
    } catch (e) {
      return [];
    }
  }

  function showTab(name) {
    // about → glossary (merged option B); balance panel removed → Network for live balances + CLI notes
    if (name === "about") name = "glossary";
    if (name === "balance") {
      window.location.href = "network.html#netCardBal";
      return;
    }
    const allowed = { lab: true, tools: true, glossary: true };
    if (!allowed[name]) name = "lab";
    // expose for step-rail / help-ui deep links
    window.__bip39ShowTab = showTab;

    document.querySelectorAll(".panel").forEach((p) => {
      const on = p.id === "panel-" + name;
      p.classList.toggle("active", on);
      p.hidden = !on;
    });

    document.querySelectorAll(".nav-item[data-nav]").forEach((el) => {
      const nav = el.getAttribute("data-nav");
      const on = nav === name;
      el.classList.toggle("active", on);
      if (on) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });

    const t = titles[name] || titles.lab;
    if ($("panel-title")) $("panel-title").textContent = t.title;
    if ($("panel-sub")) $("panel-sub").textContent = t.sub;

    try {
      if (name === "lab") {
        if (location.hash) history.replaceState(null, "", location.pathname + location.search);
      } else if (location.hash !== "#" + name) {
        history.replaceState(null, "", "#" + name);
      }
    } catch (e) {
      /* ignore */
    }
    if (name === "tools") updatePathPlayground(getDeriveOptions());
  }

  function tabFromHash() {
    const h = (location.hash || "").replace(/^#/, "");
    if (h === "about" || h === "threat" || h === "security") return "glossary";
    // Old #balance deep link → Network (live balances + CLI guidance)
    if (h === "balance") return "balance";
    if (h === "lab" || h === "tools" || h === "glossary") return h;
    if (h.indexOf("gloss-") === 0 || h === "glossary-security" || h === "glossary-threat") return "glossary";
    return "lab";
  }

  function updateAirgapChip() {
    const el = $("chipAirgap");
    if (!el) return;
    const on = typeof navigator !== "undefined" && navigator.onLine;
    el.textContent = on ? "Browser online" : "Browser offline";
    el.classList.toggle("chip-ok", !!on);
    el.classList.toggle("chip-bad", !on);
    el.classList.remove("chip-warn");
    el.title = on
      ? "Browser reports online (green). Lab crypto still stays on-page via CSP — click (i) for why this chip exists."
      : "Browser reports offline (red). Extra air-gap signal, not a guarantee — click (i) for why this chip exists.";
  }

  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("bip39lab.theme", t);
    } catch (e) {
      /* ignore */
    }
    const btn = $("btnTheme");
    if (btn) btn.textContent = "Theme: " + t;
  }

  function initTheme() {
    let t = "dark";
    try {
      t = localStorage.getItem("bip39lab.theme") || "dark";
    } catch (e) {
      t = "dark";
    }
    applyTheme(t);
  }

  function refreshEntPad() {
    const out = $("entPadOut");
    const meta = $("entPadMeta");
    if (!out) return;
    if (!entEvents.length) {
      out.textContent = "—";
      if (meta) meta.textContent = "0 events · ~0 bits (estimate)";
      return;
    }
    out.textContent = entEvents.join(" ");
    // rough: d6 ~ 2.58 bits, coin 1 bit
    let bits = 0;
    entEvents.forEach((e) => {
      if (e.indexOf("d6:") === 0) bits += 2.58;
      else if (e.indexOf("coin:") === 0) bits += 1;
    });
    if (meta) {
      meta.textContent =
        entEvents.length + " events · ~" + Math.round(bits) + " bits (estimate, not CSPRNG)";
    }
  }

  /** Ensure #mnemonic is a valid BIP-39 phrase; generate one on Tools if empty/invalid. */
  async function ensureLabMnemonic(opts) {
    opts = opts || {};
    const el = $("mnemonic");
    if (!el) return { ok: false, mnemonic: "", generated: false };
    let m = el.value.trim();
    if (m && (await BIP39Lab.validateMnemonic(m))) {
      return { ok: true, mnemonic: m, generated: false };
    }
    if (opts.generate === false) {
      return { ok: false, mnemonic: "", generated: false };
    }
    const n = parseInt(($("wordCount") && $("wordCount").value) || "12", 10) || 12;
    m = await BIP39Lab.generateMnemonic(n);
    el.value = m;
    if (typeof refreshMnemonicEntropy === "function") {
      await refreshMnemonicEntropy().catch(function () {});
    }
    if (typeof refreshPassphraseEntropy === "function") refreshPassphraseEntropy();
    return { ok: true, mnemonic: m, generated: true };
  }

  async function comparePassphrases() {
    const out = $("cmpPpOut");
    if (!out) return;
    const ens = await ensureLabMnemonic({ generate: true });
    if (!ens.ok) {
      out.textContent = "Could not generate a mnemonic. Check that BIP39Lab is loaded.";
      return;
    }
    const m = ens.mnemonic;
    const a = ($("cmpPpA") && $("cmpPpA").value) || "";
    const b = ($("cmpPpB") && $("cmpPpB").value) || "";
    const path = Object.assign({}, getDeriveOptions(), { count: 1 });
    const ra = await BIP39Lab.deriveAddresses(m, a, path);
    const rb = await BIP39Lab.deriveAddresses(m, b, path);
    const field = ADDR_TYPE_META[getActiveAddrType()].field;
    const aa = ra.rows[0][field];
    const bb = rb.rows[0][field];
    const note = ens.generated
      ? "Generated a " + m.split(/\s+/).length + "-word test phrase on Lab (shared).\n"
      : "";
    out.textContent =
      note +
      "A: " +
      aa +
      "\nB: " +
      bb +
      "\n" +
      (aa === bb ? "Same address (passphrases match or both empty)." : "Different — passphrase changed the vault.");
  }

  async function refreshDescriptors() {
    const out = $("descOut");
    if (!out) return;
    const ens = await ensureLabMnemonic({ generate: true });
    if (!ens.ok) {
      out.textContent = "Could not generate a mnemonic. Check that BIP39Lab is loaded.";
      return;
    }
    const m = ens.mnemonic;
    if (!BIP39Lab.descriptorsFromWatchOnly) {
      out.textContent = "Descriptors API not in this build.";
      return;
    }
    const wo = await BIP39Lab.exportWatchOnly(m, $("passphrase").value, {
      account: getDeriveOptions().account,
      network: getDeriveOptions().network,
    });
    const pack = BIP39Lab.descriptorsFromWatchOnly(wo, getDeriveOptions().network);
    const note = ens.generated
      ? "Generated a " + m.split(/\s+/).length + "-word test phrase on Lab (shared).\n\n"
      : "";
    out.textContent =
      note +
      pack.descriptors
        .map((d) => d.label + "\n" + d.descriptor + "\n(" + d.note + ")")
        .join("\n\n");
  }

  function inspectPsbtUi() {
    const out = $("psbtOut");
    if (!out) return;
    if (!BIP39Lab.inspectPsbt) {
      out.textContent = "PSBT API not in this build.";
      return;
    }
    const r = BIP39Lab.inspectPsbt($("psbtIn").value);
    out.textContent =
      r.status +
      ": " +
      r.detail +
      (r.globalKeys != null ? "\nglobalKeys≈" + r.globalKeys + " maps=" + r.mapCount : "");
  }

  function explainDescUi() {
    const out = $("descExplainOut");
    if (!out) return;
    if (!BIP39Lab.explainDescriptor) {
      out.textContent = "API missing.";
      return;
    }
    const r = BIP39Lab.explainDescriptor($("descExplainIn").value);
    out.textContent = r.status + ": " + r.detail;
  }

  async function seedQr() {
    const m = $("mnemonic").value.trim();
    if (!m) {
      setStatus("No mnemonic to QR.", "err");
      return;
    }
    if (!confirm("Show a QR of the recovery phrase? Only continue on a private air-gapped machine.")) {
      return;
    }
    await showQr(m, "Seed phrase (sensitive)");
  }

  function printBackup() {
    const m = $("mnemonic").value.trim();
    const words = m ? m.split(/\s+/).filter(Boolean) : [];
    const ol = $("printWordList");
    if (ol) {
      ol.innerHTML = "";
      const n = words.length || 12;
      for (let i = 0; i < n; i++) {
        const li = document.createElement("li");
        li.textContent = words[i] || "________";
        ol.appendChild(li);
      }
    }
    const sheet = $("printBackup");
    if (sheet) {
      sheet.hidden = false;
      sheet.setAttribute("aria-hidden", "false");
    }
    window.print();
    if (sheet) {
      sheet.hidden = true;
      sheet.setAttribute("aria-hidden", "true");
    }
  }

  function sendToNetwork() {
    if (lastRows && lastRows.length) {
      saveSessionAddresses({ rows: lastRows });
    }
    window.location.href = "network.html";
  }

  async function onGenerate() {
    const n = parseInt($("wordCount").value, 10);
    const m = await BIP39Lab.generateMnemonic(n);
    $("mnemonic").value = m;
    await refreshMnemonicEntropy();
    refreshPassphraseEntropy();
    await deriveNow({ quiet: false });
    const path = getDeriveOptions();
    setStatus(
      "Generated offline · " + path.count + " receive addresses in the table below.",
      "ok"
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("btnGenerate").addEventListener("click", () => onGenerate().catch(console.error));
    $("btnDerive").addEventListener("click", () => deriveNow({ quiet: false }).catch(console.error));
    $("btnClear").addEventListener("click", clearSecrets);
    $("hidePrivate").addEventListener("change", (e) => setPrivateVisible(!e.target.checked));

    $("mnemonic").addEventListener("input", () => {
      refreshMnemonicEntropy().catch(console.error);
      scheduleDerive();
    });
    $("passphrase").addEventListener("input", () => {
      refreshPassphraseEntropy();
      scheduleDerive();
    });

    ["deriveAccount", "deriveChange", "deriveCount", "deriveNetwork"].forEach((id) => {
      if (!$(id)) return;
      $(id).addEventListener("change", () => scheduleDerive());
      $(id).addEventListener("input", () => scheduleDerive());
    });

    document.querySelectorAll(".seg-tab[data-addr-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setSegActive(".seg-tab[data-addr-type]", "data-addr-type", btn.getAttribute("data-addr-type"));
        updateAddrTypeChrome();
        if (lastRows && lastRows.length) fillAddressTable({ rows: lastRows });
        updatePathSummary(getDeriveOptions(), lastRows ? lastRows.length : getDeriveOptions().count);
      });
    });

    document.querySelectorAll(".seg-tab[data-wo-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setSegActive(".seg-tab[data-wo-type]", "data-wo-type", btn.getAttribute("data-wo-type"));
        updateWatchTypeChrome();
        if (lastWatchExport) renderWatchOnlyList(lastWatchExport);
        else refreshWatchOnly().catch(console.error);
      });
    });

    const btnWo = $("btnWatchOnly");
    if (btnWo) btnWo.addEventListener("click", () => refreshWatchOnly().catch(console.error));

    const btnQrClose = $("btnQrClose");
    if (btnQrClose) btnQrClose.addEventListener("click", hideQr);
    const btnQrCopy = $("btnQrCopy");
    if (btnQrCopy) {
      btnQrCopy.addEventListener("click", () => {
        const t = $("qrModalText").textContent;
        copyAddress(t, btnQrCopy);
      });
    }
    const qrModal = $("qrModal");
    if (qrModal) {
      qrModal.addEventListener("click", (e) => {
        if (e.target === qrModal) hideQr();
      });
    }

    // Same-page nav
    document.querySelectorAll(".nav-item[data-nav]").forEach((el) => {
      el.addEventListener("click", (ev) => {
        const nav = el.getAttribute("data-nav");
        if (nav === "multisig" || nav === "network") return;
        if (nav === "lab" || nav === "tools" || nav === "glossary") {
          ev.preventDefault();
          showTab(nav);
        }
      });
    });

    window.addEventListener("hashchange", () => {
      showTab(tabFromHash());
    });

    if ($("btnSeedQr")) $("btnSeedQr").addEventListener("click", () => seedQr().catch(console.error));
    if ($("btnPrintBackup")) $("btnPrintBackup").addEventListener("click", printBackup);
    if ($("btnSendNetwork")) $("btnSendNetwork").addEventListener("click", sendToNetwork);
    if ($("btnDice")) {
      $("btnDice").addEventListener("click", () => {
        entEvents.push("d6:" + (1 + Math.floor(Math.random() * 6)));
        if (entEvents.length > ENT_PAD_MAX) entEvents.shift();
        refreshEntPad();
      });
    }
    if ($("btnCoin")) {
      $("btnCoin").addEventListener("click", () => {
        entEvents.push("coin:" + (Math.random() < 0.5 ? "H" : "T"));
        if (entEvents.length > ENT_PAD_MAX) entEvents.shift();
        refreshEntPad();
      });
    }
    if ($("btnEntClear")) {
      $("btnEntClear").addEventListener("click", () => {
        entEvents = [];
        refreshEntPad();
      });
    }
    if ($("btnCmpPp")) $("btnCmpPp").addEventListener("click", () => comparePassphrases().catch(console.error));
    if ($("btnCmpGen")) {
      $("btnCmpGen").addEventListener("click", () => {
        onGenerate()
          .then(() => {
            const out = $("cmpPpOut");
            if (out) {
              const m = ($("mnemonic") && $("mnemonic").value.trim()) || "";
              out.textContent =
                "Generated " +
                (m ? m.split(/\s+/).length : "?") +
                "-word test phrase on Lab (shared). Click Compare to run.";
            }
          })
          .catch(console.error);
      });
    }
    if ($("btnDescRefresh")) $("btnDescRefresh").addEventListener("click", () => refreshDescriptors().catch(console.error));
    if ($("btnPsbt")) $("btnPsbt").addEventListener("click", inspectPsbtUi);
    if ($("btnDescExplain")) $("btnDescExplain").addEventListener("click", explainDescUi);
    if ($("btnTheme")) {
      $("btnTheme").addEventListener("click", () => {
        const cur = document.documentElement.getAttribute("data-theme") || "dark";
        applyTheme(cur === "dark" ? "light" : "dark");
      });
    }

    document.addEventListener("keydown", (ev) => {
      const tag = (ev.target && ev.target.tagName) || "";
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ev.target && ev.target.isContentEditable);
      if (ev.key === "Escape") hideQr();
      if (typing) return;
      if (ev.key === "g" || ev.key === "G") {
        ev.preventDefault();
        onGenerate().catch(console.error);
      } else if (ev.key === "d" || ev.key === "D") {
        ev.preventDefault();
        deriveNow({ quiet: false }).catch(console.error);
      } else if (ev.key === "?") {
        ev.preventDefault();
        showTab("tools");
      }
    });

    window.addEventListener("online", updateAirgapChip);
    window.addEventListener("offline", updateAirgapChip);
    updateAirgapChip();
    initTheme();

    const ver = typeof BIP39Lab !== "undefined" && BIP39Lab.VERSION ? BIP39Lab.VERSION : "?";
    setStatus("Ready (offline lab v" + ver + "). Generate fills the address table automatically.", "");
    setPlainStatus(
      "Tip: Generate a phrase to fill the table. Tools panel has path playground, PSBT inspect, descriptors. Shortcuts: G / D / ?",
      ""
    );
    clearEntropyFields();
    clearAddressTable();
    updateAddrTypeChrome();
    updateWatchTypeChrome();
    updatePathSummary(getDeriveOptions(), 5);
    showTab(tabFromHash());
  });
})();
