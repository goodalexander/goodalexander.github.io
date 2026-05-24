#!/usr/bin/env python3
"""Mobile-first PMX figures — vertical stacks, readable at phone width."""

from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "research/pain_machines/manifesto_figures_mobile.json"

MONO = "ui-monospace,monospace"
BG = "#040506"
PANEL = "#0a0b0d"
INK = "#ebe4dc"
MUTED = "#8a9199"
DIM = "#555c64"
GOLD = "#b89a6a"
PAIN = "#b85c55"
PLEASURE = "#7a9a8c"
LINE = "rgba(235,228,220,.10)"
W = 380


def block(fid: str, title: str, svg: str) -> str:
    return f"""<figure class="pm-fig pm-fig-manifesto" id="{fid.lower()}">
  <div class="pm-fig-head">
    <span class="pm-fig-n">{fid}</span>
    <h4>{title}</h4>
  </div>
{svg}
</figure>"""


def card(y: int, label: str, value: str, col: str = INK) -> str:
    return (
        f'<text x="16" y="{y}" fill="{DIM}" font-family="{MONO}" font-size="10">{label}</text>'
        f'<text x="16" y="{y + 16}" fill="{col}" font-family="{MONO}" font-size="11">{value}</text>'
    )


def pmx_00() -> str:
    svg = f"""  <svg viewBox="0 0 {W} 520" role="img" aria-label="Warranty card">
    <rect width="{W}" height="520" fill="{BG}"/>
    <rect x="12" y="12" width="{W-24}" height="100" rx="3" fill="{PANEL}" stroke="{LINE}"/>
    <text x="24" y="36" fill="{MUTED}" font-family="{MONO}" font-size="10">neonatal bay · first cry</text>
    <path d="M24 72 H356" stroke="{PAIN}" stroke-width="1.2"/>
    {card(96, "PRODUCT", "Homo sapiens", INK)}
    {card(140, "DEFECTS", "pain · fear · grief · decay · death", PAIN)}
    {card(184, "TERMS", "repair yes · exit no", MUTED)}
    <g transform="translate(24 230)">
      <rect width="332" height="64" rx="3" fill="{PANEL}" stroke="{GOLD}"/>
      <text x="166" y="28" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">VOID THE WARRANTY</text>
      <text x="166" y="48" fill="{DIM}" font-family="{MONO}" font-size="9" text-anchor="middle">serial ADAM-000001</text>
    </g>
  </svg>"""
    return block("PMX-00", "The Warranty Card in the Crib", svg)


def pmx_01() -> str:
    lines = [
        ("pleasure", "reward · satiety · calm", PLEASURE, "bars plateau"),
        ("pain", "nociception · neuropathy · grief", PAIN, "branches multiply"),
        ("pain", "panic · shame · chronicity", PAIN, "files stay open"),
    ]
    body = ""
    y = 40
    for kind, items, col, note in lines:
        body += f'<text x="16" y="{y}" fill="{col}" font-family="{MONO}" font-size="11">{kind.upper()}</text>'
        body += f'<text x="16" y="{y+16}" fill="{MUTED}" font-family="{MONO}" font-size="10">{items}</text>'
        body += f'<text x="16" y="{y+32}" fill="{DIM}" font-family="{MONO}" font-size="9">{note}</text>'
        y += 56
    svg = f"""  <svg viewBox="0 0 {W} 220" role="img" aria-label="Pain ledger">
    <rect width="{W}" height="220" fill="{BG}"/>
    <text x="16" y="24" fill="{GOLD}" font-family="{MONO}" font-size="11">suffering enumerates faster</text>
    {body}
  </svg>"""
    return block("PMX-01", "The Pain Ledger", svg)


def pmx_02() -> str:
    layers = [
        "tissue", "nociceptor", "spinal gate", "thalamus",
        "insula · ACC", "memory · prediction", "identity · social",
    ]
    body = ""
    y = 36
    for L in layers:
        body += f'<rect x="16" y="{y}" width="348" height="28" rx="2" fill="{PANEL}" stroke="{LINE}"/>'
        body += f'<text x="28" y="{y+18}" fill="{INK}" font-family="{MONO}" font-size="10">{L}</text>'
        body += f'<circle cx="350" cy="{y+14}" r="4" fill="{PAIN}"/>'
        y += 34
    svg = f"""  <svg viewBox="0 0 {W} {y+12}" role="img" aria-label="Alarm stack">
    <rect width="{W}" height="{y+12}" fill="{BG}"/>
    <text x="16" y="22" fill="{DIM}" font-family="{MONO}" font-size="10">alarm stack · tissue → identity</text>
    {body}
  </svg>"""
    return block("PMX-02", "The Alarm Stack", svg)


