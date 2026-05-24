#!/usr/bin/env python3
"""Build scrollable animation-first Pain Machines article."""

from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "content/posts/pain_machines.md"

VIZ = [
    ("neuromatrix", "Melzack", "The brain assembles pain from signals, memory, stress, and meaning — not just tissue damage."),
    ("iasp", "IASP 2020", "Pain is always sensory and emotional together."),
    ("icd11", "ICD-11", "Chronic pain is its own disease category — the alarm can outlast the injury."),
    ("mcgill", "McGill MPQ", "78 words for pain. Pleasure needs far fewer."),
    ("baumeister", "Baumeister", "Bad events outweigh matched good ones — the scale tips red."),
    ("eisenberger", "Eisenberger", "Social rejection uses the same circuits as bodily hurt."),
]

VIZ2 = [
    ("warranty", "The warranty", "Every culture says: fix the human, never leave the format."),
    ("inversion", "Original Sin", "Standard story blames the user. Defect report blames the design."),
    ("regimes", "Three locks", "Christianity · Islam · secular humanism — repair yes, exit no."),
    ("ladder", "Mandate", "Medicine OK → redesign body → leave biology → AI & new substrate."),
    ("audit", "Abolition metric", "Count involuntary suffering. Target zero."),
]

CSS = r"""
.pm {
  --bg: #040506;
  --panel: #0a0b0d;
  --line: rgba(235, 228, 220, 0.1);
  --ink: #ebe4dc;
  --muted: #8a9199;
  --dim: #555c64;
  --gold: #b89a6a;
  --pain: #b85c55;
  --pleasure: #7a9a8c;
  color: var(--ink);
}
.pm * { box-sizing: border-box; }
.pm-lead {
  margin: 0 0 2rem;
  font-size: 1.05rem;
  line-height: 1.55;
  color: var(--ink);
  max-width: 36ch;
}
.pm-block { margin: 0 0 2.5rem; }
.pm-block h2 {
  margin: 0 0 .5rem;
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--gold);
}
.pm-point {
  margin: 0 0 1rem;
  font-size: .92rem;
  line-height: 1.5;
  color: var(--muted);
  max-width: 42ch;
}
.pm-viz-fig {
  margin: 0 0 1.25rem;
  border: 1px solid var(--line);
  background: var(--panel);
  overflow: hidden;
}
.pm-viz-wrap {
  width: 100%;
  min-height: 220px;
  background: var(--bg);
  position: relative;
}
@media (max-width: 720px) { .pm-viz-wrap { min-height: 260px; } }
.pm-viz-wrap canvas.pm-viz {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.pm-viz-cap {
  margin: 0;
  padding: .65rem .85rem;
  border-top: 1px solid var(--line);
  font-size: .8rem;
  line-height: 1.45;
  color: var(--muted);
}
.pm-viz-cap cite {
  display: block;
  margin-top: .25rem;
  font: 500 .62rem/1 ui-monospace, monospace;
  font-style: normal;
  color: var(--dim);
  letter-spacing: .04em;
}
.pm-compute {
  margin: 1rem 0 0;
  border: 1px solid var(--line);
  background: var(--panel);
}
.pm-compute-head {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem 1rem;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  border-bottom: 1px solid var(--line);
}
.pm-compute-head strong {
  font: 500 .82rem/1 ui-monospace, monospace;
  color: var(--ink);
}
.pm-profile { display: flex; gap: .35rem; flex-wrap: wrap; }
.pm-profile button {
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  font: 500 .75rem/1 ui-monospace, monospace;
  padding: .4rem .65rem;
  cursor: pointer;
  min-height: 36px;
  touch-action: manipulation;
}
.pm-profile button.is-active {
  border-color: rgba(235, 228, 220, .28);
  color: var(--ink);
  background: rgba(235, 228, 220, .04);
}
.pm-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border-bottom: 1px solid var(--line);
}
.pm-metric { padding: .85rem 1rem; background: var(--panel); }
.pm-metric b {
  display: block;
  font: 500 1.35rem/1.1 ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
.pm-metric span {
  display: block;
  margin-top: .25rem;
  font-size: .72rem;
  color: var(--dim);
}
.pm-metric.p b { color: var(--pleasure); }
.pm-metric.n b { color: var(--pain); }
.pm-metric.r b { color: var(--gold); }
.pm-chart { padding: .5rem .75rem 1rem; min-height: 280px; }
.pm-chart + .pm-chart { border-top: 1px solid var(--line); }
.pm-chart-cap {
  padding: .75rem 1rem 0;
  font-size: .72rem;
  color: var(--dim);
  text-transform: uppercase;
  letter-spacing: .04em;
}
.pm-fig-brain {
  margin: 1rem 0 0;
  border: 1px solid var(--line);
  background: var(--panel);
  overflow: hidden;
}
.pm-brain3d { background: #060708; }
.pm-brain3d-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.85fr);
  gap: 1px;
  background: var(--line);
}
.pm-brain3d-view {
  position: relative;
  height: min(520px, 70vh);
  min-height: 320px;
  background: radial-gradient(ellipse 85% 75% at 50% 45%, rgba(184,92,85,.09), transparent 62%), #030405;
}
.pm-brain3d-view canvas { display: block; width: 100%; height: 100%; touch-action: none; cursor: grab; }
.pm-brain3d-labels { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.pm-b3d-label {
  position: absolute;
  padding: .2rem .4rem;
  border: 1px solid rgba(235,228,220,.12);
  background: rgba(6,7,8,.82);
  font: 500 .62rem/1.25 ui-monospace, monospace;
  color: var(--muted);
  opacity: 0;
}
.pm-b3d-label strong { display: block; color: var(--ink); font-size: .68rem; }
.pm-brain3d-hud {
  position: absolute; left: .65rem; top: .65rem;
  display: flex; flex-wrap: wrap; gap: .45rem; z-index: 2;
}
.pm-brain3d-metric {
  padding: .45rem .55rem;
  border: 1px solid var(--line);
  background: rgba(10,11,13,.88);
}
.pm-brain3d-metric b { display: block; font: 500 1.05rem/1 ui-monospace, monospace; }
.pm-brain3d-metric span { display: block; margin-top: .15rem; font-size: .58rem; color: var(--dim); text-transform: uppercase; }
.pm-brain3d-metric.n b { color: var(--pain); }
.pm-brain3d-metric.p b { color: var(--pleasure); }
.pm-brain3d-metric.r b { color: var(--gold); }
.pm-b3d-compare {
  position: absolute; right: .65rem; top: .65rem;
  width: min(220px, 42%); padding: .6rem .65rem;
  border: 1px solid var(--line); background: rgba(6,7,8,.92); z-index: 3;
}
.pm-b3d-compare-title { font: 600 .62rem/1 ui-monospace, monospace; color: var(--dim); text-transform: uppercase; margin-bottom: .5rem; }
.pm-b3d-compare-row { margin-bottom: .5rem; }
.pm-b3d-compare-row span { display: block; font: 500 .62rem/1 ui-monospace, monospace; color: var(--muted); margin-bottom: .2rem; }
.pm-b3d-compare-row.pain span { color: var(--pain); }
.pm-b3d-compare-row.pleasure span { color: var(--pleasure); }
.pm-b3d-compare-row .track { height: 10px; background: rgba(235,228,220,.06); border: 1px solid rgba(235,228,220,.08); overflow: hidden; }
.pm-b3d-compare-row.pain .fill { height: 100%; background: linear-gradient(90deg, #7a3530, var(--pain)); }
.pm-b3d-compare-row.pleasure .fill { height: 100%; background: linear-gradient(90deg, #4a6a60, var(--pleasure)); min-width: 6px; }
.pm-b3d-compare-row b { font: 500 .68rem/1 ui-monospace, monospace; color: var(--ink); }
.pm-b3d-compare-ratio { padding-top: .45rem; border-top: 1px solid rgba(235,228,220,.08); font: 600 .72rem/1.2 ui-monospace, monospace; color: var(--gold); }
.pm-b3d-callout {
  position: absolute; padding: .35rem .55rem; border: 1px solid;
  font: 600 .68rem/1.25 ui-monospace, monospace; pointer-events: none; z-index: 2;
}
.pm-b3d-callout.pain { color: var(--pain); border-color: rgba(184,92,85,.45); background: rgba(18,9,9,.88); }
.pm-b3d-callout.pleasure { color: var(--pleasure); border-color: rgba(122,154,140,.45); background: rgba(10,14,12,.88); }
.pm-b3d-callout small { display: block; margin-top: .15rem; font-size: .58rem; font-weight: 500; }
.pm-brain3d-controls { padding: .75rem .85rem; background: var(--panel); display: flex; flex-direction: column; gap: .55rem; }
.pm-brain3d-controls h5 { margin: 0; font-size: .72rem; color: var(--dim); text-transform: uppercase; letter-spacing: .06em; }
.pm-b3d-slider label { display: flex; justify-content: space-between; font: 500 .68rem/1.2 ui-monospace, monospace; color: var(--muted); margin-bottom: .2rem; }
.pm-b3d-slider input { width: 100%; height: 28px; accent-color: var(--gold); touch-action: manipulation; }
.pm-b3d-slider.pain input { accent-color: var(--pain); }
.pm-b3d-slider.pleasure input { accent-color: var(--pleasure); }
.pm-brain-legend {
  display: flex; flex-wrap: wrap; gap: .5rem 1rem;
  padding: .65rem .85rem; border-top: 1px solid var(--line);
  font: 500 .62rem/1.35 ui-monospace, monospace; color: var(--dim);
}
.pm-brain-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; font-style: normal; }
.pm-brain-legend .p-som { background: #b85c55; }
.pm-brain-legend .p-aff { background: #b89a6a; }
.pm-brain-legend .p-cog { background: #9a7b6a; }
.pm-brain-legend .p-soc { background: #8a9199; }
.pm-brain-legend .p-ple { background: #7a9a8c; }
.pm-triad {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 1rem 0 0;
  background: var(--line);
  border: 1px solid var(--line);
}
.pm-triad-cell {
  padding: .75rem .65rem;
  background: var(--panel);
  font-size: .78rem;
  line-height: 1.45;
  color: var(--muted);
}
.pm-triad-cell strong {
  display: block;
  margin-bottom: .35rem;
  font-size: .68rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--gold);
}
.pm-src-links {
  margin: 2rem 0 0;
  padding: 1rem 0 0;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: .35rem .75rem;
  font-size: .72rem;
}
.pm-src-links a { color: var(--dim); text-decoration: none; }
.pm-src-links a:hover { color: var(--gold); }
@media (max-width: 720px) {
  .pm-brain3d-layout { grid-template-columns: 1fr; }
  .pm-brain3d-view { min-height: 360px; height: 360px; }
  .pm-metrics { grid-template-columns: 1fr; }
  .pm-triad { grid-template-columns: 1fr; }
  .pm-b3d-compare { width: min(200px, 88%); right: auto; left: .65rem; top: auto; bottom: 3rem; }
}
"""

