#!/usr/bin/env python3
"""Build the static data payload for the goodalexander Doom Thesis page."""

from __future__ import annotations

import argparse
import csv
import io
import json
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import requests


FRED_CSV = "https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}"


def fred_series(series: str) -> pd.DataFrame:
    response = requests.get(FRED_CSV.format(series=series), timeout=60)
    response.raise_for_status()
    frame = pd.read_csv(io.StringIO(response.text))
    frame.columns = ["date", "value"]
    frame["date"] = pd.to_datetime(frame["date"])
    frame["value"] = pd.to_numeric(frame["value"], errors="coerce")
    return frame.dropna(subset=["value"])


def records(frame: pd.DataFrame) -> list[dict]:
    return json.loads(frame.to_json(orient="records", date_format="iso"))


def round_numeric(frame: pd.DataFrame, digits: int = 8) -> pd.DataFrame:
    result = frame.copy()
    columns = result.select_dtypes(include="number").columns
    result[columns] = result[columns].round(digits)
    return result


def build_llm_document(payload: dict) -> str:
    """Return a compact, JavaScript-free snapshot for automated readers."""
    latest = payload["latest"]
    receipts = payload["federal_receipts"]["summary"]
    sustainability = payload["sustainability"]["summary"]
    tax_mix = payload["sustainability"]["tax_mix"][0]
    growth = payload["growth_escape"]["summary"]
    productivity = payload["productivity"]["summary"]
    human_capital = payload["productivity"]["human_capital_evidence"]
    demographics = payload["demographics"]["summary"]
    common = payload["common_prosperity"]["summary"]
    cumulative = payload["cumulative_income_vs_debt"]["summary"]
    valuation = payload["tax_valuation"]["valuation_summary"]
    doom_score = payload["doom_index_score"]
    productivity_escape = payload["productivity_escape_forecast"]

    def hurdle(horizon: int, gap_growth: float) -> dict:
        return next(
            row
            for row in payload["growth_escape"]["sensitivity"]
            if row["horizon_years"] == horizon
            and row["real_program_gap_growth_pct"] == gap_growth
        )

    hurdle_lines = []
    for horizon in (10, 20, 30):
        low = hurdle(horizon, 0.0)
        high = hurdle(horizon, 2.0)
        hurdle_lines.append(
            f"- {horizon} years: real GDP {low['required_real_gdp_cagr_pct']:.1f}%–"
            f"{high['required_real_gdp_cagr_pct']:.1f}%; productivity "
            f"{low['required_productivity_cagr_pct']:.1f}%–"
            f"{high['required_productivity_cagr_pct']:.1f}% annually."
        )

    source_lines = []
    for source in payload["sources"]:
        location = source.get("url") or source.get("reference")
        source_lines.append(f"- {source['name']}: {location}")

    return "\n".join(
        [
            "# Doom Thesis — machine-readable edition",
            "",
            f"Generated: {payload['generated_at_utc']}",
            f"Data as of: {payload['as_of_date']}",
            "Canonical human page: https://goodalexander.com/doom-thesis/",
            "Canonical machine-readable document: https://goodalexander.com/doom-thesis.txt",
            "Full structured data: https://goodalexander.com/doom-thesis/data.json",
            "",
            "## Executive thesis",
            "",
            "This is what it would take to right-size the fiscal and monetary situation in the United States. Bring the annual deficit down to 3% of GDP and reduce the Social Security and Medicare funding gap to one year of GDP without cutting promised benefits. On current math, that requires a recurring $2.66 trillion annual adjustment, or economic growth fast enough to make the bill small relative to the economy. A tax-led adjustment is likely to produce a lower-growth, lower-valuation transition rather than a painless accounting fix. This is why AGI moon math is appealing: extraordinary productivity is the only believable non-austerity route that could honor the promises without some combination of very large taxes, benefit cuts, inflation, or financial repression. It would have to be a sustained change in the growth regime, not a one-year AI boom.",
            "",
            "## Doom Index research status",
            "",
            f"- Current research evidence score: {doom_score['research_score']:.1f}/100 at {doom_score['coverage_pct']:.1f}% weighted input coverage.",
            f"- Missing-input sensitivity: {doom_score['missing_input_sensitivity']['lower']:.1f}–{doom_score['missing_input_sensitivity']['upper']:.1f}.",
            "- This is a fixed-threshold evidence score, not a calibrated regime probability or an investable signal.",
            "- Publication gate: 100% of weighted inputs must be current or explicitly modeled and reproducible; modeled inputs retain visible sensitivity, and historical calibration remains a separate strategy gate.",
            "- Portfolio rule: exit Doom-linked positions below 20.",
            f"- Productivity override: the current research estimate is {productivity_escape['productivity_escape_probability_pct']:.1f}% that U.S. productivity averages at least 5% for five years, versus a 50% trigger. The estimate is reproducible but not calibrated for live execution.",
            "- Framework JSON: https://goodalexander.com/doom-thesis/doom-index-framework.json",
            "",
            "## The numbers",
            "",
            f"- Gross public debt: ${latest['public_debt_trillions']:.2f} trillion.",
            f"- Social Security 75-year open-group present-value shortfall: ${latest['ssa_unfunded_75yr_trillions']:.1f} trillion.",
            f"- Medicare 75-year government-wide resource gap: ${latest['medicare_resource_gap_trillions']:.1f} trillion.",
            f"- Combined measured liabilities: ${latest['total_liabilities_trillions']:.2f} trillion, or ${latest['total_liabilities_per_household']:,.0f} per household.",
            f"- Median household income: ${latest['median_pretax_household_income']:,.0f} before tax and ${latest['median_post_tax_household_income']:,.0f} after tax ({int(latest['median_household_income_year'])}).",
            f"- Current federal interest: ${latest['precise_interest_trillions']:.2f} trillion, equal to {latest['interest_to_public_net_income_ratio']:.1%} of rolling public-company net income.",
            f"- Annualized payment for the full Social Security and Medicare gaps: ${latest['annualized_unfunded_program_cost_trillions']:.2f} trillion. With current interest, the all-in annual economic burden is ${latest['all_in_annual_burden_trillions']:.2f} trillion, or {latest['all_in_burden_to_public_net_income_ratio']:.1%} of public-company net income.",
            "",
            "## Current fiscal flow",
            "",
            f"- FY2026 projected receipts: ${receipts['fy2026_projected_receipts_trillions']:.2f} trillion ({receipts['fy2026_projected_receipts_pct_gdp']:.1f}% of GDP).",
            f"- FY2026 projected outlays: ${receipts['fy2026_projected_outlays_trillions']:.2f} trillion.",
            f"- FY2026 projected deficit: ${receipts['fy2026_projected_deficit_trillions']:.2f} trillion.",
            f"- Receipts cover {receipts['fy2026_projected_receipts_coverage_of_outlays_pct']:.1f}% of outlays; interest consumes {receipts['fy2026_interest_share_of_receipts_pct']:.1f}% of receipts.",
            "",
            "## Prudent reduction sensitivity",
            "",
            f"Definition: {sustainability['definition']}",
            f"- Annual deficit correction: ${sustainability['annual_deficit_correction_trillions']:.2f} trillion.",
            f"- Annual equivalent funding needed to reduce the program gap: ${sustainability['annual_program_gap_funding_trillions']:.2f} trillion.",
            f"- Total recurring adjustment: ${sustainability['total_annual_adjustment_trillions']:.2f} trillion, or {sustainability['total_annual_adjustment_pct_gdp']:.1f}% of GDP.",
            f"- Tax-only federal receipts would rise from {receipts['fy2026_projected_receipts_pct_gdp']:.1f}% to {sustainability['tax_only_required_receipts_pct_gdp']:.1f}% of GDP.",
            f"- Illustrative tax-only endpoint: top ordinary rate {tax_mix['resulting_top_ordinary_income_rate_pct']:.1f}%; combined standard payroll rate {tax_mix['resulting_combined_standard_payroll_rate_pct']:.1f}%; top long-term gains including NIIT {tax_mix['resulting_top_long_term_gains_rate_with_niit_pct']:.1f}%; corporate rate {tax_mix['resulting_corporate_income_rate_pct']:.1f}%; broad VAT {tax_mix['broad_vat_rate_pct']:.1f}%.",
            f"- Warning: {sustainability['warning']}",
            "",
            "## Economy and stock-market sensitivity",
            "",
            f"- CBO tax-financing experiments of comparable scale put the GDP level {abs(growth['cbo_comparable_tax_financing_gdp_level_impact_low_pct']):.0f}%–{abs(growth['cbo_comparable_tax_financing_gdp_level_impact_high_pct']):.0f}% below baseline after ten years. This is a comparison, not a forecast of this exact package.",
            f"- The modeled corporate-rate change mechanically reduces after-tax earnings by about {growth['mechanical_corporate_after_tax_earnings_hit_pct']:.0f}%.",
            f"- Combining that earnings effect with a 10%–20% P/E de-rating implies a mechanical equity-value loss of {growth['equity_loss_with_10pct_derating_pct']:.0f}%–{growth['equity_loss_with_20pct_derating_pct']:.0f}%. A recessionary implementation could be worse.",
            "",
            "## Consensus growth and the AGI escape hurdle",
            "",
            f"- IMF U.S. real GDP growth: {growth['imf_us_real_gdp_growth_2026_pct']:.1f}% in 2026 and {growth['imf_us_real_gdp_growth_2027_pct']:.1f}% in 2027.",
            f"- CBO longer-run U.S. real GDP growth: about {growth['cbo_us_long_run_real_gdp_growth_pct']:.1f}%.",
            f"- IMF global growth: {growth['imf_global_real_gdp_growth_2026_pct']:.1f}% in 2026 and {growth['imf_global_real_gdp_growth_2027_pct']:.1f}% in 2027; World Bank: {growth['world_bank_global_real_gdp_growth_2026_pct']:.1f}% and {growth['world_bank_global_real_gdp_growth_2027_pct']:.1f}%.",
            "- Growth needed to dilute the current program gap from roughly 297% to 100% of GDP, assuming the real gap itself grows between 0% and 2% annually:",
            *hurdle_lines,
            f"- Method: {growth['method']}",
            "",
            "## Debt, corporate income, productivity, demographics, and valuation",
            "",
            f"- Since the end of 1999, public debt accrued by ${cumulative['public_debt_accrued_trillions']:.2f} trillion versus ${cumulative['cumulative_public_company_netinc_trillions']:.2f} trillion of cumulative public-company net income, a {cumulative['debt_accrued_to_cumulative_netinc_ratio']:.2f}x ratio.",
            f"- Rolling operating-company FCF yield: {valuation['operating_company_fcf_yield_pct']:.2f}% versus a {valuation['us_30y_treasury_yield_pct']:.2f}% 30-year Treasury yield.",
            f"- SPX forward earnings yield: {valuation['spx_forward_earnings_yield_pct']:.2f}% versus VCLT yield of {valuation['vclt_yas_bond_yield_pct']:.2f}%.",
            f"- U.S. electricity generation: {productivity['latest_generation_twh']:,.0f} TWh; utility capex: ${productivity['latest_utility_capex_billions']:.1f} billion; real capex per MWh is {productivity['real_capex_per_mwh_multiple_since_2004']:.2f}x its 2004 level.",
            f"- Public-school current spending per pupil: ${productivity['latest_public_school_spending_per_pupil']:,.0f} in FY2024. Inflation-adjusted spending rose {productivity['real_public_school_spending_change_since_2003']:.1%} from 2003 while the national-public grade-8 NAEP reading/math composite ended {abs(productivity['naep_grade8_composite_change_since_2003']):.1%} below its 2003 level.",
            f"- Wider human-capital signals: grade-12 reading was {abs(human_capital['grade12_reading_point_change_since_1992']):.0f} NAEP points below 1992; adults at PIAAC literacy Level 1 or below rose from {human_capital['adult_literacy_level1_or_below_pct_2017']:.0f}% in 2017 to {human_capital['adult_literacy_level1_or_below_pct_2023']:.0f}% in 2023; chronic absence was {human_capital['chronic_absence_pct_2024_25']:.0f}% in 2024–25 versus {human_capital['chronic_absence_pct_pre_pandemic']:.0f}% before the pandemic.",
            f"- Credential versus mastery: the public-school graduation rate rose from {human_capital['public_school_graduation_rate_pct_2011_12']:.0f}% in 2011–12 to {human_capital['public_school_graduation_rate_pct_2021_22']:.0f}% in 2021–22 and average reported GPA rose from {human_capital['act_taker_average_gpa_2010']:.2f} in 2010 to {human_capital['act_taker_average_gpa_2021']:.2f} in 2021, while the ACT composite fell from {human_capital['act_composite_2015']:.1f} in 2015 to {human_capital['act_composite_2025']:.1f} in 2025. ACT estimates that changing participation explains much of the aggregate score decline, but the broader school-day cohort also fell from {human_capital['act_school_day_composite_2015']:.1f} to {human_capital['act_school_day_composite_2024']:.1f}.",
            f"- School-to-work conversion: SignalFire reported that new graduates were only {human_capital['big_tech_new_grad_share_pct_2024']:.0f}% of Big Tech hires in 2024. Its 2026 report estimates new-grad/entry-level hiring {abs(human_capital['tech_major_entry_level_hiring_change_since_2019_pct']):.0f}% below 2019 at Tech Majors and {abs(human_capital['early_stage_startup_entry_level_hiring_change_since_2019_pct']):.0f}% below 2019 at early-stage startups; top-20 computer-science graduates were {abs(human_capital['top20_cs_tech_major_placement_change_2025_vs_2022_pct']):.0f}% less likely to take a Tech Major role in 2025 than the 2022 class. These proprietary LinkedIn-derived estimates measure employer demand and career transitions, not educational quality alone.",
            f"- Institutional-capacity context: {human_capital['trust_federal_government_pct_2025']:.0f}% trusted the federal government in 2025. CMS measured ${human_capital['medicare_improper_payments_billions_fy2025']:.2f} billion of FY2025 Medicare FFS, Part C, and Part D improper payments; CMS explicitly states this is not a fraud estimate.",
            f"- Current aggregate operating-company FCF margin: {productivity['latest_operating_company_fcf_margin']:.1%}, reconstructed from four rolling reported quarters through {productivity['current_fcf_as_of_date']}.",
            f"- Outside the score-70+ distraction basket, U.S. nonfinancial, nonutility public companies have rolling-four-quarter real revenue growth of {productivity['latest_real_business_real_revenue_growth_yoy_pct']:.1f}% ({productivity['latest_real_business_revenue_growth_yoy_pct']:.1f}% nominal), FCF margin of {productivity['latest_real_business_fcf_margin_pct']:.1f}%, and operating-cash-flow margin of {productivity['latest_real_business_operating_cash_flow_margin_pct']:.1f}% as of {productivity['real_business_as_of_date']}. Real growth uses the latest publicly available current-vintage GDP deflator. This is an observable broad-business outcome bridge, not a causal estimate of AI productivity: mix, acquisitions, entry, and cyclicality also affect it.",
            f"- Latest nonfarm-business productivity: {productivity['latest_quarter_productivity_growth_annualized']:.1%} quarter-over-quarter annualized and {productivity['latest_quarter_productivity_growth_yoy']:.1%} year-over-year in {productivity['latest_labor_productivity_quarter']}.",
            f"- Common Prosperity housing burden: the requested mortgage-rate × median-new-house-price measure equals {common['housing']['interest_only_burden_pct_median_personal_income']:.1f}% of nowcast median personal income, {common['housing']['change_since_2021_pct']:.0f}% above 2021 but {abs(common['housing']['change_since_2000_pct']):.0f}% below 2000 because mortgage rates were also high then.",
            f"- A median full-time work hour buys {common['big_mac']['big_macs_per_median_work_hour']:.2f} Big Macs, {abs(common['big_mac']['change_since_2000_pct']):.0f}% fewer than in 2000 under a 40-hour-week conversion.",
            f"- NVDA market capitalization is {common['market_concentration']['nvda_to_russell_2000_marketcap_pct']:.0f}% of the summed market capitalization of matched current IWM constituents; Sharadar covers {common['market_concentration']['matched_iwm_portfolio_weight_pct']:.1f}% of IWM equity weight.",
            f"- Social outcomes: life expectancy changed {common['life_expectancy']['five_year_change_years']:+.1f} years over five years; native-born women ages 40–50 report {common['native_completed_fertility']['children_per_native_born_woman_age_40_50']:.3f} completed births; the 2024 suicide rate was {common['suicide']['rate_per_100k']:.1f} per 100,000 ({common['suicide']['pct_vs_prior_10_year_average']:+.1f}% versus its prior ten-year average); measured adult obesity was {common['obesity']['adult_obesity_pct']:.1f}% ({common['obesity']['pct_vs_prior_decade_cycle_average']:+.1f}% versus the prior-decade NHANES-cycle average).",
            f"- Demographic support ratio: OASDI beneficiaries rose from {demographics['beneficiaries_per_100_workers_1960']:.1f} per 100 covered workers in 1960 to {demographics['beneficiaries_per_100_workers_2025']:.1f} in 2025; the Trustees' intermediate projection reaches {demographics['beneficiaries_per_100_workers_2036']:.1f} in 2036.",
            f"- Debt comparison: gross federal debt was {demographics['gross_debt_pct_gdp_1945']:.1f}% of GDP in 1945, fell to {demographics['gross_debt_pct_gdp_1960']:.1f}% in 1960, and stood at {demographics['gross_debt_pct_gdp_2025']:.1f}% in 2025. This is the gross-debt definition used in the measured liability stack. The 1945 Social Security ratio is a startup artifact because ongoing monthly benefits began only in 1940.",
            "",
            "## Definitions",
            "",
            *[f"- {name}: {definition}" for name, definition in payload["definitions"].items()],
            "",
            "## Data downloads",
            "",
            "- Full JSON: https://goodalexander.com/doom-thesis/data.json",
            "- Household liabilities: https://goodalexander.com/doom-thesis/household-liabilities.csv",
            "- Daily cumulative income versus debt: https://goodalexander.com/doom-thesis/cumulative-income-vs-debt-daily.csv",
            "- Fiscal sustainability scenarios: https://goodalexander.com/doom-thesis/fiscal-sustainability-scenarios.csv",
            "- AGI growth sensitivity: https://goodalexander.com/doom-thesis/agi-growth-escape-sensitivity.csv",
            "- Education spending versus NAEP: https://goodalexander.com/doom-thesis/education-spending-vs-naep.csv",
            "- Daily real-business productivity ex distraction: https://goodalexander.com/doom-thesis/real-business-productivity-ex-distraction-daily.csv",
            "- Common Prosperity affordability snapshot: https://goodalexander.com/doom-thesis/common-prosperity-affordability.csv",
            "- Common Prosperity housing history: https://goodalexander.com/doom-thesis/common-prosperity-housing.csv",
            "- OASDI support ratio and deficit comparison: https://goodalexander.com/doom-thesis/demographics-support-ratio.csv",
            "",
            "## Sources",
            "",
            *source_lines,
            "",
        ]
    )


