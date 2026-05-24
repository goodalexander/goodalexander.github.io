#!/usr/bin/env python3
"""Portrait SVG diagrams for mobile — same story as desktop, vertical layout."""

from __future__ import annotations

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
W, H = 360, 520


def svg(body: str, label: str) -> str:
    b = body.strip()
    return f"""<svg viewBox="0 0 {W} {H}" role="img" aria-label="{label}">
  <rect width="{W}" height="{H}" fill="{BG}"/>
{b}
</svg>"""


def box(x: int, y: int, w: int, h: int, text: str, sub: str = "", tone: str = "ink") -> str:
    stroke = {"ink": LINE, "pain": PAIN, "gold": GOLD, "good": PLEASURE}.get(tone, LINE)
    fill = {"pain": "#120909", "good": "#0d1a12"}.get(tone, PANEL)
    tc = {"pain": PAIN, "gold": GOLD, "good": PLEASURE, "dim": DIM}.get(tone, INK)
    sub_html = f'\n    <text x="{x + 12}" y="{y + 38}" fill="{DIM}" font-family="{MONO}" font-size="9">{sub}</text>' if sub else ""
    return f"""    <rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" rx="3"/>
    <text x="{x + 12}" y="{y + 20}" fill="{tc}" font-family="{MONO}" font-size="11" font-weight="600">{text}</text>{sub_html}"""


def arrow(x1: int, y1: int, x2: int, y2: int) -> str:
    return f'    <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{GOLD}" stroke-width="1.2" opacity="0.55"/>'


def title(y: int, text: str) -> str:
    return f'    <text x="16" y="{y}" fill="{GOLD}" font-family="{MONO}" font-size="10" font-weight="700">{text}</text>'


def portrait(fid: str) -> str:
    builders = {
        "pmx-00": _pmx_00,
        "fig-neuromatrix": _neuromatrix,
        "fig-iasp": _iasp,
        "fig-icd11": _icd11,
        "fig-mcgill": _mcgill,
        "fig-price": _price,
        "fig-berridge": _berridge,
        "fig-leknes": _leknes,
        "fig-baumeister": _baumeister,
        "fig-rozin": _rozin,
        "fig-eisenberger": _eisenberger,
        "fig-lazarus": _lazarus,
        "pmx-03": _pmx_03,
        "pmx-04": _pmx_04,
        "pmx-09": _pmx_09,
        "pmx-05": _pmx_05,
        "pmx-11": _pmx_11,
    }
    return builders[fid]()


def _neuromatrix() -> str:
    parts = [title(24, "NEUROMATRIX · BRAIN BUILDS PAIN")]
    inputs = [
        (16, 44, "somatic input", "one contributor"),
        (188, 44, "appraisal", "meaning"),
        (16, 100, "memory", "prior episodes"),
        (188, 100, "social field", "context"),
        (102, 156, "stress / attention", "arousal gate"),
    ]
    for x, y, t, s in inputs:
        parts.append(box(x, y, 156, 44, t, s, "gold"))
    parts.append(arrow(180, 200, 180, 228))
    parts.append(box(72, 232, 216, 52, "neuromatrix", "pain output pattern", "pain"))
    parts.append(arrow(180, 284, 180, 312))
    parts.append(box(48, 316, 264, 48, "pain experience", "≠ damage magnitude", "pain"))
    return svg("\n".join(parts), "Neuromatrix mobile")


def _iasp() -> str:
    parts = [title(24, "IASP 2020 · TWO CHANNELS")]
    parts.append(box(16, 44, 328, 56, "sensory", "quality · intensity · location", "pain"))
    parts.append(box(16, 116, 328, 56, "emotional", "unpleasantness · distress · threat", "gold"))
    parts.append(arrow(180, 172, 180, 200))
    parts.append(box(48, 204, 264, 52, "pain", "always both · never sensory-only", "pain"))
    parts.append(box(16, 280, 328, 44, "tissue damage", "associated — but not required", "dim"))
    return svg("\n".join(parts), "IASP mobile")


def _icd11() -> str:
    parts = [title(24, "ICD-11 MG30 · CHRONIC PAIN")]
    cats = [
        "MG30.0 primary / nociplastic",
        "MG30.1 cancer",
        "MG30.2 postsurgical",
        "MG30.3 musculoskeletal",
        "MG30.4 neuropathic",
        "MG30.5 headache · visceral",
        "MG30.6 secondary syndromes",
    ]
    y = 40
    for i, c in enumerate(cats):
        parts.append(box(16, y, 328, 34, c, tone="pain" if i == 0 else "ink"))
        if i < len(cats) - 1:
            parts.append(arrow(180, y + 34, 180, y + 44))
        y += 44
    parts.append(box(16, y + 8, 328, 40, "alarm outlives fire", "chronicity = the illness", "gold"))
    return svg("\n".join(parts), "ICD-11 mobile")