BRAIN = r"""
<div class="pm-fig-brain" id="fig-brain">
  <div class="pm-brain3d" id="pm-brain3d">
    <div class="pm-brain3d-layout">
      <div class="pm-brain3d-view" id="pm-brain3d-canvas-wrap">
        <canvas id="pm-brain3d-canvas"></canvas>
        <div class="pm-brain3d-labels" aria-hidden="true"></div>
        <div class="pm-brain3d-hud">
          <div class="pm-brain3d-metric n"><b id="pm-b3d-pain">—</b><span>pain states</span></div>
          <div class="pm-brain3d-metric p"><b id="pm-b3d-pleasure">—</b><span>pleasure</span></div>
          <div class="pm-brain3d-metric r"><b id="pm-b3d-ratio">—</b><span>log₁₀ ratio</span></div>
        </div>
        <div class="pm-b3d-compare" id="pm-b3d-compare">
          <div class="pm-b3d-compare-title">footprint</div>
          <div class="pm-b3d-compare-row pain">
            <span>pain network</span>
            <div class="track"><div class="fill" id="pm-b3d-pain-bar"></div></div>
            <b id="pm-b3d-pain-bar-label">—</b>
          </div>
          <div class="pm-b3d-compare-row pleasure">
            <span>pleasure cluster</span>
            <div class="track"><div class="fill" id="pm-b3d-pleasure-bar"></div></div>
            <b id="pm-b3d-pleasure-bar-label">—</b>
          </div>
          <div class="pm-b3d-compare-ratio" id="pm-b3d-compare-ratio">—</div>
        </div>
        <div class="pm-b3d-callout pain" id="pm-b3d-callout-pain">PAIN NETWORK<small>sprawls</small></div>
        <div class="pm-b3d-callout pleasure" id="pm-b3d-callout-pleasure">PLEASURE POD<small>clusters</small></div>
      </div>
      <div class="pm-brain3d-controls">
        <h5>Pathway sliders</h5>
        <div class="pm-b3d-slider pain">
          <label>somatic <b data-slider-val="somatic">72</b></label>
          <input type="range" min="0" max="100" value="72" data-slider="somatic">
        </div>
        <div class="pm-b3d-slider pain">
          <label>sensory <b data-slider-val="sensory">85</b></label>
          <input type="range" min="0" max="100" value="85" data-slider="sensory">
        </div>
        <div class="pm-b3d-slider pain">
          <label>affective <b data-slider-val="affective">88</b></label>
          <input type="range" min="0" max="100" value="88" data-slider="affective">
        </div>
        <div class="pm-b3d-slider pain">
          <label>social <b data-slider-val="social">55</b></label>
          <input type="range" min="0" max="100" value="55" data-slider="social">
        </div>
        <div class="pm-b3d-slider pain">
          <label>memory <b data-slider-val="cognitive">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="cognitive">
        </div>
        <div class="pm-b3d-slider pleasure">
          <label>pleasure <b data-slider-val="pleasure">42</b></label>
          <input type="range" min="0" max="100" value="42" data-slider="pleasure">
        </div>
        <div class="pm-b3d-slider pleasure">
          <label>drugs collapse joy <b data-slider-val="pharma">35</b></label>
          <input type="range" min="0" max="100" value="35" data-slider="pharma">
        </div>
      </div>
    </div>
  </div>
  <div class="pm-brain-legend" aria-hidden="true">
    <span><i class="p-som"></i> sensory</span>
    <span><i class="p-aff"></i> affective</span>
    <span><i class="p-cog"></i> memory</span>
    <span><i class="p-soc"></i> social</span>
    <span><i class="p-ple"></i> pleasure</span>
  </div>
</div>
"""

