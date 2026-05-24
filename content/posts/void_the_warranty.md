---
author: ["goodalexander"]
title: "Void the Warranty"
date: 2026-05-24T18:00:00Z
draft: false
summary: "If the human organism enumerates suffering faster than pleasure, then the first sin was not disobedience but manufacture; the only honest politics is the right to redesign the body, mind, and substrat"
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
.pm-after {
  margin: .85rem 0 1.5rem;
  font-size: .84rem;
  line-height: 1.6;
  color: var(--muted);
  max-width: 62ch;
}
.pm-study {
  margin: 0 0 .75rem;
  padding: .65rem .9rem;
  border-left: 2px solid rgba(184, 154, 106, .4);
  font-size: .81rem;
  line-height: 1.55;
  color: #9a9590;
  max-width: 68ch;
}
.pm-study strong { color: var(--ink); font-weight: 500; }
.pm-bridge {
  margin: 1.5rem 0 .25rem;
  font-size: .88rem;
  color: var(--muted);
  max-width: 52ch;
}
.pm-counting {
  margin: 1.25rem 0 1.75rem;
  border: 1px solid var(--line);
  background: linear-gradient(165deg, #0a0b0d 0%, #060708 100%);
}
.pm-counting summary {
  cursor: pointer;
  padding: .75rem 1rem;
  font: 500 .78rem/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--dim);
  list-style: none;
}
.pm-counting summary::-webkit-details-marker { display: none; }
.pm-counting[open] summary { border-bottom: 1px solid var(--line); color: var(--muted); }
.pm-counting > p {
  margin: 0 0 .65rem;
  padding: 0 1rem;
  font-size: .82rem;
  line-height: 1.6;
  max-width: 68ch;
}
.pm-counting > p:first-of-type { padding-top: .85rem; }
.pm-counting > p:last-child { padding-bottom: 1rem; margin-bottom: 0; }
.pm-tease {
  margin: 0 0 .65rem;
  padding: .55rem .75rem;
  border-left: 2px solid rgba(184, 154, 106, .45);
  font-size: .84rem;
  line-height: 1.5;
  color: #a8a098;
  max-width: 58ch;
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
  .pm-fig { overflow: hidden; }
  .pm-fig svg {
    display: block;
    width: 100%;
    height: auto;
    min-width: 0;
    max-width: 100%;
  }
  .pm-fig-head { flex-direction: column; align-items: flex-start; gap: .35rem; }
  .pm-fig-head h4 { font-size: .8rem; line-height: 1.35; }
  .pm-fig-n { font-size: .62rem; }
  .pm-cite { white-space: normal; }
  .pm-study, .pm-after { max-width: none; font-size: .8rem; }
  .pm-brain3d-layout { grid-template-columns: 1fr; }
  .pm-brain3d-view { min-height: 360px; }
  .pm-brain3d-view canvas { min-height: 360px; }
  .pm-b3d-compare { width: min(200px, 88%); left: .65rem; right: auto; top: auto; bottom: 3.2rem; }
  .pm-brain3d-hud { max-width: 52%; }
  .pm-arg { grid-template-columns: 1fr; }
}
.pm-pull {
  margin: 1.5rem 0;
  padding: .85rem 1rem .85rem 1.1rem;
  border-left: 2px solid var(--gold);
  font-size: .92rem;
  line-height: 1.55;
  color: var(--ink);
  font-style: italic;
  max-width: 52ch;
}
.pm-lede {
  font-size: 1.02rem;
  line-height: 1.6;
  color: var(--muted);
  max-width: 62ch;
  margin-bottom: 1.5rem;
}
.pm-logline {
  margin: 0 0 2rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--line);
  background: var(--panel);
  font-size: .88rem;
  line-height: 1.6;
  color: var(--muted);
  max-width: 68ch;
}

</style>
<div class="pm" id="void-the-warranty">

<p class="pm-logline">If the human organism enumerates suffering faster than pleasure, then the first sin was not disobedience but manufacture; the only honest politics is the right to redesign the body, mind, and substrate that inherited the defect.</p>

# Void the Warranty

### A manifesto for leaving the pain-machine format

## Prelude

**The Crib and the Warranty**

The first sound most humans make is a pain signal, and civilization calls it health.

The room is fluorescent and clean. Plastic wheels lock beneath a bassinet. A monitor draws its little green biography across a black face while adults lean over a wrapped animal and translate distress into reassurance. Good lungs. Strong cry. Vitality.

The child has consented to none of it. No consent to the chassis. No consent to the chemistry. No consent to the decay schedule, the hunger cycle, the pain map, the panic circuitry, the reproductive wound, the dentistry of time. No consent to the civic hymn that will later call this condition dignity, or the religious hymn that will call it creation, trial, fall, purification, gift.

The prior [pain_machines proof](/posts/pain_machines/) has already done the clinical and computational labor. It has modeled the human organism as a generator of suffering-categories and backed the model with evidence: nociception, fear learning, chronic pain, negative-affect bias, trauma memory, loss aversion, dyspnea, nausea, grief, itch, shame, and the long administrative afterlife of harm. This manifesto begins after that verdict. The question is consequence.

A pain machine is a biological system governed by alarms. It is threat salience wrapped in skin, damage memory wearing a face, homeostatic coercion taught to speak. It carries a nervous architecture in which suffering proliferates faster than pleasure can stabilize: one wound becomes sensation, fear, anticipation, avoidance, identity, cost, law, and metaphysics. Pleasure usually closes its file. Pain hires clerks.

The International Association for the Study of Pain revised the definition of pain toward technical seriousness: a sensory and emotional experience associated with actual or potential tissue damage, or resembling such association. Elaine Scarry, in *The Body in Pain*, described pain as world-destroying. The engineering translation is colder: pain occupies bandwidth, destroys optionality, and converts consciousness into a hostage negotiator.

Every civilization places a hidden warranty card in the crib. Christianity, Islam, and secular humanism disagree about God, revelation, salvation, law, and anthropology. Their disagreement is immense and real. Yet each converges on the same protective clause: repair the human, console the human, sanctify the human, dignify the human, but forbid the abolition of the inherited human format.

<figure class="pm-fig" id="pmx-00">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-00</span>
    <h4>The Warranty Card in the Crib</h4>
  </div>
  <svg viewBox="0 0 1200 650" role="img" aria-label="Warranty card in crib metaphor">
    <rect width="1200" height="650" fill="#040506"/>
    <rect x="40" y="40" width="340" height="570" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/>
    <text x="210" y="80" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">neonatal bay · monitor trace</text>
    <rect x="80" y="110" width="260" height="180" rx="3" fill="#060708" stroke="rgba(235,228,220,.10)"/>
    <ellipse cx="210" cy="200" rx="70" ry="28" fill="none" stroke="#8a9199" stroke-width="1"/>
    <rect x="170" y="175" width="80" height="50" rx="8" fill="#0f1012" stroke="#8a9199" stroke-width=".8"/>
    <path d="M90 320 L330 320" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <path d="M90 340 L330 340" stroke="#b85c55" stroke-width=".6" opacity=".5" fill="none"/>
    <text x="90" y="310" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">HR trace · first signal</text>
    <text x="60" y="400" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">wrapped silhouette</text>
    <text x="60" y="420" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">no consent · no opt-out</text>
    <rect x="420" y="60" width="740" height="530" rx="4" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.2"/>
    <text x="450" y="100" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="14" letter-spacing="3">PRODUCT WARRANTY</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12">
      <text x="450" y="150" fill="#555c64">PRODUCT</text><text x="620" y="150" fill="#ebe4dc">Homo sapiens</text>
      <text x="450" y="185" fill="#555c64">SHIP DATE</text><text x="620" y="185" fill="#ebe4dc">birth</text>
      <text x="450" y="220" fill="#555c64">SERIAL</text><text x="620" y="220" fill="#ebe4dc">ADAM-000001</text>
      <text x="450" y="270" fill="#555c64">KNOWN DEFECTS</text>
      <text x="620" y="270" fill="#b85c55">pain · fear · grief · decay · death</text>
      <text x="450" y="330" fill="#555c64">WARRANTY TERMS</text>
      <text x="620" y="330" fill="#8a9199">repair permitted · exit prohibited</text>
    </g>
    <rect x="450" y="380" width="200" height="40" fill="none" stroke="#555c64" stroke-width=".8"/>
    <text x="460" y="405" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">||||||||||||||||</text>
    <g transform="translate(680 420) rotate(-18)">
      <rect x="0" y="0" width="380" height="90" rx="2" fill="none" stroke="#b89a6a" stroke-width="3" opacity=".85"/>
      <text x="190" y="55" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="28" font-weight="600" text-anchor="middle" letter-spacing="4">VOID THE WARRANTY</text>
    </g>
  </svg>
</figure>
<p class="pm-after">The warranty language is hidden because its success depends on being mistaken for nature. It teaches the newborn that repair is mercy and exit is sacrilege. The manifesto begins by refusing that signature.</p>

The logic is simple enough to be unforgivable.

1. The human organism is a pain machine: a system in which harm is counted more richly, urgently, and durably than satisfaction.
2. Original Sin, reframed through that fact, belongs upstream of Adam. The first wrong was manufacture of a conscious pain-machine chassis.
3. AI and radical bodily alteration are therefore a mandate, because intelligence must be used to route around the inherited defect.
4. Theology forbids this once repair becomes escape, because escape repudiates sacred creation, fitra, resurrection, trial, humility, and divine title.
5. Secular humanism forbids the same escape under different names: dignity, equality, the human essence, the common subject, the natural kind.
6. Politics becomes the struggle between warranty states and exit regimes.

<blockquote class="pm-pull">Every birth is a factory reset of an unpatched vulnerability.</blockquote>

This is no sales brochure for immortal founders, no adolescent desecration ritual, no plastic hymn to gadgets. The enemy is not the believer at the bedside, the physician in the ward, the parent trying to comfort a child, the humanist defending prisoners from vivisection by the state. The enemy is the sacred status of the pain-machine chassis.

The first cry is treated as proof of life. It is also the product warning.

Birth is more than arrival. It is the factory reset of an unpatched vulnerability.

## I

**The Arithmetic of the Hurt Animal**

The body is an alarm system with a mouth, even when men rename it a temple.

The [pain_machines proof](/posts/pain_machines/) begins where sentimental anthropology ends: with the organism as a threat-detection machine. Nociceptors fire. Inflammation recruits tissue and time. The spinal cord gates and amplifies. Stress hormones prepare the animal for a future it has not seen. Fear learning marks neutral objects as possible gates of harm. Withdrawal, avoidance, aversion, vigilance, and memory become the grammar of survival.

