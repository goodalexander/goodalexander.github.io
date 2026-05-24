#!/usr/bin/env python3
"""Restore evidence SVG figures from pre-canvas git revision; rebuild PMX as Pearl-style diagrams."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARTICLE = REPO / "content/posts/pain_machines.md"
SOURCE_REV = "e26d71e"

MONO = "ui-monospace,monospace"
BG = "#040506"
PANEL = "#0a0b0d"
INK = "#ebe4dc"
MUTED = "#8a9199"
DIM = "#555c64"
GOLD = "#b89a6a"
PAIN = "#b85c55"
PLEASURE = "#7a9a8c"
LINE = "rgba(235,228,220,.12)"


def git_source() -> str:
    return subprocess.check_output(
        ["git", "show", f"{SOURCE_REV}:content/posts/pain_machines.md"],
        cwd=REPO,
        text=True,
    )


def extract_figure(text: str, fid: str) -> str | None:
    pat = rf'(<figure class="pm-fig[^"]*" id="{re.escape(fid)}">.*?</figure>)'
    m = re.search(pat, text, re.S)
    return m.group(1) if m else None


def make_unique_ids(block: str, prefix: str) -> str:
    """Prefix gradient/marker ids inside SVG only — never the figure element id."""
    m = re.search(r"(<svg\b.*?</svg>)", block, re.S)
    if not m:
        return block

    def repl_id(match: re.Match) -> str:
        return f'id="{prefix}-{match.group(1)}"'

    svg = m.group(1)
    svg = re.sub(r'\bid="([^"]+)"', repl_id, svg)
    svg = re.sub(r"url\(#([^)]+)\)", lambda match: f"url(#{prefix}-{match.group(1)})", svg)
    return block[: m.start(1)] + svg + block[m.end(1) :]


def pearl_fig(fid: str, num: str, title: str, svg_body: str, caption: str, cite: str = "") -> str:
    cite_html = f'\n    <a class="pm-cite" href="{cite}">{cite.split("/")[-1][:24]}</a>' if cite else ""
    body = svg_body.strip()
    svg = f"""  <svg viewBox="0 0 920 320" role="img" aria-label="{title}">
    <rect width="920" height="320" fill="{BG}"/>
{body}
  </svg>"""
    return f"""<figure class="pm-fig pm-fig-evidence" id="{fid}">
  <div class="pm-fig-head">
    <span class="pm-fig-n">{num}</span>
    <h4>{title}</h4>{cite_html}
  </div>
{svg}
  <p class="pm-fig-cap">{caption}</p>
</figure>"""


def pmx_00() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">WARRANTY CARD · SHIPPED AT BIRTH</text>
    <rect x="40" y="48" width="380" height="240" fill="{PANEL}" stroke="{LINE}" rx="4"/>
    <text x="56" y="78" fill="{DIM}" font-family="{MONO}" font-size="11">PRODUCT</text>
    <text x="160" y="78" fill="{INK}" font-family="{MONO}" font-size="13" font-weight="700">Homo sapiens</text>
    <text x="56" y="108" fill="{DIM}" font-family="{MONO}" font-size="11">KNOWN DEFECTS</text>
    <text x="160" y="108" fill="{PAIN}" font-family="{MONO}" font-size="12">pain · fear · grief · decay · death</text>
    <text x="56" y="138" fill="{DIM}" font-family="{MONO}" font-size="11">TERMS</text>
    <text x="160" y="138" fill="{MUTED}" font-family="{MONO}" font-size="12">repair permitted · exit prohibited</text>
    <rect x="56" y="160" width="348" height="48" fill="#120909" stroke="{GOLD}" rx="3"/>
    <text x="230" y="190" fill="{GOLD}" font-family="{MONO}" font-size="14" font-weight="700" text-anchor="middle">VOID THE WARRANTY</text>
    <rect x="460" y="48" width="420" height="240" fill="{PANEL}" stroke="{PAIN}" rx="4"/>
    <text x="476" y="78" fill="{PAIN}" font-family="{MONO}" font-size="11" font-weight="700">THREE REGIMES · SAME CLAUSE</text>
    <text x="476" y="110" fill="{MUTED}" font-family="{MONO}" font-size="12">Christianity → sanctify body · forbid exit</text>
    <text x="476" y="140" fill="{MUTED}" font-family="{MONO}" font-size="12">Islam → amanah · forbid self-ownership</text>
    <text x="476" y="170" fill="{MUTED}" font-family="{MONO}" font-size="12">Secular → dignity · forbid natural-kind break</text>
    <text x="476" y="210" fill="{GOLD}" font-family="{MONO}" font-size="11">repair yes · exit no</text>"""
    return pearl_fig("pmx-00", "W0", "The warranty card in the crib",
                     body, "Every civilization assigns repair rights and forbids exit from the inherited human format before consent is possible.")