COMPUTE = r"""
<div class="pm-compute" id="pm-compute">
  <div class="pm-compute-head">
    <strong>pain_machines_state_space_v1</strong>
    <div class="pm-profile" role="tablist">
      <button type="button" data-profile="conservative">low</button>
      <button type="button" data-profile="central" class="is-active">central</button>
      <button type="button" data-profile="liberal">high</button>
    </div>
  </div>
  <div class="pm-metrics">
    <div class="pm-metric p"><b id="pm-p-eff">—</b><span>pleasure states</span></div>
    <div class="pm-metric n"><b id="pm-n-states">—</b><span>pain states</span></div>
    <div class="pm-metric r"><b id="pm-log10">—</b><span>orders of magnitude</span></div>
  </div>
  <div class="pm-chart-cap">Green line collapses · red line keeps climbing</div>
  <div class="pm-chart" id="pm-chart"></div>
  <div class="pm-chart-cap">78 pain words vs ~11 drug families</div>
  <div class="pm-chart" id="pm-chart-inventory"></div>
</div>
"""


def viz_fig(viz: str, cite: str, cap: str) -> str:
    return f"""<figure class="pm-viz-fig">
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="{viz}"></canvas></div>
  <figcaption class="pm-viz-cap">{cap}<cite>{cite}</cite></figcaption>
</figure>"""


