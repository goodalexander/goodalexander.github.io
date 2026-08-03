# Doom Index update runbook

The Doom Index is intended to become a 0–100 estimate that the Doom Thesis is
the most likely medium-term U.S. regime. It is not yet a published probability.
Version 0.1 is a claim inventory and evidence-completion system.

The canonical component specification is
`static/doom-thesis/doom-index-framework.json`. The public copy is available at
`/doom-thesis/doom-index-framework.json`.

## Publication gate

Do not publish a numeric score until all of the following are true:

- At least 80% of proposed component weight has current, reproducible inputs.
- Every input has a source, transformation, direction, frequency, as-of date,
  and staleness rule.
- Weights and thresholds are frozen before reviewing the holdout period.
- Historical vintages are point-in-time where revisions could create lookahead.
- A calibration maps the composite to observed regime frequencies or the page
  labels it an evidence score rather than a probability.
- Missing inputs are disclosed. They are not silently imputed as neutral.

## Hard stop

Exit Doom Index-linked positions if the published score closes below 20. Also
cap the score at 19 if the estimated probability that U.S. productivity
averages at least 5% over the next five years reaches 50%.

That override needs a forecast ensemble. A strong realized quarter is not
enough. The ensemble should include BLS vintages, professional forecasts,
market-implied macro probabilities where relevant, and explicit AI adoption
scenarios. Store both the raw forecasts and the resulting probability.

## Update cadence

### Daily

- Refresh Bloomberg public debt and market data.
- Refresh point-in-time Sharadar rolling-four-quarter company fundamentals.
- Recalculate Treasury refinancing, interest, valuation, and portfolio inputs.
- Check data freshness, missing series, extreme changes, and score-limit events.

### Weekly

- Snapshot relevant Kalshi and Polymarket prices, volume, liquidity, rules, and
  resolution sources. A market is not admissible if its wording does not map to
  the component claim.
- Review enacted or formally introduced fiscal, digital-money, stablecoin,
  surveillance, and capital-control policy events.
- Record changes to the evidence inventory even when no score changes.

### Quarterly

- Update BLS productivity and retain the initial-release vintage.
- Update hyperscaler capex, depreciation, disclosed AI revenue, data-center
  capacity, power demand, and the incremental AI-return model.
- Update distraction-economy baskets, engagement, and corporate disclosures.
- Re-estimate strategy signals only after the source data pass validation.

### Annual or source-vintage

- Refresh Social Security and Medicare Trustees estimates.
- Refresh CBO and OMB fiscal baselines, Census households, consumer income,
  education, time use, demographics, trust, and governance indicators.
- Re-run historical calibration only under a new version number. Never revise
  old published scores without preserving the prior vintage.

## Existing fiscal-data refresh

From the NavStrategies environment:

```bash
cd /home/pfrpc/repos/navstrategies
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_daily_timeseries.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_projection.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_human_capital_productivity.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_demographics_support_ratio.py
```

Then rebuild the site's static payload:

```bash
cd /home/pfrpc/repos/goodalexander.github.io
/home/pfrpc/repos/navstrategies/.venv/bin/python scripts/build-doom-thesis-data.py
hugo --gc --minify
```

## Required score table

Every scored indicator must eventually occupy one row with:

| Field | Meaning |
|---|---|
| `component_id` | One of the frozen Doom Index components |
| `indicator_id` | Stable machine identifier |
| `as_of` | Information date, not download date |
| `vintage` | Release or filing version used at that time |
| `raw_value` | Unmodified observation |
| `transform` | Units, normalization, clipping, and direction |
| `indicator_score` | 0–100 after the frozen transform |
| `weight` | Frozen within-component and total-index weight |
| `source` | Direct URL, API series, Bloomberg field, or database query |
| `fresh_until` | Date after which the observation is stale |
| `quality_flag` | Current, stale, estimated, missing, or revised |

## Release procedure

1. Run all due refreshes.
2. Validate row counts, dates, units, revisions, and source availability.
3. Compare the proposed score with the prior published vintage and attribute
   every change by component and indicator.
4. Apply the coverage gate and the 5% productivity override.
5. Export the score, component contributions, history, sources, and quality
   flags to JSON and CSV.
6. Build the Hugo site to a temporary directory and run browser checks.
7. Commit the data and methodology together. Tag any formula or weight change
   with a new semantic version.

## Strategy-release gate

No sub-strategy should be described as investable until it has a point-in-time,
survivorship-safe backtest; valuation and liquidity constraints; transaction,
borrow, funding, and slippage costs; explicit sizing; and drawdown, turnover,
and threshold-whipsaw tests. Scenario alignment is not an expected-return
estimate.
