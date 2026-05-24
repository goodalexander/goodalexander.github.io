---
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
@media (max-width: 720px) {
  .pm { overflow-x: hidden; max-width: 100%; }
  .pm-lead, .pm-point { max-width: none; }
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
  .pm-b3d-compare { width: min(200px, 88%); right: auto; left: .65rem; top: auto; bottom: 3rem; }
}


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
.pm-ev-controls { display: flex; flex-direction: column; gap: .5rem; }
.pm-ev-slider label {
  display: flex;
  justify-content: space-between;
  font: 500 .68rem/1.2 ui-monospace, monospace;
  color: var(--muted);
  margin-bottom: .2rem;
}
.pm-ev-slider input {
  width: 100%;
  height: 28px;
  accent-color: var(--gold);
  touch-action: manipulation;
}
.pm-ev-slider.pain input { accent-color: var(--pain); }
.pm-ev-slider.pleasure input { accent-color: var(--pleasure); }
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

</style>
<div class="pm" id="pain-machines">

# Pain Machines

<p class="pm-lead">You were built to hurt more than you were built to enjoy. The first cry is a product warning, not proof the product is good.</p>

<section class="pm-block">
<h2>Thesis</h2>
<p class="pm-point">Original Sin was not eating a fruit. It was manufacturing conscious life inside a pain machine — then blaming the user.</p>
<figure class="pm-fig pm-fig-evidence" id="pmx-00">
  <div class="pm-fig-head">
    <span class="pm-fig-n">W0</span>
    <h4>The warranty card in the crib</h4>
  </div>
  <div class="pm-evidence" data-scene="pmx-00">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="locks">—</b><span>exit locks</span></div>
          <div class="pm-ev-metric gold"><b data-m="regimes">—</b><span>aligned regimes</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>defect severity <b data-slider-val="defects">85</b></label>
          <input type="range" min="0" max="100" value="85" data-slider="defects">
        </div>
        <div class="pm-ev-slider gold">
          <label>repair mandate <b data-slider-val="repair">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="repair">
        </div>
        </div>
        <p class="pm-ev-blurb">Homo sapiens ships with known defects — pain, fear, grief, decay, death — and no consent form. Christian, Islamic, and secular regimes disagree on metaphysics but converge on the clause: repair the chassis, never abandon it.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Every civilization assigns repair rights and forbids exit from the inherited human format before consent is possible.</p>
</figure>
</section>

