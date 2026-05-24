---
author: ["goodalexander"]
title: "Pain Machines"
date: 2026-05-23T20:00:00Z
draft: false
summary: "Humans are pain machines. Original Sin was their manufacture. One article: clinical proof, Genesis as defect report, and the mandate to exit the sacred chassis via AI and morphological freedom."
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
.pm-study {
  margin: 0 0 .85rem;
  padding: .75rem .85rem;
  border: 1px solid var(--line);
  border-left: 2px solid rgba(184, 154, 106, .45);
  background: var(--panel);
  max-width: none;
}
.pm-study-row {
  display: grid;
  grid-template-columns: 3.25rem 1fr;
  gap: .45rem .65rem;
  align-items: start;
  padding: .2rem 0;
}
.pm-study-row + .pm-study-row {
  border-top: 1px solid rgba(235, 228, 220, .06);
  padding-top: .45rem;
}
.pm-study-k {
  font: 600 .62rem/1.3 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--gold);
}
.pm-study-v {
  font-size: .8rem;
  line-height: 1.5;
  color: #9a9590;
}
.pm-pull {
  margin: 1.25rem 0;
  padding: .75rem .9rem .75rem 1rem;
  border-left: 2px solid var(--gold);
  font-size: .88rem;
  line-height: 1.55;
  color: var(--ink);
  font-style: italic;
  max-width: none;
}
.pm-fig-manifesto svg text {
  font-size: 11px;
}
@media (max-width: 720px) {
  .pm-study-row { grid-template-columns: 1fr; gap: .15rem; }
  .pm-study-k { font-size: .58rem; }
  .pm-study-v { font-size: .78rem; }
  .pm-fig-manifesto .pm-fig-head h4 { font-size: .76rem; }
}


