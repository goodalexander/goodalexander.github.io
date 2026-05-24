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
          <div class="pm-ev-metric pain"><b data-m="defects_n">—</b><span>listed defects</span></div>
          <div class="pm-ev-metric gold"><b data-m="locks">—</b><span>exit locks</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">View the warranty:</p>
        <div class="pm-ev-presets" data-default="defects">
        <button type="button" class="pm-ev-preset" data-preset="defects" title="Shipped at birth">Known defects</button>
        <button type="button" class="pm-ev-preset" data-preset="regimes" title="Repair OK · exit forbidden">Three exit locks</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Homo sapiens ships with known defects — pain, fear, grief, decay, death — and no consent form.</p>
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
          <div class="pm-ev-metric gold"><b data-m="somatic">—</b><span>tissue signal</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Compare Melzack&#x27;s cases:</p>
        <div class="pm-ev-presets" data-default="acute">
        <button type="button" class="pm-ev-preset" data-preset="acute" title="Somatic input drives output">Fresh tissue injury</button>
        <button type="button" class="pm-ev-preset" data-preset="phantom" title="Limb absent — pain persists">Phantom limb</button>
        <button type="button" class="pm-ev-preset" data-preset="stress_flare" title="Memory + stress alone">Stress flare, no new damage</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Melzack&#x27;s neuromatrix theory treats pain as a distributed output pattern — not a faithful meter of tissue damage. Phantom-limb pain is the proof case: the map persists after the limb is gone.</p>
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
          <div class="pm-ev-metric pain"><b data-m="qualifies">—</b><span>IASP pain?</span></div>
          <div class="pm-ev-metric gold"><b data-m="fusion">—</b><span>fused intensity</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">What counts as pain under IASP?</p>
        <div class="pm-ev-presets" data-default="sensory_only">
        <button type="button" class="pm-ev-preset" data-preset="sensory_only" title="Fails IASP definition">Body signal only</button>
        <button type="button" class="pm-ev-preset" data-preset="iasp_pain" title="Both channels required">Full IASP pain</button>
        <button type="button" class="pm-ev-preset" data-preset="grief_led" title="Affective channel dominant">Emotion-led pain</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">The 2020 IASP revision defines pain as &quot;an unpleasant sensory and emotional experience.&quot; Strip either channel and you no longer have the clinical object called pain.</p>
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
          <div class="pm-ev-metric gold"><b data-m="injury">—</b><span>acute trigger</span></div>
          <div class="pm-ev-metric pain"><b data-m="branches">—</b><span>MG30 classes lit</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <div class="pm-ev-scrub">
          <label>Months since injury <b data-scrub-val="months">0</b> mo</label>
          <input type="range" min="0" max="24" value="0" data-scrub="months">
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">ICD-11 lists seven chronic pain categories because alarms persist after injuries heal. Scrub the timeline — watch the acute trigger fade while chronic classes stay lit.</p>
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
          <div class="pm-ev-metric pain"><b data-m="words">—</b><span>visible words</span></div>
          <div class="pm-ev-metric gold"><b data-m="ratio">—</b><span>pain:pleasure</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Toggle lexicon view:</p>
        <div class="pm-ev-presets" data-default="mpq_clinical">
        <button type="button" class="pm-ev-preset" data-preset="mpq_clinical" title="Sensory · affective · evaluative">MPQ clinical (78)</button>
        <button type="button" class="pm-ev-preset" data-preset="pleasure_colloquial" title="Sparse everyday labels">Pleasure words (~12)</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">The McGill Pain Questionnaire carries 78 descriptor words across sensory, affective, evaluative, and miscellaneous domains — pleasure vocabulary stays sparse.</p>
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
          <div class="pm-ev-metric pain"><b data-m="layers">—</b><span>ledgers active</span></div>
          <div class="pm-ev-metric gold"><b data-m="dissoc">—</b><span>dissociation</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Price&#x27;s dissociation cases:</p>
        <div class="pm-ev-presets" data-default="capsaicin">
        <button type="button" class="pm-ev-preset" data-preset="capsaicin" title="High intensity · lower unpleasantness">Capsaicin on tongue</button>
        <button type="button" class="pm-ev-preset" data-preset="colic" title="All three ledgers climb">Labor / colic</button>
        <button type="button" class="pm-ev-preset" data-preset="neuropathic" title="Low intensity · high suffering">Neuropathic sting</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Price separates sensory intensity, unpleasantness, and secondary affect into partially independent dimensions — one stimulus can climb one ledger while another stays flat.</p>
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
          <div class="pm-ev-metric gold"><b data-m="orbit">—</b><span>wanting spread</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="cluster">—</b><span>liking intensity</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Compare reward states:</p>
        <div class="pm-ev-presets" data-default="healthy_meal">
        <button type="button" class="pm-ev-preset" data-preset="healthy_meal" title="Liking ≈ wanting">Sated meal</button>
        <button type="button" class="pm-ev-preset" data-preset="addiction" title="Wanting ≫ liking">Addiction profile</button>
        <button type="button" class="pm-ev-preset" data-preset="hotspot" title="Tight hedonic cluster">Direct opioid liking</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Berridge: hedonic &quot;liking&quot; sits in tight opioid hotspots; dopaminergic &quot;wanting&quot; sprawls. Addiction often decouples pursuit from felt joy.</p>
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
          <div class="pm-ev-metric pleasure"><b data-m="relief">—</b><span>relief felt</span></div>
          <div class="pm-ev-metric pain"><b data-m="residual">—</b><span>threat residue</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Relief vs prior threat:</p>
        <div class="pm-ev-presets" data-default="mild_relief">
        <button type="button" class="pm-ev-preset" data-preset="mild_relief" title="Weak threat → weak relief">Minor annoyance ends</button>
        <button type="button" class="pm-ev-preset" data-preset="burn_relief" title="High threat → strong relief">Burn then cool water</button>
        <button type="button" class="pm-ev-preset" data-preset="chronic" title="Relief exhausted">Chronic threat</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Relief-affect rides the same substrates as threat processing. Stopping pain feels good because the system was recently under threat.</p>
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
          <div class="pm-ev-metric gold"><b data-m="tilt">—</b><span>bad:good weight</span></div>
          <div class="pm-ev-metric pain"><b data-m="net">—</b><span>remembered valence</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Matched events on the scale:</p>
        <div class="pm-ev-presets" data-default="one_compliment">
        <button type="button" class="pm-ev-preset" data-preset="one_compliment" title="Light tilt">One compliment</button>
        <button type="button" class="pm-ev-preset" data-preset="one_insult" title="Heavy tilt (~2–5×)">One insult</button>
        <button type="button" class="pm-ev-preset" data-preset="paired" title="Bad dominates net memory">Same-day pair</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Baumeister&#x27;s review: matched bad events outweigh good ones in learning, memory, and impression formation — an empirical asymmetry, not a moral claim.</p>
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
          <div class="pm-ev-metric pain"><b data-m="spread">—</b><span>stained nodes</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="isolated">—</b><span>good enclaves</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Contamination stages:</p>
        <div class="pm-ev-presets" data-default="clean">
        <button type="button" class="pm-ev-preset" data-preset="clean" title="Neutral grid">Before event</button>
        <button type="button" class="pm-ev-preset" data-preset="one_drop" title="Local stain">One bad event</button>
        <button type="button" class="pm-ev-preset" data-preset="spread" title="Bad infects neighbors">After rumination</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Negative differentiation: bad is richer and more contagious than good. One contamination stains adjacent categories; good events stay local.</p>
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
          <div class="pm-ev-metric gold"><b data-m="overlap">—</b><span>body-circuit overlap</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Cyberball conditions:</p>
        <div class="pm-ev-presets" data-default="included">
        <button type="button" class="pm-ev-preset" data-preset="included" title="dACC quiet">Included throws</button>
        <button type="button" class="pm-ev-preset" data-preset="excluded" title="dACC lights up">Excluded (Cyberball)</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Cyberball exclusion activates dACC and insula — overlap with physical pain circuitry without peripheral nociception.</p>
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
          <div class="pm-ev-metric pain"><b data-m="output_a">—</b><span>threat output</span></div>
          <div class="pm-ev-metric pleasure"><b data-m="output_b">—</b><span>challenge output</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Same stressor, different frame:</p>
        <div class="pm-ev-presets" data-default="threat">
        <button type="button" class="pm-ev-preset" data-preset="threat" title="High suffering path">Threat + self-blame</button>
        <button type="button" class="pm-ev-preset" data-preset="challenge" title="Lower suffering path">Challenge + resources</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Same objective stressor — different primary appraisal (threat vs challenge) — different suffering output. The frame is part of the injury.</p>
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
          <div class="pm-ev-metric gold"><b data-m="blame">—</b><span>user blame %</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Read the defect log:</p>
        <div class="pm-ev-presets" data-default="logged">
        <button type="button" class="pm-ev-preset" data-preset="logged" title="Birth pain · toil · death">Defects logged</button>
        <button type="button" class="pm-ev-preset" data-preset="blame_shift" title="Fault moves to user">Blame assigned</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Genesis 2–3 as a defect table logged before the operator is blamed.</p>
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
          <div class="pm-ev-metric pain"><b data-m="upstream">—</b><span>design fault</span></div>
          <div class="pm-ev-metric muted"><b data-m="downstream">—</b><span>user fault</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Where does fault live?</p>
        <div class="pm-ev-presets" data-default="traditional">
        <button type="button" class="pm-ev-preset" data-preset="traditional" title="User disobeyed">Traditional reading</button>
        <button type="button" class="pm-ev-preset" data-preset="manufacture" title="Design defect">Manufacture reading</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Original Sin as manufacture, not disobedience — fault moves upstream.</p>
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
          <div class="pm-ev-metric gold"><b data-m="aligned">—</b><span>regimes aligned</span></div>
          <div class="pm-ev-metric pain"><b data-m="veto">—</b><span>exit blocked</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Try an exit attempt:</p>
        <div class="pm-ev-presets" data-default="repair_ok">
        <button type="button" class="pm-ev-preset" data-preset="repair_ok" title="All regimes allow">Medical repair</button>
        <button type="button" class="pm-ev-preset" data-preset="exit_attempt" title="All regimes veto">Morphological exit</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Three theologies · one body policy: repair the chassis, never abandon it.</p>
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
          <div class="pm-ev-metric pain"><b data-m="wall">—</b><span>wall hit?</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Climb the warrantied ladder:</p>
        <div class="pm-ev-presets" data-default="therapy">
        <button type="button" class="pm-ev-preset" data-preset="therapy" title="Approved">Therapy rung</button>
        <button type="button" class="pm-ev-preset" data-preset="enhance" title="Approved">Enhancement rung</button>
        <button type="button" class="pm-ev-preset" data-preset="exit" title="Wall">Exit attempt</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Therapy and enhancement climb; lawful exit from biology hits a guarded ceiling.</p>
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
          <div class="pm-ev-metric pleasure"><b data-m="trajectory">—</b><span>audit score</span></div>
        </div>
        <div class="pm-ev-readout" data-readout></div>
      </div>
      <div class="pm-ev-panel">
        <p class="pm-ev-prompt">Audit era:</p>
        <div class="pm-ev-presets" data-default="status_quo">
        <button type="button" class="pm-ev-preset" data-preset="status_quo" title="High involuntary harm">Status quo</button>
        <button type="button" class="pm-ev-preset" data-preset="audit_on" title="Harm tracked ↓">Audit deployed</button>
        <button type="button" class="pm-ev-preset" data-preset="target" title="→ 0 involuntary">Abolition target</button>
        </div>
        <p class="pm-ev-lesson" data-lesson></p>
        <p class="pm-ev-blurb">Involuntary suffering as an engineering defect with a measurable audit trail.</p>
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
<script type="module" src="/research/pain_machines/pm-evidence.js?v=2"></script>
<script type="module" src="/research/pain_machines/brain3d.js?v=6"></script>
<script src="/research/pain_machines/pm-compute.js?v=2" defer></script>

</div>