<section class="pm-block">
<h2>Clinic</h2>
<p class="pm-point">Doctors already know: pain is not a simple damage meter. Drag each scene — watch the clinical evidence animate.</p>
<figure class="pm-fig pm-fig-evidence" id="fig-neuromatrix">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1a</span>
    <h4>Neuromatrix: pain generated by the whole brain</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack 2001</a>
  </div>
  <div class="pm-evidence" data-scene="fig-neuromatrix">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="output">—</b><span>pain output</span></div>
          <div class="pm-ev-metric gold"><b data-m="inputs">—</b><span>active inputs</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>somatic input <b data-slider-val="somatic">55</b></label>
          <input type="range" min="0" max="100" value="55" data-slider="somatic">
        </div>
        <div class="pm-ev-slider pain">
          <label>memory load <b data-slider-val="memory">72</b></label>
          <input type="range" min="0" max="100" value="72" data-slider="memory">
        </div>
        <div class="pm-ev-slider pain">
          <label>stress gate <b data-slider-val="stress">68</b></label>
          <input type="range" min="0" max="100" value="68" data-slider="stress">
        </div>
        </div>
        <p class="pm-ev-blurb">Melzack&#x27;s neuromatrix theory treats pain as a distributed output pattern — not a faithful meter of tissue damage. Somatic input is one contributor among memory traces, stress gates, and appraisal. Phantom-limb pain is the proof case: the map persists after the limb is gone.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Melzack broke the courtroom model: the brain builds pain from signal, map, memory, stress, and expectation.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-iasp">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1b</span>
    <h4>IASP 2020: sensory and emotional are inseparable</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja et al. 2020</a>
  </div>
  <div class="pm-evidence" data-scene="fig-iasp">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="fusion">—</b><span>fused intensity</span></div>
          <div class="pm-ev-metric gold"><b data-m="ratio">—</b><span>sensory/affect</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>sensory channel <b data-slider-val="sensory">80</b></label>
          <input type="range" min="0" max="100" value="80" data-slider="sensory">
        </div>
        <div class="pm-ev-slider gold">
          <label>emotional channel <b data-slider-val="affective">75</b></label>
          <input type="range" min="0" max="100" value="75" data-slider="affective">
        </div>
        </div>
        <p class="pm-ev-blurb">The 2020 IASP revision defines pain as &quot;an unpleasant sensory and emotional experience.&quot; Clinicians cannot strip the affective channel without losing the diagnosis. Body-signal and emotion are co-primary, not optional add-ons.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Official medicine: pain is always sensory and emotional — not a tissue meter alone.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-icd11">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1c</span>
    <h4>ICD-11 MG30: seven chronic-pain categories, nested subtypes</h4>
    <a class="pm-cite" href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede et al. 2022</a>
  </div>
  <div class="pm-evidence" data-scene="fig-icd11">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="branches">—</b><span>active categories</span></div>
          <div class="pm-ev-metric gold"><b data-m="lag">—</b><span>alarm lag (mo)</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>initial injury <b data-slider-val="injury">90</b></label>
          <input type="range" min="0" max="100" value="90" data-slider="injury">
        </div>
        <div class="pm-ev-slider gold">
          <label>alarm persistence <b data-slider-val="persistence">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="persistence">
        </div>
        </div>
        <p class="pm-ev-blurb">ICD-11 lists seven chronic primary and secondary pain categories with nested subtypes. The taxonomy exists because alarms persist after injuries heal — chronic pain is classified as its own disease process, not merely a symptom timer.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">ICD-11 makes chronic pain a disease category. The alarm can outlive the fire.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-mcgill">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1d</span>
    <h4>McGill MPQ: 78 words because pain factorizes in language</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/1235985/">Melzack 1975</a>
  </div>
  <div class="pm-evidence" data-scene="fig-mcgill">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric gold"><b data-m="ratio">—</b><span>word ratio</span></div>
          <div class="pm-ev-metric pain"><b data-m="density">—</b><span>pain density</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>pain descriptors <b data-slider-val="pain_lex">78</b></label>
          <input type="range" min="20" max="78" value="78" data-slider="pain_lex">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>pleasure descriptors <b data-slider-val="pleas_lex">12</b></label>
          <input type="range" min="4" max="24" value="12" data-slider="pleas_lex">
        </div>
        </div>
        <p class="pm-ev-blurb">The McGill Pain Questionnaire carries 78 descriptor words across sensory, affective, evaluative, and miscellaneous domains. Language factorizes pain into many axes; pleasure vocabulary stays sparse — a lexical asymmetry clinicians already encode.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">78 pain descriptors in clinical use. Pleasure shares far fewer words.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-price">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1e</span>
    <h4>Price: sensation, unpleasantness, and secondary affect dissociate</h4>
    <a class="pm-cite" href="https://doi.org/10.1126/science.288.5472.1769">Price 2000</a>
  </div>
  <div class="pm-evidence" data-scene="fig-price">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="layers">—</b><span>active layers</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="pleasure">—</b><span>pleasure band</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>sensory intensity <b data-slider-val="intensity">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="intensity">
        </div>
        <div class="pm-ev-slider pain">
          <label>unpleasantness <b data-slider-val="unpleasant">85</b></label>
          <input type="range" min="0" max="100" value="85" data-slider="unpleasant">
        </div>
        <div class="pm-ev-slider gold">
          <label>secondary affect <b data-slider-val="secondary">60</b></label>
          <input type="range" min="0" max="100" value="60" data-slider="secondary">
        </div>
        </div>
        <p class="pm-ev-blurb">Price&#x27;s psychophysical work separates sensory intensity, unpleasantness, and secondary affect into partially independent dimensions. One stimulus can climb one ledger while another stays flat — evidence against a single pain dial.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Intensity and unpleasantness can separate — one injury, multiple ledgers.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-berridge">
  <div class="pm-fig-head">
    <span class="pm-fig-n">2a</span>
    <h4>Berridge: small “liking” hotspots, sprawling “wanting” system</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/">Berridge &amp; Kringelbach 2015</a>
  </div>
  <div class="pm-evidence" data-scene="fig-berridge">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric gold"><b data-m="orbit">—</b><span>wanting radius</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="cluster">—</b><span>liking cluster</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider gold">
          <label>wanting drive <b data-slider-val="wanting">78</b></label>
          <input type="range" min="0" max="100" value="78" data-slider="wanting">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>liking hotspots <b data-slider-val="liking">35</b></label>
          <input type="range" min="0" max="100" value="35" data-slider="liking">
        </div>
        </div>
        <p class="pm-ev-blurb">Berridge distinguishes hedonic &quot;liking&quot; (tight opioid hotspots in NAc shell and VP) from dopaminergic &quot;wanting&quot; that sprawls across mesolimbic circuitry. Addiction often decouples pursuit from felt joy — more runway for compulsion than for pleasure.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Wanting ≠ liking. Pleasure clusters; pursuit can run without joy.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-leknes">
  <div class="pm-fig-head">
    <span class="pm-fig-n">2b</span>
    <h4>Leknes &amp; Tracey: shared opioid/dopamine substrate — substitutability</h4>
    <a class="pm-cite" href="https://www.nature.com/articles/nrn2333">Leknes &amp; Tracey 2008</a>
  </div>
  <div class="pm-evidence" data-scene="fig-leknes">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pleasure"><b data-m="borrow">—</b><span>borrowed pleasure</span></div>
          <div class="pm-ev-metric pain"><b data-m="residual">—</b><span>threat residue</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>prior threat <b data-slider-val="threat">75</b></label>
          <input type="range" min="0" max="100" value="75" data-slider="threat">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>relief spike <b data-slider-val="relief">55</b></label>
          <input type="range" min="0" max="100" value="55" data-slider="relief">
        </div>
        </div>
        <p class="pm-ev-blurb">Relief-affect rides the same opioid and dopamine substrates as threat processing. Stopping pain feels good because the system was recently under threat — pleasure here is often the shadow of avoided harm, not a symmetric opposite.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Relief is pleasure with a history of threat — green borrows from red.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-baumeister">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3a</span>
    <h4>Baumeister: bad is stronger than good across domains</h4>
    <a class="pm-cite" href="https://doi.org/10.1037/1089-2680.5.4.323">Baumeister et al. 2001</a>
  </div>
  <div class="pm-evidence" data-scene="fig-baumeister">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric gold"><b data-m="tilt">—</b><span>tilt ratio</span></div>
          <div class="pm-ev-metric pain"><b data-m="net">—</b><span>net valence</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>harm weight <b data-slider-val="bad">82</b></label>
          <input type="range" min="0" max="100" value="82" data-slider="bad">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>benefit weight <b data-slider-val="good">38</b></label>
          <input type="range" min="0" max="100" value="38" data-slider="good">
        </div>
        </div>
        <p class="pm-ev-blurb">Baumeister&#x27;s review finds bad events, emotions, and impressions carry more weight than matched good ones across psychology — from learning rates to relationship memory. The scale tilts without any moral claim; it&#x27;s an empirical asymmetry in how minds update.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Bad events outweigh matched good ones. Harm writes in heavier ink.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-rozin">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3b</span>
    <h4>Rozin &amp; Royzman: negative differentiation — suffering is more varied</h4>
    <a class="pm-cite" href="https://doi.org/10.1207/S15327957PSPR0504_2">Rozin &amp; Royzman 2001</a>
  </div>
  <div class="pm-evidence" data-scene="fig-rozin">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="spread">—</b><span>infected nodes</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="isolated">—</b><span>good enclaves</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>contagion radius <b data-slider-val="contagion">72</b></label>
          <input type="range" min="0" max="100" value="72" data-slider="contagion">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>good locality <b data-slider-val="good_local">28</b></label>
          <input type="range" min="0" max="100" value="28" data-slider="good_local">
        </div>
        </div>
        <p class="pm-ev-blurb">Negative differentiation: the bad domain is richer, more differentiated, and more contagious than the good. One contamination event stains adjacent categories; good events rarely propagate the same way — negativity dominance in cognitive structure.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Bad spreads to neighbors and meaning. Good stays local.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-eisenberger">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3c</span>
    <h4>Eisenberger: social pain without peripheral nociception</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/14500928/">Eisenberger et al. 2003</a>
  </div>
  <div class="pm-evidence" data-scene="fig-eisenberger">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="acc">—</b><span>dACC activation</span></div>
          <div class="pm-ev-metric gold"><b data-m="overlap">—</b><span>body overlap</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>exclusion intensity <b data-slider-val="exclusion">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="exclusion">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>group acceptance <b data-slider-val="belonging">40</b></label>
          <input type="range" min="0" max="100" value="40" data-slider="belonging">
        </div>
        </div>
        <p class="pm-ev-blurb">Cyberball exclusion activates dACC and insula — overlap with physical pain circuitry without peripheral nociception. Social injury is not metaphorical in the brain; it uses hardware evolved for bodily threat.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Social exclusion recruits the same circuits as bodily hurt.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-lazarus">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3d</span>
    <h4>Lazarus: same stressor, different suffering by appraisal frame</h4>
    <a class="pm-cite" href="https://archive.org/details/stressappraisalc0000laza">Lazarus &amp; Folkman 1984</a>
  </div>
  <div class="pm-evidence" data-scene="fig-lazarus">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="output_a">—</b><span>threat path</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="output_b">—</b><span>challenge path</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>threat frame <b data-slider-val="threat">75</b></label>
          <input type="range" min="0" max="100" value="75" data-slider="threat">
        </div>
        <div class="pm-ev-slider pleasure">
          <label>challenge frame <b data-slider-val="challenge">35</b></label>
          <input type="range" min="0" max="100" value="35" data-slider="challenge">
        </div>
        <div class="pm-ev-slider gold">
          <label>self-blame <b data-slider-val="blame">60</b></label>
          <input type="range" min="0" max="100" value="60" data-slider="blame">
        </div>
        </div>
        <p class="pm-ev-blurb">Lazarus–Folkman stress appraisal: primary appraisal (harm/threat/challenge) and secondary appraisal (coping resources) reshape the same objective stressor into different suffering outputs — the event is not the whole story; the frame is.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Appraisal transforms the event: threat, blame, and coping change the felt blow.</p>