def pmx_03() -> str:
    events = ["dust", "breath", "tree", "eye opens", "birth pain", "toil", "grave"]
    body = ""
    y = 40
    for i, e in enumerate(events):
        body += f'<circle cx="24" cy="{y+8}" r="6" fill="{PANEL}" stroke="{GOLD if i<3 else PAIN}"/>'
        body += f'<text x="40" y="{y+12}" fill="{INK}" font-family="{MONO}" font-size="10">{e}</text>'
        body += f'<text x="200" y="{y+12}" fill="{PAIN if i>2 else DIM}" font-family="{MONO}" font-size="9">defect not curse</text>'
        y += 28
    svg = f"""  <svg viewBox="0 0 {W} {y+20}" role="img" aria-label="Genesis QA">
    <rect width="{W}" height="{y+20}" fill="{BG}"/>
    <text x="16" y="22" fill="{DIM}" font-family="{MONO}" font-size="10">genesis 2–3 · QA timeline</text>
    {body}
    <text x="16" y="{y+8}" fill="{GOLD}" font-family="{MONO}" font-size="10">root cause: design architecture ✓</text>
  </svg>"""
    return block("PMX-03", "Genesis as QA Report", svg)


def pmx_04() -> str:
    svg = f"""  <svg viewBox="0 0 {W} 280" role="img" aria-label="Original sin inversion">
    <rect width="{W}" height="280" fill="{BG}"/>
    <text x="16" y="22" fill="{DIM}" font-family="{MONO}" font-size="10">warranty theology</text>
    <text x="16" y="44" fill="{MUTED}" font-family="{MONO}" font-size="10">disobedience → fall → redemption</text>
    <text x="16" y="100" fill="{DIM}" font-family="{MONO}" font-size="10">defect report</text>
    <text x="16" y="122" fill="{PAIN}" font-family="{MONO}" font-size="10">architecture → consciousness → blame narrative</text>
    <text x="16" y="160" fill="{GOLD}" font-family="{MONO}" font-size="11">fault moves upstream ↑</text>
  </svg>"""
    return block("PMX-04", "Original Sin Inversion", svg)


def pmx_05() -> str:
    rungs = [
        "pain medicine", "prosthetics", "gene repair", "neural interface",
        "affect editing", "synthetic body", "substrate migration", "non-biological person",
    ]
    body = ""
    y = 40
    for i, r in enumerate(rungs):
        col = GOLD if i >= 4 else MUTED
        body += f'<text x="24" y="{y}" fill="{col}" font-family="{MONO}" font-size="10">{'▸' if i>=4 else '·'} {r}</text>'
        y += 22
    svg = f"""  <svg viewBox="0 0 {W} {y+40}" role="img" aria-label="Mandate ladder">
    <rect width="{W}" height="{y+40}" fill="{BG}"/>
    <text x="16" y="22" fill="{DIM}" font-family="{MONO}" font-size="10">therapy → exit ladder</text>
    <line x1="16" y1="108" x2="364" y2="108" stroke="{GOLD}" stroke-dasharray="4 3"/>
    <text x="16" y="100" fill="{GOLD}" font-family="{MONO}" font-size="9">outside original format</text>
    {body}
  </svg>"""
    return block("PMX-05", "Mandate Ladder", svg)


def pmx_06() -> str:
    svg = f"""  <svg viewBox="0 0 {W} 240" role="img" aria-label="Christian warranty">
    <rect width="{W}" height="240" fill="{BG}"/>
    <text x="16" y="24" fill="{INK}" font-family="{MONO}" font-size="11">human body · fallen · redeemable</text>
    <text x="16" y="52" fill="{PLEASURE}" font-family="{MONO}" font-size="10">repair: medicine · prosthetic · charity</text>
    <text x="16" y="76" fill="{PAIN}" font-family="{MONO}" font-size="10">exit forbidden: abandon flesh · rival eschatology</text>
    <text x="16" y="120" fill="{DIM}" font-family="{MONO}" font-size="9">imago Dei · incarnation · resurrection · natural law</text>
    <text x="16" y="160" fill="{GOLD}" font-family="{MONO}" font-size="11">REDEEM · DO NOT RECALL</text>
  </svg>"""
    return block("PMX-06", "Christian Warranty Map", svg)


def pmx_07() -> str:
    svg = f"""  <svg viewBox="0 0 {W} 240" role="img" aria-label="Islamic warranty">
    <rect width="{W}" height="240" fill="{BG}"/>
    <text x="190" y="36" fill="{GOLD}" font-family="{MONO}" font-size="12" text-anchor="middle">AMANAH</text>
    <text x="190" y="54" fill="{MUTED}" font-family="{MONO}" font-size="9" text-anchor="middle">body as trust</text>
    <text x="16" y="88" fill="{PLEASURE}" font-family="{MONO}" font-size="10">repair under divine title</text>
    <text x="16" y="112" fill="{PAIN}" font-family="{MONO}" font-size="10">alter creation · self-ownership · contempt for clay</text>
    <text x="16" y="148" fill="{DIM}" font-family="{MONO}" font-size="9">fitra · khilafa · nafs · Q 4:119 · Iblis</text>
    <text x="16" y="180" fill="{GOLD}" font-family="{MONO}" font-size="10">stewardship ≠ manufacture</text>
  </svg>"""
    return block("PMX-07", "Islamic Warranty Map", svg)


