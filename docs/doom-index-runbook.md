# Doom Index update runbook

The Doom Index is intended to become a 0–100 estimate that the Doom Thesis is
the most likely medium-term U.S. regime. It is not yet a published probability.
Version 0.5 includes a live fixed-threshold research evidence score. It is not
yet a calibrated probability or operational trading signal.

The canonical human-readable specification is `docs/doom-thesis-spec.md`, with
the author's source brief preserved at `docs/doom-thesis-original-brief.md`.
The machine-readable component framework is
`static/doom-thesis/doom-index-framework.json`; its public copy is available at
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

## Distraction Economy refresh

The current frozen 2026-07-31 research vintage is reproducible with:

```bash
cd /home/pfrpc/repos/navstrategies
.venv/bin/python scripts/run_distraction_economy_glm52_scores.py --as-of-date 2026-07-31 --workers 200 --invalid-response-retries 3
.venv/bin/python scripts/build_distraction_vs_industrials_marketcap.py --as-of-date 2026-07-31 --minimum-score 70 --scores /home/pfrpc/repos/data/doom_thesis/distraction_economy_scores_glm52_ever_1b_marketcap_2026-07-31.csv
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_distraction_industrials_fcf.py --as-of-date 2026-07-31 --minimum-score 70 --scores /home/pfrpc/repos/data/doom_thesis/distraction_economy_scores_glm52_ever_1b_marketcap_2026-07-31.csv
```

For a new vintage, change the date in all three commands and use the newly
dated score file in both basket builders. Do not use `--force` for a routine
refresh: successful model responses are cached, while invalid responses receive
fresh recovery attempts. A release fails coverage if `n_failed` is nonzero;
failed companies remain unscored rather than receiving an invented default.

The classification is a research taxonomy, not yet a point-in-time trading
signal. The current historical market-cap and FCF panels apply the 2026
classification retrospectively, which is appropriate for describing the
capital-allocation history but not for claiming a historical implementable
portfolio. Preserve that caveat in every release.

## Required score table

The current registry is `static/doom-thesis/doom-index-indicator-registry.json`.
Current machine outputs are `/doom-thesis/doom-index-score.json`,
`data/doom_thesis/doom_index_component_scores.csv`, and
`data/doom_thesis/doom_index_indicator_scores.csv`.

Refresh the new component feeders and composite with:

```bash
cd /home/pfrpc/repos/navstrategies
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_ai_capital_efficiency.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_ai_monetization_bottlenecks.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_ai_video_quality_frontier.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_hbm_market_panel.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_distraction_attention.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_political_fiscal_history.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_political_polling.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_fiscal_prediction_markets.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_debasement_repression.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_financial_repression_ownership.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_institutional_confidence_panel.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_governance_outcomes.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_verified_fraud_enforcement.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_exit_proxies.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_surveillance_deployment.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_protest_unrest_panel.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_financial_bread_circuses.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_command_control_signposts.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_superintelligence_exit_signposts.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_legitimacy_political_feasibility.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_productivity_escape_forecast.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_doom_index_evidence_score.py
.venv/bin/python /home/pfrpc/repos/us_debt_research/build_doom_index_history.py
```

The canonical fail-loud release command is:

```bash
cd /home/pfrpc/repos/navstrategies
.venv/bin/python /home/pfrpc/repos/us_debt_research/refresh_doom_index.py --profile score
```

Use `--profile daily` to prepend the point-in-time company and Treasury
refreshes, or `--profile full` for all admitted annual/source-vintage builders.
The normal release must reach Bloomberg. `--skip-bloomberg` is a degraded
research mode that is retained in the release manifest and leaves Bloomberg
inputs missing. Each non-dry run writes a unique immutable manifest beneath
`data/doom_thesis/releases/` and publishes the latest manifest on the site.

If Bloomberg is unavailable, the repression builder still refreshes FRED and
marks MOVE missing. Never pass `--skip-bloomberg` in a normal scheduled release;
that option exists for deterministic offline tests and research rebuilds.

## Scheduled refresh and health alerts

Version-controlled user units live in `ops/systemd/user/`. Install them with:

```bash
systemctl --user link /home/pfrpc/repos/goodalexander.github.io/ops/systemd/user/goodalexander-doom-index-*.service
systemctl --user link /home/pfrpc/repos/goodalexander.github.io/ops/systemd/user/goodalexander-doom-index-*.timer
systemctl --user daemon-reload
systemctl --user enable --now goodalexander-doom-index-daily.timer goodalexander-doom-index-full.timer goodalexander-doom-index-health.timer
```

The daily panel runs at 07:15 UTC, the full panel runs Sunday at 09:15 UTC,
and release health is checked every six hours against a 36-hour age limit.
Failures always write `data/doom_thesis/doom_index_last_alert.json`. To deliver
the same payload externally, set `DOOM_INDEX_ALERT_WEBHOOK_URL` in
`~/.config/navstrategies/credentials.env`; the URL itself is never written to
the alert artifact or release manifest.

Every scored indicator occupies one row with:

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
