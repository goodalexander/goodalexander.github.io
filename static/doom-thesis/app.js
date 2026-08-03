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
    const tickYears = [];
    for (let year = xMin; year <= xMax; year += yearStep) tickYears.push(year);
    if (tickYears.at(-1) !== xMax) {
      if (xMax - tickYears.at(-1) < yearStep * 0.6) tickYears[tickYears.length - 1] = xMax;
      else tickYears.push(xMax);
    }
    tickYears.forEach((year) => addSvg(svg, 'text', { x: x(year), y: height - 12, 'text-anchor': year === xMax ? 'end' : 'middle' }, String(year)));

    series.forEach((item) => {
      const values = item.values.filter((point) => Number.isFinite(point.value));
      let drawing = false;
      const d = item.values.map((point) => {
        if (!Number.isFinite(point.value)) {
          drawing = false;
          return '';
        }
        const command = drawing ? 'L' : 'M';
        drawing = true;
        return `${command}${x(point.year).toFixed(2)},${y(point.value).toFixed(2)}`;
      }).join(' ');
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

  function taxStressChart(svg, summary, scenario) {
    svg.replaceChildren();
    const height = 390;
    const panels = [
      {
        title: 'ANNUAL FISCAL FLOW', left: 48, width: 275, max: 2.1,
        rows: [
          ['FY2026 deficit', summary.cbo_fy2026_deficit_trillions, '#eb735f'],
          ['Static new tax', summary.incremental_static_receipts_trillions, '#62c6ae'],
          ['Deficit remaining', scenario.remaining_deficit_after_static_receipts_trillions, '#d7a94b'],
        ],
      },
      {
        title: 'PUBLIC-EQUITY CAPITAL STOCK', left: 390, width: 275, max: 82,
        rows: [
          ['Current value', scenario.current_public_equity_market_cap_trillions, '#f2eee6'],
          ['Value destroyed', scenario.market_cap_destruction_trillions, '#eb735f'],
          ['Value remaining', scenario.stressed_public_equity_market_cap_trillions, '#8b78d1'],
        ],
      },
    ];
    panels.forEach((panel) => {
      addSvg(svg, 'text', { x: panel.left, y: 34, fill: '#d7a94b' }, panel.title);
      panel.rows.forEach(([label, value, color], index) => {
        const y = 78 + index * 92;
        const barWidth = (value / panel.max) * panel.width;
        addSvg(svg, 'text', { x: panel.left, y, fill: '#a8a49d' }, label);
        addSvg(svg, 'rect', { x: panel.left, y: y + 14, width: panel.width, height: 24, rx: 2, fill: 'rgba(242,238,230,.06)' });
        const bar = addSvg(svg, 'rect', { class: 'bar', x: panel.left, y: y + 14, width: Math.max(0, barWidth), height: 24, rx: 2, fill: color });
        addSvg(bar, 'title', {}, `${label}: ${trillions(value, 2)}`);
        addSvg(svg, 'text', { x: panel.left, y: y + 61, fill: '#f2eee6' }, trillions(value, 2));
      });
    });
    addSvg(svg, 'line', { x1: 355, x2: 355, y1: 24, y2: height - 26, stroke: 'rgba(242,238,230,.12)' });
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
    set('annualized-promise-cost', trillions(latest.annualized_unfunded_program_cost_trillions, 2));
    set('all-in-burden', trillions(latest.all_in_annual_burden_trillions, 2));
    set('all-in-household', money(latest.all_in_annual_burden_per_household));
    set('all-in-net-income-ratio', pct(latest.all_in_burden_to_public_net_income_ratio));
    set('all-in-discretionary-ratio', pct(latest.all_in_burden_to_discretionary_income_ratio));
    const cumulativeIncomeDebt = data.cumulative_income_vs_debt;
    const cumulativeSummary = cumulativeIncomeDebt.summary;
    set('debt-accrued-since-2000', trillions(cumulativeSummary.public_debt_accrued_trillions, 1));
    set('cumulative-net-income-since-2000', trillions(cumulativeSummary.cumulative_public_company_netinc_trillions, 1));
    set('cumulative-debt-income-gap', trillions(cumulativeSummary.debt_accrual_minus_cumulative_netinc_trillions, 1));
    set('cumulative-debt-income-ratio', `${cumulativeSummary.debt_accrued_to_cumulative_netinc_ratio.toFixed(2)}×`);
    const taxValuation = data.tax_valuation;
    const taxSummary = taxValuation.tax_summary;
    const valuationSummary = taxValuation.valuation_summary;
    const baseTaxScenario = taxValuation.tax_scenarios.find((row) => row.scenario === 'constant_multiple');
    const federalReceipts = data.federal_receipts;
    const receiptsSummary = federalReceipts.summary;
    set('federal-receipts-actual', trillions(receiptsSummary.latest_actual_receipts_trillions, 2));
    set('federal-receipts-projected', trillions(receiptsSummary.fy2026_projected_receipts_trillions, 2));
    set('federal-outlays-projected', trillions(receiptsSummary.fy2026_projected_outlays_trillions, 2));
    set('federal-receipts-coverage', `${receiptsSummary.fy2026_projected_receipts_coverage_of_outlays_pct.toFixed(1)}%`);
    set('federal-receipts-per-household', money(receiptsSummary.fy2026_receipts_per_household));
    set('interest-share-receipts', `${receiptsSummary.fy2026_interest_share_of_receipts_pct.toFixed(1)}%`);
    set('corporate-tax-share-receipts', `${receiptsSummary.fy2026_corporate_tax_share_pct.toFixed(1)}%`);
    const sustainability = data.sustainability;
    const sustainabilitySummary = sustainability.summary;
    set('sustainability-current-gap', trillions(sustainabilitySummary.current_program_gap_trillions, 1));
    set('sustainability-current-gap-gdp', `${sustainabilitySummary.current_program_gap_pct_gdp.toFixed(0)}%`);
    set('sustainability-residual-gap', trillions(sustainabilitySummary.reasonable_residual_gap_trillions, 1));
    set('sustainability-pv-reduction', trillions(sustainabilitySummary.program_gap_pv_reduction_trillions, 1));
    set('sustainability-deficit-fix', trillions(sustainabilitySummary.annual_deficit_correction_trillions, 2));
    set('sustainability-program-funding', trillions(sustainabilitySummary.annual_program_gap_funding_trillions, 2));
    set('sustainability-total-adjustment', trillions(sustainabilitySummary.total_annual_adjustment_trillions, 2));
    set('sustainability-adjustment-gdp', `${sustainabilitySummary.total_annual_adjustment_pct_gdp.toFixed(1)}%`);
    set('sustainability-receipts-gdp', `${sustainabilitySummary.tax_only_required_receipts_pct_gdp.toFixed(1)}%`);
    set('sustainability-per-household', money(sustainabilitySummary.tax_only_annual_adjustment_per_household));
    set('tax-rate-current', `${taxSummary.current_federal_rate_pct.toFixed(0)}%`);
    set('tax-rate-max', `${taxSummary.historical_max_federal_rate_pct.toFixed(1)}%`);
    set('tax-incremental-receipts', trillions(taxSummary.incremental_static_receipts_trillions, 2));
    set('tax-deficit-coverage', `${taxSummary.static_deficit_coverage_pct.toFixed(1)}%`);
    set('tax-market-cap-destruction', trillions(taxSummary.constant_multiple_market_cap_destruction_trillions, 1));
    set('tax-market-cap-destruction-pct', `${taxSummary.constant_multiple_market_cap_destruction_pct.toFixed(1)}%`);
    set('tax-destruction-per-dollar', `${taxSummary.constant_multiple_market_cap_destroyed_per_tax_dollar.toFixed(1)}×`);
    set('operating-fcf-yield', `${valuationSummary.operating_company_fcf_yield_pct.toFixed(2)}%`);
    set('operating-fcf', trillions(valuationSummary.operating_company_rolling_4q_fcf_trillions, 2));
    set('operating-market-cap', trillions(valuationSummary.operating_company_market_cap_trillions, 1));
    set('treasury-30y-yield', `${valuationSummary.us_30y_treasury_yield_pct.toFixed(2)}%`);
    set('spx-forward-earnings-yield', `${valuationSummary.spx_forward_earnings_yield_pct.toFixed(2)}%`);
    set('spx-forward-pe', `${valuationSummary.spx_best_pe_ratio.toFixed(1)}×`);
    set('vclt-yield', `${valuationSummary.vclt_yas_bond_yield_pct.toFixed(2)}%`);
    set('spx-vclt-spread', `${valuationSummary.spx_earnings_yield_minus_vclt_pct_points.toFixed(2)} pp`);
    const productivity = data.productivity;
    const productivitySummary = productivity.summary;
    set('utility-capex-per-mwh', `${money(productivitySummary.latest_real_capex_per_mwh, 1)}/MWh`);
    set('utility-capex-per-mwh-multiple', `${productivitySummary.real_capex_per_mwh_multiple_since_2004.toFixed(2)}×`);
    set('operating-fcf-margin', pct(productivitySummary.latest_operating_company_fcf_margin));
    set('fcf-as-of', productivitySummary.current_fcf_as_of_date);
    set('labor-productivity-cagr', pct(productivitySummary.labor_productivity_cagr_since_2004));
    set('labor-productivity-latest-growth', pct(productivitySummary.latest_quarter_productivity_growth_annualized));
    set('labor-productivity-quarter', productivitySummary.latest_labor_productivity_quarter);
    set('labor-productivity-yoy', pct(productivitySummary.latest_quarter_productivity_growth_yoy));
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

    const burdenHistory = data.annualized_burden_history;
    const burdenTableYears = new Set([2004, 2008, 2009, 2012, 2016, 2020, 2024, 2026]);
    const ratioCell = (value) => Number.isFinite(value) ? pct(value) : 'n/m';
    $('#burden-history-table').innerHTML = burdenHistory.filter((row) => burdenTableYears.has(row.year)).map((row) => `<tr><td>${row.year}</td><td>${trillions(row.interest_trillions, 2)}</td><td>${trillions(row.annualized_unfunded_program_cost_trillions, 2)}</td><td>${trillions(row.all_in_annual_burden_trillions, 2)}</td><td>${trillions(row.public_net_income_trillions, 2)}</td><td>${ratioCell(row.explicit_interest_to_public_net_income_ratio)}</td><td>${ratioCell(row.all_in_burden_to_public_net_income_ratio)}</td></tr>`).join('');

    $('#tax-scenario-table').innerHTML = taxValuation.tax_scenarios.map((row) => `<tr><td>${row.pe_multiple_change_pct === 0 ? 'Unchanged' : `${row.pe_multiple_change_pct.toFixed(0)}%`}</td><td>${trillions(row.market_cap_destruction_trillions, 1)}</td><td>${row.market_cap_destruction_pct.toFixed(1)}%</td><td>${row.market_cap_destroyed_per_incremental_tax_dollar.toFixed(1)}×</td></tr>`).join('');

    const receiptTableYears = new Set([2004, 2008, 2012, 2016, 2020, 2024, 2025, 2026, 2030]);
    $('#federal-receipts-table').innerHTML = federalReceipts.history_and_projection.filter((row) => receiptTableYears.has(row.fiscal_year)).map((row) => `<tr><td>${row.fiscal_year}</td><td>${trillions(row.total_federal_receipts_trillions, 2)}</td><td>${trillions(row.total_federal_outlays_trillions, 2)}</td><td>${trillions(row.unified_deficit_trillions, 2)}</td><td>${row.receipts_coverage_of_outlays_pct.toFixed(1)}%</td><td>${row.period_type}</td></tr>`).join('');
    $('#federal-receipts-composition-table').innerHTML = federalReceipts.fy2026_composition.map((row) => `<tr><td>${row.category}</td><td>${trillions(row.amount_trillions, 2)}</td><td>${row.share_of_total_pct.toFixed(1)}%</td></tr>`).join('');
    $('#sustainability-endpoint-table').innerHTML = sustainability.funding_endpoints.map((row) => `<tr><td>${row.endpoint}</td><td>${trillions(row.residual_program_gap_trillions, 1)}<small>${row.residual_program_gap_pct_gdp.toFixed(0)}% GDP</small></td><td>${trillions(row.annual_deficit_correction_trillions, 2)}</td><td>${trillions(row.annual_program_gap_funding_trillions, 2)}</td><td>${trillions(row.total_annual_adjustment_trillions, 2)}<small>${row.total_annual_adjustment_pct_gdp.toFixed(1)}% GDP</small></td><td>${row.required_federal_receipts_pct_gdp_if_tax_only.toFixed(1)}%</td><td>${money(row.annual_adjustment_per_household)}</td></tr>`).join('');
    $('#sustainability-tax-mix-table').innerHTML = sustainability.tax_mix.map((row) => `<tr><td>${row.program_reform_share_of_gap_funding_pct.toFixed(0)}%</td><td>${trillions(row.annual_program_reform_trillions, 2)}<small>${row.program_reform_pct_current_ss_medicare_outlays.toFixed(1)}% of current outlays</small></td><td>${trillions(row.new_tax_revenue_trillions, 2)}</td><td>${row.required_total_federal_receipts_pct_gdp.toFixed(1)}%</td><td>+${row.ordinary_income_all_brackets_rate_point_change.toFixed(1)} pp<small>top → ${row.resulting_top_ordinary_income_rate_pct.toFixed(1)}%</small></td><td>${row.resulting_combined_standard_payroll_rate_pct.toFixed(1)}%</td><td>${row.resulting_top_long_term_gains_rate_with_niit_pct.toFixed(1)}%</td><td>${row.resulting_corporate_income_rate_pct.toFixed(1)}%</td><td>${row.broad_vat_rate_pct.toFixed(1)}%</td></tr>`).join('');

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

    lineChart($('#all-in-ratio-chart'), [
      { color: '#eb735f', values: burdenHistory.map((d) => ({ year: d.year, value: d.explicit_interest_to_public_net_income_ratio })) },
      { color: '#8b78d1', values: burdenHistory.map((d) => ({ year: d.year, value: d.annualized_unfunded_to_public_net_income_ratio })) },
      { color: '#f2eee6', values: burdenHistory.map((d) => ({ year: d.year, value: d.all_in_burden_to_public_net_income_ratio })) },
    ], { yFormat: (v) => `${(v * 100).toFixed(0)}%`, tooltipFormat: (v) => pct(v), projectionFrom: 2026, points: false, xTicks: 8 });

    const cumulativeHistory = cumulativeIncomeDebt.history;
    lineChart($('#cumulative-income-debt-chart'), [
      { color: '#eb735f', values: cumulativeHistory.map((d) => ({ year: d.year, value: d.public_debt_accrued_trillions })) },
      { color: '#62c6ae', values: cumulativeHistory.map((d) => ({ year: d.year, value: d.cumulative_public_company_netinc_trillions })) },
    ], { yMin: -1, yMax: 36, headroom: 1, yFormat: (v) => `$${v.toFixed(0)}T`, tooltipFormat: (v) => trillions(v, 2), points: false, xTicks: 9 });

    const utilityProductivity = productivity.utility_capex_generation;
    lineChart($('#utility-productivity-chart'), [
      { color: '#eb735f', values: utilityProductivity.map((d) => ({ year: d.calendar_year, value: d.real_capex_index_2004 })) },
      { color: '#62c6ae', values: utilityProductivity.map((d) => ({ year: d.calendar_year, value: d.generation_index_2004 })) },
    ], { yMin: 80, yMax: 280, headroom: 1, yFormat: (v) => v.toFixed(0), tooltipFormat: (v) => `${v.toFixed(1)} (2004=100)`, points: false, xTicks: 8 });

    const fcfMargin = productivity.operating_company_fcf_margin;
    lineChart($('#fcf-margin-chart'), [
      { color: '#d7a94b', values: fcfMargin.map((d) => ({ year: d.calendar_year, value: d.aggregate_fcf_margin })) },
    ], { yMin: 0.03, yMax: 0.10, headroom: 1, yFormat: (v) => `${(v * 100).toFixed(0)}%`, tooltipFormat: (v) => pct(v), points: true, xTicks: 6, margin: { left: 52, right: 18 } });

    const laborProductivity = productivity.labor_productivity;
    lineChart($('#labor-productivity-chart'), [
      { color: '#8b78d1', values: laborProductivity.map((d) => ({ year: d.year, value: d.annual_growth })) },
      { color: '#62c6ae', values: laborProductivity.map((d) => ({ year: d.year, value: d.five_year_annualized_growth })) },
    ], { yMin: -0.02, yMax: 0.06, headroom: 1, yFormat: (v) => Math.abs(v) < 0.0005 ? '0%' : `${(v * 100).toFixed(0)}%`, tooltipFormat: (v) => pct(v, 2), points: false, xTicks: 6, margin: { left: 52, right: 18 } });

    const receiptHistory = federalReceipts.history_and_projection;
    lineChart($('#federal-receipts-chart'), [
      { color: '#62c6ae', values: receiptHistory.map((d) => ({ year: d.fiscal_year, value: d.total_federal_receipts_trillions })) },
      { color: '#eb735f', values: receiptHistory.map((d) => ({ year: d.fiscal_year, value: d.total_federal_outlays_trillions })) },
    ], { yMin: 0, yFormat: (v) => `$${v.toFixed(0)}T`, tooltipFormat: (v) => trillions(v, 2), projectionFrom: 2026, points: false, xTicks: 8 });

    taxStressChart($('#tax-stress-chart'), taxSummary, baseTaxScenario);
    const fcfYield = taxValuation.fcf_yield_vs_30y;
    lineChart($('#fcf-yield-chart'), [
      { color: '#d7a94b', values: fcfYield.map((d) => ({ year: d.year, value: d.aggregate_fcf_yield_pct })) },
      { color: '#62c6ae', values: fcfYield.map((d) => ({ year: d.year, value: d.us_30y_yield_pct })) },
    ], { yMin: 0, yMax: 8, headroom: 1, yFormat: (v) => `${v.toFixed(0)}%`, tooltipFormat: (v) => `${v.toFixed(2)}%`, points: false, xTicks: 6, margin: { left: 46, right: 18 } });

    const spxVclt = taxValuation.spx_earnings_yield_vs_vclt;
    lineChart($('#spx-vclt-yield-chart'), [
      { color: '#8b78d1', values: spxVclt.map((d) => ({ year: d.year, value: d.spx_forward_earnings_yield_pct })) },
      { color: '#eb735f', values: spxVclt.map((d) => ({ year: d.year, value: d.vclt_yas_bond_yield_pct })) },
    ], { yMin: 0, yMax: 8, headroom: 1, yFormat: (v) => `${v.toFixed(0)}%`, tooltipFormat: (v) => `${v.toFixed(2)}%`, points: true, xTicks: 6, margin: { left: 46, right: 18 } });

    maturityChart($('#maturity-chart'), data.maturity_wall);
    page.classList.add('is-loaded');
  }

  fetch('/doom-thesis/data.json?v=20260803-2', { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch((error) => {
      console.error('Doom Thesis data load failed', error);
      $('[data-loading]').hidden = true;
      $('[data-error]').hidden = false;
    });
})();
