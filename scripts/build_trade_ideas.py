#!/usr/bin/env python3
"""Generate trade-idea pages from published company model cards.

Source of truth is each model's own `model_card.json` in the company-models
release checkout. Only completed, non-provisional cards with a price, a price
target and an upside are used.

This script publishes MODEL OUTPUT ONLY. It never reads, derives or prints a
book weight, a target weight, a strategy id, an account, an order or a position.
Those belong to the trading books and are not public. A page produced here says
what the model thinks a company is worth; it does not say what anyone owns.
"""
from __future__ import annotations

import argparse
import datetime as dt
import html as _html
import json
import pathlib
import re

SITE = pathlib.Path(__file__).resolve().parent.parent
MODELS = pathlib.Path("/home/postfiat/repos/navstrategies-company-models-release/research/company_models")
OUT = SITE / "content" / "trade-ideas"
DATA = SITE / "data" / "trade_ideas.json"

# Fields we are willing to publish. Anything not named here is dropped, so a
# future field added upstream cannot leak onto the site by default.
PUBLISH = (
    "ticker", "name", "asof", "currency", "price", "price_target", "upside",
    "scenario_low", "scenario_high", "scenario_prob_up", "sim_prob_up",
    "valuation_method", "valuation_method_label",
)
# Markers of an actual data leak, not English words. The prose deliberately uses
# "position" to say a position is NOT disclosed, so matching the bare word here
# would reject the very disclaimer that makes the page safe.
FORBIDDEN = (
    "target_weight", "strategy_id", "account_hash", "account number",
    "xyz:",            # internal instrument ids used by the trading books
    "book weight", "target weight", "coverage equity",
)
FORBIDDEN_PATTERNS = (
    r"weight[^a-z0-9]{0,3}-?\d",   # "weight: -0.125"
    r"-?0\.\d+\s*\(\d+(\.\d+)?%\)",  # "-0.125 (12.5%)"
)

# An independent review (2026-11-10) established that a name-only allowlist plus a
# token denylist is not a confidentiality boundary: a model card's free-text method
# label containing "current holding 250 shares; portfolio allocation 12%" published
# verbatim, and HTML-entity encoding slipped a literal forbidden token past the raw
# scan. Two corrections follow.
#
# 1. Text that reaches a public page must match a SHAPE, not merely avoid bad words.
#    Anything outside the shape is refused, never truncated or sanitised, because a
#    sanitiser that half-works publishes the half it missed.
SAFE_TEXT = {
    # field: (max length, permitted character class)
    "name": (64, r"[A-Za-z0-9 .,&'\-/()]+"),
    # Bloomberg form, e.g. "TSLA US Equity" / "005930 KS Equity": mixed case, spaces.
    "ticker": (28, r"[A-Za-z0-9. \-]+"),
    "valuation_method_label": (32, r"[A-Za-z0-9 /%\-]+"),
    "valuation_method": (32, r"[A-Za-z0-9 /%\-_]+"),
    "currency": (8, r"[A-Z]+"),
    "asof": (10, r"[0-9\-]+"),
}
# 2. Words that have no business in a FREE-TEXT field, checked after entity-decoding
#    and case-folding. Deliberately NOT applied to `name`, `ticker`, `currency` or
#    `asof`: those are bounded registry values, and real companies are called
#    Lumentum Holdings and Strategy. Applying it there dropped both.
FREE_TEXT_FIELDS = ("valuation_method_label", "valuation_method")
DISCLOSURE_WORDS = (
    "holding", "allocation", "portfolio", "shares", "strategy", "weight",
    "exposure", "hedge", "clip", "book", "order", "fill", "nav of",
)

API_DOC = "/api/"
HUB = "https://tasknode.postfiat.org/api/research/bundles/ga-models/index.html"