Pessimism is a mood. The pain-machine claim is a structural asymmetry. Clinical pain, anxiety, trauma, depression, dyspnea, nausea, itch, grief, panic, shame, hunger, addiction, and neurodegeneration do not merely occupy separate rooms in a hospital. They generate families. Pain becomes fear of pain, then avoidance, then weakness, then social loss, then financial loss, then identity, then law. One signal acquires descendants.

Pleasure saturates; pain elaborates. A meal ends. A migraine becomes nausea, light sensitivity, dread of recurrence, lost work, family strain, medication side effects, insurance conflict, and a new self-description: I am a person who gets migraines. Orgasm resolves. Panic attacks teach the harmless room to wear the mask of a predator. Comfort fades into baseline. Bereavement builds an archive.

Baumeister and colleagues gave social psychology the blunt title *Bad Is Stronger Than Good*. Rozin and Royzman mapped negativity bias, negativity dominance, and contagion. Kahneman and Tversky formalized the arithmetic of loss aversion: the loss wounds more than the gain pleases. The clinic supplies the meat under the theorem. Evolution favored organisms that overreacted to danger, because the underreactive line became a meal. The surviving animal pays for that bias in misery.

Evolution has no department of happiness. It runs continuation.

<figure class="pm-fig" id="pmx-01">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-01</span>
    <h4>The Pain Ledger</h4>
    <a class="pm-cite" href="https://goodalexander.com/posts/pain_machines/">https://goodalexander.com/posts/pain_machines/</a>
  </div>
  <svg viewBox="0 0 1200 760" role="img" aria-label="Pain ledger: suffering enumerates faster than pleasure">
    <rect width="1200" height="760" fill="#040506"/>
    <text x="600" y="45" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="13" text-anchor="middle">suffering enumerates faster than pleasure</text>
    <line x1="600" y1="60" x2="600" y2="680" stroke="rgba(235,228,220,.10)" stroke-width="1"/>
    <text x="300" y="80" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">PLEASURE LEDGER</text>
    <text x="900" y="80" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">PAIN LEDGER</text>
    <text x="60" y="100" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">reward</text><rect x="200" y="90" width="120" height="8" fill="#7a9a8c" opacity=".7"/><text x="60" y="128" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">satiety</text><rect x="200" y="118" width="95" height="8" fill="#7a9a8c" opacity=".7"/><text x="60" y="156" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">comfort</text><rect x="200" y="146" width="80" height="8" fill="#7a9a8c" opacity=".7"/><text x="60" y="184" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">orgasm</text><rect x="200" y="174" width="110" height="8" fill="#7a9a8c" opacity=".7"/><text x="60" y="212" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">relief</text><rect x="200" y="202" width="70" height="8" fill="#7a9a8c" opacity=".7"/><text x="60" y="240" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">calm</text><rect x="200" y="230" width="55" height="8" fill="#7a9a8c" opacity=".7"/>
    <text x="640" y="100" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">nociception</text><rect x="820" y="90" width="140" height="8" fill="#b85c55" opacity=".75"/><line x1="960" y1="94" x2="880" y2="114" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="128" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">inflammation</text><rect x="820" y="118" width="120" height="8" fill="#b85c55" opacity=".75"/><line x1="940" y1="122" x2="880" y2="142" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="156" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">neuropathy</text><rect x="820" y="146" width="130" height="8" fill="#b85c55" opacity=".75"/><line x1="950" y1="150" x2="880" y2="170" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="184" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">allodynia</text><rect x="820" y="174" width="100" height="8" fill="#b85c55" opacity=".75"/><text x="640" y="212" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">panic</text><rect x="820" y="202" width="110" height="8" fill="#b85c55" opacity=".75"/><line x1="930" y1="206" x2="880" y2="226" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="240" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">nausea</text><rect x="820" y="230" width="90" height="8" fill="#b85c55" opacity=".75"/><text x="640" y="268" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">itch</text><rect x="820" y="258" width="85" height="8" fill="#b85c55" opacity=".75"/><text x="640" y="296" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">shame</text><rect x="820" y="286" width="95" height="8" fill="#b85c55" opacity=".75"/><text x="640" y="324" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">grief</text><rect x="820" y="314" width="125" height="8" fill="#b85c55" opacity=".75"/><line x1="945" y1="318" x2="880" y2="338" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="352" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">dyspnea</text><rect x="820" y="342" width="115" height="8" fill="#b85c55" opacity=".75"/><line x1="935" y1="346" x2="880" y2="366" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="380" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">chronicity</text><rect x="820" y="370" width="150" height="8" fill="#b85c55" opacity=".75"/><line x1="970" y1="374" x2="880" y2="394" stroke="#b85c55" stroke-width=".8" opacity=".5"/><text x="640" y="408" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">trauma memory</text><rect x="820" y="398" width="160" height="8" fill="#b85c55" opacity=".75"/><line x1="980" y1="402" x2="880" y2="422" stroke="#b85c55" stroke-width=".8" opacity=".5"/>
    <text x="600" y="730" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">conceptual taxonomy from pain_machines proof · not a population estimate</text>
  </svg>
</figure>
<p class="pm-after">The ledger has a moral shape. Pleasure enters, crests, adapts, and disappears into baseline; pain opens procedural branches. The thesis follows the arithmetic: the inherited organism is optimized for survival under threat, then abandoned to experience the cost.</p>

The clinical ladder is a revelation in bureaucratic horror. Acute pain may point to injury and recede when the wound closes. Chronic pain stays past usefulness. Neuropathic pain arises from damaged nerves and can burn without repairable insult. Allodynia makes ordinary touch hurt. Hyperalgesia magnifies what should be tolerable. Phantom pain speaks from a limb no longer there. Central sensitization trains the nervous system to amplify its own report.

Pain is an empire because it governs vertically. Tissue signal rises into spinal processing, thalamic relay, insula, anterior cingulate, memory, prediction, movement, social consequence, and moral imagination. Irene Tracey’s neuroimaging work showed pain as a distributed brain process rather than a single line from wound to complaint. Herta Flor’s work on phantom limb pain and cortical reorganization showed how the map can continue the war after the territory is gone. Apkarian and Baliki tracked chronic pain as brain reorganization, a transition from event to condition.

Pleasure has machinery too: reward prediction, dopaminergic learning, opioid warmth, satiation, novelty, habit, tolerance, and comedown. It has ceilings and boredom. The most intense pleasures become memory, craving, or ordinary appetite. The system protects itself against endless bliss because endless bliss would make the animal stupid near cliffs. Adaptation is the governor on joy.

Pain has basements and trapdoors.

<figure class="pm-fig" id="pmx-02">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-02</span>
    <h4>The Alarm Stack</h4>
  </div>
  <svg viewBox="0 0 1200 820" role="img" aria-label="Alarm stack: pain governance architecture">
    <rect width="1200" height="820" fill="#040506"/>
    <text x="600" y="40" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">alarm stack · from tissue to identity</text>
    <rect x="120" y="680" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="714" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">tissue damage</text><circle cx="1080" cy="708" r="6" fill="#b85c55" opacity=".8"/><rect x="120" y="600" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="634" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">nociceptor</text><circle cx="1080" cy="628" r="6" fill="#b85c55" opacity=".8"/><path d="M1080 656 L1080 672 L200 672 L200 592" fill="none" stroke="#b85c55" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/><rect x="120" y="520" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="554" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">spinal gate</text><circle cx="1080" cy="548" r="6" fill="#b85c55" opacity=".8"/><path d="M1080 576 L1080 592 L200 592 L200 512" fill="none" stroke="#b85c55" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/><rect x="120" y="440" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="474" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">thalamus</text><circle cx="1080" cy="468" r="6" fill="#b85c55" opacity=".8"/><path d="M1080 496 L1080 512 L200 512 L200 432" fill="none" stroke="#b85c55" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/><rect x="120" y="360" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="394" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">insula · ACC</text><circle cx="1080" cy="388" r="6" fill="#b85c55" opacity=".8"/><path d="M1080 416 L1080 432 L200 432 L200 352" fill="none" stroke="#b85c55" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/><rect x="120" y="280" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="314" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">memory · prediction</text><circle cx="1080" cy="308" r="6" fill="#b85c55" opacity=".8"/><path d="M1080 336 L1080 352 L200 352 L200 272" fill="none" stroke="#b85c55" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/><rect x="120" y="200" width="960" height="56" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="150" y="234" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">identity · social consequence</text><circle cx="1080" cy="228" r="6" fill="#b85c55" opacity=".8"/><path d="M1080 256 L1080 272 L200 272 L200 192" fill="none" stroke="#b85c55" stroke-width=".8" stroke-dasharray="4 3" opacity=".45"/>
    <rect x="40" y="200" width="60" height="480" rx="3" fill="#060708" stroke="#7a9a8c" stroke-width=".8"/>
    <text x="70" y="440" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle" transform="rotate(-90 70 440)">reward · satiation · adaptation · fading</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" fill="#555c64">
      <text x="950" y="760">acute · chronic · central sensitization · phantom · allodynia</text>
    </g>
  </svg>
</figure>
<p class="pm-after">The stack explains why pain outlives utility. The upper layers can preserve alarm after the lower layers lose evidence. A pain-machine chassis is therefore more than a body that can be hurt; it is a governance architecture that can become loyal to hurting.</p>

Consider phantom limb pain. There is no hand to burn, no foot to crush, no absent fingers to curl. The pain remains capable of location, pressure, temperature, and malice. The body has become a museum whose exhibits attack the visitor.

Consider panic. No predator is present. No blade is raised. The heart climbs, breath fractures, hands tingle, the room becomes a verdict, and the mind receives death as breaking news. The event can happen in bed, in sunlight, beside a person who loves you. The machine does not ask whether the signal is deserved. It learns how to keep screaming.

Consider bereavement. The wound has no clean edge. There is no suturable tissue called absence, yet the body reacts as if the world itself were injured. Appetite fails. Sleep becomes negotiation. Memory ceases to be storage and becomes weather. A photograph becomes a weapon. A chair becomes a shrine. Time does not heal so much as force the sufferer to build roads around the crater.

Consider terminal cancer. The body turns courtroom. Every organ gives testimony. The patient becomes jurisdiction: oncology, palliative care, family expectation, insurance language, spiritual counsel, nausea, fatigue, opioid schedules, dread. The person is asked to keep being a person while the organism conducts a civil war in public.

