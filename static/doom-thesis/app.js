(() => {
  const page = document.querySelector('[data-doom-page]');
  if (!page) return;

  const $ = (selector) => page.querySelector(selector);
  const $$ = (selector) => [...page.querySelectorAll(selector)];
  const money = (n, digits = 0) => `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
  const trillions = (n, digits = 1) => `$${Number(n).toFixed(digits)}T`;
  const pct = (n, digits = 1) => `${(Number(n) * 100).toFixed(digits)}%`;
  const signedPercent = (n, digits = 1) => `${Number(n) >= 0 ? '+' : ''}${Number(n).toFixed(digits)}%`;
  const signedNumber = (n, digits = 1, suffix = '') => `${Number(n) >= 0 ? '+' : ''}${Number(n).toFixed(digits)}${suffix}`;
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
      addSvg(svg, 'text', { x: x(options.projectionFrom) + 8, y: margin.top + 12 }, options.projectionLabel || 'MODEL');
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
    tickYears.forEach((year) => addSvg(svg, 'text', { x: x(year), y: height - 12, 'text-anchor': year === xMax ? 'end' : 'middle' }, options.xFormat ? options.xFormat(year) : String(year)));

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
        addSvg(dot, 'title', {}, `${point.label ?? point.year}: ${options.tooltipFormat ? options.tooltipFormat(point.value) : point.value}`);
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
    const growthEscape = data.growth_escape;
    const growthSummary = growthEscape.summary;
    const growthHurdle = (horizon, gapGrowth) => growthEscape.sensitivity.find((row) => row.horizon_years === horizon && row.real_program_gap_growth_pct === gapGrowth);
    const growthRange = (horizon, field) => {
      const low = growthHurdle(horizon, 0)[field];
      const high = growthHurdle(horizon, 2)[field];
      return `${low.toFixed(1)}–${high.toFixed(1)}%`;
    };
    set('escape-tax-adjustment', trillions(sustainabilitySummary.total_annual_adjustment_trillions, 2));
    set('escape-tax-adjustment-gdp', `${sustainabilitySummary.total_annual_adjustment_pct_gdp.toFixed(1)}%`);
    set('escape-tax-receipts-gdp', `${sustainabilitySummary.tax_only_required_receipts_pct_gdp.toFixed(1)}%`);
    set('escape-gdp-level-impact', `${Math.abs(growthSummary.cbo_comparable_tax_financing_gdp_level_impact_low_pct).toFixed(0)}–${Math.abs(growthSummary.cbo_comparable_tax_financing_gdp_level_impact_high_pct).toFixed(0)}%`);
    set('escape-corporate-earnings-hit', `${growthSummary.mechanical_corporate_after_tax_earnings_hit_pct.toFixed(0)}%`);
    set('escape-equity-loss', `${growthSummary.equity_loss_with_10pct_derating_pct.toFixed(0)}–${growthSummary.equity_loss_with_20pct_derating_pct.toFixed(0)}%`);
    set('escape-us-consensus', `${growthSummary.imf_us_real_gdp_growth_2026_pct.toFixed(1)}% / ${growthSummary.imf_us_real_gdp_growth_2027_pct.toFixed(1)}%`);
    set('escape-us-long-run', `${growthSummary.cbo_us_long_run_real_gdp_growth_pct.toFixed(1)}%`);
    set('escape-global-imf', `${growthSummary.imf_global_real_gdp_growth_2026_pct.toFixed(1)}% / ${growthSummary.imf_global_real_gdp_growth_2027_pct.toFixed(1)}%`);
    set('escape-global-world-bank', `${growthSummary.world_bank_global_real_gdp_growth_2026_pct.toFixed(1)}% / ${growthSummary.world_bank_global_real_gdp_growth_2027_pct.toFixed(1)}%`);
    [10, 20, 30].forEach((horizon) => {
      set(`escape-${horizon}y-gdp`, growthRange(horizon, 'required_real_gdp_cagr_pct'));
      set(`escape-${horizon}y-productivity`, growthRange(horizon, 'required_productivity_cagr_pct'));
    });
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
    set('real-business-revenue-growth', `${productivitySummary.latest_real_business_real_revenue_growth_yoy_pct.toFixed(1)}%`);
    set('real-business-fcf-margin', `${productivitySummary.latest_real_business_fcf_margin_pct.toFixed(1)}%`);
    set('real-business-fcf-margin-change', `${productivitySummary.latest_real_business_fcf_margin_change_yoy_pp >= 0 ? '+' : ''}${productivitySummary.latest_real_business_fcf_margin_change_yoy_pp.toFixed(2)} pp`);
    set('real-business-as-of', productivitySummary.real_business_as_of_date);
    set('real-business-companies', productivitySummary.real_business_companies_with_shared_rolling_4q.toLocaleString());
    set('labor-productivity-cagr', pct(productivitySummary.labor_productivity_cagr_since_2004));
    set('labor-productivity-latest-growth', pct(productivitySummary.latest_quarter_productivity_growth_annualized));
    set('labor-productivity-quarter', productivitySummary.latest_labor_productivity_quarter);
    set('labor-productivity-yoy', pct(productivitySummary.latest_quarter_productivity_growth_yoy));
    const humanCapital = productivity.human_capital_evidence;
    set('education-spending-per-pupil', money(productivitySummary.latest_public_school_spending_per_pupil));
    set('education-real-spending-change', pct(productivitySummary.real_public_school_spending_change_since_2003));
    set('education-naep-change', pct(Math.abs(productivitySummary.naep_grade8_composite_change_since_2003)));
    set('grade12-reading-change', `${humanCapital.grade12_reading_point_change_since_1992.toFixed(0)} pts`);
    set('grade12-reading-lower-tail', `${Math.abs(humanCapital.grade12_reading_10th_percentile_point_change_since_1992).toFixed(0)} points`);
    set('adult-low-literacy', `${humanCapital.adult_literacy_level1_or_below_pct_2023.toFixed(0)}%`);
    set('adult-low-literacy-prior', `${humanCapital.adult_literacy_level1_or_below_pct_2017.toFixed(0)}%`);
    set('chronic-absence', `${humanCapital.chronic_absence_pct_2024_25.toFixed(0)}%`);
    set('chronic-absence-prior', `${humanCapital.chronic_absence_pct_pre_pandemic.toFixed(0)}%`);
    set('graduation-rate-start', `${humanCapital.public_school_graduation_rate_pct_2011_12.toFixed(0)}%`);
    set('graduation-rate-end', `${humanCapital.public_school_graduation_rate_pct_2021_22.toFixed(0)}%`);
    set('gpa-start', humanCapital.act_taker_average_gpa_2010.toFixed(2));
    set('gpa-end', humanCapital.act_taker_average_gpa_2021.toFixed(2));
    set('act-start', humanCapital.act_composite_2015.toFixed(1));
    set('act-end', humanCapital.act_composite_2025.toFixed(1));
    set('act-schoolday-start', humanCapital.act_school_day_composite_2015.toFixed(1));
    set('act-schoolday-end', humanCapital.act_school_day_composite_2024.toFixed(1));
    set('big-tech-new-grad-share', `${humanCapital.big_tech_new_grad_share_pct_2024.toFixed(0)}%`);
    set('tech-major-entry-decline', `${Math.abs(humanCapital.tech_major_entry_level_hiring_change_since_2019_pct).toFixed(0)}%`);
    set('startup-entry-decline', `${Math.abs(humanCapital.early_stage_startup_entry_level_hiring_change_since_2019_pct).toFixed(0)}%`);
    set('top-cs-placement-decline', `${Math.abs(humanCapital.top20_cs_tech_major_placement_change_2025_vs_2022_pct).toFixed(0)}%`);
    set('federal-trust', `${humanCapital.trust_federal_government_pct_2025.toFixed(0)}%`);
    set('medicare-improper-payments', `$${humanCapital.medicare_improper_payments_billions_fy2025.toFixed(1)}B`);
    const common = data.common_prosperity;
    const commonSummary = common.summary;
    const commonHousing = commonSummary.housing;
    const commonBurger = commonSummary.big_mac;
    const commonConcentration = commonSummary.market_concentration;
    const commonLife = commonSummary.life_expectancy;
    const commonFertility = commonSummary.native_completed_fertility;
    const commonSuicide = commonSummary.suicide;
    const commonObesity = commonSummary.obesity;
    set('common-housing-burden', `${commonHousing.interest_only_burden_pct_median_personal_income.toFixed(1)}%`);
    set('common-housing-change-2021', signedPercent(commonHousing.change_since_2021_pct, 0));
    set('common-big-macs-hour', commonBurger.big_macs_per_median_work_hour.toFixed(2));
    set('common-big-mac-change', signedPercent(commonBurger.change_since_2000_pct, 0));
    set('common-nvda-russell-ratio', `${commonConcentration.nvda_to_russell_2000_marketcap_pct.toFixed(0)}%`);
    set('common-iwm-coverage', `${commonConcentration.matched_iwm_portfolio_weight_pct.toFixed(1)}%`);
    set('common-life-change', signedNumber(commonLife.five_year_change_years, 1, ' yrs'));
    set('common-life-year', commonLife.as_of_year);
    set('common-concentration-date', commonConcentration.as_of_date);
    set('common-nvda-marketcap', trillions(commonConcentration.nvda_marketcap_usd / 1e12, 2));
    set('common-russell-marketcap', trillions(commonConcentration.russell_2000_constituent_marketcap_usd / 1e12, 2));
    set('common-iwm-aum', `$${(commonConcentration.iwm_net_assets_proxy_usd / 1e9).toFixed(1)}B`);
    const russellBar = $('[data-common-russell-bar]');
    if (russellBar) russellBar.style.setProperty('--common-bar', `${Math.min(100, commonConcentration.russell_2000_constituent_marketcap_usd / commonConcentration.nvda_marketcap_usd * 100).toFixed(1)}%`);
    set('common-native-fertility', commonFertility.children_per_native_born_woman_age_40_50.toFixed(3));
    set('common-native-fertility-change', signedPercent(commonFertility.change_since_2014_pct, 1));
    set('common-national-tfr', commonFertility.national_total_fertility_rate_2024.toFixed(3));
    set('common-suicide-vs-average', signedPercent(commonSuicide.pct_vs_prior_10_year_average, 1));
    set('common-suicide-rate', commonSuicide.rate_per_100k.toFixed(1));
    set('common-suicide-since-2001', signedPercent(commonSuicide.change_since_2001_pct, 0));
    set('common-obesity-vs-average', signedPercent(commonObesity.pct_vs_prior_decade_cycle_average, 1));
    set('common-obesity-rate', `${commonObesity.adult_obesity_pct.toFixed(1)}%`);
    set('common-life-level', `${commonLife.years.toFixed(1)} yrs`);
    const commonIncome = common.affordability_snapshot[0].median_household_income_usd;
    set('common-median-household-income', money(commonIncome));
    $('#common-affordability-table').innerHTML = common.affordability_snapshot.map((row) => `<tr><td>${row.item}<small>${row.definition.replaceAll('_', ' ')}</small></td><td>${money(row.cost_usd, row.cost_usd < 100 ? 2 : 0)}</td><td>${row.median_household_incomes_required.toFixed(3)}×</td><td>${row.pct_of_one_median_household_income.toFixed(row.pct_of_one_median_household_income < 1 ? 2 : 1)}%</td></tr>`).join('');
    const demographics = data.demographics;
    const demographicSummary = demographics.summary;
    set('demographic-beneficiaries-1960', demographicSummary.beneficiaries_per_100_workers_1960.toFixed(1));
    set('demographic-beneficiaries-2025', demographicSummary.beneficiaries_per_100_workers_2025.toFixed(1));
    set('demographic-beneficiaries-2036', demographicSummary.beneficiaries_per_100_workers_2036.toFixed(1));
    set('demographic-workers-1960', demographicSummary.workers_per_beneficiary_1960.toFixed(1));
    set('demographic-workers-2025', demographicSummary.workers_per_beneficiary_2025.toFixed(1));
    set('demographic-workers-2036', demographicSummary.workers_per_beneficiary_2036.toFixed(1));
    set('demographic-debt-1945', `${demographicSummary.gross_debt_pct_gdp_1945.toFixed(1)}%`);
    set('demographic-debt-1945-repeat', `${demographicSummary.gross_debt_pct_gdp_1945.toFixed(1)}%`);
    set('demographic-debt-1960', `${demographicSummary.gross_debt_pct_gdp_1960.toFixed(1)}%`);
    set('demographic-debt-2025', `${demographicSummary.gross_debt_pct_gdp_2025.toFixed(1)}%`);
    set('demographic-debt-2025-repeat', `${demographicSummary.gross_debt_pct_gdp_2025.toFixed(1)}%`);
    set('doom-definition', data.definitions.measured_liability_stack || data.definitions.doom_index);
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
    $('#sustainability-tax-mix-table').innerHTML = sustainability.tax_mix.map((row) => `<tr><td>${row.program_reform_share_of_gap_funding_pct.toFixed(0)}%</td><td>${trillions(row.program_reform_pv_reduction_trillions, 1)}<small>${trillions(row.annual_equivalent_program_reform_trillions, 2)}/yr equivalent</small></td><td>${trillions(row.new_tax_revenue_trillions, 2)}</td><td>${row.required_total_federal_receipts_pct_gdp.toFixed(1)}%</td><td>+${row.ordinary_income_all_brackets_rate_point_change.toFixed(1)} pp<small>top → ${row.resulting_top_ordinary_income_rate_pct.toFixed(1)}%</small></td><td>${row.resulting_combined_standard_payroll_rate_pct.toFixed(1)}%</td><td>${row.resulting_top_long_term_gains_rate_with_niit_pct.toFixed(1)}%</td><td>${row.resulting_corporate_income_rate_pct.toFixed(1)}%</td><td>${row.broad_vat_rate_pct.toFixed(1)}%</td></tr>`).join('');

    const demographicInterpretation = {
      1945: 'Wartime peak; Social Security monthly benefits were only five years old.',
      1960: 'A more mature postwar system after major coverage expansion.',
      2000: 'Pre-GFC low-debt benchmark near the end of the demographic dividend.',
      2020: 'Pandemic borrowing lifted gross debt above its WWII level.',
      2025: 'Current mature-system baseline; debt remains above the wartime level.',
    };
    $('#demographic-comparison-table').innerHTML = demographics.comparison_years.map((row) => `<tr><td>${row.year}</td><td>${row.gross_federal_debt_pct_gdp.toFixed(1)}%</td><td>${row.oasdi_beneficiaries_per_100_workers.toFixed(1)}</td><td>${row.workers_per_oasdi_beneficiary.toFixed(1)}</td><td>${demographicInterpretation[row.year]}</td></tr>`).join('');

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

    const distraction = data.distraction_economy;
    const searchSignal = distraction.search_attention_summary.doom_signal;
    set('search-level-ratio', `${searchSignal.ai_porn_to_constructive_52w_ratio.toFixed(2)}×`);
    set('search-ai-porn-growth', `${searchSignal.ai_porn_12w_ma_yoy_pct.toFixed(1)}%`);
    set('search-constructive-growth', `${searchSignal.constructive_education_12w_ma_yoy_pct.toFixed(1)}%`);
    set('search-doom-score', `${searchSignal.attention_allocation_doom_score.toFixed(1)}/100`);
    lineChart($('#distraction-marketcap-chart'), [
      { color: '#eb735f', values: distraction.marketcap_history.map((d) => ({ year: d.calendar_year, value: d.distraction_marketcap_trillions })) },
      { color: '#62c6ae', values: distraction.marketcap_history.map((d) => ({ year: d.calendar_year, value: d.industrials_marketcap_trillions })) },
    ], { yMin: 0, yFormat: (v) => `$${v.toFixed(0)}T`, tooltipFormat: (v) => trillions(v, 2), points: false, xTicks: 6, margin: { left: 48, right: 18 } });
    lineChart($('#distraction-fcf-chart'), [
      { color: '#eb735f', values: distraction.fcf_history.map((d) => ({ year: d.calendar_year, value: d.distraction_rolling_4q_fcf_billions })) },
      { color: '#62c6ae', values: distraction.fcf_history.map((d) => ({ year: d.calendar_year, value: d.industrials_rolling_4q_fcf_billions })) },
    ], { yMin: -100, yMax: 400, headroom: 1, yFormat: (v) => `$${v.toFixed(0)}B`, tooltipFormat: (v) => `$${v.toFixed(1)}B`, points: false, xTicks: 6, margin: { left: 54, right: 18 } });
    lineChart($('#distraction-attention-chart'), [
      { color: '#eb735f', values: distraction.attention_history.map((d) => ({ year: d.year, value: d.measured_digital_leisure_hours })) },
      { color: '#62c6ae', values: distraction.attention_history.map((d) => ({ year: d.year, value: d.socializing_communicating_hours })) },
    ], { yMin: 0, yMax: 3.6, headroom: 1, yFormat: (v) => `${v.toFixed(1)}h`, tooltipFormat: (v) => `${v.toFixed(2)} hours/day`, points: true, xTicks: 8, margin: { left: 48, right: 18 } });

    const searchByDate = new Map();
    distraction.search_attention_history.forEach((row) => {
      if (row.trend_index_52w_ma === null || row.trend_index_52w_ma === undefined) return;
      const entry = searchByDate.get(row.date_to) || {};
      entry[row.term] = Number(row.trend_index_52w_ma);
      searchByDate.set(row.date_to, entry);
    });
    const fractionalYear = (isoDate) => {
      const date = new Date(`${isoDate}T00:00:00Z`);
      const start = Date.UTC(date.getUTCFullYear(), 0, 1);
      const end = Date.UTC(date.getUTCFullYear() + 1, 0, 1);
      return date.getUTCFullYear() + (date.getTime() - start) / (end - start);
    };
    const searchAttention = [...searchByDate.entries()]
      .filter(([, values]) => Number.isFinite(values['AI Porn']) && Number.isFinite(values['Best Colleges']) && Number.isFinite(values['Trade School']))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, values]) => ({
        year: fractionalYear(date),
        label: date,
        aiPorn: values['AI Porn'],
        constructive: (values['Best Colleges'] + values['Trade School']) / 2,
      }));
    lineChart($('#search-attention-chart'), [
      { color: '#eb735f', values: searchAttention.map((d) => ({ year: d.year, label: d.label, value: d.aiPorn })) },
      { color: '#62c6ae', values: searchAttention.map((d) => ({ year: d.year, label: d.label, value: d.constructive })) },
    ], { yMin: 0, yMax: 100, headroom: 1, yFormat: (v) => v.toFixed(0), tooltipFormat: (v) => v.toFixed(1), points: false, xTicks: 5, xFormat: (v) => String(Math.floor(v)), margin: { left: 48, right: 18 } });

    const utilityProductivity = productivity.utility_capex_generation;
    lineChart($('#utility-productivity-chart'), [
      { color: '#eb735f', values: utilityProductivity.map((d) => ({ year: d.calendar_year, value: d.real_capex_index_2004 })) },
      { color: '#62c6ae', values: utilityProductivity.map((d) => ({ year: d.calendar_year, value: d.generation_index_2004 })) },
    ], { yMin: 80, yMax: 280, headroom: 1, yFormat: (v) => v.toFixed(0), tooltipFormat: (v) => `${v.toFixed(1)} (2004=100)`, points: false, xTicks: 8 });

    const educationProductivity = productivity.education_spending_vs_naep;
    lineChart($('#education-productivity-chart'), [
      { color: '#eb735f', values: educationProductivity.map((d) => ({ year: d.year, value: d.real_spending_index_2003 })) },
      { color: '#62c6ae', values: educationProductivity.map((d) => ({ year: d.year, value: d.naep_composite_index_2003 })) },
    ], { yMin: 95, yMax: 132, headroom: 1, yFormat: (v) => v.toFixed(0), tooltipFormat: (v) => `${v.toFixed(1)} (2003=100)`, points: true, xTicks: 8 });

    const realBusiness = productivity.real_business_ex_distraction.annual_history;
    lineChart($('#real-business-productivity-chart'), [
      { color: '#62c6ae', values: realBusiness.map((d) => ({ year: d.calendar_year, value: d.operating_ex_distraction_real_revenue_growth_yoy_pct })) },
      { color: '#d7a94b', values: realBusiness.map((d) => ({ year: d.calendar_year, value: d.operating_ex_distraction_fcf_margin_pct })) },
    ], { yMin: -20, yMax: 20, headroom: 1, yFormat: (v) => `${v.toFixed(0)}%`, tooltipFormat: (v) => `${v.toFixed(2)}%`, points: false, xTicks: 6, margin: { left: 52, right: 18 } });

    const laborProductivity = productivity.labor_productivity;
    lineChart($('#labor-productivity-chart'), [
      { color: '#8b78d1', values: laborProductivity.map((d) => ({ year: d.year, value: d.annual_growth })) },
      { color: '#62c6ae', values: laborProductivity.map((d) => ({ year: d.year, value: d.five_year_annualized_growth })) },
    ], { yMin: -0.02, yMax: 0.06, headroom: 1, yFormat: (v) => Math.abs(v) < 0.0005 ? '0%' : `${(v * 100).toFixed(0)}%`, tooltipFormat: (v) => pct(v, 2), points: false, xTicks: 6, margin: { left: 52, right: 18 } });

    lineChart($('#common-housing-chart'), [
      { color: '#eb735f', values: common.housing_history.map((d) => ({ year: d.year, value: d.housing_interest_burden_pct_median_personal_income })) },
    ], { yMin: 20, yMax: 80, headroom: 1, yFormat: (v) => `${v.toFixed(0)}%`, tooltipFormat: (v) => `${v.toFixed(1)}% of median personal income`, points: false, xTicks: 7, margin: { left: 50, right: 18 } });

    lineChart($('#common-big-mac-chart'), [
      { color: '#d7a94b', values: common.big_mac_history.map((d) => ({ year: d.year, value: d.big_macs_per_median_work_hour })) },
    ], { yMin: 4, yMax: 7, headroom: 1, yFormat: (v) => v.toFixed(1), tooltipFormat: (v) => `${v.toFixed(2)} Big Macs/hour`, points: true, xTicks: 7, margin: { left: 46, right: 18 } });

    const indexed = (rows, field, startYear = -Infinity) => {
      const eligible = rows.filter((row) => row.year >= startYear && Number.isFinite(Number(row[field])));
      const base = Number(eligible[0][field]);
      return eligible.map((row) => ({ year: row.year, label: row.survey_period || row.year, value: Number(row[field]) / base * 100 }));
    };
    lineChart($('#common-social-chart'), [
      { color: '#62c6ae', values: indexed(common.life_expectancy, 'life_expectancy_years', 2000) },
      { color: '#eb735f', values: indexed(common.suicide, 'suicide_rate_per_100k', 2001) },
      { color: '#d7a94b', values: indexed(common.obesity, 'adult_obesity_pct', 1999) },
      { color: '#8b78d1', values: indexed(common.native_completed_fertility, 'native_born_women_40_50_children_ever_born_per_woman', 2014) },
    ], { yMin: 70, yMax: 145, headroom: 1, yFormat: (v) => v.toFixed(0), tooltipFormat: (v) => `${v.toFixed(1)} (first observation=100)`, points: true, xTicks: 8 });

    const demographicHistory = demographics.history_and_projection;
    const demographicActual = demographicHistory.filter((row) => row.year <= 2025);
    const demographicProjection = demographicHistory.filter((row) => row.year >= 2025);
    lineChart($('#demographic-support-chart'), [
      { color: '#eb735f', values: demographicActual.map((d) => ({ year: d.year, value: d.oasdi_beneficiaries_per_100_workers })) },
      { color: '#8b78d1', values: demographicProjection.map((d) => ({ year: d.year, value: d.oasdi_beneficiaries_per_100_workers })) },
    ], { yMin: 0, yMax: 60, headroom: 1, yFormat: (v) => v.toFixed(0), tooltipFormat: (v) => `${v.toFixed(1)} beneficiaries per 100 workers`, projectionFrom: 2026, projectionLabel: 'TRUSTEES', points: true, xTicks: 8, margin: { left: 52, right: 24 } });

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

  function renderReleaseHistory(payload) {
    const target = $('#doom-release-history-table');
    if (!target) return;
    const rows = (payload.releases || []).slice(0, 8);
    target.innerHTML = rows.length ? rows.map((row) => {
      const bloomberg = row.skip_bloomberg ? 'degraded / skipped' : 'normal attempt';
      const finished = row.finished_at ? new Date(row.finished_at).toISOString().replace('.000Z', 'Z') : '—';
      return `<tr><td>${row.release_id || '—'}</td><td>${finished}</td><td>${row.profile || '—'}</td><td>${row.status || '—'}</td><td>${Number(row.artifact_count || 0)}</td><td>${bloomberg}</td></tr>`;
    }).join('') : '<tr><td colspan="6">No archived releases yet.</td></tr>';
  }

  fetch('/doom-thesis/data.json?v=20260804-3', { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch((error) => {
      console.error('Doom Thesis data load failed', error);
      $('[data-loading]').hidden = true;
      $('[data-error]').hidden = false;
    });

  fetch('/doom-thesis/doom-index-release-index.json?v=20260804-1', { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(renderReleaseHistory)
    .catch((error) => {
      console.error('Doom Index release archive load failed', error);
      const target = $('#doom-release-history-table');
      if (target) target.innerHTML = '<tr><td colspan="6">Release archive unavailable.</td></tr>';
    });
})();
