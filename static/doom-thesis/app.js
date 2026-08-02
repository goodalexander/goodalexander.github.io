(() => {
  const page = document.querySelector('[data-doom-page]');
  if (!page) return;

  const $ = (selector) => page.querySelector(selector);
  const $$ = (selector) => [...page.querySelectorAll(selector)];
  const money = (n, digits = 0) => `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
  const trillions = (n, digits = 1) => `$${Number(n).toFixed(digits)}T`;
  const pct = (n, digits = 1) => `${(Number(n) * 100).toFixed(digits)}%`;
  const set = (name, value) => $$(`[data-field="${name}"]`).forEach((el) => { el.textContent = value; });
  const svgNS = 'http://www.w3.org/2000/svg';
  const addSvg = (parent, name, attrs = {}, text = '') => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    parent.appendChild(node);
    return node;
  };

  function lineChart(svg, series, options = {}) {
    svg.replaceChildren();
    const view = svg.viewBox.baseVal;
    const width = view.width || 900;
    const height = view.height || 360;
    const margin = { top: 24, right: 24, bottom: 38, left: 66, ...(options.margin || {}) };
    const all = series.flatMap((item) => item.values).filter((d) => Number.isFinite(d.value));
    const years = all.map((d) => d.year);
    const xMin = Math.min(...years);
    const xMax = Math.max(...years);
    const yMin = options.yMin ?? 0;
    const rawMax = options.yMax ?? Math.max(...all.map((d) => d.value));
    const yMax = rawMax * (options.headroom || 1.08);
    const x = (year) => margin.left + ((year - xMin) / (xMax - xMin || 1)) * (width - margin.left - margin.right);
    const y = (value) => height - margin.bottom - ((value - yMin) / (yMax - yMin || 1)) * (height - margin.top - margin.bottom);

    if (options.projectionFrom) {
      addSvg(svg, 'rect', { class: 'projection-zone', x: x(options.projectionFrom), y: margin.top, width: width - margin.right - x(options.projectionFrom), height: height - margin.top - margin.bottom });
      addSvg(svg, 'line', { class: 'projection-line', x1: x(options.projectionFrom), x2: x(options.projectionFrom), y1: margin.top, y2: height - margin.bottom });
      addSvg(svg, 'text', { x: x(options.projectionFrom) + 8, y: margin.top + 12 }, 'MODEL');
    }

    const ticks = options.yTicks || 5;
    for (let i = 0; i <= ticks; i += 1) {
      const value = yMin + ((yMax - yMin) * i) / ticks;
      const yy = y(value);
      addSvg(svg, 'line', { class: 'grid', x1: margin.left, x2: width - margin.right, y1: yy, y2: yy });
      addSvg(svg, 'text', { x: margin.left - 10, y: yy + 4, 'text-anchor': 'end' }, options.yFormat ? options.yFormat(value) : value.toFixed(0));
    }
    const yearStep = Math.max(1, Math.ceil((xMax - xMin) / (options.xTicks || 6)));
    for (let year = xMin; year <= xMax; year += yearStep) addSvg(svg, 'text', { x: x(year), y: height - 12, 'text-anchor': 'middle' }, String(year));
    if ((xMax - xMin) % yearStep !== 0) addSvg(svg, 'text', { x: x(xMax), y: height - 12, 'text-anchor': 'end' }, String(xMax));

    series.forEach((item) => {
      const values = item.values.filter((d) => Number.isFinite(d.value));
      const d = values.map((point, i) => `${i ? 'L' : 'M'}${x(point.year).toFixed(2)},${y(point.value).toFixed(2)}`).join(' ');
      addSvg(svg, 'path', { class: 'series-path', d, stroke: item.color, 'stroke-dasharray': item.dash || '' });
      values.forEach((point) => {
        const dot = addSvg(svg, 'circle', { class: 'series-point', cx: x(point.year), cy: y(point.value), r: options.points === false ? 0 : 3.2, fill: item.color });
        addSvg(dot, 'title', {}, `${point.year}: ${options.tooltipFormat ? options.tooltipFormat(point.value) : point.value}`);
      });
    });
  }

  function maturityChart(svg, rows) {
    svg.replaceChildren();
    const width = 700, height = 360;
    const margin = { top: 25, right: 60, bottom: 38, left: 56 };
    const max = Math.max(...rows.map((d) => d.total)) * 1.1;
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;
    const step = plotW / rows.length;
    const barW = Math.min(64, step * .58);
    const colors = { bill: '#eb735f', fixed: '#d7a94b', frn: '#62c6ae', tips: '#8b78d1' };
    for (let i = 0; i <= 4; i += 1) {
      const value = (max * i) / 4;
      const yy = margin.top + plotH - (value / max) * plotH;
      addSvg(svg, 'line', { class: 'grid', x1: margin.left, x2: width - margin.right, y1: yy, y2: yy });
      addSvg(svg, 'text', { x: margin.left - 8, y: yy + 4, 'text-anchor': 'end' }, `$${value.toFixed(1)}T`);
    }
    rows.forEach((row, index) => {
      const cx = margin.left + step * index + step / 2;
      let bottom = margin.top + plotH;
      ['bill', 'fixed', 'frn', 'tips'].forEach((key) => {
        const h = (row[key] / max) * plotH;
        const rect = addSvg(svg, 'rect', { class: 'bar', x: cx - barW / 2, y: bottom - h, width: barW, height: Math.max(0, h), fill: colors[key] });
        addSvg(rect, 'title', {}, `${row.year} ${key.toUpperCase()}: ${trillions(row[key], 2)}`);
        bottom -= h;
      });
      addSvg(svg, 'text', { x: cx, y: height - 12, 'text-anchor': 'middle' }, String(row.year));
      addSvg(svg, 'text', { x: cx, y: bottom - 8, 'text-anchor': 'middle', fill: '#f2eee6' }, `${row.cumulative_pct.toFixed(0)}%`);
    });
  }

  function render(data) {
    const latest = data.latest;
    set('as-of', data.as_of_date);
    set('total-liabilities', trillions(latest.total_liabilities_trillions));
    set('liabilities-per-household', money(latest.total_liabilities_per_household));
    set('households', `${(latest.households / 1e6).toFixed(1)}M`);
    set('mean-after-tax', money(latest.mean_after_tax_income_per_consumer_unit));
    set('mean-income-year', latest.mean_after_tax_income_year);
    set('liability-income-ratio', `${latest.liabilities_to_disposable_income_ratio.toFixed(1)}×`);
    set('federal-interest', trillions(latest.precise_interest_trillions, 2));
    set('interest-net-income-ratio', pct(latest.interest_to_public_net_income_ratio));
    set('benchmark-interest-discretionary', pct(latest.benchmark_interest_to_discretionary_income_ratio));
    set('current-interest-discretionary', pct(latest.current_interest_to_discretionary_income_ratio));
    set('benchmark-interest', trillions(latest.benchmark_interest_trillions, 2));
    set('aggregate-discretionary', trillions(latest.aggregate_discretionary_income_trillions, 2));
    set('current-interest-household', money(latest.current_interest_per_household));
    set('doom-definition', data.definitions.doom_index);
    set('income-definition', data.definitions.household_income);
    set('ratio-definition', data.definitions.ratio);

    const liabilityRows = [
      ['Gross federal debt', latest.public_debt_trillions, latest.public_debt_per_household, 'Treasury debt outstanding; Bloomberg PUBLDEBT Index.'],
      ['Social Security shortfall', latest.ssa_unfunded_75yr_trillions, latest.ssa_unfunded_per_household, 'OASDI 75-year open-group present-value shortfall.'],
      ['Medicare resource gap', latest.medicare_resource_gap_trillions, latest.medicare_resource_gap_per_household, '75-year government-wide present-value resource gap.'],
      ['Total measured liabilities', latest.total_liabilities_trillions, latest.total_liabilities_per_household, 'The three measures above; excludes state and local obligations.'],
    ];
    $('#liability-table').innerHTML = liabilityRows.map((row) => `<tr><td>${row[0]}</td><td>${trillions(row[1], 1)}</td><td>${money(row[2])}</td><td>${row[3]}</td></tr>`).join('');

    const selectedYears = new Set([2004, 2010, 2015, 2020, 2023, 2026]);
    $('#household-history-table').innerHTML = data.household_history.filter((row) => selectedYears.has(row.year)).map((row) => `<tr><td>${row.year}</td><td>${trillions(row.doom_index_trillions, 1)}</td><td>${money(row.total_liabilities_per_household)}</td><td>${money(row.mean_after_tax_income_per_consumer_unit)}</td><td>${row.liabilities_to_disposable_income_ratio.toFixed(1)}×</td><td>${row.income_status}</td></tr>`).join('');

    const projections = data.interest_history_and_projection.filter((row) => row.period_type === 'projection');
    $('#projection-table').innerHTML = projections.map((row) => `<tr><td>${row.year}</td><td>${trillions(row.interest_trillions, 2)}</td><td>${trillions(row.public_net_income_trillions, 2)}</td><td>${pct(row.interest_to_public_net_income_ratio)}</td></tr>`).join('');

    $('#source-list').innerHTML = data.sources.map((source) => source.url ? `<li><a href="${source.url}" target="_blank" rel="noopener">${source.name}</a></li>` : `<li>${source.name}: ${source.reference}</li>`).join('');

    const history = data.household_history;
    lineChart($('#liability-chart'), [
      { color: '#f2eee6', values: history.map((d) => ({ year: d.year, value: d.doom_index_trillions })) },
      { color: '#eb735f', values: history.map((d) => ({ year: d.year, value: d.public_debt_trillions })) },
      { color: '#d7a94b', values: history.map((d) => ({ year: d.year, value: d.ssa_unfunded_75yr_trillions })) },
      { color: '#8b78d1', values: history.map((d) => ({ year: d.year, value: d.medicare_total_resource_gap_75yr_trillions })) },
    ], { yFormat: (v) => `$${v.toFixed(0)}T`, tooltipFormat: (v) => trillions(v, 1), points: false });

    lineChart($('#ratio-chart'), [{ color: '#eb735f', values: history.map((d) => ({ year: d.year, value: d.liabilities_to_disposable_income_ratio })) }], { yFormat: (v) => `${v.toFixed(0)}×`, tooltipFormat: (v) => `${v.toFixed(1)} income-years`, margin: { left: 48, right: 18 } });

    const interest = data.interest_history_and_projection;
    lineChart($('#interest-chart'), [
      { color: '#eb735f', values: interest.map((d) => ({ year: d.year, value: d.interest_trillions })) },
      { color: '#62c6ae', values: interest.map((d) => ({ year: d.year, value: d.public_net_income_trillions })) },
    ], { yFormat: (v) => `$${v.toFixed(1)}T`, tooltipFormat: (v) => trillions(v, 2), projectionFrom: 2026, points: false, xTicks: 8 });

    maturityChart($('#maturity-chart'), data.maturity_wall);
    page.classList.add('is-loaded');
  }

  fetch('/doom-thesis/data.json', { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch((error) => {
      console.error('Doom Thesis data load failed', error);
      $('[data-loading]').hidden = true;
      $('[data-error]').hidden = false;
    });
})();