def pmx_01() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">PAIN LEDGER vs PLEASURE LEDGER</text>
    <text x="40" y="58" fill="{PLEASURE}" font-family="{MONO}" font-size="11">PLEASURE (few branches)</text>
    <rect x="40" y="68" width="120" height="24" fill="{PANEL}" stroke="{PLEASURE}" rx="2"/><text x="100" y="84" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">reward</text>
    <rect x="170" y="68" width="90" height="24" fill="{PANEL}" stroke="{PLEASURE}" rx="2"/><text x="215" y="84" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">satiety</text>
    <rect x="270" y="68" width="70" height="24" fill="{PANEL}" stroke="{PLEASURE}" rx="2"/><text x="305" y="84" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">calm</text>
    <text x="40" y="130" fill="{PAIN}" font-family="{MONO}" font-size="11">PAIN (branches multiply)</text>
    <rect x="40" y="140" width="100" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="90" y="155" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">nociception</text>
    <rect x="150" y="140" width="100" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="200" y="155" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">neuropathy</text>
    <rect x="260" y="140" width="90" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="305" y="155" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">allodynia</text>
    <rect x="40" y="170" width="90" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="85" y="185" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">panic</text>
    <rect x="140" y="170" width="90" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="185" y="185" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">grief</text>
    <rect x="240" y="170" width="110" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="295" y="185" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">chronicity</text>
    <rect x="40" y="200" width="100" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="90" y="215" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">trauma mem.</text>
    <rect x="150" y="200" width="100" height="22" fill="{PANEL}" stroke="{PAIN}" rx="2"/><text x="200" y="215" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">shame</text>
    <text x="460" y="58" fill="{INK}" font-family="{MONO}" font-size="13">Clinical + psych evidence:</text>
    <text x="460" y="88" fill="{MUTED}" font-family="{MONO}" font-size="12">McGill 78 descriptors vs ~11 drug families</text>
    <text x="460" y="118" fill="{MUTED}" font-family="{MONO}" font-size="12">ICD-11 seven chronic pain categories</text>
    <text x="460" y="148" fill="{MUTED}" font-family="{MONO}" font-size="12">Baumeister: bad &gt; good across domains</text>
    <text x="460" y="190" fill="{GOLD}" font-family="{MONO}" font-size="13" font-weight="700">suffering enumerates faster</text>"""
    return pearl_fig("pmx-01", "W1", "The pain ledger",
                     body, "Pleasure categories plateau; pain proliferates into sensation, emotion, memory, identity, and law.")


def pmx_09() -> str:
    body = f"""
    <text x="40" y="28" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">THREE WARRANTY REGIMES · CONVERGENCE</text>
    <text x="80" y="58" fill="{MUTED}" font-family="{MONO}" font-size="11" text-anchor="middle">Christianity</text>
    <text x="320" y="58" fill="{MUTED}" font-family="{MONO}" font-size="11" text-anchor="middle">Islam</text>
    <text x="560" y="58" fill="{MUTED}" font-family="{MONO}" font-size="11" text-anchor="middle">Secular humanism</text>
    <text x="800" y="58" fill="{MUTED}" font-family="{MONO}" font-size="11" text-anchor="middle">All three</text>
    <text x="40" y="88" fill="{DIM}" font-family="{MONO}" font-size="10">sacred object</text>
    <rect x="80" y="72" width="160" height="28" fill="{PANEL}" stroke="{LINE}" rx="2"/><text x="160" y="90" fill="{INK}" font-family="{MONO}" font-size="10" text-anchor="middle">imago Dei · cross</text>
    <rect x="260" y="72" width="160" height="28" fill="{PANEL}" stroke="{LINE}" rx="2"/><text x="340" y="90" fill="{INK}" font-family="{MONO}" font-size="10" text-anchor="middle">fitra · amanah</text>
    <rect x="440" y="72" width="160" height="28" fill="{PANEL}" stroke="{LINE}" rx="2"/><text x="520" y="90" fill="{INK}" font-family="{MONO}" font-size="10" text-anchor="middle">dignity · Factor X</text>
    <text x="40" y="128" fill="{DIM}" font-family="{MONO}" font-size="10">repair OK</text>
    <rect x="80" y="112" width="160" height="28" fill="#0d1a12" stroke="{PLEASURE}" rx="2"/><text x="160" y="130" fill="{PLEASURE}" font-family="{MONO}" font-size="10" text-anchor="middle">medicine · charity</text>
    <rect x="260" y="112" width="160" height="28" fill="#0d1a12" stroke="{PLEASURE}" rx="2"/><text x="340" y="130" fill="{PLEASURE}" font-family="{MONO}" font-size="10" text-anchor="middle">harm removal</text>
    <rect x="440" y="112" width="160" height="28" fill="#0d1a12" stroke="{PLEASURE}" rx="2"/><text x="520" y="130" fill="{PLEASURE}" font-family="{MONO}" font-size="10" text-anchor="middle">therapy · rights</text>
    <text x="40" y="168" fill="{DIM}" font-family="{MONO}" font-size="10">exit forbidden</text>
    <rect x="80" y="152" width="160" height="28" fill="#120909" stroke="{PAIN}" rx="2"/><text x="160" y="170" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">abandon flesh</text>
    <rect x="260" y="152" width="160" height="28" fill="#120909" stroke="{PAIN}" rx="2"/><text x="340" y="170" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">alter creation</text>
    <rect x="440" y="152" width="160" height="28" fill="#120909" stroke="{PAIN}" rx="2"/><text x="520" y="170" fill="{PAIN}" font-family="{MONO}" font-size="10" text-anchor="middle">posthuman taboo</text>
    <rect x="640" y="112" width="240" height="68" fill="#120909" stroke="{GOLD}" rx="3"/>
    <text x="760" y="140" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700" text-anchor="middle">repair yes</text>
    <text x="760" y="162" fill="{PAIN}" font-family="{MONO}" font-size="12" font-weight="700" text-anchor="middle">exit no</text>"""
    return pearl_fig("pmx-09", "W9", "Three warranty regimes",
                     body, "Different heavens, same lock: each permits repair under its authority but forbids exit from the human format.")


def pmx_05() -> str:
    body = f"""
    <text x="40" y="28" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">MANDATE LADDER · THERAPY → EXIT</text>
    <rect x="40" y="48" width="200" height="32" fill="{PANEL}" stroke="{PLEASURE}" rx="3"/><text x="140" y="68" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">pain medicine</text>
    <rect x="40" y="88" width="200" height="32" fill="{PANEL}" stroke="{PLEASURE}" rx="3"/><text x="140" y="108" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">prosthetics · psychiatry</text>
    <rect x="40" y="128" width="200" height="32" fill="{PANEL}" stroke="{PLEASURE}" rx="3"/><text x="140" y="148" fill="{PLEASURE}" font-family="{MONO}" font-size="11" text-anchor="middle">gene repair · neural IF</text>
    <line x1="40" y1="180" x2="880" y2="180" stroke="{GOLD}" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="460" y="172" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>
    <rect x="40" y="196" width="200" height="32" fill="{PANEL}" stroke="{GOLD}" rx="3"/><text x="140" y="216" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">affect editing</text>
    <rect x="40" y="236" width="200" height="32" fill="{PANEL}" stroke="{GOLD}" rx="3"/><text x="140" y="256" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">synthetic body</text>
    <rect x="40" y="276" width="200" height="32" fill="{PANEL}" stroke="{GOLD}" rx="3"/><text x="140" y="296" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">substrate migration</text>
    <rect x="280" y="196" width="620" height="112" fill="#120909" stroke="{PAIN}" rx="4"/>
    <text x="296" y="222" fill="{PAIN}" font-family="{MONO}" font-size="11" font-weight="700">VETO BANDS (all three regimes)</text>
    <text x="296" y="248" fill="{MUTED}" font-family="{MONO}" font-size="11">Christian: resurrection body · natural law</text>
    <text x="296" y="272" fill="{MUTED}" font-family="{MONO}" font-size="11">Islam: fitra · Q 4:119 altering creation</text>
    <text x="296" y="296" fill="{MUTED}" font-family="{MONO}" font-size="11">Secular: dignity · species continuity · Factor X</text>"""
    return pearl_fig("pmx-05", "W5", "Mandate ladder: therapy to exit",
                     body, "Every regime blesses repair until repair becomes escape from the inherited chassis.")


def pmx_02() -> str:
    layers = ["tissue · nociceptor", "spinal gate · thalamus", "insula · ACC",
              "memory · prediction", "identity · social cost"]
    rows = ""
    y = 60
    for lab in layers:
        rows += f'<rect x="40" y="{y}" width="840" height="32" fill="{PANEL}" stroke="{LINE}" rx="2"/>'
        rows += f'<text x="56" y="{y+20}" fill="{INK}" font-family="{MONO}" font-size="12">{lab}</text>'
        rows += f'<circle cx="860" cy="{y+16}" r="6" fill="{PAIN}"/>'
        y += 40
    body = f'<text x="40" y="36" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">ALARM STACK · CLINICAL ESCALATION</text>{rows}'
    return pearl_fig("pmx-02", "W2", "Alarm stack", body,
                     "Pain is not one signal — it climbs tissue → brain → memory → identity. Central sensitization keeps firing after healing.")


def pmx_03() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">GENESIS 2–3 · DEFECT REPORT</text>
    <text x="40" y="70" fill="{DIM}" font-family="{MONO}" font-size="10">TRADITIONAL READ</text>
    <text x="200" y="70" fill="{MUTED}" font-family="{MONO}" font-size="11">disobedience → curse → guilt</text>
    <text x="40" y="110" fill="{PAIN}" font-family="{MONO}" font-size="10">DEFECT READ</text>
    <text x="200" y="110" fill="{PAIN}" font-family="{MONO}" font-size="11">embodied vulnerability → reproductive trauma → mortality</text>
    <rect x="40" y="140" width="840" height="120" fill="{PANEL}" stroke="{LINE}" rx="4"/>
    <text x="56" y="168" fill="{INK}" font-family="{MONO}" font-size="11">dust → breath → command → tree → eye opens</text>
    <text x="56" y="198" fill="{PAIN}" font-family="{MONO}" font-size="11">birth pain · toil · grave (hardware properties, not moral invoice)</text>
    <rect x="56" y="218" width="14" height="14" fill="{PAIN}"/><text x="80" y="230" fill="{INK}" font-family="{MONO}" font-size="11">root cause: design architecture (not user error)</text>"""
    return pearl_fig("pmx-03", "W3", "Genesis as QA report", body,
                     "The curse list matches a product defect table once you stop assigning guilt downstream.")


