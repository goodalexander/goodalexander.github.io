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
    operating_fcf = pd.read_csv(
        doom_root
        / "sharadar_us_operating_company_annual_fcf_margin_2004_2025.csv"
    )
    current_operating_fcf = pd.read_csv(
        doom_root
        / "sharadar_us_operating_company_rolling_4q_fcf_snapshot.csv"
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
    fcf_latest = operating_fcf.iloc[-1]
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
    payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "as_of_date": str(pd.Timestamp(latest_daily["date"]).date()),
        "definitions": {
            "doom_index": (
                "Gross federal debt plus the OASDI 75-year open-group present-value "
                "shortfall plus Medicare's 75-year government-wide resource gap."
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
                spx_vclt_annual.round(8)
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
            },
            "utility_capex_generation": records(
                utility_productivity.round(8)
            ),
            "operating_company_fcf_margin": records(
                operating_fcf.round(8)
            ),
            "labor_productivity": records(
                labor_productivity.round(8)
            ),
            "combined_annual_panel": records(
                productivity_panel.round(8)
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
                "name": "Sharadar utility capex and operating-company FCF",
                "reference": (
                    "Local SF1 ARY, latest restatement per ticker and calendar "
                    "period; U.S. domestic common stocks including delisted names"
                ),
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
    print(json.dumps(payload["latest"], indent=2))


if __name__ == "__main__":
    main()
