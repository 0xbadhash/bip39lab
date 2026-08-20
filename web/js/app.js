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

  function charsetPoolSize(passphrase) {
    let pool = 0;
    if (/[a-z]/.test(passphrase)) pool += 26;
    if (/[A-Z]/.test(passphrase)) pool += 26;
    if (/[0-9]/.test(passphrase)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(passphrase)) pool += 33;
    return Math.max(pool, 2);
  }

  /** Pedagogical estimate — keep in sync with src/bip39lab/entropy_ui.py */
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
    const shannonBits = h * n;
    const charsetBits = (Math.log(charsetPoolSize(passphrase)) / Math.LN2) * n;
    return Math.min(shannonBits, charsetBits, 256);
  }

  function passphraseStrengthTier(bits) {
    if (bits == null) return "empty";
    if (bits < 40) return "weak";
    if (bits < 80) return "fair";
    return "strong";
  }

  function formatPassphraseStrength(passphrase) {
    const est = estimatePassphraseBits(passphrase);
    if (est == null) {
      return "Empty — no extra secret (not the 512-bit PBKDF2 seed size)";
    }
    const tier = passphraseStrengthTier(est);
    const label = tier === "strong" ? "stronger" : tier;
    // Avoid "~0 bits" for single-char / no diversity (still weak)
    const shown = est < 0.5 ? "<1" : String(Math.round(est));
    return (
      "~" +
      shown +
      " bits · " +
      label +
      " (estimate only — not a security guarantee)"
    );
  }

  function setEntropyMnemonic(text, invalid) {
    const el = $("entropyMnemonic");
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("is-invalid", !!invalid);
  }

  function setEntropyPassphrase(text, tier) {
    const el = $("entropyPassphrase");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("pp-tier-empty", "pp-tier-weak", "pp-tier-fair", "pp-tier-strong");
    const t = tier || "empty";
    el.classList.add("pp-tier-" + t);
    el.setAttribute("data-pp-tier", t);
  }

  function clearEntropyFields() {
    setEntropyMnemonic("—", false);
    setEntropyPassphrase(
      "Empty — no extra secret (not the 512-bit PBKDF2 seed size)",
      "empty"
    );
    const bar = $("ppStrengthBar");
    if (bar) {
      bar.style.width = "0%";
      bar.setAttribute("aria-valuenow", "0");
      bar.className = "pp-strength-bar-fill pp-tier-empty";
    }
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
    const meta = ADDR_TYPE_META[t] || ADDR_TYPE_META.bip86;
    const el = $("pathPlayOut");
    if (!el) return;
    const coin = o.network === "test" ? 1 : 0;
    const last = Math.max(0, (o.count || 1) - 1);
    const path0 =
      typeof BIP39Lab !== "undefined" && BIP39Lab.formatPath
        ? BIP39Lab.formatPath(meta.purpose, o.network, o.account, o.change, 0)
        : "m/" + meta.purpose + "'/" + coin + "'/" + o.account + "'/" + o.change + "/0";
    const pathLast =
      typeof BIP39Lab !== "undefined" && BIP39Lab.formatPath
        ? BIP39Lab.formatPath(meta.purpose, o.network, o.account, o.change, last)
        : path0;
    el.textContent = last === 0 ? path0 : path0 + "  →  …  →  " + pathLast;

    const purposeWhy = {
      86: "BIP-86 Taproot (bc1p…) — default modern receive style in this lab — set by Lab address-type tabs",
      84: "BIP-84 native SegWit (bc1q…) — set by Lab address-type tabs",
      49: "BIP-49 nested SegWit (3…) — set by Lab address-type tabs",
      44: "BIP-44 legacy (1…) — set by Lab address-type tabs",
    };
    const purposeTerm = {
      86: "BIP86",
      84: "BIP84",
      49: "BIP49",
      44: "BIP44",
    };
    const purposeHelpAria = {
      86: "About BIP-86 Taproot",
      84: "About BIP-84 native SegWit",
      49: "About BIP-49 nested SegWit",
      44: "About BIP-44 legacy",
    };
    const addrTypeHelpHtml = {
      86: "<strong>BIP-86 Taproot (bc1p…)</strong> — default modern receive style in this lab — set by these tabs. Path <code>m/86'/…</code>.",
      84: "<strong>BIP-84 native SegWit (bc1q…)</strong> — widely used receive style — set by these tabs. Path <code>m/84'/…</code>.",
      49: "<strong>BIP-49 nested SegWit (3…)</strong> — compatibility style — set by these tabs. Path <code>m/49'/…</code>.",
      44: "<strong>BIP-44 legacy (1…)</strong> — oldest style — set by these tabs. Path <code>m/44'/…</code>.",
    };

    if ($("pathCellPurpose")) $("pathCellPurpose").textContent = meta.purpose + "'";
    if ($("pathCellPurposeWhy")) {
      $("pathCellPurposeWhy").textContent =
        purposeWhy[meta.purpose] || "BIP purpose / script type — set by Lab address-type tabs";
    }
    // Keep ⓘ next to purpose line; retarget glossary term to active BIP
    const purposeTip = $("pathPurposeHelpTip");
    const purposeBtn = $("pathPurposeHelpBtn");
    const pTerm = purposeTerm[meta.purpose] || "BIP86";
    if (purposeTip) purposeTip.setAttribute("data-term", pTerm);
    if (purposeBtn) purposeBtn.setAttribute("aria-label", purposeHelpAria[meta.purpose] || "About address style");
    const liveTip = $("addrTypeLiveTip");
    const liveBtn = $("addrTypeLiveTipBtn");
    if (liveTip) liveTip.setAttribute("data-term", pTerm);
    if (liveBtn) liveBtn.setAttribute("aria-label", purposeHelpAria[meta.purpose] || "About current address type");
    if ($("addrTypeHelpText")) {
      $("addrTypeHelpText").innerHTML =
        addrTypeHelpHtml[meta.purpose] || addrTypeHelpHtml[86];
    }
    if ($("pathCellCoin")) $("pathCellCoin").textContent = coin + "'";
    if ($("pathCellCoinWhy")) {
      $("pathCellCoinWhy").textContent =
        coin === 0
          ? "0 = Bitcoin mainnet (real network paths) — Lab network = main"
          : "1 = testnet/signet paths — Lab network = test (not mainnet coins)";
    }
    if ($("pathCellAccount")) $("pathCellAccount").textContent = o.account + "'";
    if ($("pathCellAccountWhy")) {
      $("pathCellAccountWhy").textContent =
        "Account " + o.account + " — like a sub-wallet slot (Lab “account” field)";
    }
    if ($("pathCellChange")) $("pathCellChange").textContent = String(o.change);
    if ($("pathCellChangeWhy")) {
      $("pathCellChangeWhy").textContent =
        o.change === 1
          ? "1 = change/internal (leftovers from your spends) — Lab change = 1"
          : "0 = receive chain (addresses you give people) — Lab change = 0";
    }
    if ($("pathCellIndex")) {
      $("pathCellIndex").textContent = last === 0 ? "0" : "0 … " + last;
    }
    if ($("pathCellIndexWhy")) {
      $("pathCellIndexWhy").textContent =
        "Lab “count” is " +
        (o.count || 1) +
        " address(es) on this branch (indices 0" +
        (last ? "–" + last : "") +
        ")";
    }
    if ($("pathPlayRange")) {
      $("pathPlayRange").textContent =
        last === 0
          ? "Lab table shows 1 address at index 0 on this path."
          : "Lab table shows indices 0 through " + last + " (count = " + o.count + ").";
    }
    const help = $("pathPlayHelp");
    if (help) {
      help.innerHTML =
        "<strong>In plain words:</strong> “Start from the seed, walk to " +
        meta.label +
        " on " +
        (coin === 0 ? "mainnet" : "testnet") +
        ", account " +
        o.account +
        ", " +
        (o.change === 1 ? "change" : "receive") +
        " chain, then pick address number 0" +
        (last ? "…" + last : "") +
        ".” " +
        "Same mnemonic + same path → same address (offline).";
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
    // Comet: 2s was easy to miss — keep green "Copied" longer
    const restoreMs = 3500;
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

  /** Keep word-count dropdown aligned with a valid pasted/typed phrase. */
  function syncWordCountSelect(n) {
    const sel = $("wordCount");
    if (!sel || !ENT_BITS_BY_WORDS[n]) return;
    const want = String(n);
    if (sel.value !== want) {
      sel.value = want;
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
      syncWordCountSelect(n);
      setEntropyMnemonic(formatMnemonicEntropy(n), false);
      return true;
    } catch (e) {
      setEntropyMnemonic("Invalid (wordlist or checksum)", true);
      return false;
    }
  }

  function refreshPassphraseEntropy() {
    const pp = ($("passphrase") && $("passphrase").value) || "";
    const est = estimatePassphraseBits(pp);
    setEntropyPassphrase(formatPassphraseStrength(pp), passphraseStrengthTier(est));
    const bar = $("ppStrengthBar");
    if (bar) {
      const pct =
        est == null ? 0 : Math.min(100, Math.round((est / 128) * 100));
      bar.style.width = pct + "%";
      bar.setAttribute("aria-valuenow", String(Math.round(est || 0)));
      bar.className = "pp-strength-bar-fill pp-tier-" + passphraseStrengthTier(est);
    }
  }

  async function deriveNow(opts) {
    const quiet = opts && opts.quiet;
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    const path = getDeriveOptions();
    updatePathSummary(path, path.count);
    if (!m) {
      clearAddressTable();
      if (!quiet) {
        setStatus("Missing data — generate or paste a recovery phrase first.", "err");
      }
      setPlainStatus("No phrase yet — generate one or paste a valid recovery phrase.", "");
      return;
    }
    const wordN = m.split(/\s+/).filter(Boolean).length;
    if (!ENT_BITS_BY_WORDS[wordN]) {
      if (!quiet) {
        setStatus(
          "Invalid length (" + wordN + " words) — need 12, 15, 18, 21, or 24 words.",
          "err"
        );
      }
      clearAddressTable("Invalid length — need 12/15/18/21/24 words.");
      setPlainStatus("Invalid length — addresses cannot be listed until word count is valid.", "err");
      await refreshMnemonicEntropy();
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
      // Do not write sessionStorage here — only Send addresses → Network
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
      if (result && result.rows && result.rows.length && window.LearnLevels && LearnLevels.noteHour) {
        LearnLevels.noteHour("h3Derived", true);
      }
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
    const cmp = $("cmpPpOut");
    if (cmp) {
      cmp.textContent =
        "Lab phrase cleared. Next Compare / Refresh descriptors will auto-generate [TEST DATA] if still empty.";
    }
    const desc = $("descOut");
    if (desc) {
      desc.textContent =
        "Lab phrase cleared. Click refresh for a new throwaway test phrase (or set one on Lab first).";
    }
    setPlainStatus("Cleared — nothing was saved to disk. Tools will use TEST DATA if you run them next.", "");
    setStatus("Cleared (memory fields only; nothing was stored).", "");
  }

  function labSiteVersionLabel() {
    var chip = document.querySelector("[data-site-version]");
    if (chip) {
      var t = String(chip.textContent || "").trim();
      if (t && t !== "…" && t !== "...") return t;
    }
    if (typeof BIP39LAB_SITE_TAG === "string" && BIP39LAB_SITE_TAG) return BIP39LAB_SITE_TAG;
    if (typeof BIP39LAB_SITE_VERSION === "string" && BIP39LAB_SITE_VERSION) {
      return "v" + BIP39LAB_SITE_VERSION;
    }
    return "v0.16.21";
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

  function estimateEntPadBits() {
    // rough log2: d6 ~ log2(6) ≈ 2.58 bits, coin 1 bit
    let bits = 0;
    entEvents.forEach((e) => {
      if (e.indexOf("d6:") === 0) bits += 2.58;
      else if (e.indexOf("coin:") === 0) bits += 1;
    });
    return bits;
  }

  function countEntKind(prefix) {
    let n = 0;
    entEvents.forEach(function (e) {
      if (e.indexOf(prefix) === 0) n++;
    });
    return n;
  }

  function saveQuizEvidence(patch) {
    try {
      var raw = localStorage.getItem("bip39lab.quizEvidence");
      var o = raw ? JSON.parse(raw) : {};
      if (!o || typeof o !== "object") o = {};
      Object.keys(patch).forEach(function (k) {
        o[k] = patch[k];
      });
      localStorage.setItem("bip39lab.quizEvidence", JSON.stringify(o));
    } catch (e) {
      /* ignore */
    }
  }

  function loadQuizState() {
    try {
      var raw = localStorage.getItem("bip39lab.quiz");
      var o = raw ? JSON.parse(raw) : {};
      return o && typeof o === "object" ? o : {};
    } catch (e) {
      return {};
    }
  }

  function markQuizFromEntPad(q) {
    // Prefer in-page LearnLevels API (same page Tools → Lab quiz, no broken reload)
    if (window.LearnLevels && typeof window.LearnLevels.passQuiz === "function") {
      try {
        window.LearnLevels.passQuiz(q);
        return;
      } catch (eApi) {
        console.error("passQuiz failed", eApi);
      }
    }
    // Fallback: persist + hard navigate (other entry pages)
    try {
      var st = loadQuizState();
      st[q] = true;
      localStorage.setItem("bip39lab.quiz", JSON.stringify(st));
      if (st.q1 && st.q2 && st.q3 && st.q4) {
        var hour = {};
        try {
          hour = JSON.parse(localStorage.getItem("bip39lab.firstHour") || "{}") || {};
        } catch (eHour) {
          hour = {};
        }
        hour.h6 = true;
        localStorage.setItem("bip39lab.firstHour", JSON.stringify(hour));
      }
      sessionStorage.setItem("bip39lab.quizReturn", "quiz");
      sessionStorage.setItem("bip39lab.quizActive", q);
    } catch (e) {
      /* ignore */
    }
    var dest = "index.html?from=quiz&t=" + Date.now();
    try {
      window.location.assign(dest);
    } catch (eNav) {
      window.location.href = dest;
    }
  }

  function refreshEntPadQuizUi() {
    const bits = estimateEntPadBits();
    const n = entEvents.length;
    const d6n = countEntKind("d6:");
    const need = 128;
    const low = n > 0 && bits + 0.001 < need;
    const enough = bits + 0.001 >= need;
    // Q3: saw too-low with a short pad (1–20 events keeps “few rolls” lesson)
    const q3Ready = low && n >= 1 && n <= 20;
    // Q4: estimate reaches 128 bits (~50 d6)
    const q4Ready = enough;
    if (q3Ready) saveQuizEvidence({ q3Low: true });
    if (q4Ready) saveQuizEvidence({ q4Enough: true });

    const live = $("entPadLiveVerdict");
    if (live) {
      live.classList.remove("is-low", "is-ok");
      if (!n) {
        live.textContent =
          "No rolls yet. Q3: roll ~3× d6 (expect TOO LOW vs 128 bits). Q4: keep rolling to ~50 d6 (~128 bits). " +
          "Mark pass / return uses the amber bar at the bottom of the screen.";
      } else if (low) {
        live.classList.add("is-low");
        const needRolls = Math.max(0, Math.ceil((need - bits) / 2.58));
        live.innerHTML =
          '<strong class="ent-pad-verdict-low">TOO LOW</strong> — ~' +
          Math.round(bits) +
          " bits from " +
          n +
          " event(s) (" +
          d6n +
          " d6). BIP-39 12-word wants <strong>128 bits</strong> — about <strong>50 d6 rolls</strong> (or 128 coin flips). " +
          "Still short by ~" +
          Math.ceil(need - bits) +
          " bits (~" +
          needRolls +
          " more d6). <em>Fewer rolls is worse, not safer.</em> " +
          "Use the <strong>bottom amber bar</strong> to mark Q3 or go back to the quiz.";
      } else {
        live.classList.add("is-ok");
        live.innerHTML =
          "Estimate ~" +
          Math.round(bits) +
          " bits ≥ 128 — enough <em>on paper</em> for a 12-word ENT size. " +
          "Still <strong>PRACTICE ONLY</strong> (simulated rolls, not OS CSPRNG). Never fund pad words. " +
          "Use the <strong>bottom amber bar</strong> to mark Q4 or return.";
      }
    }

    // Drive the fixed bottom learn-return dock only (never mid-page)
    const dock = $("learnReturnBar");
    const dockBtn = $("learnReturnBarBtn");
    const dockHint = $("learnReturnBarHint");
    const b3 = $("btnMarkQ3FromEnt");
    const b4 = $("btnMarkQ4FromEnt");
    const quiz = loadQuizState();
    let quizReturn = false;
    try {
      var retQ = sessionStorage.getItem("bip39lab.quizReturn") || "";
      // Accept legacy "1" and current mode strings from LearnLevels
      quizReturn =
        retQ === "1" ||
        retQ === "quiz" ||
        /from=quiz/.test(location.search || "");
    } catch (e) {
      quizReturn = false;
    }
    // Show dock for guided quiz return or when Q3/Q4 mark is ready — not for every pad roll
    // (avoids forcing "Back to Guided quiz" on Intermediate/Advanced Tools use)
    let activeQ = "";
    try {
      activeQ = sessionStorage.getItem("bip39lab.quizActive") || "";
    } catch (eAct) {
      activeQ = "";
    }
    const entQuizActive = activeQ === "q3" || activeQ === "q4";
    const showDock = quizReturn || q3Ready || q4Ready || entQuizActive;
    if (dock) {
      // Ensure dock is on <body> for true viewport fixed bottom
      if (dock.parentNode !== document.body) {
        try {
          document.body.appendChild(dock);
        } catch (eMove) {
          /* ignore */
        }
      }
      dock.hidden = !showDock;
      dock.classList.add("learn-return-dock");
      try {
        document.body.classList.toggle("learn-return-open", !!showDock);
      } catch (e2) {
        /* ignore */
      }
    }
    if (dockBtn) {
      dockBtn.textContent = "← Back to Beginner";
    }
    if (b3) {
      b3.hidden = !(q3Ready && !quiz.q3);
    }
    if (b4) {
      b4.hidden = !(q4Ready && !quiz.q4);
    }
    if (dockHint) {
      if (q3Ready && !quiz.q3 && q4Ready && !quiz.q4) {
        dockHint.textContent =
          "Q3: TOO LOW on a short pad · Q4: estimate ≥ 128 bits. Mark each when clear (self-check).";
      } else if (q3Ready && !quiz.q3) {
        dockHint.textContent =
          "Q3 ready: short pad is TOO LOW vs 128 bits. Mark Q3 when clear, then keep rolling for Q4 (~50 d6).";
      } else if (q4Ready && !quiz.q4) {
        dockHint.textContent =
          "Q4 ready: estimate ≥ 128 bits (~50 d6). Less was never better — that was the lesson.";
      } else if (low) {
        dockHint.textContent =
          "Keep rolling toward ~50 d6 for Q4. Optional: Build practice seed below to see TOO LOW in Step 3.";
      } else if (n > 0) {
        dockHint.textContent = "Entropy pad quiz — mark pass when ready, or go back.";
      } else {
        dockHint.textContent =
          "Entropy pad: roll for Q3 (few = TOO LOW) then Q4 (~50 d6 / 128 bits).";
      }
    }
    // Hide legacy mid-page bar if still in DOM
    const mid = $("entQuizActionBar");
    if (mid) mid.hidden = true;
  }

  function refreshEntPad() {
    const out = $("entPadOut");
    const meta = $("entPadMeta");
    if (!out) return;
    if (!entEvents.length) {
      out.textContent = "—";
      if (meta) {
        meta.textContent =
          "0 events · ~0 bits (estimate; d6≈2.58, coin=1). Target 128 bits ≈ 50 d6 rolls.";
      }
      refreshEntPadQuizUi();
      return;
    }
    out.textContent = entEvents.join(" ");
    const bits = estimateEntPadBits();
    const d6n = countEntKind("d6:");
    if (meta) {
      meta.textContent =
        entEvents.length +
        " events · ~" +
        Math.round(bits) +
        " bits (d6≈2.58, coin=1; not CSPRNG). " +
        "12-word needs 128 bits ≈ 50 d6 (you have " +
        d6n +
        " d6). 24-word needs 256.";
    }
    refreshEntPadQuizUi();
  }

  async function sha256Bytes(text) {
    const data = new TextEncoder().encode(String(text || ""));
    if (globalThis.crypto && crypto.subtle) {
      const dig = await crypto.subtle.digest("SHA-256", data);
      return new Uint8Array(dig);
    }
    // Extremely unlikely offline path: refuse rather than weak hash
    throw new Error("Web Crypto SHA-256 unavailable");
  }

  function resetEntPadResultUi() {
    const box = $("entPadSeedBox");
    if (box) box.hidden = true;
    if ($("entPadSeedWords")) $("entPadSeedWords").value = "";
    if ($("entPadBitsEst")) $("entPadBitsEst").textContent = "—";
    if ($("entPadBitsNeed")) $("entPadBitsNeed").textContent = "—";
    if ($("entPadBitsGap")) $("entPadBitsGap").textContent = "—";
    if ($("entPadSeedNote")) $("entPadSeedNote").textContent = "";
  }

  async function buildPracticeSeedFromPad() {
    const box = $("entPadSeedBox");
    const warn = $("entPadSeedWarn");
    const note = $("entPadSeedNote");
    const ta = $("entPadSeedWords");
    const B = typeof BIP39Lab !== "undefined" ? BIP39Lab : null;

    if (!entEvents.length) {
      setStatus("Step 1 first: roll the d6 or flip the coin a few times, then build.", "err");
      resetEntPadResultUi();
      return;
    }

    const words = parseInt(($("entPadWords") && $("entPadWords").value) || "12", 10) || 12;
    const needBits = words >= 24 ? 256 : 128;
    const needBytes = needBits / 8;
    const est = estimateEntPadBits();
    const estRound = Math.round(est * 10) / 10;
    const gap = needBits - est;
    const low = est + 0.001 < needBits;

    // Prefer bundle helper; fall back to generateMnemonic only for recovery messaging (not pad-derived)
    const hasFromEnt = B && typeof B.mnemonicFromEntropyBytes === "function";
    if (!hasFromEnt) {
      if (box) box.hidden = false;
      if (warn) {
        warn.innerHTML =
          "<strong>Could not build pad words.</strong> Your browser is likely using an <em>old cached</em> lab script. " +
          "Hard-refresh this page (Ctrl+Shift+R / Cmd+Shift+R), then try again.";
      }
      if ($("entPadBitsEst")) $("entPadBitsEst").textContent = "~" + estRound + " bits from " + entEvents.length + " events";
      if ($("entPadBitsNeed")) $("entPadBitsNeed").textContent = needBits + " bits wanted for " + words + " words";
      if ($("entPadBitsGap")) $("entPadBitsGap").textContent = "— (refresh page to load latest tools)";
      if (note) {
        note.textContent =
          "After a hard refresh, Step 2 turns your roll log into practice words and fills this table.";
      }
      if (ta) ta.value = "";
      return;
    }

    let mnemonic;
    try {
      // Hash the event log → 32 bytes; take ENT length for BIP-39 (educational)
      const digest = await sha256Bytes(entEvents.join("|"));
      const ent = digest.slice(0, needBytes);
      mnemonic = B.mnemonicFromEntropyBytes(ent);
    } catch (e) {
      if (box) box.hidden = false;
      if (warn) warn.innerHTML = "<strong>Could not build words.</strong>";
      if (note) note.textContent = String(e && e.message ? e.message : e);
      if (ta) ta.value = "";
      return;
    }

    if ($("entPadBitsEst")) {
      $("entPadBitsEst").textContent =
        "~" + estRound + " bits (from " + entEvents.length + " dice/coin events this session)";
    }
    if ($("entPadBitsNeed")) {
      $("entPadBitsNeed").textContent =
        needBits + " bits (BIP-39 ENT for a " + words + "-word phrase)";
    }
    if ($("entPadBitsGap")) {
      const gapEl = $("entPadBitsGap");
      if (low) {
        gapEl.innerHTML =
          '<strong class="ent-pad-verdict-low">TOO LOW</strong> — pad estimate is short by about <strong>' +
          Math.ceil(gap) +
          "</strong> bits. Words below are only a classroom demo of a weak pad.";
        gapEl.className = "ent-pad-gap-low";
      } else {
        gapEl.innerHTML =
          "Pad estimate looks high enough on paper — still <strong>NEVER fund</strong> these words (simulated rolls / not OS CSPRNG).";
        gapEl.className = "ent-pad-gap-ok";
      }
    }
    if (warn) {
      warn.innerHTML = low
        ? '<strong class="ent-pad-verdict-low">TOO LOW + PRACTICE ONLY — do not fund.</strong> Your simulated rolls only account for ~' +
          estRound +
          " bits, but a real " +
          words +
          "-word wallet wants " +
          needBits +
          " bits of good randomness. <em>That gap is the lesson.</em>"
        : "<strong>PRACTICE ONLY — do not fund.</strong> Even with a large pad estimate, use Lab → Generate (OS CSPRNG) for a proper random demo — not this pad.";
    }
    if (note) {
      note.textContent =
        "How we built the words: SHA-256(your roll log) → " +
        needBytes +
        " bytes → BIP-39 " +
        words +
        " words with checksum. " +
        "Same rolls always make the same practice phrase. This does not prove your pad had " +
        needBits +
        " bits of real entropy.";
    }
    if (ta) ta.value = mnemonic;
    if (box) {
      box.hidden = false;
      try {
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (e) {
        /* ignore */
      }
    }
  }

  function copyPracticePadToLab() {
    const ta = $("entPadSeedWords");
    const m = (ta && ta.value.trim()) || "";
    if (!m) {
      setStatus("Build practice words in Step 2 first.", "err");
      return;
    }
    if (!confirm(
      "Put these PRACTICE words on the Lab tab?\n\n" +
        "• They stay TEST DATA only — never fund them\n" +
        "• Overwrites whatever is currently in Lab’s mnemonic box\n\n" +
        "Use this only to keep experimenting offline (derive table, etc.)."
    )) {
      return;
    }
    if ($("mnemonic")) $("mnemonic").value = m;
    if (typeof refreshMnemonicEntropy === "function") {
      refreshMnemonicEntropy().catch(function () {});
    }
    showTab("lab");
    setStatus("Lab holds PRACTICE pad words (TEST DATA). Do not fund this phrase.", "err");
    setPlainStatus(
      "Entropy pad → Lab: practice only. For a proper random phrase use Lab Generate.",
      ""
    );
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

  function maskPpLabel(pp) {
    if (pp == null || pp === "") return "(empty — no passphrase)";
    return "“" + String(pp) + "”";
  }

  function refreshCmpMnemonicPreview() {
    const preview = $("cmpMnPreview");
    const source = $("cmpMnSource");
    const el = $("mnemonic");
    const m = (el && el.value.trim()) || "";
    if (!preview) return { ok: false, mnemonic: "" };
    if (!m) {
      if (source) source.textContent = "Source: none yet — use Lab phrase or generate a throwaway test phrase.";
      preview.textContent = "—";
      return { ok: false, mnemonic: "" };
    }
    const n = m.split(/\s+/).filter(Boolean).length;
    if (source) {
      source.textContent =
        "Source: Lab mnemonic field (" + n + " words) — same words used for A and B below.";
    }
    preview.textContent = m;
    return { ok: true, mnemonic: m };
  }

  function updateCmpPathHint() {
    const hint = $("cmpPathHint");
    if (!hint || typeof getDeriveOptions !== "function") return;
    try {
      const o = getDeriveOptions();
      const type = getActiveAddrType();
      const meta = ADDR_TYPE_META[type] || {};
      hint.innerHTML =
        "Uses Lab settings: <strong>" +
        (o.network || "mainnet") +
        "</strong>, account <strong>" +
        o.account +
        "</strong>, change <strong>" +
        o.change +
        "</strong>, type <strong>" +
        (meta.label || type) +
        "</strong>, <strong>index 0</strong> only.";
    } catch (e) {
      /* ignore */
    }
  }

  async function comparePassphrases() {
    const out = $("cmpPpOut");
    const resultBox = $("cmpPpResult");
    const ens = await ensureLabMnemonic({ generate: true });
    if (!ens.ok) {
      if (out) {
        out.hidden = false;
        out.textContent = "Could not generate a mnemonic. Check that BIP39Lab is loaded.";
      }
      return;
    }
    refreshCmpMnemonicPreview();
    updateCmpPathHint();
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
      ? "[TEST DATA] Auto-generated a " +
        m.split(/\s+/).length +
        "-word throwaway phrase into Lab for this session."
      : "[Lab phrase] Using the mnemonic currently in Lab.";
    const same = aa === bb;
    if (
      !same &&
      String(a).trim() === "" &&
      String(b).trim() === "test" &&
      window.LearnLevels &&
      LearnLevels.noteHour
    ) {
      LearnLevels.noteHour("h5ComparedDiff", true);
    }
    const verdict = same
      ? "Same address — passphrases match (or both empty). Same vault."
      : "Different addresses — the passphrase changed the wallet. Same words, two vaults.";

    if ($("cmpCellPpA")) $("cmpCellPpA").textContent = maskPpLabel(a);
    if ($("cmpCellPpB")) $("cmpCellPpB").textContent = maskPpLabel(b);
    if ($("cmpCellAddrA")) $("cmpCellAddrA").textContent = aa;
    if ($("cmpCellAddrB")) $("cmpCellAddrB").textContent = bb;
    if ($("cmpPpVerdict")) {
      $("cmpPpVerdict").textContent = note + " " + verdict;
      $("cmpPpVerdict").classList.remove("ok", "err");
      $("cmpPpVerdict").classList.add(same ? "ok" : "err");
    }
    if (resultBox) resultBox.hidden = false;

    // Quiz Q1: different addresses = demo ready → show Mark on bottom dock
    if (!same) {
      try {
        var evRaw = localStorage.getItem("bip39lab.quizEvidence");
        var ev = evRaw ? JSON.parse(evRaw) : {};
        if (!ev || typeof ev !== "object") ev = {};
        ev.q1Diff = true;
        localStorage.setItem("bip39lab.quizEvidence", JSON.stringify(ev));
      } catch (eEv) {
        /* ignore */
      }
      var dock = $("learnReturnBar");
      var m1 = $("btnMarkQ1FromTools");
      var dockHint = $("learnReturnBarHint");
      var quizSt = loadQuizState();
      var active = "";
      try {
        active = sessionStorage.getItem("bip39lab.quizActive") || "";
      } catch (eA) {
        active = "";
      }
      var retQ1 = "";
      try {
        retQ1 = sessionStorage.getItem("bip39lab.quizReturn") || "";
      } catch (eR) {
        retQ1 = "";
      }
      if (dock && (active === "q1" || retQ1 === "1" || retQ1 === "quiz")) {
        if (dock.parentNode !== document.body) {
          try {
            document.body.appendChild(dock);
          } catch (eM) {
            /* ignore */
          }
        }
        dock.hidden = false;
        document.body.classList.add("learn-return-open");
        if (dockHint && !quizSt.q1) {
          dockHint.textContent =
            "Q1 ready: addresses differ (empty vs passphrase). Mark Q1 passed & return when that is clear.";
        }
        if (m1) m1.hidden = !!quizSt.q1;
      }
    }

    // Keep pre for a11y / tests that still scrape text
    if (out) {
      out.hidden = true;
      out.textContent =
        note +
        "\nA (" +
        maskPpLabel(a) +
        "): " +
        aa +
        "\nB (" +
        maskPpLabel(b) +
        "): " +
        bb +
        "\n" +
        verdict;
    }
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
      ? "[TEST DATA] Auto-generated a " +
        m.split(/\s+/).length +
        "-word throwaway phrase (not from Lab input). Written into Lab for this session only.\n\n"
      : "[Lab phrase] Using the mnemonic currently in Lab memory.\n\n";
    out.textContent =
      note +
      pack.descriptors
        .map((d) => d.label + "\n" + d.descriptor + "\n(" + d.note + ")")
        .join("\n\n");
  }

  // Educational samples only — valid psbt\xff framing, not funded spends.
  // minimal: magic + empty global map terminator
  var PSBT_SAMPLE_MINIMAL = "cHNidP8A";
  var PSBT_SAMPLE_PARTIAL =
    "cHNidP8AIgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAA";
  // slightly longer placeholder used in e2e / docs (still synthetic)
  var PSBT_SAMPLE_STORY = "cHNidP8BAAoCAAAAAA==";

  var PSBT_STORY_MINIMAL =
    "Sample story: empty global map after magic. In a real wallet this is “package opened, no fields filled yet” — " +
    "before anyone attaches inputs, outputs, or partial signatures.";

  var PSBT_STORY_MS =
    "Sample story (multisig / hardware): wallet software creates a PSBT for a spend; cosigner A or a hardware " +
    "wallet adds a partial signature; cosigner B adds another; only after enough partials exist can someone " +
    "finalize and broadcast. This lab never performs those steps — Inspect only shows that the blob looks like a PSBT.";

  function setPsbtStory(text) {
    var el = $("psbtStory");
    if (!el) return;
    if (!text) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = text;
  }

  function loadPsbtSample(kind) {
    var input = $("psbtIn");
    if (!input) return;
    if (kind === "story") {
      input.value = PSBT_SAMPLE_STORY;
      setPsbtStory(
        "Story loaded: multisig / hardware-wallet hand-off. Inspect ran automatically below — " +
          "you do not need to click “Inspect again” unless you edit the box."
      );
      // Keep long story in out via inspect + append
    } else if (kind === "partial") {
      input.value = PSBT_SAMPLE_PARTIAL;
      setPsbtStory(
        "1-of-2 educational sample: one partial-sig key (type 0x02). Not a funded wallet. Inspect ran automatically."
      );
    } else {
      input.value = PSBT_SAMPLE_MINIMAL;
      setPsbtStory(
        "Minimal sample loaded: empty maps after magic (package opened, nothing filled). Inspect ran automatically."
      );
    }
    inspectPsbtUi({ storyKind: kind });
    var out = $("psbtOut");
    if (out) {
      try {
        out.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } catch (e) {
        /* ignore */
      }
    }
  }

  function inspectPsbtUi(opts) {
    opts = opts || {};
    const out = $("psbtOut");
    if (!out) return;
    const B = typeof BIP39Lab !== "undefined" ? BIP39Lab : null;
    if (!B || !B.inspectPsbt) {
      out.textContent =
        "PSBT inspect unavailable. Hard-refresh the page (Ctrl+Shift+R) so the latest lab scripts load.";
      return;
    }
    const raw = ($("psbtIn") && $("psbtIn").value) || "";
    if (!String(raw).trim()) {
      out.textContent =
        "Nothing to inspect. Click “1 · Load & inspect: minimal” or paste a PSBT, then Inspect again.";
      return;
    }
    const r = B.inspectPsbt(raw);
    var storyExtra = "";
    if (opts.storyKind === "story") {
      storyExtra =
        "\n\n— sample story (multisig / HWW) —\n" + PSBT_STORY_MS;
    } else if (opts.storyKind === "minimal" || opts.storyKind === undefined) {
      // keep short; full story in psbtStory line
    }
    var teach =
      "\n\n— what this means —\n" +
      "• status ok + magic psbt\\xff = blob looks like a PSBT package\n" +
      "• mapCount / globalKeys = educational count of internal key/value sections\n" +
      "• This is NOT a signed payment and does NOT go on the network\n" +
      "• Real flow: create PSBT → others add partial signatures → combine → finalize → broadcast\n" +
      "• This lab only does the “look at structure” step";
    out.textContent =
      (r.status === "ok" ? "OK — educational parse\n" : "Error — ") +
      r.detail +
      (r.globalKeys != null
        ? "\n\nglobal key entries ≈ " + r.globalKeys + "\nkey/value maps after magic ≈ " + r.mapCount
        : "") +
      (r.partialSigs != null ? "\npartial signatures: " + r.partialSigs : "") +
      (r.status === "ok" ? teach : "") +
      (opts.storyKind === "story" ? storyExtra : "");
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
    const field = $("mnemonic");
    const m = field ? String(field.value || "").trim().replace(/\s+/g, " ") : "";
    if (!m) {
      setStatus("No mnemonic to QR.", "err");
      return;
    }
    if (!BIP39Lab.validateMnemonic || !(await BIP39Lab.validateMnemonic(m))) {
      setStatus("Invalid words or checksum — cannot QR as a backup.", "err");
      return;
    }
    if (
      !confirm(
        "This will show a QR of the full recovery phrase from the live mnemonic field. Continue only on a private air-gapped machine."
      )
    ) {
      return;
    }
    const title = $("qrModalTitle");
    if (title) title.textContent = "Seed phrase QR (sensitive)";
    await showQr(m, "Seed phrase (sensitive) — live field");
  }

  async function printBackup() {
    const field = $("mnemonic");
    const m = field ? String(field.value || "").trim().replace(/\s+/g, " ") : "";
    if (!m || !BIP39Lab.validateMnemonic || !(await BIP39Lab.validateMnemonic(m))) {
      setStatus("Invalid words or checksum — cannot print as a backup.", "err");
      return;
    }
    if (
      !confirm(
        "This will print the full recovery phrase from the live mnemonic field. Continue only if this machine and printer are trusted."
      )
    ) {
      return;
    }
    const words = m.split(/\s+/).filter(Boolean);
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
    const cur = $("mnemonic") ? String($("mnemonic").value || "").trim() : "";
    if (cur) {
      if (!confirm("Generate will replace the current phrase in this tab. Continue?")) {
        setStatus("Generate cancelled — current phrase kept.", "");
        return;
      }
    }
    const n = parseInt($("wordCount").value, 10);
    const m = await BIP39Lab.generateMnemonic(n);
    $("mnemonic").value = m;
    await refreshMnemonicEntropy();
    refreshPassphraseEntropy();
    await deriveNow({ quiet: false });
    try {
      if (
        window.BIP39Lab &&
        BIP39Lab.validateMnemonic &&
        BIP39Lab.validateMnemonic(m) &&
        window.LearnLevels &&
        LearnLevels.noteHour
      ) {
        LearnLevels.noteHour("h2Generated", true);
      }
    } catch (eGen) {
      /* ignore */
    }
    const path = getDeriveOptions();
    setStatus(
      "Generated offline · " + path.count + " receive addresses in the table below.",
      "ok"
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    function hideLabOverlay(id) {
      const el = $(id);
      if (!el) return;
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
    }
    function showLabOverlay(id) {
      ["overlayGenerate", "overlayDerive", "overlayClear"].forEach(hideLabOverlay);
      const el = $(id);
      if (!el) return;
      if (id === "overlayGenerate") {
        const n = $("wordCount") ? $("wordCount").value : "12";
        const span = $("overlayGenerateWords");
        if (span) span.textContent = String(n || "12");
      }
      el.hidden = false;
      el.setAttribute("aria-hidden", "false");
    }
    $("btnGenerate").addEventListener("click", () => showLabOverlay("overlayGenerate"));
    $("btnDerive").addEventListener("click", () => showLabOverlay("overlayDerive"));
    $("btnClear").addEventListener("click", () => showLabOverlay("overlayClear"));
    document.querySelectorAll("[data-overlay-ok]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-overlay-ok");
        hideLabOverlay(id);
        if (id === "overlayGenerate") onGenerate().catch(console.error);
        else if (id === "overlayDerive") deriveNow({ quiet: false }).catch(console.error);
        else if (id === "overlayClear") clearSecrets();
      });
    });
    $("hidePrivate").addEventListener("change", (e) => setPrivateVisible(!e.target.checked));

    $("mnemonic").addEventListener("input", () => {
      refreshMnemonicEntropy().catch(console.error);
      scheduleDerive();
    });
    $("passphrase").addEventListener("input", () => {
      refreshPassphraseEntropy();
      scheduleDerive();
    });
    refreshPassphraseEntropy();

    ["deriveAccount", "deriveChange", "deriveCount", "deriveNetwork"].forEach((id) => {
      if (!$(id)) return;
      $(id).addEventListener("change", () => scheduleDerive());
      $(id).addEventListener("input", () => scheduleDerive());
    });

    function noteH4FromControl(kind, el) {
      if (!window.LearnLevels || !LearnLevels.noteHour) return;
      var ev = {};
      try {
        ev = JSON.parse(sessionStorage.getItem("bip39lab.hourEvidence") || "{}") || {};
      } catch (eE) {
        ev = {};
      }
      if (!ev.h4Snap) return;
      if (kind === "h4Coin" && el && el.value !== ev.h4Snap.network) LearnLevels.noteHour("h4Coin", true);
      if (kind === "h4Account" && el && el.value !== ev.h4Snap.account) LearnLevels.noteHour("h4Account", true);
      if (kind === "h4Change" && el && el.value !== ev.h4Snap.change) LearnLevels.noteHour("h4Change", true);
      if (kind === "h4Index" && el && el.value !== ev.h4Snap.count) LearnLevels.noteHour("h4Index", true);
    }
    if ($("deriveNetwork")) {
      $("deriveNetwork").addEventListener("change", function () {
        noteH4FromControl("h4Coin", $("deriveNetwork"));
      });
    }
    if ($("deriveAccount")) {
      $("deriveAccount").addEventListener("input", function () {
        noteH4FromControl("h4Account", $("deriveAccount"));
      });
      $("deriveAccount").addEventListener("change", function () {
        noteH4FromControl("h4Account", $("deriveAccount"));
      });
    }
    if ($("deriveChange")) {
      $("deriveChange").addEventListener("change", function () {
        noteH4FromControl("h4Change", $("deriveChange"));
      });
    }
    if ($("deriveCount")) {
      $("deriveCount").addEventListener("change", function () {
        noteH4FromControl("h4Index", $("deriveCount"));
      });
    }

    document.querySelectorAll(".seg-tab[data-addr-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("is-active") && window.LearnLevels && LearnLevels.noteHour) {
          var evP = {};
          try {
            evP = JSON.parse(sessionStorage.getItem("bip39lab.hourEvidence") || "{}") || {};
          } catch (eP) {
            evP = {};
          }
          if (evP.h4Snap) LearnLevels.noteHour("h4Purpose", true);
        }
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
    if ($("btnPrintBackup")) {
      $("btnPrintBackup").addEventListener("click", () => printBackup().catch(console.error));
    }
    if ($("btnSendNetwork")) $("btnSendNetwork").addEventListener("click", sendToNetwork);
    if ($("btnDice")) {
      $("btnDice").addEventListener("click", () => {
        entEvents.push("d6:" + (1 + Math.floor(Math.random() * 6)));
        if (entEvents.length > ENT_PAD_MAX) entEvents.shift();
        refreshEntPad();
      });
    }
    if ($("btnDice10")) {
      $("btnDice10").addEventListener("click", () => {
        for (let i = 0; i < 10; i++) {
          entEvents.push("d6:" + (1 + Math.floor(Math.random() * 6)));
          if (entEvents.length > ENT_PAD_MAX) entEvents.shift();
        }
        refreshEntPad();
      });
    }
    if ($("btnMarkQ3FromEnt")) {
      $("btnMarkQ3FromEnt").addEventListener("click", () => markQuizFromEntPad("q3"));
    }
    if ($("btnMarkQ4FromEnt")) {
      $("btnMarkQ4FromEnt").addEventListener("click", () => markQuizFromEntPad("q4"));
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
        resetEntPadResultUi();
      });
    }
    if ($("btnEntToSeed")) {
      $("btnEntToSeed").addEventListener("click", () => {
        buildPracticeSeedFromPad().catch(function (e) {
          setStatus(String(e && e.message ? e.message : e), "err");
        });
      });
    }
    if ($("btnEntToLab")) {
      $("btnEntToLab").addEventListener("click", copyPracticePadToLab);
    }
    if ($("btnPathToLab")) {
      $("btnPathToLab").addEventListener("click", function () {
        showTab("lab");
        window.setTimeout(function () {
          const target =
            $("card-addresses") ||
            $("addrTypeTabs") ||
            document.querySelector("[data-addr-type]");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            try {
              if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
              target.focus({ preventScroll: true });
            } catch (e) {
              /* ignore */
            }
          }
        }, 60);
      });
    }
    if ($("btnCmpPp")) $("btnCmpPp").addEventListener("click", () => comparePassphrases().catch(console.error));
    if ($("btnCmpUseLab")) {
      $("btnCmpUseLab").addEventListener("click", () => {
        const r = refreshCmpMnemonicPreview();
        updateCmpPathHint();
        if ($("cmpPpVerdict")) {
          $("cmpPpVerdict").textContent = r.ok
            ? "Lab phrase loaded in Step 1. Set passphrases in Step 2, then Compare."
            : "Lab has no valid phrase yet — Generate throwaway or open Lab tab first.";
          $("cmpPpVerdict").classList.remove("ok", "err");
        }
        if ($("cmpPpResult") && r.ok) {
          /* keep prior table if any */
        }
      });
    }
    if ($("btnCmpGen")) {
      $("btnCmpGen").addEventListener("click", () => {
        onGenerate()
          .then(() => {
            refreshCmpMnemonicPreview();
            updateCmpPathHint();
            const m = ($("mnemonic") && $("mnemonic").value.trim()) || "";
            const n = m ? m.split(/\s+/).length : "?";
            if ($("cmpMnSource")) {
              $("cmpMnSource").textContent =
                "Source: [TEST DATA] new " + n + "-word throwaway phrase written into Lab. Click Compare after Step 2.";
            }
            if ($("cmpPpVerdict")) {
              $("cmpPpVerdict").textContent =
                "[TEST DATA] Generated " + n + "-word phrase. Fill passphrases (e.g. leave A empty, B = test), then Compare.";
              $("cmpPpVerdict").classList.remove("ok", "err");
            }
            if ($("cmpPpResult")) $("cmpPpResult").hidden = false;
          })
          .catch(console.error);
      });
    }
    if ($("btnDescRefresh")) $("btnDescRefresh").addEventListener("click", () => refreshDescriptors().catch(console.error));
    if ($("btnPsbt")) $("btnPsbt").addEventListener("click", inspectPsbtUi);
    if ($("btnPsbtSampleMinimal")) {
      $("btnPsbtSampleMinimal").addEventListener("click", function () {
        loadPsbtSample("minimal");
      });
    }
    if ($("btnPsbtSampleStory")) {
      $("btnPsbtSampleStory").addEventListener("click", function () {
        loadPsbtSample("story");
      });
    }
    if ($("btnPsbtSamplePartial")) {
      $("btnPsbtSamplePartial").addEventListener("click", function () {
        loadPsbtSample("partial");
      });
    }
    if ($("btnDescExplain")) $("btnDescExplain").addEventListener("click", explainDescUi);
    if ($("btnDescExample")) {
      $("btnDescExample").addEventListener("click", () => {
        const ta = $("descExplainIn");
        // Educational public-shape example only (checksum may fail explain — still teaches format).
        if (ta) {
          ta.value =
            "wpkh(zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs/0/*)";
        }
        // Load then explain in one step (logical order)
        explainDescUi();
        const out = $("descExplainOut");
        if (out && out.textContent) {
          out.textContent =
            "[Loaded educational public example, then ran Explain.]\n\n" + out.textContent;
          try {
            out.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } catch (e) {
            /* ignore */
          }
        }
      });
    }
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
      } else if (ev.key === "?" || (ev.key === "/" && ev.shiftKey)) {
        ev.preventDefault();
        showTab("tools");
        window.setTimeout(function () {
          const card = $("tools-shortcuts");
          if (card) {
            if (card.tagName === "DETAILS") card.open = true;
            card.scrollIntoView({ behavior: "smooth", block: "start" });
            try {
              card.setAttribute("tabindex", "-1");
              card.focus({ preventScroll: true });
            } catch (e) {
              /* ignore */
            }
          }
        }, 50);
      }
    });

    window.addEventListener("online", updateAirgapChip);
    window.addEventListener("offline", updateAirgapChip);
    updateAirgapChip();
    initTheme();

    const ver = labSiteVersionLabel();
    setStatus("Ready (offline lab " + ver + "). Generate fills the address table automatically.", "");
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