def pmx_04() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">ORIGINAL SIN · TWO READINGS</text>
    <text x="40" y="68" fill="{DIM}" font-family="{MONO}" font-size="11">WARRANTY THEOLOGY</text>
    <text x="40" y="92" fill="{MUTED}" font-family="{MONO}" font-size="12">disobedience → Fall → suffering → redemption ✝</text>
    <text x="40" y="140" fill="{PAIN}" font-family="{MONO}" font-size="11">DEFECT REPORT</text>
    <text x="40" y="164" fill="{PAIN}" font-family="{MONO}" font-size="12">pain-machine architecture → consciousness of harm → blame narrative</text>
    <text x="40" y="220" fill="{GOLD}" font-family="{MONO}" font-size="13" font-weight="700">fault moves upstream ↑</text>"""
    return pearl_fig("pmx-04", "W4", "Original sin inversion", body,
                     "Standard theology sends guilt to the creature. The defect report sends it to the design.")


def pmx_06() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">CHRISTIAN WARRANTY MAP</text>
    <rect x="360" y="60" width="200" height="56" fill="#120909" stroke="{GOLD}" rx="4"/>
    <text x="460" y="92" fill="{INK}" font-family="{MONO}" font-size="12" text-anchor="middle">human body</text>
    <text x="40" y="140" fill="{PLEASURE}" font-family="{MONO}" font-size="11">✓ repair: medicine · prosthetic · charity</text>
    <text x="40" y="170" fill="{PAIN}" font-family="{MONO}" font-size="11">✗ exit: abandon flesh · rival eschatology</text>
    <text x="40" y="210" fill="{MUTED}" font-family="{MONO}" font-size="11">imago Dei · incarnation · resurrection body · 1 Cor 6 temple</text>
    <text x="40" y="250" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">REDEEM · DO NOT RECALL</text>"""
    return pearl_fig("pmx-06", "W6", "Christian warranty map", body,
                     "Christianity can heal the product; it cannot admit the product should never have shipped.")