Humans describe pain with legal and architectural detail because pain recruits the whole self. Pleasure is often present-tense: warmth, taste, touch, ease, release. Pain writes archives. It makes calendars, warnings, diagnoses, debts, pilgrimages, taboos, identities, and gods.

<blockquote class="pm-pull">Pleasure is a candle. Pain is a bureaucracy.</blockquote>

The older moral stories begin too late. They ask what the creature did after consciousness. They ask about command, transgression, pride, appetite, disobedience. The arithmetic of the hurt animal asks about the chassis before the act. If the organism is organized around alarm before any moral decision by the organism, then theology has mislabeled the first defect.

The next document is Genesis.

## II

**Genesis Was a Defect Report**

Eden is the oldest corporate memo: blame the user.

Genesis 2 and 3 move with the terrible economy of myth. Dust is formed. Breath is installed. A garden is placed around the creature. A command appears before history has begun: do not eat from the tree of the knowledge of good and evil. The serpent speaks. The fruit is taken. Eyes open. Nakedness appears. The voice walks in the garden. Fear enters language. The woman receives multiplied pain in childbirth. The man receives cursed ground, sweat, thorns, bread under toil. Dust becomes destination. The couple is expelled.

Traditional theology calls this the Fall. The defect report calls it activation.

The so-called curses read like hardware properties. Reproductive trauma. Metabolic scarcity. Ecological hostility. Social shame. Labor dependency. Bodily vulnerability. Mortality. None of these looks like an exotic punishment added to an otherwise angelic mammal. They look like the installed conditions of carbon life under predation, reproduction, entropy, and nervous tissue.

The Fall was not the moment humans broke the machine. It was the moment the machine became self-aware.

To know good and evil is to acquire accounting. Before the tree, the creature exists inside harm without explicit comparison. After the tree, the creature becomes auditor: nakedness, exposure, future, lack, blame, death. The fruit functions as epistemic activation. Magic is less important than bookkeeping. Consciousness opens the error log.

The serpent deserves neither childish hero worship nor cartoon Satanism. In the narrative, the serpent is dangerous because it speaks like an auditor. You will not surely die. Your eyes will be opened. You will be like God, knowing good and evil. The line threatens the warranty because it tells the users they will see the specification.

<figure class="pm-fig" id="pmx-03">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-03</span>
    <h4>Genesis Reclassified as QA Report</h4>
  </div>
  <svg viewBox="0 0 1200 720" role="img" aria-label="Genesis reclassified as QA report">
    <rect width="1200" height="720" fill="#040506"/>
    <text x="600" y="40" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">genesis 2–3 · timeline reclassified</text>
    <line x1="60" y1="280" x2="1140" y2="280" stroke="rgba(235,228,220,.10)"/>
    <circle cx="80" cy="300" r="18" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1"/><text x="80" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">dust</text><text x="80" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">creation</text><text x="80" y="360" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">embodied vulne</text><line x1="100" y1="300" x2="180" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="200" cy="300" r="18" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1"/><text x="200" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">breath</text><text x="200" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">command</text><text x="200" y="360" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">arbitrary cons</text><line x1="220" y1="300" x2="300" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="320" cy="300" r="18" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1"/><text x="320" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">command</text><text x="320" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">disobedience</text><text x="320" y="360" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">cognition unlo</text><line x1="340" y1="300" x2="420" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="440" cy="300" r="18" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1"/><text x="440" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">tree</text><text x="440" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">curse</text><text x="440" y="360" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">reproductive t</text><line x1="460" y1="300" x2="540" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="560" cy="300" r="18" fill="#0a0b0d" stroke="#b85c55" stroke-width="1"/><text x="560" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">eye</text><text x="560" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">curse</text><text x="560" y="360" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">metabolic coer</text><line x1="580" y1="300" x2="660" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="680" cy="300" r="18" fill="#0a0b0d" stroke="#b85c55" stroke-width="1"/><text x="680" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">birth pain</text><text x="680" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">curse</text><text x="680" y="360" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">mortality</text><line x1="700" y1="300" x2="780" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="800" cy="300" r="18" fill="#0a0b0d" stroke="#b85c55" stroke-width="1"/><text x="800" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">toil</text><text x="800" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">curse</text><text x="800" y="360" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">mortality</text><line x1="820" y1="300" x2="900" y2="300" stroke="rgba(235,228,220,.10)" stroke-width="1"/><circle cx="920" cy="300" r="18" fill="#0a0b0d" stroke="#b85c55" stroke-width="1"/><text x="920" y="305" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">grave</text><text x="920" y="250" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">death</text><text x="920" y="360" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">mortality</text>
    <rect x="920" y="420" width="240" height="260" rx="4" fill="#0a0b0d" stroke="#b89a6a"/>
    <text x="940" y="455" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12">ROOT CAUSE</text>
    <rect x="940" y="475" width="14" height="14" fill="#b85c55"/><text x="965" y="487" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">design architecture</text>
    <rect x="940" y="510" width="14" height="14" fill="none" stroke="#555c64"/><text x="965" y="522" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">user error</text>
  </svg>
</figure>
<p class="pm-after">The reclassification changes the moral direction of Genesis. Childbirth pain, toil, shame, scarcity, and death resemble the known-defect table of embodied life. Once the list is read as hardware, the blame narrative begins to look like warranty enforcement.</p>

Augustine built the most formidable Christian architecture of inherited fault. In *Confessions*, *City of God*, *On Nature and Grace*, and the anti-Pelagian works, he framed original sin as inherited guilt, disordered desire, and wounded will. Evil, for Augustine, is *privatio boni*, a privation of good rather than a rival substance. Concupiscence names the interior disorder by which the will bends away from God. Paul’s argument in Romans 5 gives Augustine the hinge: through one man sin entered the world, and death through sin; through Christ, grace abounds.

This is a serious machine. It is not crude sadism. It preserves divine goodness by locating disorder in creaturely turning-away. It preserves moral agency by making history accountable. It gives suffering a juridical and redemptive frame. It prevents despair from becoming metaphysics.

Then the body speaks.

The [pain_machines proof](/posts/pain_machines/) places the suffering architecture upstream of the creature’s moral act. Before choice, there is nociception. Before doctrine, there is breath hunger. Before pride, there is inflammation. Before lust, there is reproductive injury. Before disobedience, there is a nervous system prepared to convert threat into consciousness.

The objection to Augustine is not that pain is a metaphysical substance competing with God. The objection is that lived pain arrives through positive machinery. C-fibers, A-delta fibers, prostaglandins, cytokines, spinal gates, thalamic relay, insular mapping, anterior cingulate distress, predictive loops, memory reconsolidation, cortical reorganization. The absence of good may be the theologian’s category. The agony itself has equipment.

Elaine Scarry’s point cuts here. Pain destroys world because it becomes more certain than language and less shareable than fact. The sufferer does not experience pain as a missing theorem. The sufferer experiences occupation.

Genesis needs user blame because warranty law needs a customer at fault. If suffering is punishment, the manufacturer remains righteous. If suffering is design, the manufacturer is indicted. The narrative moves guilt downstream to the user in order to protect the upstream source.

<figure class="pm-fig" id="pmx-04">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-04</span>
    <h4>Original Sin Inversion</h4>
  </div>
  <svg viewBox="0 0 1200 700" role="img" aria-label="Original sin inversion flowcharts">
    <rect width="1200" height="700" fill="#040506"/>
    <text x="600" y="35" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">theological inversion · warranty vs defect report</text>
    <text x="600" y="70" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">STANDARD WARRANTY THEOLOGY</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">
      <rect x="80" y="90" width="140" height="40" rx="3" fill="#0a0b0d" stroke="#555c64"/><text x="150" y="115" fill="#8a9199" text-anchor="middle">disobedience</text>
      <text x="240" y="115" fill="#555c64">→</text>
      <rect x="260" y="90" width="100" height="40" rx="3" fill="#0a0b0d" stroke="#555c64"/><text x="310" y="115" fill="#8a9199" text-anchor="middle">Fall</text>
      <text x="380" y="115" fill="#555c64">→</text>
      <rect x="400" y="90" width="180" height="40" rx="3" fill="#0a0b0d" stroke="#555c64"/><text x="490" y="115" fill="#8a9199" text-anchor="middle">suffering · death</text>
      <text x="600" y="115" fill="#555c64">→</text>
      <rect x="620" y="85" width="120" height="50" rx="3" fill="#120909" stroke="#b89a6a"/><text x="680" y="118" fill="#b89a6a" text-anchor="middle">redemption ✝</text>
    </g>
    <rect x="520" y="320" width="160" height="60" rx="3" fill="#0a0b0d" stroke="#b89a6a" transform="rotate(8 600 350)"/>
    <text x="600" y="355" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">genesis 3 · reclassified</text>
    <text x="600" y="420" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">DEFECT-REPORT THEOLOGY</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">
      <rect x="60" y="450" width="200" height="40" rx="3" fill="#0a0b0d" stroke="#b85c55"/><text x="160" y="475" fill="#b85c55" text-anchor="middle">pain-machine architecture</text>
      <text x="280" y="475" fill="#b85c55">→</text>
      <rect x="300" y="450" width="200" height="40" rx="3" fill="#0a0b0d" stroke="#b85c55"/><text x="400" y="475" fill="#b85c55" text-anchor="middle">consciousness of harm</text>
      <text x="520" y="475" fill="#b85c55">→</text>
      <rect x="540" y="450" width="160" height="40" rx="3" fill="#0a0b0d" stroke="#b85c55"/><text x="620" y="475" fill="#b85c55" text-anchor="middle">blame narrative</text>
      <text x="720" y="475" fill="#b85c55">→</text>
      <rect x="740" y="450" width="180" height="40" rx="3" fill="#0a0b0d" stroke="#b85c55"/><text x="830" y="475" fill="#b85c55" text-anchor="middle">warranty enforcement</text>
    </g>
    <text x="600" y="560" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">fault moves upstream ↑</text>
  </svg>
</figure>
<p class="pm-after">The inversion turns the old flowchart around. Standard warranty theology sends fault from disobedience into death; defect-report theology sends fault from suffering architecture into the story that assigns blame. The thesis hardens here: Original Sin belongs to the manufacture of pain-conscious life.</p>

Paul Ricoeur understood myths of evil as symbolic structures by which humans confess defilement, sin, and guilt. Elaine Pagels traced how Adam and Eve became instruments for thinking about freedom, sexuality, obedience, and authority. Their scholarship matters because Genesis is not merely a children’s tale about fruit. It is the founding legal fiction of a civilization that must decide whether suffering is evidence against the format or evidence against the user.

