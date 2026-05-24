#!/usr/bin/env python3
"""Generate PMX infographic SVG blocks for Void the Warranty manifesto."""

from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "research/pain_machines/manifesto_figures.json"

MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
BG = "#040506"
PANEL = "#0a0b0d"
INK = "#ebe4dc"
MUTED = "#8a9199"
DIM = "#555c64"
GOLD = "#b89a6a"
PAIN = "#b85c55"
PLEASURE = "#7a9a8c"
LINE = "rgba(235,228,220,.10)"


def fig_block(fid: str, title: str, svg: str, cite: str = "") -> str:
    cite_html = f'\n    <a class="pm-cite" href="{cite}">{cite.split("/")[-1] or cite}</a>' if cite else ""
    return f"""<figure class="pm-fig" id="{fid.lower()}">
  <div class="pm-fig-head">
    <span class="pm-fig-n">{fid}</span>
    <h4>{title}</h4>{cite_html}
  </div>
{svg}
</figure>"""


def pmx_00() -> str:
    svg = f"""  <svg viewBox="0 0 1200 650" role="img" aria-label="Warranty card in crib metaphor">
    <rect width="1200" height="650" fill="{BG}"/>
    <rect x="40" y="40" width="340" height="570" rx="4" fill="{PANEL}" stroke="{LINE}"/>
    <text x="210" y="80" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">neonatal bay · monitor trace</text>
    <rect x="80" y="110" width="260" height="180" rx="3" fill="#060708" stroke="{LINE}"/>
    <ellipse cx="210" cy="200" rx="70" ry="28" fill="none" stroke="{MUTED}" stroke-width="1"/>
    <rect x="170" y="175" width="80" height="50" rx="8" fill="#0f1012" stroke="{MUTED}" stroke-width=".8"/>
    <path d="M90 320 L330 320" stroke="{PAIN}" stroke-width="1.2" fill="none"/>
    <path d="M90 340 L330 340" stroke="{PAIN}" stroke-width=".6" opacity=".5" fill="none"/>
    <text x="90" y="310" fill="{PAIN}" font-family="{MONO}" font-size="9">HR trace · first signal</text>
    <text x="60" y="400" fill="{MUTED}" font-family="{MONO}" font-size="10">wrapped silhouette</text>
    <text x="60" y="420" fill="{DIM}" font-family="{MONO}" font-size="9">no consent · no opt-out</text>
    <rect x="420" y="60" width="740" height="530" rx="4" fill="{PANEL}" stroke="{GOLD}" stroke-width="1.2"/>
    <text x="450" y="100" fill="{GOLD}" font-family="{MONO}" font-size="14" letter-spacing="3">PRODUCT WARRANTY</text>
    <g font-family="{MONO}" font-size="12">
      <text x="450" y="150" fill="{DIM}">PRODUCT</text><text x="620" y="150" fill="{INK}">Homo sapiens</text>
      <text x="450" y="185" fill="{DIM}">SHIP DATE</text><text x="620" y="185" fill="{INK}">birth</text>
      <text x="450" y="220" fill="{DIM}">SERIAL</text><text x="620" y="220" fill="{INK}">ADAM-000001</text>
      <text x="450" y="270" fill="{DIM}">KNOWN DEFECTS</text>
      <text x="620" y="270" fill="{PAIN}">pain · fear · grief · decay · death</text>
      <text x="450" y="330" fill="{DIM}">WARRANTY TERMS</text>
      <text x="620" y="330" fill="{MUTED}">repair permitted · exit prohibited</text>
    </g>
    <rect x="450" y="380" width="200" height="40" fill="none" stroke="{DIM}" stroke-width=".8"/>
    <text x="460" y="405" fill="{DIM}" font-family="{MONO}" font-size="10">||||||||||||||||</text>
    <g transform="translate(680 420) rotate(-18)">
      <rect x="0" y="0" width="380" height="90" rx="2" fill="none" stroke="{GOLD}" stroke-width="3" opacity=".85"/>
      <text x="190" y="55" fill="{GOLD}" font-family="{MONO}" font-size="28" font-weight="600" text-anchor="middle" letter-spacing="4">VOID THE WARRANTY</text>
    </g>
  </svg>"""
    return fig_block("PMX-00", "The Warranty Card in the Crib", svg)


