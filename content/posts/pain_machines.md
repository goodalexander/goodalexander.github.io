---
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

/* pm-mobile-fig */

.pm-fig-wide { display: block; }
.pm-fig-mobile {
  display: none;
  border-top: 1px solid var(--line);
  background: var(--bg);
}
.pm-fig-mobile svg {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}
@media (max-width: 720px) {
  .pm .pm-lead,
  .pm .pm-point { max-width: none; }
  .pm-fig-evidence .pm-fig-wide { display: none !important; }
  .pm-fig-evidence .pm-fig-mobile { display: block !important; }
  .pm-fig-evidence .pm-fig-stack { display: none !important; }
  .pm-fig-evidence { overflow: visible; max-width: 100%; }
  .pm-fig-head { flex-direction: column; align-items: flex-start; gap: .3rem; }
  .pm-fig-head h4 { font-size: .82rem; line-height: 1.35; }
  .pm-fig-cap { font-size: .8rem; line-height: 1.5; }
  .pm-chart { overflow-x: auto; -webkit-overflow-scrolling: touch; padding: .5rem .5rem 1rem; }
  .pm-chart svg { min-width: 0; max-width: none; height: auto; }
}
@media (min-width: 721px) {
  .pm-fig-mobile,
  .pm-fig-stack { display: none !important; }
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
  <div class="pm-fig-wide">
  <svg viewBox="0 0 920 320" role="img" aria-label="The warranty card in the crib">    <rect width="920" height="320" fill="#040506"/>
<text x="40" y="32" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700">WARRANTY CARD · SHIPPED AT BIRTH</text>
    <rect x="40" y="48" width="380" height="240" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="4"/>
    <text x="56" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="11">PRODUCT</text>
    <text x="160" y="78" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="13" font-weight="700">Homo sapiens</text>
    <text x="56" y="108" fill="#555c64" font-family="ui-monospace,monospace" font-size="11">KNOWN DEFECTS</text>
    <text x="160" y="108" fill="#b85c55" font-family="ui-monospace,monospace" font-size="12">pain · fear · grief · decay · death</text>
    <text x="56" y="138" fill="#555c64" font-family="ui-monospace,monospace" font-size="11">TERMS</text>
    <text x="160" y="138" fill="#8a9199" font-family="ui-monospace,monospace" font-size="12">repair permitted · exit prohibited</text>
    <rect x="56" y="160" width="348" height="48" fill="#120909" stroke="#b89a6a" rx="3"/>
    <text x="230" y="190" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="14" font-weight="700" text-anchor="middle">VOID THE WARRANTY</text>
    <rect x="460" y="48" width="420" height="240" fill="#0a0b0d" stroke="#b85c55" rx="4"/>
    <text x="476" y="78" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="700">THREE REGIMES · SAME CLAUSE</text>
    <text x="476" y="110" fill="#8a9199" font-family="ui-monospace,monospace" font-size="12">Christianity → sanctify body · forbid exit</text>
    <text x="476" y="140" fill="#8a9199" font-family="ui-monospace,monospace" font-size="12">Islam → amanah · forbid self-ownership</text>
    <text x="476" y="170" fill="#8a9199" font-family="ui-monospace,monospace" font-size="12">Secular → dignity · forbid natural-kind break</text>
    <text x="476" y="210" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11">repair yes · exit no</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Warranty mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">WARRANTY · SHIPPED AT BIRTH</text>
    <rect x="16" y="40" width="328" height="72" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="60" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">Homo sapiens</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">defects: pain · fear · grief · decay · death</text>
    <rect x="16" y="124" width="328" height="40" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="144" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">terms</text>
    <text x="28" y="162" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">repair OK · exit forbidden</text>
    <rect x="16" y="176" width="328" height="40" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="196" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">Christianity</text>
    <text x="28" y="214" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">sanctify body · forbid exit</text>
    <rect x="16" y="224" width="328" height="40" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="244" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">Islam</text>
    <text x="28" y="262" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">amanah · forbid self-ownership</text>
    <rect x="16" y="272" width="328" height="40" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="292" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">Secular</text>
    <text x="28" y="310" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">dignity · forbid posthuman</text>
    <rect x="16" y="328" width="328" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="348" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">repair yes · exit no</text>
</svg>
  </div>
  
  <p class="pm-fig-cap">Every civilization assigns repair rights and forbids exit from the inherited human format before consent is possible.</p>
</figure>
</section>

<section class="pm-block">
<h2>Clinic</h2>
<p class="pm-point">Doctors already know: pain is not a simple damage meter. It spreads through body, mood, memory, and identity.</p>
<figure class="pm-fig pm-fig-evidence" id="fig-neuromatrix">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1a</span>
    <h4>Neuromatrix: pain generated by the whole brain</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack 2001</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 340" role="img" aria-label="Melzack neuromatrix: multiple brain inputs converge to pain output">    <defs>
      <radialGradient id="pm0-pm-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#b85c55" stop-opacity=".35"/>
        <stop offset="100%" stop-color="#b85c55" stop-opacity="0"/>
      </radialGradient>
      <filter id="pm0-pm-soft"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    <rect width="760" height="340" fill="transparent"/>
    <text x="380" y="28" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">body-self neuromatrix · neurosignature patterns</text>
    <ellipse cx="380" cy="168" rx="92" ry="52" fill="url(#pm0-pm-glow)"/>
    <rect x="308" y="138" width="144" height="60" rx="4" fill="#0f1012" stroke="rgba(184,92,85,.55)" stroke-width="1.2"/>
    <text x="380" y="162" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">neuromatrix</text>
    <text x="380" y="178" fill="#8a9199" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">pain output pattern</text>
    <g fill="none" stroke-width="1">
      <path id="pm0-pm-p1" d="M380 52 L380 138" stroke="rgba(184,92,85,.25)" stroke-dasharray="4 3"/>
      <path id="pm0-pm-p2" d="M88 98 Q234 118 308 158" stroke="rgba(184,154,106,.45)"/>
      <path id="pm0-pm-p3" d="M672 98 Q526 118 452 158" stroke="rgba(184,154,106,.45)"/>
      <path id="pm0-pm-p4" d="M88 238 Q234 218 308 178" stroke="rgba(184,154,106,.45)"/>
      <path id="pm0-pm-p5" d="M672 238 Q526 218 452 178" stroke="rgba(184,154,106,.45)"/>
      <path id="pm0-pm-p6" d="M380 288 L380 198" stroke="rgba(184,154,106,.45)"/>
    </g>
    <g font-family="ui-monospace,monospace" font-size="10">
      <rect x="318" y="36" width="124" height="22" rx="3" fill="#0a0b0d" stroke="rgba(184,92,85,.35)"/>
      <text x="380" y="51" fill="#b85c55" text-anchor="middle">somatic input</text>
      <text x="380" y="68" fill="#555c64" font-size="8" text-anchor="middle">one contributor · insufficient alone</text>
      <rect x="36" y="82" width="104" height="32" rx="3" fill="#0a0b0d" stroke="rgba(184,154,106,.35)"/>
      <text x="88" y="98" fill="#b89a6a" text-anchor="middle">appraisal</text>
      <text x="88" y="110" fill="#555c64" font-size="8" text-anchor="middle">meaning</text>
      <rect x="620" y="82" width="104" height="32" rx="3" fill="#0a0b0d" stroke="rgba(184,154,106,.35)"/>
      <text x="672" y="98" fill="#b89a6a" text-anchor="middle">social field</text>
      <text x="672" y="110" fill="#555c64" font-size="8" text-anchor="middle">context</text>
      <rect x="36" y="222" width="104" height="32" rx="3" fill="#0a0b0d" stroke="rgba(184,154,106,.35)"/>
      <text x="88" y="238" fill="#b89a6a" text-anchor="middle">memory</text>
      <text x="88" y="250" fill="#555c64" font-size="8" text-anchor="middle">prior episodes</text>
      <rect x="620" y="222" width="104" height="32" rx="3" fill="#0a0b0d" stroke="rgba(184,154,106,.35)"/>
      <text x="672" y="238" fill="#b89a6a" text-anchor="middle">identity</text>
      <text x="672" y="250" fill="#555c64" font-size="8" text-anchor="middle">self-schema</text>
      <rect x="318" y="288" width="124" height="32" rx="3" fill="#0a0b0d" stroke="rgba(184,154,106,.35)"/>
      <text x="380" y="304" fill="#b89a6a" text-anchor="middle">stress / attention</text>
      <text x="380" y="316" fill="#555c64" font-size="8" text-anchor="middle">arousal gate</text>
    </g>
    <g fill="#b89a6a" opacity=".9">
      <circle r="3"><animateMotion dur="2.8s" repeatCount="indefinite" begin="0s" path="M88 98 Q234 118 308 158"/></circle>
      <circle r="3"><animateMotion dur="3.1s" repeatCount="indefinite" begin=".4s" path="M672 98 Q526 118 452 158"/></circle>
      <circle r="3"><animateMotion dur="2.9s" repeatCount="indefinite" begin=".8s" path="M88 238 Q234 218 308 178"/></circle>
      <circle r="3"><animateMotion dur="3.2s" repeatCount="indefinite" begin="1.1s" path="M672 238 Q526 218 452 178"/></circle>
      <circle r="3"><animateMotion dur="2.6s" repeatCount="indefinite" begin="1.4s" path="M380 288 L380 198"/></circle>
      <circle r="2.5" fill="#b85c55" opacity=".65"><animateMotion dur="3.4s" repeatCount="indefinite" begin=".2s" path="M380 52 L380 138"/></circle>
    </g>
    <g transform="translate(520 148)">
      <path d="M0 0 L48 0" stroke="#b85c55" stroke-width="1.5" marker-end="url(#pm0-pm-arr)"/>
      <defs><marker id="pm0-pm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b85c55"/></marker></defs>
      <rect x="52" y="-18" width="118" height="36" rx="3" fill="#120909" stroke="#b85c55" stroke-width="1"/>
      <text x="111" y="-2" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">pain experience</text>
      <text x="111" y="12" fill="#8a9199" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">≠ damage magnitude</text>
    </g></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Neuromatrix mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">NEUROMATRIX · BRAIN BUILDS PAIN</text>
    <rect x="16" y="44" width="156" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="64" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">somatic input</text>
    <text x="28" y="82" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">one contributor</text>
    <rect x="188" y="44" width="156" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="200" y="64" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">appraisal</text>
    <text x="200" y="82" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">meaning</text>
    <rect x="16" y="100" width="156" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="120" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">memory</text>
    <text x="28" y="138" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">prior episodes</text>
    <rect x="188" y="100" width="156" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="200" y="120" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">social field</text>
    <text x="200" y="138" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">context</text>
    <rect x="102" y="156" width="156" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="114" y="176" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">stress / attention</text>
    <text x="114" y="194" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">arousal gate</text>
    <line x1="180" y1="200" x2="180" y2="228" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="72" y="232" width="216" height="52" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="84" y="252" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">neuromatrix</text>
    <text x="84" y="270" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">pain output pattern</text>
    <line x1="180" y1="284" x2="180" y2="312" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="48" y="316" width="264" height="48" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="60" y="336" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">pain experience</text>
    <text x="60" y="354" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">≠ damage magnitude</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Melzack broke the courtroom model: the brain builds pain from signal, map, memory, stress, and expectation.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-iasp">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1b</span>
    <h4>IASP 2020: sensory and emotional are inseparable</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja et al. 2020</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 260" role="img" aria-label="IASP definition: sensory and emotional channels always co-occur in pain">    <text x="380" y="24" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">revised IASP definition · two mandatory dimensions</text>
    <rect x="40" y="48" width="300" height="56" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.5)" stroke-width="1"/>
    <text x="190" y="72" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">sensory experience</text>
    <text x="190" y="90" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">quality · intensity · location · duration</text>
    <rect x="420" y="48" width="300" height="56" rx="4" fill="#0a0b0d" stroke="rgba(184,154,106,.5)" stroke-width="1"/>
    <text x="570" y="72" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">emotional experience</text>
    <text x="570" y="90" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">unpleasantness · distress · threat</text>
    <path d="M190 104 L190 132 L380 132 L380 160" fill="none" stroke="rgba(184,92,85,.5)" stroke-width="1.2"/>
    <path d="M570 104 L570 132 L380 132" fill="none" stroke="rgba(184,154,106,.5)" stroke-width="1.2"/>
    <circle r="3" fill="#b85c55"><animateMotion dur="2.2s" repeatCount="indefinite" path="M190 104 L190 132 L380 132 L380 160"/></circle>
    <circle r="3" fill="#b89a6a"><animateMotion dur="2.2s" repeatCount="indefinite" begin=".35s" path="M570 104 L570 132 L380 132 L380 160"/></circle>
    <rect x="260" y="160" width="240" height="52" rx="4" fill="#120909" stroke="#b85c55" stroke-width="1.2">
      <animate attributeName="stroke-opacity" values=".6;1;.6" dur="3s" repeatCount="indefinite"/>
    </rect>
    <text x="380" y="182" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">pain</text>
    <text x="380" y="198" fill="#8a9199" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">always both · never sensory-only</text>
    <text x="380" y="238" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">associated with actual or potential tissue damage</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="IASP mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">IASP 2020 · TWO CHANNELS</text>
    <rect x="16" y="44" width="328" height="56" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="64" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">sensory</text>
    <text x="28" y="82" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">quality · intensity · location</text>
    <rect x="16" y="116" width="328" height="56" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="136" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">emotional</text>
    <text x="28" y="154" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">unpleasantness · distress · threat</text>
    <line x1="180" y1="172" x2="180" y2="200" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="48" y="204" width="264" height="52" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="60" y="224" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">pain</text>
    <text x="60" y="242" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">always both · never sensory-only</text>
    <rect x="16" y="280" width="328" height="44" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="300" fill="#555c64" font-family="ui-monospace,monospace" font-size="11" font-weight="600">tissue damage</text>
    <text x="28" y="318" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">associated — but not required</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Official medicine: pain is always sensory and emotional — not a tissue meter alone.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-icd11">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1c</span>
    <h4>ICD-11 MG30: seven chronic-pain categories, nested subtypes</h4>
    <a class="pm-cite" href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede et al. 2022</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 340" role="img" aria-label="ICD-11 chronic pain taxonomy with seven top-level categories">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">ICD-11 chapter MG30 · seven top-level categories</text>
    <rect x="300" y="34" width="160" height="32" rx="3" fill="#0f1012" stroke="#b89a6a" stroke-width="1.2"/>
    <text x="380" y="54" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">MG30 chronic pain</text>
    <line x1="380" y1="66" x2="380" y2="76" stroke="rgba(184,92,85,.45)"/>
    <line x1="108" y1="76" x2="652" y2="76" stroke="rgba(184,92,85,.35)"/>
    <g font-family="ui-monospace,monospace" font-size="9">
      <line x1="108" y1="76" x2="108" y2="86" stroke="rgba(184,92,85,.35)"/>
      <rect x="32" y="86" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin="0s" fill="freeze"/></rect>
      <text x="108" y="104" fill="#b85c55" text-anchor="middle">MG30.0 primary</text>
      <text x="108" y="118" fill="#555c64" text-anchor="middle">nociplastic</text>
      <line x1="290" y1="76" x2="290" y2="86" stroke="rgba(184,92,85,.35)"/>
      <rect x="214" y="86" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin=".1s" fill="freeze"/></rect>
      <text x="290" y="104" fill="#b85c55" text-anchor="middle">MG30.1 cancer</text>
      <text x="290" y="118" fill="#555c64" text-anchor="middle">tumor · treatment</text>
      <line x1="472" y1="76" x2="472" y2="86" stroke="rgba(184,92,85,.35)"/>
      <rect x="396" y="86" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin=".2s" fill="freeze"/></rect>
      <text x="472" y="104" fill="#b85c55" text-anchor="middle">MG30.2 postsurgical</text>
      <text x="472" y="118" fill="#555c64" text-anchor="middle">posttraumatic</text>
      <line x1="652" y1="76" x2="652" y2="86" stroke="rgba(184,92,85,.35)"/>
      <rect x="576" y="86" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin=".3s" fill="freeze"/></rect>
      <text x="652" y="104" fill="#b85c55" text-anchor="middle">MG30.3 musculoskeletal</text>
      <text x="652" y="118" fill="#555c64" text-anchor="middle">secondary</text>
      <line x1="380" y1="76" x2="380" y2="150" stroke="rgba(184,92,85,.25)"/>
      <line x1="195" y1="150" x2="565" y2="150" stroke="rgba(184,92,85,.25)"/>
      <line x1="195" y1="150" x2="195" y2="160" stroke="rgba(184,92,85,.35)"/>
      <rect x="119" y="160" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.4)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin=".42s" fill="freeze"/></rect>
      <text x="195" y="178" fill="#b85c55" text-anchor="middle">MG30.4 visceral</text>
      <text x="195" y="192" fill="#555c64" text-anchor="middle">secondary</text>
      <line x1="380" y1="150" x2="380" y2="160" stroke="rgba(184,92,85,.35)"/>
      <rect x="304" y="160" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.4)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin=".54s" fill="freeze"/></rect>
      <text x="380" y="178" fill="#b85c55" text-anchor="middle">MG30.5 neuropathic</text>
      <text x="380" y="192" fill="#555c64" text-anchor="middle">nerve lesion · disease</text>
      <line x1="565" y1="150" x2="565" y2="160" stroke="rgba(184,92,85,.35)"/>
      <rect x="489" y="160" width="152" height="44" rx="2" fill="#0a0b0d" stroke="rgba(184,92,85,.4)"><animate attributeName="opacity" from="0" to="1" dur=".35s" begin=".66s" fill="freeze"/></rect>
      <text x="565" y="178" fill="#b85c55" text-anchor="middle">MG30.6 headache</text>
      <text x="565" y="192" fill="#555c64" text-anchor="middle">orofacial · secondary</text>
    </g>
    <rect x="80" y="228" width="600" height="48" rx="3" fill="#120909" stroke="rgba(184,92,85,.35)"/>
    <text x="380" y="248" fill="#8a9199" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">each category → nested subtypes · severity · interference · psychosocial modifiers</text>
    <text x="380" y="264" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">7 × subtypes × modifiers = combinatorial clinical space</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="ICD-11 mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">ICD-11 MG30 · CHRONIC PAIN</text>
    <rect x="16" y="40" width="328" height="34" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="60" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.0 primary / nociplastic</text>
    <line x1="180" y1="74" x2="180" y2="84" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="84" width="328" height="34" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="104" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.1 cancer</text>
    <line x1="180" y1="118" x2="180" y2="128" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="128" width="328" height="34" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="148" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.2 postsurgical</text>
    <line x1="180" y1="162" x2="180" y2="172" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="172" width="328" height="34" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="192" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.3 musculoskeletal</text>
    <line x1="180" y1="206" x2="180" y2="216" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="216" width="328" height="34" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="236" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.4 neuropathic</text>
    <line x1="180" y1="250" x2="180" y2="260" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="260" width="328" height="34" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="280" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.5 headache · visceral</text>
    <line x1="180" y1="294" x2="180" y2="304" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="304" width="328" height="34" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="324" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">MG30.6 secondary syndromes</text>
    <rect x="16" y="356" width="328" height="40" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="376" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">alarm outlives fire</text>
    <text x="28" y="394" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">chronicity = the illness</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">ICD-11 makes chronic pain a disease category. The alarm can outlive the fire.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-mcgill">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1d</span>
    <h4>McGill MPQ: 78 words because pain factorizes in language</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/1235985/">Melzack 1975</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 280" role="img" aria-label="McGill Pain Questionnaire descriptor inventory across four word classes">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">McGill MPQ · 78 pain descriptors in four word classes</text>
    <g font-family="ui-monospace,monospace">
      <rect x="24" y="40" width="164" height="148" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"/>
      <text x="106" y="62" fill="#b85c55" font-size="10" text-anchor="middle">sensory</text>
      <text x="106" y="78" fill="#555c64" font-size="9" text-anchor="middle">20 words</text>
      <g fill="#b85c55" opacity=".75">
        <circle cx="48" cy="98" r="4"/><circle cx="68" cy="98" r="4"/><circle cx="88" cy="98" r="4"/><circle cx="108" cy="98" r="4"/>
        <circle cx="128" cy="98" r="4"/><circle cx="148" cy="98" r="4"/><circle cx="168" cy="98" r="4"/>
        <circle cx="58" cy="118" r="4"/><circle cx="78" cy="118" r="4"/><circle cx="98" cy="118" r="4"/><circle cx="118" cy="118" r="4"/>
      </g>
      <text x="106" y="148" fill="#8a9199" font-size="8" text-anchor="middle">shooting · burning</text>
      <text x="106" y="162" fill="#8a9199" font-size="8" text-anchor="middle">throbbing · stabbing</text>
      <rect x="204" y="40" width="164" height="148" rx="4" fill="#0a0b0d" stroke="rgba(184,154,106,.45)"/>
      <text x="286" y="62" fill="#b89a6a" font-size="10" text-anchor="middle">affective</text>
      <text x="286" y="78" fill="#555c64" font-size="9" text-anchor="middle">12 words</text>
      <g fill="#b89a6a" opacity=".75">
        <circle cx="248" cy="104" r="4"/><circle cx="272" cy="104" r="4"/><circle cx="296" cy="104" r="4"/><circle cx="320" cy="104" r="4"/>
        <circle cx="260" cy="124" r="4"/><circle cx="284" cy="124" r="4"/><circle cx="308" cy="124" r="4"/>
      </g>
      <text x="286" y="148" fill="#8a9199" font-size="8" text-anchor="middle">tiring · sickening</text>
      <text x="286" y="162" fill="#8a9199" font-size="8" text-anchor="middle">fearful · punishing</text>
      <rect x="384" y="40" width="164" height="148" rx="4" fill="#0a0b0d" stroke="rgba(138,145,153,.45)"/>
      <text x="466" y="62" fill="#8a9199" font-size="10" text-anchor="middle">evaluative</text>
      <text x="466" y="78" fill="#555c64" font-size="9" text-anchor="middle">5 words</text>
      <g fill="#8a9199" opacity=".75">
        <circle cx="436" cy="110" r="4"/><circle cx="466" cy="110" r="4"/><circle cx="496" cy="110" r="4"/>
      </g>
      <text x="466" y="148" fill="#8a9199" font-size="8" text-anchor="middle">annoying · miserable</text>
      <text x="466" y="162" fill="#8a9199" font-size="8" text-anchor="middle">unbearable · …</text>
      <rect x="564" y="40" width="172" height="148" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.35)"/>
      <text x="650" y="62" fill="#b85c55" font-size="10" text-anchor="middle">miscellaneous</text>
      <text x="650" y="78" fill="#555c64" font-size="9" text-anchor="middle">41 words</text>
      <g fill="#b85c55" opacity=".45">
        <circle cx="590" cy="96" r="3"/><circle cx="610" cy="96" r="3"/><circle cx="630" cy="96" r="3"/><circle cx="650" cy="96" r="3"/><circle cx="670" cy="96" r="3"/><circle cx="690" cy="96" r="3"/><circle cx="710" cy="96" r="3"/>
        <circle cx="600" cy="112" r="3"/><circle cx="620" cy="112" r="3"/><circle cx="640" cy="112" r="3"/><circle cx="660" cy="112" r="3"/><circle cx="680" cy="112" r="3"/><circle cx="700" cy="112" r="3"/>
        <circle cx="590" cy="128" r="3"/><circle cx="610" cy="128" r="3"/><circle cx="630" cy="128" r="3"/><circle cx="650" cy="128" r="3"/><circle cx="670" cy="128" r="3"/><circle cx="690" cy="128" r="3"/><circle cx="710" cy="128" r="3"/>
      </g>
      <text x="650" y="162" fill="#8a9199" font-size="8" text-anchor="middle">tight · heavy · splitting · …</text>
    </g>
    <rect x="24" y="206" width="712" height="36" rx="3" fill="#120909" stroke="#b85c55"/>
    <text x="380" y="228" fill="#b85c55" font-size="10" text-anchor="middle">78 distinguishable pain states — from vocabulary alone, before combinatorics</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="McGill mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">MCGILL · 78 PAIN WORDS</text>
    <rect x="16" y="40" width="328" height="40" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="60" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">pleasure vocabulary</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">reward · satiety · calm</text>
    <text x="16" y="100" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">pain descriptors multiply ↓</text>
    <rect x="16" y="120" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="140" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">burning</text>
    <rect x="188" y="120" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="140" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">stabbing</text>
    <rect x="16" y="156" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="176" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">sickening</text>
    <rect x="188" y="156" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="176" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">exhausting</text>
    <rect x="16" y="192" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="212" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">terrifying</text>
    <rect x="188" y="192" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="212" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">punishing</text>
    <rect x="16" y="228" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="248" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">gnawing</text>
    <rect x="188" y="228" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="248" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">heavy</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">78 pain descriptors in clinical use. Pleasure shares far fewer words.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-price">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1e</span>
    <h4>Price: sensation, unpleasantness, and secondary affect dissociate</h4>
    <a class="pm-cite" href="https://doi.org/10.1126/science.288.5472.1769">Price 2000</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 200" role="img" aria-label="Serial dissociation of pain sensation intensity, unpleasantness, and secondary affect">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">affective dimension of pain · serial processing stages</text>
    <g font-family="ui-monospace,monospace">
      <rect x="40" y="52" width="180" height="56" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.5)"/>
      <text x="130" y="76" fill="#b85c55" font-size="10" text-anchor="middle">sensation intensity</text>
      <text x="130" y="92" fill="#555c64" font-size="8" text-anchor="middle">spinothalamic · SI / SII</text>
      <path d="M220 80 L268 80" stroke="#b85c55" stroke-width="1.5" marker-end="url(#pm4-pm-a2)"/>
      <rect x="272" y="52" width="180" height="56" rx="4" fill="#0a0b0d" stroke="rgba(184,154,106,.5)"/>
      <text x="362" y="76" fill="#b89a6a" font-size="10" text-anchor="middle">pain unpleasantness</text>
      <text x="362" y="92" fill="#555c64" font-size="8" text-anchor="middle">ACC · medial thalamus</text>
      <path d="M452 80 L500 80" stroke="#b89a6a" stroke-width="1.5" marker-end="url(#pm4-pm-a2)"/>
      <rect x="504" y="52" width="216" height="56" rx="4" fill="#0a0b0d" stroke="rgba(138,145,153,.5)"/>
      <text x="612" y="76" fill="#8a9199" font-size="10" text-anchor="middle">secondary affect</text>
      <text x="612" y="92" fill="#555c64" font-size="8" text-anchor="middle">prefrontal · autonomic · motor plans</text>
      <defs><marker id="pm4-pm-a2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b89a6a"/></marker></defs>
    </g>
    <g>
      <rect x="40" y="130" width="680" height="44" rx="3" fill="#060708" stroke="rgba(235,228,220,.08)"/>
      <text x="380" y="150" fill="#8a9199" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">opioid analgesia ↓ unpleasantness more than intensity · stages remain separable</text>
      <text x="380" y="166" fill="#b85c55" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">≠ bliss under fentanyl (pleasure collapses to receptor class)</text>
      <circle r="3" fill="#b85c55"><animateMotion dur="4s" repeatCount="indefinite" path="M130 108 L130 130 L380 152"/></circle>
      <circle r="3" fill="#b89a6a"><animateMotion dur="4s" repeatCount="indefinite" begin=".5s" path="M362 108 L362 130 L380 152"/></circle>
      <circle r="3" fill="#8a9199"><animateMotion dur="4s" repeatCount="indefinite" begin="1s" path="M612 108 L612 130 L380 152"/></circle>
    </g></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Price mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">PRICE · MULTIPLE LEDGERS</text>
    <text x="16" y="56" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10">intensity</text>
    <rect x="16" y="62" width="278" height="14" fill="#b85c55" opacity="0.85"/>
    <rect x="16" y="62" width="328" height="14" fill="none" stroke="rgba(235,228,220,.12)"/>
    <text x="16" y="112" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10">unpleasantness</text>
    <rect x="16" y="118" width="236" height="14" fill="#b85c55" opacity="0.85"/>
    <rect x="16" y="118" width="328" height="14" fill="none" stroke="rgba(235,228,220,.12)"/>
    <text x="16" y="168" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10">dread</text>
    <rect x="16" y="174" width="190" height="14" fill="#b85c55" opacity="0.85"/>
    <rect x="16" y="174" width="328" height="14" fill="none" stroke="rgba(235,228,220,.12)"/>
    <rect x="16" y="220" width="328" height="48" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="240" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">one stimulus</text>
    <text x="28" y="258" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">several suffering ledgers</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Intensity and unpleasantness can separate — one injury, multiple ledgers.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-berridge">
  <div class="pm-fig-head">
    <span class="pm-fig-n">2a</span>
    <h4>Berridge: small &ldquo;liking&rdquo; hotspots, sprawling &ldquo;wanting&rdquo; system</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/">Berridge &amp; Kringelbach 2015</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 300" role="img" aria-label="Hedonic hotspots versus distributed wanting circuitry with pharmacological collapse">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">pleasure systems · causation vs representation</text>
    <text x="190" y="48" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">liking (causal hotspots)</text>
    <text x="570" y="48" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">wanting (mesolimbic spread)</text>
    <g transform="translate(60 60)">
      <circle cx="60" cy="50" r="22" fill="rgba(122,154,140,.15)" stroke="#7a9a8c" stroke-width="1.2"><animate attributeName="r" values="20;24;20" dur="3s" repeatCount="indefinite"/></circle>
      <text x="60" y="54" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">NAc</text>
      <circle cx="130" cy="90" r="18" fill="rgba(122,154,140,.12)" stroke="#7a9a8c" stroke-width="1"><animate attributeName="r" values="16;20;16" dur="3.2s" repeatCount="indefinite"/></circle>
      <text x="130" y="94" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">VP</text>
      <circle cx="95" cy="130" r="16" fill="rgba(122,154,140,.1)" stroke="#7a9a8c" stroke-width="1"><animate attributeName="r" values="14;18;14" dur="2.8s" repeatCount="indefinite"/></circle>
      <text x="95" y="134" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">OFC</text>
      <text x="95" y="168" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">3 hedonic hotspots</text>
    </g>
    <g transform="translate(400 60)" opacity=".85">
      <circle cx="95" cy="60" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="140" cy="45" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="180" cy="75" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="120" cy="100" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="170" cy="115" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="210" cy="50" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="230" cy="95" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <circle cx="60" cy="95" r="8" fill="none" stroke="#555c64" stroke-width=".8"/>
      <line x1="95" y1="60" x2="140" y2="45" stroke="rgba(85,92,100,.4)"/>
      <line x1="140" y1="45" x2="210" y2="50" stroke="rgba(85,92,100,.4)"/>
      <line x1="95" y1="60" x2="120" y2="100" stroke="rgba(85,92,100,.4)"/>
      <line x1="180" y1="75" x2="230" y2="95" stroke="rgba(85,92,100,.4)"/>
      <line x1="120" y1="100" x2="170" y2="115" stroke="rgba(85,92,100,.4)"/>
      <text x="145" y="168" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">VTA · amygdala · hippocampus · …</text>
    </g>
    <text x="380" y="200" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">pharmacological quotient · modalities collapse to receptor class</text>
    <g font-family="ui-monospace,monospace" font-size="8">
      <rect x="48" y="216" width="72" height="24" rx="2" fill="#0a0b0d" stroke="#7a9a8c"/>
      <text x="84" y="232" fill="#7a9a8c" text-anchor="middle">food</text>
      <rect x="136" y="216" width="72" height="24" rx="2" fill="#0a0b0d" stroke="#7a9a8c"/>
      <text x="172" y="232" fill="#7a9a8c" text-anchor="middle">sex</text>
      <rect x="224" y="216" width="72" height="24" rx="2" fill="#0a0b0d" stroke="#7a9a8c"/>
      <text x="260" y="232" fill="#7a9a8c" text-anchor="middle">music</text>
      <rect x="312" y="216" width="72" height="24" rx="2" fill="#0a0b0d" stroke="#7a9a8c"/>
      <text x="348" y="232" fill="#7a9a8c" text-anchor="middle">win</text>
    </g>
    <path d="M420 228 L480 228" stroke="#7a9a8c" stroke-width="1.2" marker-end="url(#pm5-pm-grn)"/>
    <defs><marker id="pm5-pm-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#7a9a8c"/></marker></defs>
    <rect x="488" y="210" width="128" height="36" rx="3" fill="#0f1210" stroke="#7a9a8c" stroke-width="1.2">
      <animate attributeName="stroke-opacity" values=".55;1;.55" dur="2.5s" repeatCount="indefinite"/>
    </rect>
    <text x="552" y="226" fill="#7a9a8c" font-size="9" text-anchor="middle">~4 receptor</text>
    <text x="552" y="238" fill="#7a9a8c" font-size="9" text-anchor="middle">classes</text>
    <circle r="2.5" fill="#7a9a8c"><animateMotion dur="2.2s" repeatCount="indefinite" path="M84 240 L552 240"/></circle>
    <circle r="2.5" fill="#7a9a8c"><animateMotion dur="2.2s" repeatCount="indefinite" begin=".5s" path="M172 240 L552 240"/></circle>
    <circle r="2.5" fill="#7a9a8c"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1s" path="M260 240 L552 240"/></circle>
    <text x="640" y="232" fill="#555c64" font-family="ui-monospace,monospace" font-size="8">synthetic agonists · interchangeable SKUs</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Berridge mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">BERRIDGE · WANTING vs LIKING</text>
    <rect x="16" y="40" width="328" height="80" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="60" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">wanting (large)</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">dopamine pursuit · runs without joy</text>
    <rect x="16" y="140" width="328" height="56" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="160" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">liking (small hot spots)</text>
    <text x="28" y="178" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">hedonic islands · NAc · VP</text>
    <rect x="16" y="220" width="328" height="48" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="240" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">red has empires</text>
    <text x="28" y="258" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">green has tricks</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Wanting ≠ liking. Pleasure clusters; pursuit can run without joy.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-leknes">
  <div class="pm-fig-head">
    <span class="pm-fig-n">2b</span>
    <h4>Leknes &amp; Tracey: shared opioid/dopamine substrate — substitutability</h4>
    <a class="pm-cite" href="https://www.nature.com/articles/nrn2333">Leknes &amp; Tracey 2008</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 220" role="img" aria-label="Common neurobiology for pain and pleasure with mutual inhibition">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">common neurobiology · mutual inhibition of pain and reward</text>
    <ellipse cx="380" cy="108" rx="120" ry="44" fill="rgba(184,154,106,.08)" stroke="rgba(184,154,106,.35)"/>
    <text x="380" y="104" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">μ-opioid · dopamine</text>
    <text x="380" y="118" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">shared mesolimbic substrate</text>
    <rect x="60" y="72" width="140" height="40" rx="3" fill="#120909" stroke="#b85c55"/>
    <text x="130" y="96" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">pain circuit</text>
    <rect x="560" y="72" width="140" height="40" rx="3" fill="#0f1210" stroke="#7a9a8c"/>
    <text x="630" y="96" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">reward circuit</text>
    <path d="M200 92 Q290 92 260 108" fill="none" stroke="#b85c55" stroke-width="1.2"/>
    <path d="M560 92 Q470 92 500 108" fill="none" stroke="#7a9a8c" stroke-width="1.2"/>
    <path d="M320 108 Q380 148 440 108" fill="none" stroke="rgba(235,228,220,.2)" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="380" y="168" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">mutual inhibition ↔</text>
    <circle r="3" fill="#b85c55"><animateMotion dur="2.5s" repeatCount="indefinite" path="M200 92 Q290 92 260 108"/></circle>
    <circle r="3" fill="#7a9a8c"><animateMotion dur="2.5s" repeatCount="indefinite" begin=".4s" path="M560 92 Q470 92 500 108"/></circle>
    <text x="380" y="200" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">fentanyl hijacks the same substrate → pleasure SKUs compress · grief does not</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Leknes mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">LEKNES · RELIEF</text>
    <rect x="16" y="40" width="328" height="44" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="60" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">threat / pain</text>
    <line x1="180" y1="84" x2="180" y2="96" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="120" width="328" height="44" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="140" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">relief</text>
    <line x1="180" y1="164" x2="180" y2="176" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="200" width="328" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="220" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">reward feeling</text>
    <line x1="180" y1="244" x2="180" y2="256" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="280" width="328" height="44" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="300" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">pain still central</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Relief is pleasure with a history of threat — green borrows from red.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-baumeister">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3a</span>
    <h4>Baumeister: bad is stronger than good across domains</h4>
    <a class="pm-cite" href="https://doi.org/10.1037/1089-2680.5.4.323">Baumeister et al. 2001</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 260" role="img" aria-label="Negative events outweigh positive across psychological domains">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">cross-domain review · effect size asymmetry</text>
    <line x1="380" y1="44" x2="380" y2="220" stroke="rgba(235,228,220,.12)" stroke-width="1"/>
    <g font-family="ui-monospace,monospace" font-size="9">
      <text x="380" y="38" fill="#555c64" text-anchor="middle">neutral</text>
      <rect x="120" y="60" width="240" height="22" rx="2" fill="#7a9a8c" opacity=".55"><animate attributeName="width" from="0" to="240" dur="1.2s" fill="freeze"/></rect>
      <text x="370" y="75" fill="#7a9a8c" text-anchor="end">positive events</text>
      <rect x="120" y="96" width="380" height="22" rx="2" fill="#b85c55" opacity=".7"><animate attributeName="width" from="0" to="380" dur="1.4s" begin=".2s" fill="freeze"/></rect>
      <text x="510" y="111" fill="#b85c55">negative events</text>
      <text x="120" y="140" fill="#555c64">trauma · relationships · learning · self-concept · almost no exceptions</text>
    </g>
    <g transform="translate(120 160)">
      <text x="0" y="0" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">information processing depth →</text>
      <rect x="0" y="8" width="120" height="14" rx="2" fill="#7a9a8c" opacity=".4"/>
      <rect x="0" y="8" width="220" height="14" rx="2" fill="#b85c55" opacity=".55"><animate attributeName="width" from="120" to="220" dur="2s" repeatCount="indefinite" direction="alternate"/></rect>
      <text x="230" y="19" fill="#b85c55" font-family="ui-monospace,monospace" font-size="8">negative weighed more thoroughly</text>
    </g></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Baumeister mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">BAUMEISTER · BAD > GOOD</text>
    <text x="16" y="48" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10">matched bad event</text>
    <rect x="16" y="54" width="280" height="18" fill="#b85c55"/>
    <text x="16" y="96" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10">matched good event</text>
    <rect x="16" y="102" width="110" height="18" fill="#7a9a8c"/>
    <rect x="16" y="150" width="328" height="48" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="170" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">scale tips red</text>
    <text x="28" y="188" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">harm writes heavier ink</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Bad events outweigh matched good ones. Harm writes in heavier ink.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-rozin">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3b</span>
    <h4>Rozin &amp; Royzman: negative differentiation — suffering is more varied</h4>
    <a class="pm-cite" href="https://doi.org/10.1207/S15327957PSPR0504_2">Rozin &amp; Royzman 2001</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 260" role="img" aria-label="Negative states are more varied with richer representations than positive states">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">negative differentiation · cardinality of affective states</text>
    <g transform="translate(100 50)">
      <text x="80" y="0" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">positive</text>
      <g fill="#7a9a8c" opacity=".6">
        <circle cx="50" cy="40" r="6"/><circle cx="80" cy="55" r="5"/><circle cx="110" cy="38" r="5"/><circle cx="70" cy="70" r="4"/>
      </g>
      <text x="80" y="100" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">fewer distinct categories</text>
    </g>
    <g transform="translate(420 50)">
      <text x="120" y="0" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">negative</text>
      <g fill="#b85c55" opacity=".7">
        <circle cx="30" cy="30" r="5"><animate attributeName="cy" values="30;34;30" dur="2.5s" repeatCount="indefinite"/></circle>
        <circle cx="60" cy="45" r="6"><animate attributeName="cy" values="45;40;45" dur="2.2s" repeatCount="indefinite"/></circle>
        <circle cx="90" cy="28" r="5"><animate attributeName="cy" values="28;32;28" dur="2.8s" repeatCount="indefinite"/></circle>
        <circle cx="120" cy="50" r="5"><animate attributeName="cy" values="50;46;50" dur="2.4s" repeatCount="indefinite"/></circle>
        <circle cx="150" cy="35" r="6"><animate attributeName="cy" values="35;39;35" dur="2.6s" repeatCount="indefinite"/></circle>
        <circle cx="180" cy="55" r="4"><animate attributeName="cy" values="55;51;55" dur="2.3s" repeatCount="indefinite"/></circle>
        <circle cx="75" cy="68" r="5"><animate attributeName="cy" values="68;64;68" dur="2.7s" repeatCount="indefinite"/></circle>
        <circle cx="135" cy="72" r="5"><animate attributeName="cy" values="72;68;72" dur="2.1s" repeatCount="indefinite"/></circle>
        <circle cx="200" cy="42" r="4"><animate attributeName="cy" values="42;38;42" dur="2.9s" repeatCount="indefinite"/></circle>
      </g>
      <text x="120" y="100" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">richer representations · wider response repertoire</text>
    </g>
    <text x="380" y="200" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">hardware enumerates suffering faster than it compresses bliss</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Rozin mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">ROZIN · CONTAMINATION</text>
    <rect x="16" y="40" width="156" height="56" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="60" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">good stays local</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">few neighbors</text>
    <rect x="188" y="40" width="156" height="120" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="60" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">bad spreads</text>
    <text x="200" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">stain · memory · identity</text>
    <line x1="172" y1="68" x2="188" y2="68" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="120" width="156" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="140" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">one bad event</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Bad spreads to neighbors and meaning. Good stays local.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-eisenberger">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3c</span>
    <h4>Eisenberger: social pain without peripheral nociception</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/14500928/">Eisenberger et al. 2003</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 240" role="img" aria-label="Social exclusion activates dorsal anterior cingulate pain circuitry">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">Cyberball exclusion · fMRI · no somatic injury</text>
    <rect x="60" y="48" width="200" height="72" rx="4" fill="#0a0b0d" stroke="rgba(138,145,153,.4)"/>
    <text x="160" y="72" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">social exclusion</text>
    <text x="160" y="88" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">passive observer · rejected</text>
    <text x="160" y="108" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">stimulus: ostracism · no tissue damage</text>
    <path d="M260 84 L320 84" stroke="#b89a6a" stroke-width="1.5" marker-end="url(#pm9-pm-a3)"/>
    <defs><marker id="pm9-pm-a3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b89a6a"/></marker></defs>
    <rect x="324" y="48" width="160" height="72" rx="4" fill="#120909" stroke="#b85c55" stroke-width="1.2">
      <animate attributeName="stroke-opacity" values=".5;1;.5" dur="2.5s" repeatCount="indefinite"/>
    </rect>
    <text x="404" y="76" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">dACC activation</text>
    <text x="404" y="92" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">affective pain matrix</text>
    <path d="M484 84 L544 84" stroke="#b85c55" stroke-width="1.5" marker-end="url(#pm9-pm-a3)"/>
    <rect x="548" y="48" width="152" height="72" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"/>
    <text x="624" y="76" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">reported distress</text>
    <text x="624" y="92" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">psychological suffering state</text>
    <circle r="3" fill="#b89a6a"><animateMotion dur="2.8s" repeatCount="indefinite" path="M160 120 L160 148 L404 148 L404 120"/></circle>
    <text x="380" y="180" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">new pain dimensions · same finite channels for engineered comfort</text>
    <rect x="200" y="196" width="360" height="28" rx="3" fill="none" stroke="rgba(184,92,85,.35)" stroke-dasharray="4 3"/>
    <text x="380" y="214" fill="#b85c55" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">peripheral nociceptors: inactive</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Eisenberger mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">EISENBERGER · SOCIAL PAIN</text>
    <rect x="16" y="44" width="328" height="48" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="64" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">ostracism · rejection</text>
    <text x="28" y="82" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">face · silence · exile</text>
    <line x1="180" y1="92" x2="180" y2="120" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="124" width="328" height="48" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="144" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">dACC · anterior insula</text>
    <text x="28" y="162" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">bodily hurt circuits</text>
    <line x1="180" y1="172" x2="180" y2="200" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="204" width="328" height="48" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="224" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">social wound = bodily alarm</text>