def pmx_08() -> str:
    svg = f"""  <svg viewBox="0 0 {W} 200" role="img" aria-label="Secular trap">
    <rect width="{W}" height="200" fill="{BG}"/>
    <text x="16" y="24" fill="{INK}" font-family="{MONO}" font-size="10">dignity · equality · natural kind</text>
    <circle cx="190" cy="90" r="36" fill="{PANEL}" stroke="{GOLD}"/>
    <text x="190" y="94" fill="{GOLD}" font-family="{MONO}" font-size="10" text-anchor="middle">FACTOR X</text>
    <text x="16" y="150" fill="{PAIN}" font-family="{MONO}" font-size="10">posthuman exit breaks the triangle</text>
    <text x="16" y="170" fill="{DIM}" font-family="{MONO}" font-size="9">Übermensch panic · designed persons</text>
  </svg>"""
    return block("PMX-08", "Secular Humanist Trap", svg)


def pmx_09() -> str:
    rows = [
        ("sacred object", "imago Dei / fitra / dignity"),
        ("repair", "medicine / surgery / therapy"),
        ("exit", "forbidden in all three"),
        ("phrase", "redeem / trust / species"),
    ]
    body = ""
    y = 40
    for k, v in rows:
        body += f'<text x="16" y="{y}" fill="{DIM}" font-family="{MONO}" font-size="9">{k}</text>'
        body += f'<text x="16" y="{y+14}" fill="{MUTED}" font-family="{MONO}" font-size="10">{v}</text>'
        y += 36
    svg = f"""  <svg viewBox="0 0 {W} {y+24}" role="img" aria-label="Three regimes">
    <rect width="{W}" height="{y+24}" fill="{BG}"/>
    <text x="16" y="22" fill="{GOLD}" font-family="{MONO}" font-size="10">Christianity · Islam · secular humanism</text>
    {body}
    <text x="16" y="{y+4}" fill="{GOLD}" font-family="{MONO}" font-size="10">convergence: repair yes · exit no</text>
  </svg>"""
    return block("PMX-09", "Three Warranty Regimes", svg)


def pmx_10() -> str:
    stations = [
        "proof", "genesis QA", "mandate", "AI design",
        "exit labs", "morph freedom", "post-human ?",
    ]
    body = ""
    y = 48
    for s in stations:
        body += f'<circle cx="20" cy="{y}" r="5" fill="{GOLD}"/>'
        body += f'<text x="36" y="{y+4}" fill="{MUTED}" font-family="{MONO}" font-size="10">{s}</text>'
        y += 28
    svg = f"""  <svg viewBox="0 0 {W} {y+16}" role="img" aria-label="Abolition roadmap">
    <rect width="{W}" height="{y+16}" fill="{BG}"/>
    <text x="16" y="22" fill="{DIM}" font-family="{MONO}" font-size="10">abolition roadmap · hazards branch off</text>
    {body}
  </svg>"""
    return block("PMX-10", "Abolition Roadmap", svg)


def pmx_11() -> str:
    metrics = [
        ("pain-hours", "4.2B", PAIN),
        ("chronic pain", "20%", PAIN),
        ("mental distress", "970M", PAIN),
        ("exit access", "0.01%", GOLD),
    ]
    body = ""
    y = 40
    for label, val, col in metrics:
        body += f'<text x="16" y="{y}" fill="{DIM}" font-family="{MONO}" font-size="9">{label}</text>'
        body += f'<text x="200" y="{y}" fill="{col}" font-family="{MONO}" font-size="14" text-anchor="end">{val}</text>'
        y += 32
    svg = f"""  <svg viewBox="0 0 {W} {y+40}" role="img" aria-label="Suffering audit">
    <rect width="{W}" height="{y+40}" fill="{BG}"/>
    <text x="16" y="22" fill="{DIM}" font-family="{MONO}" font-size="10">suffering audit · target → zero</text>
    {body}
    <text x="16" y="{y+8}" fill="{PLEASURE}" font-family="{MONO}" font-size="9">levers: analgesia · psychiatry · exit law · AI safety</text>
  </svg>"""
    return block("PMX-11", "Suffering Audit Dashboard", svg)


def main() -> int:
    figs = {
        f"PMX-{i:02d}": fn()
        for i, fn in enumerate([
            pmx_00, pmx_01, pmx_02, pmx_03, pmx_04, pmx_05, pmx_06,
            pmx_07, pmx_08, pmx_09, pmx_10, pmx_11,
        ])
    }
    OUT.write_text(json.dumps(figs, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(figs)} mobile figures → {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