def pmx_01() -> str:
    pleasures = [("reward", 120), ("satiety", 95), ("comfort", 80), ("orgasm", 110), ("relief", 70), ("calm", 55)]
    pains = [
        ("nociception", 140), ("inflammation", 120), ("neuropathy", 130), ("allodynia", 100),
        ("panic", 110), ("nausea", 90), ("itch", 85), ("shame", 95), ("grief", 125),
        ("dyspnea", 115), ("chronicity", 150), ("trauma memory", 160),
    ]
    rows_p = ""
    y = 100
    for label, w in pleasures:
        rows_p += f'<text x="60" y="{y}" fill="{PLEASURE}" font-family="{MONO}" font-size="10">{label}</text>'
        rows_p += f'<rect x="200" y="{y-10}" width="{w}" height="8" fill="{PLEASURE}" opacity=".7"/>'
        y += 28
    rows_n = ""
    y = 100
    for label, w in pains:
        rows_n += f'<text x="640" y="{y}" fill="{PAIN}" font-family="{MONO}" font-size="10">{label}</text>'
        rows_n += f'<rect x="820" y="{y-10}" width="{min(w,200)}" height="8" fill="{PAIN}" opacity=".75"/>'
        if w > 100:
            rows_n += f'<line x1="{820+min(w,200)}" y1="{y-6}" x2="{880}" y2="{y+14}" stroke="{PAIN}" stroke-width=".8" opacity=".5"/>'
        y += 28
    svg = f"""  <svg viewBox="0 0 1200 760" role="img" aria-label="Pain ledger: suffering enumerates faster than pleasure">
    <rect width="1200" height="760" fill="{BG}"/>
    <text x="600" y="45" fill="{GOLD}" font-family="{MONO}" font-size="13" text-anchor="middle">suffering enumerates faster than pleasure</text>
    <line x1="600" y1="60" x2="600" y2="680" stroke="{LINE}" stroke-width="1"/>
    <text x="300" y="80" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">PLEASURE LEDGER</text>
    <text x="900" y="80" fill="{PAIN}" font-family="{MONO}" font-size="11" text-anchor="middle">PAIN LEDGER</text>
    {rows_p}
    {rows_n}
    <text x="600" y="730" fill="{DIM}" font-family="{MONO}" font-size="9" text-anchor="middle">conceptual taxonomy from pain_machines proof · not a population estimate</text>
  </svg>"""
    return fig_block("PMX-01", "The Pain Ledger", svg, "https://goodalexander.com/posts/pain_machines/")


def pmx_02() -> str:
    layers = [
        ("tissue damage", 680), ("nociceptor", 600), ("spinal gate", 520),
        ("thalamus", 440), ("insula · ACC", 360), ("memory · prediction", 280),
        ("identity · social consequence", 200),
    ]
    body = ""
    for i, (label, y) in enumerate(layers):
        body += f'<rect x="120" y="{y}" width="960" height="56" rx="3" fill="{PANEL}" stroke="{LINE}"/>'
        body += f'<text x="150" y="{y+34}" fill="{INK}" font-family="{MONO}" font-size="11">{label}</text>'
        body += f'<circle cx="1080" cy="{y+28}" r="6" fill="{PAIN}" opacity=".8"/>'
        if i > 0:
            body += f'<path d="M1080 {y+56} L1080 {y+72} L200 {y+72} L200 {y-8}" fill="none" stroke="{PAIN}" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/>'
    svg = f"""  <svg viewBox="0 0 1200 820" role="img" aria-label="Alarm stack: pain governance architecture">
    <rect width="1200" height="820" fill="{BG}"/>
    <text x="600" y="40" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">alarm stack · from tissue to identity</text>
    {body}
    <rect x="40" y="200" width="60" height="480" rx="3" fill="#060708" stroke="{PLEASURE}" stroke-width=".8"/>
    <text x="70" y="440" fill="{PLEASURE}" font-family="{MONO}" font-size="9" text-anchor="middle" transform="rotate(-90 70 440)">reward · satiation · adaptation · fading</text>
    <g font-family="{MONO}" font-size="9" fill="{DIM}">
      <text x="950" y="760">acute · chronic · central sensitization · phantom · allodynia</text>
    </g>
  </svg>"""
    return fig_block("PMX-02", "The Alarm Stack", svg)