</figure>
</section>

<section class="pm-block">
<h2>Brain map</h2>
<p class="pm-point">Drag the 3D brain. Red routes sprawl. Green routes cluster. Move the sliders — watch pain states outrun pleasure.</p>
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

</section>

<section class="pm-block">
<h2>Count it</h2>
<p class="pm-point">Multiply distinct pain states vs pleasure states the spec allows. Switch profiles — the direction never flips.</p>
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

</section>

<section class="pm-block">
<h2>Genesis as QA report</h2>
<p class="pm-point">Read Genesis 2–3 as a defect table: birth pain, toil, mortality — hardware bugs, not a moral invoice for one apple.</p>
<figure class="pm-fig pm-fig-evidence" id="pmx-03">
  <div class="pm-fig-head">
    <span class="pm-fig-n">W3</span>
    <h4>Genesis as QA report</h4>
  </div>
  <div class="pm-evidence" data-scene="pmx-03">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="defects">—</b><span>open defects</span></div>
          <div class="pm-ev-metric gold"><b data-m="severity">—</b><span>severity index</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider pain">
          <label>defect cascade <b data-slider-val="bugs">80</b></label>
          <input type="range" min="0" max="100" value="80" data-slider="bugs">
        </div>
        <div class="pm-ev-slider gold">
          <label>user blame <b data-slider-val="blame">65</b></label>
          <input type="range" min="0" max="100" value="65" data-slider="blame">
        </div>
        </div>
        <p class="pm-ev-blurb">Genesis 2–3 reads like a defect table: birth pain, agricultural toil, mortality, shame — logged as product behavior before the user is blamed. The narrative inverts warranty law: fault moves downstream to the operator.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Birth pain, toil, mortality — hardware bugs logged before moral billing.</p>
