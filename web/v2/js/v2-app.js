/**
 * V2 use-case tracks — real BIP-39 via BIP39Lab bundle. No seed persistence.
 */
(function () {
  "use strict";
  var STORE = "bip39lab.v2";
  var mem = { mnemonic: "", lastRows: null, cardAck: false, wordCount: 12, cosigners: null, maxStep: 0 };
  function emptyCosigners() {
    return [0, 1, 2].map(function () {
      return { mnemonic: "", wordCount: 12, zpub: "" };
    });
  }
  var ENT_BITS = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 };
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
        '<div class="v2-callout is" id="gateIs"><strong>What this is</strong>' +
        "An offline practice track. Not a funded wallet, not a signer, not a broadcaster.</div>" +
        '<div class="v2-callout isnt" id="gateIsnt"><strong>What this is not</strong>' +
        "Do not import these words into a real wallet. Do not send coins to practice addresses.</div>" +
        '<div class="v2-callout done" id="gateDone"><strong>Done when</strong>' +
        t.done +
        "</div>";
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
      2: ["Card is backup", "Do and do not", "Print sheet", "Quiz", "Finish"],
      3: ["Same words", "Compare A/B", "Quiz", "Finish"],
      4: ["Folders", "Toggle path", "Quiz", "Finish"],
      5: ["Public only", "Export", "Quiz", "Finish"],
      6: ["M-of-N", "Three cosigners", "Quiz", "Finish"],
      7: ["What a share is", "Split / combine", "Quiz", "Finish"],
      8: ["Air-gap model", "Inspect PSBT", "Quiz", "Finish"],
      9: ["xpub ≠ spend", "Export xpub", "Quiz", "Finish"],
      10: ["Offline default", "Opt-in Network", "Quiz", "Finish"]
    };
    return map[id] || ["Start", "Finish"];
  }

  function conceptsFor(id) {
    var c = {
      1: ["Entropy → words", "Backup card", "Address ≠ phrase"],
      2: ["Card object", "Hand copy only", "Passphrase stored apart"],
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
    mem.maxStep = 0;
    if (id === 6) mem.cosigners = emptyCosigners();
    renderTrack();
    show("viewTrack");
  }

  function conceptTarget(id, chipIndex) {
    var map = {
      1: [0, 1, 2],
      2: [0, 1, 2],
      3: [0, 1, 1],
      4: [0, 1, 1],
      5: [0, 1, 1],
      6: [0, 1, 0],
      7: [0, 1, 1],
      8: [0, 1, 1],
      9: [0, 1, 1],
      10: [0, 1, 1]
    };
    var row = map[id] || [0, 1, 2];
    return row[chipIndex] != null ? row[chipIndex] : 0;
  }

  function jumpTo(i) {
    var names = stepsFor(current.id);
    i = i | 0;
    if (i < 0 || i >= names.length) return;
    if (i > (mem.maxStep || 0)) return;
    if (i === current.step) return;
    current.step = i;
    renderTrack();
  }

  function renderRail(names, step) {
    var html = "";
    var maxS = Math.max(0, mem.maxStep || 0);
    names.forEach(function (n, i) {
      if (i) html += '<li class="arr" aria-hidden="true">→</li>';
      var cls = i === step ? "is-current" : i < step ? "is-done" : "";
      var can = i <= maxS;
      html += '<li class="' + cls + (can ? " is-jump" : "") + '">';
      if (can) {
        html +=
          '<button type="button" class="rail-jump" data-step="' +
          i +
          '"' +
          (i === step ? ' aria-current="step"' : "") +
          '><span class="num">' +
          (i + 1) +
          '</span><span class="name">' +
          n +
          "</span></button>";
      } else {
        html += '<span class="num">' + (i + 1) + '</span><span class="name">' + n + "</span>";
      }
      html += "</li>";
    });
    return html;
  }

  function renderConcepts(id, step, nSteps) {
    var cs = conceptsFor(id);
    var maxS = Math.max(0, mem.maxStep || 0);
    return cs
      .map(function (t, i) {
        var target = conceptTarget(id, i);
        var can = target <= maxS;
        var nextT = i < 2 ? conceptTarget(id, i + 1) : 99;
        var here = target === step || (target < step && step < nextT) || (i === 2 && step > target);
        var cls = "c" + (here ? " hi" : "") + (can ? " is-jump" : "");
        return (
          '<button type="button" class="' +
          cls +
          '" data-concept-step="' +
          target +
          '"' +
          (can ? "" : " disabled") +
          (here ? ' aria-current="step"' : "") +
          ">" +
          t +
          "</button>"
        );
      })
      .join("");
  }

  function entropyHtml() {
    var n = mem.wordCount || 12;
    if (mem.mnemonic) {
      var wn = mem.mnemonic.trim().split(/\s+/).filter(Boolean).length;
      if (wn) n = wn;
    }
    var bits = ENT_BITS[n] || 128;
    return (
      '<p class="v2-entropy" id="v2Entropy">' +
      "<strong>Entropy</strong>" +
      '<span class="bits">' +
      bits +
      " bits</span>" +
      "<span> · " +
      n +
      "-word BIP-39 English. Longer phrase = more random bits from the operating system. Practice only. Do not fund it.</span>" +
      "</p>"
    );
  }

  function wordGridHtml(m, gridId) {
    var words = (m || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '<p class="control-help">Generate to fill this backup.</p>';
    var n = words.length;
    if (gridId === undefined) gridId = "v2WordGrid";
    var html = '<ol class="word-grid"' + (gridId ? ' id="' + gridId + '"' : "") + ">";
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
    mem.maxStep = Math.max(mem.maxStep || 0, step);
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
    if (window.Bip39Glossary && typeof Bip39Glossary.enhance === "function") {
      Bip39Glossary.enhance();
    }
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
        doDont(
          "Generate a practice phrase in this tab and look at the numbered card first.",
          "Do not import these words into a funded wallet. Do not send coins to addresses from this phrase."
        ) +
        generateExplainerHtml() +
        entropyHtml() +
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
        doDont(
          "Read the numbered cells. The card is the backup object.",
          "Do not treat the receive address as the backup. The address is not the words."
        ) +
        entropyHtml() +
        wordGridHtml(mem.mnemonic) +
        '<label class="check"><input type="checkbox" id="v2CardAck" ' + (mem.cardAck ? "checked" : "") + "/> I looked at the backup card (indexes + words).</label>" +
        pauseBtn("Continue to Validate", !mem.cardAck)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      var gated = !mem.cardAck;
      var derived = !!(mem.lastRows && mem.lastRows.length);
      return pad(
        "<h2>Validate &amp; derive</h2>" +
        doDont(
          "Keep the numbered card in view so you see the source of the addresses.",
          "Do not send coins to these practice addresses."
        ) +
        '<p class="control-help" id="v2DeriveHelp"><strong>Where addresses come from.</strong> ' +
        "The numbered card (words) is stretched into a <em>seed</em>. Receive addresses are derived from that seed.</p>" +
        '<div class="v2-callout done"><strong>What is not the same</strong>' +
        "The seed is not the card. The seed is not the address. Click Validate and derive. This is not a wallet.</div>" +
        entropyHtml() +
        pipeHtml(true, derived, derived) +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        (gated
          ? '<p class="msg-bad">Validate is locked until you ack the backup card (previous step).</p>'
          : "") +
        '<div class="row"><button type="button" class="btn" id="v2Derive" ' +
        (gated ? "disabled" : "") +
        ">Validate &amp; derive</button>" +
        clearBtnHtml() +
        "</div>" +
        '<div id="v2AddrWrap">' +
        (derived ? addrHtml() : '<p class="control-help">Addresses stay hidden until you click Validate and derive.</p>') +
        "</div>" +
        pauseBtn("I see an address that is not the phrase", !derived)
      );
    }
    if (step === 3) {
      var n = mem.wordCount || 12;
      return pad(
        "<h2>Exercise</h2>" +
        doDont(
          "Try another word count. Entropy bits change with length.",
          "Do not fund any of these practice phrases or their addresses."
        ) +
        callout(
          "done",
          "Try another length",
          "Choose 12, 15, 18, 21, or 24 words. Entropy bits change with length. Receive addresses stay hidden until Validate and derive."
        ) +
        generateExplainerHtml() +
        entropyHtml() +
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
          {
            k: "bad",
            t: "The lab will refund me.",
            why: "Wrong. This tab never holds your coins and has no refund desk. A practice address that receives real bitcoin is at risk."
          },
          {
            k: "ok",
            t: "Those coins are at risk. This is not a wallet you should fund.",
            okwhy: "Correct. Practice phrases and addresses are not a funded wallet."
          },
          {
            k: "bad",
            t: "The address is the same as the recovery words.",
            why: "Wrong. The receive string (tb1q / bc1q) is not the numbered word list. Same seed, different objects."
          }
        ]
      );
    }
    return finishHtml(1);
  }

  async function uc2(step) {
    if (step === 0) {
      return pad(
        "<h2>The numbered card is the backup</h2>" +
        doDont(
          "Treat the numbered cells as the backup object.",
          "Do not treat a textarea on a screen as the backup."
        ) +
        mnemonicHelpHtml() +
        callout(
          "is",
          "What the card is",
          "A paper backup is the numbered cells: index plus word. That object is what you would write by hand. A textarea on a screen is not the backup. This card is practice only. It is not a funded wallet."
        ) +
        (mem.mnemonic
          ? ""
          : wordCountSelectHtml() +
            '<div class="row"><button type="button" class="btn" id="v2Generate">Generate practice card</button>' +
            clearBtnHtml() +
            "</div>") +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        (mem.mnemonic
          ? '<div class="row">' + clearBtnHtml() + "</div>"
          : "") +
        '<label class="check"><input type="checkbox" id="v2CardAck" ' +
        (mem.cardAck ? "checked" : "") +
        "/> I looked at the backup card (indexes and words). The card is the backup.</label>" +
        pauseBtn("The card is the backup", !mem.mnemonic || !mem.cardAck)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Do this. Do not do that.</h2>" +
        doDont(
          "Copy the numbered cells by hand onto paper you control. Keep any passphrase in a different place from this sheet.",
          "Do not photograph the sheet. Do not store it in a cloud drive, chat, or email. Do not keep it on a networked phone if the phrase is funded.",
          "v2DoNotList"
        ) +
        mnemonicHelpHtml() +
        '<p class="control-help">These rules apply to a funded recovery phrase. This lab card is practice. Treat the discipline as if coins were at risk, then do the real backup in a wallet you trust.</p>' +
        '<div class="row">' +
        clearBtnHtml() +
        "</div>" +
        pauseBtn("I can state what to do and what not to do", false)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      return pad(
        "<h2>Print is optional, after you confirm</h2>" +
        doDont(
          "If you print, treat it as classroom layout only.",
          "Do not use a printed practice sheet for real funds. Print is not an air-gap."
        ) +
        '<div class="v2-callout warn" id="v2PrintHelp">' +
        "<strong>Print is not the safest backup</strong>" +
        "Printing from this lab means the words are already on a computer, so this is not an air-gap. " +
        "The safer practice is to copy the numbered cells by hand with the computer offline, and not to print. " +
        "Print is optional for classroom layout only. Do not use a printed practice sheet for real funds." +
        "</div>" +
        '<label class="check"><input type="checkbox" id="v2PrintAck"/> I am printing a practice sheet only. I will not photograph a funded phrase on a networked phone.</label>' +
        '<div class="row" style="margin-top:0.65rem">' +
        '<button type="button" class="btn secondary" id="v2Print" disabled>Print practice sheet</button>' +
        clearBtnHtml() +
        "</div>" +
        pauseBtn("Print is optional after I confirm", false)
      );
    }
    if (step === 3) {
      return pad(
        "<h2>Quiz</h2>" +
        "<p>Four sentences. Choose the two that are right. Both right sentences must be selected to continue.</p>" +
        '<div class="quiz-opts" id="v2Uc2Quiz">' +
        '<button type="button" class="btn secondary" data-quiz="bad">1 · Photograph the sheet, or print it from this computer.<span class="v2-quiz-why" hidden>Wrong. Photograph and print from this computer put the words on a camera or a printer path. That is not the backup discipline.</span></button>' +
        '<button type="button" class="btn secondary" data-quiz="ok" id="v2Qhand">2 · Write the numbered cells by hand while the computer is offline.<span class="v2-quiz-why" hidden>Correct. Hand copy offline is the backup discipline.</span></button>' +
        '<button type="button" class="btn secondary" data-quiz="ok" id="v2Qprint">3 · Photograph and print from this lab are not the most secure, because the words are on the computer (not an air-gap).<span class="v2-quiz-why" hidden>Correct. Print and photos are not an air-gap.</span></button>' +
        '<button type="button" class="btn secondary" data-quiz="bad">4 · Print is as secure as an air-gapped handwritten copy.<span class="v2-quiz-why" hidden>Wrong. Print is not an air-gap: the words were already on the computer.</span></button>' +
        "</div>" +
        '<div id="v2QuizMsg"></div>' +
        pauseBtn("Continue", true)
      );
    }
    return finishHtml(2);
  }

  async function uc3(step) {
    if (step === 0) {
      var n = mem.wordCount || 12;
      return pad(
        "<h2>Same words</h2>" +
        doDont(
          "Leave passphrase A empty and put a practice word in B (for example test) to see two wallets from one card.",
          "Do not treat the passphrase as a PIN on the same wallet. Forgotten passphrase means that vault is gone."
        ) +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row">' +
        '<button type="button" class="btn" id="v2Generate">Generate</button>' +
        '<button type="button" class="btn secondary" id="v2Regen">Regenerate ' + n + "-word phrase</button>" +
        clearBtnHtml() +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("Same words, two vaults", !mem.mnemonic)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Compare A vs B</h2>" +
        doDont(
          "Compare two passphrases against the same words. Read the verdict.",
          "Do not fund either practice address."
        ) +
        callout("is", "What you are comparing", "Same BIP-39 words. Different optional passphrase. Different receive addresses. Public addresses only.") +
        '<label class="field">Passphrase A <input id="ppA" type="text" placeholder="(empty = no passphrase)" autocomplete="off"/></label>' +
        '<label class="field">Passphrase B <input id="ppB" type="text" value="test" autocomplete="off"/></label>' +
        '<button type="button" class="btn" id="v2Cmp">Compare A vs B at index 0</button>' +
        '<div id="v2CmpOut" class="control-help">Click Compare. The verdict names the passphrases you typed. It does not say empty when a field has text.</div>' +
        pauseBtn("I compared two passphrases", true)
      );
    }
    if (step === 2) {
      return quiz("If you forget the passphrase for a vault:", [
        {
          k: "ok",
          t: "That vault’s coins are not recoverable from the 12 words alone.",
          okwhy: "Correct. Same words without that passphrase open a different vault."
        },
        {
          k: "bad",
          t: "Lab can reset it.",
          why: "Wrong. The lab cannot recover a forgotten passphrase. There is no reset desk."
        },
        {
          k: "bad",
          t: "The addresses stay the same.",
          why: "Wrong. A different passphrase derives different addresses. They do not stay the same."
        }
      ]);
    }
    return finishHtml(3);
  }

  async function uc4(step) {
    await ensurePhrase();
    if (step === 0) {
      return pad(
        "<h2>Path = folder</h2>" +
        doDont(
          "A derivation path is a folder inside the seed tree. Change the folder, the address changes. The recovery words do not change.",
          "Do not think a new path makes a new recovery phrase. The path is not the seed."
        ) +
        callout(
          "is",
          "What each piece means (this lab, BIP84 test)",
          "<code>m</code> = master (from the words). " +
          "<code>84'</code> = native segwit purpose (addresses start with tb1q / bc1q). " +
          "<code>1'</code> = test network coin type (0' would be mainnet). " +
          "<code>0'</code> = first account slot. " +
          "<code>0</code> = receive (1 would be change). " +
          "<code>0</code> at the end = first address in that folder (index)."
        ) +
        '<p class="v2-path-big" id="v2PathDemo">m/84\'/1\'/0\'/0/0</p>' +
        "<p class=\"control-help\">Hardened levels use an apostrophe (purpose, coin, account). Same words. Different BIP purpose = different address shape. This track uses BIP84.</p>" +
        pauseBtn("Path is a folder", false)
      );
    }
    if (step === 1) {
      var p0 = window.BIP39Lab ? BIP39Lab.formatPath(84, "test", 0, 0, 0) : "m/84'/1'/0'/0/0";
      return pad(
        "<h2>Why toggle the index?</h2>" +
        doDont(
          "Click to raise the last path number so you see the next receive address.",
          "Do not think a new index is a new recovery phrase. The words stay the same."
        ) +
        callout(
          "done",
          "Index is which receive address in this folder",
          "Wallets ask for a new address so you do not reuse the first one. Index 0 is the first receive address. Index 1 is the next. The words stay the same. Only the last number in the path changes. Click to see the address string change while the card does not."
        ) +
        '<p class="v2-path-big" id="v2PathLine">' + p0 + "</p>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn" id="v2Idx">Show index 1 (next receive address)</button>' +
        '<button type="button" class="btn secondary" id="v2IdxZero">Back to index 0</button>' +
        "</div>" +
        '<p class="control-help">Full receive address at this index (BIP84 test)</p>' +
        '<code class="v2-preview-big" id="v2Tail">Index 0 loads first. Each Next click adds 1 to the last path number.</code>' +
        pauseBtn("I changed the folder index", true)
      );
    }
    if (step === 2) {
      return quiz("Changing the derivation path:", [
        {
          k: "ok",
          t: "Changes the address; the words stay the same.",
          okwhy: "Correct. Only the folder index in the path changes."
        },
        {
          k: "bad",
          t: "Rewrites the mnemonic.",
          why: "Wrong. The recovery words stay put. Only the last numbers in the path change."
        },
        {
          k: "bad",
          t: "Broadcasts a transaction.",
          why: "Wrong. Changing a folder path is local math. Nothing is sent to the network."
        }
      ]);
    }
    return finishHtml(4);
  }

  async function uc5(step) {
    if (step === 0) {
      return pad(
        "<h2>Watch-only is public material " + termI("WATCHONLY") + "</h2>" +
        doDont(
          "Give a watch-only app an xpub, zpub, or descriptor (click i on those words on the next pad).",
          "Do not paste the recovery phrase or seed into a watch-only app."
        ) +
        pauseBtn("Seed stays out of watch apps", false)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Export " + termI("WATCHONLY") + "</h2>" +
        doDont(
          "Export a public viewing key so a phone or desktop can list addresses and incoming payments while the twelve words stay on paper or a hardware signer.",
          "Do not export by typing the recovery phrase into the watch app. That is a full wallet, not watch-only."
        ) +
        callout(
          "is",
          "Why you need this (not obvious)",
          "A watch-only app cannot derive the next receive address from nothing. Export is the hand-off: the vault gives the hot screen a public viewing key, not the seed. Without this, people paste the twelve words into every app that “just wants to show a balance.”"
        ) +
        '<p class="control-help">Jargon on this pad: ' +
        "xpub " + termI("XPUB") +
        " · zpub " + termI("ZPUB") +
        " · ypub " + termI("YPUB") +
        " · descriptor " + termI("DESCRIPTOR") +
        " · watch-only " + termI("WATCHONLY") +
        "</p>" +
        callout(
          "done",
          "Public only",
          "Refresh to show watch-only keys from this practice phrase. You should see xpub or zpub, not the twelve words. Lines under --- output descriptors --- are the same public material as an import string (wpkh / tr / sh / pkh) — click (i) on descriptor."
        ) +
        '<button type="button" class="btn" id="v2Wo">Refresh watch-only</button>' +
        '<pre class="out" id="v2WoOut">Click refresh — public keys only.</pre>' +
        pauseBtn("I saw a zpub/xpub, not the seed", false)
      );
    }
    if (step === 2) {
      return quiz("A watch-only wallet should receive:", [
        {
          k: "ok",
          t: "An xpub/zpub or descriptor — never the mnemonic.",
          okwhy: "Correct. That is a public viewing key, not spend authority."
        },
        {
          k: "bad",
          t: "The 12 words so it can “just work”.",
          why: "Wrong. Pasting the mnemonic makes a hot spend wallet, not watch-only."
        },
        {
          k: "bad",
          t: "Your passphrase in the same photo.",
          why: "Wrong. The passphrase is a spend secret. Watch-only gets a public key, never the 25th word."
        }
      ]);
    }
    return finishHtml(5);
  }

  function cosignerCardHtml(i) {
    if (!mem.cosigners) mem.cosigners = emptyCosigners();
    var c = mem.cosigners[i];
    var letter = ["A", "B", "C"][i];
    return (
      '<div class="v2-cosigner" data-cs="' +
      i +
      '">' +
      "<h3>Cosigner " +
      letter +
      " — own phrase</h3>" +
      wordCountSelectHtml("v2CsWc" + i, c.wordCount || 12) +
      '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
      '<button type="button" class="btn" data-cs-gen="' +
      i +
      '">Generate phrase</button>' +
      '<button type="button" class="btn secondary" data-cs-zpub="' +
      i +
      '"' +
      (c.mnemonic ? "" : " disabled") +
      ">Show BIP84 zpub</button>" +
      '<button type="button" class="btn danger" data-cs-clear="' +
      i +
      '">Clear this</button>' +
      "</div>" +
      '<div class="v2-cs-card">' +
      wordGridHtml(c.mnemonic, "v2CsGrid" + i) +
      "</div>" +
      '<pre class="out" id="v2CsZpub' +
      i +
      '">' +
      (c.zpub || "Generate first. The shared string is a zpub (BIP-84 native segwit), not xpub and not the words.") +
      "</pre>" +
      "</div>"
    );
  }

  async function uc6(step) {
    if (step === 0) {
      return pad(
        "<h2>M-of-N is a spend rule</h2>" +
        doDont(
          "Read M as how many signatures are required, N as how many independent keys exist. 2-of-3 means any two of three people can spend. Each person keeps a full recovery phrase.",
          "Do not read M-of-N as cutting one BIP-39 phrase into N pieces. That is Shamir (UC7), not this track."
        ) +
        callout(
          "is",
          "M and N in one sentence",
          "<strong>N</strong> = number of cosigners " +
            termI("COSIGNER") +
            " (here 3). <strong>M</strong> = signatures needed to move coins (here 2). Multisig " +
            termI("MULTISIG") +
            " " +
            termI("MOFN") +
            " builds one vault address from N public keys. Two signatures spend. One lost seed is painful, not always fatal."
        ) +
        '<div class="v2-mofn" id="v2MofnPic" aria-label="2 of 3">' +
        "<span><strong>N = 3</strong> keys (A, B, C)</span>" +
        "<span><strong>M = 2</strong> signatures to spend</span>" +
        "<span>A+B · A+C · B+C all work. A alone does not.</span>" +
        "</div>" +
        callout(
          "isnt",
          "Not BIP-39 shares",
          "A share " +
            termI("SHARE") +
            " cannot sign. Combining Shamir " +
            termI("SHAMIR") +
            " pieces rebuilds one secret. This pad is many keys, not pieces of one mnemonic " +
            termI("BIP39") +
            "."
        ) +
        '<p class="control-help">Next pad: three practice phrases so you see where the three public keys come from.</p>' +
        pauseBtn("I can say what M and N are", false)
      );
    }
    if (step === 1) {
      if (!mem.cosigners) mem.cosigners = emptyCosigners();
      var ready = mem.cosigners.every(function (c) {
        return c && c.zpub;
      });
      return pad(
        "<h2>Three cosigners, three phrases</h2>" +
        doDont(
          "Generate three different practice phrases. Keep the words. Share only the zpub from each phrase.",
          "Do not paste any of the three seeds into chat, Discord, or a coordinator. Do not treat the three zpubs as slices of one mnemonic."
        ) +
        callout(
          "is",
          "Where the public key comes from",
          "Each cosigner is a whole BIP-39 phrase. Show BIP84 zpub " +
            termI("ZPUB") +
            " derives the account public key at m/84'/0'/0'. The string starts with zpub, not xpub " +
            termI("XPUB") +
            ". xpub is a different prefix (often legacy). You would hand the zpub to a coordinator. You keep the words."
        ) +
        callout(
          "warn",
          "Practice only",
          "These three phrases are throwaway. This is not a funded 2-of-3 policy. 2-of-3 would use these three public keys — not three pieces of one mnemonic."
        ) +
        '<div class="v2-cosigners">' +
        cosignerCardHtml(0) +
        cosignerCardHtml(1) +
        cosignerCardHtml(2) +
        "</div>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
        '<button type="button" class="btn danger" id="v2CsClearAll">Clear all three secrets</button>' +
        '<a class="btn secondary" href="../multisig.html">Open Multisig room (full M-of-N build)</a>' +
        "</div>" +
        (ready
          ? '<p class="msg-ok" id="v2CsReady">Three zpubs ready. Those are what a 2-of-3 coordinator would see — not the words.</p>'
          : '<p class="control-help">Pause stays locked until each cosigner shows a zpub.</p>') +
        pauseBtn("I saw three zpubs from three phrases", !ready)
      );
    }
    if (step === 2) {
      return quiz("2-of-3 multisig keys are:", [
        {
          k: "ok",
          t: "Independent public keys / cosigners — not Shamir word shares.",
          okwhy: "Correct. Each key is a whole wallet. M signatures of N keys, not M pieces of one secret."
        },
        {
          k: "bad",
          t: "Three pieces of one mnemonic.",
          why: "Wrong. Those would be Shamir shares of one secret (UC7). 2-of-3 here is three independent keys; any two signatures spend."
        },
        {
          k: "bad",
          t: "A reason to paste the seed into Discord.",
          why: "Wrong. You share public keys or zpubs to build the vault. The seed never goes in chat."
        }
      ]);
    }
    return finishHtml(6);
  }

  async function uc7(step) {
    if (step === 0) {
      return pad(
        "<h2>What a share is</h2>" +
        doDont(
          "Treat this demo as an educational split of one secret into hex shares. M shares rebuild that same secret.",
          "Do not treat these shares as Trezor Suite / SLIP-39 word lists. Do not treat them as multisig cosigner keys (that was UC6)."
        ) +
        callout(
          "is",
          "One secret, many pieces",
          "Shamir " +
            termI("SHAMIR") +
            " takes one blob and makes N shares " +
            termI("SHARE") +
            ". Any M of them rebuild the blob. A share cannot sign a bitcoin spend. Combining shares is recovery, not a 2-person signature."
        ) +
        callout(
          "isnt",
          "Not the Shamir room yet",
          "The next pad splits a practice secret in this track. The Shamir room is a longer GF(256) lab — optional, after you have seen split/combine here. It is not SLIP-39 " +
            termI("SLIP39") +
            "."
        ) +
        pauseBtn("Shares are not multisig keys", false)
      );
    }
    if (step === 1) {
      var did = !!(mem.shamirDone);
      return pad(
        "<h2>Split / combine</h2>" +
        doDont(
          "Split a practice hex secret 2-of-3 and recombine two shares here.",
          "Do not fund these shares. They are not Trezor SLIP-39."
        ) +
        callout("warn", "Never fund", "Hex shares in this lab are practice. Do not use them for real funds. They are not Trezor SLIP-39.") +
        '<button type="button" class="btn" id="v2Sh">Split practice secret 2-of-3</button>' +
        '<pre class="out" id="v2ShOut">' +
        (did ? "Already split once this session. Click again to make a new practice secret." : "Hex shares — never fund.") +
        "</pre>" +
        '<p class="control-help">Optional deeper lab (same idea, more controls): ' +
        '<a href="../shamir.html">Open Shamir room</a>' +
        " — educational GF(256) only, not Suite, not UC6 keys.</p>" +
        pauseBtn("I split and recombined", !did)
      );
    }
    if (step === 2) {
      return quiz("Shamir shares in this lab:", [
        {
          k: "ok",
          t: "Are an educational split of one secret — not SLIP-39 production.",
          okwhy: "Correct. Hex shares here teach threshold recovery, not a Trezor backup."
        },
        {
          k: "bad",
          t: "Are Trezor Suite compatible by default.",
          why: "Wrong. This lab’s hex shares are educational GF(256). They are not SLIP-39 / Trezor Suite words."
        },
        {
          k: "bad",
          t: "Replace multisig on mainnet.",
          why: "Wrong. Combining shares rebuilds one secret. It does not replace M-of-N signatures from separate keys (UC6)."
        }
      ]);
    }
    return finishHtml(7);
  }

  async function uc8(step) {
    if (step === 0) {
      return pad(
        "<h2>Air-gap model</h2>" +
        doDont(
          "Inspect the package here. Sign on a cold device you trust. Broadcast from a hot coordinator you choose.",
          "Do not paste a seed to help a PSBT. This card never signs and never broadcasts."
        ) +
        pauseBtn("I will not paste a seed to help a PSBT", false)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Inspect</h2>" +
        doDont(
          "Inspect the sample package offline.",
          "Do not paste a seed. This card never signs and never broadcasts."
        ) +
        callout("is", "Structure only", "A sample PSBT is parsed offline. No signature is added.") +
        '<button type="button" class="btn" id="v2Psbt">Inspect sample PSBT</button>' +
        '<pre class="out" id="v2PsbtOut">Structure only.</pre>' +
        pauseBtn("Inspected structure, no sign", false)
      );
    }
    if (step === 2) {
      return quiz("This lab’s PSBT tool:", [
        {
          k: "ok",
          t: "Parses structure offline and never signs or broadcasts.",
          okwhy: "Correct. Inspect is structure only."
        },
        {
          k: "bad",
          t: "Sends the seed to a coordinator.",
          why: "Wrong. Inspect never uploads a seed. A PSBT is a transaction package, not a mnemonic."
        },
        {
          k: "bad",
          t: "Finalizes mainnet spends.",
          why: "Wrong. This card parses framing offline. It does not finalize or broadcast."
        }
      ]);
    }
    return finishHtml(8);
  }

  async function uc9(step) {
    if (step === 0) {
      return pad(
        "<h2>xpub is not spend</h2>" +
        doDont(
          "Treat an account xpub as watch-only: software can derive receive addresses.",
          "Do not publish an xpub casually. It cannot sign, but it leaks future addresses and history. It is not the recovery phrase."
        ) +
        pauseBtn("xpub is watch-only and leaky", false)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Export account xpub " + termI("XPUB") + " " + termI("ZPUB") + "</h2>" +
        doDont(
          "Show the BIP-84 watch key. You should see a zpub or xpub.",
          "Do not expect an xprv or the twelve words on this pad."
        ) +
        callout("is", "Public extended key", "You should see an xpub or zpub. You should not see an xprv " + termI("XPRV") + " or the words.") +
        '<button type="button" class="btn" id="v2Xpub">Show BIP84 watch key</button>' +
        '<pre class="out" id="v2XpubOut">Public extended key only.</pre>' +
        pauseBtn("I did not see an xprv", false)
      );
    }
    if (step === 2) {
      return quiz("Publishing an xpub:", [
        {
          k: "ok",
          t: "Does not spend coins but leaks future addresses / activity.",
          okwhy: "Correct. Watch-only and leaky, not spend."
        },
        {
          k: "bad",
          t: "Lets anyone steal funds immediately.",
          why: "Wrong. An xpub cannot sign. It can leak future addresses and history."
        },
        {
          k: "bad",
          t: "Is the same as the 12 words.",
          why: "Wrong. The xpub is a public account key. The twelve words can spend."
        }
      ]);
    }
    return finishHtml(9);
  }

  async function uc10(step) {
    if (step === 0) {
      return pad(
        "<h2>Lab stays offline</h2>" +
        doDont(
          "Keep this V2 page offline (CSP connect-src none). If a balance is unknown, treat it as unknown.",
          "Do not read a missing lookup as zero coins."
        ) +
        pauseBtn("Default is offline", false)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Explicit opt-in</h2>" +
        doDont(
          "Look up only addresses you chose, after opt-in on Network.",
          "Do not send the mnemonic. Lookups are address-only."
        ) +
        callout(
          "warn",
          "Network room",
          "Live fees and balances live on the Network page after you opt in. Lookups are address-only. Never send the mnemonic."
        ) +
        '<a class="btn" href="../network.html">Open Network (opt-in)</a>' +
        pauseBtn("I will only look up addresses I chose", false)
      );
    }
    if (step === 2) {
      return quiz("If a balance API fails, the honest display is:", [
        {
          k: "ok",
          t: "unknown — never silent 0.",
          okwhy: "Correct. A failed lookup is unknown, not an empty wallet."
        },
        {
          k: "bad",
          t: "0.00000000 BTC.",
          why: "Wrong. A failed lookup is unknown, not zero. Zero looks like an empty wallet."
        },
        {
          k: "bad",
          t: "Retry forever with the seed.",
          why: "Wrong. Lookups are address-only. Never send the mnemonic to a balance API."
        }
      ]);
    }
    return finishHtml(10);
  }

  function attrEsc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function wordCountSelectHtml(selectId, nForce) {
    var n = nForce || mem.wordCount || 12;
    var id = selectId || "v2WordCount";
    var opts = [12, 15, 18, 21, 24]
      .map(function (v) {
        return '<option value="' + v + '"' + (v === n ? " selected" : "") + ">" + v + "</option>";
      })
      .join("");
    return (
      '<label class="field" for="' +
      id +
      '"><span class="label-row">Word count</span>' +
      '<select id="' +
      id +
      '">' +
      opts +
      "</select></label>"
    );
  }

  function termI(id) {
    var t = window.Bip39Glossary && Bip39Glossary.byId && Bip39Glossary.byId[id];
    var title = (t && t.title) || id;
    var short = (t && t.short) || "";
    var body = (t && t.body) || "";
    return (
      '<span class="help-tip help-tip-safety" data-term="' +
      id +
      '">' +
      '<button type="button" class="help-tip-btn" aria-label="About ' +
      title +
      '">i</button>' +
      '<span class="help-tip-panel" hidden><strong>' +
      title +
      "</strong>" +
      (short ? " — " + short : "") +
      (body
        ? '<span class="control-help" style="display:block;margin-top:0.35rem">' + body + "</span>"
        : "") +
      "</span></span>"
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

  function pipeHtml(litWords, litSeed, litAddr) {
    function st(id, title, detail, on) {
      return (
        '<div class="st' +
        (on ? " hi" : "") +
        '" data-pipe="' +
        id +
        '"><span class="k">' +
        title +
        '</span><span class="d">' +
        detail +
        "</span></div>"
      );
    }
    return (
      '<div class="v2-pipe" id="v2Pipe" aria-label="Words to seed to address">' +
      st("words", "words", "Numbered backup card", !!litWords) +
      '<span class="arr" aria-hidden="true">→</span>' +
      st("seed", "seed", "Phrase stretched into a seed (not the address)", !!litSeed) +
      '<span class="arr" aria-hidden="true">→</span>' +
      st("addr", "address", "Receive string from that seed", !!litAddr) +
      "</div>"
    );
  }

  function callout(kind, title, body) {
    return (
      '<div class="v2-callout ' +
      kind +
      '"><strong>' +
      title +
      "</strong>" +
      body +
      "</div>"
    );
  }
  function doDont(doBody, dontBody, wrapId) {
    return (
      '<div class="v2-donot"' +
      (wrapId ? ' id="' + wrapId + '"' : "") +
      ">" +
      '<div class="v2-callout is do"><strong>Do</strong>' +
      doBody +
      "</div>" +
      '<div class="v2-callout isnt dont"><strong>Do not</strong>' +
      dontBody +
      "</div>" +
      "</div>"
    );
  }
  function pad(inner) {
    return '<div class="card v2-pad">' + inner + "</div>";
  }
  function pauseBtn(label, disabled) {
    return '<div class="row" style="margin-top:0.85rem"><button type="button" class="btn" id="v2Pause"' +
      (disabled ? " disabled" : "") + ">" + label + "</button></div>";
  }
  function quiz(q, opts) {
    return pad(
      "<h2>Quiz</h2><p>" +
        q +
        "</p><div class=\"quiz-opts\">" +
        opts
          .map(function (o, i) {
            return (
              '<button type="button" class="btn secondary" data-quiz="' +
              o.k +
              '">' +
              (i + 1) +
              " · " +
              o.t +
              '<span class="v2-quiz-why" hidden>' +
              (o.k === "ok" ? o.okwhy || "Correct." : o.why || "Wrong. That is not what this track teaches.") +
              "</span></button>"
            );
          })
          .join("") +
        '</div><div id="v2QuizMsg"></div>' +
        pauseBtn("Continue", true)
    );
  }
  function finishHtml(id) {
    var next = TRACKS.filter(function (x) { return x.id === id + 1; })[0];
    return pad(
      "<h2>Finish</h2>" +
      callout("isnt", "Force exit", "Confirm you will not fund the practice phrase or practice addresses. Then you may open the next track.") +
      '<label class="check"><input type="checkbox" id="v2Exit"/> I will not fund practice addresses / practice phrase.</label>' +
      '<div class="row"><button type="button" class="btn" id="v2Finish" disabled>Finish track</button></div>' +
      (next ? '<p class="control-help">Next tease: UC' + next.id + " — " + next.title + "</p>" : "<p>All listed tracks done.</p>")
    );
  }
  function addrHtml() {
    if (!mem.lastRows || !mem.lastRows.length) {
      return '<p class="control-help">No addresses yet.</p>';
    }
    var cells = mem.lastRows.map(function (r) {
      return (
        '<div class="cell">' +
        '<span class="idx nav-step" aria-label="index ' +
        r.index +
        '">#' +
        r.index +
        "</span>" +
        '<span class="addr-text">' +
        (r.bip84_p2wpkh || r.bip86_p2tr || "") +
        "</span></div>"
      );
    }).join("");
    return (
      '<p class="v2-addr-kicker" id="v2AddrKicker">Receive addresses from this seed (BIP84 test).</p>' +
      '<div class="v2-addr-grid" id="v2AddrGrid">' +
      cells +
      "</div>"
    );
  }

  function wireStep() {
    var pause = $("v2Pause");
    if (pause) pause.addEventListener("click", function () {
      if (pause.disabled) return;
      var names = stepsFor(current.id);
      if (current.step < names.length - 1) {
        current.step += 1;
        mem.maxStep = Math.max(mem.maxStep || 0, current.step);
        renderTrack();
      }
    });
    document.querySelectorAll(".rail-jump").forEach(function (btn) {
      btn.addEventListener("click", function () {
        jumpTo(parseInt(btn.getAttribute("data-step"), 10));
      });
    });
    document.querySelectorAll("[data-concept-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        jumpTo(parseInt(btn.getAttribute("data-concept-step"), 10));
      });
    });
    var wc = $("v2WordCount");
    if (wc) {
      wc.addEventListener("change", function () {
        mem.wordCount = parseInt(wc.value, 10) || 12;
        var regenBtn = $("v2Regen");
        if (regenBtn) regenBtn.textContent = "Regenerate " + mem.wordCount + "-word phrase";
        var ent = $("v2Entropy");
        if (ent && !mem.mnemonic) {
          ent.outerHTML = entropyHtml();
        }
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
      if ($("v2Entropy")) $("v2Entropy").outerHTML = entropyHtml();
      var aw = $("v2AddrWrap");
      if (aw) {
        aw.innerHTML = "";
        aw.classList.add("v2-hidden");
      }
      if (current.id === 2 || current.id === 3) {
        mem.cardAck = false;
        renderTrack();
        return;
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
      var pipe = $("v2Pipe");
      if (pipe) {
        var seedSt = pipe.querySelector('[data-pipe="seed"]');
        var addrSt = pipe.querySelector('[data-pipe="addr"]');
        if (seedSt) seedSt.classList.add("hi");
        if (addrSt) addrSt.classList.add("hi");
      }
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
      if ($("v2Entropy")) $("v2Entropy").outerHTML = entropyHtml();
      regen.textContent = "Regenerate " + n + "-word phrase";
    });
    var clr = $("v2Clear");
    if (clr) clr.addEventListener("click", clearSecrets);
    var pack = $("v2PrintAck");
    var pr = $("v2Print");
    if (pack && pr) {
      pack.addEventListener("change", function () {
        pr.disabled = !pack.checked;
        if (pack.checked) fillPrintSheet(true);
      });
    }
    if (pr) {
      pr.addEventListener("click", function () {
        if (pack && !pack.checked) return;
        fillPrintSheet(false);
        window.print();
        var sheet = $("printBackup");
        if (sheet) {
          sheet.hidden = true;
          sheet.setAttribute("aria-hidden", "true");
        }
      });
    }
    var cmp = $("v2Cmp");
    if (cmp) cmp.addEventListener("click", async function () {
      var a = ($("ppA") && $("ppA").value) || "";
      var b = ($("ppB") && $("ppB").value) || "";
      var labA = a === "" ? "A has no passphrase" : "A = “" + a + "”";
      var labB = b === "" ? "B has no passphrase" : "B = “" + b + "”";
      var ra = await BIP39Lab.deriveAddresses(mem.mnemonic, a, { network: "test", count: 1 });
      var rb = await BIP39Lab.deriveAddresses(mem.mnemonic, b, { network: "test", count: 1 });
      var addrA = ra.rows[0].bip84_p2wpkh;
      var addrB = rb.rows[0].bip84_p2wpkh;
      var same = addrA === addrB;
      var verdict;
      if (same) {
        if (a === "" && b === "") {
          verdict = "Same receive address. Both sides have no passphrase, so this is one vault.";
        } else if (a === b) {
          verdict = "Same receive address. Passphrase A and passphrase B are the same, so this is one vault.";
        } else {
          verdict = "Same receive address with these two passphrases.";
        }
      } else {
        verdict = "Diverged — two wallets. Same words, different passphrases, different addresses.";
      }
      $("v2CmpOut").innerHTML =
        '<div class="v2-callout is"><strong>' + labA + "</strong><code class=\"v2-preview-big\">" + addrA + "</code></div>" +
        '<div class="v2-callout done"><strong>' + labB + "</strong><code class=\"v2-preview-big\">" + addrB + "</code></div>" +
        '<div class="v2-verdict ' + (same ? "same" : "split") + '">' + verdict + "</div>";
      if (pause) pause.disabled = false;
    });
    var idx = $("v2Idx");
    var idxZero = $("v2IdxZero");
    if (idx) {
      idx.setAttribute("data-i", "0");
      async function applyPathIndex(i) {
        i = Math.max(0, Math.min(19, i | 0));
        idx.setAttribute("data-i", String(i));
        var path = BIP39Lab.formatPath(84, "test", 0, 0, i);
        $("v2PathLine").textContent = path;
        idx.textContent =
          i >= 19
            ? "Index 19 is the last in this demo"
            : "Show index " + (i + 1) + " (next receive address)";
        var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: i + 1, change: 0 });
        var row = r.rows[i] || r.rows[r.rows.length - 1];
        var a = (row && row.bip84_p2wpkh) || "";
        $("v2Tail").textContent = "Index " + i + "  ·  " + a + "  ·  last 8: " + a.slice(-8);
        if (pause && i > 0) pause.disabled = false;
      }
      applyPathIndex(0).catch(console.error);
      idx.addEventListener("click", function () {
        var cur = parseInt(idx.getAttribute("data-i") || "0", 10);
        applyPathIndex(cur + 1).catch(console.error);
      });
      if (idxZero) {
        idxZero.addEventListener("click", function () {
          applyPathIndex(0).catch(console.error);
        });
      }
    }
    var wo = $("v2Wo");
    if (wo) wo.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main", account: 0 });
      var desc = BIP39Lab.descriptorsFromWatchOnly(pack, "main");
      var keyBlock = (pack.keys || []).map(function (k) { return k.label + "\n" + k.key; }).join("\n\n");
      var descBlock = ((desc && desc.descriptors) || []).map(function (d) {
        return d.label + "\n" + d.descriptor + (d.note ? "\n(" + d.note + ")" : "");
      }).join("\n\n");
      $("v2WoOut").textContent = keyBlock + (descBlock ? "\n\n--- output descriptors ---\n\n" + descBlock : "");
    });
    var xp = $("v2Xpub");
    if (xp) xp.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main" });
      var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0] || pack.keys[0];
      $("v2XpubOut").textContent = k.label + "\n" + k.key + "\n(no xprv)";
    });
    document.querySelectorAll("[data-cs-gen]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var i = parseInt(btn.getAttribute("data-cs-gen"), 10);
        if (!mem.cosigners) mem.cosigners = emptyCosigners();
        var sel = $("v2CsWc" + i);
        var n = parseInt(sel && sel.value ? sel.value : "12", 10) || 12;
        mem.cosigners[i].wordCount = n;
        mem.cosigners[i].mnemonic = await BIP39Lab.generateMnemonic(n);
        mem.cosigners[i].zpub = "";
        renderTrack();
      });
    });
    document.querySelectorAll("[data-cs-zpub]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var i = parseInt(btn.getAttribute("data-cs-zpub"), 10);
        var c = mem.cosigners && mem.cosigners[i];
        if (!c || !c.mnemonic) return;
        var pack = await BIP39Lab.exportWatchOnly(c.mnemonic, "", { network: "main" });
        var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0];
        c.zpub = (k && k.key) || "";
        renderTrack();
      });
    });
    document.querySelectorAll("[data-cs-clear]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-cs-clear"), 10);
        if (!mem.cosigners) return;
        mem.cosigners[i] = { mnemonic: "", wordCount: 12, zpub: "" };
        renderTrack();
      });
    });
    var csAll = $("v2CsClearAll");
    if (csAll) {
      csAll.addEventListener("click", function () {
        mem.cosigners = emptyCosigners();
        renderTrack();
      });
    }
    [0, 1, 2].forEach(function (i) {
      var sel = $("v2CsWc" + i);
      if (sel) {
        sel.addEventListener("change", function () {
          if (!mem.cosigners) mem.cosigners = emptyCosigners();
          mem.cosigners[i].wordCount = parseInt(sel.value, 10) || 12;
        });
      }
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
      mem.shamirDone = true;
      if (pause) pause.disabled = false;
    });
    var pb = $("v2Psbt");
    if (pb) pb.addEventListener("click", function () {
      var r = BIP39Lab.inspectPsbt(PSBT_MIN);
      $("v2PsbtOut").textContent = JSON.stringify(r, null, 2);
    });
    var uc2q = $("v2Uc2Quiz");
    if (uc2q) {
      uc2q.querySelectorAll("[data-quiz]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var box = $("v2QuizMsg");
          if (btn.getAttribute("data-quiz") === "bad") {
            btn.classList.remove("is-picked");
            box.className = "msg-bad";
            var whyEl = btn.querySelector(".v2-quiz-why");
            box.textContent =
              (whyEl && whyEl.textContent) ||
              btn.getAttribute("data-why") ||
              "Wrong. Select the two right sentences (hand copy, and print is not the most secure).";
            if (pause) pause.disabled = true;
            return;
          }
          btn.classList.toggle("is-picked");
          var nOk = uc2q.querySelectorAll('[data-quiz="ok"].is-picked').length;
          if (nOk === 2) {
            box.className = "msg-ok";
            box.textContent = "Correct. Both right sentences are selected.";
            if (pause) pause.disabled = false;
          } else {
            box.className = "msg-bad";
            box.textContent = "Select both right sentences (2 and 3).";
            if (pause) pause.disabled = true;
          }
        });
      });
    } else {
      document.querySelectorAll("[data-quiz]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var ok = btn.getAttribute("data-quiz") === "ok";
          var box = $("v2QuizMsg");
          var whyEl = btn.querySelector(".v2-quiz-why");
          box.className = ok ? "msg-ok" : "msg-bad";
          box.textContent = whyEl && whyEl.textContent
            ? whyEl.textContent
            : ok
              ? "Correct."
              : "Wrong. That is not what this track teaches.";
          if (ok && pause) pause.disabled = false;
        });
      });
    }
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

  function fillPrintSheet(keepHidden) {
    var m = (mem.mnemonic || "").trim();
    var ol = $("printWordList");
    if (!ol) return;
    ol.innerHTML = "";
    var words = m.split(/\s+/).filter(Boolean);
    var n = words.length || 12;
    for (var i = 0; i < n; i++) {
      var li = document.createElement("li");
      li.textContent = words[i] || "________";
      ol.appendChild(li);
    }
    var sheet = $("printBackup");
    if (sheet && !keepHidden) {
      sheet.hidden = false;
      sheet.setAttribute("aria-hidden", "false");
    }
  }

  function clearSecrets() {
    mem.mnemonic = "";
    mem.lastRows = null;
    mem.cardAck = false;
    mem.cosigners = emptyCosigners();
    mem.shamirDone = false;
    if (current && (current.id === 1 || current.id === 2 || current.id === 6)) {
      if (current.id === 1 || current.id === 2) current.step = 0;
      renderTrack();
    } else {
      renderPicker();
    }
  }

  function boot() {
    if ($("btnBackPicker")) $("btnBackPicker").addEventListener("click", renderPicker);
    var rail = $("trackRail");
    if (rail) {
      rail.addEventListener("click", function (ev) {
        var b = ev.target.closest && ev.target.closest(".rail-jump");
        if (!b) return;
        jumpTo(parseInt(b.getAttribute("data-step"), 10));
      });
    }
    var strip = $("conceptStrip");
    if (strip) {
      strip.addEventListener("click", function (ev) {
        var b = ev.target.closest && ev.target.closest("[data-concept-step]");
        if (!b || b.disabled) return;
        jumpTo(parseInt(b.getAttribute("data-concept-step"), 10));
      });
    }
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
