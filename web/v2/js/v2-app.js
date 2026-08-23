/**
 * V2 use-case tracks — real BIP-39 via BIP39Lab bundle. No seed persistence.
 */
(function () {
  "use strict";
  var STORE = "bip39lab.v2";
  var mem = { mnemonic: "", lastRows: null, cardAck: false, wordCount: 12 };
  var PSBT_MIN = "cHNidP8A";

  var TRACKS = [
    { id: 1, level: "Starter", title: "First wallet", job: "Make a practice phrase and one receive address.", done: "Phrase, numbered card, address ≠ phrase; will not fund practice." },
    { id: 2, level: "Starter", title: "Paper backup", job: "Treat the numbered card as the backup object.", done: "Card = backup; no photo/cloud of a funded phrase." },
    { id: 3, level: "Beginner", title: "Passphrase (25th word)", job: "Same words + different passphrase = different wallet.", done: "Compare A vs B; forgotten PP = loss of that vault." },
    { id: 4, level: "Beginner", title: "Path folders", job: "A path is a folder; words do not change.", done: "Toggle receive/change or index; words stay." },
    { id: 5, level: "Beginner", title: "Watch-only", job: "Export public descriptors / zpub — never the seed.", done: "Never paste seed into a watch-only app." },
    { id: 6, level: "Intermediate", title: "Shared custody multisig", job: "M-of-N from public keys.", done: "Keys ≠ BIP-39 word shares." },
    { id: 7, level: "Intermediate", title: "Split secret Shamir", job: "Educational GF(256) shares — not SLIP-39 Suite.", done: "Shares ≠ multisig cosigners." },
    { id: 8, level: "Intermediate", title: "PSBT / air-gap", job: "Inspect a partial transaction offline.", done: "Inspect → offline sign (elsewhere) → online broadcast; never paste seed." },
    { id: 9, level: "Intermediate", title: "xpub privacy", job: "Account xpub is watch-only and privacy-sensitive.", done: "xpub ≠ spend; do not publish casually." },
    { id: 10, level: "Advanced", title: "Network leak", job: "Default offline; balances only after opt-in.", done: "Unknown ≠ 0; explicit Network page only." }
  ];

  function $(id) { return document.getElementById(id); }
  function loadState() {
    try { return JSON.parse(sessionStorage.getItem(STORE) || "{}") || {}; } catch (e) { return {}; }
  }
  function saveState(s) {
    try { sessionStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }
  function completedSet() {
    var s = loadState();
    return s.completed || [];
  }
  function markComplete(id) {
    var s = loadState();
    s.completed = s.completed || [];
    if (s.completed.indexOf(id) < 0) s.completed.push(id);
    s["gate" + id] = true;
    saveState(s);
  }
  function gated(id) {
    var s = loadState();
    return !!s["gate" + id];
  }
  function setGated(id) {
    var s = loadState();
    s["gate" + id] = true;
    saveState(s);
  }

  function show(which) {
    ["viewPicker", "viewGate", "viewTrack"].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle("v2-hidden", id !== which);
    });
  }

  function renderPicker() {
    var grid = $("pickerGrid");
    if (!grid) return;
    var done = completedSet();
    grid.innerHTML = TRACKS.map(function (t) {
      var isDone = done.indexOf(t.id) >= 0;
      return (
        '<button type="button" class="uc-card' + (isDone ? " done" : "") + '" data-uc="' + t.id + '">' +
        '<div class="uc-id">UC' + t.id + " · " + t.level + (isDone ? " · done" : "") + "</div>" +
        "<h3>" + t.title + "</h3>" +
        '<p class="uc-job">' + t.job + "</p>" +
        '<p class="uc-done"><strong>Done when:</strong> ' + t.done + "</p>" +
        "</button>"
      );
    }).join("");
    grid.querySelectorAll("[data-uc]").forEach(function (btn) {
      btn.addEventListener("click", function () { openUc(parseInt(btn.getAttribute("data-uc"), 10)); });
    });
    show("viewPicker");
    $("panelTitle").textContent = "Use-case tracks";
    $("panelSub").textContent = "Pick a job. Tracks teach; rooms stay in the sidebar.";
  }

  function openUc(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    if (!gated(id)) {
      $("gateTitle").textContent = "UC" + t.id + " — " + t.title;
      $("gateScope").innerHTML =
        "<p><strong>What this is:</strong> an offline practice track. Not a funded wallet, not a signer, not a broadcaster.</p>" +
        "<p><strong>What this isn’t:</strong> do not import these words into a real wallet or send coins to practice addresses.</p>" +
        "<p><strong>Done when:</strong> " + t.done + "</p>";
      $("btnGateStart").onclick = function () {
        setGated(id);
        startTrack(id);
      };
      show("viewGate");
      return;
    }
    startTrack(id);
  }

  var current = { id: 1, step: 0 };

  function stepsFor(id) {
    var map = {
      1: ["Generate", "Backup card", "Validate", "Exercise", "Quiz", "Finish"],
      2: ["Card is backup", "Do / don’t", "Print optional", "Quiz", "Finish"],
      3: ["Same words", "Compare A/B", "Quiz", "Finish"],
      4: ["Folders", "Toggle path", "Quiz", "Finish"],
      5: ["Public only", "Export", "Quiz", "Finish"],
      6: ["Keys ≠ shares", "Three pubkeys", "Quiz", "Finish"],
      7: ["Shares ≠ keys", "Split / combine", "Quiz", "Finish"],
      8: ["Air-gap model", "Inspect PSBT", "Quiz", "Finish"],
      9: ["xpub ≠ spend", "Export xpub", "Quiz", "Finish"],
      10: ["Offline default", "Opt-in Network", "Quiz", "Finish"]
    };
    return map[id] || ["Start", "Finish"];
  }

  function conceptsFor(id) {
    var c = {
      1: ["Entropy → words", "Backup card", "Address ≠ phrase"],
      2: ["Card object", "No photo/cloud", "Separate passphrase"],
      3: ["Optional 25th", "New wallet", "Forgotten = loss"],
      4: ["Path = folder", "BIP purpose", "Index / change"],
      5: ["Watch-only", "zpub/xpub", "Never the seed"],
      6: ["M-of-N", "Public keys", "Not Shamir"],
      7: ["Threshold shares", "Not cosigners", "Edu hex only"],
      8: ["PSBT package", "Never sign here", "Broadcast elsewhere"],
      9: ["Account xpub", "Privacy leak", "Cannot spend"],
      10: ["connect-src none", "Address only", "unknown ≠ 0"]
    };
    return c[id] || ["A", "B", "C"];
  }

  function startTrack(id) {
    current = { id: id, step: 0 };
    mem.cardAck = false;
    renderTrack();
    show("viewTrack");
  }

  function renderRail(names, step) {
    var html = "";
    names.forEach(function (n, i) {
      if (i) html += '<li class="arr" aria-hidden="true">→</li>';
      var cls = i === step ? "is-current" : i < step ? "is-done" : "";
      html += '<li class="' + cls + '"><span class="num">' + (i + 1) + '</span><span class="name">' + n + "</span></li>";
    });
    return html;
  }

  function renderConcepts(id, step, nSteps) {
    var cs = conceptsFor(id);
    var hi = Math.min(2, Math.floor((step / Math.max(1, nSteps - 1)) * 2));
    return cs.map(function (t, i) {
      return '<div class="c' + (i === hi ? " hi" : "") + '">' + t + "</div>";
    }).join("");
  }

  function wordGridHtml(m) {
    var words = (m || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '<p class="control-help">Generate to fill this backup.</p>';
    var n = words.length;
    var cls = n >= 24 ? "word-grid w24" : "word-grid";
    var html = '<ol class="' + cls + '">';
    for (var i = 0; i < n; i++) {
      html += '<li><span class="wi">' + (i + 1) + '</span><span class="ww">' + words[i] + "</span></li>";
    }
    html += "</ol>";
    html += '<span class="stamp-warn">This card is a practice backup. Not a wallet.</span>';
    return html;
  }

  async function ensurePhrase(n) {
    n = n || mem.wordCount || 12;
    if (!mem.mnemonic && window.BIP39Lab) {
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
    }
    return mem.mnemonic;
  }

  async function renderTrack() {
    var t = TRACKS.filter(function (x) { return x.id === current.id; })[0];
    var names = stepsFor(current.id);
    var step = current.step;
    $("panelTitle").textContent = "UC" + t.id + " · " + t.title;
    $("panelSub").textContent = t.job;
    $("trackRail").innerHTML = renderRail(names, step);
    $("trackProgress").textContent = (step + 1) + " / " + names.length;
    $("conceptStrip").innerHTML = renderConcepts(current.id, step, names.length);
    var body = $("trackBody");
    body.innerHTML = "<p class=\"control-help\">Loading…</p>";
    try {
      body.innerHTML = await stepHtml(current.id, step);
    } catch (e) {
      body.innerHTML = '<p class="msg-bad">' + (e && e.message ? e.message : e) + "</p>";
    }
    wireStep();
  }

  async function stepHtml(id, step) {
    if (id === 1) return uc1(step);
    if (id === 2) return uc2(step);
    if (id === 3) return uc3(step);
    if (id === 4) return uc4(step);
    if (id === 5) return uc5(step);
    if (id === 6) return uc6(step);
    if (id === 7) return uc7(step);
    if (id === 8) return uc8(step);
    if (id === 9) return uc9(step);
    if (id === 10) return uc10(step);
    return "";
  }

  async function uc1(step) {
    if (step === 0) {
      return pad(
        "<h2>Generate a practice phrase</h2>" +
        generateExplainerHtml() +
        mnemonicHelpHtml() +
        wordCountSelectHtml() +
        '<div class="row" id="v2GenRow">' +
        '<button type="button" class="btn" id="v2Generate">Generate</button>' +
        clearBtnHtml() +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        '<div id="v2AddrWrap" class="v2-hidden"></div>' +
        pauseBtn("I generated a practice phrase", !mem.mnemonic)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Look at the numbered backup card</h2>" +
        wordGridHtml(mem.mnemonic) +
        '<label class="check"><input type="checkbox" id="v2CardAck" ' + (mem.cardAck ? "checked" : "") + "/> I looked at the backup card (indexes + words).</label>" +
        pauseBtn("Continue to Validate", !mem.cardAck)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      var gated = !mem.cardAck;
      return pad(
        "<h2>Validate &amp; derive</h2>" +
        (gated
          ? '<p class="msg-bad">Validate is locked until you ack the backup card (previous step).</p>'
          : '<p class="control-help">Fills receive addresses from the phrase in this tab. Not a wallet.</p>') +
        '<div class="row"><button type="button" class="btn" id="v2Derive" ' + (gated ? "disabled" : "") + ">Validate &amp; derive</button></div>" +
        '<div id="v2AddrWrap">' + addrHtml() + "</div>" +
        pauseBtn("I see an address that is not the phrase", !mem.lastRows)
      );
    }
    if (step === 3) {
      var n = mem.wordCount || 12;
      return pad(
        "<h2>Exercise</h2>" +
        '<p class="control-help">Generate again with new practice words. Choose 12, 15, 18, 21, or 24 words — the same list as classic Lab. Receive addresses stay hidden until you use Validate and derive.</p>' +
        generateExplainerHtml() +
        mnemonicHelpHtml() +
        wordCountSelectHtml() +
        '<div class="row">' +
        '<button type="button" class="btn secondary" id="v2Regen">Regenerate ' +
        n +
        "-word phrase</button>" +
        clearBtnHtml() +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("I tried regenerating", false)
      );
    }
    if (step === 4) {
      return quiz(
        "If you send coins to an address from this Lab phrase, what is true?",
        [
          { k: "bad", t: "The lab will refund me." },
          { k: "ok", t: "Those coins are at risk. This is not a wallet you should fund." },
          { k: "bad", t: "The address is the same as the recovery words." }
        ]
      );
    }
    return finishHtml(1);
  }

  async function uc2(step) {
    await ensurePhrase();
    if (step === 0) {
      return pad("<h2>The card is the backup</h2>" + wordGridHtml(mem.mnemonic) +
        '<p class="control-help">Hardware backups look like numbered cells. The textarea is not the object.</p>' +
        pauseBtn("The card is the backup", false));
    }
    if (step === 1) {
      return pad("<h2>Do / don’t</h2><ul class=\"help-list\">" +
        "<li><strong>Do:</strong> write by hand on paper you control; store separately from any passphrase.</li>" +
        "<li><strong>Don’t:</strong> photo, cloud drive, chat, or email a funded phrase.</li></ul>" +
        pauseBtn("I can state do / don’t", false));
    }
    if (step === 2) {
      return pad("<h2>Print optional</h2><p class=\"control-help\">Only on a trusted air-gapped machine. Practice sheet only.</p>" +
        '<button type="button" class="btn secondary" id="v2Print">Print practice sheet</button>' +
        pauseBtn("Print is optional after confirm", false));
    }
    if (step === 3) {
      return quiz("A photo of a funded backup on a phone is:", [
        { k: "bad", t: "Fine if the phone is locked." },
        { k: "ok", t: "A leak surface — don’t." },
        { k: "bad", t: "Required for Shamir." }
      ]);
    }
    return finishHtml(2);
  }

  async function uc3(step) {
    await ensurePhrase();
    if (step === 0) {
      return pad("<h2>Same words</h2>" + wordGridHtml(mem.mnemonic) +
        "<p>An optional passphrase is a 25th factor. Empty A vs B <code>test</code> is two wallets.</p>" +
        pauseBtn("Same words, two vaults", false));
    }
    if (step === 1) {
      return pad("<h2>Compare A vs B</h2>" +
        '<label class="field">Passphrase A <input id="ppA" type="text" placeholder="(empty)" autocomplete="off"/></label>' +
        '<label class="field">Passphrase B <input id="ppB" type="text" value="test" autocomplete="off"/></label>' +
        '<button type="button" class="btn" id="v2Cmp">Compare A vs B at index 0</button>' +
        '<pre class="out" id="v2CmpOut">Click Compare — public addresses only.</pre>' +
        pauseBtn("Addresses diverged", false));
    }
    if (step === 2) {
      return quiz("If you forget the passphrase for a vault:", [
        { k: "ok", t: "That vault’s coins are not recoverable from the 12 words alone." },
        { k: "bad", t: "Lab can reset it." },
        { k: "bad", t: "The addresses stay the same." }
      ]);
    }
    return finishHtml(3);
  }

  async function uc4(step) {
    await ensurePhrase();
    if (step === 0) {
      return pad("<h2>Path = folder</h2><p>m / 84h / 0h / 0h / change / index. Words do not change when the folder does.</p>" +
        pauseBtn("Path is a folder", false));
    }
    if (step === 1) {
      var p0 = window.BIP39Lab ? BIP39Lab.formatPath(84, "test", 0, 0, 0) : "m/84h/1h/0h/0/0";
      return pad("<h2>Toggle index</h2><p id=\"v2PathLine\"><code>" + p0 + "</code></p>" +
        '<button type="button" class="btn secondary" id="v2Idx">Toggle index 0 / 1</button>' +
        '<p>Preview (last 8): <code id="v2Tail">—</code></p>' +
        pauseBtn("I toggled a folder", false));
    }
    if (step === 2) {
      return quiz("Changing the derivation path:", [
        { k: "ok", t: "Changes the address; the words stay the same." },
        { k: "bad", t: "Rewrites the mnemonic." },
        { k: "bad", t: "Broadcasts a transaction." }
      ]);
    }
    return finishHtml(4);
  }

  async function uc5(step) {
    if (step === 0) {
      return pad("<h2>Watch-only is public material</h2><p>zpub/xpub + descriptors. Never paste the seed into a “watch” app.</p>" +
        pauseBtn("Seed stays out of watch apps", false));
    }
    if (step === 1) {
      await ensurePhrase();
      return pad("<h2>Export</h2><button type=\"button\" class=\"btn\" id=\"v2Wo\">Refresh watch-only</button>" +
        '<pre class="out" id="v2WoOut">Click refresh — public keys only.</pre>' +
        pauseBtn("I saw a zpub/xpub, not the seed", false));
    }
    if (step === 2) {
      return quiz("A watch-only wallet should receive:", [
        { k: "ok", t: "An xpub/zpub or descriptor — never the mnemonic." },
        { k: "bad", t: "The 12 words so it can “just work”." },
        { k: "bad", t: "Your passphrase in the same photo." }
      ]);
    }
    return finishHtml(5);
  }

  async function uc6(step) {
    if (step === 0) {
      return pad("<h2>Keys ≠ BIP-39 shares</h2><p>Multisig is M-of-N <em>public keys</em>. Shamir splits a secret. Do not mix the stories.</p>" +
        '<p><a class="btn secondary" href="../multisig.html">Open Multisig room</a></p>' +
        pauseBtn("Keys are not shares", false));
    }
    if (step === 1) {
      return pad("<h2>Three practice public keys</h2>" +
        '<button type="button" class="btn" id="v2Ms">Make 3 throwaway xpubs</button>' +
        '<pre class="out" id="v2MsOut">Educational pubkeys — not a funded policy.</pre>' +
        pauseBtn("I saw public keys only", false));
    }
    if (step === 2) {
      return quiz("2-of-3 multisig keys are:", [
        { k: "ok", t: "Independent public keys / cosigners — not Shamir word shares." },
        { k: "bad", t: "Three pieces of one mnemonic." },
        { k: "bad", t: "A reason to paste the seed into Discord." }
      ]);
    }
    return finishHtml(6);
  }

  async function uc7(step) {
    if (step === 0) {
      return pad("<h2>Shares ≠ cosigners</h2><p>This demo is educational GF(256) hex — <strong>not</strong> SLIP-39 / Trezor Suite.</p>" +
        '<p><a class="btn secondary" href="../shamir.html">Open Shamir room</a></p>' +
        pauseBtn("Shares are not multisig keys", false));
    }
    if (step === 1) {
      return pad("<h2>Split / combine</h2>" +
        '<button type="button" class="btn" id="v2Sh">Split practice secret 2-of-3</button>' +
        '<pre class="out" id="v2ShOut">Hex shares — never fund.</pre>' +
        pauseBtn("I split and recombined", false));
    }
    if (step === 2) {
      return quiz("Shamir shares in this lab:", [
        { k: "ok", t: "Are an educational split of one secret — not SLIP-39 production." },
        { k: "bad", t: "Are Trezor Suite compatible by default." },
        { k: "bad", t: "Replace multisig on mainnet." }
      ]);
    }
    return finishHtml(7);
  }

  async function uc8(step) {
    if (step === 0) {
      return pad("<h2>Air-gap model</h2><p>Inspect here → sign on a cold device you trust → broadcast from a hot coordinator. This card never signs.</p>" +
        pauseBtn("I will not paste a seed to “help” a PSBT", false));
    }
    if (step === 1) {
      return pad("<h2>Inspect</h2><button type=\"button\" class=\"btn\" id=\"v2Psbt\">Inspect sample PSBT</button>" +
        '<pre class="out" id="v2PsbtOut">Structure only.</pre>' +
        pauseBtn("Inspected structure, no sign", false));
    }
    if (step === 2) {
      return quiz("This lab’s PSBT tool:", [
        { k: "ok", t: "Parses structure offline and never signs or broadcasts." },
        { k: "bad", t: "Sends the seed to a coordinator." },
        { k: "bad", t: "Finalizes mainnet spends." }
      ]);
    }
    return finishHtml(8);
  }

  async function uc9(step) {
    if (step === 0) {
      return pad("<h2>xpub ≠ spend</h2><p>An account xpub lets software derive receive addresses. It cannot sign. It is still privacy-sensitive (gap, history).</p>" +
        pauseBtn("xpub is watch-only and leaky", false));
    }
    if (step === 1) {
      await ensurePhrase();
      return pad("<h2>Export account xpub</h2><button type=\"button\" class=\"btn\" id=\"v2Xpub\">Show BIP84 watch key</button>" +
        '<pre class="out" id="v2XpubOut">Public extended key only.</pre>' +
        pauseBtn("I did not see an xprv", false));
    }
    if (step === 2) {
      return quiz("Publishing an xpub:", [
        { k: "ok", t: "Does not spend coins but leaks future addresses / activity." },
        { k: "bad", t: "Lets anyone steal funds immediately." },
        { k: "bad", t: "Is the same as the 12 words." }
      ]);
    }
    return finishHtml(9);
  }

  async function uc10(step) {
    if (step === 0) {
      return pad("<h2>Lab stays offline</h2><p>This V2 page uses CSP <code>connect-src 'none'</code>. Balances are never implied to be zero when unknown.</p>" +
        pauseBtn("Default is offline", false));
    }
    if (step === 1) {
      return pad("<h2>Explicit opt-in</h2><p>Live fees/balances live on the <strong>Network</strong> room after you opt in. Address-only; never the mnemonic.</p>" +
        '<a class="btn" href="../network.html">Open Network (opt-in)</a>' +
        pauseBtn("I will only look up addresses I chose", false));
    }
    if (step === 2) {
      return quiz("If a balance API fails, the honest display is:", [
        { k: "ok", t: "unknown — never silent 0." },
        { k: "bad", t: "0.00000000 BTC." },
        { k: "bad", t: "Retry forever with the seed." }
      ]);
    }
    return finishHtml(10);
  }

  function wordCountSelectHtml() {
    var n = mem.wordCount || 12;
    var opts = [12, 15, 18, 21, 24]
      .map(function (v) {
        return '<option value="' + v + '"' + (v === n ? " selected" : "") + ">" + v + "</option>";
      })
      .join("");
    return (
      '<label class="field" for="v2WordCount"><span class="label-row">Word count</span>' +
      '<select id="v2WordCount">' +
      opts +
      "</select></label>"
    );
  }

  function mnemonicHelpHtml() {
    return (
      '<p class="label-row" id="v2MnemonicLine">This phrase is a BIP-39 mnemonic: English wordlist words only.' +
      '<span class="help-tip action-hover" id="wrapMnemonicI">' +
      '<button type="button" class="help-tip-btn" aria-label="About the BIP-39 mnemonic">i</button>' +
      '<span class="help-tip-panel action-hover-panel" id="overlayMnemonic" hidden>' +
      "<strong>BIP-39 mnemonic (English words only)</strong>" +
      '<span class="control-help" style="display:block;margin-top:0.35rem">' +
      "A mnemonic in this lab is a BIP-39 recovery phrase: a checksummed list of words from the official English wordlist " +
      "(12, 15, 18, 21, or 24 words). The list is English only. This is practice material in this browser tab. " +
      "It is not a funded wallet. Do not import these words into a wallet you use for real money." +
      "</span></span></span></p>"
    );
  }

  function generateExplainerHtml() {
    return (
      '<p class="control-help" id="v2GenHelp">' +
      "This tab asks the operating system for random bits (a cryptographically strong random number generator), " +
      "then turns those bits into a BIP-39 practice recovery phrase. " +
      "Do not send money to these words or to addresses that come from them. " +
      "Nothing leaves this browser tab." +
      "</p>"
    );
  }

  function clearBtnHtml() {
    return '<button type="button" class="btn danger" id="v2Clear">Clear secrets</button>';
  }

  function pad(inner) {
    return '<div class="card v2-pad">' + inner + "</div>";
  }
  function pauseBtn(label, disabled) {
    return '<div class="row" style="margin-top:0.85rem"><button type="button" class="btn" id="v2Pause"' +
      (disabled ? " disabled" : "") + ">" + label + "</button></div>";
  }
  function quiz(q, opts) {
    return pad("<h2>Quiz</h2><p>" + q + "</p><div class=\"quiz-opts\">" +
      opts.map(function (o, i) {
        return '<button type="button" class="btn secondary" data-quiz="' + o.k + '">' + (i + 1) + " · " + o.t + "</button>";
      }).join("") +
      '</div><div id="v2QuizMsg"></div>' +
      pauseBtn("Continue", true));
  }
  function finishHtml(id) {
    var next = TRACKS.filter(function (x) { return x.id === id + 1; })[0];
    return pad(
      "<h2>Finish</h2>" +
      '<label class="check"><input type="checkbox" id="v2Exit"/> I will not fund practice addresses / practice phrase.</label>' +
      '<p class="control-help">Force ack required. Then you may open the next track.</p>' +
      '<div class="row"><button type="button" class="btn" id="v2Finish" disabled>Finish track</button></div>' +
      (next ? '<p class="control-help">Next tease: UC' + next.id + " — " + next.title + "</p>" : "<p>All listed tracks done.</p>")
    );
  }
  function addrHtml() {
    if (!mem.lastRows || !mem.lastRows.length) {
      return '<p class="control-help">No addresses yet.</p>';
    }
    var rows = mem.lastRows.map(function (r) {
      return "<tr><td>" + r.index + "</td><td class=\"addr-text\">" + (r.bip84_p2wpkh || r.bip86_p2tr || "") + "</td></tr>";
    }).join("");
    return '<table class="addr-table"><thead><tr><th>#</th><th>Receive (BIP84 test)</th></tr></thead><tbody>' + rows + "</tbody></table>";
  }

  function wireStep() {
    var pause = $("v2Pause");
    if (pause) pause.addEventListener("click", function () {
      if (pause.disabled) return;
      var names = stepsFor(current.id);
      if (current.step < names.length - 1) {
        current.step += 1;
        renderTrack();
      }
    });
    var wc = $("v2WordCount");
    if (wc) {
      wc.addEventListener("change", function () {
        mem.wordCount = parseInt(wc.value, 10) || 12;
        var regenBtn = $("v2Regen");
        if (regenBtn) regenBtn.textContent = "Regenerate " + mem.wordCount + "-word phrase";
      });
    }
    var gen = $("v2Generate");
    if (gen) gen.addEventListener("click", async function () {
      var n = parseInt(($("v2WordCount") && $("v2WordCount").value) || String(mem.wordCount || 12), 10);
      mem.wordCount = n;
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
      mem.lastRows = null;
      mem.cardAck = false;
      $("v2Card").innerHTML = wordGridHtml(mem.mnemonic);
      var aw = $("v2AddrWrap");
      if (aw) {
        aw.innerHTML = "";
        aw.classList.add("v2-hidden");
      }
      if (pause) pause.disabled = false;
    });
    var ack = $("v2CardAck");
    if (ack) ack.addEventListener("change", function () {
      mem.cardAck = !!ack.checked;
      if (pause) pause.disabled = !mem.cardAck;
    });
    var der = $("v2Derive");
    if (der) der.addEventListener("click", async function () {
      if (!mem.cardAck) return;
      var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: 5, account: 0, change: 0 });
      mem.lastRows = r.rows || [];
      $("v2AddrWrap").innerHTML = addrHtml();
      $("v2AddrWrap").classList.remove("v2-hidden");
      if (pause) pause.disabled = false;
    });
    var regen = $("v2Regen");
    if (regen) regen.addEventListener("click", async function () {
      var n = parseInt(($("v2WordCount") && $("v2WordCount").value) || String(mem.wordCount || 12), 10);
      mem.wordCount = n;
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
      mem.lastRows = null;
      mem.cardAck = false;
      $("v2Card").innerHTML = wordGridHtml(mem.mnemonic);
      regen.textContent = "Regenerate " + n + "-word phrase";
    });
    var clr = $("v2Clear");
    if (clr) clr.addEventListener("click", clearSecrets);
    var pr = $("v2Print");
    if (pr) pr.addEventListener("click", function () { window.print(); });
    var cmp = $("v2Cmp");
    if (cmp) cmp.addEventListener("click", async function () {
      var a = ($("ppA") && $("ppA").value) || "";
      var b = ($("ppB") && $("ppB").value) || "";
      var ra = await BIP39Lab.deriveAddresses(mem.mnemonic, a, { network: "test", count: 1 });
      var rb = await BIP39Lab.deriveAddresses(mem.mnemonic, b, { network: "test", count: 1 });
      $("v2CmpOut").textContent =
        "A: " + ra.rows[0].bip84_p2wpkh + "\nB: " + rb.rows[0].bip84_p2wpkh + "\n" +
        (ra.rows[0].bip84_p2wpkh === rb.rows[0].bip84_p2wpkh ? "Same (empty vs empty?)." : "Diverged — two wallets.");
    });
    var idx = $("v2Idx");
    if (idx) {
      idx.setAttribute("data-i", "0");
      idx.addEventListener("click", async function () {
        var i = idx.getAttribute("data-i") === "1" ? 0 : 1;
        idx.setAttribute("data-i", String(i));
        $("v2PathLine").innerHTML = "<code>" + BIP39Lab.formatPath(84, "test", 0, 0, i) + "</code>";
        var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: i + 1, change: 0 });
        var row = r.rows[i] || r.rows[0];
        var a = row.bip84_p2wpkh || "";
        $("v2Tail").textContent = a.slice(-8);
      });
    }
    var wo = $("v2Wo");
    if (wo) wo.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main", account: 0 });
      var desc = BIP39Lab.descriptorsFromWatchOnly(pack, "main");
      $("v2WoOut").textContent = (pack.keys || []).map(function (k) { return k.label + "\n" + k.key; }).join("\n\n") +
        "\n\n" + ((desc && desc.descriptors) || []).slice(0, 2).join("\n");
    });
    var xp = $("v2Xpub");
    if (xp) xp.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main" });
      var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0] || pack.keys[0];
      $("v2XpubOut").textContent = k.label + "\n" + k.key + "\n(no xprv)";
    });
    var ms = $("v2Ms");
    if (ms) ms.addEventListener("click", async function () {
      var lines = [];
      for (var i = 0; i < 3; i++) {
        var m = await BIP39Lab.generateMnemonic(12);
        var pack = await BIP39Lab.exportWatchOnly(m, "", { network: "main" });
        var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0];
        lines.push("Cosigner " + (i + 1) + " (throwaway)\n" + k.key);
      }
      $("v2MsOut").textContent = lines.join("\n\n") + "\n\n2-of-3 would use these public keys — not mnemonic shares.";
    });
    var sh = $("v2Sh");
    if (sh) sh.addEventListener("click", function () {
      if (!window.ShamirLab) {
        $("v2ShOut").textContent = "ShamirLab missing.";
        return;
      }
      var secret = ShamirLab.generatePracticeSecret(16);
      var u8 = ShamirLab.fromHex(secret);
      var shares = ShamirLab.splitSecret(u8, 2, 3);
      var rec = ShamirLab.combineShares(shares.slice(0, 2));
      $("v2ShOut").textContent =
        "secret (practice hex): " + secret + "\n" +
        shares.map(ShamirLab.encodeShare).join("\n") +
        "\nrecombined: " + ShamirLab.toHex(rec) +
        "\nmatch: " + (ShamirLab.toHex(rec) === secret);
    });
    var pb = $("v2Psbt");
    if (pb) pb.addEventListener("click", function () {
      var r = BIP39Lab.inspectPsbt(PSBT_MIN);
      $("v2PsbtOut").textContent = JSON.stringify(r, null, 2);
    });
    document.querySelectorAll("[data-quiz]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ok = btn.getAttribute("data-quiz") === "ok";
        var box = $("v2QuizMsg");
        box.className = ok ? "msg-ok" : "msg-bad";
        box.textContent = ok ? "Correct." : "Not that one — try again.";
        if (ok && pause) pause.disabled = false;
      });
    });
    var ex = $("v2Exit");
    var fin = $("v2Finish");
    if (ex && fin) {
      ex.addEventListener("change", function () { fin.disabled = !ex.checked; });
      fin.addEventListener("click", function () {
        if (!ex.checked) return;
        markComplete(current.id);
        renderPicker();
      });
    }
  }

  function clearSecrets() {
    mem.mnemonic = "";
    mem.lastRows = null;
    mem.cardAck = false;
    if (current && current.id === 1) {
      current.step = 0;
      renderTrack();
    } else {
      renderPicker();
    }
  }

  function boot() {
    if ($("btnBackPicker")) $("btnBackPicker").addEventListener("click", renderPicker);
    var q = new URLSearchParams(location.search).get("uc");
    renderPicker();
    if (q) {
      var n = parseInt(q, 10);
      if (n >= 1 && n <= 10) openUc(n);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