def pmx_03() -> str:
    events = [
        ("dust", 80), ("breath", 200), ("command", 320), ("tree", 440),
        ("eye", 560), ("birth pain", 680), ("toil", 800), ("grave", 920),
    ]
    trad = ["creation", "command", "disobedience", "curse", "curse", "curse", "curse", "death"]
    defect = ["embodied vulnerability", "arbitrary constraint", "cognition unlock", "reproductive trauma",
              "metabolic coercion", "mortality", "mortality", "mortality"]
    icons = ""
    for i, (ev, x) in enumerate(events):
        icons += f'<circle cx="{x}" cy="300" r="18" fill="{PANEL}" stroke="{GOLD if i<4 else PAIN}" stroke-width="1"/>'
        icons += f'<text x="{x}" y="305" fill="{INK}" font-family="{MONO}" font-size="8" text-anchor="middle">{ev}</text>'
        icons += f'<text x="{x}" y="250" fill="{DIM}" font-family="{MONO}" font-size="8" text-anchor="middle">{trad[i]}</text>'
        icons += f'<text x="{x}" y="360" fill="{PAIN if i>2 else GOLD}" font-family="{MONO}" font-size="8" text-anchor="middle">{defect[i][:14]}</text>'
        if i < len(events) - 1:
            icons += f'<line x1="{x+20}" y1="300" x2="{events[i+1][1]-20}" y2="300" stroke="{LINE}" stroke-width="1"/>'
    svg = f"""  <svg viewBox="0 0 1200 720" role="img" aria-label="Genesis reclassified as QA report">
    <rect width="1200" height="720" fill="{BG}"/>
    <text x="600" y="40" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">genesis 2–3 · timeline reclassified</text>
    <line x1="60" y1="280" x2="1140" y2="280" stroke="{LINE}"/>
    {icons}
    <rect x="920" y="420" width="240" height="260" rx="4" fill="{PANEL}" stroke="{GOLD}"/>
    <text x="940" y="455" fill="{GOLD}" font-family="{MONO}" font-size="12">ROOT CAUSE</text>
    <rect x="940" y="475" width="14" height="14" fill="{PAIN}"/><text x="965" y="487" fill="{INK}" font-family="{MONO}" font-size="10">design architecture</text>
    <rect x="940" y="510" width="14" height="14" fill="none" stroke="{DIM}"/><text x="965" y="522" fill="{DIM}" font-family="{MONO}" font-size="10">user error</text>
  </svg>"""
    return fig_block("PMX-03", "Genesis Reclassified as QA Report", svg)


def pmx_04() -> str:
    svg = f"""  <svg viewBox="0 0 1200 700" role="img" aria-label="Original sin inversion flowcharts">
    <rect width="1200" height="700" fill="{BG}"/>
    <text x="600" y="35" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">theological inversion · warranty vs defect report</text>
    <text x="600" y="70" fill="{DIM}" font-family="{MONO}" font-size="12" text-anchor="middle">STANDARD WARRANTY THEOLOGY</text>
    <g font-family="{MONO}" font-size="10">
      <rect x="80" y="90" width="140" height="40" rx="3" fill="{PANEL}" stroke="{DIM}"/><text x="150" y="115" fill="{MUTED}" text-anchor="middle">disobedience</text>
      <text x="240" y="115" fill="{DIM}">→</text>
      <rect x="260" y="90" width="100" height="40" rx="3" fill="{PANEL}" stroke="{DIM}"/><text x="310" y="115" fill="{MUTED}" text-anchor="middle">Fall</text>
      <text x="380" y="115" fill="{DIM}">→</text>
      <rect x="400" y="90" width="180" height="40" rx="3" fill="{PANEL}" stroke="{DIM}"/><text x="490" y="115" fill="{MUTED}" text-anchor="middle">suffering · death</text>
      <text x="600" y="115" fill="{DIM}">→</text>
      <rect x="620" y="85" width="120" height="50" rx="3" fill="#120909" stroke="{GOLD}"/><text x="680" y="118" fill="{GOLD}" text-anchor="middle">redemption ✝</text>
    </g>
    <rect x="520" y="320" width="160" height="60" rx="3" fill="{PANEL}" stroke="{GOLD}" transform="rotate(8 600 350)"/>
    <text x="600" y="355" fill="{GOLD}" font-family="{MONO}" font-size="10" text-anchor="middle">genesis 3 · reclassified</text>
    <text x="600" y="420" fill="{DIM}" font-family="{MONO}" font-size="12" text-anchor="middle">DEFECT-REPORT THEOLOGY</text>
    <g font-family="{MONO}" font-size="10">
      <rect x="60" y="450" width="200" height="40" rx="3" fill="{PANEL}" stroke="{PAIN}"/><text x="160" y="475" fill="{PAIN}" text-anchor="middle">pain-machine architecture</text>
      <text x="280" y="475" fill="{PAIN}">→</text>
      <rect x="300" y="450" width="200" height="40" rx="3" fill="{PANEL}" stroke="{PAIN}"/><text x="400" y="475" fill="{PAIN}" text-anchor="middle">consciousness of harm</text>
      <text x="520" y="475" fill="{PAIN}">→</text>
      <rect x="540" y="450" width="160" height="40" rx="3" fill="{PANEL}" stroke="{PAIN}"/><text x="620" y="475" fill="{PAIN}" text-anchor="middle">blame narrative</text>
      <text x="720" y="475" fill="{PAIN}">→</text>
      <rect x="740" y="450" width="180" height="40" rx="3" fill="{PANEL}" stroke="{PAIN}"/><text x="830" y="475" fill="{PAIN}" text-anchor="middle">warranty enforcement</text>
    </g>
    <text x="600" y="560" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">fault moves upstream ↑</text>
  </svg>"""
    return fig_block("PMX-04", "Original Sin Inversion", svg)