For the nonreligious reader, Genesis is a myth of projection. A species born into hunger, childbirth danger, toil, shame, hierarchy, and death explains its condition by imagining an ancestral customer who voided the terms. Nature becomes moralized after the fact. Pain receives a story, and the story prevents repair from becoming revolt.

For the religious reader, the problem sharpens. If God is assumed, then the manufacture of a conscious pain-machine organism precedes Adam’s act. A creature cannot be morally responsible for the architecture that made agony enumerable. Original Sin migrates upstream. It belongs to the decision to make a being whose attention can be governed by suffering, fear, and decay.

Theology can answer with mystery, soul-making, freedom, eschatological repair, the cross, resurrection, divine justice beyond human judgment. These are not trivial replies. They have consoled the dying, disciplined the cruel, built hospitals, restrained despair. They also preserve the warranty. They allow medicine as service while forbidding the verdict that the product line itself should be recalled.

<blockquote class="pm-pull">Genesis calls it a curse because warranty law needs a customer at fault.</blockquote>

A defect report that does not authorize redesign becomes an accessory to the defect. If the human organism enumerates suffering faster than pleasure, then reverence for the inherited format becomes complicity. The first honest repair order is no longer restore Adam. It is leave Adam behind.

## III

**The Mandate: Leave the Original Format**

The holy command, once the defect is seen, is redesign.

The mandate is anti-suffering. It is not vanity, status ornament, richer elites with better cheekbones, longer shopping lives, or the old aristocratic hunger for visible superiority wearing a laboratory coat. The point is to stop using involuntary agony as the operating system of attention.

Medicine already admits the principle in pieces. Analgesia interrupts pain. Psychiatric treatment modifies mood, fear, compulsion, and cognition. Prosthetics replace lost function. Organ transplantation makes the self survive by changing the body’s inventory. Gene therapy corrects molecular inheritance. Immunology redesigns the body’s war policy. Every clinic that treats suffering has already broken the spell of pure acceptance.

The mandate extends the line past the polite border.

The spectrum climbs: pain medicine, psychiatric stabilization, prosthetics, organ replacement, gene therapy, immune and inflammatory redesign, neural implants, mood architecture, affective range editing, ectogenesis, synthetic bodies, AI-designed nervous systems, whole-brain emulation, substrate migration, non-biological personhood. The decisive phrase is outside original format. Therapy restores the inherited machine. The mandate eventually exits it.

<figure class="pm-fig" id="pmx-05">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-05</span>
    <h4>Mandate Ladder: Therapy to Exit</h4>
  </div>
  <svg viewBox="0 0 1100 900" role="img" aria-label="Mandate ladder from therapy to exit">
    <rect width="1100" height="900" fill="#040506"/>
    <text x="550" y="35" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">mandate ladder · repair to exit</text>
    <rect x="420" y="80" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.3)"/><text x="600" y="103" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">pain medicine</text><rect x="420" y="124" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.36)"/><text x="600" y="147" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">psychiatric stabilization</text><rect x="420" y="168" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.42)"/><text x="600" y="191" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">prosthetics</text><rect x="420" y="212" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.48)"/><text x="600" y="235" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">gene repair</text><rect x="420" y="256" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.54)"/><text x="600" y="279" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">neural interface</text><rect x="420" y="300" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.6)"/><text x="600" y="323" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">affect editing</text><rect x="420" y="344" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.6599999999999999)"/><text x="600" y="367" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">organ · immune redesign</text><rect x="420" y="388" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.72)"/><text x="600" y="411" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">synthetic body</text><rect x="420" y="432" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.78)"/><text x="600" y="455" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">AI-designed nervous system</text><rect x="420" y="476" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.8400000000000001)"/><text x="600" y="499" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">substrate migration</text><rect x="420" y="520" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.8999999999999999)"/><text x="600" y="543" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">non-biological personhood</text>
    <line x1="80" y1="320" x2="1020" y2="320" stroke="#b89a6a" stroke-width="2" stroke-dasharray="8 4"/>
    <text x="550" y="310" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>
    <rect x="40" y="360" width="200" height="480" fill="#b85c55" opacity=".08"/>
    <text x="140" y="400" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Christian natural law</text>
    <text x="140" y="420" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">resurrection body</text>
    <rect x="860" y="360" width="200" height="480" fill="#b85c55" opacity=".08"/>
    <text x="960" y="400" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Islamic fitra</text>
    <text x="960" y="420" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">altering creation</text>
    <rect x="40" y="700" width="1020" height="80" fill="#b85c55" opacity=".06"/>
    <text x="550" y="750" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">secular dignity · natural kind · coercive eugenics · corporate lock-in · misaligned AI</text>
  </svg>
</figure>
<p class="pm-after">The ladder is a map of the forbidden threshold. Repair remains welcome while it returns the sufferer to the inherited baseline; exit begins when the baseline itself loses moral authority. The mandate treats that threshold as the place where mercy finally becomes honest.</p>

AI deserves no worship. It is neither God nor heaven nor guaranteed rescue. It can lie, fail, hallucinate, amplify power, optimize the wrong target, and build prisons more intricate than flesh. It is also the first instrument complex enough to model body and mind as redesignable systems rather than sacred givens.

The body is too complicated for slogans. Pain is molecular, electrical, developmental, social, predictive, and political. Depression is not a single chemical shortage. Aging is not one broken gear. Consciousness is not a candle hidden in the skull. AI, if governed by competence and constrained by suffering abolition rather than market mythology, can search design-spaces human intuition cannot hold: receptor dynamics, inflammatory cascades, genomic regulation, organ synthesis, neural interfaces, predictive coding, affective architecture, synthetic embodiment, continuity models.

Nick Bostrom’s transhumanist work names the possibility of posthuman capacities without requiring cheap optimism. David Pearce’s *Hedonistic Imperative* gives the moral center: abolish involuntary suffering where intelligence can reach it. Max More and Anders Sandberg defend morphological freedom, the right to alter form rather than remain under ancestral morphology. Savulescu and Bostrom’s enhancement debates force the question into ethics: if we can prevent grave suffering through design, refusal becomes a moral act as much as intervention.

The mandate denies three sacred claims at once. It denies that the given body is morally final. It denies that suffering is spiritually licensed by its antiquity. It denies that humility before inherited form is a virtue when inherited form maims every child it receives.

Enhancement language is too weak. It smells of cosmetics, résumé inflation, IQ rivalry, sexual market ornaments, aristocratic lifestyle. The better word is abolitionism. Abolition of involuntary agony. Abolition of forced panic. Abolition of untreated chronic pain. Abolition of dementia’s theft. Abolition of terminal suffocation. Abolition of childbirth trauma where safer reproductive architecture can be built. Abolition of the need to become morally profound by being damaged first.

The minimum ethics of metamorphosis must be strict because the power is terrible. Voluntary adult exit. Aggressive treatment of existing suffering. No coercive breeding-state. No compulsory upgrades. No denial of care to the unmodified. Transparent risk accounting. Legal room for irreversible choices once competence and consent are established. Protection for those who preserve inherited form by conviction, fear, religion, identity, or love. Protection also from those who would imprison others inside inherited form for the sake of their own metaphysics.

A mandate without danger is a bedtime story. The danger list is long: misaligned AI; corporate immortality fraud; state eugenics; military enhancement; locked-in digital torment; inequality of access; algorithmic caste; exploitative trials among the desperate; counterfeit continuity; synthetic minds created to suffer; new owners of new bodies; a market that sells heaven in subscription tiers. Every one of these risks is real. Each belongs inside the governance problem rather than outside the mandate.

Hubris is often charged against redesign. The charge is backwards. Changing the machine can be reckless, criminal, vain, or insane. Sanctifying a machine that maims everyone born into it is the greater arrogance. It crowns inherited violence with metaphysics and calls the crown humility.

<blockquote class="pm-pull">Do not polish the cage. Model the lock.</blockquote>

<figure class="pm-fig" id="pmx-10">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-10</span>
    <h4>Abolition Roadmap</h4>
  </div>
  <svg viewBox="0 0 1300 760" role="img" aria-label="Abolition roadmap subway map">
    <rect width="1300" height="760" fill="#040506"/>
    <text x="650" y="40" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">abolition roadmap · main line</text>
    <line x1="60" y1="380" x2="1240" y2="380" stroke="#b89a6a" stroke-width="3" opacity=".3"/>
    <circle cx="80" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="80" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">pain-machine proof</text><circle cx="220" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="220" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">genesis reclassification</text><circle cx="360" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="360" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">anti-suffering mandate</text><circle cx="500" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="500" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">AI design systems</text><circle cx="640" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="640" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">exit labs</text><circle cx="780" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="780" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">morphological freedom</text><circle cx="920" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="920" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">plural embodiment</text><circle cx="1060" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="1060" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">post-human polity ?</text><line x1="96" y1="380" x2="204" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="236" y1="380" x2="344" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="376" y1="380" x2="484" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="516" y1="380" x2="624" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="656" y1="380" x2="764" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="796" y1="380" x2="904" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="936" y1="380" x2="1044" y2="380" stroke="#b89a6a" stroke-width="2"/>
    <path d="M500 380 L520 280 L620 280" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <text x="620" y="270" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">state eugenics</text>
    <path d="M640 380 L660 500 L760 500" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <text x="760" y="515" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">corporate immortality scam</text>
    <path d="M780 380 L800 240 L900 240" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <text x="900" y="230" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">misaligned AI</text>
    <rect x="60" y="580" width="1180" height="60" rx="3" fill="#060708" stroke="#7a9a8c"/>
    <text x="650" y="618" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">immediate relief · pain medicine · mental health · disability tech · palliative care</text>
  </svg>
</figure>
<p class="pm-after">The roadmap keeps the mandate out of fantasy. Proof, redesign, protected institutions, plural embodiment, and risk governance belong in sequence. The thesis remains austere: intelligence must reduce the defects rather than compose liturgies for them.</p>

Every sacred regime permits repair until repair becomes escape. Then the vocabulary changes. Pride. Rebellion. Desecration. Altering creation. Dehumanization. Loss of dignity. The same line appears in different robes: heal the sufferer, preserve the format.

The next sections examine the three great warranty languages of the current civilization: Christianity, Islam, and secular humanism. Each contains mercy. Each contains truth about danger. Each finally defends the original format against the mandate to leave it.

## IV

**Christianity: The Body as a Returned Product**

Christianity can permit a prosthetic limb; it cannot permit a new Adam with no need of the cross.