def slug(ticker: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", ticker.lower()).strip("-")


def load_cards() -> list[dict]:
    cards = []
    for path in sorted(MODELS.glob("*/model_card.json")):
        try:
            raw = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if raw.get("status") != "complete" or raw.get("provisional"):
            continue
        if raw.get("price") in (None, 0) or not raw.get("price_target"):
            continue
        if raw.get("upside") is None:
            continue
        card = {k: raw.get(k) for k in PUBLISH}
        bad = text_shape_problem(card)
        if bad:
            print("SKIPPED %s: %s" % (raw.get("ticker"), bad))
            continue
        cards.append(card)
    return cards


def text_shape_problem(card: dict) -> str | None:
    """Refuse a card whose published text leaves the permitted shape. Returns the
    reason, or None when every field is safe. Refusal drops that one idea; it never
    rewrites the text, because a partial scrub publishes what it missed."""
    for field, (limit, pattern) in SAFE_TEXT.items():
        value = card.get(field)
        if value is None:
            continue
        text = str(value)
        if len(text) > limit:
            return "%s is %d characters, over the %d limit" % (field, len(text), limit)
        if not re.fullmatch(pattern, text):
            return "%s leaves the permitted character shape: %r" % (field, text[:60])
        if field in FREE_TEXT_FIELDS:
            decoded = _html.unescape(text).casefold()
            for word in DISCLOSURE_WORDS:
                if word in decoded:
                    return "%s contains the disclosure word %r" % (field, word)
    return None


def prob_phrase(value) -> str:
    """Never assert certainty. A coarse 0 or 1 becomes a bound, not an absolute."""
    p = float(value) * 100
    if p <= 1:
        return "under 1%"
    if p >= 99:
        return "over 99%"
    return f"{p:.0f}%"


def pct(value: float) -> str:
    return f"{value * 100:+.1f}%" if abs(value) < 5 else f"{value:+.1f}%"


def money(value, currency: str | None) -> str:
    if value is None:
        return "n/a"
    sym = {"USD": "$", "JPY": "¥", "KRW": "₩", "TWD": "NT$", "EUR": "€"}.get((currency or "").upper(), "")
    return f"{sym}{value:,.2f}"


def page(card: dict, rank: int, total: int) -> str:
    up = float(card["upside"])
    direction = "LONG" if up > 0 else "SHORT"
    ticker = card["ticker"]
    short = ticker.split()[0]
    cur = card.get("currency")
    method = card.get("valuation_method_label") or card.get("valuation_method") or "the model's stated method"
    # scenario_prob_up is coarse and can be a literal 0 or 1. Printing "0%" would
    # assert impossibility the model does not claim, so prefer the finer simulated
    # field and never render an absolute 0% or 100%.
    prob = card.get("sim_prob_up")
    if prob is None:
        prob = card.get("scenario_prob_up")
    lo, hi = card.get("scenario_low"), card.get("scenario_high")

    head = [
        "---",
        f'title: "{short} {direction.lower()}: model target {money(card["price_target"], cur)}"',
        f"date: {card['asof']}T12:00:00Z",
        "draft: false",
        "type: trade-ideas",
        f'description: "The accepted financial model for {card.get("name", short)} puts the target at '
        f'{money(card["price_target"], cur)} against {money(card["price"], cur)}, {pct(up)}."',
        f'instrument: "{card.get("name", short)} ({ticker})"',
        f'direction: "{direction} — model-implied, not a position"',
        f'model_name: "{short}"',
        f'model_url: "{HUB}#m={short}&tab=summary"',
        f"model_upside: {up}",
        f"model_rank: {rank}",
        f'source_note: "Model output as of {card["asof"]}. Published from the accepted model card. '
        'No holding, allocation or order is disclosed on this page."',
        "---",
        "",
        "## The idea",
        "",
        f"The accepted financial model for **{card.get('name', short)}** values it at "
        f"**{money(card['price_target'], cur)}** against a last price of "
        f"**{money(card['price'], cur)}** — **{pct(up)}**. That makes it the "
        f"**{'strongest long' if up > 0 else 'strongest short'}**-side reading "
        f"of {total} accepted models at rank {rank}." if rank <= 3 else
        f"The accepted financial model for **{card.get('name', short)}** values it at "
        f"**{money(card['price_target'], cur)}** against a last price of "
        f"**{money(card['price'], cur)}** — **{pct(up)}**.",
        "",
        f"The valuation runs on **{method}**. "
        + (f"The model's scenario range is **{money(lo, cur)}** to **{money(hi, cur)}**"
           + (f", and the model puts the chance of finishing higher at **{prob_phrase(prob)}**." if prob is not None else ".")
           if lo is not None and hi is not None else ""),
        "",
        "## What this page is, and is not",
        "",
        "This is what the model says a company is worth. It is **not** a disclosure of any "
        "holding, allocation or order, and nothing here says anyone owns this name. The "
        "number is a model output as of the date above, not a live quote, and the scenario "
        "range is wide on purpose.",
        "",
        "## The full model",
        "",
        f"The page above is the headline. The model itself — the financial history, the full "
        f"scenario ladder, the source documents behind every line — is served to subscribers:",
        "",
        f"```",
        f"GET https://api.corbanu.com/v1/company-models/{short}/outputs",
        f"```",
        "",
        f"The response carries the exact source date and content version. "
        f"[API documentation and the current monthly price]({API_DOC}).",
        "",
        f"Subscribers can open {short} in the Finance Hub model viewer, which requires a "
        f"Task Node sign-in. [Start with the API documentation]({API_DOC}).",
        "",
    ]
    return "\n".join(head) + "\n"


def index(longs: list[dict], shorts: list[dict], total: int, asof: str) -> str:
    rows = ["---",
            'title: "Trade ideas"',
            f"date: {asof}T12:00:00Z",
            "draft: false",
            'description: "Long and short ideas ranked by what the accepted company models imply, against the last price."',
            "---",
            "",
            f"Ranked by what each accepted financial model implies against the last price. "
            f"{total} accepted models as of **{asof}**. Model output only — no holding, "
            f"allocation or order is disclosed here.",
            "",
            "## Longs",
            "",
            "| Idea | Model target | Last | Implied | Method |",
            "|---|---|---|---|---|"]
    for c in longs:
        s = c["ticker"].split()[0]
        rows.append(f"| [{s} — {c.get('name', s)}](/trade-ideas/{slug(s)}/) | "
                    f"{money(c['price_target'], c.get('currency'))} | {money(c['price'], c.get('currency'))} | "
                    f"**{pct(float(c['upside']))}** | {c.get('valuation_method_label') or '—'} |")
    rows += ["", "## Shorts", "",
             "| Idea | Model target | Last | Implied | Method |", "|---|---|---|---|---|"]
    for c in shorts:
        s = c["ticker"].split()[0]
        rows.append(f"| [{s} — {c.get('name', s)}](/trade-ideas/{slug(s)}/) | "
                    f"{money(c['price_target'], c.get('currency'))} | {money(c['price'], c.get('currency'))} | "
                    f"**{pct(float(c['upside']))}** | {c.get('valuation_method_label') or '—'} |")
    rows += ["",
             "Every idea links to its model. The full model, with the financial history and the "
             "source documents behind each line, is served to subscribers — see the "
             "[API documentation](/api/).",
             ""]
    return "\n".join(rows) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--per-side", type=int, default=6)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    cards = load_cards()
    if not cards:
        print("REFUSED: no usable model cards found; wrote nothing")
        return 1
    cards.sort(key=lambda c: -float(c["upside"]))
    longs = [c for c in cards if float(c["upside"]) > 0][: args.per_side]
    shorts = [c for c in cards if float(c["upside"]) < 0][-args.per_side:][::-1]
    asof = max(str(c["asof"]) for c in cards)

    written = []
    pages = {}
    for i, c in enumerate(longs, 1):
        pages[slug(c["ticker"].split()[0]) + ".md"] = page(c, i, len(cards))
    for i, c in enumerate(shorts, 1):
        pages[slug(c["ticker"].split()[0]) + ".md"] = page(c, i, len(cards))
    pages["_index.md"] = index(longs, shorts, len(cards), asof)

    # Refuse to write anything if a forbidden token appears anywhere.
    for name, body in pages.items():
        low = _html.unescape(body).casefold()
        for bad in FORBIDDEN:
            if bad in low:
                print(f"REFUSED: generated page {name} contains forbidden token {bad!r}; wrote nothing")
                return 2
        for pat in FORBIDDEN_PATTERNS:
            hit = re.search(pat, low)
            if hit:
                print(f"REFUSED: generated page {name} matches leak pattern {pat!r} at {hit.group(0)!r}; wrote nothing")
                return 2

    if args.dry_run:
        print(f"dry run: would write {len(pages)} pages, asof {asof}")
        for n in sorted(pages):
            print("   ", n)
        return 0

    # Reconcile the whole owned directory. A page that falls out of the current
    # ranking previously stayed public at its old URL for ever, and a refused
    # generation left every stale file in place.
    OUT.mkdir(parents=True, exist_ok=True)
    existing = {p.name for p in OUT.glob("*.md")}
    stale = sorted(existing - set(pages))
    for name in stale:
        (OUT / name).unlink()
        print("removed stale page %s (no longer in the ranking)" % name)
    for path in OUT.glob("*.md"):
        if path.name in pages:
            continue
        print("REFUSED: %s survived reconciliation; wrote nothing" % path.name)
        return 3
    DATA.parent.mkdir(parents=True, exist_ok=True)
    for name, body in pages.items():
        (OUT / name).write_text(body, encoding="utf-8")
        written.append(name)
    DATA.write_text(json.dumps({
        "generated_at_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "asof": asof,
        "accepted_models": len(cards),
        "longs": [{"ticker": c["ticker"], "upside": c["upside"]} for c in longs],
        "shorts": [{"ticker": c["ticker"], "upside": c["upside"]} for c in shorts],
    }, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(written)} pages from {len(cards)} accepted models, asof {asof}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
