(() => {
  'use strict';
  const root = document.getElementById('pain-machines');
  const specEl = document.getElementById('pm-spec');
  if (!root || !specEl || root.dataset.computeReady) return;
  root.dataset.computeReady = 'true';

  const { profiles, modalityToReceptor } = JSON.parse(specEl.textContent);
  let profile = 'central';

  const pleasureAxisMeta = [
    ['intensity_jnd_bins', 'pleasure_intensity', 'Weber-Fechner JND bins'],
    ['duration_regime', 'pleasure_duration', 'acute / session / day / sustained'],
    ['modality', 'pleasure_modality', 'consumption, achievement, touch, social, aesthetic, relief'],
  ];
  const painAxisMeta = [
    ['somatic_mechanism', 'pain_mechanism', 'IASP 2021 mechanism taxonomy'],
    ['location', 'pain_location', 'regional somatic / visceral map'],
    ['cognitive_appraisal', 'pain_appraisal', 'Lazarus appraisal families'],
    ['social_field', 'pain_social', 'alone / intimate / professional / public'],
    ['temporality', 'pain_temporal', 'acute / recurrent / chronic / dread'],
    ['identity_salience', 'pain_identity', 'peripheral / personal / reputation / core self'],
    ['agency_attribution', 'pain_agency', 'self / other / system / fate / ambiguous'],
    ['episodic_embedding', 'pain_episodic', 'Melzack neuromatrix episode binding'],
  ];

  function receptorQuotient(n) {
    const classes = new Set();
    for (let i = 0; i < n; i += 1) classes.add(modalityToReceptor[String(i % 8)]);
    return classes.size;
  }

  function buildTrace(meta, spec, key) {
    const trace = [];
    let running = 1;
    for (const [name, field] of meta) {
      const levels = spec[field];
      running *= levels;
      trace.push({ axis: name, levels, [key]: running });
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
    });

    const nTrace = buildTrace(painAxisMeta, spec, 'running_product');
    const nStates = nTrace[nTrace.length - 1].running_product;
    const ratio = nStates / Math.max(pEff, 1);

    return {
      profile: name,
      pleasure: { effective_states_after_quotient: pEff, build_trace: pTrace },
      pain: { distinguishable_states: nStates, build_trace: nTrace },
      comparison: {
        pain_over_pleasure_ratio: ratio,
        log10_orders_of_magnitude: Math.round(Math.log10(ratio) * 100) / 100,
      },
      independent_checks: {
        mcgill_pain_questionnaire_descriptor_count: 78,
        fda_analgesic_anxiolytic_dopaminergic_sku_classes: 11,
      },
    };
  }

  const fmt = (n) =>
    n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e4 ? n.toLocaleString() : String(n);

  function renderMetrics(result) {
    document.getElementById('pm-p-eff').textContent = fmt(result.pleasure.effective_states_after_quotient);
    document.getElementById('pm-n-states').textContent = fmt(result.pain.distinguishable_states);
    document.getElementById('pm-log10').textContent = `10^${result.comparison.log10_orders_of_magnitude}`;
  }

  function renderChart(result) {
    const node = document.getElementById('pm-chart');
    if (!node) return;
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const W = 880;
    const H = mobile ? 340 : 300;
    const ml = mobile ? 52 : 68;
    const mr = 16;
    const mt = 28;
    const mb = mobile ? 72 : 58;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Pain versus pleasure state space');

    const add = (name, attrs, text) => {
      const el = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (text != null) el.textContent = text;
      svg.appendChild(el);
      return el;
    };

    const pSteps = result.pleasure.build_trace.map((s) => ({
      label: s.axis.replace(/_/g, ' '),
      log: Math.log10(Math.max(1, s.running_raw ?? s.running_product)),
    }));
    const nSteps = result.pain.build_trace.map((s) => ({
      label: s.axis.replace(/_/g, ' '),
      log: Math.log10(Math.max(1, s.running_product)),
    }));
    const maxLog = Math.max(4, ...pSteps.map((s) => s.log), ...nSteps.map((s) => s.log)) + 0.35;
    const y = (v) => mt + (1 - v / maxLog) * (H - mt - mb);
    const colP = (W - ml - mr) * 0.38;
    const colN = (W - ml - mr) * 0.62;
    const xP = (i) => ml + (i / Math.max(1, pSteps.length - 1)) * colP;
    const xN = (i) => ml + colN + (i / Math.max(1, nSteps.length - 1)) * (W - ml - mr - colN);

    for (let t = 0; t <= Math.ceil(maxLog); t += 1) {
      add('line', {
        x1: ml,
        x2: W - mr,
        y1: y(t),
        y2: y(t),
        stroke: 'rgba(235,228,220,.07)',
        'stroke-width': 1,
      });
      add(
        'text',
        {
          x: ml - 8,
          y: y(t) + 3,
          fill: '#555c64',
          'font-size': 10,
          'text-anchor': 'end',
          'font-family': 'monospace',
        },
        `10^${t}`,
      );
    }

    add(
      'text',
      {
        x: ml + colP * 0.5,
        y: 16,
        fill: '#7a9a8c',
        'font-size': 11,
        'text-anchor': 'middle',
        'font-family': 'monospace',
      },
      'pleasure → collapses',
    );
    add(
      'text',
      {
        x: ml + colN + (W - ml - mr - colN) * 0.5,
        y: 16,
        fill: '#b85c55',
        'font-size': 11,
        'text-anchor': 'middle',
        'font-family': 'monospace',
      },
      'pain → keeps branching',
    );

    const draw = (steps, xFn, color) => {
      let prev = null;
      steps.forEach((s, i) => {
        const cx = xFn(i);
        const cy = y(s.log);
        if (prev) {
          add('line', {
            x1: prev.x,
            y1: prev.y,
            x2: cx,
            y2: cy,
            stroke: color,
            'stroke-width': 1.5,
            opacity: 0.85,
          });
        }
        add('circle', { cx, cy, r: 3.5, fill: color });
        if (mobile ? i === 0 || i === steps.length - 1 || i % 2 === 0 : true) {
          add(
            'text',
            {
              x: cx,
              y: H - mb + 14 + (i % 2) * 12,
              fill: '#8a9199',
              'font-size': 9,
              'text-anchor': i === 0 ? 'start' : i === steps.length - 1 ? 'end' : 'middle',
              'font-family': 'monospace',
            },
            s.label.length > 14 ? `${s.label.slice(0, 12)}…` : s.label,
          );
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
    if (!node) return;
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const W = 880;
    const H = mobile ? 220 : 200;
    const ml = mobile ? 118 : 200;
    const mr = 20;
    const mt = 16;
    const mb = 36;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'McGill versus pharmacopeia cross-check');

    const add = (name, attrs, text) => {
      const el = document.createElementNS(svgNS, name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (text != null) el.textContent = text;
      svg.appendChild(el);
      return el;
    };

    const rows = [
      { label: 'pleasure (model)', value: result.pleasure.effective_states_after_quotient, color: '#7a9a8c' },
      { label: 'drug families (~11)', value: result.independent_checks.fda_analgesic_anxiolytic_dopaminergic_sku_classes, color: '#6a7570' },
      { label: 'McGill pain words (78)', value: result.independent_checks.mcgill_pain_questionnaire_descriptor_count, color: '#9a7b6a' },
      { label: 'pain (model)', value: result.pain.distinguishable_states, color: '#b85c55' },
    ];
    const maxLog = Math.max(4.5, ...rows.map((r) => Math.log10(Math.max(1, r.value)))) + 0.2;
    const x0 = ml;
    const x1 = W - mr;
    const x = (v) => x0 + (Math.log10(Math.max(1, v)) / maxLog) * (x1 - x0);
    const rowH = (H - mt - mb) / rows.length;

    rows.forEach((row, i) => {
      const yy = mt + i * rowH + rowH * 0.55;
      add(
        'text',
        {
          x: 8,
          y: yy + 4,
          fill: '#8a9199',
          'font-size': mobile ? 9 : 10,
          'text-anchor': 'start',
          'font-family': 'monospace',
        },
        row.label,
      );
      const barW = Math.max(2, x(row.value) - x0);
      add('rect', {
        x: x0,
        y: yy - rowH * 0.22,
        width: barW,
        height: Math.max(6, rowH * 0.44),
        fill: row.color,
        opacity: 0.9,
      });
      add(
        'text',
        {
          x: x0 + barW + 6,
          y: yy + 4,
          fill: '#ebe4dc',
          'font-size': 10,
          'text-anchor': 'start',
          'font-family': 'monospace',
        },
        fmt(row.value),
      );
    });

    node.replaceChildren(svg);
  }

  function renderAll() {
    const result = analyze(profile);
    renderMetrics(result);
    renderChart(result);
    renderInventoryChart(result);
  }

  const bar = root.querySelector('.pm-profile');
  if (bar && !bar.dataset.bound) {
    bar.dataset.bound = 'true';
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-profile]');
      if (!btn) return;
      profile = btn.dataset.profile;
      bar.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderAll();
    });
  }

  renderAll();
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(renderAll, 120);
  });
})();