def pmx_05() -> str:
    rungs = [
        "pain medicine", "psychiatric stabilization", "prosthetics", "gene repair",
        "neural interface", "affect editing", "organ · immune redesign", "synthetic body",
        "AI-designed nervous system", "substrate migration", "non-biological personhood",
    ]
    body = ""
    y = 80
    for i, r in enumerate(rungs):
        intensity = min(255, 120 + i * 12)
        col = f"rgba(184,154,106,{0.3 + i * 0.06})"
        body += f'<rect x="420" y="{y}" width="360" height="36" rx="2" fill="{PANEL}" stroke="{col}"/>'
        body += f'<text x="600" y="{y+23}" fill="{INK}" font-family="{MONO}" font-size="10" text-anchor="middle">{r}</text>'
        y += 44
    svg = f"""  <svg viewBox="0 0 1100 900" role="img" aria-label="Mandate ladder from therapy to exit">
    <rect width="1100" height="900" fill="{BG}"/>
    <text x="550" y="35" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">mandate ladder · repair to exit</text>
    {body}
    <line x1="80" y1="320" x2="1020" y2="320" stroke="{GOLD}" stroke-width="2" stroke-dasharray="8 4"/>
    <text x="550" y="310" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>
    <rect x="40" y="360" width="200" height="480" fill="{PAIN}" opacity=".08"/>
    <text x="140" y="400" fill="{PAIN}" font-family="{MONO}" font-size="9" text-anchor="middle">Christian natural law</text>
    <text x="140" y="420" fill="{PAIN}" font-family="{MONO}" font-size="9" text-anchor="middle">resurrection body</text>
    <rect x="860" y="360" width="200" height="480" fill="{PAIN}" opacity=".08"/>
    <text x="960" y="400" fill="{PAIN}" font-family="{MONO}" font-size="9" text-anchor="middle">Islamic fitra</text>
    <text x="960" y="420" fill="{PAIN}" font-family="{MONO}" font-size="9" text-anchor="middle">altering creation</text>
    <rect x="40" y="700" width="1020" height="80" fill="{PAIN}" opacity=".06"/>
    <text x="550" y="750" fill="{PAIN}" font-family="{MONO}" font-size="9" text-anchor="middle">secular dignity · natural kind · coercive eugenics · corporate lock-in · misaligned AI</text>
  </svg>"""
    return fig_block("PMX-05", "Mandate Ladder: Therapy to Exit", svg)


