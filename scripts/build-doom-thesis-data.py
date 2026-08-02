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
        },
        "household_history": records(household.round(8)),
        "interest_history_and_projection": records(interest_panel.round(8)),
        "maturity_wall": records(maturity.round(8)),
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
    print(json.dumps(payload["latest"], indent=2))


if __name__ == "__main__":
    main()