def pmx_07() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">ISLAMIC WARRANTY MAP</text>
    <rect x="340" y="56" width="240" height="64" fill="{PANEL}" stroke="{GOLD}" rx="4"/>
    <text x="460" y="88" fill="{GOLD}" font-family="{MONO}" font-size="14" text-anchor="middle">AMANAH</text>
    <text x="460" y="108" fill="{MUTED}" font-family="{MONO}" font-size="11" text-anchor="middle">body as trust · Q 2:30 khilafa</text>
    <text x="40" y="150" fill="{PLEASURE}" font-family="{MONO}" font-size="11">✓ therapeutic repair under divine title</text>
    <text x="40" y="180" fill="{PAIN}" font-family="{MONO}" font-size="11">✗ ontological alteration · self-ownership · contempt for clay</text>
    <text x="40" y="220" fill="{MUTED}" font-family="{MONO}" font-size="11">fitra Q 30:30 · Q 4:119 · Iblis and clay · nafs · qiyamah</text>
    <text x="40" y="260" fill="{GOLD}" font-family="{MONO}" font-size="12">stewardship ≠ manufacture</text>"""
    return pearl_fig("pmx-07", "W7", "Islamic warranty map", body,
                     "The boundary is not repair vs no repair. It is trust vs ownership.")


def pmx_08() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">SECULAR HUMANIST TRAP</text>
    <polygon points="460,60 720,260 200,260" fill="none" stroke="{LINE}" stroke-width="1.5"/>
    <text x="460" y="48" fill="{INK}" font-family="{MONO}" font-size="11" text-anchor="middle">DIGNITY</text>
    <text x="200" y="278" fill="{INK}" font-family="{MONO}" font-size="11">EQUALITY</text>
    <text x="720" y="278" fill="{INK}" font-family="{MONO}" font-size="11">NATURAL KIND</text>
    <circle cx="460" cy="180" r="40" fill="{PANEL}" stroke="{GOLD}"/>
    <text x="460" y="186" fill="{GOLD}" font-family="{MONO}" font-size="11" text-anchor="middle">FACTOR X</text>
    <text x="40" y="120" fill="{PAIN}" font-family="{MONO}" font-size="11">posthuman exit breaks the triangle</text>
    <text x="40" y="148" fill="{MUTED}" font-family="{MONO}" font-size="11">Fukuyama · Habermas · UNESCO · Oviedo Convention</text>"""
    return pearl_fig("pmx-08", "W8", "Secular humanist trap", body,
                     "Secular dignity is imago Dei with the serial numbers filed off.")


