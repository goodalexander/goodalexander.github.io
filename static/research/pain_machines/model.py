#!/usr/bin/env python3
"""
Pain Machines — hedonic vs suffering state-space estimator.

Defines pleasure and pain as explicit cross-products of documented axes.
Pleasure applies a pharmacological quotient (receptor-class collapse).
Pain applies no collapse — identity map — per clinical heterogeneity.

  python model.py
  python model.py --profile liberal --json
"""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from math import log10, prod
from typing import Literal

Profile = Literal["conservative", "central", "liberal"]


@dataclass(frozen=True)
class Axis:
    name: str
    levels: int
    source: str


@dataclass(frozen=True)
class ProfileSpec:
    name: Profile
    pleasure_intensity: int
    pleasure_duration: int
    pleasure_modality: int
    pain_mechanism: int
    pain_location: int
    pain_appraisal: int
    pain_social: int
    pain_temporal: int
    pain_identity: int
    pain_agency: int
    pain_episodic: int


PROFILES: dict[Profile, ProfileSpec] = {
    "conservative": ProfileSpec(
        "conservative", 3, 3, 4, 4, 8, 4, 3, 3, 3, 3, 4,
    ),
    "central": ProfileSpec(
        "central", 5, 4, 6, 6, 12, 5, 4, 4, 4, 4, 6,
    ),
    "liberal": ProfileSpec(
        "liberal", 7, 5, 8, 8, 16, 6, 5, 5, 5, 5, 8,
    ),
}

# Berridge & Kringelbach (2015); Leknes & Tracey (2008).
MODALITY_TO_RECEPTOR: dict[int, str] = {
    0: "dopaminergic",
    1: "dopaminergic",
    2: "opioidergic",
    3: "oxytocinergic",
    4: "mixed",
    5: "opioidergic",
    6: "dopaminergic",
    7: "mixed",
}


def pleasure_axes(spec: ProfileSpec) -> list[Axis]:
    return [
        Axis("intensity_jnd_bins", spec.pleasure_intensity, "Weber-Fechner JND bins"),
        Axis("duration_regime", spec.pleasure_duration, "acute / session / day / sustained"),
        Axis("modality", spec.pleasure_modality, "consumption, achievement, touch, social, aesthetic, relief"),
    ]


def pain_axes(spec: ProfileSpec) -> list[Axis]:
    return [
        Axis("somatic_mechanism", spec.pain_mechanism, "IASP 2021 mechanism taxonomy"),
        Axis("location", spec.pain_location, "regional somatic / visceral map"),
        Axis("cognitive_appraisal", spec.pain_appraisal, "Lazarus appraisal families"),
        Axis("social_field", spec.pain_social, "alone / intimate / professional / public"),
        Axis("temporality", spec.pain_temporal, "acute / recurrent / chronic / dread"),
        Axis("identity_salience", spec.pain_identity, "peripheral / personal / reputation / core self"),
        Axis("agency_attribution", spec.pain_agency, "self / other / system / fate / ambiguous"),
        Axis("episodic_embedding", spec.pain_episodic, "Melzack neuromatrix: pain bound to life-episode type"),
    ]


def build_trace(axes: list[Axis], key: str = "running_product") -> tuple[int, list[dict]]:
    running = 1
    trace: list[dict] = []
    for axis in axes:
        running *= axis.levels
        trace.append(
            {
                "axis": axis.name,
                "levels": axis.levels,
                key: running,
                "source": axis.source,
            }
        )
    return running, trace


def receptor_quotient_levels(modality_count: int) -> int:
    classes = {MODALITY_TO_RECEPTOR[i % len(MODALITY_TO_RECEPTOR)] for i in range(modality_count)}
    return len(classes)


def pleasure_analysis(spec: ProfileSpec) -> dict:
    axes = pleasure_axes(spec)
    raw, trace = build_trace(axes, "running_raw")
    collapsed = receptor_quotient_levels(spec.pleasure_modality)
    effective = spec.pleasure_intensity * spec.pleasure_duration * collapsed
    trace.append(
        {
            "axis": "pharmacological_quotient",
            "levels": collapsed,
            "running_raw": effective,
            "source": "Receptor-class collapse: synthetic agonists interchange within class",
        }
    )
    return {
        "axes": [asdict(a) for a in axes],
        "raw_cartesian_states": raw,
        "effective_states_after_quotient": effective,
        "quotient_map": MODALITY_TO_RECEPTOR,
        "build_trace": trace,
    }


def pain_analysis(spec: ProfileSpec) -> dict:
    axes = pain_axes(spec)
    states, trace = build_trace(axes)
    return {
        "axes": [asdict(a) for a in axes],
        "distinguishable_states": states,
        "collapse_function": "identity",
        "build_trace": trace,
    }


def independent_checks() -> dict:
    return {
        "mcgill_pain_questionnaire_descriptor_count": 78,
        "fda_analgesic_anxiolytic_dopaminergic_sku_classes": 11,
        "ratio_from_descriptor_inventory": round(78 / 11, 2),
    }


def analyze(profile: Profile) -> dict:
    spec = PROFILES[profile]
    pleasure = pleasure_analysis(spec)
    pain = pain_analysis(spec)
    p_eff = pleasure["effective_states_after_quotient"]
    n_states = pain["distinguishable_states"]
    ratio = n_states / max(p_eff, 1)
    return {
        "model": "pain_machines_state_space_v1",
        "profile": profile,
        "spec": asdict(spec),
        "pleasure": pleasure,
        "pain": pain,
        "comparison": {
            "pain_over_pleasure_ratio": ratio,
            "log10_orders_of_magnitude": round(log10(ratio), 2),
            "log2_entropy_bits_gap": round(
                (n_states.bit_length() - 1) - (p_eff.bit_length() - 1), 2
            ),
        },
        "independent_checks": independent_checks(),
        "claim": (
            "Original Sin mislabels the bug. The spec ships high-cardinality suffering "
            "and low-cardinality pleasure that collapses under pharmacological equivalence."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile", choices=PROFILES.keys(), default="central")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    result = analyze(args.profile)
    if args.json:
        print(json.dumps(result, indent=2))
        return
    print(json.dumps(result["comparison"], indent=2))


if __name__ == "__main__":
    main()