</svg>
  </div>
  

  <p class="pm-fig-cap">Social exclusion recruits the same circuits as bodily hurt.</p>
</figure><figure class="pm-fig pm-fig-evidence" id="fig-lazarus">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3d</span>
    <h4>Lazarus: same stressor, different suffering by appraisal frame</h4>
    <a class="pm-cite" href="https://archive.org/details/stressappraisalc0000laza">Lazarus &amp; Folkman 1984</a>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 760 220" role="img" aria-label="Cognitive appraisal transforms identical stressors into distinct suffering states">    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">stress · appraisal · coping · independent suffering axis</text>
    <rect x="300" y="44" width="160" height="40" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.2)"/>
    <text x="380" y="68" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">identical injury / loss</text>
    <path d="M380 84 L380 108" stroke="rgba(235,228,220,.2)"/>
    <path d="M380 108 L120 132" stroke="rgba(184,92,85,.35)"/>
    <path d="M380 108 L380 132" stroke="rgba(184,92,85,.35)"/>
    <path d="M380 108 L640 132" stroke="rgba(184,92,85,.35)"/>
    <g font-family="ui-monospace,monospace" font-size="9">
      <rect x="40" y="132" width="160" height="52" rx="3" fill="#120909" stroke="#b85c55"><animate attributeName="opacity" values=".7;1;.7" dur="3s" begin="0s" repeatCount="indefinite"/></rect>
      <text x="120" y="154" fill="#b85c55" text-anchor="middle">injustice frame</text>
      <text x="120" y="170" fill="#555c64" text-anchor="middle">rage · betrayal suffering</text>
      <rect x="300" y="132" width="160" height="52" rx="3" fill="#120909" stroke="#b89a6a"><animate attributeName="opacity" values=".7;1;.7" dur="3s" begin="1s" repeatCount="indefinite"/></rect>
      <text x="380" y="154" fill="#b89a6a" text-anchor="middle">fate frame</text>
      <text x="380" y="170" fill="#555c64" text-anchor="middle">grief · helplessness</text>
      <rect x="560" y="132" width="160" height="52" rx="3" fill="#120909" stroke="#8a9199"><animate attributeName="opacity" values=".7;1;.7" dur="3s" begin="2s" repeatCount="indefinite"/></rect>
      <text x="640" y="154" fill="#8a9199" text-anchor="middle">self-blame frame</text>
      <text x="640" y="170" fill="#555c64" text-anchor="middle">shame · guilt suffering</text>
    </g>
    <text x="380" y="208" fill="#b85c55" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">3 appraisals × same nociception → 3 non-collapsing pain states</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Lazarus mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">LAZARUS · APPRAISAL</text>
    <rect x="16" y="40" width="328" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="60" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">event</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">stimulus arrives</text>
    <line x1="180" y1="84" x2="180" y2="94" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="110" width="328" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="130" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">primary appraisal</text>
    <text x="28" y="148" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">threat · loss · challenge?</text>
    <line x1="180" y1="154" x2="180" y2="164" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="180" width="328" height="44" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="200" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">secondary appraisal</text>
    <text x="28" y="218" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">cope? · blame?</text>
    <line x1="180" y1="224" x2="180" y2="234" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="250" width="328" height="44" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="270" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">felt pain</text>
    <text x="28" y="288" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">injury · insult · doom</text>
