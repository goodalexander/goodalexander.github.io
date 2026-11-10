---
title: "TSLA short: the equity book’s shared hedge"
date: 2026-11-10T11:00:00Z
draft: true
type: trade-ideas
description: "The equity book holds a 12.5% short target in Tesla. Its accepted financial model puts the scenario-weighted target at $347.01."
instrument: "Tesla, Inc. (xyz:TSLA)"
direction: "SHORT — a hedge in the current equity book"
book: "Equity long/short (coverage equity fixed clip, version 3)"
source_note: "Book decision 9 November 2026; signal generated 2026-11-09T13:15:19.357673+00:00. Model source date 9 November 2026. Published 10 November 2026."
source_warning: "The daily diligence snapshot reported a catalog reader expecting version 2 while this signal is version 3. This page follows the actual version 3 signal; it does not resolve that separate catalog warning."
model_name: "TSLA"
model_url: "https://tasknode.postfiat.org/api/research/bundles/ga-models/index.html#m=TSLA&tab=summary"
navcoin: tsla_example
eligibility: tsla-short-2026-11-10
---

## The trade idea

The equity book’s Tesla exposure is **short, with a target weight of −0.125 (12.5%)**. Tesla is the common hedge in five active long clips: EWY, SK hynix, Samsung, Cerebras and Strategy. This is the book’s existing hedge exposure, not a new standalone order or a claim about an executed position. The book publishes weights and has no dollar NAV attached.

The matching financial model’s scenario-weighted price target is **$347.01**, with scenario low and high values of **$229.31** and **$442.90**. These are the model’s calculated values as of **2026-11-09**, not a live quote. The wide scenario range leaves room for a substantial move against a short. A change in the underlying long clips or Tesla’s earnings assumptions would require reviewing the hedge again.

## Matching model evidence

The source model is published, its required checks pass, and it has no withheld outputs. Engine version: **0.3.0**. Exact output version:

`sha256:838b4d265470f8e23ee3a8be62e1bf1ab3f8fd997c87d5f7683c5ba4852593af`

[Read the dated evidence record](/evidence/tsla-2026-11-10.json). Subscribers can retrieve the matching model through `GET https://api.corbanu.com/v1/company-models/TSLA/outputs`; the response includes the source date and content version. [API documentation and current monthly price](/api/).

This page records a dated book signal and its financial model. It does not report trade performance or a completed trade.

## Purchase status

**Buy remains disabled until sprint 7’s NAVCoin purchase route is live.** No coin, NAV, fee or proof is attached to this idea. Connecting a wallet only requests its address; it does not buy, sign or pay for anything.