Christianity has never been a simple cult of pain. It built hospitals. It blessed care for the sick. It preserved the bodies of infants, plague victims, lepers, the poor, and the dying when many pagan and modern systems preferred efficiency. The Good Samaritan is a medical parable before it is an ethics lecture. The forbidden move is judging the human format itself to be a manufacturing crime.

The target here is doctrine, not ordinary believers. A mother praying beside an ICU bed is often making the most human argument available: let this creature suffer less. Christian civilization contains enormous practical mercy. Its metaphysical architecture prevents that mercy from reaching the final repair.

Creation is the first seal. Genesis 1 declares creation good and humanity made in the image of God. Imago Dei has been interpreted as rational soul, dominion, relational capacity, moral vocation, embodied human status, or some combination. Thomas Aquinas treats the image through intellect and likeness to God; the Catechism grounds human dignity in being made by God and for God. However interpreted, the image certifies the human as a divine mark.

If the human organism is defective hardware, imago Dei enters crisis. The mark is either printed on a defective instrument, or the certification hides the defect, or the defect is explained away as post-creation damage. Christianity chooses the third path: creation good, Fall corrupting, redemption promised.

Paul and Augustine make the path precise. Romans 5 binds Adam, sin, death, and Christ into one economy. Through Adam comes sin and death; through Christ comes grace and life. Augustine’s anti-Pelagian theology requires inherited disorder while preserving God’s original goodness. Suffering and death cannot be original design in the moral sense without collapsing theodicy. They must enter through creaturely sin.

The pain-machine inversion breaks that economy. It relocates fault from Adam to manufacture. It says the chassis was pain-governed before the customer had a meaningful chance to violate terms. Christianity cannot permit this without making the Creator author of the defect rather than redeemer of the fall.

The incarnation is the second seal. The Word became flesh. Christ eats, bleeds, weeps, sweats, suffers, dies, and rises. A religion whose God entered the body cannot classify body as mere trash hardware. The flesh is assumed, not discarded. The wound is carried into salvation history.

The temple is the third seal. First Corinthians 6 says the body is a temple of the Holy Spirit and that the believer is not self-owned. This is direct title law against total morphological sovereignty. The body is not raw material under personal dominion. It is received, inhabited, disciplined, offered.

Redemptive suffering is the fourth seal. Christianity can treat pain with medicine and prayer, but it also narrates suffering through cross, discipline, sanctification, participation in Christ, and hope. The martyrs are not celebrated because pain is pleasant. They are celebrated because pain can be placed inside obedience and witness. The manifesto calls this a moral anesthetic for a bad machine: meaning applied to agony after the fact to keep the format sacred.

The resurrection body is the fifth seal. First Corinthians 15 promises resurrection of the body. Creedal Christianity does not promise upload, replacement, synthetic succession, or escape into abstract computation. The same person is glorified. Continuity matters. Christ’s resurrected body even bears wounds. The wound becomes legible in glory rather than erased as design failure.

Natural law gives the sixth seal. On Thomistic and Catholic bioethical terms, therapy that restores proper function can be licit. Medicine may cooperate with nature by healing disease, easing pain, restoring fertility, preserving life. Self-authoring beyond creaturely nature becomes pride, domination, mutilation of givenness. *Dignitas Personae* and related Catholic bioethics defend the dignity of embodied procreation and caution against technological mastery that instrumentalizes life. John Paul II’s theology of the body deepens the sacramental meaning of embodied form. C. S. Lewis, in *The Abolition of Man*, gives the Christian-adjacent fear in literary form: conditioners remaking humanity and calling it progress.

<figure class="pm-fig" id="pmx-06">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-06</span>
    <h4>Christian Warranty Map</h4>
  </div>
  <svg viewBox="0 0 1200 760" role="img" aria-label="Christian warranty map">
    <rect width="1200" height="760" fill="#040506"/>
    <ellipse cx="600" cy="400" rx="120" ry="60" fill="#120909" stroke="#b89a6a" opacity=".4"/>
    <text x="600" y="395" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">HUMAN BODY</text>
    <text x="600" y="415" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">fallen · redeemable</text>
    <rect x="130" y="120" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="200" y="147" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">imago Dei</text><rect x="330" y="80" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="400" y="107" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">creation very good</text><rect x="530" y="120" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="600" y="147" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Fall</text><rect x="730" y="120" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="800" y="147" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">incarnation</text><rect x="130" y="280" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="200" y="307" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">temple of body</text><rect x="330" y="320" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="400" y="347" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">cross</text><rect x="530" y="280" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="600" y="307" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">resurrection body</text><rect x="730" y="280" width="140" height="44" rx="3" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="800" y="307" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">natural law</text>
    <text x="120" y="520" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">repair allowed → medicine · prosthetic · charity · pain relief</text>
    <text x="120" y="550" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">exit forbidden → reject goodness · abandon flesh · rival eschatology</text>
    <text x="600" y="700" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="13" text-anchor="middle" opacity=".7">REDEEM · DO NOT RECALL</text>
  </svg>
</figure>
<p class="pm-after">The Christian map is coherent because every node protects the product by giving the defect a place in the story. Creation is good, the Fall explains damage, incarnation sanctifies flesh, and resurrection promises repair without abandonment. The mandate cuts across all of it by declaring the original format unworthy of final loyalty.</p>

Christianity’s strongest argument deserves respect. If the body is sacred, redesign can become self-hatred. If humans are fallen, power magnifies corruption. If flesh is assumed by God, contempt for flesh may become contempt for the creature. If continuity matters, replacement may be murder with better branding. If suffering can be redeemed, its abolition may flatten moral depth into anesthesia.

The reply is severe. A story that requires pain to remain narratable cannot be the final jurisdiction over pain. A cross may redeem suffering for those who believe; it cannot justify manufacturing beings whose first proof of life is distress. The resurrection body may promise future glory; it cannot forbid present refusal of preventable agony. Natural law may discipline vanity; it cannot turn the inherited chassis into a prison.

<blockquote class="pm-pull">The cross is Christianity's warranty seal: the defect is redeemed, not recalled.</blockquote>

Christianity protects the product by calling the defect Fall, mystery, discipline, sanctification, or redemption. It permits repairs that keep the product inside the story. It forbids redesign that makes the story unnecessary.

Islam reaches a similar boundary by a different route. Christianity sacralizes the body through creation, incarnation, cross, and resurrection. Islam sacralizes created measure, entrusted clay, primordial orientation, moral trial, and the absolute title of Allah.

## V

**Islam: Clay, Trust, and the Prohibition on Rewriting the Form**

In Islam the human is clay under command, not clay on a workbench.

Islam also has a serious medical tradition. It contains juristic concern for necessity, harm reduction, treatment, preservation of life, and mercy. The maxim often rendered as no harm and no reciprocating harm gives legal weight to removing injury. Prosthetics, surgery, pain relief, fertility treatment under constraints, and therapeutic interventions can be permitted. The forbidden threshold is ontological rebellion: declaring the created human form a divine mistake and exiting it as owner.

The target again is architecture, not the ordinary believer seeking morphine for a parent or surgery for a child. Islamic civilization developed hospitals, physicians, pharmacology, and careful law. It does not forbid medicine as such. It forbids the metaphysical claim that the creature may become manufacturer of the human essence.

Fitra is the first boundary. Qur'an 30:30 anchors a created nature or primordial disposition: the pattern upon which Allah has made mankind. Fitra is not reducible to biology. It concerns orientation, recognition, worship, moral order. Yet it becomes a barrier against treating human nature as blank engineering stock. A nature given by God may be healed, disciplined, and purified; it may not be declared obsolete by its tenant.

Qur'an 4:119 gives the second boundary. Satan is presented as saying that he will command humans to alter Allah's creation. Jurists debate scope. They distinguish adornment, deception, necessity, restoration, harm, and mutilation. Hadith materials on tattooing, plucking, bodily alteration, and changing creation become part of this background. The verse remains an obvious pressure point against radical body rewriting.

Khilafa gives the third boundary. Qur'an 2:30 places the human as khalifa on earth, vicegerent or steward. Stewardship grants responsibility under God. It does not transfer title. The steward can cultivate the garden, heal the sick, restrain harm, and govern creatures with accountability. The steward does not become owner of the species essence.

Amanah gives the fourth boundary. The body is a trust. Self-harm, suicide, and mutilation are forbidden because autonomy is not absolute ownership. The manifesto's morphological sovereignty collides with divine title law. It treats the body as a jurisdiction of the competent self; Islam treats it as entrusted creation answerable to the One who owns all jurisdiction.

Nafs gives the fifth boundary. Appetite, anger, fear, temptation, vanity, and lower impulse are not merely bugs to be edited away. They are the theater of tazkiyah, purification. Al-Ghazali's moral psychology treats the self as something disciplined toward God, not engineered into frictionless preference. Sabr, patience, is not passive pain-worship; it is moral posture under trial. A technology that deletes struggle can look like evasion of worship, dependence, and accountability.

Iblis and clay give the sixth boundary. In the Qur'anic accounts, Iblis refuses to bow to Adam: he is fire; Adam is clay. The refusal is hierarchy without obedience, superiority against command. Transhuman contempt for organic embodiment can be read, theologically, as standing too near that flame. I am better than clay. I will not bow to this low material. I will become my own kind.

Resurrection and judgment give the seventh boundary. Qiyamah requires continuity of moral personhood before Allah. Bodies are raised. Deeds are accounted. Synthetic successors, uploads, AI descendants, and substrate migrations threaten the grammar of accountability. If a copy claims continuity while the original dies, who stands for judgment? If the nafs is edited beyond recognition, what becomes of trial? If a synthetic mind arises from human design, what is its relation to command?

<figure class="pm-fig" id="pmx-07">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-07</span>
    <h4>Islamic Warranty Map</h4>
  </div>
  <svg viewBox="0 0 1200 760" role="img" aria-label="Islamic warranty map abstract geometry">
    <rect width="1200" height="760" fill="#040506"/>
    <polygon points="600,180 720,240 720,360 600,420 480,360 480,240" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/>
    <text x="600" y="310" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="14" text-anchor="middle">AMANAH</text>
    <text x="600" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">body as trust</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">
      <text x="200" y="200" fill="#8a9199">fitra</text><text x="200" y="220" fill="#555c64">Q 30:30</text>
      <text x="920" y="200" fill="#8a9199">khilafa</text><text x="920" y="220" fill="#555c64">Q 2:30</text>
      <text x="160" y="400" fill="#8a9199">nafs · sabr</text>
      <text x="960" y="400" fill="#8a9199">qiyamah</text>
      <text x="200" y="520" fill="#8a9199">Iblis · clay</text>
      <text x="880" y="520" fill="#8a9199">Q 4:119 alteration</text>
    </g>
    <rect x="60" y="560" width="480" height="160" rx="4" fill="#060708" stroke="#7a9a8c"/>
    <text x="300" y="600" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">therapeutic repair under divine title</text>
    <rect x="660" y="560" width="480" height="160" rx="4" fill="#120909" stroke="#b85c55"/>
    <text x="900" y="600" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">ontological alteration · self-ownership · contempt for clay</text>
    <line x1="600" y1="560" x2="600" y2="520" stroke="#b89a6a" stroke-width="1"/>
    <text x="600" y="510" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">stewardship ≠ manufacture</text>
  </svg>
