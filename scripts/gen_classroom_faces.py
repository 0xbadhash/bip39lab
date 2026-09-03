#!/usr/bin/env python3
"""Generate 640 classroom faces and wrap teachBox classrooms that lack a picture."""
from __future__ import annotations

import os
from pathlib import Path


def _repo_root() -> Path:
    env = os.environ.get("BIP39LAB_ROOT", "").strip()
    if env:
        return Path(env).expanduser().resolve()
    return Path(__file__).resolve().parents[1]


ROOT = _repo_root()
ASSETS = ROOT / "web/v2/assets"
APP = ROOT / "web/v2/js/v2-app.js"

# teachBox id -> (svg stem, caption, title line, sub line)
FACES = {
    "v2Uc16Teach": ("uc16-face-paper", "Paper is the backup", "paper card", "not the mailbox"),
    "v2Uc16ChkTeach": ("uc16-face-same-addr", "Same mailbox", "type from paper", "same tb1"),
    "v2TierTeach": ("uc17-face-tiers", "Three amounts", "daily · mid · large", "not all on one object"),
    "v2InhTeach": ("uc18-face-cannot-speak", "While you can talk", "missing piece", "heir cannot guess"),
    "v2InhPackTeach": ("uc18-face-packet", "Map, not the words", "packet", "keys live elsewhere"),
    "v2InhLiveTeach": ("uc18-face-watch-fail", "Watch them fail", "incomplete kit", "you can still fix it"),
    "v2Uc19Teach": ("uc19-face-full-addr", "Same full address", "start · middle · end", "scammers change the middle"),
    "v2Uc19WaitTeach": ("uc19-face-wait", "Wait for a confirm", "0 conf can vanish", "~10 min per block"),
    "v2Uc19DustTeach": ("uc19-face-dust", "Leave surprise dust", "tiny leftover", "do not spend it"),
    "v2Uc21Teach": ("uc21-face-you-two", "You hold two", "A + B spend", "C only co-signs"),
    "v2Uc21ThreatTeach": ("uc21-face-freeze", "Freeze is not steal", "refuse help", "not taking coins"),
    "v2Uc21JobTeach": ("uc21-face-jobs", "Three jobs", "friends · shares · login", "this is co-sign"),
    "v2Uc25Teach": ("uc25-face-silent", "New mailbox each send", "one code", "new output"),
    "v2Uc25SendTeach": ("uc25-face-two-sends", "Two sends differ", "same code", "two outputs"),
    "v2Uc25KeyTeach": ("uc25-face-two-keys", "Scan vs spend", "find", "move"),
    "v2Uc26Teach": ("uc26-face-not-node", "Not your node", "public explorer", "unknown ≠ 0"),
    "v2Uc27Teach": ("uc27-face-pieces", "Pieces not a bank", "leftovers", "not one number"),
    "v2UtxoGridTeach": ("uc27-face-pick", "Pick one piece", "0.05", "leave 0.13"),
    "v2UtxoChangeTeach": ("uc27-face-change", "Change folder", "spend", "leftover returns"),
    "v2Uc28Teach": ("uc28-face-utxo", "A leftover piece", "UTXO", "not a balance"),
    "v2Uc28CombTeach": ("uc28-face-link", "Two inputs, one guess", "cafe + salary", "same owner?"),
    "v2Uc28JoinTeach": ("uc28-face-join", "Muddy, not gone", "equal outputs", "still public"),
    "v2Uc29Teach": ("uc29-face-two-vaults", "Two extras", "empty", "open"),
    "v2Uc29PinTeach": ("uc29-face-box-chain", "Box ≠ chain", "wipe chip", "coins stay"),
    "v2Uc29WipeTeach": ("uc29-face-wipe", "Restore after wipe", "blank device", "need paper + extra"),
    "v2Uc30Teach": ("uc30-face-parent", "Parent still required", "master", "child dies with it"),
    "v2Bip85MintTeach": ("uc30-face-child", "Child #0", "derived list", "not a backup"),
    "v2Uc31Teach": ("uc31-face-words-hex", "Words vs hex", "paper lists", "not classroom hex"),
    "v2XorTeach": ("uc32-face-n-of-n", "Need every part", "N-of-N", "not any 2 of 3"),
    "v2XorSplitTeach": ("uc32-face-card", "This 12-word card", "source", "then two parts"),
    "v2XorRecTeach": ("uc32-face-all-parts", "All parts", "missing one fails", "full lists"),
    "v2DescTeach": ("uc34-face-recipe", "The recipe line", "descriptor", "words not enough"),
    "v2DescRefreshTeach": ("uc34-face-public", "Public only", "view recipe", "never xprv"),
    "v2DescExplainTeach": ("uc34-face-explain", "Explain, don't spend", "paste public", "refuse seed"),
    "v2Bip39What": ("uc1-face-card-mailbox", "Card vs mailbox", "words stay secret", "tb1 is public"),
    "v2CardWhat": ("uc1-face-numbered", "Numbered cells", "1 word", "checksum last"),
    "v2CmpTeach": ("uc3-face-extra", "Extra secret", "same words", "two vaults"),
    "v2PathTeach": ("uc4-face-folder", "A path is a folder", "same card", "new address"),
    "v2PathChTeach": ("uc4-face-recv-change", "Receive vs change", "arrive", "leftover"),
    "v2LeakTeach": ("uc9-face-camera", "Camera, not spender", "can list", "cannot spend"),
    "v2LeakKitTeach": ("uc9-face-mistakes", "Four mistakes", "forum · ticket", "not the words"),
    "v2LeakGapTeach": ("uc9-face-five", "Next five mailboxes", "slots 0–4", "still cannot spend"),
    "v2FeeTeach": ("uc10-face-fees", "Fees from leftovers", "sat/vB", "not a fee account"),
    "v2BalTeach": ("uc10-face-unknown", "Unknown is not zero", "empty = 0", "fail = unknown"),
    "v2PsbtTeach": ("uc8-face-psbt", "Unfinished payment", "pass around", "never sign here"),
}


