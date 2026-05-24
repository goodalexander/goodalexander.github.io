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
.pm-wrap {
  --pm-bg: #08090d;
  --pm-panel: #10141c;
  --pm-panel-2: #141a24;
  --pm-ink: #f2ece8;
  --pm-muted: #9da8b5;
  --pm-dim: #66727d;
  --pm-line: rgba(242, 236, 232, .12);
  --pm-gold: #d4a853;
  --pm-bliss: #6ec9a8;
  --pm-pain: #e05a52;
  --pm-violet: #9a7bff;
  color: var(--pm-ink);
}
.pm-wrap * { box-sizing: border-box; }
.pm-lede {
  max-width: 62ch;
  color: var(--pm-muted);
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0 0 1.4rem;
}
.pm-panel {
  margin: 1.2rem 0 1.8rem;
  padding: 1rem 1rem 1.1rem;
  border: 1px solid var(--pm-line);
  border-radius: 10px;
  background: linear-gradient(180deg, var(--pm-panel) 0%, #0c1017 100%);
}
.pm-panel-head {
  display: flex;
  flex-wrap: wrap;
  gap: .8rem 1rem;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: .9rem;
}
.pm-panel h3 {
  margin: 0;
  font-size: 1.15rem;
}
.pm-note {
  margin: .25rem 0 0;
  color: var(--pm-muted);
  font-size: .86rem;
  max-width: 58ch;
}
.pm-toggle {
  display: inline-flex;
  border: 1px solid var(--pm-line);
  border-radius: 999px;
  overflow: hidden;
  background: #0a0e14;
}
.pm-toggle button {
  border: 0;
  background: transparent;
  color: var(--pm-muted);
  padding: .55rem .9rem;
  font: inherit;
  font-size: .82rem;
  cursor: pointer;
  min-height: 44px;
  touch-action: manipulation;
}
.pm-toggle button.is-active[data-view="bliss"] {
  background: rgba(110, 201, 168, .16);
  color: var(--pm-bliss);
}
.pm-toggle button.is-active[data-view="pain"] {
  background: rgba(224, 90, 82, .16);
  color: var(--pm-pain);
}
.pm-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: .85rem;
}
.pm-stat-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .65rem;
  margin-bottom: .85rem;
}
.pm-stat {
  padding: .75rem .8rem;
  border: 1px solid var(--pm-line);
  border-radius: 8px;
  background: var(--pm-panel-2);
}
.pm-stat b {
  display: block;
  font-size: 1.35rem;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
}
.pm-stat span {
  display: block;
  margin-top: .25rem;
  color: var(--pm-muted);
  font-size: .76rem;
  line-height: 1.35;
}
.pm-stat.pain b { color: var(--pm-pain); }
.pm-stat.bliss b { color: var(--pm-bliss); }
.pm-stat.ratio b { color: var(--pm-gold); }
.pm-chart {
  min-height: 220px;
}
.pm-chart svg {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}
.pm-split {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
  gap: .85rem;
}
.pm-map {
  min-height: 280px;
  border: 1px solid var(--pm-line);
  border-radius: 8px;
  background: #0a0e14;
  overflow: hidden;
}
.pm-controls {
  display: flex;
  flex-direction: column;
  gap: .65rem;
}
.pm-step-list {
  display: flex;
  flex-direction: column;
  gap: .45rem;
}
.pm-step {
  width: 100%;
  text-align: left;
  border: 1px solid var(--pm-line);
  border-radius: 8px;
  background: #0b1016;
  color: var(--pm-ink);
  padding: .75rem .8rem;
  cursor: pointer;
  font: inherit;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.pm-step small {
  display: block;
  margin-top: .2rem;
  color: var(--pm-muted);
  font-size: .78rem;
  line-height: 1.4;
}
.pm-step.is-active {
  border-color: rgba(224, 90, 82, .55);
  background: rgba(224, 90, 82, .08);
}
.pm-step.is-done {
  border-color: rgba(110, 201, 168, .35);
}
.pm-dim-list {
  display: grid;
  gap: .4rem;
}
.pm-dim {
  display: flex;
  gap: .55rem;
  align-items: flex-start;
  padding: .55rem .6rem;
  border: 1px solid var(--pm-line);
  border-radius: 8px;
  background: #0a0e14;
  font-size: .84rem;
  color: var(--pm-muted);
  min-height: 44px;
  touch-action: manipulation;
}
.pm-dim input {
  margin-top: .15rem;
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  accent-color: var(--pm-pain);
}
.pm-dim strong { color: var(--pm-ink); font-weight: 600; }
.pm-dim.is-locked { opacity: .45; pointer-events: none; }
.pm-verdict {
  margin-top: .75rem;
  padding: .75rem .85rem;
  border-left: 3px solid var(--pm-pain);
  background: rgba(224, 90, 82, .07);
  color: var(--pm-ink);
  font-size: .92rem;
  line-height: 1.55;
}
.pm-verdict.bliss {
  border-left-color: var(--pm-bliss);
  background: rgba(110, 201, 168, .07);
}
.pm-tooltip {
  position: fixed;
  z-index: 30;
  max-width: 280px;
  padding: .55rem .65rem;
  border: 1px solid var(--pm-line);
  border-radius: 8px;
  background: rgba(8, 10, 13, .96);
  color: var(--pm-ink);
  font-size: .82rem;
  line-height: 1.45;
  pointer-events: none;
  opacity: 0;
}
.pm-small {
  color: var(--pm-dim);
  font-size: .82rem;
  line-height: 1.5;
}
.pm-wrap .pm-panel .pm-panel {
  padding: .85rem .8rem;
}
@media (max-width: 860px) {
  .pm-grid,
  .pm-split {
    grid-template-columns: 1fr;
  }
  .pm-stat-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pm-panel-head {
    flex-direction: column;
    align-items: stretch;
  }
  .pm-toggle {
    width: 100%;
  }
  .pm-toggle button {
    flex: 1;
    text-align: center;
  }
  .pm-panel h3 {
    font-size: 1.05rem;
  }
  .pm-stat b {
    font-size: 1.15rem;
  }
  .pm-map {
    min-height: 240px;
  }
}
@media (max-width: 420px) {
  .pm-panel {
    padding: .8rem .7rem;
    border-radius: 8px;
  }
  .pm-stat-row {
    grid-template-columns: 1fr;
  }
  .pm-stat span {
    font-size: .72rem;
  }
  .pm-step small {
    font-size: .74rem;
  }
  .pm-verdict {
    font-size: .86rem;
  }
}
</style>

<div class="pm-wrap" id="pain-machines">

Are humans designed to experience vast bliss or vast pain?

Religion says we fell. Consumer capitalism says we are pleasure-seeking animals one SKU away from happiness. Neither account matches the firmware.

This is **Part I** of *Pain Machines*: an interactive indictment. Click through the reasoning steps, toggle the bliss case if you want to steelman it, and watch the cardinality gap open on a log scale.

<div class="pm-panel" id="pm-intro-viz">
  <div class="pm-panel-head">
    <div>
      <h3>Bliss machine or pain machine?</h3>
      <p class="pm-note">Same nervous system. Two readings. One collapses under inspection.</p>
    </div>
    <div class="pm-toggle" role="tablist" aria-label="Reading">
      <button type="button" data-view="bliss" aria-selected="false">Bliss case</button>
      <button type="button" data-view="pain" class="is-active" aria-selected="true">Pain case</button>
    </div>
  </div>

  <div class="pm-stat-row">
    <div class="pm-stat bliss"><b id="pm-pleasure-count">—</b><span>distinct pleasure buckets (compressible qualia)</span></div>
    <div class="pm-stat pain"><b id="pm-pain-count">—</b><span>distinct pain states (context-expanded)</span></div>
    <div class="pm-stat ratio"><b id="pm-ratio">—</b><span>orders of magnitude (log₁₀ pain ÷ pleasure)</span></div>
    <div class="pm-stat"><b id="pm-step-label">1 / 5</b><span>reasoning step unlocked</span></div>
  </div>

  <div class="pm-grid">
    <div class="pm-panel" style="margin:0">
      <div class="pm-panel-head" style="margin-bottom:.55rem">
        <div>
          <h3>Cardinality on a log scale</h3>
          <p class="pm-note">Not neuroscience. A structural argument about state-space size.</p>
        </div>
      </div>
      <div class="pm-chart" id="pm-ratio-chart"></div>
    </div>
    <div class="pm-panel" style="margin:0">
      <div class="pm-panel-head" style="margin-bottom:.55rem">
        <div>
          <h3>Reasoning path</h3>
          <p class="pm-note">Each step lights the map and updates the counts.</p>
        </div>
      </div>
      <div class="pm-step-list" id="pm-steps"></div>
    </div>
  </div>

  <div class="pm-split" style="margin-top:.85rem">
    <div>
      <div class="pm-panel-head" style="margin-bottom:.55rem">
        <div>
          <h3>State-space map</h3>
          <p class="pm-note">Gold cluster = pleasure catalog. Red cloud = pain topology.</p>
        </div>
      </div>
      <div class="pm-map" id="pm-map"></div>
    </div>
    <div class="pm-controls">
      <div class="pm-panel" style="margin:0">
        <div class="pm-panel-head" style="margin-bottom:.55rem">
          <div>
            <h3>Pain context dimensions</h3>
            <p class="pm-note">Unlock from step 3 onward. Each dimension multiplies distinct pain states.</p>
          </div>
        </div>
        <div class="pm-dim-list" id="pm-dims"></div>
      </div>
      <div class="pm-verdict" id="pm-verdict"></div>
    </div>
  </div>

  <p class="pm-small" style="margin-top:.85rem">Method note: counts are a deliberate rhetorical model, not a clinical measure. Pleasure uses a capped catalog with pharmacological collapse; pain uses combinatorial expansion across somatic, social, temporal, and identity axes. The point is order-of-magnitude asymmetry — the same claim made in <a href="/posts/hyperstitional_vortex/">Hyperstitional Vortex</a>, now visualized.</p>
</div>

*More sections coming: Eden mislabeled, pleasure stack vs pain kernel, Pain-as-a-Service.*

</div>

<script type="application/json" id="pm-data">{
  "pleasureCatalog": [
    {"id":"orgasm","label":"Orgasm","channel":"opioid/dopamine"},
    {"id":"sugar","label":"Sugar rush","channel":"dopamine"},
    {"id":"win","label":"Status win","channel":"dopamine"},
    {"id":"warmth","label":"Warm shower","channel":"opioid"},
    {"id":"laugh","label":"Deep laughter","channel":"endorphin"},
    {"id":"cuddle","label":"Safe touch","channel":"oxytocin"},
    {"id":"praise","label":"Praise","channel":"dopamine"},
    {"id":"flow","label":"Flow state","channel":"mixed"},
    {"id":"relief","label":"Relief","channel":"opioid"},
    {"id":"beauty","label":"Aesthetic hit","channel":"mixed"},
    {"id":"slot","label":"Variable reward","channel":"dopamine"},
    {"id":"alcohol","label":"Alcohol buzz","channel":"GABA/dopamine"}
  ],
  "channels": ["opioid","dopamine","oxytocin","endorphin","GABA/dopamine","mixed"],
  "painBases": [
    {"id":"tooth","label":"Toothache","cat":"somatic"},
    {"id":"grief","label":"Grief","cat":"social"},
    {"id":"panic","label":"3am panic","cat":"temporal"},
    {"id":"humiliation","label":"Humiliation","cat":"social"},
    {"id":"dread","label":"Long dread","cat":"existential"},
    {"id":"betrayal","label":"Betrayal","cat":"social"},
    {"id":"isolation","label":"Isolation","cat":"social"},
    {"id":"shame","label":"Shame","cat":"identity"},
    {"id":"injury","label":"Acute injury","cat":"somatic"},
    {"id":"withdrawal","label":"Withdrawal","cat":"somatic"},
    {"id":"failure","label":"Professional failure","cat":"identity"},
    {"id":"funeral","label":"Funeral drive","cat":"temporal"},
    {"id":"collapse","label":"Collapse fear","cat":"existential"},
    {"id":"jealousy","label":"Jealousy","cat":"social"},
    {"id":"cringe","label":"Permanent cringe","cat":"identity"},
    {"id":"nausea","label":"Nausea","cat":"somatic"}
  ],
  "dimensions": [
    {"id":"social","label":"Social embedding","multiplier":4,"example":"same insult alone vs at your wedding"},
    {"id":"memory","label":"Memory / history","multiplier":3,"example":"fresh wound vs reopened scar"},
    {"id":"identity","label":"Identity stakes","multiplier":5,"example":"anonymous vs reputation-destroying"},
    {"id":"duration","label":"Duration / uncertainty","multiplier":4,"example":"acute spike vs years of not knowing"},
    {"id":"taboo","label":"Moral taboo layer","multiplier":3,"example":"guilt compounds the signal"}
  ],
  "steps": [
    {
      "id": 1,
      "title": "Pleasure collapses to a small catalog",
      "body": "Most bliss states map to a handful of neurochemical channels. Fentanyl, porn, slot machines, and praise converge. Distinct *feelings* exist — but the state-space is narrow and replicable.",
      "view": "pain",
      "unlockDims": 0,
      "pleasureCap": 12,
      "painBaseOnly": true
    },
    {
      "id": 2,
      "title": "Pain does not compress",
      "body": "The same nociceptor firing is not the same experience. Toothache before an interview ≠ toothache after divorce ≠ toothache in a foreign country. Pain carries social, temporal, and narrative payload pleasure rarely matches.",
      "view": "pain",
      "unlockDims": 0,
      "pleasureCap": 12,
      "painBaseOnly": true
    },
    {
      "id": 3,
      "title": "Context dimensions multiply pain",
      "body": "Toggle the dimensions at right. Each axis expands distinct pain states combinatorially. Pleasure gets AB-tested into SKUs. Pain stays wild-type.",
      "view": "pain",
      "unlockDims": 5,
      "pleasureCap": 12,
      "painBaseOnly": false
    },
    {
      "id": 4,
      "title": "Capital fixed pleasure, not pain",
      "body": "Pharma, feeds, and games industrialized the pleasure stack. Rage, envy, loneliness, and fear remained monetizable outputs — Pain-as-a-Service — because pain never converged to a patchable kernel.",
      "view": "pain",
      "unlockDims": 5,
      "pleasureCap": 10,
      "painBaseOnly": false
    },
    {
      "id": 5,
      "title": "Verdict: Original Sin is the spec sheet",
      "body": "Genesis mislabels the bug. The crime was not knowledge. The crime was manufacturing a creature whose pain-space is orders of magnitude larger than its pleasure-space — then blaming the creature for bleeding.",
      "view": "pain",
      "unlockDims": 5,
      "pleasureCap": 8,
      "painBaseOnly": false
    }
  ],
  "blissRebuttal": "The bliss case points to hedonic hotspots, adaptive learning, and prosperity. Fair — on short horizons, pleasure is shippable. But collapse the pharmacology, then multiply pain by context. The asymmetry returns. You are not designed for sustained bliss. You are designed to radiate variable suffering into systems that monetize it."
}</script>

<script>
(() => {
  const root = document.getElementById('pain-machines');
  const dataEl = document.getElementById('pm-data');
  if (!root || !dataEl || root.dataset.ready) return;
  root.dataset.ready = 'true';

  const data = JSON.parse(dataEl.textContent);
  const colors = {
    text: '#f2ece8',
    muted: '#9da8b5',
    grid: 'rgba(242,236,232,.1)',
    bliss: '#6ec9a8',
    pain: '#e05a52',
    gold: '#d4a853',
    violet: '#9a7bff',
    line: 'rgba(242,236,232,.18)'
  };

  let view = 'pain';
  let stepIndex = 0;
  const activeDims = new Set();

  const tooltip = document.createElement('div');
  tooltip.className = 'pm-tooltip';
  document.body.appendChild(tooltip);
  const showTip = (event, html) => {
    tooltip.innerHTML = html;
    tooltip.style.left = `${Math.min(event.clientX + 12, window.innerWidth - 290)}px`;
    tooltip.style.top = `${Math.min(event.clientY + 12, window.innerHeight - 120)}px`;
    tooltip.style.opacity = '1';
  };
  const hideTip = () => { tooltip.style.opacity = '0'; };

  const svgEl = (name, attrs = {}) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };
  const scale = (v, inMin, inMax, outMin, outMax) => outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
  const fmt = (n) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n));
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

  function bindTip(el, htmlFn) {
    const show = (e) => showTip(e, typeof htmlFn === 'function' ? htmlFn() : htmlFn);
    el.addEventListener('mouseenter', show);
    el.addEventListener('mousemove', show);
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      show(e);
    });
  }

  function currentStep() {
    return data.steps[Math.min(stepIndex, data.steps.length - 1)];
  }

  function pleasureCount() {
    const step = currentStep();
    if (view === 'bliss') return Math.max(40, step.pleasureCap * 3);
    const channelSet = new Set(data.pleasureCatalog.map(p => p.channel));
    const collapsed = Math.max(channelSet.size, step.pleasureCap - 2);
    return Math.min(step.pleasureCap, collapsed + (view === 'pain' ? 0 : 8));
  }

  function painCount() {
    const step = currentStep();
    const base = data.painBases.length;
    if (step.painBaseOnly && view === 'pain') return base * 3;
    let mult = 1;
    data.dimensions.forEach(dim => {
      if (activeDims.has(dim.id)) mult *= dim.multiplier;
    });
    if (view === 'bliss') mult = Math.max(1, Math.round(mult * 0.35));
    return base * mult * (view === 'bliss' ? 2 : 6);
  }

  function ratioOrders() {
    const p = Math.max(1, pleasureCount());
    const n = Math.max(p + 1, painCount());
    return Math.max(0, Math.log10(n / p)).toFixed(1);
  }

  function renderStats() {
    const p = pleasureCount();
    const n = painCount();
    document.getElementById('pm-pleasure-count').textContent = fmt(p);
    document.getElementById('pm-pain-count').textContent = fmt(n);
    document.getElementById('pm-ratio').textContent = `~10^${ratioOrders()}`;
    document.getElementById('pm-step-label').textContent = `${stepIndex + 1} / ${data.steps.length}`;
  }

  function renderRatioChart() {
    const node = document.getElementById('pm-ratio-chart');
    const p = pleasureCount();
    const n = painCount();
    const width = 720, height = isMobile() ? 260 : 240, ml = isMobile() ? 88 : 120, mr = 24, mt = 36, mb = 42;
    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': 'Log scale pleasure vs pain cardinality' });
    const logMax = Math.max(2, Math.ceil(Math.log10(Math.max(n, p, 10))));
    const y = (logVal) => scale(logVal, 0, logMax, height - mb, mt);
    const barW = isMobile() ? 56 : 72;

    for (let tick = 0; tick <= logMax; tick += 1) {
      const yy = y(tick);
      svg.appendChild(svgEl('line', { x1: ml, x2: width - mr, y1: yy, y2: yy, stroke: colors.grid, 'stroke-width': 1 }));
      const label = svgEl('text', { x: ml - 10, y: yy + 4, fill: colors.muted, 'font-size': 11, 'text-anchor': 'end' });
      label.textContent = tick === 0 ? '1' : `10^${tick}`;
      svg.appendChild(label);
    }

    const pLog = Math.log10(Math.max(1, p));
    const nLog = Math.log10(Math.max(1, n));
    const px = ml + (isMobile() ? 52 : 70);
    const nx = ml + (isMobile() ? 168 : 220);

    const pBar = svgEl('rect', {
      x: px - barW / 2, y: y(pLog), width: barW, height: Math.max(4, height - mb - y(pLog)),
      rx: 6, fill: colors.bliss, opacity: view === 'bliss' ? 1 : .82
    });
    const nBar = svgEl('rect', {
      x: nx - barW / 2, y: y(nLog), width: barW, height: Math.max(4, height - mb - y(nLog)),
      rx: 6, fill: colors.pain, opacity: view === 'pain' ? 1 : .55
    });
    bindTip(pBar, () => `<strong>Pleasure buckets</strong><br>${fmt(p)} compressible states<br>~${data.channels.length} pharmacological channels`);
    bindTip(nBar, () => `<strong>Pain states</strong><br>${fmt(n)} context-expanded states<br>Active dims: ${activeDims.size}`);
    svg.appendChild(pBar);
    svg.appendChild(nBar);

    const pLabel = svgEl('text', { x: px, y: height - 16, fill: colors.bliss, 'font-size': 12, 'text-anchor': 'middle' });
    pLabel.textContent = 'Pleasure';
    const nLabel = svgEl('text', { x: nx, y: height - 16, fill: colors.pain, 'font-size': 12, 'text-anchor': 'middle' });
    nLabel.textContent = 'Pain';
    svg.appendChild(pLabel);
    svg.appendChild(nLabel);

    const pVal = svgEl('text', { x: px, y: y(pLog) - 8, fill: colors.text, 'font-size': 12, 'text-anchor': 'middle' });
    pVal.textContent = fmt(p);
    const nVal = svgEl('text', { x: nx, y: y(nLog) - 8, fill: colors.text, 'font-size': 12, 'text-anchor': 'middle' });
    nVal.textContent = fmt(n);
    svg.appendChild(pVal);
    svg.appendChild(nVal);

    const gap = svgEl('text', {
      x: isMobile() ? ml : ml + 300,
      y: isMobile() ? 16 : mt + 4,
      fill: colors.gold,
      'font-size': isMobile() ? 11 : 13
    });
    gap.textContent = view === 'pain'
      ? (isMobile() ? `~10^${ratioOrders()} gap (pain >> pleasure)` : `Gap ≈ ${ratioOrders()} orders of magnitude (pain >> pleasure)`)
      : (isMobile() ? 'Bliss case shrinks the gap' : 'Bliss case shrinks the gap — inspect the catalog collapse');
    svg.appendChild(gap);

    node.replaceChildren(svg);
  }

  function renderMap() {
    const node = document.getElementById('pm-map');
    const mobile = isMobile();
    const width = 640, height = mobile ? 300 : 320;
    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': 'Pleasure catalog vs pain topology' });
    svg.appendChild(svgEl('rect', { x: 0, y: 0, width, height, fill: '#0a0e14' }));

    const step = currentStep();
    const cx = mobile ? width * 0.28 : 170;
    const cy = mobile ? height * 0.42 : 160;

    data.pleasureCatalog.forEach((item, i) => {
      const angle = (i / data.pleasureCatalog.length) * Math.PI * 2 - Math.PI / 2;
      const r = 34 + (i % 3) * 8;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const dot = svgEl('circle', {
        cx: x, cy: y, r: step.id >= 1 ? 7 : 4,
        fill: colors.gold, opacity: step.id >= 1 ? .95 : .35
      });
      bindTip(dot, () => `<strong>${item.label}</strong><br>Channel: ${item.channel}<br>Collapses with synthetics`);
      svg.appendChild(dot);
    });

    const channelRing = svgEl('circle', {
      cx, cy, r: mobile ? 46 : 58, fill: 'none', stroke: colors.bliss, 'stroke-width': 1.5,
      opacity: step.id >= 1 ? .55 : .15, 'stroke-dasharray': '4 4'
    });
    svg.appendChild(channelRing);
    const cLabel = svgEl('text', { x: cx, y: mobile ? 18 : 24, fill: colors.bliss, 'font-size': mobile ? 10 : 12, 'text-anchor': 'middle' });
    cLabel.textContent = mobile ? `Pleasure (${data.channels.length} ch.)` : `Pleasure catalog (${data.channels.length} channels)`;
    svg.appendChild(cLabel);

    const painCx = mobile ? width * 0.72 : 430;
    const painCy = mobile ? height * 0.42 : 160;
    data.painBases.forEach((item, i) => {
      const angle = (i / data.painBases.length) * Math.PI * 2;
      const ring = 48 + (i % 4) * 16 + (step.id >= 2 ? 12 : 0);
      const x = painCx + Math.cos(angle) * ring;
      const y = painCy + Math.sin(angle) * ring;
      const dot = svgEl('circle', {
        cx: x, cy: y, r: step.id >= 2 ? 5 : 3,
        fill: colors.pain, opacity: step.id >= 2 ? .85 : .25
      });
      bindTip(dot, () => `<strong>${item.label}</strong><br>Category: ${item.cat}<br>Does not compress to one SKU`);
      svg.appendChild(dot);

      if (step.id >= 3 && activeDims.size) {
        activeDims.forEach((dimId, j) => {
          const dim = data.dimensions.find(d => d.id === dimId);
          const spr = svgEl('line', {
            x1: x, y1: y,
            x2: painCx + Math.cos(angle + j * 0.4) * (ring + 24),
            y2: painCy + Math.sin(angle + j * 0.4) * (ring + 24),
            stroke: colors.violet, 'stroke-width': 1, opacity: .45
          });
          svg.appendChild(spr);
        });
      }
    });

    const cloud = svgEl('ellipse', {
      cx: painCx, cy: painCy,
      rx: step.id >= 3 ? 120 + activeDims.size * 14 : (step.id >= 2 ? 92 : 60),
      ry: step.id >= 3 ? 88 + activeDims.size * 10 : (step.id >= 2 ? 68 : 42),
      fill: colors.pain, opacity: step.id >= 2 ? .08 : .03
    });
    svg.insertBefore(cloud, svg.firstChild.nextSibling);

    const pLabel = svgEl('text', { x: painCx, y: mobile ? 18 : 24, fill: colors.pain, 'font-size': mobile ? 10 : 12, 'text-anchor': 'middle' });
    pLabel.textContent = step.id >= 3
      ? (mobile ? `Pain (${activeDims.size} dims)` : `Pain topology (${activeDims.size} dims active)`)
      : 'Pain bases';
    svg.appendChild(pLabel);

    node.replaceChildren(svg);
  }

  function renderSteps() {
    const node = document.getElementById('pm-steps');
    node.innerHTML = data.steps.map((step, i) => `
      <button type="button" class="pm-step ${i === stepIndex ? 'is-active' : ''} ${i < stepIndex ? 'is-done' : ''}" data-step="${i}">
        <strong>${step.id}. ${step.title}</strong>
        <small>${step.body}</small>
      </button>
    `).join('');
    node.querySelectorAll('.pm-step').forEach(btn => {
      btn.addEventListener('click', () => {
        stepIndex = Number(btn.dataset.step);
        syncDimsForStep();
        renderAll();
      });
    });
  }

  function syncDimsForStep() {
    const step = currentStep();
    if (step.unlockDims >= 5) {
      data.dimensions.forEach(d => activeDims.add(d.id));
    } else if (step.unlockDims === 0) {
      activeDims.clear();
    }
  }

  function renderDims() {
    const step = currentStep();
    const node = document.getElementById('pm-dims');
    node.innerHTML = data.dimensions.map(dim => {
      const locked = step.unlockDims < 3;
      const checked = activeDims.has(dim.id);
      return `
        <label class="pm-dim ${locked ? 'is-locked' : ''}">
          <input type="checkbox" data-dim="${dim.id}" ${checked ? 'checked' : ''} ${locked ? 'disabled' : ''}>
          <span><strong>${dim.label}</strong> ×${dim.multiplier}<br>${dim.example}</span>
        </label>
      `;
    }).join('');
    node.querySelectorAll('input[data-dim]').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.dataset.dim;
        if (input.checked) activeDims.add(id);
        else activeDims.delete(id);
        renderAll(false);
      });
    });
  }

  function renderVerdict() {
    const node = document.getElementById('pm-verdict');
    const step = currentStep();
    if (view === 'bliss') {
      node.className = 'pm-verdict bliss';
      node.innerHTML = `<strong>Bliss case (steelman)</strong><br>${data.blissRebuttal}`;
      return;
    }
    node.className = 'pm-verdict';
    node.innerHTML = step.id === 5
      ? `<strong>${step.title}</strong><br>${step.body}`
      : `<strong>Step ${step.id}</strong><br>${step.body}`;
  }

  function renderToggle() {
    const toggle = root.querySelector('.pm-toggle');
    if (!toggle || toggle.dataset.bound) return;
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-view]');
      if (!btn) return;
      view = btn.dataset.view;
      toggle.querySelectorAll('button').forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderAll(false);
    });
  }

  function renderAll(rebuildSteps = true) {
    renderStats();
    renderRatioChart();
    renderMap();
    renderDims();
    renderVerdict();
    if (rebuildSteps) renderSteps();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderAll(false), 120);
  });
  document.addEventListener('click', () => hideTip());

  syncDimsForStep();
  renderToggle();
  renderAll();
})();
</script>