def pmx_06() -> str:
    nodes = [
        ("imago Dei", 200, 120), ("creation very good", 400, 80), ("Fall", 600, 120),
        ("incarnation", 800, 120), ("temple of body", 200, 280), ("cross", 400, 320),
        ("resurrection body", 600, 280), ("natural law", 800, 280),
    ]
    body = ""
    for label, x, y in nodes:
        body += f'<rect x="{x-70}" y="{y}" width="140" height="44" rx="3" fill="{PANEL}" stroke="{LINE}"/>'
        body += f'<text x="{x}" y="{y+27}" fill="{MUTED}" font-family="{MONO}" font-size="9" text-anchor="middle">{label}</text>'
    svg = f"""  <svg viewBox="0 0 1200 760" role="img" aria-label="Christian warranty map">
    <rect width="1200" height="760" fill="{BG}"/>
    <ellipse cx="600" cy="400" rx="120" ry="60" fill="#120909" stroke="{GOLD}" opacity=".4"/>
    <text x="600" y="395" fill="{INK}" font-family="{MONO}" font-size="12" text-anchor="middle">HUMAN BODY</text>
    <text x="600" y="415" fill="{MUTED}" font-family="{MONO}" font-size="9" text-anchor="middle">fallen · redeemable</text>
    {body}
    <text x="120" y="520" fill="{PLEASURE}" font-family="{MONO}" font-size="10">repair allowed → medicine · prosthetic · charity · pain relief</text>
    <text x="120" y="550" fill="{PAIN}" font-family="{MONO}" font-size="10">exit forbidden → reject goodness · abandon flesh · rival eschatology</text>
    <text x="600" y="700" fill="{GOLD}" font-family="{MONO}" font-size="13" text-anchor="middle" opacity=".7">REDEEM · DO NOT RECALL</text>
  </svg>"""
    return fig_block("PMX-06", "Christian Warranty Map", svg)


def pmx_07() -> str:
    svg = f"""  <svg viewBox="0 0 1200 760" role="img" aria-label="Islamic warranty map abstract geometry">
    <rect width="1200" height="760" fill="{BG}"/>
    <polygon points="600,180 720,240 720,360 600,420 480,360 480,240" fill="{PANEL}" stroke="{GOLD}" stroke-width="1.5"/>
    <text x="600" y="310" fill="{GOLD}" font-family="{MONO}" font-size="14" text-anchor="middle">AMANAH</text>
    <text x="600" y="330" fill="{MUTED}" font-family="{MONO}" font-size="9" text-anchor="middle">body as trust</text>
    <g font-family="{MONO}" font-size="9">
      <text x="200" y="200" fill="{MUTED}">fitra</text><text x="200" y="220" fill="{DIM}">Q 30:30</text>
      <text x="920" y="200" fill="{MUTED}">khilafa</text><text x="920" y="220" fill="{DIM}">Q 2:30</text>
      <text x="160" y="400" fill="{MUTED}">nafs · sabr</text>
      <text x="960" y="400" fill="{MUTED}">qiyamah</text>
      <text x="200" y="520" fill="{MUTED}">Iblis · clay</text>
      <text x="880" y="520" fill="{MUTED}">Q 4:119 alteration</text>
    </g>
    <rect x="60" y="560" width="480" height="160" rx="4" fill="#060708" stroke="{PLEASURE}"/>
    <text x="300" y="600" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">therapeutic repair under divine title</text>
    <rect x="660" y="560" width="480" height="160" rx="4" fill="#120909" stroke="{PAIN}"/>
    <text x="900" y="600" fill="{PAIN}" font-family="{MONO}" font-size="11" text-anchor="middle">ontological alteration · self-ownership · contempt for clay</text>
    <line x1="600" y1="560" x2="600" y2="520" stroke="{GOLD}" stroke-width="1"/>
    <text x="600" y="510" fill="{GOLD}" font-family="{MONO}" font-size="10" text-anchor="middle">stewardship ≠ manufacture</text>
  </svg>"""
    return fig_block("PMX-07", "Islamic Warranty Map", svg)


