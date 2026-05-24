#!/usr/bin/env python3
"""Build scrollable Pain Machines article with evidence SVGs + brain + compute."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))

from inject_mobile_figures import inject_stacks  # noqa: E402
from restore_evidence_figures import (  # noqa: E402
    PMX_BUILDERS,
    extract_figure,
    git_source,
    make_unique_ids,
)

OUT = REPO / "content/posts/pain_machines.md"
SOURCE_REV = "e26d71e"

CLINICAL = [
    ("fig-neuromatrix", "Melzack broke the courtroom model: the brain builds pain from signal, map, memory, stress, and expectation."),
    ("fig-iasp", "Official medicine: pain is always sensory and emotional — not a tissue meter alone."),
    ("fig-icd11", "ICD-11 makes chronic pain a disease category. The alarm can outlive the fire."),
    ("fig-mcgill", "78 pain descriptors in clinical use. Pleasure shares far fewer words."),
    ("fig-price", "Intensity and unpleasantness can separate — one injury, multiple ledgers."),
    ("fig-berridge", "Wanting ≠ liking. Pleasure clusters; pursuit can run without joy."),
    ("fig-leknes", "Relief is pleasure with a history of threat — green borrows from red."),
    ("fig-baumeister", "Bad events outweigh matched good ones. Harm writes in heavier ink."),
    ("fig-rozin", "Bad spreads to neighbors and meaning. Good stays local."),
    ("fig-eisenberger", "Social exclusion recruits the same circuits as bodily hurt."),
    ("fig-lazarus", "Appraisal transforms the event: threat, blame, and coping change the felt blow."),
]

PMX_SECTIONS = [
    ("pmx-00", "thesis"),
    ("pmx-03", "genesis"),
    ("pmx-04", "genesis"),
    ("pmx-09", "locks"),
    ("pmx-05", "mandate"),
    ("pmx-11", "mandate"),
]

FIG_CSS = """
.pm-fig {
  margin: 0 0 1.25rem;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, #0a0b0d 0%, #060708 100%);
  overflow: hidden;
}
.pm-fig-head {
  display: flex;
  flex-wrap: wrap;
  gap: .45rem .75rem;
  align-items: baseline;
  justify-content: space-between;
  padding: .7rem .85rem;
  border-bottom: 1px solid var(--line);
}
.pm-fig-n {
  font: 600 .68rem/1 ui-monospace, monospace;
  color: var(--gold);
  letter-spacing: .06em;
}
.pm-fig-head h4 {
  margin: 0;
  flex: 1 1 12rem;
  font-size: .88rem;
  font-weight: 500;
  color: var(--ink);
}
.pm-cite {
  font: 500 .68rem/1 ui-monospace, monospace;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px solid rgba(235, 228, 220, .16);
}
.pm-fig-evidence svg {
  display: block;
  width: 100%;
  height: auto;
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
@media (prefers-reduced-motion: reduce) {
  .pm-fig svg animateMotion, .pm-fig svg animate, .pm-fig svg animateTransform { display: none; }
}
"""

BASE_CSS = open(REPO / "scripts/build_scroll_article_css.txt").read() if (REPO / "scripts/build_scroll_article_css.txt").exists() else ""


def fix_svg_blank_lines(html: str) -> str:
    def fix(m: re.Match) -> str:
        block = m.group(0)
        open_end = block.index(">") + 1
        close_start = block.rindex("</svg>")
        head, body, tail = block[:open_end], block[open_end:close_start], block[close_start:]
        body = "\n".join(line for line in body.splitlines() if line.strip())
        return head + body + tail

    return re.sub(r"<svg\b[^>]*>.*?</svg>", fix, html, flags=re.S)


def prepare_clinical(source: str, fid: str, idx: int, caption: str) -> str:
    block = extract_figure(source, fid)
    if not block:
        raise SystemExit(f"Missing clinical figure {fid} in {SOURCE_REV}")
    block = block.replace('class="pm-fig"', 'class="pm-fig pm-fig-evidence"', 1)
    block = re.sub(r"\s*<p class=['\"]pm-after\">.*?</p>\s*", "\n", block, flags=re.S)
    if "pm-fig-cap" not in block:
        block = block.replace("</figure>", f'\n  <p class="pm-fig-cap">{caption}</p>\n</figure>')
    block = make_unique_ids(block, f"pm{idx}")
    return fix_svg_blank_lines(block)


def prepare_pmx(fid: str) -> str:
    html = PMX_BUILDERS[fid]()
    return fix_svg_blank_lines(html)


def brain_block() -> str:
    return (REPO / "scripts/pain_machines_brain_snippet.html").read_text()


def compute_block() -> str:
    return (REPO / "scripts/pain_machines_compute_snippet.html").read_text()


def main() -> int:
    source = git_source()
    idx = 0
    clinical_html = {}
    for fid, cap in CLINICAL:
        clinical_html[fid] = prepare_clinical(source, fid, idx, cap)
        idx += 1

    pmx_html = {fid: prepare_pmx(fid) for fid, _ in PMX_SECTIONS}

    css = Path(__file__).with_name("_pain_machines_base.css").read_text(encoding="utf-8")

    body = f"""---
author: ["goodalexander"]
title: "Pain Machines"
date: 2026-05-23T20:00:00Z
draft: false
summary: "Humans are pain machines. Original Sin was manufacture, not disobedience. Evidence diagrams, 3D brain, state-space math, and the mandate to exit the sacred chassis."
categories: ["philosophy"]
tags: ["post fiat", "philosophy", "long-form"]
ShowToc: false
---

<style>
{css}
{FIG_CSS}
</style>
<div class="pm" id="pain-machines">

# Pain Machines

<p class="pm-lead">You were built to hurt more than you were built to enjoy. The first cry is a product warning, not proof the product is good.</p>

<section class="pm-block">
<h2>Thesis</h2>
<p class="pm-point">Original Sin was not eating a fruit. It was manufacturing conscious life inside a pain machine — then blaming the user.</p>
{pmx_html["pmx-00"]}
</section>

<section class="pm-block">
<h2>Clinic</h2>
<p class="pm-point">Doctors already know: pain is not a simple damage meter. It spreads through body, mood, memory, and identity.</p>
{"".join(clinical_html[fid] for fid, _ in CLINICAL)}
</section>

<section class="pm-block">
<h2>Brain map</h2>
<p class="pm-point">Drag the 3D brain. Red routes sprawl. Green routes cluster. Move the sliders — watch pain states outrun pleasure.</p>
{brain_block()}
</section>

<section class="pm-block">
<h2>Count it</h2>
<p class="pm-point">Multiply distinct pain states vs pleasure states the spec allows. Switch profiles — the direction never flips.</p>
{compute_block()}
</section>

<section class="pm-block">
<h2>Genesis as QA report</h2>
<p class="pm-point">Read Genesis 2–3 as a defect table: birth pain, toil, mortality — hardware bugs, not a moral invoice for one apple.</p>
{pmx_html["pmx-03"]}
{pmx_html["pmx-04"]}
</section>

<section class="pm-block">
<h2>Three locks</h2>
<p class="pm-point">Christianity, Islam, and secular humanism disagree about God. They agree about the body: heal it, never abandon it.</p>
{pmx_html["pmx-09"]}
</section>

<section class="pm-block">
<h2>Mandate</h2>
<p class="pm-point">Once repair becomes escape, every warranty regime says no. The mandate is lawful exit — without manufacturing new hells.</p>
{pmx_html["pmx-05"]}
{pmx_html["pmx-11"]}
</section>

<nav class="pm-src-links" aria-label="Sources">
  <a href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack 2001</a>
  <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja IASP 2020</a>
  <a href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede ICD-11</a>
  <a href="/research/pain_machines/model.py">model.py</a>
  <a href="/research/pain_machines/SOURCES.md">Full sources</a>
</nav>

<script type="application/json" id="pm-spec">{{
  "profiles": {{
    "conservative": {{"pleasure_intensity":3,"pleasure_duration":3,"pleasure_modality":4,"pain_mechanism":4,"pain_location":8,"pain_appraisal":4,"pain_social":3,"pain_temporal":3,"pain_identity":3,"pain_agency":3,"pain_episodic":4}},
    "central": {{"pleasure_intensity":5,"pleasure_duration":4,"pleasure_modality":6,"pain_mechanism":6,"pain_location":12,"pain_appraisal":5,"pain_social":4,"pain_temporal":4,"pain_identity":4,"pain_agency":4,"pain_episodic":6}},
    "liberal": {{"pleasure_intensity":7,"pleasure_duration":5,"pleasure_modality":8,"pain_mechanism":8,"pain_location":16,"pain_appraisal":6,"pain_social":5,"pain_temporal":5,"pain_identity":5,"pain_agency":5,"pain_episodic":8}}
  }},
  "modalityToReceptor": {{"0":"dopaminergic","1":"dopaminergic","2":"opioidergic","3":"oxytocinergic","4":"mixed","5":"opioidergic","6":"dopaminergic","7":"mixed"}}
}}</script>

<script type="importmap">{{
  "imports": {{
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }}
}}</script>
<script type="module" src="/research/pain_machines/brain3d.js?v=6"></script>
<script src="/research/pain_machines/pm-compute.js?v=2" defer></script>

</div>
"""

    article = inject_stacks(body)

    OUT.write_text(article, encoding="utf-8")
    print(f"Wrote {OUT} ({article.count(chr(10))+1} lines, {article.count('<svg')} SVGs)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