def build_payload(doom_root: Path) -> dict:
    annual = pd.read_csv(doom_root / "doom_index_2004_2026.csv")
    daily = pd.read_csv(doom_root / "doom_index_daily_2004_2026.csv")
    interest = pd.read_csv(
        doom_root / "us_federal_annual_interest_outlays_fy2004_2025.csv"
    )
    projection = pd.read_csv(
        doom_root / "doom_index_projection_base_2026_2030.csv"
    )
    maturity = pd.read_csv(doom_root / "treasury_maturity_wall.csv")
    distraction_marketcap = pd.read_csv(
        doom_root / "distraction_ge70_vs_industrials_marketcap_annual_2026-07-31.csv"
    )
    distraction_fcf = pd.read_csv(
        doom_root / "distraction_ge70_vs_industrials_rolling_4q_fcf_2004_2026_annual.csv"
    )
    distraction_marketcap_summary = json.loads(
        (doom_root / "distraction_ge70_vs_industrials_marketcap_annual_2026-07-31_summary.json").read_text()
    )
    distraction_fcf_summary = json.loads(
        (doom_root / "distraction_ge70_vs_industrials_rolling_4q_fcf_2004_2026_summary.json").read_text()
    )
    distraction_attention = pd.read_csv(
        doom_root / "distraction_atus_time_use_2003_2025.csv"
    )
    distraction_attention_summary = json.loads(
        (doom_root / "distraction_attention_summary.json").read_text()
    )
    distraction_search_attention = pd.read_csv(
        doom_root
        / "google_trends_ai_porn_best_colleges_trade_school_worldwide_weekly.csv"
    )
    distraction_search_attention_summary = json.loads(
        (
            doom_root
            / "google_trends_ai_porn_best_colleges_trade_school_worldwide_summary.json"
        ).read_text()
    )
    distraction_personalization = pd.read_csv(
        doom_root / "distraction_personalization_lift_events.csv"
    )
    cumulative_income_debt_daily = pd.read_csv(
        doom_root
        / "us_public_company_cumulative_net_income_vs_debt_accrued_daily_2000_2026.csv"
    )
    cumulative_income_debt_summary = json.loads(
        (
            doom_root / "cumulative_income_vs_debt_summary.json"
        ).read_text(encoding="utf-8")
    )
    cumulative_income_debt_daily["date"] = pd.to_datetime(
        cumulative_income_debt_daily["date"]
    )
    cumulative_income_debt_daily["year"] = (
        cumulative_income_debt_daily["date"].dt.year
    )
    cumulative_income_debt_history = (
        cumulative_income_debt_daily.sort_values("date")
        .groupby("year", as_index=False)
        .tail(1)[
            [
                "year",
                "date",
                "cumulative_public_company_netinc_trillions",
                "public_debt_accrued_trillions",
                "debt_accrual_minus_cumulative_netinc_trillions",
                "debt_accrued_to_cumulative_netinc_ratio",
            ]
        ]
        .reset_index(drop=True)
    )
    cumulative_numeric_columns = cumulative_income_debt_history.select_dtypes(
        include="number"
    ).columns
    cumulative_income_debt_history[cumulative_numeric_columns] = (
        cumulative_income_debt_history[cumulative_numeric_columns].round(8)
    )
    tax_stress_scenarios = pd.read_csv(
        doom_root / "corporate_tax_stress_scenario.csv"
    )
    tax_stress_summary = json.loads(
        (doom_root / "corporate_tax_stress_summary.json").read_text(
            encoding="utf-8"
        )
    )
    federal_receipts = pd.read_csv(
        doom_root / "us_federal_total_receipts_fy2004_2030.csv"
    )
    federal_receipts_composition = pd.read_csv(
        doom_root / "us_federal_receipts_composition_fy2026.csv"
    )
    federal_receipts_summary = json.loads(
        (doom_root / "federal_receipts_summary.json").read_text(
            encoding="utf-8"
        )
    )
    sustainability_funding = pd.read_csv(
        doom_root / "fiscal_sustainability_funding_scenarios.csv"
    )
    sustainability_tax_mix = pd.read_csv(
        doom_root / "fiscal_sustainability_tax_mix.csv"
    )
    sustainability_summary = json.loads(
        (doom_root / "fiscal_sustainability_summary.json").read_text(
            encoding="utf-8"
        )
    )
    agi_growth_sensitivity = pd.read_csv(
        doom_root / "agi_growth_escape_sensitivity.csv"
    )
    agi_growth_summary = json.loads(
        (doom_root / "agi_growth_escape_summary.json").read_text(
            encoding="utf-8"
        )
    )
    fcf_yield_vs_30y = pd.read_csv(
        doom_root
        / "operating_company_fcf_yield_vs_30y_annual_2004_2026.csv"
    )
    valuation_summary = json.loads(
        (
            doom_root / "equity_fixed_income_valuation_summary.json"
        ).read_text(encoding="utf-8")
    )
    spx_vclt_monthly = pd.read_csv(
        doom_root
        / "spx_forward_earnings_yield_vs_vclt_monthly_2018_2026.csv"
    ).dropna(
        subset=[
            "spx_forward_earnings_yield_pct",
            "vclt_yas_bond_yield_pct",
        ]
    )
    spx_vclt_monthly["date"] = pd.to_datetime(spx_vclt_monthly["date"])
    spx_vclt_monthly["year"] = spx_vclt_monthly["date"].dt.year
    spx_vclt_annual = (
        spx_vclt_monthly.sort_values("date")
        .groupby("year", as_index=False)
        .tail(1)
        .reset_index(drop=True)
    )
    utility_productivity = pd.read_csv(
        doom_root / "us_utility_capex_vs_power_generation_2004_2025.csv"
    )
    education_productivity = pd.read_csv(
        doom_root / "us_public_school_spending_vs_naep_2003_2024.csv"
    )
    demographics = pd.read_csv(
        doom_root
        / "us_oasdi_beneficiaries_workers_and_deficit_1945_2100.csv"
    )
    operating_fcf = pd.read_csv(
        doom_root
        / "sharadar_us_operating_company_annual_fcf_margin_2004_2025.csv"
    )
    current_operating_fcf = pd.read_csv(
        doom_root
        / "sharadar_us_operating_company_rolling_4q_fcf_snapshot.csv"
    )
    real_business_productivity = pd.read_csv(
        doom_root / "real_business_productivity_ex_distraction_annual.csv"
    )
    real_business_productivity_summary = json.loads(
        (doom_root / "real_business_productivity_ex_distraction_summary.json").read_text(
            encoding="utf-8"
        )
    )
    common_prosperity_summary = json.loads(
        (doom_root / "common_prosperity_summary.json").read_text(
            encoding="utf-8"
        )
    )
    common_prosperity_housing = pd.read_csv(
        doom_root / "common_prosperity_housing_2000_2026.csv"
    )
    common_prosperity_big_mac = pd.read_csv(
        doom_root / "common_prosperity_big_macs_per_hour_2000_2026.csv"
    )
    common_prosperity_affordability = pd.read_csv(
        doom_root / "common_prosperity_affordability_snapshot.csv"
    )
    common_prosperity_fertility = pd.read_csv(
        doom_root / "common_prosperity_native_completed_fertility_2014_2024.csv"
    )
    common_prosperity_life = pd.read_csv(
        doom_root / "common_prosperity_life_expectancy_2000_2024.csv"
    )
    common_prosperity_suicide = pd.read_csv(
        doom_root / "common_prosperity_suicide_2001_2024.csv"
    )
    common_prosperity_obesity = pd.read_csv(
        doom_root / "common_prosperity_obesity_nhanes.csv"
    )
    operating_fcf["period_type"] = "completed_calendar_year"
    current_fcf = current_operating_fcf.iloc[0]
    operating_fcf = pd.concat(
        [
            operating_fcf,
            pd.DataFrame(
                [
                    {
                        "calendar_year": int(
                            str(current_fcf["as_of_date"])[:4]
                        ),
                        "aggregate_fcf_usd": current_fcf[
                            "aggregate_rolling_4q_fcf_usd"
                        ],
                        "matched_revenue_usd": current_fcf[
                            "aggregate_rolling_4q_revenue_usd"
                        ],
                        "aggregate_fcf_margin": current_fcf[
                            "aggregate_rolling_4q_fcf_margin"
                        ],
                        "companies_with_fcf_and_revenue": current_fcf[
                            "companies_with_four_quarters"
                        ],
                        "company_rows": current_fcf["active_companies"],
                        "superseded_versions_removed": float("nan"),
                        "period_type": "current_rolling_four_quarters",
                    }
                ]
            ),
        ],
        ignore_index=True,
    )

    labor_productivity_quarterly = fred_series("OPHNFB")
    labor_productivity_quarterly["year"] = (
        labor_productivity_quarterly["date"].dt.year
    )
    labor_productivity_quarterly = labor_productivity_quarterly.sort_values(
        "date"
    ).reset_index(drop=True)
    latest_productivity_quarter = labor_productivity_quarterly.iloc[-1]
    previous_productivity_quarter = labor_productivity_quarterly.iloc[-2]
    year_ago_productivity_quarter = labor_productivity_quarterly.iloc[-5]
    latest_productivity_qoq_annualized = (
        float(latest_productivity_quarter["value"])
        / float(previous_productivity_quarter["value"])
    ) ** 4 - 1
    latest_productivity_yoy = (
        float(latest_productivity_quarter["value"])
        / float(year_ago_productivity_quarter["value"])
        - 1
    )
    latest_productivity_quarter_label = (
        f"Q{pd.Timestamp(latest_productivity_quarter['date']).quarter} "
        f"{int(latest_productivity_quarter['year'])}"
    )
    # Calendar-year averages match the annual flow convention used for company
    # FCF and utility capex. Exclude the incomplete current calendar year.
    labor_productivity = (
        labor_productivity_quarterly[
            labor_productivity_quarterly["year"].between(2003, 2025)
        ]
        .groupby("year", as_index=False)["value"]
        .mean()
        .rename(columns={"value": "output_per_hour_index"})
    )
    labor_productivity["annual_growth"] = labor_productivity[
        "output_per_hour_index"
    ].pct_change()
    labor_productivity["five_year_annualized_growth"] = (
        labor_productivity["output_per_hour_index"]
        / labor_productivity["output_per_hour_index"].shift(5)
    ) ** (1 / 5) - 1
    labor_productivity = labor_productivity[
        labor_productivity["year"].between(2004, 2025)
    ].reset_index(drop=True)

    households = fred_series("TTLHH")
    households["year"] = households["date"].dt.year
    households["households"] = households["value"] * 1_000
    households = households[["year", "households"]]

    # Use an actual household-survey mean. Dividing BEA's broad personal-sector
    # aggregate by household count produces a valid macro ratio, but it is not
    # comparable to income reported by a household or consumer unit.
    after_tax_income = fred_series("CXUINCAFTTXLB0101M")
    after_tax_income["year"] = after_tax_income["date"].dt.year
    after_tax_income = after_tax_income[
        after_tax_income["year"].between(2004, 2026)
    ][["year", "value"]].rename(
        columns={"value": "mean_after_tax_income_per_consumer_unit"}
    )
    consumer_units = fred_series("CXUCONSUNITLB0101M")
    consumer_units["year"] = consumer_units["date"].dt.year
    consumer_units["consumer_units"] = consumer_units["value"] * 1_000
    consumer_units = consumer_units[["year", "consumer_units"]]

    obligations = annual[
        [
            "calendar_year",
            "public_debt_trillions",
            "ssa_unfunded_75yr_trillions",
            "medicare_total_resource_gap_75yr_trillions",
            "doom_index_trillions",
        ]
    ].rename(columns={"calendar_year": "year"})
    latest_daily = daily.iloc[-1]
    current_mask = obligations["year"].eq(int(str(latest_daily["date"])[:4]))
    obligations.loc[current_mask, "public_debt_trillions"] = float(
        latest_daily["public_debt_trillions"]
    )
    obligations.loc[current_mask, "ssa_unfunded_75yr_trillions"] = float(
        latest_daily["ssa_unfunded_75yr_trillions"]
    )
    obligations.loc[
        current_mask, "medicare_total_resource_gap_75yr_trillions"
    ] = float(latest_daily["medicare_total_resource_gap_75yr_trillions"])
    obligations.loc[current_mask, "doom_index_trillions"] = float(
        latest_daily["doom_index_trillions"]
    )

    household = obligations.merge(households, on="year", how="left").merge(
        after_tax_income, on="year", how="left"
    )
    latest_household_count = float(households.iloc[-1]["households"])
    household["household_count_status"] = "Census actual"
    household.loc[household["households"].isna(), "households"] = (
        latest_household_count
    )
    household.loc[
        household["year"] > int(households["year"].max()),
        "household_count_status",
    ] = "Latest Census count carried forward"
    latest_income_year = int(after_tax_income["year"].max())
    latest_mean_after_tax_income = float(
        after_tax_income.loc[
            after_tax_income["year"].eq(latest_income_year),
            "mean_after_tax_income_per_consumer_unit",
        ].iloc[0]
    )
    household["income_status"] = "BLS Consumer Expenditure Survey actual"
    household["mean_after_tax_income_per_consumer_unit"] = household[
        "mean_after_tax_income_per_consumer_unit"
    ].fillna(latest_mean_after_tax_income)
    household.loc[
        household["year"] > latest_income_year, "income_status"
    ] = f"Latest BLS actual ({latest_income_year}) carried forward"
    for source, target in [
        ("public_debt_trillions", "public_debt_per_household"),
        ("ssa_unfunded_75yr_trillions", "ssa_unfunded_per_household"),
        (
            "medicare_total_resource_gap_75yr_trillions",
            "medicare_resource_gap_per_household",
        ),
        ("doom_index_trillions", "total_liabilities_per_household"),
    ]:
        household[target] = household[source] * 1e12 / household["households"]
    household["liabilities_to_disposable_income_ratio"] = (
        household["total_liabilities_per_household"]
        / household["mean_after_tax_income_per_consumer_unit"]
    )
    base = household.iloc[0]
    household["liabilities_index_2004"] = (
        household["total_liabilities_per_household"]
        / float(base["total_liabilities_per_household"])
        * 100
    )
    household["income_index_2004"] = (
        household["mean_after_tax_income_per_consumer_unit"]
        / float(base["mean_after_tax_income_per_consumer_unit"])
        * 100
    )

    daily["date"] = pd.to_datetime(daily["date"])
    interest["fiscal_year_end"] = pd.to_datetime(interest["fiscal_year_end"])
    historical_interest = interest.merge(
        daily[
            ["date", "total_netinc_rolling_4q_trillions"]
        ],
        left_on="fiscal_year_end",
        right_on="date",
        how="left",
    )
    historical_interest["interest_to_public_net_income_ratio"] = (
        historical_interest["federal_interest_outlays_trillions"]
        / historical_interest["total_netinc_rolling_4q_trillions"]
    )
    historical_interest["period_type"] = "actual"
    historical_interest = historical_interest.rename(
        columns={
            "fiscal_year": "year",
            "federal_interest_outlays_trillions": "interest_trillions",
            "total_netinc_rolling_4q_trillions": "public_net_income_trillions",
        }
    )[
        [
            "year",
            "interest_trillions",
            "public_net_income_trillions",
            "interest_to_public_net_income_ratio",
            "period_type",
        ]
    ]
    projected_interest = projection.rename(
        columns={
            "projection_year": "year",
            "precise_current_curve_net_interest_trillions": "interest_trillions",
            "us_public_equity_net_income_trillions": "public_net_income_trillions",
            "precise_current_curve_interest_to_public_equity_net_income": (
                "interest_to_public_net_income_ratio"
            ),
        }
    )[
        [
            "year",
            "interest_trillions",
            "public_net_income_trillions",
            "interest_to_public_net_income_ratio",
        ]
    ]
    projected_interest["period_type"] = "projection"
    interest_panel = pd.concat(
        [historical_interest, projected_interest], ignore_index=True
    ).sort_values("year")

    maturity = maturity[maturity["maturity_fiscal_year"].between(2026, 2030)]
    maturity = (
        maturity.pivot_table(
            index="maturity_fiscal_year",
            columns="kind",
            values="principal_trillions",
            aggfunc="sum",
            fill_value=0,
        )
        .reset_index()
        .rename(columns={"maturity_fiscal_year": "year"})
    )
    for column in ["bill", "fixed", "frn", "tips"]:
        if column not in maturity:
            maturity[column] = 0.0
    maturity["total"] = maturity[["bill", "fixed", "frn", "tips"]].sum(axis=1)
    maturity["cumulative_pct"] = (
        maturity["total"].cumsum()
        / float(
            pd.read_csv(
                doom_root / "treasury_mspd_marketable_securities_snapshot.csv"
            )["principal_trillions"].sum()
        )
        * 100
    )

    latest = household.iloc[-1]
    latest_interest = projected_interest.iloc[0]
    # St. Louis Fed/BLS 2023 benchmark. Essentials are food at home,
    # housing, transportation, health care, and personal insurance/pensions.
    discretionary_year = 2023
    mean_discretionary_income = 27_000.0
    benchmark_consumer_units = float(
        consumer_units.loc[
            consumer_units["year"].eq(discretionary_year), "consumer_units"
        ].iloc[0]
    )
    aggregate_discretionary_income_trillions = (
        mean_discretionary_income * benchmark_consumer_units / 1e12
    )
    benchmark_interest = float(
        historical_interest.loc[
            historical_interest["year"].eq(discretionary_year),
            "interest_trillions",
        ].iloc[0]
    )
    current_interest_per_household = (
        float(latest_interest["interest_trillions"]) * 1e12
        / float(latest["households"])
    )
    # Convert the 75-year program funding gaps into a level real annual
    # payment at the Trustees' 2.3% intermediate ultimate real interest rate.
    # This is a derived annual-equivalent burden, not a current cash invoice.
    trustees_real_discount_rate = 0.023
    funding_horizon_years = 75
    annuity_factor = trustees_real_discount_rate / (
        1 - (1 + trustees_real_discount_rate) ** (-funding_horizon_years)
    )
    unfunded_program_pv_trillions = float(
        latest["ssa_unfunded_75yr_trillions"]
        + latest["medicare_total_resource_gap_75yr_trillions"]
    )
    annualized_unfunded_program_cost_trillions = (
        unfunded_program_pv_trillions * annuity_factor
    )
    all_in_annual_burden_trillions = (
        float(latest_interest["interest_trillions"])
        + annualized_unfunded_program_cost_trillions
    )
    federal_receipts_summary["fy2026_receipts_per_household"] = (
        federal_receipts_summary["fy2026_projected_receipts_trillions"]
        * 1e12
        / float(latest["households"])
    )
    federal_receipts_summary["fy2026_interest_share_of_receipts_pct"] = (
        float(latest_interest["interest_trillions"])
        / federal_receipts_summary["fy2026_projected_receipts_trillions"]
        * 100
    )
    federal_receipts_summary["fy2026_corporate_tax_share_pct"] = float(
        federal_receipts_composition.loc[
            federal_receipts_composition["category"].eq(
                "Corporate income taxes"
            ),
            "share_of_total_pct",
        ].iloc[0]
    )
    burden_history = household[
        [
            "year",
            "ssa_unfunded_75yr_trillions",
            "medicare_total_resource_gap_75yr_trillions",
        ]
    ].merge(interest_panel, on="year", how="inner")
    burden_history = burden_history[burden_history["year"].between(2004, 2026)]
    burden_history["unfunded_program_pv_trillions"] = (
        burden_history["ssa_unfunded_75yr_trillions"]
        + burden_history["medicare_total_resource_gap_75yr_trillions"]
    )
    burden_history["annualized_unfunded_program_cost_trillions"] = (
        burden_history["unfunded_program_pv_trillions"] * annuity_factor
    )
    burden_history["all_in_annual_burden_trillions"] = (
        burden_history["interest_trillions"]
        + burden_history["annualized_unfunded_program_cost_trillions"]
    )
    burden_history["annualized_unfunded_to_public_net_income_ratio"] = (
        burden_history["annualized_unfunded_program_cost_trillions"]
        / burden_history["public_net_income_trillions"]
    )
    burden_history["all_in_burden_to_public_net_income_ratio"] = (
        burden_history["all_in_annual_burden_trillions"]
        / burden_history["public_net_income_trillions"]
    )
    nonpositive_income = burden_history["public_net_income_trillions"] <= 0
    burden_history.loc[
        nonpositive_income,
        [
            "interest_to_public_net_income_ratio",
            "annualized_unfunded_to_public_net_income_ratio",
            "all_in_burden_to_public_net_income_ratio",
        ],
    ] = float("nan")
    burden_history = burden_history.rename(
        columns={
            "interest_to_public_net_income_ratio": (
                "explicit_interest_to_public_net_income_ratio"
            )
        }
    )[
        [
            "year",
            "interest_trillions",
            "annualized_unfunded_program_cost_trillions",
            "all_in_annual_burden_trillions",
            "public_net_income_trillions",
            "explicit_interest_to_public_net_income_ratio",
            "annualized_unfunded_to_public_net_income_ratio",
            "all_in_burden_to_public_net_income_ratio",
            "period_type",
        ]
    ]
    utility_base = utility_productivity.iloc[0]
    utility_latest = utility_productivity.iloc[-1]
    education_base = education_productivity.iloc[0]
    education_latest = education_productivity.iloc[-1]
    fcf_latest = operating_fcf.iloc[-1]
    real_business_latest = real_business_productivity.iloc[-1]
    labor_base = labor_productivity.iloc[0]
    labor_latest = labor_productivity.iloc[-1]
    labor_productivity_cagr = (
        float(labor_latest["output_per_hour_index"])
        / float(labor_base["output_per_hour_index"])
    ) ** (
        1 / (int(labor_latest["year"]) - int(labor_base["year"]))
    ) - 1
    productivity_panel = (
        utility_productivity.merge(
            operating_fcf, on="calendar_year", how="outer"
        )
        .merge(
            labor_productivity.rename(columns={"year": "calendar_year"}),
            on="calendar_year",
            how="outer",
        )
        .sort_values("calendar_year")
    )
    demographic_rows = {
        int(row["year"]): row
        for _, row in demographics.iterrows()
    }

    def demographic_value(year: int, column: str) -> float:
        return float(demographic_rows[year][column])

    payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "as_of_date": str(pd.Timestamp(latest_daily["date"]).date()),
        "definitions": {
            "measured_liability_stack": (
                "Gross federal debt plus the OASDI 75-year open-group present-value "
                "shortfall plus Medicare's 75-year government-wide resource gap."
            ),
            "doom_index": (
                "Legacy data-key definition for the measured liability stack; this is "
                "not the new 0–100 Doom Index evidence score."
            ),
            "household_income": (
                "BLS Consumer Expenditure Survey mean after-tax income per consumer "
                "unit. The latest published mean is 2023; BLS could not publish a 2024 "
                "mean because its external tax model was not updated."
            ),
            "ratio": (
                "Liability stock per Census household divided by one year of BLS mean "
                "after-tax income per consumer unit; read as approximate income-years."
            ),
            "discretionary_income": (
                "St. Louis Fed/BLS definition: after-tax income less food at home, "
                "housing, transportation, health care, and personal insurance and "
                "pensions. The latest published benchmark is 2023 and is rounded."
            ),
            "annualized_unfunded_burden": (
                "Derived level real annual payment that amortizes the Social Security "
                "and Medicare 75-year present-value gaps over 75 years at the Trustees' "
                "2.3% intermediate ultimate real interest rate. It is an economic "
                "funding benchmark, not a current legal invoice."
            ),
            "education_productivity": (
                "Census public-school current spending per pupil, deflated by "
                "CPI-U and compared with the equally weighted index of national-"
                "public grade-8 NAEP reading and mathematics scores. Chart values "
                "are normalized to 2003=100 for visual comparison; NAEP scores are "
                "not ratio-scale measures of knowledge, and the relationship is "
                "descriptive rather than a causal estimate of spending efficacy."
            ),
            "demographic_support_ratio": (
                "OASDI beneficiaries in current-payment status on June 30 per "
                "100 people who had OASDI-covered earnings at some point during "
                "the calendar year. OASDI includes old-age, survivor, and "
                "disability beneficiaries; it is broader than pensioners."
            ),
        },
        "latest": {
            "year": int(latest["year"]),
            "households": float(latest["households"]),
            "public_debt_trillions": float(latest["public_debt_trillions"]),
            "ssa_unfunded_75yr_trillions": float(
                latest["ssa_unfunded_75yr_trillions"]
            ),
            "medicare_resource_gap_trillions": float(
                latest["medicare_total_resource_gap_75yr_trillions"]
            ),
            "total_liabilities_trillions": float(latest["doom_index_trillions"]),
            "public_debt_per_household": float(
                latest["public_debt_per_household"]
            ),
            "ssa_unfunded_per_household": float(
                latest["ssa_unfunded_per_household"]
            ),
            "medicare_resource_gap_per_household": float(
                latest["medicare_resource_gap_per_household"]
            ),
            "total_liabilities_per_household": float(
                latest["total_liabilities_per_household"]
            ),
            "mean_after_tax_income_per_consumer_unit": float(
                latest["mean_after_tax_income_per_consumer_unit"]
            ),
            "mean_after_tax_income_year": latest_income_year,
            "median_pretax_household_income": 83730.0,
            "median_post_tax_household_income": 72330.0,
            "median_household_income_year": 2024,
            "liabilities_to_disposable_income_ratio": float(
                latest["liabilities_to_disposable_income_ratio"]
            ),
            "precise_interest_trillions": float(
                latest_interest["interest_trillions"]
            ),
            "public_company_net_income_trillions": float(
                latest_interest["public_net_income_trillions"]
            ),
            "interest_to_public_net_income_ratio": float(
                latest_interest["interest_to_public_net_income_ratio"]
            ),
            "mean_discretionary_income_per_consumer_unit": mean_discretionary_income,
            "discretionary_income_year": discretionary_year,
            "aggregate_discretionary_income_trillions": (
                aggregate_discretionary_income_trillions
            ),
            "benchmark_interest_trillions": benchmark_interest,
            "benchmark_interest_to_discretionary_income_ratio": (
                benchmark_interest / aggregate_discretionary_income_trillions
            ),
            "current_interest_per_household": current_interest_per_household,
            "current_interest_to_discretionary_income_ratio": (
                current_interest_per_household / mean_discretionary_income
            ),
            "trustees_real_discount_rate": trustees_real_discount_rate,
            "funding_horizon_years": funding_horizon_years,
            "unfunded_program_pv_trillions": unfunded_program_pv_trillions,
            "annualized_unfunded_program_cost_trillions": (
                annualized_unfunded_program_cost_trillions
            ),
            "annualized_unfunded_program_cost_per_household": (
                annualized_unfunded_program_cost_trillions
                * 1e12
                / float(latest["households"])
            ),
            "annualized_unfunded_to_public_net_income_ratio": (
                annualized_unfunded_program_cost_trillions
                / float(latest_interest["public_net_income_trillions"])
            ),
            "all_in_annual_burden_trillions": all_in_annual_burden_trillions,
            "all_in_annual_burden_per_household": (
                all_in_annual_burden_trillions
                * 1e12
                / float(latest["households"])
            ),
            "all_in_burden_to_public_net_income_ratio": (
                all_in_annual_burden_trillions
                / float(latest_interest["public_net_income_trillions"])
            ),
            "all_in_burden_to_discretionary_income_ratio": (
                all_in_annual_burden_trillions
                / aggregate_discretionary_income_trillions
            ),
        },
        "household_history": records(household.round(8)),
        "annualized_burden_history": records(burden_history.round(8)),
        "interest_history_and_projection": records(interest_panel.round(8)),
        "maturity_wall": records(maturity.round(8)),
        "cumulative_income_vs_debt": {
            "summary": cumulative_income_debt_summary,
            "history": records(cumulative_income_debt_history),
        },
        "tax_valuation": {
            "tax_summary": tax_stress_summary,
            "tax_scenarios": records(tax_stress_scenarios.round(8)),
            "valuation_summary": valuation_summary,
            "fcf_yield_vs_30y": records(fcf_yield_vs_30y.round(8)),
            "spx_earnings_yield_vs_vclt": records(
                round_numeric(spx_vclt_annual)
            ),
        },
        "federal_receipts": {
            "summary": federal_receipts_summary,
            "history_and_projection": records(federal_receipts.round(8)),
            "fy2026_composition": records(
                federal_receipts_composition.round(8)
            ),
        },
        "sustainability": {
            "summary": sustainability_summary,
            "funding_endpoints": records(
                sustainability_funding.round(8)
            ),
            "tax_mix": records(sustainability_tax_mix.round(8)),
        },
        "growth_escape": {
            "summary": agi_growth_summary,
            "sensitivity": records(agi_growth_sensitivity.round(8)),
        },
        "distraction_economy": {
            "marketcap_summary": distraction_marketcap_summary,
            "fcf_summary": distraction_fcf_summary,
            "attention_summary": distraction_attention_summary,
            "search_attention_summary": distraction_search_attention_summary,
            "marketcap_history": records(distraction_marketcap.round(8)),
            "fcf_history": records(distraction_fcf.round(8)),
            "attention_history": records(distraction_attention.round(8)),
            "search_attention_history": records(
                distraction_search_attention.round(8)
            ),
            "personalization_events": records(distraction_personalization.round(8)),
        },
        "productivity": {
            "summary": {
                "latest_year": int(utility_latest["calendar_year"]),
                "latest_generation_twh": float(
                    utility_latest["generation_twh"]
                ),
                "latest_utility_capex_billions": float(
                    utility_latest["utility_capex_nominal_usd"] / 1e9
                ),
                "latest_real_capex_per_mwh": float(
                    utility_latest["real_2025_capex_per_mwh"]
                ),
                "real_capex_per_mwh_multiple_since_2004": float(
                    utility_latest["real_2025_capex_per_mwh"]
                    / utility_base["real_2025_capex_per_mwh"]
                ),
                "latest_operating_company_fcf_margin": float(
                    fcf_latest["aggregate_fcf_margin"]
                ),
                "latest_real_business_revenue_growth_yoy_pct": float(
                    real_business_latest[
                        "operating_ex_distraction_revenue_growth_yoy_pct"
                    ]
                ),
                "latest_real_business_real_revenue_growth_yoy_pct": float(
                    real_business_latest[
                        "operating_ex_distraction_real_revenue_growth_yoy_pct"
                    ]
                ),
                "latest_real_business_fcf_margin_pct": float(
                    real_business_latest[
                        "operating_ex_distraction_fcf_margin_pct"
                    ]
                ),
                "latest_real_business_operating_cash_flow_margin_pct": float(
                    real_business_latest[
                        "operating_ex_distraction_operating_cash_flow_margin_pct"
                    ]
                ),
                "latest_real_business_fcf_margin_change_yoy_pp": float(
                    real_business_latest[
                        "operating_ex_distraction_fcf_margin_change_yoy_pp"
                    ]
                ),
                "real_business_as_of_date": str(real_business_latest["date"]),
                "real_business_companies_with_shared_rolling_4q": int(
                    real_business_latest[
                        "operating_ex_distraction_companies_with_shared_rolling_4q"
                    ]
                ),
                "current_fcf_as_of_date": str(current_fcf["as_of_date"]),
                "current_fcf_latest_filing": str(
                    current_fcf["latest_filing"]
                ),
                "current_fcf_companies": int(
                    current_fcf["companies_with_four_quarters"]
                ),
                "current_fcf_active_companies": int(
                    current_fcf["active_companies"]
                ),
                "latest_labor_productivity_growth": float(
                    labor_latest["annual_growth"]
                ),
                "latest_labor_productivity_quarter": (
                    latest_productivity_quarter_label
                ),
                "latest_quarter_productivity_growth_annualized": float(
                    latest_productivity_qoq_annualized
                ),
                "latest_quarter_productivity_growth_yoy": float(
                    latest_productivity_yoy
                ),
                "labor_productivity_cagr_since_2004": float(
                    labor_productivity_cagr
                ),
                "latest_public_school_spending_per_pupil": float(
                    education_latest["nominal_current_spending_per_pupil"]
                ),
                "real_public_school_spending_change_since_2003": float(
                    education_latest["real_spending_index_2003"] / 100 - 1
                ),
                "naep_grade8_composite_change_since_2003": float(
                    education_latest["naep_composite_index_2003"] / 100 - 1
                ),
                "naep_grade8_reading_point_change_since_2003": float(
                    education_latest["naep_grade8_reading_score"]
                    - education_base["naep_grade8_reading_score"]
                ),
                "naep_grade8_math_point_change_since_2003": float(
                    education_latest["naep_grade8_mathematics_score"]
                    - education_base["naep_grade8_mathematics_score"]
                ),
            },
            "utility_capex_generation": records(
                utility_productivity.round(8)
            ),
            "operating_company_fcf_margin": records(
                operating_fcf.round(8)
            ),
            "real_business_ex_distraction": {
                "summary": real_business_productivity_summary,
                "annual_history": records(
                    round_numeric(real_business_productivity)
                ),
            },
            "labor_productivity": records(
                labor_productivity.round(8)
            ),
            "education_spending_vs_naep": records(
                education_productivity.round(8)
            ),
            "human_capital_evidence": {
                "grade12_reading_point_change_since_1992": -10.0,
                "grade12_reading_10th_percentile_point_change_since_1992": -24.0,
                "grade12_math_below_basic_pct_2024": 45.0,
                "public_school_graduation_rate_pct_2011_12": 80.0,
                "public_school_graduation_rate_pct_2021_22": 87.0,
                "act_composite_2015": 21.0,
                "act_composite_2025": 19.4,
                "act_school_day_composite_2015": 18.4,
                "act_school_day_composite_2024": 17.8,
                "act_taker_average_gpa_2010": 3.17,
                "act_taker_average_gpa_2021": 3.36,
                "adult_literacy_level1_or_below_pct_2017": 19.0,
                "adult_literacy_level1_or_below_pct_2023": 28.0,
                "chronic_absence_pct_pre_pandemic": 15.0,
                "chronic_absence_pct_2024_25": 23.0,
                "trust_federal_government_pct_2025": 17.0,
                "big_tech_new_grad_share_pct_2024": 7.0,
                "tech_major_entry_level_hiring_change_since_2019_pct": -65.0,
                "early_stage_startup_entry_level_hiring_change_since_2019_pct": -76.0,
                "top20_cs_tech_major_placement_change_2025_vs_2022_pct": -45.0,
                "tech_hiring_definition": (
                    "SignalFire proprietary Beacon AI estimates derived from "
                    "professional-profile and organization data. Its 2025 Big "
                    "Tech universe contains the top 15 technology companies by "
                    "market capitalization; its 2026 Tech Majors universe contains "
                    "12 named companies. The series measures employer demand and "
                    "career transitions, not graduate quality alone."
                ),
                "medicare_improper_payments_billions_fy2025": 56.73,
                "medicare_ffs_improper_payment_rate_pct_fy2025": 6.55,
                "medicare_improper_payment_definition": (
                    "CMS explicitly says improper payments are not a fraud "
                    "measure. They include overpayments, underpayments, missing "
                    "documentation, coding errors, and administrative failures."
                ),
            },
            "combined_annual_panel": records(
                productivity_panel.round(8)
            ),
        },
        "common_prosperity": {
            "summary": common_prosperity_summary,
            "housing_history": records(round_numeric(common_prosperity_housing)),
            "big_mac_history": records(round_numeric(common_prosperity_big_mac)),
            "affordability_snapshot": records(
                round_numeric(common_prosperity_affordability)
            ),
            "native_completed_fertility": records(
                round_numeric(common_prosperity_fertility)
            ),
            "life_expectancy": records(round_numeric(common_prosperity_life)),
            "suicide": records(round_numeric(common_prosperity_suicide)),
            "obesity": records(round_numeric(common_prosperity_obesity)),
        },
        "demographics": {
            "summary": {
                "workers_per_beneficiary_1945": demographic_value(
                    1945, "workers_per_oasdi_beneficiary"
                ),
                "workers_per_beneficiary_1960": demographic_value(
                    1960, "workers_per_oasdi_beneficiary"
                ),
                "workers_per_beneficiary_2025": demographic_value(
                    2025, "workers_per_oasdi_beneficiary"
                ),
                "workers_per_beneficiary_2036": demographic_value(
                    2036, "workers_per_oasdi_beneficiary"
                ),
                "beneficiaries_per_100_workers_1945": demographic_value(
                    1945, "oasdi_beneficiaries_per_100_workers"
                ),
                "beneficiaries_per_100_workers_1960": demographic_value(
                    1960, "oasdi_beneficiaries_per_100_workers"
                ),
                "beneficiaries_per_100_workers_2025": demographic_value(
                    2025, "oasdi_beneficiaries_per_100_workers"
                ),
                "beneficiaries_per_100_workers_2036": demographic_value(
                    2036, "oasdi_beneficiaries_per_100_workers"
                ),
                "deficit_pct_gdp_1945": demographic_value(
                    1945, "federal_deficit_pct_gdp"
                ),
                "deficit_pct_gdp_2020": demographic_value(
                    2020, "federal_deficit_pct_gdp"
                ),
                "deficit_pct_gdp_2025": demographic_value(
                    2025, "federal_deficit_pct_gdp"
                ),
                "deficit_pct_gdp_2026": demographic_value(
                    2026, "federal_deficit_pct_gdp"
                ),
                "deficit_pct_gdp_2036": demographic_value(
                    2036, "federal_deficit_pct_gdp"
                ),
                "gross_debt_pct_gdp_1945": demographic_value(
                    1945, "gross_federal_debt_pct_gdp"
                ),
                "gross_debt_pct_gdp_1960": demographic_value(
                    1960, "gross_federal_debt_pct_gdp"
                ),
                "gross_debt_pct_gdp_2000": demographic_value(
                    2000, "gross_federal_debt_pct_gdp"
                ),
                "gross_debt_pct_gdp_2020": demographic_value(
                    2020, "gross_federal_debt_pct_gdp"
                ),
                "gross_debt_pct_gdp_2025": demographic_value(
                    2025, "gross_federal_debt_pct_gdp"
                ),
            },
            "history_and_projection": records(demographics.round(8)),
            "comparison_years": records(
                demographics[
                    demographics["year"].isin([1945, 1960, 2000, 2020, 2025])
                ].round(8)
            ),
        },
        "sources": [
            {
                "name": "Bloomberg public debt",
                "reference": "PUBLDEBT Index / PX_LAST",
            },
            {
                "name": "Social Security Trustees",
                "url": "https://www.ssa.gov/oact/TR/2026/IV_B_LRest.html",
            },
            {
                "name": "Social Security covered workers and beneficiaries",
                "url": "https://www.ssa.gov/oact/TR/2026/lr4b4.html",
            },
            {
                "name": "OMB/FRED federal surplus or deficit as a share of GDP",
                "url": "https://fred.stlouisfed.org/series/FYFSDFYGDP",
            },
            {
                "name": "OMB/FRED gross federal debt as a share of GDP",
                "url": "https://fred.stlouisfed.org/series/GFDGDPA188S",
            },
            {
                "name": "CBO 2026–2036 budget outlook",
                "url": "https://www.cbo.gov/publication/62105",
            },
            {
                "name": "Social Security program history",
                "url": "https://www.ssa.gov/history/1940.html",
            },
            {
                "name": "Medicare Trustees",
                "url": "https://www.cms.gov/oact/tr/2026",
            },
            {
                "name": "Census total households",
                "url": "https://fred.stlouisfed.org/series/TTLHH",
            },
            {
                "name": "BLS mean after-tax income per consumer unit",
                "url": "https://fred.stlouisfed.org/series/CXUINCAFTTXLB0101M",
            },
            {
                "name": "Census 2024 median household income before and after tax",
                "url": "https://www.census.gov/library/publications/2025/demo/p60-286.html",
            },
            {
                "name": "St. Louis Fed discretionary-income benchmark",
                "url": "https://www.stlouisfed.org/open-vault/2025/aug/primer-discretionary-income",
            },
            {
                "name": "Treasury MSPD",
                "url": "https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/",
            },
            {
                "name": "CBO Budget and Economic Outlook",
                "url": "https://www.cbo.gov/publication/61882",
            },
            {
                "name": "Sharadar fundamentals",
                "reference": "Local SF1 ARQ point-in-time four-quarter reconstruction",
            },
            {
                "name": "EIA total U.S. electricity generation",
                "url": "https://www.eia.gov/totalenergy/data/monthly/",
            },
            {
                "name": "BLS nonfarm-business labor productivity",
                "url": "https://fred.stlouisfed.org/series/OPHNFB",
            },
            {
                "name": "Census public-school current spending per pupil",
                "url": "https://www.census.gov/programs-surveys/school-finances/data/tables.html",
            },
            {
                "name": "NAEP national public grade-8 reading and mathematics",
                "url": "https://www.nationsreportcard.gov/api_documentation.aspx",
            },
            {
                "name": "NAEP 2024 grade-12 reading and mathematics",
                "url": "https://www.nationsreportcard.gov/reports/reading/2024/g12/national-trends/",
            },
            {
                "name": "NCES PIAAC 2023 national adult skills",
                "url": "https://nces.ed.gov/surveys/piaac/2023/national_results.asp",
            },
            {
                "name": "NCES public high-school graduation rates",
                "url": "https://nces.ed.gov/programs/coe/indicator/coi/high-school-graduation",
            },
            {
                "name": "ACT 2025 graduating-class results",
                "url": "https://www.act.org/content/dam/act/unsecured/documents/2025-ACT-Graduating-Class-Infographic.pdf",
            },
            {
                "name": "ACT graduating-class participation analysis",
                "url": "https://www.act.org/content/dam/act/unsecured/documents/interpreting-graduating-class-data-2024.pdf",
            },
            {
                "name": "ACT high-school grade-inflation study",
                "url": "https://industryinsights.act.org/2022/05/grade-inflation-past-decade",
            },
            {
                "name": "SignalFire State of Tech Talent 2025",
                "url": "https://www.signalfire.com/blog/signalfire-state-of-talent-report-2025",
            },
            {
                "name": "SignalFire State of Tech Talent 2026",
                "url": "https://www.signalfire.com/blog/signalfire-state-of-talent-report-2026",
            },
            {
                "name": "Education Recovery Scorecard 2026",
                "url": "https://www.gse.harvard.edu/ideas/news/26/05/new-education-scorecard-finds-u-shaped-recovery",
            },
            {
                "name": "Pew public trust in government, 1958–2025",
                "url": "https://www.pewresearch.org/politics/2025/12/04/public-trust-in-government-1958-2025/",
            },
            {
                "name": "CMS FY2025 improper payments fact sheet",
                "url": "https://www.cms.gov/newsroom/fact-sheets/fiscal-year-2025-improper-payments-fact-sheet",
            },
            {
                "name": "Sharadar utility capex and operating-company FCF",
                "reference": (
                    "Local SF1 ARY, latest restatement per ticker and calendar "
                    "period; U.S. domestic common stocks including delisted names"
                ),
            },
            {
                "name": "Sharadar real-business productivity bridge",
                "reference": (
                    "Local SF1 ARQ replayed point in time by datekey; U.S. domestic "
                    "common stocks excluding GLM 5.2 distraction scores >=70, with "
                    "Financial Services and Utilities excluded from the primary FCF cut"
                ),
            },
            {
                "name": "Freddie Mac 30-year mortgage rate",
                "url": "https://fred.stlouisfed.org/series/MORTGAGE30US",
            },
            {
                "name": "Census/HUD median new-house sale price",
                "url": "https://fred.stlouisfed.org/series/MSPUS",
            },
            {
                "name": "Census median personal and household income",
                "url": "https://fred.stlouisfed.org/series/MEPAINUSA646N",
            },
            {
                "name": "BLS median usual weekly nominal earnings",
                "url": "https://fred.stlouisfed.org/series/LES1252881500Q",
            },
            {
                "name": "The Economist Big Mac data",
                "url": "https://github.com/TheEconomist/big-mac-data",
            },
            {
                "name": "iShares IWM current holdings",
                "url": "https://www.ishares.com/us/products/239710/ishares-russell-2000-etf",
            },
            {
                "name": "Census CPS completed fertility by nativity",
                "url": "https://www.census.gov/data/tables/2024/demo/fertility/women-fertility.html",
            },
            {
                "name": "CDC suicide trends, 2001–2024",
                "url": "https://www.cdc.gov/suicide/data/index.html",
            },
            {
                "name": "CDC measured adult obesity history",
                "url": "https://www.cdc.gov/nchs/data/hestat/hestat111.htm",
            },
            {
                "name": "CDC 2024 life expectancy",
                "url": "https://www.cdc.gov/nchs/products/databriefs/db548.htm",
            },
            {
                "name": "Harvard 2026–27 undergraduate tuition",
                "url": "https://college.harvard.edu/financial-aid/how-aid-works",
            },
            {
                "name": "Penn 2026–27 undergraduate tuition",
                "url": "https://srfs.upenn.edu/costs-budgeting/undergraduate-tuition-and-fees",
            },
            {
                "name": "IRS historical federal corporation tax rates",
                "url": "https://www.irs.gov/statistics/soi-tax-stats-historical-table-24",
            },
            {
                "name": "CBO Budget and Economic Outlook: 2026 to 2036",
                "url": "https://www.cbo.gov/publication/62105",
            },
            {
                "name": "IMF World Economic Outlook Update, July 2026",
                "url": "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
            },
            {
                "name": "World Bank Global Economic Prospects, June 2026",
                "url": "https://www.worldbank.org/en/news/press-release/2026/06/11/global-economic-prospects-june-2026-press-release",
            },
            {
                "name": "CBO economic effects of financing a permanent spending increase",
                "url": "https://www.cbo.gov/publication/57021",
            },
            {
                "name": "OMB total federal receipts and outlays",
                "url": "https://fred.stlouisfed.org/series/FYFR",
            },
            {
                "name": "Bloomberg equity and fixed-income valuation",
                "reference": (
                    "SPX Index BEST_PE_RATIO; VCLT US Equity "
                    "YAS_BOND_YLD; USGG30YR Index PX_LAST"
                ),
            },
        ],
    }
    payload["doom_index_score"] = json.loads(
        (doom_root / "doom_index_research_score.json").read_text()
    )
    payload["productivity_escape_forecast"] = json.loads(
        (doom_root / "productivity_escape_forecast_summary.json").read_text()
    )
    return payload


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--doom-data-root",
        type=Path,
        default=Path("/home/pfrpc/repos/data/doom_thesis"),
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "static" / "doom-thesis",
    )
    args = parser.parse_args()
    payload = build_payload(args.doom_data_root)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    (args.output_dir / "data.json").write_text(
        json.dumps(payload, indent=2) + "\n", encoding="utf-8"
    )
    llm_document = build_llm_document(payload)
    static_root = args.output_dir.parent
    (static_root / "doom-thesis.txt").write_text(
        llm_document, encoding="utf-8"
    )
    (static_root / "llms.txt").write_text(
        "# goodalexander.com\n\n"
        "## Primary research\n\n"
        "- [Doom Thesis — machine-readable edition]"
        "(https://goodalexander.com/doom-thesis.txt): "
        "A sourced fiscal, corporate-income, productivity, and valuation "
        "analysis of U.S. public debt and unfunded federal programs.\n\n"
        "- [Doom Thesis — interactive page]"
        "(https://goodalexander.com/doom-thesis/)\n",
        encoding="utf-8",
    )
    history = payload["household_history"]
    with (args.output_dir / "household-liabilities.csv").open(
        "w", newline="", encoding="utf-8"
    ) as handle:
        writer = csv.DictWriter(handle, fieldnames=history[0].keys())
        writer.writeheader()
        writer.writerows(history)
    productivity = payload["productivity"]["combined_annual_panel"]
    with (args.output_dir / "productivity.csv").open(
        "w", newline="", encoding="utf-8"
    ) as handle:
        writer = csv.DictWriter(handle, fieldnames=productivity[0].keys())
        writer.writeheader()
        writer.writerows(productivity)
    pd.read_csv(
        args.doom_data_root
        / "us_public_school_spending_vs_naep_2003_2024.csv"
    ).to_csv(
        args.output_dir / "education-spending-vs-naep.csv", index=False
    )
    pd.read_csv(
        args.doom_data_root
        / "real_business_productivity_ex_distraction_daily.csv"
    ).to_csv(
        args.output_dir
        / "real-business-productivity-ex-distraction-daily.csv",
        index=False,
    )
    pd.read_csv(
        args.doom_data_root
        / "google_trends_ai_porn_best_colleges_trade_school_worldwide_weekly.csv"
    ).to_csv(
        args.output_dir / "search-attention-allocation-weekly.csv",
        index=False,
    )
    pd.read_csv(
        args.doom_data_root
        / "us_oasdi_beneficiaries_workers_and_deficit_1945_2100.csv"
    ).to_csv(
        args.output_dir / "demographics-support-ratio.csv", index=False
    )
    cumulative_source = (
        args.doom_data_root
        / "us_public_company_cumulative_net_income_vs_debt_accrued_daily_2000_2026.csv"
    )
    pd.read_csv(cumulative_source).to_csv(
        args.output_dir / "cumulative-income-vs-debt-daily.csv", index=False
    )
    pd.read_csv(
        args.doom_data_root / "corporate_tax_stress_scenario.csv"
    ).to_csv(args.output_dir / "corporate-tax-stress.csv", index=False)
    pd.read_csv(
        args.doom_data_root
        / "operating_company_fcf_yield_vs_30y_daily_2004_2026.csv"
    ).to_csv(
        args.output_dir / "operating-fcf-yield-vs-30y-daily.csv", index=False
    )
    pd.read_csv(
        args.doom_data_root
        / "spx_forward_earnings_yield_vs_vclt_monthly_2018_2026.csv"
    ).to_csv(
        args.output_dir / "spx-earnings-yield-vs-vclt-monthly.csv", index=False
    )
    pd.read_csv(
        args.doom_data_root / "us_federal_total_receipts_fy2004_2030.csv"
    ).to_csv(args.output_dir / "federal-receipts.csv", index=False)
    pd.read_csv(
        args.doom_data_root / "fiscal_sustainability_funding_scenarios.csv"
    ).to_csv(
        args.output_dir / "fiscal-sustainability-scenarios.csv", index=False
    )
    pd.read_csv(
        args.doom_data_root / "fiscal_sustainability_tax_mix.csv"
    ).to_csv(args.output_dir / "fiscal-sustainability-tax-mix.csv", index=False)
    pd.read_csv(
        args.doom_data_root / "agi_growth_escape_sensitivity.csv"
    ).to_csv(args.output_dir / "agi-growth-escape-sensitivity.csv", index=False)
    common_downloads = {
        "common_prosperity_housing_2000_2026.csv": "common-prosperity-housing.csv",
        "common_prosperity_big_macs_per_hour_2000_2026.csv": "common-prosperity-big-macs.csv",
        "common_prosperity_affordability_snapshot.csv": "common-prosperity-affordability.csv",
        "common_prosperity_native_completed_fertility_2014_2024.csv": "common-prosperity-native-fertility.csv",
        "common_prosperity_life_expectancy_2000_2024.csv": "common-prosperity-life-expectancy.csv",
        "common_prosperity_suicide_2001_2024.csv": "common-prosperity-suicide.csv",
        "common_prosperity_obesity_nhanes.csv": "common-prosperity-obesity.csv",
    }
    for source_name, output_name in common_downloads.items():
        pd.read_csv(args.doom_data_root / source_name).to_csv(
            args.output_dir / output_name, index=False
        )
    print(json.dumps(payload["latest"], indent=2))


if __name__ == "__main__":
    main()