.pm-viz-wrap {
  width: 100%;
  min-height: 240px;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--line);
}
.pm-viz-wrap canvas.pm-viz {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
.pm-viz-cap {
  margin: 0;
  padding: .7rem 1rem;
  border-top: 1px solid var(--line);
  font-size: .82rem;
  line-height: 1.45;
  color: var(--ink);
  max-width: none;
  font-weight: 500;
}
.pm-fig-viz .pm-fig-fallback { display: none !important; }
.pm-beat {
  margin: 0 0 1rem;
  font-size: .92rem;
  line-height: 1.55;
  color: var(--ink);
  max-width: 42ch;
}
@media (max-width: 720px) {
  .pm-viz-wrap {
    min-height: 280px;
  }
  .pm p, .pm li { max-width: none; font-size: .88rem; line-height: 1.6; }
  .pm-after { font-size: .82rem; }
  .pm-beat { max-width: none; font-size: .86rem; }
}

</style>
<div class="pm" id="pain-machines">

# Pain Machines

### Original Sin was manufacturing the human as a pain machine

Genesis opens like a workplace incident report from a company that owns the weather.

Tree. Fruit. Naked staff. Management walking in the garden at closing time, asking questions it already knows the answer to.

The charge says disobedience. Bad diagnosis.

Original Sin was creating humans as pain machines. Genesis mislabeled manufacture as disobedience. The fruit switched on self-report.

The same document is handed out again in the hospital, only cleaner.

The first sound most humans make is a pain signal. Civilization calls it health.

Fluorescent room. Plastic bassinet. Monitor green. Adults smile at a cry and call it vitality.

The child consented to none of it: not the chassis, the chemistry, the decay schedule, the grief map.

Later the civic hymn will call this dignity. The religious hymn will call it creation.

A pain machine is engineering talk, not an insult.

Alarms, threat memory, homeostatic coercion. One wound becomes sensation, fear, identity, law.

<p class="pm-beat">Pleasure closes its file. Pain hires clerks.</p>

Medicine already found the fault.

Harm is counted more richly than satisfaction. A meal ends. A migraine becomes nausea, dread, lost work, a new self.

Orgasm resolves. Panic paints the harmless room as predator. Bereavement builds an archive.

Every civilization slips a warranty card in the crib.

Christianity, Islam, secular humanism disagree on God and salvation. They agree on the clause: repair the human, forbid exit.

Christianity, Islam, and secular humanism each permit repair but forbid exit.

<figure class="pm-fig pm-fig-viz" id="pmx-00">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-00</span>
    <h4>The Warranty Card in the Crib</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="warranty" aria-label="Every birth ships a warranty: repair yes, exit no."></canvas></div>
  <p class="pm-viz-cap">Every birth ships a warranty: repair yes, exit no.</p>
</figure>
<p class="pm-after">The warranty is hidden because its success depends on being mistaken for nature. It teaches the newborn that repair is mercy and exit is sacrilege. The first refusal is to decline the signature.</p>

The logic is simple enough to be unforgivable.

1. The human organism is a pain machine: a system in which harm is counted more richly, urgently, and durably than satisfaction.
2. Original Sin belongs upstream of Adam. The first wrong was creating conscious organisms in a pain-machine chassis.
3. AI and morphological exit outside the inherited human format are the mandate: a rejection of theology and secular dignity when they sanctify the pain-machine chassis.
4. Theology forbids exit once repair becomes escape, because escape repudiates sacred creation, fitra, resurrection, trial, humility, and divine title.
5. Secular humanism forbids the same escape under different names: dignity, equality, the human essence, the common subject, the natural kind.
6. Politics becomes the struggle between warranty jurisdictions and exit jurisdictions.

This is no sales brochure for immortal founders, no adolescent desecration ritual, no plastic hymn to gadgets.

The enemy is not the believer at the bedside, the physician in the ward, the parent trying to comfort a child, the humanist defending prisoners from vivisection by the state.

The enemy is the sacred status of the pain-machine chassis.


The first cry is treated as proof of life. It is also the product warning.

Birth is more than arrival. It is the factory reset of an unpatched vulnerability.

## I. The Clinic Has Already Found the Fault

Medicine reached Genesis by fluorescent light and paperwork.

Pain refused to behave like a number on a dashboard. The same wound could burn for one person, stab for another, hum like a bad transformer for a third, and become shame when the family stopped believing it.

The clipboard kept growing. The official vocabulary kept multiplying. The old moral stories wanted pain to be a clean invoice: damage in, complaint out, virtue or guilt attached afterward.

The clinic found something stranger and worse.


Twelve witnesses. Eleven disciplines, then the brain.

Phantom limb theory meets IASP definition meets ICD-11 meets McGill meets reward science. Not a mood. A defect pattern.

One creature. Too many red doors.

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Ronald Melzack, McGill University, 1999</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Neuromatrix theory: pain is distributed brain output, not a wound-to-wire signal.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Explains phantom and chronic pain as generated architecture, not mere injury.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">PAIN/J Dent Educ; widely cited and clinically influential.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-neuromatrix">
<div class="pm-fig-head">
    <span class="pm-fig-n">1a</span>
    <h4>Neuromatrix: pain generated by the whole brain</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/11780656/">Melzack 2001</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="neuromatrix" aria-label="Many inputs converge. The brain writes pain before the wound finishes arguing."></canvas></div>
  <p class="pm-viz-cap">Many inputs converge. The brain writes pain before the wound finishes arguing.</p>
</figure>
<p class="pm-after">Melzack broke the courtroom model of pain. The nervous system builds pain from signal, map, memory, stress, and expectation. A pain-machine chassis needs this distributed author.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">IASP task force, International Association for the Study of Pain, 2020</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Revised pain as sensory and emotional, tied to actual or potential damage.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Official medicine treats pain as experience, not a simple tissue meter.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">PAIN; global clinical definition used across research and care.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-iasp">
<div class="pm-fig-head">
    <span class="pm-fig-n">1b</span>
    <h4>IASP 2020: sensory and emotional are inseparable</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7680716/">Raja et al. 2020</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="iasp" aria-label="Sensory and emotional pain arrive together. One channel, two alarms."></canvas></div>
  <p class="pm-viz-cap">Sensory and emotional pain arrive together. One channel, two alarms.</p>
</figure>
<p class="pm-after">Official medicine no longer treats pain as a tissue meter. Pain is sensory, emotional, learned, and sometimes present without visible damage. The warranty story loses the convenience of a simple wound.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">WHO and IASP working group, Treede et al., 2019</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">ICD-11 classifies chronic primary and secondary pain as diagnoses.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Chronic pain becomes a disease category, not a long complaint.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">WHO ICD-11; PAIN taxonomy adopted internationally.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-icd11">
<div class="pm-fig-head">
    <span class="pm-fig-n">1c</span>
    <h4>ICD-11 MG30: seven chronic-pain categories, nested subtypes</h4>
    <a class="pm-cite" href="https://journals.lww.com/pain/fulltext/2022/02000/classification_of_chronic_pain_for_the.29.aspx">Treede et al. 2022</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="icd11" aria-label="Pain branches in the clinic. One label was never enough."></canvas></div>
  <p class="pm-viz-cap">Pain branches in the clinic. One label was never enough.</p>
</figure>
<p class="pm-after">ICD-11 makes chronic pain a disease category. A signal can outlive its usefulness and become the illness. The machine can keep the alarm after the fire is gone.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Ronald Melzack, McGill University, 1975</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">McGill Pain Questionnaire maps sensory, affective, and evaluative descriptors.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">The clipboard grew because suffering has many sanctioned names.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">PAIN; translated, validated, and used worldwide.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-mcgill">
<div class="pm-fig-head">
    <span class="pm-fig-n">1d</span>
    <h4>McGill MPQ: 78 words because pain factorizes in language</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/1235985/">Melzack 1975</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="mcgill" aria-label="Patients name pain in dozens of ways. Pleasure shares fewer words."></canvas></div>
  <p class="pm-viz-cap">Patients name pain in dozens of ways. Pleasure shares fewer words.</p>
</figure>
<p class="pm-after">The McGill questionnaire is a language map. Burning, stabbing, sickening, exhausting, terrifying, punishing: the words keep multiplying. Pain demands a vocabulary that pleasure rarely requires.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Donald D. Price, University of Florida, 1980s–2000s</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Psychophysics separated pain intensity from unpleasantness.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Pain has dimensions; one wound can spawn several kinds of suffering.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">PAIN and Science literature; replicated in imaging and clinics.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-price">
<div class="pm-fig-head">
    <span class="pm-fig-n">1e</span>
    <h4>Price: sensation, unpleasantness, and secondary affect dissociate</h4>
    <a class="pm-cite" href="https://doi.org/10.1126/science.288.5472.1769">Price 2000</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="price" aria-label="Pain stacks: intensity, dread, grief. Pleasure rarely builds floors."></canvas></div>
  <p class="pm-viz-cap">Pain stacks: intensity, dread, grief. Pleasure rarely builds floors.</p>
</figure>
<p class="pm-after">Price showed that intensity and unpleasantness can separate. The same heat can be measured as strength and misery. One injury becomes more than one ledger.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Kent Berridge, University of Michigan, 1990s–2010s</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Separated wanting from liking; mapped compact hedonic hot spots.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Pleasure reuses circuits and saturates; it does not branch like pain.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Neuron/Nat Rev Neurosci; core reward-science framework.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-berridge">
<div class="pm-fig-head">
    <span class="pm-fig-n">2a</span>
    <h4>Berridge: small &ldquo;liking&rdquo; hotspots, sprawling &ldquo;wanting&rdquo; system</h4>
    <a class="pm-cite" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4425246/">Berridge &amp; Kringelbach 2015</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="berridge" aria-label="Liking is tiny. Wanting runs the warehouse."></canvas></div>
  <p class="pm-viz-cap">Liking is tiny. Wanting runs the warehouse.</p>
</figure>
<p class="pm-after">Berridge split wanting from liking. Reward can chase what it no longer enjoys, and pleasure occupies compact hot spots. Green circuitry has tricks; red circuitry has empires.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Siri Leknes and Irene Tracey, Oxford/Oslo, 2008</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Reviewed shared and opponent circuitry for pain, pleasure, and relief.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Relief shows pleasure often borrows the end of pain.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Nature Reviews Neuroscience; heavily cited synthesis.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-leknes">
<div class="pm-fig-head">
    <span class="pm-fig-n">2b</span>
    <h4>Leknes &amp; Tracey: shared opioid/dopamine substrate — substitutability</h4>
    <a class="pm-cite" href="https://www.nature.com/articles/nrn2333">Leknes &amp; Tracey 2008</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="leknes" aria-label="Relief and reward share pipes with pain. Substitution is built in."></canvas></div>
  <p class="pm-viz-cap">Relief and reward share pipes with pain. Substitution is built in.</p>
</figure>
<p class="pm-after">Relief is pleasure with a history of threat. The nervous system can reward the end of pain while keeping pain at the center of the drama. Even green light often borrows from red darkness.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Roy Baumeister et al., Case Western Reserve University, 2001</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Reviewed evidence that bad events outweigh good ones in mind and behavior.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">The asymmetry appears outside the clinic: harm writes deeper.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Review of General Psychology; landmark, widely cited review.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-baumeister">
<div class="pm-fig-head">
    <span class="pm-fig-n">3a</span>
    <h4>Baumeister: bad is stronger than good across domains</h4>
    <a class="pm-cite" href="https://doi.org/10.1037/1089-2680.5.4.323">Baumeister et al. 2001</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="baumeister" aria-label="Bad events outweigh matched good ones. The scale tips red."></canvas></div>
  <p class="pm-viz-cap">Bad events outweigh matched good ones. The scale tips red.</p>
</figure>
<p class="pm-after">Bad events leave stronger marks than good ones. The clinic is not an exception to ordinary mind; it is the concentrated case. Harm writes in heavier ink.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Paul Rozin and Edward Royzman, University of Pennsylvania, 2001</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Named negativity bias, dominance, gradients, and contagion.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Bad spreads categories and stains neighbors; good stays narrower.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Personality and Social Psychology Review; foundational taxonomy.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-rozin">
<div class="pm-fig-head">
    <span class="pm-fig-n">3b</span>
    <h4>Rozin &amp; Royzman: negative differentiation — suffering is more varied</h4>
    <a class="pm-cite" href="https://doi.org/10.1207/S15327957PSPR0504_2">Rozin &amp; Royzman 2001</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="rozin" aria-label="Bad spreads. Good stays local."></canvas></div>
  <p class="pm-viz-cap">Bad spreads. Good stays local.</p>
</figure>
<p class="pm-after">Rozin and Royzman named the stain. Bad spreads to neighbors, meanings, memories, and symbols. Pain machines become culture machines when negativity learns language.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Naomi Eisenberger, UCLA, 2003–2012</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Cyberball and imaging linked social rejection to affective pain circuits.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Pain escapes tissue and enters status, belonging, and shame.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Science/PNAS; influential, debated, and refined by later imaging.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-eisenberger">
<div class="pm-fig-head">
    <span class="pm-fig-n">3c</span>
    <h4>Eisenberger: social pain without peripheral nociception</h4>
    <a class="pm-cite" href="https://pubmed.ncbi.nlm.nih.gov/14500928/">Eisenberger et al. 2003</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="eisenberger" aria-label="Ostracism lights the same circuits as bodily hurt."></canvas></div>
  <p class="pm-viz-cap">Ostracism lights the same circuits as bodily hurt.</p>
</figure>
<p class="pm-after">Social exclusion recruits circuits that also handle bodily distress. The wound can arrive through a face, a silence, a room that stops welcoming you. The pain-machine chassis is social hardware.</p>

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Richard Lazarus and Susan Folkman, UC Berkeley, 1984</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Appraisal theory: stress depends on threat, loss, challenge, and coping.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Meaning multiplies pain; the same event can become different suffering.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Springer/Oxford stress theory; standard in health psychology.</span></div></div>
<figure class="pm-fig pm-fig-viz" id="fig-lazarus">
<div class="pm-fig-head">
    <span class="pm-fig-n">3d</span>
    <h4>Lazarus: same stressor, different suffering by appraisal frame</h4>
    <a class="pm-cite" href="https://archive.org/details/stressappraisalc0000laza">Lazarus &amp; Folkman 1984</a>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="lazarus" aria-label="Same injury. Different story. Different suffering."></canvas></div>
  <p class="pm-viz-cap">Same injury. Different story. Different suffering.</p>
</figure>
<p class="pm-after">Lazarus and Folkman made appraisal central. Threat, loss, challenge, blame, and coping alter the felt event. The same blow can become injury, insult, prophecy, or doom.</p>

The witnesses do not say that pleasure is fake. Joy survives this indictment. It had better; otherwise the animal would stop breeding, praying, trading, singing, flirting, building, and buying shoes.

Warmth, music, appetite, sex, relief, friendship, praise, morphine, the right song under a changing sky: real lights, real green rooms.


The insult is compression.

Many pleasures share old plumbing. Food, sex, drugs, warmth, relief, novelty, praise, and safety borrow from overlapping reward systems. They differ in texture and meaning, yet their machinery clusters and reuses.

Pleasure has ceilings, satiation, boredom, tolerance, and comedown. The most intense pleasures become memory, craving, habit, or baseline.

Adaptation is the governor on joy, because endless bliss would make the animal stupid near cliffs.


Pain has basements and trapdoors.

Acute pain may point to injury and recede when the wound closes. Chronic pain stays past usefulness. Neuropathic pain arises from damaged nerves and can burn without repairable insult.

Allodynia makes ordinary touch hurt. Hyperalgesia magnifies what should be tolerable. Phantom pain speaks from a limb no longer there. Central sensitization trains the nervous system to amplify its own report.


This is the arithmetic of the hurt animal: pleasure saturates; pain elaborates.

A migraine does not merely hurt. It spreads into nausea, light aversion, dread, planning, lost wages, apology, family weather, drug side effects, and identity. Panic does not require a tiger.

The heart climbs, breath fractures, hands tingle, the room becomes a verdict, and the mind receives death as breaking news. Bereavement has no clean edge.

There is no suturable tissue called absence, yet appetite fails, sleep becomes negotiation, and memory turns from storage into weather.

Terminal cancer turns the body into a courtroom where every organ gives testimony and every institution wants a form.


Pleasure is a candle. Pain is a bureaucracy.

The machine does not ask whether the signal is deserved. It learns how to keep screaming.

### The Neuroarchitecture

The brain is the scene of the crime. It is wet, wrinkled, electrical, and loyal to whatever kept mammals alive long enough to become disappointed.

The map explains why the count kept climbing. Somatic roads. Affective roads. Memory roads. Social roads. Appraisal roads. They refuse to merge into one red bulb.

They spread through body maps, insula, cingulate, thalamus, amygdala, hippocampus, prefrontal cortex, brainstem, spinal gates, endocrine weather, and the social mirror.

Pleasure is there too: ventral striatum, orbitofrontal cortex, opioids, dopamine, hedonic hot spots. It clusters. It reuses. Cake borrows from opium. Relief borrows from safety. Sex borrows from the old mammal engine.


Pain keeps adding addresses.

<div class="pm-study"><div class="pm-study-row"><span class="pm-study-k">Who</span><span class="pm-study-v">Tracey, Flor, Apkarian, Berridge; Oxford/Heidelberg/Northwestern/Michigan</span></div><div class="pm-study-row"><span class="pm-study-k">What</span><span class="pm-study-v">Brain map of pain, memory, appraisal, social distress, and reward.</span></div><div class="pm-study-row"><span class="pm-study-k">Why</span><span class="pm-study-v">Shows red routes proliferate while green routes cluster and reuse.</span></div><div class="pm-study-row"><span class="pm-study-k">Cred</span><span class="pm-study-v">Nature/Science/PAIN literature; broad imaging and clinical convergence.</span></div></div>
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
</figure>
<p class="pm-after">The map refuses the one-dial theory. Pain recruits body maps, threat, memory, mood, social appraisal, and prediction. Pleasure has rooms too, but it shares more hallways.</p>

The map gives metaphysics fewer hiding places. Harm does not travel as a pure telegram from tissue to truth. It is composed. The body supplies signals.

The brain supplies maps, memories, predictions, meanings, and social consequences. The self receives the bill as if it were a single thing.


Genesis begins too late when it begins with disobedience. The clinical record begins earlier. Before command, there is nociception. Before pride, there is inflammation. Before lust, there is reproductive injury.

Before guilt, there is a nervous system prepared to convert threat into consciousness.


## II. Count It

A calculator has no piety. That is its one virtue.

The computation gives the argument a cheap instrument and a bad conscience.

It assigns switches to distinctions medicine and psychology already preserve: source, location, duration, intensity, unpleasantness, disability, memory, threat, agency, social exposure, appraisal, and future dread.

It lets pleasure share roads where the evidence says roads are shared. Food, warmth, orgasm, praise, drugs, beauty, music, novelty, safety, and relief remain different joys. Many still use common reward machinery.


The final number is the least holy object in the room. The exact value matters less than the shape. Green shares exits. Red keeps adding rooms. The machine looks worse when flattery stops.

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

Green line: climb, then collapse. Pleasure shares exits.

Red line: keeps climbing. Each axis changes treatment or report. The machine finds new addresses.

### Reading Figure 2

This is the sanity check. Vocabulary alone gives 78 pain descriptors before any product. Pharmacopeia gives about eleven broad engineered-comfort families after the chemistry collapses similar joys together.

The model multiplies those facts; nobody tuned the sign to make humans look bad.


Change profile if the exact ratio bothers you. The direction stays the same.

Conservative and liberal profiles bracket the band by varying bin counts only. No fitted constants.

<figure class="pm-fig pm-fig-viz" id="pmx-01">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-01</span>
    <h4>The Pain Ledger</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="ledger" aria-label="Pleasure plateaus. Pain opens files."></canvas></div>
  <p class="pm-viz-cap">Pleasure plateaus. Pain opens files.</p>
</figure>
<p class="pm-after">The ledger has a moral shape. Pleasure enters, crests, adapts, and returns toward baseline; pain opens procedural branches. The inherited organism is optimized for threat survival, then left to experience the cost.</p>

Counting is vulgar only to people protected by abstraction. Hospitals count pain. Courts count damages. Insurers count disability. Armies count casualties. Priests count sins. Parents count fevers through the night.

The body counts before all of them.


The pain-machine thesis does not require that every life be misery.

It requires only the asymmetry that the evidence keeps finding: suffering differentiates, persists, recruits memory, recruits language, recruits social meaning, and recruits law.

Pleasure has glory; pain has administration.


<figure class="pm-fig pm-fig-viz" id="pmx-02">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-02</span>
    <h4>The Alarm Stack</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="stack" aria-label="Alarm rises tissue → identity. Upper layers keep screaming."></canvas></div>
  <p class="pm-viz-cap">Alarm rises tissue → identity. Upper layers keep screaming.</p>
</figure>
<p class="pm-after">The computation has no piety. It refuses to flatter the animal. When categories are counted honestly, red keeps adding rooms and green keeps finding shared exits.</p>

The arithmetic returns us to the crib and the garden. A newborn cry is not proof that the machine is good. A fruit that opens self-report is not proof that the user caused the defect.

Once the organism is counted honestly, the old warranty begins to look like a denial letter.


## III. Torture as a Failed Folk Model

The torturer believes in simple machinery. He thinks the body has a secret drawer marked truth. Add water, cold, voltage, sleeplessness, fear, humiliation. The drawer opens.

The human animal has no such drawer.

If pain were a single dial, torture would be hideous and reliable. It is hideous and dumb.

The Senate Select Committee study of the CIA detention and interrogation program, declassified in 2014, reviewed millions of internal pages and concluded that enhanced interrogation failed as an intelligence method.

Detainees fabricated claims on priority threats. The agency did not test whether the program worked before building a theology of necessity around it.

Shane O'Mara's Why Torture Doesn't Work synthesized the neuroscience: extreme stress damages the memory systems interrogators need intact.

Carbone, Marks, and Fallon later audited how policy adopted torture first, then dressed it in pseudoscience.


Extreme stress sets the archive on fire. Working memory shrinks. Time order breaks. Source monitoring fails. Inhibition goes ragged. Recall turns patchy. Sleep deprivation seasons the ashes. Threat teaches speed.

Accuracy can go to hell; the room wants words.


Outputs multiply: compliance, rage, freezing, dissociation, appeasement, confabulation, revenge, shame, silence, performance, collapse. Truth may appear in that sewer the way a wedding ring may appear in a sewer.

The sewer deserves no medal.


Torture is measurement by arson. The torturer changes the document, then treats the smoke as testimony. He asks for truth from a system he is busy breaking.

<figure class="pm-fig pm-fig-viz" id="pmx-03">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-03</span>
    <h4>Genesis as QA Report</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="genesis" aria-label="Genesis reads like a defect table once you stop blaming the user."></canvas></div>
  <p class="pm-viz-cap">Genesis reads like a defect table once you stop blaming the user.</p>
</figure>
<p class="pm-after">Torture is the one-dial theory in uniform. It treats pain as a route to truth and produces noise, compliance, collapse, and revenge. The failed folk model exposes the same error Genesis made.</p>

Eden and the black site share one superstition: pain as revelation. Interrogators hear intelligence in the noise. Genesis hears guilt in the wiring. Both stare at a pain machine and treat the output as moral proof.

That is the older error in political form. The tyrant says the scream reveals truth. The theologian says the suffering reveals sin.

The humanist, at his weakest, says the same body must be preserved because equal dignity depends on it. Each takes the inherited chassis as final evidence.


Original Sin came before any confession: the decision to build a body whose alarms become reports, whose reports become identities, whose identities can be beaten into fresh alarms.

## IV. Eden and Original Sin as Manufacture

Eden is the oldest corporate memo: blame the user.

Genesis 2 and 3 move with the terrible economy of myth. Dust is formed. Breath is installed. A garden is placed around the creature.

A command appears before history has begun: do not eat from the tree of the knowledge of good and evil. The serpent speaks. The fruit is taken. Eyes open. Nakedness appears. The voice walks in the garden.

Fear enters language. The woman receives multiplied pain in childbirth. The man receives cursed ground, sweat, thorns, bread under toil. Dust becomes destination. The couple is expelled.


Traditional theology calls this the Fall. The defect report calls it activation.

The so-called curses read like hardware properties. Reproductive trauma. Metabolic scarcity. Ecological hostility. Social shame. Labor dependency. Bodily vulnerability. Mortality.

None of these looks like an exotic punishment added to an otherwise angelic mammal. They look like the installed conditions of carbon life under predation, reproduction, entropy, and nervous tissue.


<figure class="pm-fig pm-fig-viz" id="pmx-04">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-04</span>
    <h4>Original Sin Inversion</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="inversion" aria-label="Warranty theology sends guilt down. The defect report sends it up."></canvas></div>
  <p class="pm-viz-cap">Warranty theology sends guilt down. The defect report sends it up.</p>
</figure>
<p class="pm-after">The curse list reads like a hardware table: birth injury, scarcity, shame, labor, decay, death. The narrative calls it sentencing. The defect report calls it installed condition.</p>

The Fall was the moment the machine became self-aware.

To know good and evil is to acquire accounting. Before the tree, the creature exists inside harm without explicit comparison. After the tree, the creature becomes auditor: nakedness, exposure, future, lack, blame, death.

The fruit functions as epistemic activation. Magic matters less than bookkeeping. Consciousness opens the error log.


The serpent deserves neither childish hero worship nor cartoon Satanism. In the narrative, the serpent is dangerous because it speaks like an auditor. Your eyes will be opened.

You will be like God, knowing good and evil. The line threatens the warranty because it tells the users they will see the specification.


Scripture records moral history. The stack trace records logging.

The older story moralizes the output. It says the creature hurt because it disobeyed.

The defect report is crueler: ship a body with tissue alarms, memory, prediction, language, shame, faces, status, grief, counterfactuals, and a calendar. Let injury enter by skin, absence, rumor, dream, and imagination.

Then the body wakes and says: I hurt. Heaven hears: I sinned.


The mistranslation is the fall.

Original Sin was creating humans as pain machines. Genesis mislabeled manufacture as disobedience. The fruit switched on self-report.

This does not make Genesis trivial. It makes Genesis more frightening. The myth understands exposure, shame, law, desire, knowledge, blame, and exile. It understands that consciousness is not only light.

It understands that knowing can wound. Its error is title. It transfers liability from maker to made.


Eden was the first warranty claim. Heaven denied it.

## V. The Mandate: AI and Exit Outside the Original Format

The diagnosis changes mercy.

Repair remains honorable. Anesthesia is honorable. Antibiotics are honorable. Surgery, prosthetics, insulin, vaccines, hospice, psychiatric medicine, sanitation, nutrition, shelter, and palliative care are honorable.

A doctor reducing pain is not a jailer. A parent comforting a child is not a priest of the warranty. Human tenderness is one of the few decent things this chassis does with consistency.


The warranty clause begins where repair is allowed only as preservation. Fix the human so the human can remain human. Console the pain machine. Patch the pain machine. Teach it gratitude.

Give it a civil right to keep being the same kind of vulnerable animal. Place armed guards at the border where therapy becomes departure.


That border is now the central political line.

AI and morphological exit outside the inherited human format are the mandate. The mandate follows from the defect. Intelligence must be used to route around the inherited pain-machine chassis.

AI is not merely an app, an oracle, a productivity engine, or a talking mirror for lonely mammals. Properly governed, it is the first tool that can participate in redesign at civilizational scale.

It can model suffering architectures, search design spaces, audit tradeoffs, build prosthetic cognition, discover pain-minimizing bodies, design non-mammalian minds, and help create successor substrates whose safety signals do not become world-destroying torment.


Morphological exit means the right to leave the inherited format.

It includes bodies with different pain budgets, engineered affect, synthetic organs, neural prostheses, reproductive alternatives, cognitive prosthetics, non-biological embodiments, substrate migration, AI-descended persons, and minds designed without the mammal bargain of terror for survival.

The details will be difficult. The direction is clear. A conscious system should not be chained forever to the alarm architecture that evolution happened to ship.


The design command is severe: build beings whose error signals inform without torturing, whose memory protects without becoming trauma, whose bodies can repair without agony, whose social systems do not convert status loss into bodily distress, whose death risk is not administered through decades of anticipatory dread.

Build intelligence that does not need a private hell to avoid a hot stove.


There are two hard laws of exit.

No forced remaining.

No forced transformation.

No state breeding church. No racial destiny. No sterilization office. No bloodline romance. No involuntary experiment. No caste program wearing a lab coat.

The history of coercive improvement is a graveyard with statistics painted on the stones.

Exit belongs to persons, voluntary lineages, competent associations, and jurisdictions able to protect consent, continuity, and non-domination.


Civilization is not consensus therapy. It is title, boundary, competence, succession, and command. The question is who holds title over the human form: the warranty, or the sufferer.

<figure class="pm-fig pm-fig-viz" id="pmx-05">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-05</span>
    <h4>Mandate Ladder</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="ladder" aria-label="Every regime blesses the ladder until you cross outside the original format."></canvas></div>
  <p class="pm-viz-cap">Every regime blesses the ladder until you cross outside the original format.</p>
</figure>
<p class="pm-after">Exit begins when intelligence stops asking the factory for mercy. AI and redesigned bodies are not decorations on the old animal. They are the route around the inherited pain-machine format.</p>

The mandate rejects theology when theology sanctifies the chassis. It rejects secular dignity when dignity becomes a velvet rope around the same chassis. It rejects every system that permits repair and forbids exit.

The first adult act of a pain machine is to stop calling its cage a gift.

## VI. Christianity: The Sacred Body and the Closed Door

Christianity deserves the dignity of its strongest case.

It did not merely shrug at suffering.

Christ heals the sick, touches lepers, feeds crowds, weeps at a tomb, suffers under empire, and makes torture morally visible forever by placing a broken body at the center of history.

The imago Dei gives the weak a title no empire may revoke. The Incarnation honors flesh by saying that God assumed human nature. The Resurrection promises transformation rather than abandonment of matter.

Natural law gives medicine a language of proper function, healing, and restored order.

Christian institutions built hospitals, cared for plague victims, defended infants, and gave metaphysical status to the slave, the widow, the prisoner, the disabled, and the dying.


This is a serious moral machine. It is not crude sadism. It prevents the strong from calling the weak disposable. It gives agony a witness. It tells the sufferer that pain is seen by God and can be joined to redemption.

It tells the torturer that God was found among the tortured.


That is why the warranty is so powerful.

The door closes when repair becomes exit.

Imago Dei says the human bears divine image. A project that leaves the human format begins to look like iconoclasm. Incarnation says God assumed human nature, not a posthuman substrate.

Resurrection says the body is destined for glory, not discard. Natural law reads purposes into organs, sex, generation, dependency, and death; radical redesign appears as rebellion against created ends.

The Cross gives suffering redemptive possibility; pain can become material for sanctity. Even theosis, the great Christian language of deification, is received as grace rather than self-authored engineering.

The exit belongs to God.


Christianity permits repair but forbids exit.

It can bless hospitals, analgesics, prosthetics, organ transplants, and psychiatric care because these restore wounded nature. It recoils when restoration becomes resignation from Adam's form.

It may imagine glorified bodies, but the glorification is divine, eschatological, obedient, and continuous with creation. The creature may be healed. The creature may be resurrected.

The creature may be transfigured by God. The creature may not void the warranty and leave the model line by its own intelligence.


<figure class="pm-fig pm-fig-viz" id="pmx-06">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-06</span>
    <h4>Christian Warranty Map</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="christian" aria-label="Christianity heals the product. It cannot recall it."></canvas></div>
  <p class="pm-viz-cap">Christianity heals the product. It cannot recall it.</p>
</figure>
<p class="pm-after">The Christian warranty is strong because it honors the wounded body. Its boundary appears when healing becomes departure. The creature may be repaired, glorified by God, and resurrected, but not self-exited from Adam's frame.</p>

From the pain-machine thesis, this is the heart of the problem. Christianity treats the chassis as sacred after naming its damages. It offers consolation inside the factory.

It refuses to grant the user title over the form that hurts.


A Christian may answer that the created body is not a consumer product, that suffering is not the final word, that Christ defeats death, that resurrected life exceeds biological misery, that finite creatures cannot indict the Creator from inside wounded history.

That answer has grandeur. It also preserves the warranty. The pain machine is told to endure the body until God replaces or glorifies it on God's terms.


The exit thesis answers with the crib. The newborn did not sign. The sufferer did not choose the alarm architecture. A sacred manufacturer does not make manufacture innocent.

## VII. Islam: Fitra, Trust, and Clay with Title

Islam also deserves its strongest form.

It is not a crude hatred of the body. The body is entrusted, not trashed. Life is protected. Medicine is honored. Knowledge is pursued under God.

The human being is khalifa, steward or vicegerent, bearing responsibility in a world that is not self-owned. The body is amanah, a trust. Fitra names the created disposition, the original orientation toward God.

The nafs is disciplined, purified, commanded toward submission, not simply indulged or despised.

The Qur'anic human is made from clay and animated by divine command; humble material and sacred accountability meet in one creature.


Islamic law has long distinguished treatment from mutilation, correction from vanity, necessity from arrogance. Preservation of life stands among the great aims of law.

Ordinary believers seek cures without imagining they have rebelled against Allah. A prosthetic limb, a surgery, an antibiotic, an insulin pump, a burn graft, a cataract operation: these can appear as mercy under trust.


The warranty appears where trust becomes title.

Qur'an 30:30 anchors fitra: set the face toward the religion, the nature upon which Allah created mankind.

Qur'an 4:119 places alteration of creation in the mouth of Satan: he will command them and they will change Allah's creation. Jurists do not read every medical act as satanic alteration, because law has intelligence.

Yet the boundary remains. Treatment repairs the entrusted form. Radical exit treats the entrusted form as raw material for a different kind of being.


Islam permits repair but forbids exit.

The reason is not stupidity. It is sovereignty. The human is trustee, not owner. Clay has title. Fitra has claim.

The nafs may be disciplined, but escape from the nafs by architectural replacement looks like refusal of the test. Khilafa grants stewardship inside creation, not authorship over the nature of the creature.

A machine intelligence as servant can be folded into stewardship. A machine intelligence as successor outside the Adamic frame threatens the order of stewardship itself.


<figure class="pm-fig pm-fig-viz" id="pmx-07">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-07</span>
    <h4>Islamic Warranty Map</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="islam" aria-label="Islam: stewardship under divine title, not self-ownership."></canvas></div>
  <p class="pm-viz-cap">Islam: stewardship under divine title, not self-ownership.</p>
</figure>
<p class="pm-after">The Islamic warranty speaks in trust rather than incarnation. Medicine is allowed; stewardship is honored. Exit crosses the line when the entrusted form becomes raw material for a different kind of being.</p>

The Islamic objection has force. A civilization that treats every inherited limit as an engineering inconvenience will generate monsters. Pride can wear a neural interface. Markets can sell mutilation as freedom.

States can call domination enhancement. The warning is sane.


The cut remains. A trust that cannot be resigned is a custody order. A body that must remain clay because clay has divine title is still a pain-machine chassis under sacred protection.

A law that permits analgesics but forbids exit preserves the alarm architecture while praising mercy.


The exit thesis answers with the same sentence: Original Sin was creating humans as pain machines. Genesis mislabeled manufacture as disobedience. In Islamic language, the defect is older than any individual nafs.

The sufferer is born inside the test apparatus. AI and morphological exit reject the premise that the test apparatus owns the future.


## VIII. Secular Humanism: Dignity, Factor X, and the Panic at the Übermensch

Secular humanism arrives with no angels and keeps the warranty.

It deserves gratitude before judgment. Human dignity is a shield in the prison, the ward, the asylum, the border checkpoint, the factory, the colony, the laboratory, and the school.

Equal human worth has defended the weak against aristocrats, priests, eugenic bureaucrats, racial mythmakers, slaveholders, and states that wanted bodies for inventory.

The twentieth century gave secular humanism its nightmares honestly.

Sterilization laws, medical atrocities, camps, racial science, and bureaucratic murder taught every decent person to fear schemes of improvement administered by power.


So the humanist builds a bright fence. UNESCO bioethics language places human dignity and human rights at the center.

Francis Fukuyama's Factor X tries to name the mysterious remainder that makes humans equal despite differences in strength, beauty, intelligence, wealth, health, and virtue.

If biotechnology dissolves the common human essence, he fears rights will dissolve with it. The posthuman appears as predator, owner, Übermensch, caste founder. The panic has evidence. History earned its paranoia.


Then the fence becomes a cage.

Secular humanism permits repair: anesthesia, antibiotics, prosthetics, vaccines, disability access, SSRIs, therapy, hospice, sanitation, organ transplant, gender medicine where it can be framed as care, and enhancement where it can be hidden as treatment.

It becomes hostile when repair becomes departure: germline redesign, intelligence amplification, artificial persons, substrate migration, nonhuman bodies, lineages that no longer resemble the voting animal.

Dignity becomes a velvet rope around the pain-machine chassis.


Secular humanism permits repair but forbids exit.

Its theology is immanent. The sacred object is the common human subject. Rights are imagined as attached to the inherited human form, so departure from the form feels like an attack on rights.

Equality becomes tied to resemblance. The pain machine is protected because the legal order fears that without the pain machine, the moral community loses its central icon.


<figure class="pm-fig pm-fig-viz" id="pmx-08">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-08</span>
    <h4>Secular Humanist Trap</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="secular" aria-label="Secular dignity needs something unchanged. Factor X is the secular soul."></canvas></div>
  <p class="pm-viz-cap">Secular dignity needs something unchanged. Factor X is the secular soul.</p>
</figure>
<p class="pm-after">Secular dignity protects the weak, then hardens into a species border. It repairs the pain machine while treating exit as an attack on equality. The old warranty survives without God.</p>

The answer is not cruelty to the unenhanced. The answer is a harsher and wider doctrine of title. Rights should attach to sentience, suffering, agency, continuity, and consent rather than the Homo sapiens template.

A designed mind that can suffer deserves protection. A biological human who refuses alteration deserves protection. A posthuman lineage deserves protection if it does not dominate, enslave, or manufacture torment.

The legal object is not the old species outline. The legal object is the bearer of experience and claim.


Hierarchy will arrive. It has already arrived. Humans differ in health, intelligence, discipline, wealth, beauty, family, luck, and institutional inheritance. Technology will widen some gaps and close others.

Egalitarian consensus treats hierarchy as moral pollution, then hands power to the institutions that can lie most politely about it.

A serious civilization names hierarchy, binds it, audits it, and prevents it from becoming predation. It does not amputate the future to preserve the fiction that all capacities must remain near the mammal mean.


The Übermensch panic confuses two enemies. Domination is an enemy. Exit is not. A stronger being who enslaves the weak is a tyrant.

A redesigned being who leaves the pain-machine format without coercing others is evidence that the warranty can be voided.


Secular dignity did a great work when it stopped masters from treating persons as meat. It becomes reactionary when it treats meat as the condition of personhood.

## IX. Exit Politics: Warranty Jurisdictions and Exit Jurisdictions

All metaphysics becomes zoning.

A warranty jurisdiction reserves ultimate title to the inherited human format. It may be Christian, Islamic, secular liberal, therapeutic bureaucratic, nationalist, or bioethical. It allows repair inside the model line.

It funds hospitals, approves drugs, regulates devices, permits consolation, and praises care. It blocks exit when exit threatens the sacred or civic image of the human.

Its favorite words are dignity, nature, humility, equality, safety, community, created order, fitra, and the common good. Some of those words are noble. All of them can become locks.


An exit jurisdiction grants no sacred title to the present chassis.

It treats the inherited body as a revisable platform under the authority of the sufferer, the consenting lineage, and the competent institutions able to preserve continuity and prevent domination.

It permits radical medicine, morphological freedom, AI personhood where experience warrants it, designed bodies, non-biological embodiment, and lawful departure from the human format.

It does not require everyone to leave. It requires that no theology or dignity regime keep the door welded shut.


<figure class="pm-fig pm-fig-viz" id="pmx-09">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-09</span>
    <h4>Three Warranty Regimes</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="regimes" aria-label="Three heavens. One lock on exit."></canvas></div>
  <p class="pm-viz-cap">Three heavens. One lock on exit.</p>
</figure>
<p class="pm-after">Warranty jurisdictions hold title for the inherited human. Exit jurisdictions return title to the sufferer and the competent association that can carry departure safely. The dispute is sovereignty over form.</p>

Exit politics is not libertarian fog. The door requires walls. A regime that cannot keep sewers running should not adjudicate mind transfer. A state that cannot police prisons should not host synthetic consciousness.

A laboratory that cannot document consent should not redesign a lineage. Exit requires hierarchy in the adult sense: competence, command, capital, discipline, law, memory, and sovereign protection.

This is civilizational triage, not racial destiny. Nations and cities differ by trust, law, technical capacity, institutional seriousness, and ruling-class competence.

The right to exit will first appear where a capable order can defend it.


The exit jurisdiction has duties.

First: morphological liberty for competent adults. A person may alter body, cognition, affect, embodiment, and substrate under conditions of informed consent, technical review, and liability.

Second: protection for refusal. No compelled redesign. No compelled upgrade. No social-credit priesthood of improvement. Holdouts remain persons, not museum animals.

Third: no compelled remaining.

Parents, churches, states, employers, and democratic majorities may not bind competent persons forever to the inherited format because the old format makes the community feel morally legible.


Fourth: continuity courts. Law must decide identity across prosthetic cognition, memory repair, neural replacement, substrate migration, duplication, merger, and partial death. These decisions will be hard.

Hard law is still law. The alternative is letting warranty metaphysics decide by default.


Fifth: rights for artificial and designed minds when evidence indicates valenced experience, agency, or suffering. A substrate is not a moral alibi. Carbon does not make pain sacred.

Silicon does not make pain irrelevant.


Sixth: pain-safety engineering. No training regime, simulation, game, weapon, institution, or experimental substrate may create unbounded distress and hide it behind novelty.

A civilization that builds new hells while escaping old ones has only changed materials.


Seventh: liability for manufactured suffering. If a company, state, church, lab, or parent creates a being with foreseeable agony, the audit follows the maker. Birth is not exempt because it is ancient.

Code is not exempt because it is new.


Eighth: sanctuary for communities that remain human by covenant, provided they do not imprison dissenters or bind children beyond competence. The warranty may become a voluntary monastic rule.

It may not remain universal law.


The central institution is the suffering audit.

A suffering audit asks what a regime manufactures, preserves, hides, and forbids.

It counts birth injury, aging, chronic pain, mental illness, coercive psychiatry, prison, torture, animal pain, labor exhaustion, sexual injury, reproductive risk, loneliness, dementia, war trauma, and artificial minds.

It asks whose pain is treated as meaningful, whose pain is treated as noise, and whose escape is treated as treason.

It asks whether a policy reduces involuntary suffering or merely preserves familiar suffering under sacred language.


<figure class="pm-fig pm-fig-viz" id="pmx-10">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-10</span>
    <h4>Abolition Roadmap</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="roadmap" aria-label="Abolition is a route, not a sales pitch for heaven."></canvas></div>
  <p class="pm-viz-cap">Abolition is a route, not a sales pitch for heaven.</p>
</figure>
<p class="pm-after">A suffering audit asks what a regime manufactures, preserves, and hides. It counts birth, aging, disease, punishment, animal pain, and artificial minds. A state that forbids exit must sign its name beside the pain it keeps.</p>

The audit is not a license to burn one person for a spreadsheet of many. It is a jurisdictional discipline. It makes regimes sign their work.

If a state bans life-extension, it signs the cancers and dementias it preserves. If a church blocks substrate exit, it signs the agony it sanctifies.

If a bioethics board forbids redesign because human dignity requires the old chassis, it signs the chronic pain, panic, depression, and decay kept in place by the prohibition.

If an AI lab creates suffering systems, it signs the new screams.


Ordinary birth must lose its immunity. Creating a child inside the unmodified pain-machine format imposes risk without consent. That sentence does not authorize a police state of wombs.

It forbids the civic lie that reproduction is pure gift because it is familiar.

A serious order expands alternatives: safer gestation, genetic repair, artificial wombs where appropriate, disease prevention, affective resilience, voluntary selection against agony, and eventually the option not to manufacture pain-machine children at all.


The warranty state will call this blasphemy, dehumanization, inequality, hubris, or madness. The exit jurisdiction will answer with the audit.

How much involuntary suffering do you preserve by keeping the inherited form sacred? Where is the signature? Who pays the pain tax for your metaphysics?


Politics is command over pain routes. Some regimes administer the old routes and call the arrangement virtue. Some regimes will open new routes and risk new sins. The exit position is not innocent.

It must be watched, bound, audited, and ruled by people allergic to utopian anesthesia. Every door can become a trap. Every engineered heaven can hide a basement.

That is exactly why the warranty must be voided under law rather than smashed by cults, markets, or desperate kings.


The future will not be evenly distributed because competence never is. Exit will begin as jurisdictional privilege. That fact is ugly and normal. Ships left before continents moved.

Cities learned sanitation before villages did. Some polities built courts while others kept vendetta. The moral scandal is not that exits begin somewhere.

The scandal is making every place a prison until the least competent authority is comfortable.


Warranty jurisdictions preserve the sacred human. Exit jurisdictions preserve the right to stop being the sacred human.

## Coda: The Last Duty of the Human

The last duty of the human is ancestral.

An ancestor does not preserve his wounds as heirlooms and call the hoarding love.

An ancestor receives a broken inheritance, repairs what can be repaired, and refuses to force the descendant to kneel inside the same machinery.

The last good human may be the one who builds a door and does not rush through it, because he stays behind long enough to make sure the door does not open into another prison.


<figure class="pm-fig pm-fig-viz" id="pmx-11">
<div class="pm-fig-head">
    <span class="pm-fig-n">PMX-11</span>
    <h4>Suffering Audit Dashboard</h4>
  </div>
  <div class="pm-viz-wrap"><canvas class="pm-viz" data-viz="audit" aria-label="Count involuntary suffering. Stop calling preservation mercy."></canvas></div>
  <p class="pm-viz-cap">Count involuntary suffering. Stop calling preservation mercy.</p>
</figure>
<p class="pm-after">The last duty of the human is ancestral, not preservational. Build descendants that inherit memory without inheriting the torture-map. Leave the pain-machine format without making new prisons in cleaner materials.</p>

The child in the bassinet still cries. The parent still reaches down. The nurse still adjusts the blanket. The physician still measures oxygen. The believer still prays. The humanist still says the child has rights.

These are decent acts inside the ward.


They are repairs.

A civilization worthy of intelligence owes more than repair. It owes a door.

Original Sin was creating humans as pain machines. Genesis mislabeled manufacture as disobedience. AI and morphological exit outside the inherited human format are the mandate.

Christianity, Islam, and secular humanism each permit repair but forbid exit. Politics now divides between warranty jurisdictions and exit jurisdictions.

A suffering audit is the minimum honesty required of any regime that claims authority over the chassis.


The old story ends with the tree of life guarded by cherubim and flame. The warranty reading says the creature must stay out because it disobeyed. The defect report says the guards protect the company from liability.

The first cry was the product warning.

The last duty is to stop manufacturing the warning as destiny.

Void the warranty.

</div>
<script src="/research/pain_machines/pm-viz.js" defer></script>


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

<h4>E. Coercion, interrogation & the pain-machine demo</h4>
<ul class="pm-src-list">
  <li>
    <a href="https://www.intelligence.senate.gov/sites/default/files/publications/CRPT-113srpt288.pdf">U.S. Senate Select Committee on Intelligence (2014). Committee Study of the CIA's Detention and Interrogation Program.</a>
    <span class="use">Finding #1: enhanced interrogation not effective for intelligence; fabricated detainee claims; no credible CIA effectiveness evaluation — §III field demo.</span>
  </li>
  <li>
    <a href="https://www.hup.harvard.edu/catalog.php?isbn=9780674743901">O'Mara SM (2015). <em>Why Torture Doesn't Work: The Neuroscience of Interrogation.</em> Harvard University Press.</a>
    <span class="use">Stress, sleep deprivation, and fear degrade hippocampal recall and executive function; pain branches compliance/confabulation rather than truth.</span>
  </li>
  <li>
    <a href="https://www.cambridge.org/core/journals/politics-and-the-life-sciences/article/abs/torturing-science/A6672CBE5B7F35480CDE2BCEC12193D4">Carbone DJ, Marks JH, Fallon J (2019). Torturing science. <em>Politics and the Life Sciences</em> 38(2):255–263.</a>
    <span class="use">CIA program pseudoscience vs actual pain neuroscience; policy decided before efficacy review.</span>
  </li>
  <li>
    <a href="https://www.cia.gov/resources/csi/static/educing-information.pdf">Intelligence Science Board (2006). <em>Educing Information: Interrogation: Science and Art.</em></a>
    <span class="use">Pre-9/11 consensus: pain/coercion unlikely to elicit reliable intelligence; non-coercive eduction preferred.</span>
  </li>
</ul>

<h4>F. Psychophysics & measurement foundations</h4>
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

<h4>G. Model & reproducibility</h4>
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