def _mcgill() -> str:
    parts = [title(24, "MCGILL · 78 PAIN WORDS")]
    parts.append(box(16, 40, 328, 40, "pleasure vocabulary", "reward · satiety · calm", "good"))
    parts.append(title(100, "pain descriptors multiply ↓"))
    words = ["burning", "stabbing", "sickening", "exhausting", "terrifying", "punishing", "gnawing", "heavy"]
    y = 120
    for i, w in enumerate(words):
        x = 16 if i % 2 == 0 else 188
        if i % 2 == 0 and i > 0:
            y += 36
        parts.append(box(x, y, 156, 28, w, tone="pain"))
    return svg("\n".join(parts), "McGill mobile")


def _price() -> str:
    parts = [title(24, "PRICE · MULTIPLE LEDGERS")]
    for i, (lab, pct) in enumerate([("intensity", 85), ("unpleasantness", 72), ("dread", 58)]):
        y = 44 + i * 56
        parts.append(f'    <text x="16" y="{y + 12}" fill="{MUTED}" font-family="{MONO}" font-size="10">{lab}</text>')
        parts.append(f'    <rect x="16" y="{y + 18}" width="{int(328 * pct / 100)}" height="14" fill="{PAIN}" opacity="0.85"/>')
        parts.append(f'    <rect x="16" y="{y + 18}" width="328" height="14" fill="none" stroke="{LINE}"/>')
    parts.append(box(16, 220, 328, 48, "one stimulus", "several suffering ledgers", "gold"))
    return svg("\n".join(parts), "Price mobile")


def _berridge() -> str:
    parts = [title(24, "BERRIDGE · WANTING vs LIKING")]
    parts.append(box(16, 40, 328, 80, "wanting (large)", "dopamine pursuit · runs without joy", "gold"))
    parts.append(box(16, 140, 328, 56, "liking (small hot spots)", "hedonic islands · NAc · VP", "good"))
    parts.append(box(16, 220, 328, 48, "red has empires", "green has tricks", "pain"))
    return svg("\n".join(parts), "Berridge mobile")


def _leknes() -> str:
    parts = [title(24, "LEKNES · RELIEF")]
    steps = [("threat / pain", 40), ("relief", 120), ("reward feeling", 200), ("pain still central", 280)]
    for lab, y in steps:
        tone = "good" if lab == "relief" else "pain" if "pain" in lab else "gold"
        parts.append(box(16, y, 328, 44, lab, tone=tone))
        if y < 280:
            parts.append(arrow(180, y + 44, 180, y + 56))
    return svg("\n".join(parts), "Leknes mobile")


def _baumeister() -> str:
    parts = [title(24, "BAUMEISTER · BAD > GOOD")]
    parts.append(f'    <text x="16" y="48" fill="{MUTED}" font-family="{MONO}" font-size="10">matched bad event</text>')
    parts.append(f'    <rect x="16" y="54" width="280" height="18" fill="{PAIN}"/>')
    parts.append(f'    <text x="16" y="96" fill="{MUTED}" font-family="{MONO}" font-size="10">matched good event</text>')
    parts.append(f'    <rect x="16" y="102" width="110" height="18" fill="{PLEASURE}"/>')
    parts.append(box(16, 150, 328, 48, "scale tips red", "harm writes heavier ink", "pain"))
    return svg("\n".join(parts), "Baumeister mobile")


def _rozin() -> str:
    parts = [title(24, "ROZIN · CONTAMINATION")]
    parts.append(box(16, 40, 156, 56, "good stays local", "few neighbors", "good"))
    parts.append(box(188, 40, 156, 120, "bad spreads", "stain · memory · identity", "pain"))
    parts.append(arrow(172, 68, 188, 68))
    parts.append(box(16, 120, 156, 40, "one bad event", tone="pain"))
    return svg("\n".join(parts), "Rozin mobile")


def _eisenberger() -> str:
    parts = [title(24, "EISENBERGER · SOCIAL PAIN")]
    parts.append(box(16, 44, 328, 48, "ostracism · rejection", "face · silence · exile", "gold"))
    parts.append(arrow(180, 92, 180, 120))
    parts.append(box(16, 124, 328, 48, "dACC · anterior insula", "bodily hurt circuits", "pain"))
    parts.append(arrow(180, 172, 180, 200))
    parts.append(box(16, 204, 328, 48, "social wound = bodily alarm", tone="pain"))
    return svg("\n".join(parts), "Eisenberger mobile")


def _lazarus() -> str:
    parts = [title(24, "LAZARUS · APPRAISAL")]
    steps = [
        ("event", "stimulus arrives", 40),
        ("primary appraisal", "threat · loss · challenge?", 110),
        ("secondary appraisal", "cope? · blame?", 180),
        ("felt pain", "injury · insult · doom", 250),
    ]
    for lab, sub, y in steps:
        parts.append(box(16, y, 328, 44, lab, sub, "pain" if "felt" in lab else "gold"))
        if y < 250:
            parts.append(arrow(180, y + 44, 180, y + 54))
    return svg("\n".join(parts), "Lazarus mobile")