def pmx_10() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">ABOLITION ROADMAP</text>
    <line x1="40" y1="160" x2="880" y2="160" stroke="{GOLD}" stroke-width="3"/>
    <text x="80" y="200" fill="{MUTED}" font-family="{MONO}" font-size="10" text-anchor="middle">proof</text>
    <text x="200" y="200" fill="{MUTED}" font-family="{MONO}" font-size="10" text-anchor="middle">mandate</text>
    <text x="340" y="200" fill="{MUTED}" font-family="{MONO}" font-size="10" text-anchor="middle">AI design</text>
    <text x="480" y="200" fill="{MUTED}" font-family="{MONO}" font-size="10" text-anchor="middle">exit labs</text>
    <text x="620" y="200" fill="{MUTED}" font-family="{MONO}" font-size="10" text-anchor="middle">morph freedom</text>
    <text x="760" y="200" fill="{GOLD}" font-family="{MONO}" font-size="10" text-anchor="middle">post-human ?</text>
    <text x="40" y="240" fill="{PLEASURE}" font-family="{MONO}" font-size="11">now: pain medicine · disability tech · palliative care</text>
    <text x="40" y="268" fill="{PAIN}" font-family="{MONO}" font-size="11">hazards: misaligned AI · state eugenics · corporate lock-in</text>"""
    return pearl_fig("pmx-10", "WA", "Abolition roadmap", body,
                     "A mandate is an ordered refusal to keep manufacturing hell — not a heaven sales pitch.")


def pmx_11() -> str:
    body = f"""
    <text x="40" y="32" fill="{GOLD}" font-family="{MONO}" font-size="12" font-weight="700">SUFFERING AUDIT · GOVERNANCE METRIC</text>
    <rect x="40" y="56" width="200" height="64" fill="{PANEL}" stroke="{PAIN}" rx="3"/>
    <text x="56" y="80" fill="{DIM}" font-family="{MONO}" font-size="10">involuntary pain-hours</text>
    <text x="56" y="108" fill="{PAIN}" font-family="{MONO}" font-size="22" font-weight="700">↓ target zero</text>
    <rect x="260" y="56" width="200" height="64" fill="{PANEL}" stroke="{PAIN}" rx="3"/>
    <text x="276" y="80" fill="{DIM}" font-family="{MONO}" font-size="10">chronic pain prevalence</text>
    <text x="276" y="108" fill="{PAIN}" font-family="{MONO}" font-size="22" font-weight="700">20%+</text>
    <rect x="480" y="56" width="200" height="64" fill="{PANEL}" stroke="{PAIN}" rx="3"/>
    <text x="496" y="80" fill="{DIM}" font-family="{MONO}" font-size="10">severe mental distress</text>
    <text x="496" y="108" fill="{PAIN}" font-family="{MONO}" font-size="22" font-weight="700">970M</text>
    <rect x="700" y="56" width="180" height="64" fill="{PANEL}" stroke="{GOLD}" rx="3"/>
    <text x="716" y="80" fill="{DIM}" font-family="{MONO}" font-size="10">access to exit tech</text>
    <text x="716" y="108" fill="{GOLD}" font-family="{MONO}" font-size="22" font-weight="700">~0%</text>
    <text x="40" y="160" fill="{MUTED}" font-family="{MONO}" font-size="11">policy levers: analgesia · psychiatric repair · morphological freedom · personhood law · AI safety</text>
    <polyline points="40,280 200,250 400,220 600,170 880,100" fill="none" stroke="{GOLD}" stroke-width="2"/>
    <text x="40" y="300" fill="{GOLD}" font-family="{MONO}" font-size="11">abolition target (not optimization of the warranty)</text>"""
    return pearl_fig("pmx-11", "WB", "Suffering audit dashboard", body,
                     "Count involuntary suffering instead of revering the inherited human format.")


PMX_BUILDERS = {
    "pmx-00": pmx_00,
    "pmx-01": pmx_01,
    "pmx-02": pmx_02,
    "pmx-03": pmx_03,
    "pmx-04": pmx_04,
    "pmx-05": pmx_05,
    "pmx-06": pmx_06,
    "pmx-07": pmx_07,
    "pmx-08": pmx_08,
    "pmx-09": pmx_09,
    "pmx-10": pmx_10,
    "pmx-11": pmx_11,
}


def replace_figure(article: str, fid: str, new_html: str) -> str:
    pat = rf'<figure class="pm-fig[^"]*" id="{re.escape(fid)}">.*?</figure>'
    if not re.search(pat, article, re.S):
        raise SystemExit(f"Figure {fid} not found in article")
    return re.sub(pat, new_html, article, count=1, flags=re.S)


def main() -> int:
    source = git_source()
    article = ARTICLE.read_text(encoding="utf-8")

    clinical = [
        "fig-neuromatrix", "fig-iasp", "fig-icd11", "fig-mcgill", "fig-price",
        "fig-berridge", "fig-leknes", "fig-baumeister", "fig-rozin",
        "fig-eisenberger", "fig-lazarus", "fig-brain",
    ]
    idx = 0
    for fid in clinical:
        block = extract_figure(source, fid)
        if not block:
            print(f"WARN: no source for {fid}")
            continue
        if fid != "fig-brain":
            block = block.replace('class="pm-fig"', 'class="pm-fig pm-fig-evidence"', 1)
            if 'pm-fig-cap' not in block:
                cap = re.search(r'<p class="pm-after">(.*?)</p>', article[article.find(f'id="{fid}"'):])
                cap_html = f'\n  <p class="pm-fig-cap">{cap.group(1)}</p>' if cap else ""
                block = block.replace("</figure>", cap_html + "\n</figure>")
            block = make_unique_ids(block, f"pm{idx}")
            idx += 1
        article = replace_figure(article, fid, block)

    for fid, builder in PMX_BUILDERS.items():
        article = replace_figure(article, fid, builder())

    # Drop pm-after paragraphs that duplicate figure captions
    def dedupe_after(m: re.Match) -> str:
        fig, after = m.group(1), m.group(2)
        cap = re.search(r'<p class="pm-fig-cap">(.*?)</p>', fig, re.S)
        if not cap:
            return m.group(0)
        norm = lambda s: re.sub(r"\s+", " ", s).strip()
        if norm(cap.group(1)) == norm(after):
            return fig + "\n"
        return m.group(0)

    article = re.sub(
        r'(<figure class="pm-fig[^"]*" id="[^"]+">.*?</figure>)\s*<p class="pm-after">(.*?)</p>',
        dedupe_after,
        article,
        flags=re.S,
    )

    article = re.sub(r'\n<script src="/research/pain_machines/pm-viz\.js" defer></script>\n?', "\n", article)
    article = re.sub(r'<p class="pm-viz-cap">.*?</p>\s*', "", article)
    article = re.sub(r'<div class="pm-viz-wrap">.*?</div>\s*', "", article)
    article = re.sub(r'class="pm-fig pm-fig-viz"', 'class="pm-fig pm-fig-evidence"', article)

    css_add = """