</svg>
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
  <div class="pm-fig-wide">
  <svg viewBox="0 0 920 320" role="img" aria-label="Genesis as QA report">    <rect width="920" height="320" fill="#040506"/>
<text x="40" y="32" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700">GENESIS 2–3 · DEFECT REPORT</text>
    <text x="40" y="70" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">TRADITIONAL READ</text>
    <text x="200" y="70" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11">disobedience → curse → guilt</text>
    <text x="40" y="110" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10">DEFECT READ</text>
    <text x="200" y="110" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11">embodied vulnerability → reproductive trauma → mortality</text>
    <rect x="40" y="140" width="840" height="120" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="4"/>
    <text x="56" y="168" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11">dust → breath → command → tree → eye opens</text>
    <text x="56" y="198" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11">birth pain · toil · grave (hardware properties, not moral invoice)</text>
    <rect x="56" y="218" width="14" height="14" fill="#b85c55"/><text x="80" y="230" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11">root cause: design architecture (not user error)</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Genesis mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">GENESIS · DEFECT REPORT</text>
    <rect x="16" y="40" width="328" height="40" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="60" fill="#555c64" font-family="ui-monospace,monospace" font-size="11" font-weight="600">traditional read</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">disobedience → guilt</text>
    <rect x="16" y="92" width="328" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="112" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">defect read</text>
    <text x="28" y="130" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">vulnerability → mortality</text>
    <rect x="16" y="148" width="328" height="36" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="168" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">dust → breath → tree</text>
    <rect x="16" y="192" width="328" height="36" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="212" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">eyes open · self-report</text>
    <rect x="16" y="236" width="328" height="36" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="256" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">birth pain · toil · grave</text>
    <rect x="16" y="288" width="328" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="308" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">root cause: design</text>
    <text x="28" y="326" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">not user error</text>
