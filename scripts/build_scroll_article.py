#!/usr/bin/env python3
"""Build scrollable Pain Machines article with animated evidence widgets + brain + compute."""

from __future__ import annotations

from pathlib import Path
import sys

REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO / "scripts"))

from evidence_widgets import CLINICAL, PMX, widget_html  # noqa: E402

OUT = REPO / "content/posts/pain_machines.md"

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
.pm-fig-cap {
  margin: 0;
  padding: .75rem 1rem;
  border-top: 1px solid var(--line);
  font-size: .84rem;
  line-height: 1.5;
  color: var(--muted);
  max-width: none;
}
.pm-evidence {
  border-top: 1px solid var(--line);
  background: var(--panel);
}
.pm-ev-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.85fr);
  gap: 1px;
  background: var(--line);
}
.pm-ev-view {
  position: relative;
  min-height: 340px;
  height: min(480px, 62vw);
  background: radial-gradient(ellipse 85% 75% at 50% 45%, rgba(184,92,85,.08), transparent 62%), #030405;
}
.pm-ev-view canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: grab;
}
.pm-ev-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.pm-ev-label {
  position: absolute;
  left: 0;
  top: 0;
  padding: .2rem .4rem;
  border: 1px solid rgba(235,228,220,.12);
  background: rgba(6,7,8,.85);
  font: 500 .62rem/1.25 ui-monospace, monospace;
  color: var(--muted);
  opacity: 0;
  white-space: nowrap;
}
.pm-ev-label strong { display: block; color: var(--ink); font-size: .68rem; }
.pm-ev-hud {
  position: absolute;
  left: .65rem;
  top: .65rem;
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  z-index: 2;
}
.pm-ev-metric {
  padding: .45rem .55rem;
  border: 1px solid var(--line);
  background: rgba(10,11,13,.88);
}
.pm-ev-metric b {
  display: block;
  font: 500 1.05rem/1 ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
.pm-ev-metric span {
  display: block;
  margin-top: .15rem;
  font-size: .58rem;
  color: var(--dim);
  text-transform: uppercase;
}
.pm-ev-metric.pain b { color: var(--pain); }
.pm-ev-metric.pleasure b { color: var(--pleasure); }
.pm-ev-metric.gold b { color: var(--gold); }
.pm-ev-metric.muted b { color: var(--muted); }
.pm-ev-readout {
  position: absolute;
  left: .65rem;
  right: .65rem;
  bottom: .65rem;
  padding: .45rem .55rem;
  border: 1px solid rgba(235,228,220,.1);
  background: rgba(6,7,8,.88);
  font: 500 .68rem/1.35 ui-monospace, monospace;
  color: var(--muted);
  z-index: 2;
}
.pm-ev-panel {
  padding: .75rem .85rem;
  background: var(--panel);
  display: flex;
  flex-direction: column;
  gap: .55rem;
}
.pm-ev-panel h5 {
  margin: 0;
  font-size: .72rem;
  color: var(--dim);
  text-transform: uppercase;
  letter-spacing: .06em;
}
.pm-ev-prompt {
  margin: 0;
  font: 500 .68rem/1.35 ui-monospace, monospace;
  color: var(--dim);
}
.pm-ev-presets {
  display: flex;
  flex-direction: column;
  gap: .35rem;
}
.pm-ev-preset {
  width: 100%;
  text-align: left;
  border: 1px solid var(--line);
  background: rgba(235,228,220,.02);
  color: var(--muted);
  font: 500 .72rem/1.35 ui-monospace, monospace;
  padding: .55rem .65rem;
  cursor: pointer;
  touch-action: manipulation;
}
.pm-ev-preset:hover { border-color: rgba(235,228,220,.22); color: var(--ink); }
.pm-ev-preset.is-active {
  border-color: rgba(184,154,106,.45);
  background: rgba(184,154,106,.08);
  color: var(--ink);
}
.pm-ev-scrub { margin-top: .35rem; }
.pm-ev-scrub label {
  display: flex;
  justify-content: space-between;
  font: 500 .68rem/1.2 ui-monospace, monospace;
  color: var(--muted);
  margin-bottom: .2rem;
}
.pm-ev-scrub input {
  width: 100%;
  height: 28px;
  accent-color: var(--gold);
  touch-action: manipulation;
}
.pm-ev-lesson {
  margin: .5rem 0 0;
  padding: .55rem .65rem;
  border: 1px solid rgba(184,92,85,.25);
  background: rgba(18,9,9,.55);
  font-size: .78rem;
  line-height: 1.5;
  color: var(--ink);
}
.pm-ev-blurb {
  margin: .35rem 0 0;
  font-size: .78rem;
  line-height: 1.55;
  color: var(--muted);
}
@media (max-width: 720px) {
  .pm-ev-layout { grid-template-columns: 1fr; }
  .pm-ev-view { min-height: 300px; height: 320px; }
  .pm-ev-panel { border-top: 1px solid var(--line); }
  .pm-fig-head { flex-direction: column; align-items: flex-start; gap: .3rem; }
  .pm-fig-head h4 { font-size: .82rem; line-height: 1.35; }
  .pm-fig-cap { font-size: .8rem; line-height: 1.5; }
}
"""


def brain_block() -> str:
    return (REPO / "scripts/pain_machines_brain_snippet.html").read_text()


def compute_block() -> str:
    return (REPO / "scripts/pain_machines_compute_snippet.html").read_text()


def main() -> int:
    css = Path(__file__).with_name("_pain_machines_base.css").read_text(encoding="utf-8")

    clinical_html = "".join(widget_html(w) for w in CLINICAL)
    pmx_ids = ["pmx-00", "pmx-03", "pmx-04", "pmx-09", "pmx-05", "pmx-11"]
    pmx_lookup = {w["id"]: w for w in PMX}

    body = f"""---
author: ["goodalexander"]
title: "Pain Machines"
date: 2026-05-23T20:00:00Z
draft: false
summary: "Humans are pain machines. Original Sin was manufacture, not disobedience. Interactive evidence, 3D brain, state-space math, and the mandate to exit the sacred chassis."
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
{widget_html(pmx_lookup["pmx-00"])}
</section>

<section class="pm-block">
<h2>Clinic</h2>
<p class="pm-point">Doctors already know: pain is not a simple damage meter. Drag each scene — watch the clinical evidence animate.</p>
{clinical_html}
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
{widget_html(pmx_lookup["pmx-03"])}
{widget_html(pmx_lookup["pmx-04"])}
</section>

<section class="pm-block">
<h2>Three locks</h2>
<p class="pm-point">Christianity, Islam, and secular humanism disagree about God. They agree about the body: heal it, never abandon it.</p>
{widget_html(pmx_lookup["pmx-09"])}
</section>

<section class="pm-block">
<h2>Mandate</h2>
<p class="pm-point">Once repair becomes escape, every warranty regime says no. The mandate is lawful exit — without manufacturing new hells.</p>
{widget_html(pmx_lookup["pmx-05"])}
{widget_html(pmx_lookup["pmx-11"])}
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
<script type="module" src="/research/pain_machines/pm-evidence.js?v=2"></script>
<script type="module" src="/research/pain_machines/brain3d.js?v=6"></script>
<script src="/research/pain_machines/pm-compute.js?v=2" defer></script>

</div>
"""

    OUT.write_text(body, encoding="utf-8")
    print(f"Wrote {OUT} ({body.count(chr(10))+1} lines, {body.count('pm-evidence')} evidence widgets)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