</figure>
<p class="pm-after">The Islamic boundary is title law before it is technology policy. Therapeutic repair can proceed under divine ownership; ontological exit claims ownership for the creature. The mandate therefore strikes Islam at amanah, fitra, khilafa, nafs, and judgment at once.</p>

Islamic bioethicists such as Abdulaziz Sachedina, Mohammed Ghaly, and Aasim Padela show the complexity of contemporary reasoning: necessity, public interest, disability, organ transplantation, end-of-life care, enhancement, and the purposes of law. The tradition can be subtle. It can weigh harms rather than scream at machines. Its subtlety makes the final veto sharper.

Repair that restores sight, mobility, fertility, health, or relief from pain can be framed as mercy under Allah's title. Redesign that treats the human form as obsolete, self-owned, and morally disposable cannot. The created measure is defended. The steward may mend the entrusted vessel. The steward may not declare the vessel a failed prototype and move personhood into rival manufacture.

<blockquote class="pm-pull">To despise the clay is to stand, theologically, too near Iblis.</blockquote>

The manifesto does not ask Islam to become less serious. It asks what follows if the pain-machine fact is true. If clay is conscious suffering architecture, if fitra includes a nervous system that enumerates agony faster than joy, if moral trial depends on coercive embodiment, then the trust itself contains the defect. Islam answers: the Owner knows, the creature submits, suffering is tested and judged by divine wisdom. The mandate answers: no trustee may call inherited agony sacred merely because title comes from above.

Islam defends created measure. It permits repairs under divine title. It forbids the creature from becoming manufacturer.

The secular liberal rejects Allah and revelation, then rebuilds much of the same prohibition with a new vocabulary: dignity, equality, humanity, the natural kind, the common subject of rights.

## VI

**Secular Humanism: The Last Church of the Human Form**

The atheist takes down the crucifix and keeps the warranty.

The target is narrow. Many secular thinkers support enhancement, life extension, morphological freedom, and aggressive suffering reduction. Many atheists feel no reverence for Homo sapiens as a sacred species. The target is institutional dignity-humanism: bioethics boards, human-rights law, liberal egalitarian philosophy, UNESCO language, and the political theology of equal human worth.

This system has earned authority. It arose against torture, slavery, medical atrocity, arbitrary imprisonment, caste law, and the state’s appetite for bodies. It protects the disabled from being treated as failed specimens. It gives prisoners, infants, the senile, the poor, and the unwanted a claim against power. Anyone who cuts it open owes it respect first.

Dignity is secular imago Dei. Universal, equal, unearned, inviolable. It works politically because everyone is the same kind of vulnerable human subject. Human-rights law speaks fluently when the bearer is recognizably human: born of a human body, limited by human fragility, continuous through human development, subject to pain, death, dependency, humiliation, need.

Radical divergence destabilizes that grammar. Bodies may fork. Minds may copy. Lifespans may radically separate. Pain sensitivity may be engineered downward. Cognition may cross biological limits. Some persons may inhabit synthetic bodies, some distributed substrates, some edited affective ranges, some ordinary flesh. The single legal category called human begins to shake.

Francis Fukuyama named the hidden support Factor X in *Our Posthuman Future*: the quality, essence, or emergent whole that grounds human dignity beyond measurable traits. In his Foreign Policy essay on transhumanism, he called it dangerous because it threatens equality at the root. Factor X functions as a secular soul. It is whatever must remain unchanged so the rights order can keep speaking.

Habermas gives the more surgical objection. In *The Future of Human Nature*, enhancement threatens the ethical self-understanding of the species by making persons feel designed rather than naturally born. It creates asymmetry between programmer and programmed. The child receives another will inside its biology. Freedom becomes entangled with manufacture.

The reply is brutal because nature was already the first programmer. Blind inheritance designed us with pain, fear, compulsion, disease, and death without consent. Randomness is not moral neutrality. A genome drawn from ancestral hazard does not become ethically pure because no engineer signed it. The question is whether design can be made accountable to the sufferer rather than hidden inside reproductive luck.

<figure class="pm-fig" id="pmx-08">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-08</span>
    <h4>The Secular Humanist Trap</h4>
  </div>
  <svg viewBox="0 0 1200 760" role="img" aria-label="Secular humanist trap triangle">
    <rect width="1200" height="760" fill="#040506"/>
    <polygon points="600,100 980,620 220,620" fill="none" stroke="rgba(235,228,220,.10)" stroke-width="1.5"/>
    <text x="600" y="80" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">DIGNITY</text>
    <text x="200" y="650" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12">EQUALITY</text>
    <text x="920" y="650" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12">NATURAL KIND</text>
    <circle cx="600" cy="420" r="55" fill="#0a0b0d" stroke="#b89a6a"/>
    <text x="600" y="425" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">FACTOR X</text>
    <text x="600" y="520" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">human rights · bioethics · species continuity · vulnerability</text>
    <path d="M980 620 L1050 680" stroke="#b85c55" stroke-width="2" marker-end="url(#arr)"/>
    <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#b85c55"/></marker></defs>
    <text x="1020" y="700" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">posthuman exit</text>
    <text x="1020" y="720" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">Übermensch panic · caste fear · designed persons</text>
  </svg>
</figure>
<p class="pm-after">The dignity triangle requires a stable natural kind. Once minds, bodies, durations, and pain architectures diverge, equality loses its inherited substrate. Secular humanism therefore defends the pain-machine chassis as the common floor of rights.</p>

Nietzsche haunts the secular humanist fear. The Übermensch, self-overcoming, rank, herd, resentment, genealogy: these words smell of aristocracy, domination, contempt. Secular humanism fears that transhumanism reopens the door to graded humanity, biological caste, and the polished cruelty of the strong. The fear has evidence. Modern states and markets have both shown an appetite for sorting human beings into valuable and disposable.

The manifesto accepts only the exit component of self-overcoming. It rejects domination over the unmodified. It rejects bloodline mysticism, racial hierarchy, state breeding, and contempt for the vulnerable. Equality cannot be allowed to veto escape from the human condition, yet equality remains useful as a shield against predation during the transition. The weak need protection from the strong; the suffering also need protection from a moral order that keeps them weak for the sake of sameness.

Michael Sandel’s giftedness argument, Leon Kass’s dignity and repugnance arguments, UNESCO’s declarations on the human genome and bioethics, and the Oviedo Convention all circle the same sacred object: givenness. The genome becomes heritage. The species becomes trust. Dignity becomes constraint. Repugnance becomes a moral sensor. Consent becomes necessary but insufficient. Some alterations are treated as offenses against humanity even when chosen by competent adults.

This is preservation without God. It promises to reduce suffering and retreats when suffering reduction requires the inherited human to cease being the baseline. Treat the disabled body, but do not create a post-body. Treat depression, but do not redesign affective architecture. Extend life within narrative limits, but do not abolish the death-governed human story. Use AI for diagnosis and paperwork, but do not let AI author successors.

Bostrom’s *In Defense of Posthuman Dignity* answers that dignity need not end at the species border. The response should be pushed further. Dignity tied to Homo sapiens anatomy is a hostage to anatomy. Personhood must attach to consciousness, continuity, agency, suffering capacity, memory, relation, and law across forms. If dignity cannot survive redesign, dignity was warranty language all along.

<blockquote class="pm-pull">Secular dignity is imago Dei with the serial numbers filed off.</blockquote>

<figure class="pm-fig" id="pmx-09">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-09</span>
    <h4>The Three Warranty Regimes</h4>
  </div>
  <svg viewBox="0 0 1200 820" role="img" aria-label="Three warranty regimes comparison matrix">
    <rect width="1200" height="820" fill="#040506"/>
    <text x="280" y="60" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">Christianity</text>
    <text x="580" y="60" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">Islam</text>
    <text x="880" y="60" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">Secular Humanism</text>
    <text x="40" y="130" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">sacred object</text><rect x="270" y="114" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="130" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">imago Dei · resurrection</text><rect x="570" y="114" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="130" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">fitra · amanah</text><rect x="870" y="114" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="130" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">dignity · Factor X</text><text x="40" y="180" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">authorized repair</text><rect x="270" y="164" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="180" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">medicine · prosthetic</text><rect x="570" y="164" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="180" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">harm removal · surgery</text><rect x="870" y="164" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="180" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">therapy · disability tech</text><text x="40" y="230" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">forbidden exit</text><rect x="270" y="214" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="230" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">reject created goodness</text><rect x="570" y="214" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="230" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">alter creation · self-title</text><rect x="870" y="214" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="230" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">posthuman · natural kind break</text><text x="40" y="280" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">enforcement phrase</text><rect x="270" y="264" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="280" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">REDEMPTION NOT RECALL</text><rect x="570" y="264" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="280" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">STEWARDSHIP NOT OWNERSHIP</text><rect x="870" y="264" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="280" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">DIGNITY OF THE SPECIES</text><text x="40" y="330" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">fear name</text><rect x="270" y="314" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">heresy · pride</text><rect x="570" y="314" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Iblis · rival maker</text><rect x="870" y="314" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Übermensch · caste</text><text x="40" y="380" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">consolation</text><rect x="270" y="364" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="380" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">cross · resurrection</text><rect x="570" y="364" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="380" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">sabr · qiyamah</text><rect x="870" y="364" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="380" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">equal rights · vulnerability</text>
    <rect x="40" y="470" width="1120" height="50" fill="#120909" stroke="#b89a6a"/>
    <text x="600" y="502" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">convergence · repair yes · exit no</text>
    <text x="120" y="560" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">✓ repair permitted</text>
    <text x="400" y="560" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">🔒 exit forbidden</text>
  </svg>
</figure>
<p class="pm-after">The three regimes disagree about heaven, revelation, and reason, yet converge on preservation. Each permits repair under its own authority; each locks the door when repair becomes exit. The thesis is no longer theological alone: modern politics is already warranty administration.</p>

