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
.pm-refs {
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
  font-size: .78rem;
  color: var(--dim);
  line-height: 1.55;
}
.pm-refs li { margin-bottom: .45rem; max-width: 72ch; }
.pm-refs a { color: var(--muted); }
@media (max-width: 720px) {
  .pm-metrics { grid-template-columns: 1fr; }
  .pm-compute-head { align-items: stretch; }
  .pm-profile { width: 100%; }
  .pm-profile button { flex: 1; text-align: center; }
}
</style>

<div class="pm" id="pain-machines">

Genesis frames the bug as disobedience. That is a mislabeled stack trace.

The actual fault is architectural. Clinical psychology and pain medicine have spent decades **inventorying** suffering — the McGill Pain Questionnaire alone lists 78 distinguishable descriptors across sensory, affective, and evaluative domains. Hedonic neuroscience, meanwhile, keeps converging on a **small set of receptor families** that synthetic drugs can hijack interchangeably.

Put those literatures into the same formalism — Cartesian state-space products — and the asymmetry is not poetic. It is countable.

## I. What the clinics already know

**Pain multiplies.** Melzack's neuromatrix model treats pain as the output of a distributed network: somatic input plus appraisal, social context, memory, and identity. The IASP's 2021 taxonomy separates nociceptive, neuropathic, and nociplastic mechanisms — then location, duration, and cognitive overlay still vary independently. Lazarus's appraisal framework adds another axis: the same tissue damage is not the same experience when framed as injustice versus bad luck versus fate.

Patients do not report one pain. They report **combinations** — and clinicians need instruments like MPQ because the space is too large to capture with a single slider.

**Pleasure compresses.** Weber-Fechner psychophysics gives you a handful of discriminable intensity bins per modality. Berridge and Kringelbach's distinction between "liking" and "wanting" still maps onto a limited set of hedonic hotspots. Leknes and Tracey document that opioid, dopaminergic, and oxytocinergic channels cover most engineered bliss — which is why fentanyl, slot machines, and social praise can be substituted in practice.

The pharmacological catalog is small. The pain descriptor catalog is not.

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
2. **McGill MPQ** — 78 published pain descriptors (Melzack & Torgerson, 1971; subsequent revisions). A lower bound from vocabulary alone, before combinatorics.
3. **Pharmacopeia classes** — ~11 FDA analgesic / anxiolytic / dopaminergic families that approximate engineered pleasure SKUs.

Even the vocabulary gap (78 vs 11) is ~7×. The combinatorial model is ~10³–10⁴. Both point the same direction: **the hardware enumerates suffering faster than it compresses bliss.**

Conservative and liberal profiles bracket the band by varying bin counts only. No fitted constants.

## III. Original Sin as mislabeled spec

The Eden story tells you the crime was curiosity. The enumeration tells you the crime was **specification** — shipping a creature whose pain state-space has higher cardinality than its pleasure state-space, then moralizing the output.

That is what "Pain Machines" names. Not metaphor. Firmware.

More sections forthcoming: Eden mislabeled, the pleasure stack vs pain kernel, Pain-as-a-Service.

<ul class="pm-refs">
  <li>Melzack R, Torgerson WS. On the language of pain. <em>Anesthesiology</em>, 1971. (McGill Pain Questionnaire — 78 descriptors.)</li>
  <li>Melzack R. Pain and the neuromatrix in the brain. <em>J Dent Educ</em>, 2001.</li>
  <li>IASP taxonomy of chronic pain conditions, 2021.</li>
  <li>Lazarus RS, Folkman S. <em>Stress, Appraisal, and Coping</em>, 1984.</li>
  <li>Berridge KC, Kringelbach ML. Pleasure systems in the brain. <em>Neuron</em>, 2015.</li>
  <li>Leknes S, Tracey I. A common neurobiology for pain and pleasure. <em>Nat Rev Neurosci</em>, 2008.</li>
</ul>

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