</figure>
<figure class="pm-fig pm-fig-evidence" id="pmx-04">
  <div class="pm-fig-head">
    <span class="pm-fig-n">W4</span>
    <h4>Original sin inversion</h4>
  </div>
  <div class="pm-evidence" data-scene="pmx-04">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="upstream">—</b><span>upstream fault</span></div>
          <div class="pm-ev-metric muted"><b data-m="downstream">—</b><span>user fault</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider muted">
          <label>user blame <b data-slider-val="user_blame">30</b></label>
          <input type="range" min="0" max="100" value="30" data-slider="user_blame">
        </div>
        <div class="pm-ev-slider pain">
          <label>design blame <b data-slider-val="design_blame">88</b></label>
          <input type="range" min="0" max="100" value="88" data-slider="design_blame">
        </div>
        </div>
        <p class="pm-ev-blurb">Original Sin reframed as manufacture, not disobedience: consciousness was built inside a pain machine, then the operator was invoiced. The inversion moves moral fault upstream — from appetite to design.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Blame vectors flip: from disobedient user to negligent manufacturer.</p>
</figure>
</section>

<section class="pm-block">
<h2>Three locks</h2>
<p class="pm-point">Christianity, Islam, and secular humanism disagree about God. They agree about the body: heal it, never abandon it.</p>
<figure class="pm-fig pm-fig-evidence" id="pmx-09">
  <div class="pm-fig-head">
    <span class="pm-fig-n">W9</span>
    <h4>Three warranty regimes</h4>
  </div>
  <div class="pm-evidence" data-scene="pmx-09">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric gold"><b data-m="aligned">—</b><span>regime alignment</span></div>
          <div class="pm-ev-metric pain"><b data-m="veto">—</b><span>exit veto</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider gold">
          <label>repair allowance <b data-slider-val="repair">85</b></label>
          <input type="range" min="0" max="100" value="85" data-slider="repair">
        </div>
        <div class="pm-ev-slider pain">
          <label>exit attempt <b data-slider-val="exit">15</b></label>
          <input type="range" min="0" max="100" value="15" data-slider="exit">
        </div>
        </div>
        <p class="pm-ev-blurb">Three traditions with incompatible theologies share one body policy: sanctify or steward the flesh, forbid self-destruction, veto posthuman exit. Repair is sacred; escape is profane or undignified — the lock is structural, not sectarian.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Christianity, Islam, secular humanism — repair yes, exit no.</p>