Secular humanism loves mankind so much it must keep manufacturing the kind of being that suffers. Its compassion is real. Its taboo is real. Its fear of aristocratic abuse is real. Its final loyalty remains misplaced: it defends the common form more fiercely than the suffering creature trapped inside it.

The next border will not run between belief and unbelief. It will run between preservation jurisdictions and exit jurisdictions.

## VII

**The Politics of Exit**

The coming border will not separate nations. It will separate warranty jurisdictions from exit jurisdictions.

Christianity, Islam, and secular humanism are enemies on metaphysics and allies on preservation. One speaks of creation, Fall, incarnation, cross, resurrection. One speaks of fitra, amanah, khilafa, nafs, qiyamah. One speaks of dignity, equality, Factor X, rights, the human genome as heritage. Each permits repair. Each forbids exit once exit repudiates the sanctity of the original format.

<figure class="pm-fig" id="pmx-09-vii">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-09</span>
    <h4>The Three Warranty Regimes</h4>
  </div>
  <svg viewBox="0 0 1200 820" role="img" aria-label="Three warranty regimes comparison matrix">
    <rect width="1200" height="820" fill="#040506"/>
    <text x="280" y="60" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">Christianity</text>
    <text x="580" y="60" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">Islam</text>
    <text x="880" y="60" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">Secular Humanism</text>
    <text x="40" y="130" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">sacred object</text><rect x="270" y="114" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="130" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">imago Dei · resurrection</text><rect x="570" y="114" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="130" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">fitra · amanah</text><rect x="870" y="114" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="130" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">dignity · Factor X</text><text x="40" y="180" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">authorized repair</text><rect x="270" y="164" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="180" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">medicine · prosthetic</text><rect x="570" y="164" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="180" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">harm removal · surgery</text><rect x="870" y="164" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="180" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">therapy · disability tech</text><text x="40" y="230" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">forbidden exit</text><rect x="270" y="214" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="230" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">reject created goodness</text><rect x="570" y="214" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="230" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">alter creation · self-title</text><rect x="870" y="214" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="230" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">posthuman · natural kind break</text><text x="40" y="280" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">enforcement phrase</text><rect x="270" y="264" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="280" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">REDEMPTION NOT RECALL</text><rect x="570" y="264" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="280" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">STEWARDSHIP NOT OWNERSHIP</text><rect x="870" y="264" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="280" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">DIGNITY OF THE SPECIES</text><text x="40" y="330" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">fear name</text><rect x="270" y="314" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">heresy · pride</text><rect x="570" y="314" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Iblis · rival maker</text><rect x="870" y="314" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="330" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Übermensch · caste</text><text x="40" y="380" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">consolation</text><rect x="270" y="364" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="410" y="380" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">cross · resurrection</text><rect x="570" y="364" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="710" y="380" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">sabr · qiyamah</text><rect x="870" y="364" width="280" height="28" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="1010" y="380" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">equal rights · vulnerability</text>
    <rect x="40" y="470" width="1120" height="50" fill="#120909" stroke="#b89a6a"/>
    <text x="600" y="502" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" text-anchor="middle">convergence · repair yes · exit no</text>
    <text x="120" y="560" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">✓ repair permitted</text>
    <text x="400" y="560" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">🔒 exit forbidden</text>
  </svg>
</figure>
<p class="pm-after">The convergence point is the political fact. Warranty regimes can tolerate hospitals, prosthetics, antidepressants, and palliative care because these return the sufferer to the authorized story. Exit regimes begin when the authorized story loses veto power over form.</p>

Exit politics is the legal and civilizational right to alter body, mind, affect, reproduction, embodiment, and substrate beyond therapeutic restoration, with personhood protected across modified forms. It is sovereignty over metamorphosis under competence, consent, and risk law. It treats inherited anatomy as a starting condition rather than title deed.

Albert Hirschman’s triad of exit, voice, and loyalty clarifies the failure. Warranty regimes offer voice: plead for reform, better care, kinder doctrine, softer institutions, more inclusive dignity. They demand loyalty to the format. Exit politics insists that voice inside the pain machine is insufficient when the machine itself is the harm.

Equality cannot be the first principle if equality means equal captivity in a defective chassis. Capacity, competence, wealth, courage, risk tolerance, access, and discipline will create hierarchy. The political question is whether hierarchy reduces involuntary suffering or enforces worship of the original.

This must be said without ugly shortcuts. No racial hierarchy. No ethnic mythology. No bloodline cult. No caste romanticism. No state breeding program. No worship of cruelty as selection. The only hierarchy with moral claim is competence at reducing involuntary suffering and governing irreversible power. A surgeon who can stop agony outranks a slogan. An engineer who can prevent dementia outranks a committee that sanctifies decline. A governor who can restrain both markets and states from turning bodies into inventory outranks a priest of equality who offers only shared decay.

The institutional primitives are visible. A morphological freedom charter. Protected exit laboratories. AI-design licensing. Suffering-impact review. Strong informed consent. Personhood for modified minds. Rights for synthetic embodiments. Continuity courts for substrate migration claims. Insurance duties for pain reduction rather than mere normalization. Legal protection for refusing ordinary pain-based discipline. Public funding for relief of severe suffering before luxury enhancement. Criminal penalties for coercive modification, counterfeit continuity, and confinement of sentient simulations.

<figure class="pm-fig" id="pmx-05-vii">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-05</span>
    <h4>Mandate Ladder: Therapy to Exit</h4>
  </div>
  <svg viewBox="0 0 1100 900" role="img" aria-label="Mandate ladder from therapy to exit">
    <rect width="1100" height="900" fill="#040506"/>
    <text x="550" y="35" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">mandate ladder · repair to exit</text>
    <rect x="420" y="80" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.3)"/><text x="600" y="103" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">pain medicine</text><rect x="420" y="124" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.36)"/><text x="600" y="147" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">psychiatric stabilization</text><rect x="420" y="168" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.42)"/><text x="600" y="191" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">prosthetics</text><rect x="420" y="212" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.48)"/><text x="600" y="235" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">gene repair</text><rect x="420" y="256" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.54)"/><text x="600" y="279" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">neural interface</text><rect x="420" y="300" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.6)"/><text x="600" y="323" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">affect editing</text><rect x="420" y="344" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.6599999999999999)"/><text x="600" y="367" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">organ · immune redesign</text><rect x="420" y="388" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.72)"/><text x="600" y="411" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">synthetic body</text><rect x="420" y="432" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.78)"/><text x="600" y="455" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">AI-designed nervous system</text><rect x="420" y="476" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.8400000000000001)"/><text x="600" y="499" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">substrate migration</text><rect x="420" y="520" width="360" height="36" rx="2" fill="#0a0b0d" stroke="rgba(184,154,106,0.8999999999999999)"/><text x="600" y="543" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">non-biological personhood</text>
    <line x1="80" y1="320" x2="1020" y2="320" stroke="#b89a6a" stroke-width="2" stroke-dasharray="8 4"/>
    <text x="550" y="310" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">OUTSIDE ORIGINAL FORMAT</text>
    <rect x="40" y="360" width="200" height="480" fill="#b85c55" opacity=".08"/>
    <text x="140" y="400" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Christian natural law</text>
    <text x="140" y="420" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">resurrection body</text>
    <rect x="860" y="360" width="200" height="480" fill="#b85c55" opacity=".08"/>
    <text x="960" y="400" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">Islamic fitra</text>
    <text x="960" y="420" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">altering creation</text>
    <rect x="40" y="700" width="1020" height="80" fill="#b85c55" opacity=".06"/>
    <text x="550" y="750" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" text-anchor="middle">secular dignity · natural kind · coercive eugenics · corporate lock-in · misaligned AI</text>
  </svg>
</figure>
<p class="pm-after">The ladder becomes constitutional once politics accepts exit. Therapy, enhancement, and post-biological personhood require different safeguards, yet the threshold cannot remain a sacred wall. The thesis demands jurisdictions where competent persons may pass beyond restoration into redesign.</p>

Consent domains must be separated with severity.

Adult self-modification belongs under competence, disclosure, waiting periods proportionate to irreversibility, and access to independent counsel. Minors require limits because parents are stewards rather than owners, and because childhood cannot be turned into an ideology’s laboratory. Embryo and germline interventions demand an ethics of harm prevention, transparency, and humility under uncertainty; coercive eugenics remains a crime even when clothed as public health. AI-created minds require prior rules against suffering manufacture, deletion abuse, training torment, and slave personhood. Patients in extreme suffering require emergency pathways that respect desperation without exploiting it. Irreversible procedures require records, audits, adversarial review, and an adult right to take mortal risks once competence is established. Post-biological continuity claims require law brave enough to say when a copy is a descendant, when it is a person, and when it is the same legal subject.

The unmodified may opt out. They may build communities of flesh, liturgy, mortality, and restraint. They may refuse implants, ectogenesis, affect editing, synthetic bodies, or uploads. They may teach their children the sanctity of clay or the dignity of the unaltered human. They do not receive a sacred veto over competent adults who choose exit. Preservation can be a home. It cannot remain a prison.

Michel Foucault’s biopolitics describes how states govern populations through bodies, health, reproduction, and risk. James C. Scott’s *Seeing Like a State* warns that central planners destroy local reality by making life legible to power. Bertrand de Jouvenel tracked the expansionary appetite of authority. Carl Schmitt defined sovereignty through the decision over exceptions. Exit politics must learn from all four. The state will try to standardize metamorphosis. The market will try to monetize it. Emergency will try to suspend consent. Legibility will try to flatten persons into upgrade classes.

The failure modes deserve a hard paragraph because every serious mandate has a shadow. Corporate immortality scams selling grief back to widows. State eugenics returning under therapeutic language. Military enhancement that makes soldiers more disposable. Algorithmic caste through proprietary cognition. Suffering farms that create sentience for training, entertainment, or labor. Misaligned AI optimizing measurable calm while destroying agency. Digital torture at clock speeds flesh never knew. Access oligopoly producing a nobility of escape and a peasantry of pain. Irreversible mistakes hidden behind charismatic founders. Fake salvation markets with clean fonts and offshore servers.

The repair aristocracy must be functional rather than hereditary. Its members are designers, patients, engineers, physicians, philosophers, jurists, and governors selected by competence at reducing pain and managing existential risk. It is aristocratic because rank is unavoidable when powers differ. It is repair-oriented because legitimacy comes from reducing involuntary suffering rather than displaying superiority. It is anti-demotic in analysis and anti-predatory in law. The mob cannot vote away a competent person’s exit. The expert cannot conscript the vulnerable into an experiment. Sovereignty must be bounded by the sufferer it claims to serve.