def pmx_08() -> str:
    svg = f"""  <svg viewBox="0 0 1200 760" role="img" aria-label="Secular humanist trap triangle">
    <rect width="1200" height="760" fill="{BG}"/>
    <polygon points="600,100 980,620 220,620" fill="none" stroke="{LINE}" stroke-width="1.5"/>
    <text x="600" y="80" fill="{INK}" font-family="{MONO}" font-size="12" text-anchor="middle">DIGNITY</text>
    <text x="200" y="650" fill="{INK}" font-family="{MONO}" font-size="12">EQUALITY</text>
    <text x="920" y="650" fill="{INK}" font-family="{MONO}" font-size="12">NATURAL KIND</text>
    <circle cx="600" cy="420" r="55" fill="{PANEL}" stroke="{GOLD}"/>
    <text x="600" y="425" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">FACTOR X</text>
    <text x="600" y="520" fill="{DIM}" font-family="{MONO}" font-size="9" text-anchor="middle">human rights · bioethics · species continuity · vulnerability</text>
    <path d="M980 620 L1050 680" stroke="{PAIN}" stroke-width="2" marker-end="url(#arr)"/>
    <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="{PAIN}"/></marker></defs>
    <text x="1020" y="700" fill="{PAIN}" font-family="{MONO}" font-size="10">posthuman exit</text>
    <text x="1020" y="720" fill="{DIM}" font-family="{MONO}" font-size="8">Übermensch panic · caste fear · designed persons</text>
  </svg>"""
    return fig_block("PMX-08", "The Secular Humanist Trap", svg)


def pmx_09() -> str:
    rows = [
        ("sacred object", "imago Dei · resurrection", "fitra · amanah", "dignity · Factor X"),
        ("authorized repair", "medicine · prosthetic", "harm removal · surgery", "therapy · disability tech"),
        ("forbidden exit", "reject created goodness", "alter creation · self-title", "posthuman · natural kind break"),
        ("enforcement phrase", "REDEMPTION NOT RECALL", "STEWARDSHIP NOT OWNERSHIP", "DIGNITY OF THE SPECIES"),
        ("fear name", "heresy · pride", "Iblis · rival maker", "Übermensch · caste"),
        ("consolation", "cross · resurrection", "sabr · qiyamah", "equal rights · vulnerability"),
    ]
    body = ""
    y = 130
    for row in rows:
        body += f'<text x="40" y="{y}" fill="{DIM}" font-family="{MONO}" font-size="10">{row[0]}</text>'
        for j, cell in enumerate(row[1:], 1):
            x = 280 + (j - 1) * 300
            body += f'<rect x="{x-10}" y="{y-16}" width="280" height="28" fill="{PANEL}" stroke="{LINE}"/>'
            body += f'<text x="{x+130}" y="{y}" fill="{MUTED}" font-family="{MONO}" font-size="9" text-anchor="middle">{cell}</text>'
        y += 50
    svg = f"""  <svg viewBox="0 0 1200 820" role="img" aria-label="Three warranty regimes comparison matrix">
    <rect width="1200" height="820" fill="{BG}"/>
    <text x="280" y="60" fill="{MUTED}" font-family="{MONO}" font-size="12" text-anchor="middle">Christianity</text>
    <text x="580" y="60" fill="{MUTED}" font-family="{MONO}" font-size="12" text-anchor="middle">Islam</text>
    <text x="880" y="60" fill="{MUTED}" font-family="{MONO}" font-size="12" text-anchor="middle">Secular Humanism</text>
    {body}
    <rect x="40" y="470" width="1120" height="50" fill="#120909" stroke="{GOLD}"/>
    <text x="600" y="502" fill="{GOLD}" font-family="{MONO}" font-size="12" text-anchor="middle">convergence · repair yes · exit no</text>
    <text x="120" y="560" fill="{PLEASURE}" font-family="{MONO}" font-size="10">✓ repair permitted</text>
    <text x="400" y="560" fill="{PAIN}" font-family="{MONO}" font-size="10">🔒 exit forbidden</text>
  </svg>"""
    return fig_block("PMX-09", "The Three Warranty Regimes", svg)