</svg>
  </div>
  
  <p class="pm-fig-cap">The curse list matches a product defect table once you stop assigning guilt downstream.</p>
</figure>
<figure class="pm-fig pm-fig-evidence" id="pmx-04">
  <div class="pm-fig-head">
    <span class="pm-fig-n">W4</span>
    <h4>Original sin inversion</h4>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 920 320" role="img" aria-label="Original sin inversion">    <rect width="920" height="320" fill="#040506"/>
<text x="40" y="32" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700">ORIGINAL SIN · TWO READINGS</text>
    <text x="40" y="68" fill="#555c64" font-family="ui-monospace,monospace" font-size="11">WARRANTY THEOLOGY</text>
    <text x="40" y="92" fill="#8a9199" font-family="ui-monospace,monospace" font-size="12">disobedience → Fall → suffering → redemption ✝</text>
    <text x="40" y="140" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11">DEFECT REPORT</text>
    <text x="40" y="164" fill="#b85c55" font-family="ui-monospace,monospace" font-size="12">pain-machine architecture → consciousness of harm → blame narrative</text>
    <text x="40" y="220" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="13" font-weight="700">fault moves upstream ↑</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Original sin mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">ORIGINAL SIN · INVERSION</text>
    <rect x="16" y="40" width="328" height="56" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="60" fill="#555c64" font-family="ui-monospace,monospace" font-size="11" font-weight="600">warranty theology</text>
    <text x="28" y="78" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">creature guilty → redeem</text>
    <line x1="180" y1="96" x2="180" y2="116" stroke="#b89a6a" stroke-width="1.2" opacity="0.55"/>
    <rect x="16" y="120" width="328" height="56" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="140" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">defect report</text>
    <text x="28" y="158" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">design guilty → mandate</text>
    <rect x="16" y="196" width="328" height="40" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="216" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">fault moves upstream ↑</text>