</figure>
</section>

<section class="pm-block">
<h2>Mandate</h2>
<p class="pm-point">Once repair becomes escape, every warranty regime says no. The mandate is lawful exit — without manufacturing new hells.</p>
<figure class="pm-fig pm-fig-evidence" id="pmx-05">
  <div class="pm-fig-head">
    <span class="pm-fig-n">W5</span>
    <h4>Mandate ladder: therapy to exit</h4>
  </div>
  <div class="pm-evidence" data-scene="pmx-05">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric gold"><b data-m="rung">—</b><span>ladder rung</span></div>
          <div class="pm-ev-metric pain"><b data-m="wall">—</b><span>wall height</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider gold">
          <label>therapy climb <b data-slider-val="therapy">75</b></label>
          <input type="range" min="0" max="100" value="75" data-slider="therapy">
        </div>
        <div class="pm-ev-slider pain">
          <label>exit pressure <b data-slider-val="exit">55</b></label>
          <input type="range" min="0" max="100" value="55" data-slider="exit">
        </div>
        </div>
        <p class="pm-ev-blurb">The warrantied path runs therapy → enhancement → morphological repair — each rung approved. Lawful exit from biology itself hits a ceiling every regime guards. The mandate is to finish the ladder without manufacturing new hells.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Medicine climbs the ladder; morphological exit hits the wall.</p>
</figure>
<figure class="pm-fig pm-fig-evidence" id="pmx-11">
  <div class="pm-fig-head">
    <span class="pm-fig-n">WB</span>
    <h4>Suffering audit dashboard</h4>
  </div>
  <div class="pm-evidence" data-scene="pmx-11">
    <div class="pm-ev-layout">
      <div class="pm-ev-view">
        <canvas class="pm-ev-canvas" aria-hidden="true"></canvas>
        <div class="pm-ev-labels" aria-hidden="true"></div>
        <div class="pm-ev-hud">
          <div class="pm-ev-metric pain"><b data-m="involuntary">—</b><span>involuntary %</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="trajectory">—</b><span>↓ trajectory</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <h5>Live controls</h5>
        <div class="pm-ev-controls">
        <div class="pm-ev-slider gold">
          <label>audit intensity <b data-slider-val="audit">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="audit">
        </div>
        <div class="pm-ev-slider pain">
          <label>residual harm <b data-slider-val="residual">45</b></label>
          <input type="range" min="0" max="100" value="45" data-slider="residual">
        </div>
        </div>
        <p class="pm-ev-blurb">Treat involuntary suffering as an engineering defect with a measurable audit trail. The abolition target is not utopian mood — it is driving preventable harm states toward zero without creating new captive minds.</p>
      </div>
    </div>
  </div>
  <p class="pm-fig-cap">Target: involuntary suffering → zero. Abolition as engineering metric.</p>
</figure>
</section>

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
<script type="module" src="/research/pain_machines/pm-evidence.js?v=1"></script>
<script type="module" src="/research/pain_machines/brain3d.js?v=6"></script>
<script src="/research/pain_machines/pm-compute.js?v=2" defer></script>

</div>