def svg(title: str, sub: str) -> str:
    t = xml(title)
    s = xml(sub)
    return f"""<svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{t}">
  <title>{t}</title>
  <rect width="640" height="640" rx="48" fill="#1a2330"/>
  <rect x="88" y="88" width="464" height="320" rx="28" fill="#121820" stroke="#3d8bfd" stroke-width="8"/>
  <circle cx="200" cy="248" r="54" fill="none" stroke="#3ecf8e" stroke-width="10"/>
  <rect x="300" y="194" width="200" height="108" rx="18" fill="#102028" stroke="#e8a23c" stroke-width="7"/>
  <text x="320" y="460" text-anchor="middle" fill="#e8eef7" font-size="28" font-family="system-ui,sans-serif">{t}</text>
  <text x="320" y="510" text-anchor="middle" fill="#8b9bb4" font-size="22" font-family="system-ui,sans-serif">{s}</text>
  <text x="320" y="580" text-anchor="middle" fill="#8b9bb4" font-size="18" font-family="system-ui,sans-serif">classroom</text>
</svg>
"""


def xml(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def wrap_js(text: str) -> str:
    for tid, (stem, cap, _a, _b) in FACES.items():
        src = f"assets/{stem}.svg"
        needle = f'"{tid}"'
        if needle not in text:
            print("missing id", tid)
            continue
        # Only wrap the teachBox that ends with this id (not already wrapped)
        tb_call = "teachBox("
        idx = 0
        found = False
        while True:
            i = text.find(tb_call, idx)
            if i < 0:
                break
            j = text.find(needle, i)
            if j < 0:
                break
            # ensure this teachBox's third arg is this id: next teachBox shouldn't start before j
            nxt = text.find(tb_call, i + 1)
            if nxt != -1 and nxt < j:
                idx = i + 1
                continue
            before = text[max(0, i - 80) : i]
            if "faceWrapHtml" in before or "faceClusterHtml" in before:
                found = True
                break
            # insert wrap open
            open_s = f'faceWrapHtml("{src}", "{cap}", '
            text = text[:i] + open_s + text[i:]
            j += len(open_s)
            # close after the teachBox call: find matching paren from i
            start = text.find("teachBox(", i)
            depth = 0
            k = start
            while k < len(text):
                ch = text[k]
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    depth -= 1
                    if depth == 0:
                        text = text[: k + 1] + ")" + text[k + 1 :]
                        found = True
                        break
                k += 1
            break
        if not found:
            print("did not wrap", tid)
    return text


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    for _tid, (stem, cap, a, b) in FACES.items():
        p = ASSETS / f"{stem}.svg"
        p.write_text(svg(a, b), encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    APP.write_text(wrap_js(app), encoding="utf-8")
    print("faces", len(FACES))


if __name__ == "__main__":
    main()