.pm-fig-evidence svg {
  display: block;
  width: 100%;
  height: auto;
  min-height: 200px;
}
.pm-fig-cap {
  margin: 0;
  padding: .75rem 1rem;
  border-top: 1px solid var(--line);
  font-size: .84rem;
  line-height: 1.5;
  color: var(--muted);
  max-width: none;
}
@media (max-width: 720px) {
  .pm-fig-evidence svg text { font-size: 11px !important; }
  .pm-fig-evidence { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .pm-fig-evidence svg { min-width: 640px; max-width: none; }
}
"""
    if ".pm-fig-cap" not in article:
        article = article.replace("</style>", css_add + "\n</style>", 1)

    def fix_svg_block(m: re.Match) -> str:
        block = m.group(0)
        open_end = block.index(">") + 1
        close_start = block.rindex("</svg>")
        head, body, tail = block[:open_end], block[open_end:close_start], block[close_start:]
        body = "\n".join(line for line in body.splitlines() if line.strip())
        return head + body + tail

    article = re.sub(r"<svg\b[^>]*>.*?</svg>", fix_svg_block, article, flags=re.S)

    ARTICLE.write_text(article, encoding="utf-8")
    print(f"Restored evidence figures in {ARTICLE}")
    print("SVG count:", article.count("<svg"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