</svg>
  </div>
  
  <p class="pm-fig-cap">Standard theology sends guilt to the creature. The defect report sends it to the design.</p>
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
  <div class="pm-fig-wide">
  <svg viewBox="0 0 920 320" role="img" aria-label="Three warranty regimes">    <rect width="920" height="320" fill="#040506"/>
<text x="40" y="28" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700">THREE WARRANTY REGIMES · CONVERGENCE</text>
    <text x="80" y="58" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">Christianity</text>
    <text x="320" y="58" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">Islam</text>
    <text x="560" y="58" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">Secular humanism</text>
    <text x="800" y="58" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">All three</text>
    <text x="40" y="88" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">sacred object</text>
    <rect x="80" y="72" width="160" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="2"/><text x="160" y="90" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">imago Dei · cross</text>
    <rect x="260" y="72" width="160" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="2"/><text x="340" y="90" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">fitra · amanah</text>
    <rect x="440" y="72" width="160" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="2"/><text x="520" y="90" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">dignity · Factor X</text>
    <text x="40" y="128" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">repair OK</text>
    <rect x="80" y="112" width="160" height="28" fill="#0d1a12" stroke="#7a9a8c" rx="2"/><text x="160" y="130" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">medicine · charity</text>
    <rect x="260" y="112" width="160" height="28" fill="#0d1a12" stroke="#7a9a8c" rx="2"/><text x="340" y="130" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">harm removal</text>
    <rect x="440" y="112" width="160" height="28" fill="#0d1a12" stroke="#7a9a8c" rx="2"/><text x="520" y="130" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">therapy · rights</text>
    <text x="40" y="168" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">exit forbidden</text>
    <rect x="80" y="152" width="160" height="28" fill="#120909" stroke="#b85c55" rx="2"/><text x="160" y="170" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">abandon flesh</text>
    <rect x="260" y="152" width="160" height="28" fill="#120909" stroke="#b85c55" rx="2"/><text x="340" y="170" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">alter creation</text>
    <rect x="440" y="152" width="160" height="28" fill="#120909" stroke="#b85c55" rx="2"/><text x="520" y="170" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">posthuman taboo</text>
    <rect x="640" y="112" width="240" height="68" fill="#120909" stroke="#b89a6a" rx="3"/>
    <text x="760" y="140" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700" text-anchor="middle">repair yes</text>
    <text x="760" y="162" fill="#b85c55" font-family="ui-monospace,monospace" font-size="12" font-weight="700" text-anchor="middle">exit no</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Three locks mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">THREE LOCKS · SAME CLAUSE</text>
    <text x="16" y="50" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">Christianity</text>
    <rect x="16" y="56" width="328" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="76" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">imago Dei</text>
    <rect x="16" y="88" width="156" height="28" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="108" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✓ medicine · charity</text>
    <rect x="188" y="88" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="108" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✗ abandon flesh</text>
    <text x="16" y="142" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">Islam</text>
    <rect x="16" y="148" width="328" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="168" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">fitra · amanah</text>
    <rect x="16" y="180" width="156" height="28" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="200" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✓ harm removal</text>
    <rect x="188" y="180" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="200" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✗ alter creation</text>
    <text x="16" y="234" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">Secular</text>
    <rect x="16" y="240" width="328" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.12)" rx="3"/>
    <text x="28" y="260" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" font-weight="600">dignity · Factor X</text>
    <rect x="16" y="272" width="156" height="28" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="292" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✓ therapy · rights</text>
    <rect x="188" y="272" width="156" height="28" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="200" y="292" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✗ posthuman taboo</text>
    <rect x="16" y="320" width="328" height="36" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="340" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">all three: repair yes · exit no</text>