def pmx_10() -> str:
    stations = [
        (80, "pain-machine proof"), (220, "genesis reclassification"), (360, "anti-suffering mandate"),
        (500, "AI design systems"), (640, "exit labs"), (780, "morphological freedom"),
        (920, "plural embodiment"), (1060, "post-human polity ?"),
    ]
    body = ""
    for x, label in stations:
        body += f'<circle cx="{x}" cy="380" r="14" fill="{PANEL}" stroke="{GOLD}" stroke-width="1.5"/>'
        body += f'<text x="{x}" y="420" fill="{MUTED}" font-family="{MONO}" font-size="8" text-anchor="middle">{label}</text>'
    for i in range(len(stations) - 1):
        x1, x2 = stations[i][0], stations[i + 1][0]
        body += f'<line x1="{x1+16}" y1="380" x2="{x2-16}" y2="380" stroke="{GOLD}" stroke-width="2"/>'
    svg = f"""  <svg viewBox="0 0 1300 760" role="img" aria-label="Abolition roadmap subway map">
    <rect width="1300" height="760" fill="{BG}"/>
    <text x="650" y="40" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">abolition roadmap · main line</text>
    <line x1="60" y1="380" x2="1240" y2="380" stroke="{GOLD}" stroke-width="3" opacity=".3"/>
    {body}
    <path d="M500 380 L520 280 L620 280" stroke="{PAIN}" stroke-width="1.2" fill="none"/>
    <text x="620" y="270" fill="{PAIN}" font-family="{MONO}" font-size="8">state eugenics</text>
    <path d="M640 380 L660 500 L760 500" stroke="{PAIN}" stroke-width="1.2" fill="none"/>
    <text x="760" y="515" fill="{PAIN}" font-family="{MONO}" font-size="8">corporate immortality scam</text>
    <path d="M780 380 L800 240 L900 240" stroke="{PAIN}" stroke-width="1.2" fill="none"/>
    <text x="900" y="230" fill="{PAIN}" font-family="{MONO}" font-size="8">misaligned AI</text>
    <rect x="60" y="580" width="1180" height="60" rx="3" fill="#060708" stroke="{PLEASURE}"/>
    <text x="650" y="618" fill="{PLEASURE}" font-family="{MONO}" font-size="10" text-anchor="middle">immediate relief · pain medicine · mental health · disability tech · palliative care</text>
  </svg>"""
    return fig_block("PMX-10", "Abolition Roadmap", svg)


def pmx_11() -> str:
    metrics = [
        ("involuntary pain-hours", "4.2B", PAIN),
        ("chronic pain prevalence", "20%", PAIN),
        ("severe mental distress", "970M", PAIN),
        ("access to exit tech", "0.01%", GOLD),
    ]
    cards = ""
    x = 40
    for label, val, col in metrics:
        cards += f'<rect x="{x}" y="60" width="260" height="90" rx="4" fill="{PANEL}" stroke="{LINE}"/>'
        cards += f'<text x="{x+20}" y="95" fill="{DIM}" font-family="{MONO}" font-size="9">{label}</text>'
        cards += f'<text x="{x+20}" y="130" fill="{col}" font-family="{MONO}" font-size="22">{val}</text>'
        x += 290
    svg = f"""  <svg viewBox="0 0 1200 780" role="img" aria-label="Suffering audit dashboard">
    <rect width="1200" height="780" fill="{BG}"/>
    <text x="600" y="35" fill="{DIM}" font-family="{MONO}" font-size="11" text-anchor="middle">suffering audit dashboard · abolition target</text>
    {cards}
    <polyline points="60,520 200,500 340,480 480,420 620,350 760,280 900,200 1040,120" fill="none" stroke="{GOLD}" stroke-width="2"/>
    <text x="1040" y="110" fill="{GOLD}" font-family="{MONO}" font-size="9">→ zero (abolition)</text>
    <rect x="820" y="200" width="340" height="520" rx="4" fill="{PANEL}" stroke="{LINE}"/>
    <text x="840" y="240" fill="{INK}" font-family="{MONO}" font-size="11">policy levers</text>
    <g font-family="{MONO}" font-size="9" fill="{MUTED}">
      <text x="840" y="270">analgesia research</text>
      <text x="840" y="300">neurodegeneration</text>
      <text x="840" y="330">psychiatric repair</text>
      <text x="840" y="360">morphological freedom</text>
      <text x="840" y="390">AI safety</text>
      <text x="840" y="420">personhood law</text>
    </g>
  </svg>"""
    return fig_block("PMX-11", "Suffering Audit Dashboard", svg)


def main() -> int:
    figures = {
        "PMX-00": pmx_00(),
        "PMX-01": pmx_01(),
        "PMX-02": pmx_02(),
        "PMX-03": pmx_03(),
        "PMX-04": pmx_04(),
        "PMX-05": pmx_05(),
        "PMX-06": pmx_06(),
        "PMX-07": pmx_07(),
        "PMX-08": pmx_08(),
        "PMX-09": pmx_09(),
        "PMX-10": pmx_10(),
        "PMX-11": pmx_11(),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(figures, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(figures)} figures to {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
