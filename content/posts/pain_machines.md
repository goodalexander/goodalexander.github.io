---
author: ["goodalexander"]
title: "Pain Machines"
date: 2026-05-23T20:00:00Z
draft: false
summary: "Original Sin was not disobedience. It was shipping a creature whose suffering-space is N orders of magnitude larger than its pleasure-space."
categories: ["philosophy"]
tags: ["post fiat", "philosophy", "long-form"]
ShowToc: true
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
  font-variant-ligatures: common-ligatures;
}
.pm * { box-sizing: border-box; }
.pm p, .pm li {
  color: var(--muted);
  line-height: 1.65;
  max-width: 68ch;
}
.pm h3 {
  margin: 0 0 .35rem;
  font-size: .95rem;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--dim);
}
.pm-compute {
  margin: 2rem 0;
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
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .82rem;
  font-weight: 500;
  color: var(--ink);
}
.pm-profile {
  display: flex;
  gap: .35rem;
  flex-wrap: wrap;
}
.pm-profile button {
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  font: 500 .75rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
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
.pm-src {
  margin: 0;
  padding: 1rem 1rem 1rem 1.1rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--line);
  background: #060708;
  color: #c5bfb7;
  font: 400 .74rem/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  -webkit-overflow-scrolling: touch;
}
.pm-src .c { color: #5f6b73; }
.pm-src .k { color: #9a7bff; }
.pm-src .n { color: #b89a6a; }
.pm-src .s { color: #7a9a8c; }
.pm-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border-bottom: 1px solid var(--line);
}
.pm-metric {
  padding: .85rem 1rem;
  background: var(--panel);
}
.pm-metric b {
  display: block;
  font: 500 1.35rem/1.1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.pm-metric span {
  display: block;
  margin-top: .25rem;
  font-size: .72rem;
  color: var(--dim);
  line-height: 1.35;
}
.pm-metric.p b { color: var(--pleasure); }
.pm-metric.n b { color: var(--pain); }
.pm-metric.r b { color: var(--gold); }
.pm-chart {
  padding: .5rem .75rem 1rem;
  min-height: 300px;
}
.pm-chart + .pm-chart {
  border-top: 1px solid var(--line);
}
.pm-chart-cap {
  padding: .85rem 1rem 0;
  font-size: .72rem;
  color: var(--dim);
  letter-spacing: .03em;
  text-transform: uppercase;
}
.pm-chart-cap strong {
  display: block;
  margin-bottom: .15rem;
  color: var(--muted);
  font-size: .78rem;
  font-weight: 500;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.pm-json-wrap {
  border-top: 1px solid var(--line);
}
.pm-json-wrap summary {
  padding: .65rem 1rem;
  cursor: pointer;
  font: 500 .75rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--dim);
  list-style: none;
  touch-action: manipulation;
  min-height: 44px;
  display: flex;
  align-items: center;
}
.pm-json-wrap summary::-webkit-details-marker { display: none; }
.pm-json-wrap summary::before {
  content: "▸";
  margin-right: .5rem;
  color: var(--muted);
}
.pm-json-wrap[open] summary::before { content: "▾"; }
.pm-json-wrap summary:hover { color: var(--muted); }
.pm-chart svg {
  display: block;
  width: 100%;
  height: auto;
}
.pm-json {
  margin: 0;
  padding: 1rem;
  max-height: 420px;
  overflow: auto;
  background: #060708;
  color: #aeb6bf;
  font: 400 .72rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  border-top: 1px solid var(--line);
  -webkit-overflow-scrolling: touch;
}
.pm-foot {
  padding: .65rem 1rem;
  border-top: 1px solid var(--line);
  font-size: .72rem;
  color: var(--dim);
  line-height: 1.45;
}
.pm-foot a { color: var(--muted); }
.pm-appendix {
  margin-top: 2.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}
.pm-appendix h2 {
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: .03em;
  margin: 0 0 1rem;
  color: var(--ink);
}
.pm-appendix h4 {
  margin: 1.35rem 0 .55rem;
  font-size: .78rem;
  font-weight: 500;
  letter-spacing: .05em;
  text-transform: uppercase;
  color: var(--dim);
}
.pm-src-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.pm-src-list li {
  margin-bottom: .7rem;
  padding-bottom: .7rem;
  border-bottom: 1px solid rgba(235, 228, 220, .05);
  font-size: .8rem;
  line-height: 1.55;
  color: var(--muted);
  max-width: 76ch;
}
.pm-src-list li:last-child { border-bottom: 0; }
.pm-src-list a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid rgba(235, 228, 220, .18);
}
.pm-src-list a:hover { border-bottom-color: var(--gold); }
.pm-src-list em { color: var(--dim); font-style: normal; }
.pm-src-list .use { display: block; margin-top: .2rem; color: var(--dim); font-size: .74rem; }
.pm-evidence { margin: 2.5rem 0; }
.pm-evidence > h3 {
  margin-bottom: 1rem;
  font-size: .82rem;
  letter-spacing: .08em;
}
.pm-fig {
  margin: 0 0 1.35rem;
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
  font: 600 .68rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--gold);
  letter-spacing: .06em;
}
.pm-fig-head h4 {
  margin: 0;
  flex: 1 1 12rem;
  font-size: .88rem;
  font-weight: 500;
  letter-spacing: .01em;
  text-transform: none;
  color: var(--ink);
}
.pm-cite {
  font: 500 .68rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px solid rgba(235, 228, 220, .16);
  white-space: nowrap;
}
.pm-cite:hover { color: var(--gold); border-bottom-color: var(--gold); }
.pm-fig svg {
  display: block;
  width: 100%;
  height: auto;
}
.pm-arg {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  background: var(--line);
  border-top: 1px solid var(--line);
}
.pm-arg-cell {
  padding: .9rem 1rem 1rem;
  background: linear-gradient(165deg, #0b0c0e 0%, #060708 100%);
  min-height: 100%;
}
.pm-arg-label {
  display: inline-block;
  margin-bottom: .55rem;
  padding: .22rem .45rem;
  border: 1px solid rgba(235, 228, 220, .08);
  border-radius: 2px;
  font: 600 .64rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.pm-arg-cell.claim { box-shadow: inset 0 2px 0 var(--ink); }
.pm-arg-cell.claim .pm-arg-label { color: var(--ink); border-color: rgba(235, 228, 220, .14); background: rgba(235, 228, 220, .04); }
.pm-arg-cell.warrant { box-shadow: inset 0 2px 0 var(--gold); }
.pm-arg-cell.warrant .pm-arg-label { color: var(--gold); border-color: rgba(184, 154, 106, .22); background: rgba(184, 154, 106, .06); }
.pm-arg-cell.impact { box-shadow: inset 0 2px 0 var(--pain); }
.pm-arg-cell.impact .pm-arg-label { color: var(--pain); border-color: rgba(184, 92, 85, .22); background: rgba(184, 92, 85, .06); }
.pm-arg-cell p {
  margin: 0;
  font-size: .78rem;
  line-height: 1.55;
  color: var(--muted);
}
.pm-arg-cell.warrant p { color: #9a9590; font-size: .76rem; }
.pm-arg-cell.impact p { color: #a89894; }
.pm-bridge {
  margin: 1.5rem 0 .25rem;
  font-size: .88rem;
  color: var(--muted);
  max-width: 52ch;
}
.pm-neuro {
  margin: 2.75rem 0 1.5rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line);
}
.pm-neuro > p {
  margin-bottom: 1.25rem;
  max-width: 68ch;
}
.pm-fig-brain { border-width: 1px; }
.pm-brain3d { background: #060708; }
.pm-brain3d-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.85fr);
  gap: 1px;
  background: var(--line);
}
.pm-brain3d-view {
  position: relative;
  height: 520px;
  min-height: 360px;
  background: radial-gradient(ellipse 85% 75% at 50% 45%, rgba(184,92,85,.09), transparent 62%),
              radial-gradient(ellipse 40% 30% at 72% 78%, rgba(122,154,140,.05), transparent 55%),
              #030405;
}
.pm-brain3d-view canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: grab;
}
.pm-brain3d-view canvas:active { cursor: grabbing; }
.pm-brain3d-labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.pm-b3d-label {
  position: absolute;
  left: 0;
  top: 0;
  padding: .2rem .4rem;
  border: 1px solid rgba(235,228,220,.12);
  background: rgba(6,7,8,.82);
  font: 500 .62rem/1.25 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--muted);
  white-space: nowrap;
  opacity: 0;
  transition: opacity .15s ease;
}
.pm-b3d-label strong {
  display: block;
  color: var(--ink);
  font-size: .68rem;
  font-weight: 500;
}
.pm-b3d-label span { color: var(--dim); font-size: .58rem; }
.pm-brain3d-hud {
  position: absolute;
  left: .65rem;
  top: .65rem;
  display: flex;
  flex-wrap: wrap;
  gap: .45rem;
  z-index: 2;
}
.pm-brain3d-metric {
  padding: .45rem .55rem;
  border: 1px solid var(--line);
  background: rgba(10,11,13,.88);
  backdrop-filter: blur(4px);
}
.pm-brain3d-metric b {
  display: block;
  font: 500 1.05rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.pm-brain3d-metric span {
  display: block;
  margin-top: .15rem;
  font-size: .58rem;
  color: var(--dim);
  letter-spacing: .02em;
  text-transform: uppercase;
}
.pm-brain3d-metric.n b { color: var(--pain); }
.pm-brain3d-metric.p b { color: var(--pleasure); }
.pm-brain3d-metric.r b { color: var(--gold); }
.pm-brain3d-readout {
  position: absolute;
  left: .65rem;
  right: .65rem;
  bottom: .55rem;
  margin: 0;
  font-size: .68rem;
  color: var(--dim);
  z-index: 2;
  pointer-events: none;
}
.pm-b3d-compare {
  position: absolute;
  right: .65rem;
  top: .65rem;
  width: min(220px, 42%);
  padding: .6rem .65rem .65rem;
  border: 1px solid var(--line);
  background: rgba(6,7,8,.92);
  backdrop-filter: blur(6px);
  z-index: 3;
  pointer-events: none;
}
.pm-b3d-compare-title {
  margin-bottom: .55rem;
  font: 600 .62rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--dim);
}
.pm-b3d-compare-row {
  margin-bottom: .55rem;
}
.pm-b3d-compare-row:last-of-type { margin-bottom: .45rem; }
.pm-b3d-compare-row span {
  display: block;
  margin-bottom: .2rem;
  font: 500 .62rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--muted);
}
.pm-b3d-compare-row.pain span { color: var(--pain); }
.pm-b3d-compare-row.pleasure span { color: var(--pleasure); }
.pm-b3d-compare-row .track {
  height: 10px;
  background: rgba(235,228,220,.06);
  border: 1px solid rgba(235,228,220,.08);
  overflow: hidden;
}
.pm-b3d-compare-row .fill {
  height: 100%;
  width: 0;
  transition: width .25s ease;
}
.pm-b3d-compare-row.pain .fill { background: linear-gradient(90deg, #7a3530, var(--pain)); }
.pm-b3d-compare-row.pleasure .fill { background: linear-gradient(90deg, #4a6a60, var(--pleasure)); min-width: 6px; }
.pm-b3d-compare-row b {
  display: block;
  margin-top: .2rem;
  font: 500 .68rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.pm-b3d-compare-ratio {
  padding-top: .45rem;
  border-top: 1px solid rgba(235,228,220,.08);
  font: 600 .72rem/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--gold);
}
.pm-b3d-callout {
  position: absolute;
  left: 0;
  top: 0;
  padding: .35rem .55rem;
  border: 1px solid;
  font: 600 .68rem/1.25 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  pointer-events: none;
  z-index: 2;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}
.pm-b3d-callout small {
  display: block;
  margin-top: .15rem;
  font-size: .58rem;
  font-weight: 500;
  opacity: .85;
}
.pm-b3d-callout.pain {
  color: var(--pain);
  border-color: rgba(184,92,85,.45);
  background: rgba(18,9,9,.88);
}
.pm-b3d-callout.pleasure {
  color: var(--pleasure);
  border-color: rgba(122,154,140,.45);
  background: rgba(10,14,12,.88);
}
.pm-brain3d-controls {
  padding: .75rem .85rem .85rem;
  background: var(--panel);
  display: flex;
  flex-direction: column;
  gap: .65rem;
}
.pm-brain3d-controls h5 {
  margin: 0 0 .15rem;
  font-size: .72rem;
  font-weight: 500;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--dim);
}
.pm-b3d-slider label {
  display: flex;
  justify-content: space-between;
  gap: .5rem;
  margin-bottom: .25rem;
  font: 500 .68rem/1.2 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--muted);
}
.pm-b3d-slider label em {
  font-style: normal;
  color: var(--dim);
  font-size: .6rem;
}
.pm-b3d-slider label b {
  color: var(--ink);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.pm-b3d-slider input[type="range"] {
  width: 100%;
  height: 28px;
  margin: 0;
  accent-color: var(--gold);
  cursor: pointer;
  touch-action: manipulation;
}
.pm-b3d-slider.pain input[type="range"] { accent-color: var(--pain); }
.pm-b3d-slider.pleasure input[type="range"] { accent-color: var(--pleasure); }
.pm-brain-legend {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem 1.25rem;
  padding: .65rem .85rem;
  border-top: 1px solid rgba(235, 228, 220, .06);
  font: 500 .68rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--dim);
}
.pm-brain-legend span { display: inline-flex; align-items: center; gap: .35rem; }
.pm-brain-legend i {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  font-style: normal;
}
.pm-brain-legend .p-som { background: #b85c55; }
.pm-brain-legend .p-aff { background: #b89a6a; }
.pm-brain-legend .p-cog { background: #9a7b6a; }
.pm-brain-legend .p-soc { background: #8a9199; }
.pm-brain-legend .p-ple { background: #7a9a8c; }
@media (prefers-reduced-motion: reduce) {
  .pm-fig svg animateMotion,
  .pm-fig svg animate,
  .pm-fig svg animateTransform { display: none; }
}
@media (max-width: 720px) {
  .pm-metrics { grid-template-columns: 1fr; }
  .pm-compute-head { align-items: stretch; }
  .pm-profile { width: 100%; }
  .pm-profile button { flex: 1; text-align: center; }
  .pm-fig { overflow-x: auto; }
  .pm-fig svg { min-width: 520px; }
  .pm-brain3d-layout { grid-template-columns: 1fr; }
  .pm-brain3d-view { min-height: 360px; }
  .pm-brain3d-view canvas { min-height: 360px; }
  .pm-b3d-compare { width: min(200px, 88%); left: .65rem; right: auto; top: auto; bottom: 3.2rem; }
  .pm-brain3d-hud { max-width: 52%; }
  .pm-arg { grid-template-columns: 1fr; }
}
</style>

<div class="pm" id="pain-machines">

Genesis frames the bug as disobedience. That is a mislabeled stack trace.

The actual fault is architectural. Clinical psychology and pain medicine have spent decades **inventorying** suffering — the McGill Pain Questionnaire alone lists 78 distinguishable descriptors across sensory, affective, and evaluative domains. Hedonic neuroscience, meanwhile, keeps converging on a **small set of receptor families** that synthetic drugs can hijack interchangeably.

Put those literatures into the same formalism — Cartesian state-space products — and the asymmetry is not poetic. It is countable.

## I. What the clinics already know

<p class="pm-bridge">Each evidence panel below is structured as <strong>Claim → Warrant → Impact</strong>: what the source says, the academic basis, and why it supports the pain-machine thesis.</p>

<div class="pm-evidence">

<h3>Pain multiplies</h3>

<figure class="pm-fig" id="fig-neuromatrix">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1a</span>
    <h4>Neuromatrix: distributed output, not tissue readout</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack 2001</a>
  </div>
  <svg viewBox="0 0 760 340" role="img" aria-label="Melzack neuromatrix: multiple brain inputs converge to pain output">
    <defs>
      <radialGradient id="pm-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#b85c55" stop-opacity=".35"/>
        <stop offset="100%" stop-color="#b85c55" stop-opacity="0"/>
      </radialGradient>
      <filter id="pm-soft"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    <rect width="760" height="340" fill="transparent"/>
    <text x="380" y="28" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">body-self neuromatrix · neurosignature patterns</text>
    <ellipse cx="380" cy="168" rx="92" ry="52" fill="url(#pm-glow)"/>
    <rect x="308" y="138" width="144" height="60" rx="4" fill="#0f1012" stroke="rgba(184,92,85,.55)" stroke-width="1.2"/>
    <text x="380" y="162" fill="#ebe4dc" font-family="ui-monospace,monospace" font-size="11" text-anchor="middle">neuromatrix</text>
    <text x="380" y="178" fill="#8a9199" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">pain output pattern</text>
    <g fill="none" stroke-width="1">
      <path id="pm-p1" d="M380 52 L380 138" stroke="rgba(184,92,85,.25)" stroke-dasharray="4 3"/>
      <path id="pm-p2" d="M88 98 Q234 118 308 158" stroke="rgba(184,154,106,.45)"/>
      <path id="pm-p3" d="M672 98 Q526 118 452 158" stroke="rgba(184,154,106,.45)"/>
      <path id="pm-p4" d="M88 238 Q234 218 308 178" stroke="rgba(184,154,106,.45)"/>
      <path id="pm-p5" d="M672 238 Q526 218 452 178" stroke="rgba(184,154,106,.45)"/>
      <path id="pm-p6" d="M380 288 L380 198" stroke="rgba(184,154,106,.45)"/>
    </g>
    <g font-family="ui-monospace,monospace" font-size="10">
      <rect x="318" y="36" width="124" height="22" rx="3" fill="#0a0b0d" stroke="rgba(184,92,85,.35)"/>
      <text x="380" y="51" fill="#b85c55" text-anchor="middle">somatic input</text>
      <text x="380" y="68" fill="#555c64" font-size="8" text-anchor="middle">one contributor · not sufficient</text>
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
      <path d="M0 0 L48 0" stroke="#b85c55" stroke-width="1.5" marker-end="url(#pm-arr)"/>
      <defs><marker id="pm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b85c55"/></marker></defs>
      <rect x="52" y="-18" width="118" height="36" rx="3" fill="#120909" stroke="#b85c55" stroke-width="1"/>
      <text x="111" y="-2" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">pain experience</text>
      <text x="111" y="12" fill="#8a9199" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">≠ damage magnitude</text>
    </g>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: neuromatrix">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Pain is generated by a distributed neuromatrix — not read directly off tissue damage.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Melzack (2001): the body-self neuromatrix integrates somatic input with appraisal, memory, identity, and context; pain is a neurosignature pattern the network emits — somatic signal is only one contributor.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Each independent input multiplies distinguishable suffering states. You are built to manufacture pain from sparse somatic cues.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-iasp">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1b</span>
    <h4>IASP 2020: sensory and emotional are inseparable</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja et al. 2020</a>
  </div>
  <svg viewBox="0 0 760 260" role="img" aria-label="IASP definition: sensory and emotional channels always co-occur in pain">
    <text x="380" y="24" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">revised IASP definition · two mandatory dimensions</text>
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
    <text x="380" y="238" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">associated with actual or potential tissue damage</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: IASP definition">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Clinically valid pain always combines sensory <em>and</em> emotional experience — never one alone.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Raja et al. (2020) IASP revision defines pain as an unpleasant sensory and emotional experience associated with actual or potential tissue damage — both dimensions are mandatory.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Two non-collapsing axes multiply the state-space. Medicine has no concept of pure nociception without distress — unlike compressible bliss.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-icd11">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1c</span>
    <h4>ICD-11 MG30: seven chronic-pain categories, nested subtypes</h4>
    <a class="pm-cite" href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede et al. 2022</a>
  </div>
  <svg viewBox="0 0 760 340" role="img" aria-label="ICD-11 chronic pain taxonomy with seven top-level categories">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">ICD-11 chapter MG30 · seven top-level categories</text>
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
    <text x="380" y="264" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">7 × subtypes × modifiers = combinatorial clinical space</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: ICD-11">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Official medicine treats chronic pain as a combinatorial, multi-axis construct — not a single diagnosis.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Treede et al. (2022): ICD-11 MG30 lists seven top-level chronic-pain categories, each with nested subtypes plus severity, interference, and psychosocial modifier codes.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>The clinical taxonomy assumes suffering enumerates faster than it collapses. ICD-11 is the pain machine's spec sheet.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-mcgill">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1d</span>
    <h4>McGill MPQ: 78 words because pain factorizes in language</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/1235985/">Melzack 1975</a>
  </div>
  <svg viewBox="0 0 760 280" role="img" aria-label="McGill Pain Questionnaire descriptor inventory across four word classes">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">McGill MPQ · 78 pain descriptors in four word classes</text>
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
    <text x="380" y="228" fill="#b85c55" font-size="10" text-anchor="middle">78 distinguishable pain states — from vocabulary alone, before combinatorics</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: McGill MPQ">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Natural language factorizes pain into far more dimensions than it does pleasure.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Melzack (1975) MPQ inventories 78 pain descriptors — sensory (20), affective (12), evaluative (5), miscellaneous (41) — because clinicians need them.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>We ship a built-in thesaurus for suffering, not bliss. Vocabulary alone is a lower bound on higher pain cardinality.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-price">
  <div class="pm-fig-head">
    <span class="pm-fig-n">1e</span>
    <h4>Price: sensation, unpleasantness, and secondary affect dissociate</h4>
    <a class="pm-cite" href="https://doi.org/10.1126/science.288.5472.1769">Price 2000</a>
  </div>
  <svg viewBox="0 0 760 200" role="img" aria-label="Serial dissociation of pain sensation intensity, unpleasantness, and secondary affect">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">affective dimension of pain · serial processing stages</text>
    <g font-family="ui-monospace,monospace">
      <rect x="40" y="52" width="180" height="56" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.5)"/>
      <text x="130" y="76" fill="#b85c55" font-size="10" text-anchor="middle">sensation intensity</text>
      <text x="130" y="92" fill="#555c64" font-size="8" text-anchor="middle">spinothalamic · SI / SII</text>
      <path d="M220 80 L268 80" stroke="#b85c55" stroke-width="1.5" marker-end="url(#pm-a2)"/>
      <rect x="272" y="52" width="180" height="56" rx="4" fill="#0a0b0d" stroke="rgba(184,154,106,.5)"/>
      <text x="362" y="76" fill="#b89a6a" font-size="10" text-anchor="middle">pain unpleasantness</text>
      <text x="362" y="92" fill="#555c64" font-size="8" text-anchor="middle">ACC · medial thalamus</text>
      <path d="M452 80 L500 80" stroke="#b89a6a" stroke-width="1.5" marker-end="url(#pm-a2)"/>
      <rect x="504" y="52" width="216" height="56" rx="4" fill="#0a0b0d" stroke="rgba(138,145,153,.5)"/>
      <text x="612" y="76" fill="#8a9199" font-size="10" text-anchor="middle">secondary affect</text>
      <text x="612" y="92" fill="#555c64" font-size="8" text-anchor="middle">prefrontal · autonomic · motor plans</text>
      <defs><marker id="pm-a2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b89a6a"/></marker></defs>
    </g>
    <g>
      <rect x="40" y="130" width="680" height="44" rx="3" fill="#060708" stroke="rgba(235,228,220,.08)"/>
      <text x="380" y="150" fill="#8a9199" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">opioid analgesia ↓ unpleasantness more than intensity · stages remain separable</text>
      <text x="380" y="166" fill="#b85c55" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">≠ bliss under fentanyl (pleasure collapses to receptor class)</text>
      <circle r="3" fill="#b85c55"><animateMotion dur="4s" repeatCount="indefinite" path="M130 108 L130 130 L380 152"/></circle>
      <circle r="3" fill="#b89a6a"><animateMotion dur="4s" repeatCount="indefinite" begin=".5s" path="M362 108 L362 130 L380 152"/></circle>
      <circle r="3" fill="#8a9199"><animateMotion dur="4s" repeatCount="indefinite" begin="1s" path="M612 108 L612 130 L380 152"/></circle>
    </g>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Price dissociation">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Pain runs through separable stages — sensation, unpleasantness, secondary affect — not one fungible signal.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Price (2000): cortico-limbic pathways add unpleasantness and secondary affect serially; opioid analgesia reduces unpleasantness more than intensity — stages stay dissociable.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Pain stays multidimensional under pharmacology. Grief, shame, and injustice do not collapse to a receptor hit the way bliss collapses under fentanyl.</p></div>
  </div>
</figure>

<h3>Pleasure compresses</h3>

<figure class="pm-fig" id="fig-berridge">
  <div class="pm-fig-head">
    <span class="pm-fig-n">2a</span>
    <h4>Berridge: small &ldquo;liking&rdquo; hotspots, sprawling &ldquo;wanting&rdquo; system</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/">Berridge &amp; Kringelbach 2015</a>
  </div>
  <svg viewBox="0 0 760 300" role="img" aria-label="Hedonic hotspots versus distributed wanting circuitry with pharmacological collapse">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">pleasure systems · causation vs representation</text>
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
    <path d="M420 228 L480 228" stroke="#7a9a8c" stroke-width="1.2" marker-end="url(#pm-grn)"/>
    <defs><marker id="pm-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#7a9a8c"/></marker></defs>
    <rect x="488" y="210" width="128" height="36" rx="3" fill="#0f1210" stroke="#7a9a8c" stroke-width="1.2">
      <animate attributeName="stroke-opacity" values=".55;1;.55" dur="2.5s" repeatCount="indefinite"/>
    </rect>
    <text x="552" y="226" fill="#7a9a8c" font-size="9" text-anchor="middle">~4 receptor</text>
    <text x="552" y="238" fill="#7a9a8c" font-size="9" text-anchor="middle">classes</text>
    <circle r="2.5" fill="#7a9a8c"><animateMotion dur="2.2s" repeatCount="indefinite" path="M84 240 L552 240"/></circle>
    <circle r="2.5" fill="#7a9a8c"><animateMotion dur="2.2s" repeatCount="indefinite" begin=".5s" path="M172 240 L552 240"/></circle>
    <circle r="2.5" fill="#7a9a8c"><animateMotion dur="2.2s" repeatCount="indefinite" begin="1s" path="M260 240 L552 240"/></circle>
    <text x="640" y="232" fill="#555c64" font-family="ui-monospace,monospace" font-size="8">synthetic agonists · interchangeable SKUs</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Berridge hotspots">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Pleasure causation concentrates in ~3 hedonic hotspots; natural modalities collapse to a handful of receptor classes.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Berridge &amp; Kringelbach (2015): causal &ldquo;liking&rdquo; localizes to NAc, VP, and OFC; food, sex, music, and achievement map to ~4 interchangeable pharmacological classes.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Bliss is compressible firmware. You are not built to enumerate pleasure — you are built to compress it.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-leknes">
  <div class="pm-fig-head">
    <span class="pm-fig-n">2b</span>
    <h4>Leknes &amp; Tracey: shared opioid/dopamine substrate — substitutability</h4>
    <a class="pm-cite" href="https://www.nature.com/articles/nrn2333">Leknes &amp; Tracey 2008</a>
  </div>
  <svg viewBox="0 0 760 220" role="img" aria-label="Common neurobiology for pain and pleasure with mutual inhibition">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">common neurobiology · mutual inhibition of pain and reward</text>
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
    <text x="380" y="200" fill="#7a9a8c" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">fentanyl hijacks the same substrate → pleasure SKUs compress · grief does not</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Leknes shared substrate">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Shared μ-opioid/dopamine circuitry lets synthetics substitute for joy — but not for non-fungible suffering.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Leknes &amp; Tracey (2008): pain and reward circuits overlap in mesolimbic substrate and mutually inhibit; agonists hijack the shared channel.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Comfort has a small pharmacological floor (~11 SKU classes). Suffering's independent dimensions survive drug targeting.</p></div>
  </div>
</figure>

<h3>Bad dominates good — and varies more</h3>

<figure class="pm-fig" id="fig-baumeister">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3a</span>
    <h4>Baumeister: bad is stronger than good across domains</h4>
    <a class="pm-cite" href="https://doi.org/10.1037/1089-2680.5.4.323">Baumeister et al. 2001</a>
  </div>
  <svg viewBox="0 0 760 260" role="img" aria-label="Negative events outweigh positive across psychological domains">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">cross-domain review · effect size asymmetry</text>
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
    </g>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Baumeister negativity">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Negative events outweigh positive ones across nearly every domain of human psychology.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Baumeister et al. (2001): cross-domain review of trauma, relationships, learning, and self-concept finds bad is stronger than good — with almost no exceptions; negative information is processed more deeply.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Firmware registers harm first and discounts delight. Behavioral asymmetry matches the pain-machine cardinality gap.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-rozin">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3b</span>
    <h4>Rozin &amp; Royzman: negative differentiation — suffering is more varied</h4>
    <a class="pm-cite" href="https://doi.org/10.1207/S15327957PSPR0504_2">Rozin &amp; Royzman 2001</a>
  </div>
  <svg viewBox="0 0 760 260" role="img" aria-label="Negative states are more varied with richer representations than positive states">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">negative differentiation · cardinality of affective states</text>
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
    <text x="380" y="200" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">hardware enumerates suffering faster than it compresses bliss</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Rozin differentiation">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Negative states are more varied and finely distinguished than positive ones.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Rozin &amp; Royzman (2001): negative differentiation — negative entities are more varied, yield richer representations, and engage wider behavioral response repertoires than matched positives.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Evolution optimized threat enumeration, not bliss enumeration. The suffering partition of state-space is larger by design.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-eisenberger">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3c</span>
    <h4>Eisenberger: social pain without peripheral nociception</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/14500928/">Eisenberger et al. 2003</a>
  </div>
  <svg viewBox="0 0 760 240" role="img" aria-label="Social exclusion activates dorsal anterior cingulate pain circuitry">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">Cyberball exclusion · fMRI · no somatic injury</text>
    <rect x="60" y="48" width="200" height="72" rx="4" fill="#0a0b0d" stroke="rgba(138,145,153,.4)"/>
    <text x="160" y="72" fill="#8a9199" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">social exclusion</text>
    <text x="160" y="88" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">passive observer · rejected</text>
    <text x="160" y="108" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">stimulus: ostracism, not tissue damage</text>
    <path d="M260 84 L320 84" stroke="#b89a6a" stroke-width="1.5" marker-end="url(#pm-a3)"/>
    <defs><marker id="pm-a3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b89a6a"/></marker></defs>
    <rect x="324" y="48" width="160" height="72" rx="4" fill="#120909" stroke="#b85c55" stroke-width="1.2">
      <animate attributeName="stroke-opacity" values=".5;1;.5" dur="2.5s" repeatCount="indefinite"/>
    </rect>
    <text x="404" y="76" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">dACC activation</text>
    <text x="404" y="92" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">affective pain matrix</text>
    <path d="M484 84 L544 84" stroke="#b85c55" stroke-width="1.5" marker-end="url(#pm-a3)"/>
    <rect x="548" y="48" width="152" height="72" rx="4" fill="#0a0b0d" stroke="rgba(184,92,85,.45)"/>
    <text x="624" y="76" fill="#b85c55" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">reported distress</text>
    <text x="624" y="92" fill="#555c64" font-family="ui-monospace,monospace" font-size="8" text-anchor="middle">psychological suffering state</text>
    <circle r="3" fill="#b89a6a"><animateMotion dur="2.8s" repeatCount="indefinite" path="M160 120 L160 148 L404 148 L404 120"/></circle>
    <text x="380" y="180" fill="#555c64" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">new pain dimensions · same finite channels for engineered comfort</text>
    <rect x="200" y="196" width="360" height="28" rx="3" fill="none" stroke="rgba(184,92,85,.35)" stroke-dasharray="4 3"/>
    <text x="380" y="214" fill="#b85c55" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">peripheral nociceptors: inactive</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Eisenberger social pain">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>Social rejection produces genuine pain without activating peripheral nociceptors.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Eisenberger et al. (2003): Cyberball ostracism activates dACC affective-pain circuitry and reported distress while somatic nociception pathways stay inactive.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Psychology adds a full new dimension to the pain machine. There is no parallel social ingress that expands the pleasure partition.</p></div>
  </div>
</figure>

<figure class="pm-fig" id="fig-lazarus">
  <div class="pm-fig-head">
    <span class="pm-fig-n">3d</span>
    <h4>Lazarus: same stressor, different suffering by appraisal frame</h4>
    <a class="pm-cite" href="https://archive.org/details/stressappraisalc0000laza">Lazarus &amp; Folkman 1984</a>
  </div>
  <svg viewBox="0 0 760 220" role="img" aria-label="Cognitive appraisal transforms identical stressors into distinct suffering states">
    <text x="380" y="22" fill="#555c64" font-family="ui-monospace,monospace" font-size="10" text-anchor="middle">stress · appraisal · coping · independent suffering axis</text>
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
    <text x="380" y="208" fill="#b85c55" font-family="ui-monospace,monospace" font-size="9" text-anchor="middle">3 appraisals × same nociception → 3 non-collapsing pain states</text>
  </svg>
  <div class="pm-arg" role="group" aria-label="Argument: Lazarus appraisal">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>The same injury or loss produces different suffering depending on cognitive appraisal frame.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Lazarus &amp; Folkman (1984): injustice, fate, and self-blame framings transform identical stressors into non-interchangeable affective outputs — appraisal is an independent variable.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Meaning multiplies pain. Appraisal will not collapse under analgesia the way engineered bliss collapses under fentanyl.</p></div>
  </div>
</figure>

</div>

## The neuroarchitecture

The clinical taxonomies above are not arbitrary labels — they track **separable neural routes** on the same organ. Use the 3D map below: drag to rotate, adjust sliders to light up pathways, and watch the live pain/pleasure cardinality estimate respond. Hunt and Mantyh's parallel ascending systems (spinothalamic → somatosensory cortex; spinoparabrachial → limbic cortex), Price's dissociable stages, Eisenberger's social dACC ingress, Melzack's neuromatrix integration, and Berridge/Leknes pleasure compression all occupy the same volume — but only pain sprawls.

<figure class="pm-fig pm-fig-brain" id="fig-brain">
  <div class="pm-fig-head">
    <span class="pm-fig-n">live</span>
    <h4>Interactive brain: pain network vs pleasure cluster</h4>
    <a class="pm-cite" href="https://www.nature.com/articles/35053509">Hunt &amp; Mantyh 2001</a>
  </div>
  <div class="pm-brain3d" id="pm-brain3d" aria-label="Interactive 3D brain: pain pathways versus hedonic hotspots">
    <div class="pm-brain3d-layout">
      <div class="pm-brain3d-view" id="pm-brain3d-canvas-wrap">
        <canvas id="pm-brain3d-canvas"></canvas>
        <div class="pm-brain3d-labels" aria-hidden="true"></div>
        <div class="pm-brain3d-hud">
          <div class="pm-brain3d-metric n"><b id="pm-b3d-pain">—</b><span>pain states (live est.)</span></div>
          <div class="pm-brain3d-metric p"><b id="pm-b3d-pleasure">—</b><span>pleasure (post-quotient)</span></div>
          <div class="pm-brain3d-metric r"><b id="pm-b3d-ratio">—</b><span>log₁₀ ratio</span></div>
        </div>
        <div class="pm-b3d-compare" id="pm-b3d-compare" aria-label="Pain versus pleasure state-space footprint">
          <div class="pm-b3d-compare-title">footprint on brain</div>
          <div class="pm-b3d-compare-row pain">
            <span>pain network · sprawls</span>
            <div class="track"><div class="fill" id="pm-b3d-pain-bar"></div></div>
            <b id="pm-b3d-pain-bar-label">—</b>
          </div>
          <div class="pm-b3d-compare-row pleasure">
            <span>pleasure cluster · ventral</span>
            <div class="track"><div class="fill" id="pm-b3d-pleasure-bar"></div></div>
            <b id="pm-b3d-pleasure-bar-label">—</b>
          </div>
          <div class="pm-b3d-compare-ratio" id="pm-b3d-compare-ratio">—</div>
        </div>
        <div class="pm-b3d-callout pain" id="pm-b3d-callout-pain">PAIN NETWORK<small>cortex · limbic · social</small></div>
        <div class="pm-b3d-callout pleasure" id="pm-b3d-callout-pleasure">PLEASURE POD<small>NAc · VP · VTA only</small></div>
        <p class="pm-brain3d-readout" id="pm-b3d-readout">Drag to rotate · scroll/pinch to zoom · sliders modulate pathways</p>
      </div>
      <div class="pm-brain3d-controls">
        <h5>Pathway sliders</h5>
        <div class="pm-b3d-slider pain">
          <label>somatic input <em>peripheral nociceptors</em><b data-slider-val="somatic">72</b></label>
          <input type="range" min="0" max="100" value="72" data-slider="somatic" aria-label="Somatic nociceptive input">
        </div>
        <div class="pm-b3d-slider pain">
          <label>sensory pathway <em>spinothalamic · SI/SII</em><b data-slider-val="sensory">85</b></label>
          <input type="range" min="0" max="100" value="85" data-slider="sensory" aria-label="Sensory pain pathway">
        </div>
        <div class="pm-b3d-slider pain">
          <label>affective pathway <em>spinoparabrachial · ACC</em><b data-slider-val="affective">88</b></label>
          <input type="range" min="0" max="100" value="88" data-slider="affective" aria-label="Affective pain pathway">
        </div>
        <div class="pm-b3d-slider pain">
          <label>social exclusion <em>dACC · no nociception</em><b data-slider-val="social">55</b></label>
          <input type="range" min="0" max="100" value="55" data-slider="social" aria-label="Social pain ingress">
        </div>
        <div class="pm-b3d-slider pain">
          <label>appraisal &amp; memory <em>mPFC · hippocampus</em><b data-slider-val="cognitive">70</b></label>
          <input type="range" min="0" max="100" value="70" data-slider="cognitive" aria-label="Cognitive appraisal and memory">
        </div>
        <div class="pm-b3d-slider pleasure">
          <label>hedonic hotspots <em>NAc · VP · VTA</em><b data-slider-val="pleasure">42</b></label>
          <input type="range" min="0" max="100" value="42" data-slider="pleasure" aria-label="Hedonic hotspot activation">
        </div>
        <div class="pm-b3d-slider pleasure">
          <label>pharmacological compression <em>μ-opioid · dopamine SKU collapse</em><b data-slider-val="pharma">35</b></label>
          <input type="range" min="0" max="100" value="35" data-slider="pharma" aria-label="Pharmacological pleasure compression">
        </div>
      </div>
    </div>
  </div>
  <script type="importmap">{
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }</script>
  <script type="module" src="/research/pain_machines/brain3d.js?v=4"></script>
  <div class="pm-brain-legend" aria-hidden="true">
    <span><i class="p-som"></i> sensory path (spinothalamic · SI/SII)</span>
    <span><i class="p-aff"></i> affective path (spinoparabrachial · ACC · amygdala)</span>
    <span><i class="p-cog"></i> cognitive / memory (mPFC · hippocampus · appraisal)</span>
    <span><i class="p-soc"></i> social ingress (dACC · no nociception)</span>
    <span><i class="p-ple"></i> hedonic hotspots (NAc · VP · VTA)</span>
  </div>
  <div class="pm-arg" role="group" aria-label="Argument: neuroarchitecture">
    <div class="pm-arg-cell claim"><span class="pm-arg-label">Claim</span><p>On one organ, pain routes sprawl across cortex and limbic volume; pleasure concentrates in a tiny ventral pod.</p></div>
    <div class="pm-arg-cell warrant"><span class="pm-arg-label">Warrant</span><p>Hunt &amp; Mantyh (2001) parallel spinothalamic and spinoparabrachial paths; Price, Eisenberger, Melzack, Berridge, and Leknes — integrated here with live pain/pleasure cardinality and footprint bars on the 3D map.</p></div>
    <div class="pm-arg-cell impact"><span class="pm-arg-label">Impact</span><p>Red envelope vs green pod is the firmware diagram: you are wired as a pain machine with a pleasure subroutine — the ratio is visible, not metaphorical.</p></div>
  </div>
</figure>

<p class="pm-bridge">The pharmacological catalog is small (~11 receptor classes). The pain descriptor catalog is not (78 words, seven ICD categories, eight model axes). Section II counts the product on this anatomy.</p>

## II. Enumerate it

Below is a **state-space estimator**: explicit axes, explicit level counts, explicit collapse rules. Pleasure gets a pharmacological quotient. Pain does not — because clinically, grief does not collapse to toothache under fentanyl.

<div class="pm-compute" id="pm-compute">
  <div class="pm-compute-head">
    <strong>pain_machines_state_space_v1.py</strong>
    <div class="pm-profile" role="tablist" aria-label="Sensitivity profile">
      <button type="button" data-profile="conservative">conservative</button>
      <button type="button" data-profile="central" class="is-active">central</button>
      <button type="button" data-profile="liberal">liberal</button>
    </div>
  </div>

  <pre class="pm-src" aria-label="Model source excerpt"><code><span class="k">def</span> analyze(profile):
    spec = PROFILES[profile]
    pleasure = pleasure_analysis(spec)  <span class="c"># pharmacological quotient applied</span>
    pain = pain_analysis(spec)          <span class="c"># collapse = identity</span>
    ratio = pain[<span class="s">"distinguishable_states"</span>] / pleasure[<span class="s">"effective_states_after_quotient"</span>]
    <span class="k">return</span> ratio, build_traces</code></pre>

  <div class="pm-metrics">
    <div class="pm-metric p"><b id="pm-p-eff">—</b><span>pleasure effective states (post-quotient)</span></div>
    <div class="pm-metric n"><b id="pm-n-states">—</b><span>pain distinguishable states (full product)</span></div>
    <div class="pm-metric r"><b id="pm-log10">—</b><span>log₁₀(pain / pleasure)</span></div>
  </div>

  <div class="pm-chart-cap"><strong>Figure 1</strong>Cumulative log₁₀ state-space build · each axis multiplies distinct states</div>
  <div class="pm-chart" id="pm-chart" aria-label="Cumulative log10 state-space build"></div>

  <div class="pm-chart-cap"><strong>Figure 2</strong>Inventory cross-check · model output vs McGill descriptor count vs pharmacopeia classes</div>
  <div class="pm-chart" id="pm-chart-inventory" aria-label="Inventory cross-check"></div>

  <details class="pm-json-wrap">
    <summary>Export model JSON</summary>
    <pre class="pm-json" id="pm-json" aria-label="Model output JSON"></pre>
  </details>

  <div class="pm-foot">
    Full source: <a href="/research/pain_machines/model.py">model.py</a> ·
    Run locally: <code>python model.py --profile central --json</code>
  </div>
</div>

### Reading Figure 1

The green trace is pleasure: three axes, then a **quotient step** where modalities collapse to receptor classes. The curve flattening is the argument — industrial bliss is compressible.

The red trace is pain: eight axes, no collapse. Each clinical dimension (mechanism, location, appraisal, social field, temporality, identity, agency, episodic binding) multiplies the space. The curve keeps climbing because the literature treats these as **independent contributors**, not redundant labels for the same signal.

### Reading Figure 2

Three ways to count the same thesis:

1. **Model output** — full cross-product under the selected profile.
2. **McGill MPQ** — 78 published pain descriptors across 20 subclass categories ([Melzack, 1975](https://pubmed.ncbi.nlm.nih.gov/1235985/)). A lower bound from vocabulary alone, before combinatorics.
3. **Pharmacopeia classes** — ~11 analgesic / anxiolytic / dopaminergic families that approximate engineered pleasure SKUs (see Appendix §C).

Even the vocabulary gap (78 vs 11) is ~7×. The combinatorial model is ~10³–10⁴. Both point the same direction: **the hardware enumerates suffering faster than it compresses bliss.**

Conservative and liberal profiles bracket the band by varying bin counts only. No fitted constants.

## III. Original Sin as mislabeled spec

The Eden story tells you the crime was curiosity. The enumeration tells you the crime was **specification** — shipping a creature whose pain state-space has higher cardinality than its pleasure state-space, then moralizing the output.

That is what "Pain Machines" names. Not metaphor. Firmware.

More sections forthcoming: Eden mislabeled, the pleasure stack vs pain kernel, Pain-as-a-Service.

<div class="pm-appendix">

## Appendix. Sources

<p>Linked readings behind the axes, inventories, and charts. Full bibliography also ships as <a href="/research/pain_machines/SOURCES.md">SOURCES.md</a>.</p>

<h4>A. Pain measurement & clinical taxonomy</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/1235985/">Melzack R (1975). The McGill Pain Questionnaire: major properties and scoring methods. <em>Pain</em> 1(3):277–299.</a>
    <span class="use">Primary source for the 78-descriptor inventory in Figure 2; sensory / affective / evaluative subclass structure.</span>
  </li>
  <li>
    <a href="https://www.mcgill.ca/painresearch/research/mcgill-pain-questionnaire">McGill University — McGill Pain Questionnaire resource page.</a>
    <span class="use">Instrument history; SF-MPQ revisions; clinical scoring notes.</span>
  </li>
  <li>
    <a href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede RD et al. (2022). Classification of chronic pain for the ICD-11. <em>Pain</em> 163(2):e1–e14.</a>
    <span class="use">IASP task-force taxonomy; seven chronic-pain categories; biopsychosocial framing used in the pain_mechanism axis.</span>
  </li>
  <li>
    <a href="https://www.iasp-pain.org/advocacy/structure-of-the-icd-11-classification/">IASP — Structure of the ICD-11 chronic pain classification (MG30).</a>
    <span class="use">Operational ICD-11 hierarchy: primary, neuropathic, visceral, postsurgical, etc.</span>
  </li>
  <li>
    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja SN et al. (2020). The revised IASP definition of pain. <em>Pain</em> 161(9):1976–1982.</a>
    <span class="use">Pain as inseparable sensory + emotional experience; motivates non-collapsing pain axes.</span>
  </li>
  <li>
    <a href="https://www.iasp-pain.org/wp-content/uploads/2022/04/revised-definition-flysheet_R2-1-1-1.pdf">IASP — Revised definition of pain flysheet (2020).</a>
    <span class="use">Plain-language summary of the 2020 definition and accompanying notes.</span>
  </li>
</ul>

<h4>B. Pain as multidimensional construct</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack R (2001). Pain and the neuromatrix in the brain. <em>J Dent Educ</em> 65(12):1378–1382.</a>
    <span class="use">Neuromatrix / neurosignature model; pain generated by distributed brain network, not input alone; basis for episodic_embedding axis.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1126/science.288.5472.1769">Price DD (2000). Psychological and neural mechanisms of the affective dimension of pain. <em>Science</em> 288(5472):1769–1772.</a>
    <span class="use">Serial dissociation of sensation intensity, unpleasantness, and secondary affect; cortico-limbic vs direct pathways.</span>
  </li>
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/18607258/">Berns GS et al. (2008). The price of pain and the value of suffering. <em>Psychol Sci</em> 19(4):309–317.</a>
    <span class="use">Experimental market for pain avoidance; willingness-to-pay for relief is context-dependent — suffering is not a single fungible SKU.</span>
  </li>
  <li>
    <a href="https://archive.org/details/stressappraisalc0000laza">Lazarus RS, Folkman S (1984). <em>Stress, Appraisal, and Coping.</em> Springer.</a>
    <span class="use">Cognitive appraisal families; same stressor → different suffering by frame; pain_appraisal axis.</span>
  </li>
  <li>
    <a href="https://www.nature.com/articles/35053509">Hunt SP, Mantyh PW (2001). The molecular dynamics of pain control. <em>Nat Rev Neurosci</em> 2:83–91.</a>
    <span class="use">Parallel spinothalamic (sensory) vs spinoparabrachial (affective) pain pathways; mechanism heterogeneity; integrative brain map (§ neuroarchitecture).</span>
  </li>
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/14500928/">Eisenberger NI et al. (2003). Does rejection hurt? An fMRI study of social exclusion. <em>Science</em> 302(5643):290–292.</a>
    <span class="use">Social pain recruits dorsal anterior cingulate; psychological suffering without somatic injury — expands pain state-space.</span>
  </li>
  <li>
    <a href="https://pubmed.ncbi.nlm.nih.gov/18003941/">Treede RD et al. (2008). Neuropathic pain: redefinition and a grading system. <em>Neurology</em> 70(18):1630–1635.</a>
    <span class="use">Nociceptive vs neuropathic vs nociplastic distinction; clinical mechanism granularity.</span>
  </li>
</ul>

<h4>C. Hedonic compression & reward neuroscience</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/">Berridge KC, Kringelbach ML (2015). Pleasure systems in the brain. <em>Neuron</em> 86(3):646–664.</a>
    <span class="use">Hedonic hotspots vs sprawling "wanting" system; common neural currency of pleasure; pharmacological_quotient rationale.</span>
  </li>
  <li>
    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3004012/">Berridge KC, Kringelbach ML (2010). Affective neuroscience of pleasure. In <em>Pleasures of the Brain</em>.</a>
    <span class="use">Liking vs wanting vs learning; orbitofrontal representation vs subcortical causation of pleasure.</span>
  </li>
  <li>
    <a href="https://www.nature.com/articles/nrn2333">Leknes S, Tracey I (2008). A common neurobiology for pain and pleasure. <em>Nat Rev Neurosci</em> 9:314–320.</a>
    <span class="use">Opioid/dopamine overlap; mutual inhibition of pain and reward — explains substitutability of engineered bliss.</span>
  </li>
  <li>
    <a href="https://www.accessdata.fda.gov/scripts/cder/daf/">FDA Drugs@FDA — approved drug products database.</a>
    <span class="use">Ground truth for pharmacopeia-class enumeration (opioids, benzodiazepines, stimulants, etc.) behind the ~11-class inventory check.</span>
  </li>
</ul>

<h4>D. Affective asymmetry & negative dominance</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://doi.org/10.1037/1089-2680.5.4.323">Baumeister RF et al. (2001). Bad is stronger than good. <em>Review of General Psychology</em> 5(4):323–370.</a>
    <span class="use">Cross-domain evidence that negative events outweigh positive; bad information processed more thoroughly.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1207/S15327957PSPR0504_2">Rozin P, Royzman EB (2001). Negativity bias, negativity dominance, and contagion. <em>Perspectives on Psychological Science</em>.</a>
    <span class="use">Negative potency, negative differentiation (negative states more varied); direct support for high-cardinality suffering.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1037/0022-3514.75.4.887">Ito TA et al. (1998). Negative information weighs more heavily on the brain. <em>J Personality & Social Psychology</em> 75(4):887–900.</a>
    <span class="use">ERP evidence for stronger neural weighting of negative vs matched positive evaluative categories.</span>
  </li>
  <li>
    <a href="https://doi.org/10.1037/0033-295X.105.3.482">Cacioppo JT, Berntson GG (1999). The affect system. <em>Psychological Review</em>.</a>
    <span class="use">Evaluative-space model; separable positive/negative substrates; negativity bias and positivity offset.</span>
  </li>
  <li>
    <a href="https://doi.org/10.2307/1914185">Kahneman D, Tversky A (1979). Prospect theory: an analysis of decision under risk. <em>Econometrica</em> 47(2):263–291.</a>
    <span class="use">Losses loom larger than gains; economic formalization parallel to pain/pleasure asymmetry.</span>
  </li>
</ul>

<h4>E. Psychophysics & measurement foundations</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://plato.stanford.edu/entries/weber-fechners-law/">Stanford Encyclopedia of Philosophy — Weber-Fechner law.</a>
    <span class="use">Logarithmic intensity perception; justification for discrete JND bins on pleasure_intensity axis.</span>
  </li>
  <li>
    <a href="https://www.sralab.org/rehabilitation-measures/mcgill-pain-questionnaire">Shirley Ryan AbilityLab — McGill Pain Questionnaire measure profile.</a>
    <span class="use">Independent replication of 78-word structure, subclass counts, and clinical use cases.</span>
  </li>
</ul>

<h4>F. Model & reproducibility</h4>
<ul class="pm-src-list">
  <li>
    <a href="/research/pain_machines/model.py">pain_machines_state_space_v1 — model.py</a>
    <span class="use">Canonical Python implementation of axis products, pharmacological quotient, and JSON export.</span>
  </li>
  <li>
    <a href="/research/pain_machines/README.md">pain_machines — README</a>
    <span class="use">Run instructions: <code>python model.py --profile central --json</code></span>
  </li>
  <li>
    <a href="/research/pain_machines/SOURCES.md">pain_machines — SOURCES.md</a>
    <span class="use">Plain-text mirror of this appendix for citation and LLM ingestion.</span>
  </li>
</ul>

</div>

</div>

<script type="application/json" id="pm-spec">{
  "profiles": {
    "conservative": {"pleasure_intensity":3,"pleasure_duration":3,"pleasure_modality":4,"pain_mechanism":4,"pain_location":8,"pain_appraisal":4,"pain_social":3,"pain_temporal":3,"pain_identity":3,"pain_agency":3,"pain_episodic":4},
    "central": {"pleasure_intensity":5,"pleasure_duration":4,"pleasure_modality":6,"pain_mechanism":6,"pain_location":12,"pain_appraisal":5,"pain_social":4,"pain_temporal":4,"pain_identity":4,"pain_agency":4,"pain_episodic":6},
    "liberal": {"pleasure_intensity":7,"pleasure_duration":5,"pleasure_modality":8,"pain_mechanism":8,"pain_location":16,"pain_appraisal":6,"pain_social":5,"pain_temporal":5,"pain_identity":5,"pain_agency":5,"pain_episodic":8}
  },
  "modalityToReceptor": {"0":"dopaminergic","1":"dopaminergic","2":"opioidergic","3":"oxytocinergic","4":"mixed","5":"opioidergic","6":"dopaminergic","7":"mixed"}
}</script>

<script>
(() => {
  const root = document.getElementById('pain-machines');
  const specEl = document.getElementById('pm-spec');
  if (!root || !specEl || root.dataset.ready) return;
  root.dataset.ready = 'true';

  const { profiles, modalityToReceptor } = JSON.parse(specEl.textContent);
  let profile = 'central';

  const pleasureAxisMeta = [
    ['intensity_jnd_bins', 'pleasure_intensity', 'Weber-Fechner JND bins'],
    ['duration_regime', 'pleasure_duration', 'acute / session / day / sustained'],
    ['modality', 'pleasure_modality', 'consumption, achievement, touch, social, aesthetic, relief']
  ];
  const painAxisMeta = [
    ['somatic_mechanism', 'pain_mechanism', 'IASP 2021 mechanism taxonomy'],
    ['location', 'pain_location', 'regional somatic / visceral map'],
    ['cognitive_appraisal', 'pain_appraisal', 'Lazarus appraisal families'],
    ['social_field', 'pain_social', 'alone / intimate / professional / public'],
    ['temporality', 'pain_temporal', 'acute / recurrent / chronic / dread'],
    ['identity_salience', 'pain_identity', 'peripheral / personal / reputation / core self'],
    ['agency_attribution', 'pain_agency', 'self / other / system / fate / ambiguous'],
    ['episodic_embedding', 'pain_episodic', 'Melzack neuromatrix episode binding']
  ];

  function receptorQuotient(n) {
    const classes = new Set();
    for (let i = 0; i < n; i += 1) classes.add(modalityToReceptor[String(i % 8)]);
    return classes.size;
  }

  function buildTrace(meta, spec, key) {
    const trace = [];
    let running = 1;
    for (const [name, field, source] of meta) {
      const levels = spec[field];
      running *= levels;
      trace.push({ axis: name, levels, [key]: running, source });
    }
    return trace;
  }

  function analyze(name) {
    const spec = { name, ...profiles[name] };
    const pTrace = buildTrace(pleasureAxisMeta, spec, 'running_raw');
    const rawP = pTrace[pTrace.length - 1].running_raw;
    const collapsed = receptorQuotient(spec.pleasure_modality);
    const pEff = spec.pleasure_intensity * spec.pleasure_duration * collapsed;
    pTrace.push({
      axis: 'pharmacological_quotient',
      levels: collapsed,
      running_raw: pEff,
      source: 'Receptor-class collapse: synthetic agonists interchange within class'
    });

    const nTrace = buildTrace(painAxisMeta, spec, 'running_product');
    const nStates = nTrace[nTrace.length - 1].running_product;
    const ratio = nStates / Math.max(pEff, 1);

    return {
      model: 'pain_machines_state_space_v1',
      profile: name,
      spec,
      pleasure: {
        raw_cartesian_states: rawP,
        effective_states_after_quotient: pEff,
        build_trace: pTrace
      },
      pain: {
        distinguishable_states: nStates,
        collapse_function: 'identity',
        build_trace: nTrace
      },
      comparison: {
        pain_over_pleasure_ratio: ratio,
        log10_orders_of_magnitude: Math.round(Math.log10(ratio) * 100) / 100
      },
      independent_checks: {
        mcgill_pain_questionnaire_descriptor_count: 78,
        mcgill_sensory_subscale_descriptors: 20,
        mcgill_affective_subscale_descriptors: 12,
        mcgill_evaluative_subscale_descriptors: 8,
        fda_analgesic_anxiolytic_dopaminergic_sku_classes: 11,
        ratio_from_descriptor_inventory: Math.round((78 / 11) * 100) / 100
      },
      claim: 'Original Sin mislabels the bug. The spec ships high-cardinality suffering and low-cardinality pleasure that collapses under pharmacological equivalence.'
    };
  }

  const fmt = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(2)}e6` : n >= 1e4 ? n.toLocaleString() : String(n);

  function renderMetrics(result) {
    document.getElementById('pm-p-eff').textContent = fmt(result.pleasure.effective_states_after_quotient);
    document.getElementById('pm-n-states').textContent = fmt(result.pain.distinguishable_states);
    document.getElementById('pm-log10').textContent = `10^${result.comparison.log10_orders_of_magnitude}`;
    document.getElementById('pm-json').textContent = JSON.stringify(result, null, 2);
  }

  function renderChart(result) {
    const node = document.getElementById('pm-chart');
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const W = 880, H = mobile ? 340 : 300;
    const ml = mobile ? 52 : 68, mr = 16, mt = 28, mb = mobile ? 72 : 58;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Log10 cumulative state space');

    const add = (name, attrs) => {
      const el = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      svg.appendChild(el);
      return el;
    };

    const pSteps = result.pleasure.build_trace.map(s => ({
      label: s.axis.replace(/_/g, ' '),
      log: Math.log10(Math.max(1, s.running_raw ?? s.running_product))
    }));
    const nSteps = result.pain.build_trace.map(s => ({
      label: s.axis.replace(/_/g, ' '),
      log: Math.log10(Math.max(1, s.running_product))
    }));
    const maxLog = Math.max(4, ...pSteps.map(s => s.log), ...nSteps.map(s => s.log)) + 0.35;
    const y = v => mt + (1 - v / maxLog) * (H - mt - mb);
    const colP = (W - ml - mr) * 0.38;
    const colN = (W - ml - mr) * 0.62;
    const xP = i => ml + (i / Math.max(1, pSteps.length - 1)) * colP;
    const xN = i => ml + colN + (i / Math.max(1, nSteps.length - 1)) * ((W - ml - mr) - colN);

    for (let t = 0; t <= Math.ceil(maxLog); t += 1) {
      add('line', { x1: ml, x2: W - mr, y1: y(t), y2: y(t), stroke: 'rgba(235,228,220,.07)', 'stroke-width': 1 });
      add('text', { x: ml - 8, y: y(t) + 3, fill: '#555c64', 'font-size': 10, 'text-anchor': 'end', 'font-family': 'monospace' }).textContent = `10^${t}`;
    }

    add('text', { x: ml + colP * 0.5, y: 16, fill: '#7a9a8c', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'monospace' }).textContent = 'pleasure → quotient';
    add('text', { x: ml + colN + (W - ml - mr - colN) * 0.5, y: 16, fill: '#b85c55', 'font-size': 11, 'text-anchor': 'middle', 'font-family': 'monospace' }).textContent = 'pain → no collapse';

    const draw = (steps, xFn, color) => {
      let prev = null;
      steps.forEach((s, i) => {
        const cx = xFn(i), cy = y(s.log);
        if (prev) add('line', { x1: prev.x, y1: prev.y, x2: cx, y2: cy, stroke: color, 'stroke-width': 1.5, opacity: .85 });
        add('circle', { cx, cy, r: 3.5, fill: color });
        if (mobile ? (i === 0 || i === steps.length - 1 || i % 2 === 0) : true) {
          add('text', {
            x: cx, y: H - mb + 14 + (i % 2) * 12, fill: '#8a9199', 'font-size': 9,
            'text-anchor': i === 0 ? 'start' : (i === steps.length - 1 ? 'end' : 'middle'),
            'font-family': 'monospace'
          }).textContent = s.label.length > 14 ? s.label.slice(0, 12) + '…' : s.label;
        }
        prev = { x: cx, y: cy };
      });
    };

    draw(pSteps, xP, '#7a9a8c');
    draw(nSteps, xN, '#b85c55');

    node.replaceChildren(svg);
  }

  function renderInventoryChart(result) {
    const node = document.getElementById('pm-chart-inventory');
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const W = 880, H = mobile ? 220 : 200;
    const ml = mobile ? 118 : 200, mr = 20, mt = 16, mb = 36;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Inventory cross-check');

    const add = (name, attrs, text) => {
      const el = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (text != null) el.textContent = text;
      svg.appendChild(el);
      return el;
    };

    const rows = [
      { label: 'pleasure (model, post-quotient)', value: result.pleasure.effective_states_after_quotient, color: '#7a9a8c' },
      { label: 'pharmacopeia SKU classes', value: result.independent_checks.fda_analgesic_anxiolytic_dopaminergic_sku_classes, color: '#6a7570' },
      { label: 'McGill MPQ descriptors', value: result.independent_checks.mcgill_pain_questionnaire_descriptor_count, color: '#9a7b6a' },
      { label: 'pain (model, full product)', value: result.pain.distinguishable_states, color: '#b85c55' }
    ];
    const maxLog = Math.max(4.5, ...rows.map(r => Math.log10(Math.max(1, r.value)))) + 0.2;
    const x0 = ml, x1 = W - mr;
    const x = v => x0 + (Math.log10(Math.max(1, v)) / maxLog) * (x1 - x0);
    const rowH = (H - mt - mb) / rows.length;

    for (let t = 0; t <= Math.floor(maxLog); t += 1) {
      const xx = x(Math.pow(10, t));
      add('line', { x1: xx, x2: xx, y1: mt - 4, y2: H - mb, stroke: 'rgba(235,228,220,.06)', 'stroke-width': 1 });
      add('text', { x: xx, y: H - 10, fill: '#555c64', 'font-size': 9, 'text-anchor': 'middle', 'font-family': 'monospace' }, `10^${t}`);
    }

    rows.forEach((row, i) => {
      const yy = mt + i * rowH + rowH * 0.55;
      add('text', {
        x: mobile ? 8 : 8, y: yy + 4, fill: '#8a9199', 'font-size': mobile ? 9 : 10,
        'text-anchor': 'start', 'font-family': 'monospace'
      }, mobile && row.label.length > 22 ? row.label.replace(' (model, post-quotient)', '').replace(' (model, full product)', ' (model)') : row.label);
      const barW = Math.max(2, x(row.value) - x0);
      add('rect', {
        x: x0, y: yy - rowH * 0.22, width: barW, height: Math.max(6, rowH * 0.44),
        fill: row.color, opacity: 0.9
      });
      add('text', {
        x: x0 + barW + 6, y: yy + 4, fill: '#ebe4dc', 'font-size': 10,
        'text-anchor': 'start', 'font-family': 'monospace'
      }, fmt(row.value));
    });

    node.replaceChildren(svg);
  }

  function renderProfileButtons() {
    const bar = root.querySelector('.pm-profile');
    if (!bar || bar.dataset.bound) return;
    bar.dataset.bound = 'true';
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-profile]');
      if (!btn) return;
      profile = btn.dataset.profile;
      bar.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
      const result = analyze(profile);
      renderMetrics(result);
      renderChart(result);
      renderInventoryChart(result);
    });
  }

  function renderAll() {
    const result = analyze(profile);
    renderMetrics(result);
    renderChart(result);
    renderInventoryChart(result);
  }

  renderProfileButtons();
  renderAll();
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(renderAll, 120); });
})();
</script>