</svg>
  </div>
  
  <p class="pm-fig-cap">Different heavens, same lock: each permits repair under its authority but forbids exit from the human format.</p>
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
  <div class="pm-fig-wide">
  <svg viewBox="0 0 920 320" role="img" aria-label="Mandate ladder: therapy to exit">    <rect width="920" height="320" fill="#040506"/>
<text x="40" y="28" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700">MANDATE LADDER · THERAPY → EXIT</text>
    <rect x="40" y="48" width="200" height="32" fill="#0a0b0d" stroke="#7a9a8c" rx="3"/><text x="140" y="68" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">pain medicine</text>
    <rect x="40" y="88" width="200" height="32" fill="#0a0b0d" stroke="#7a9a8c" rx="3"/><text x="140" y="108" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">prosthetics · psychiatry</text>
    <rect x="40" y="128" width="200" height="32" fill="#0a0b0d" stroke="#7a9a8c" rx="3"/><text x="140" y="148" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">gene repair · neural IF</text>
    <line x1="40" y1="180" x2="880" y2="180" stroke="#b89a6a" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="460" y="172" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>
    <rect x="40" y="196" width="200" height="32" fill="#0a0b0d" stroke="#b89a6a" rx="3"/><text x="140" y="216" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">affect editing</text>
    <rect x="40" y="236" width="200" height="32" fill="#0a0b0d" stroke="#b89a6a" rx="3"/><text x="140" y="256" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">synthetic body</text>
    <rect x="40" y="276" width="200" height="32" fill="#0a0b0d" stroke="#b89a6a" rx="3"/><text x="140" y="296" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">substrate migration</text>
    <rect x="280" y="196" width="620" height="112" fill="#120909" stroke="#b85c55" rx="4"/>
    <text x="296" y="222" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="700">VETO BANDS (all three regimes)</text>
    <text x="296" y="248" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11">Christian: resurrection body · natural law</text>
    <text x="296" y="272" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11">Islam: fitra · Q 4:119 altering creation</text>
    <text x="296" y="296" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11">Secular: dignity · species continuity · Factor X</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Mandate mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">MANDATE LADDER</text>
    <rect x="16" y="36" width="328" height="32" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="56" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✓ pain medicine</text>
    <rect x="16" y="72" width="328" height="32" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="92" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✓ prosthetics · psychiatry</text>
    <rect x="16" y="108" width="328" height="32" fill="#0d1a12" stroke="#7a9a8c" rx="3"/>
    <text x="28" y="128" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="11" font-weight="600">✓ gene · neural repair</text>
    <line x1="16" y1="148" x2="344" y2="148" stroke="#b89a6a" stroke-dasharray="4 3"/>
    <text x="180" y="164" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>
    <rect x="16" y="176" width="328" height="32" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="196" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">↗ affect editing</text>
    <rect x="16" y="212" width="328" height="32" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="232" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">↗ synthetic body</text>
    <rect x="16" y="248" width="328" height="32" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="268" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">↗ substrate migration</text>
    <rect x="16" y="292" width="328" height="36" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="312" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">all regimes veto here</text>