def main() -> int:
    parts = [
        """---
author: ["goodalexander"]
title: "Pain Machines"
date: 2026-05-23T20:00:00Z
draft: false
summary: "Humans are pain machines. Original Sin was manufacture, not disobedience. Scroll the proof: clinic, brain map, state-space math, and the mandate to exit the sacred chassis."
categories: ["philosophy"]
tags: ["post fiat", "philosophy", "long-form"]
ShowToc: false
---

<style>""",
        CSS,
        """</style>
<div class="pm" id="pain-machines">

# Pain Machines

<p class="pm-lead">You were built to hurt more than you were built to enjoy. The first cry is a product warning, not proof the product is good.</p>

<section class="pm-block">
<h2>Thesis</h2>
<p class="pm-point">Original Sin was not eating a fruit. It was manufacturing conscious life inside a pain machine — then blaming the user.</p>
""",
        viz_fig("warranty", "Warranty metaphor", "Repair is mercy. Exit is sacrilege. That clause ships before you can consent."),
        """</section>

<section class="pm-block">
<h2>Clinic</h2>
<p class="pm-point">Doctors already know: pain is not a simple damage meter. It spreads through body, mood, memory, and identity.</p>
""",
    ]
    for viz, cite, cap in VIZ:
        parts.append(viz_fig(viz, cite, cap))
    parts.append("""</section>

<section class="pm-block">
<h2>Brain map</h2>
<p class="pm-point">Drag the 3D brain. Red routes sprawl. Green routes cluster. Move the sliders — watch pain states outrun pleasure.</p>
""")
    parts.append(BRAIN)
    parts.append("""</section>

<section class="pm-block">
<h2>Count it</h2>
<p class="pm-point">A dumb calculator, no theology: multiply how many distinct pain states vs pleasure states the spec allows. Switch profiles — the direction never flips.</p>
""")
    parts.append(COMPUTE)
    parts.append("""</section>

<section class="pm-block">
<h2>Genesis as QA report</h2>
<p class="pm-point">Read Genesis 2–3 as a defect table: birth pain, toil, mortality — hardware bugs, not a moral invoice for one apple.</p>
""")
    parts.append(viz_fig("inversion", "Defect read", "Warranty theology sends guilt downstream. The defect report sends it to the design."))
    parts.append("""</section>

<section class="pm-block">
<h2>Three locks</h2>
<p class="pm-point">Christianity, Islam, and secular humanism disagree about God. They agree about the body: heal it, never abandon it.</p>
<div class="pm-triad">
  <div class="pm-triad-cell"><strong>Christianity</strong> Sacred body · medicine OK · leaving flesh = sin</div>
  <div class="pm-triad-cell"><strong>Islam</strong> Body is trust (amanah) · repair OK · self-redesign = breach</div>
  <div class="pm-triad-cell"><strong>Secular</strong> Human dignity · therapy OK · posthuman = taboo</div>
</div>
""")
    parts.append(viz_fig("regimes", "Convergence", "Different heavens. Same lock: repair yes, exit no."))
    parts.append("""</section>

<section class="pm-block">
<h2>Mandate</h2>
<p class="pm-point">Once repair becomes escape, every warranty regime says no. The mandate is lawful exit: AI, new bodies, new substrate — without manufacturing new hells.</p>
""")
    for viz, cite, cap in VIZ2[3:]:
        parts.append(viz_fig(viz, cite, cap))
    parts.append("""</section>

<nav class="pm-src-links" aria-label="Sources">
  <a href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack 2001</a>
  <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja IASP 2020</a>
  <a href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede ICD-11</a>
  <a href="/research/pain_machines/model.py">model.py</a>
  <a href="/research/pain_machines/SOURCES.md">Full sources</a>
</nav>

<script type="application/json" id="pm-spec">{
  "profiles": {
    "conservative": {"pleasure_intensity":3,"pleasure_duration":3,"pleasure_modality":4,"pain_mechanism":4,"pain_location":8,"pain_appraisal":4,"pain_social":3,"pain_temporal":3,"pain_identity":3,"pain_agency":3,"pain_episodic":4},
    "central": {"pleasure_intensity":5,"pleasure_duration":4,"pleasure_modality":6,"pain_mechanism":6,"pain_location":12,"pain_appraisal":5,"pain_social":4,"pain_temporal":4,"pain_identity":4,"pain_agency":4,"pain_episodic":6},
    "liberal": {"pleasure_intensity":7,"pleasure_duration":5,"pleasure_modality":8,"pain_mechanism":8,"pain_location":16,"pain_appraisal":6,"pain_social":5,"pain_temporal":5,"pain_identity":5,"pain_agency":5,"pain_episodic":8}
  },
  "modalityToReceptor": {"0":"dopaminergic","1":"dopaminergic","2":"opioidergic","3":"oxytocinergic","4":"mixed","5":"opioidergic","6":"dopaminergic","7":"mixed"}
}</script>

<script type="importmap">{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}</script>
<script type="module" src="/research/pain_machines/brain3d.js?v=5"></script>
<script src="/research/pain_machines/pm-viz.js?v=5" defer></script>
<script src="/research/pain_machines/pm-compute.js?v=1" defer></script>

</div>
""")

    OUT.write_text("".join(parts), encoding="utf-8")
    lines = OUT.read_text().count("\n") + 1
    print(f"Wrote {OUT} ({lines} lines)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