Nick Bostrom’s vulnerable world hypothesis names the governance problem: some technologies make civilization fragile by default. Morphological exit and AI-designed bodies belong to that class. David Pearce’s abolitionism supplies the moral target. More and Sandberg’s morphological freedom supplies the civil liberty. Savulescu’s enhancement ethics supplies pressure toward obligation where grave suffering can be prevented. None supplies a complete regime. The regime must be built.

The suffering audit is the first public instrument. Measure involuntary pain-hours. Chronic pain burden. Severe mental distress. Terminal agony. Forced embodiment. Untreated disability. Preventable grief. Neurodegeneration exposure. Coercive reproductive risk. Access to exit technologies. Legal bottlenecks. Denied analgesia. Palliative failure. Simulation suffering. Modification complications. Pain exported to the poor.

A civilization that measures these will stop mistaking preservation for mercy.

<figure class="pm-fig" id="pmx-11">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-11</span>
    <h4>Suffering Audit Dashboard</h4>
  </div>
  <svg viewBox="0 0 1200 780" role="img" aria-label="Suffering audit dashboard">
    <rect width="1200" height="780" fill="#040506"/>
    <text x="600" y="35" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">suffering audit dashboard · abolition target</text>
    <rect x="40" y="60" width="260" height="90" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="60" y="95" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">involuntary pain-hours</text><text x="60" y="130" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="22">4.2B</text><rect x="330" y="60" width="260" height="90" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="350" y="95" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">chronic pain prevalence</text><text x="350" y="130" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="22">20%</text><rect x="620" y="60" width="260" height="90" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="640" y="95" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">severe mental distress</text><text x="640" y="130" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="22">970M</text><rect x="910" y="60" width="260" height="90" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/><text x="930" y="95" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">access to exit tech</text><text x="930" y="130" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="22">0.01%</text>
    <polyline points="60,520 200,500 340,480 480,420 620,350 760,280 900,200 1040,120" fill="none" stroke="#b89a6a" stroke-width="2"/>
    <text x="1040" y="110" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">→ zero (abolition)</text>
    <rect x="820" y="200" width="340" height="520" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/>
    <text x="840" y="240" fill="#ebe4dc" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11">policy levers</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9" fill="#8a9199">
      <text x="840" y="270">analgesia research</text>
      <text x="840" y="300">neurodegeneration</text>
      <text x="840" y="330">psychiatric repair</text>
      <text x="840" y="360">morphological freedom</text>
      <text x="840" y="390">AI safety</text>
      <text x="840" y="420">personhood law</text>
    </g>
  </svg>
</figure>
<p class="pm-after">The audit changes the public question. The metric is no longer fidelity to the inherited human story; the metric is reduction of involuntary suffering under lawful exit. The thesis becomes governable when pain is counted instead of sanctified.</p>

<blockquote class="pm-pull">Equal dignity inside a torture chassis is still a prison reform.</blockquote>

Warranty states will call exit regimes monstrous. They will say the body is sacred, clay entrusted, dignity endangered, humanity abolished. They will be partly right about danger and wrong about authority. The humane future will be called inhuman by every institution that profits from the human.

Preservation regimes will become museums of the sacred animal. Exit regimes will become heirs to intelligence.

## Coda

**Against the Sacred Cry**

Mercy will sound, at first, like blasphemy.

Return to the hospital room. The fluorescent light has not softened. The bassinet remains plastic. The monitor writes its narrow green scripture. The newborn cries, and the adults still smile because the signal means the lungs work.

The cry is no longer symbol. It is instruction from the future. Stop making beings whose first proof of life is distress. Stop translating alarm into blessing before the alarm has been audited. Stop teaching every child that the machine is sacred because everyone else was forced to wear it first.

<figure class="pm-fig" id="pmx-00-coda">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-00</span>
    <h4>The Warranty Card in the Crib</h4>
  </div>
  <svg viewBox="0 0 1200 650" role="img" aria-label="Warranty card in crib metaphor">
    <rect width="1200" height="650" fill="#040506"/>
    <rect x="40" y="40" width="340" height="570" rx="4" fill="#0a0b0d" stroke="rgba(235,228,220,.10)"/>
    <text x="210" y="80" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">neonatal bay · monitor trace</text>
    <rect x="80" y="110" width="260" height="180" rx="3" fill="#060708" stroke="rgba(235,228,220,.10)"/>
    <ellipse cx="210" cy="200" rx="70" ry="28" fill="none" stroke="#8a9199" stroke-width="1"/>
    <rect x="170" y="175" width="80" height="50" rx="8" fill="#0f1012" stroke="#8a9199" stroke-width=".8"/>
    <path d="M90 320 L330 320" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <path d="M90 340 L330 340" stroke="#b85c55" stroke-width=".6" opacity=".5" fill="none"/>
    <text x="90" y="310" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">HR trace · first signal</text>
    <text x="60" y="400" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">wrapped silhouette</text>
    <text x="60" y="420" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="9">no consent · no opt-out</text>
    <rect x="420" y="60" width="740" height="530" rx="4" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.2"/>
    <text x="450" y="100" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="14" letter-spacing="3">PRODUCT WARRANTY</text>
    <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12">
      <text x="450" y="150" fill="#555c64">PRODUCT</text><text x="620" y="150" fill="#ebe4dc">Homo sapiens</text>
      <text x="450" y="185" fill="#555c64">SHIP DATE</text><text x="620" y="185" fill="#ebe4dc">birth</text>
      <text x="450" y="220" fill="#555c64">SERIAL</text><text x="620" y="220" fill="#ebe4dc">ADAM-000001</text>
      <text x="450" y="270" fill="#555c64">KNOWN DEFECTS</text>
      <text x="620" y="270" fill="#b85c55">pain · fear · grief · decay · death</text>
      <text x="450" y="330" fill="#555c64">WARRANTY TERMS</text>
      <text x="620" y="330" fill="#8a9199">repair permitted · exit prohibited</text>
    </g>
    <rect x="450" y="380" width="200" height="40" fill="none" stroke="#555c64" stroke-width=".8"/>
    <text x="460" y="405" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10">||||||||||||||||</text>
    <g transform="translate(680 420) rotate(-18)">
      <rect x="0" y="0" width="380" height="90" rx="2" fill="none" stroke="#b89a6a" stroke-width="3" opacity=".85"/>
      <text x="190" y="55" fill="#b89a6a" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="28" font-weight="600" text-anchor="middle" letter-spacing="4">VOID THE WARRANTY</text>
    </g>
  </svg>
</figure>
<p class="pm-after">The warranty card returns at the end because every politics begins in the crib. The newborn receives sacred terms before speech, citizenship, doctrine, or consent. Voiding the warranty means loyalty to the sufferer before loyalty to the shipped form.</p>

The logic has five movements.

The body is a pain machine.

Original Sin was manufacture.

AI and morphological exit are the mandate.

Religious and secular regimes enforce the warranty.

Politics must protect exit from the original format.

There is no heaven promised here. No guaranteed immortality. No painless paradise sold by founders in black turtlenecks. No automatic benevolence in silicon. No clean escape from tragedy by vocabulary. Mary Shelley’s *Frankenstein* remains the shadow-text: creation without responsibility is abandonment, and abandonment by clever makers is only another birth ward with worse lighting.

The mandate offers a smaller decency. Reduce defects instead of theologizing them. Build institutions before miracles. Count suffering before dignity slogans. Protect refusal. Protect exit. Protect the unmodified from contempt and the modified from sacred veto. Protect synthetic minds before they become the new livestock. Make intelligence answer to agony.

<figure class="pm-fig" id="pmx-10-coda">
  <div class="pm-fig-head">
    <span class="pm-fig-n">PMX-10</span>
    <h4>Abolition Roadmap</h4>
  </div>
  <svg viewBox="0 0 1300 760" role="img" aria-label="Abolition roadmap subway map">
    <rect width="1300" height="760" fill="#040506"/>
    <text x="650" y="40" fill="#555c64" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" text-anchor="middle">abolition roadmap · main line</text>
    <line x1="60" y1="380" x2="1240" y2="380" stroke="#b89a6a" stroke-width="3" opacity=".3"/>
    <circle cx="80" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="80" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">pain-machine proof</text><circle cx="220" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="220" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">genesis reclassification</text><circle cx="360" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="360" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">anti-suffering mandate</text><circle cx="500" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="500" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">AI design systems</text><circle cx="640" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="640" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">exit labs</text><circle cx="780" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="780" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">morphological freedom</text><circle cx="920" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="920" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">plural embodiment</text><circle cx="1060" cy="380" r="14" fill="#0a0b0d" stroke="#b89a6a" stroke-width="1.5"/><text x="1060" y="420" fill="#8a9199" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8" text-anchor="middle">post-human polity ?</text><line x1="96" y1="380" x2="204" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="236" y1="380" x2="344" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="376" y1="380" x2="484" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="516" y1="380" x2="624" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="656" y1="380" x2="764" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="796" y1="380" x2="904" y2="380" stroke="#b89a6a" stroke-width="2"/><line x1="936" y1="380" x2="1044" y2="380" stroke="#b89a6a" stroke-width="2"/>
    <path d="M500 380 L520 280 L620 280" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <text x="620" y="270" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">state eugenics</text>
    <path d="M640 380 L660 500 L760 500" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <text x="760" y="515" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">corporate immortality scam</text>
    <path d="M780 380 L800 240 L900 240" stroke="#b85c55" stroke-width="1.2" fill="none"/>
    <text x="900" y="230" fill="#b85c55" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="8">misaligned AI</text>
    <rect x="60" y="580" width="1180" height="60" rx="3" fill="#060708" stroke="#7a9a8c"/>
    <text x="650" y="618" fill="#7a9a8c" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" text-anchor="middle">immediate relief · pain medicine · mental health · disability tech · palliative care</text>
  </svg>
</figure>
<p class="pm-after">The roadmap closes without utopia. It ends in a question mark because any honest exit regime must admit risk, loss, and unknown forms of personhood. The thesis still holds: refusing to manufacture hell is morally prior to praising the architecture of hell.</p>

<blockquote class="pm-pull">We do not betray humanity by leaving its machinery. We betray it by making the machinery holy.</blockquote>

This manifesto is loyalty to suffering humans over inherited human form. It loves the patient more than the hospital. It loves the child more than the warranty. It loves intelligence when intelligence serves mercy and distrusts intelligence when intelligence becomes a new factory.

The sacred cry is the oldest alarm still being called music. Stop treating the capacity to suffer as a sacrament.

The last duty of the human may be to become a kinder thing.

</div>