</svg>
  </div>
  
  <p class="pm-fig-cap">Every regime blesses repair until repair becomes escape from the inherited chassis.</p>
</figure>
<figure class="pm-fig pm-fig-evidence" id="pmx-11">
  <div class="pm-fig-head">
    <span class="pm-fig-n">WB</span>
    <h4>Suffering audit dashboard</h4>
  </div>
  <div class="pm-fig-wide">
  <svg viewBox="0 0 920 320" role="img" aria-label="Suffering audit dashboard">    <rect width="920" height="320" fill="#040506"/>
<text x="40" y="32" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="12" font-weight="700">SUFFERING AUDIT · GOVERNANCE METRIC</text>
    <rect x="40" y="56" width="200" height="64" fill="#0a0b0d" stroke="#b85c55" rx="3"/>
    <text x="56" y="80" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">involuntary pain-hours</text>
    <text x="56" y="108" fill="#b85c55" font-family="ui-monospace,monospace" font-size="22" font-weight="700">↓ target zero</text>
    <rect x="260" y="56" width="200" height="64" fill="#0a0b0d" stroke="#b85c55" rx="3"/>
    <text x="276" y="80" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">chronic pain prevalence</text>
    <text x="276" y="108" fill="#b85c55" font-family="ui-monospace,monospace" font-size="22" font-weight="700">20%+</text>
    <rect x="480" y="56" width="200" height="64" fill="#0a0b0d" stroke="#b85c55" rx="3"/>
    <text x="496" y="80" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">severe mental distress</text>
    <text x="496" y="108" fill="#b85c55" font-family="ui-monospace,monospace" font-size="22" font-weight="700">970M</text>
    <rect x="700" y="56" width="180" height="64" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="716" y="80" fill="#555c64" font-family="ui-monospace,monospace" font-size="10">access to exit tech</text>
    <text x="716" y="108" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="22" font-weight="700">~0%</text>
    <text x="40" y="160" fill="#8a9199" font-family="ui-monospace,monospace" font-size="11">policy levers: analgesia · psychiatric repair · morphological freedom · personhood law · AI safety</text>
    <polyline points="40,280 200,250 400,220 600,170 880,100" fill="none" stroke="#b89a6a" stroke-width="2"/>
    <text x="40" y="300" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11">abolition target (not optimization of the warranty)</text></svg>
  </div>
  <div class="pm-fig-mobile">