def _pmx_00() -> str:
    parts = [title(24, "WARRANTY · SHIPPED AT BIRTH")]
    parts.append(box(16, 40, 328, 72, "Homo sapiens", "defects: pain · fear · grief · decay · death", "pain"))
    parts.append(box(16, 124, 328, 40, "terms", "repair OK · exit forbidden", "gold"))
    for i, (t, s) in enumerate([
        ("Christianity", "sanctify body · forbid exit"),
        ("Islam", "amanah · forbid self-ownership"),
        ("Secular", "dignity · forbid posthuman"),
    ]):
        parts.append(box(16, 176 + i * 48, 328, 40, t, s, "ink"))
    parts.append(box(16, 328, 328, 40, "repair yes · exit no", tone="pain"))
    return svg("\n".join(parts), "Warranty mobile")


def _pmx_03() -> str:
    parts = [title(24, "GENESIS · DEFECT REPORT")]
    parts.append(box(16, 40, 328, 40, "traditional read", "disobedience → guilt", "dim"))
    parts.append(box(16, 92, 328, 40, "defect read", "vulnerability → mortality", "pain"))
    for lab, y in [("dust → breath → tree", 148), ("eyes open · self-report", 192), ("birth pain · toil · grave", 236)]:
        parts.append(box(16, y, 328, 36, lab, tone="gold"))
    parts.append(box(16, 288, 328, 40, "root cause: design", "not user error", "pain"))
    return svg("\n".join(parts), "Genesis mobile")


def _pmx_04() -> str:
    parts = [title(24, "ORIGINAL SIN · INVERSION")]
    parts.append(box(16, 40, 328, 56, "warranty theology", "creature guilty → redeem", "dim"))
    parts.append(arrow(180, 96, 180, 116))
    parts.append(box(16, 120, 328, 56, "defect report", "design guilty → mandate", "pain"))
    parts.append(box(16, 196, 328, 40, "fault moves upstream ↑", tone="gold"))
    return svg("\n".join(parts), "Original sin mobile")


def _pmx_09() -> str:
    parts = [title(24, "THREE LOCKS · SAME CLAUSE")]
    for i, (name, sacred, repair, exit_) in enumerate([
        ("Christianity", "imago Dei", "medicine · charity", "abandon flesh"),
        ("Islam", "fitra · amanah", "harm removal", "alter creation"),
        ("Secular", "dignity · Factor X", "therapy · rights", "posthuman taboo"),
    ]):
        y = 36 + i * 92
        parts.append(f'    <text x="16" y="{y + 14}" fill="{GOLD}" font-family="{MONO}" font-size="10" font-weight="700">{name}</text>')
        parts.append(box(16, y + 20, 328, 28, sacred, tone="ink"))
        parts.append(box(16, y + 52, 156, 28, f"✓ {repair}", tone="good"))
        parts.append(box(188, y + 52, 156, 28, f"✗ {exit_}", tone="pain"))
    parts.append(box(16, 320, 328, 36, "all three: repair yes · exit no", tone="pain"))
    return svg("\n".join(parts), "Three locks mobile")


def _pmx_05() -> str:
    parts = [title(24, "MANDATE LADDER")]
    allowed = ["pain medicine", "prosthetics · psychiatry", "gene · neural repair"]
    veto = ["affect editing", "synthetic body", "substrate migration"]
    y = 36
    for lab in allowed:
        parts.append(box(16, y, 328, 32, f"✓ {lab}", tone="good"))
        y += 36
    parts.append(f'    <line x1="16" y1="{y + 4}" x2="344" y2="{y + 4}" stroke="{GOLD}" stroke-dasharray="4 3"/>')
    parts.append(f'    <text x="180" y="{y + 20}" fill="{GOLD}" font-family="{MONO}" font-size="9" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>')
    y += 32
    for lab in veto:
        parts.append(box(16, y, 328, 32, f"↗ {lab}", tone="gold"))
        y += 36
    parts.append(box(16, min(y + 8, 440), 328, 36, "all regimes veto here", tone="pain"))
    return svg("\n".join(parts), "Mandate mobile")


def _pmx_11() -> str:
    parts = [title(24, "SUFFERING AUDIT")]
    metrics = [
        ("involuntary pain-hours", "↓ zero", "pain"),
        ("chronic pain prevalence", "20%+", "pain"),
        ("severe mental distress", "970M", "pain"),
        ("access to exit tech", "~0%", "gold"),
    ]
    y = 36
    for lab, val, tone in metrics:
        parts.append(box(16, y, 220, 40, lab, tone=tone))
        parts.append(f'    <text x="260" y="{y + 26}" fill="{PAIN if tone == "pain" else GOLD}" font-family="{MONO}" font-size="16" font-weight="700">{val}</text>')
        y += 48
    parts.append(box(16, y + 8, 328, 40, "abolition target", "not warranty optimization", "gold"))
    return svg("\n".join(parts), "Audit mobile")


MOBILE_PORTRAIT: dict[str, str] = {fid: portrait(fid) for fid in [
    "pmx-00", "fig-neuromatrix", "fig-iasp", "fig-icd11", "fig-mcgill", "fig-price",
    "fig-berridge", "fig-leknes", "fig-baumeister", "fig-rozin", "fig-eisenberger",
    "fig-lazarus", "pmx-03", "pmx-04", "pmx-09", "pmx-05", "pmx-11",
]}