<svg viewBox="0 0 360 520" role="img" aria-label="Audit mobile">
  <rect width="360" height="520" fill="#040506"/>
<text x="16" y="24" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="10" font-weight="700">SUFFERING AUDIT</text>
    <rect x="16" y="36" width="220" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="56" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">involuntary pain-hours</text>
    <text x="260" y="62" fill="#b85c55" font-family="ui-monospace,monospace" font-size="16" font-weight="700">↓ zero</text>
    <rect x="16" y="84" width="220" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="104" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">chronic pain prevalence</text>
    <text x="260" y="110" fill="#b85c55" font-family="ui-monospace,monospace" font-size="16" font-weight="700">20%+</text>
    <rect x="16" y="132" width="220" height="40" fill="#120909" stroke="#b85c55" rx="3"/>
    <text x="28" y="152" fill="#b85c55" font-family="ui-monospace,monospace" font-size="11" font-weight="600">severe mental distress</text>
    <text x="260" y="158" fill="#b85c55" font-family="ui-monospace,monospace" font-size="16" font-weight="700">970M</text>
    <rect x="16" y="180" width="220" height="40" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="200" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">access to exit tech</text>
    <text x="260" y="206" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="16" font-weight="700">~0%</text>
    <rect x="16" y="236" width="328" height="40" fill="#0a0b0d" stroke="#b89a6a" rx="3"/>
    <text x="28" y="256" fill="#b89a6a" font-family="ui-monospace,monospace" font-size="11" font-weight="600">abolition target</text>
    <text x="28" y="274" fill="#555c64" font-family="ui-monospace,monospace" font-size="9">not warranty optimization</text>
</svg>
  </div>
  
  <p class="pm-fig-cap">Count involuntary suffering instead of revering the inherited human format.</p>
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
<script type="module" src="/research/pain_machines/brain3d.js?v=6"></script>
<script src="/research/pain_machines/pm-compute.js?v=2" defer></script>

</div>
