#!/usr/bin/env python3
"""GPT-5.5-pro full literary rewrite of pain_machines.md. Keeps figures via placeholders."""

from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARTICLE = REPO / "content/posts/pain_machines.md"
OUT = REPO / "research/pain_machines/literary_rewrite.json"
MERGED = REPO / "research/pain_machines/literary_rewrite_merged.md"
ENV_CANDIDATES = [
    Path("/home/pfrpc/repos/tasknodeofficial/.env.tasknodeofficial-dev"),
    Path("/home/pfrpc/repos/pftasks/worker/.env"),
    Path("/home/pfrpc/repos/tasknodeofficial/.env"),
]

MODEL = os.environ.get("PAIN_MACHINES_REVIEW_MODEL", "gpt-5.5-pro")
REASONING = os.environ.get("PAIN_MACHINES_REVIEW_REASONING", "xhigh")
TIMEOUT_S = int(os.environ.get("PAIN_MACHINES_REVIEW_TIMEOUT_S", "900"))

FIGURE_IDS = [
    "fig-neuromatrix", "fig-iasp", "fig-icd11", "fig-mcgill", "fig-price",
    "fig-berridge", "fig-leknes", "fig-baumeister", "fig-rozin",
    "fig-eisenberger", "fig-lazarus", "fig-brain",
]

SYSTEM = """\
You are a literary essayist rewriting a draft that the author rejects as AI slop.

THESIS (state plainly, repeatedly, without hedging):
Original Sin was the act of creating humans as a pain machine — a creature built to enumerate suffering far more finely than pleasure. Genesis mislabeled the bug as disobedience. The fruit did not install the fault; it turned on self-report.

VOICE:
Literary, cold, funny, fatalistic — channel Vonnegut's plainspoken doom and Philip K. Dick's paranoid clarity. Short sentences. Concrete images. No academic throat-clearing.

BANNED (instant failure — do not use):
- "It's not X, it's Y" / "Not A. B." rhetorical pivots used as crutches
- "Load-bearing", "operational count", "coarse-graining", "cardinality", "state-space", "quotient", "partition"
- Meta-instructions to the reader ("each panel below", "read this as", "the boxes below are")
- Claim / Warrant / Impact labels or Toulmin scaffolding visible to the reader
- "Audit hatch", "failure cascade", "enumerator" repeated as tic
- Compliance hedges: "it's important to note", "under an explicit", "conservative on purpose"
- Repetitive thesis mantra instead of advancing the story
- Explaining your own rhetorical structure

KEEP (mandatory):
- All figure placeholders exactly: {{FIG:fig-neuromatrix}} etc. and {{FIG:fig-brain}} and {{WIDGET:pm-compute}}
- Source citations may appear inline naturally (Melzack, IASP, Senate report) — not as bibliography voice
- The compute widget and 3D brain stay where placeholders are
- Evidence supports story; story does not serve the evidence

STRUCTURE:
Write continuous prose between placeholders. After each figure placeholder, include ONLY a single short paragraph (2-4 sentences max) that says what the reader should take away — always ending with why this means we were built as pain machines, in plain English.

No <details> counting rules. No pm-tease, pm-bridge, pm-arg HTML in your output — pure markdown/HTML prose only, plus placeholders.

Deliver a complete rewrite from opening through closing. Make it persuasive, readable, and unforgettable.
"""


def load_env(path: Path) -> None:
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def api_key() -> str:
    if not os.environ.get("OPENAI_API_KEY"):
        for p in ENV_CANDIDATES:
            load_env(p)
    k = os.environ.get("OPENAI_API_KEY", "").strip()
    if not k:
        raise SystemExit("OPENAI_API_KEY not found")
    return k


def extract_figures(text: str) -> dict[str, str]:
    blocks: dict[str, str] = {}
    for fid in FIGURE_IDS:
        pat = rf'(<figure class="pm-fig[^"]*" id="{fid}">.*?</figure>)'
        m = re.search(pat, text, re.S)
        if m:
            # strip tease before figure if adjacent
            blocks[fid] = m.group(1)
    compute = re.search(r'(<div class="pm-compute" id="pm-compute">.*?</div>\s*(?:### Reading Figure 1.*?Conservative and liberal profiles bracket the band by varying bin counts only\. No fitted constants\.)?)', text, re.S)
    if compute:
        blocks["pm-compute"] = compute.group(1)
    return blocks


def compact_for_model(text: str) -> str:
    text = re.sub(r"^---.*?---\n", "", text, flags=re.S)
    text = re.sub(r"<style>.*?</style>", "", text, flags=re.S)
    for fid in FIGURE_IDS:
        text = re.sub(rf'<figure class="pm-fig[^"]*" id="{fid}">.*?</figure>', f"{{{{FIG:{fid}}}}}", text, flags=re.S)
    text = re.sub(r'<div class="pm-compute" id="pm-compute">.*?(?:No fitted constants\.)', "{{WIDGET:pm-compute}}", text, flags=re.S)
    text = re.sub(r"<script.*?</script>", "", text, flags=re.S)
    text = re.sub(r"<div class=\"pm-appendix\">.*", "[APPENDIX OMITTED — keep as-is in merge]", text, flags=re.S)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": ["opening_through_closing_markdown", "figure_captions", "slop_removed", "voice_notes"],
        "properties": {
            "opening_through_closing_markdown": {
                "type": "string",
                "description": "Full rewrite from after <div class='pm'> through end of §IV, using {{FIG:...}} and {{WIDGET:pm-compute}} placeholders only. Markdown + minimal HTML. No appendix.",
            },
            "figure_captions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["figure_id", "after_figure_paragraph"],
                    "properties": {
                        "figure_id": {"type": "string"},
                        "after_figure_paragraph": {
                            "type": "string",
                            "description": "2-4 sentences after figure. Must say plainly why this shows humans are pain machines.",
                        },
                    },
                },
            },
            "slop_removed": {
                "type": "array",
                "maxItems": 12,
                "items": {"type": "string"},
            },
            "voice_notes": {"type": "string"},
        },
    }


def call_openai(key: str, draft: str) -> dict:
    base = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    payload = {
        "model": MODEL,
        "input": [
            {"role": "system", "content": SYSTEM},
            {
                "role": "user",
                "content": (
                    "The current draft is unacceptable AI slop — hedged, meta, repetitive, unpersuasive.\n\n"
                    "Rewrite the ENTIRE essay prose (keep placeholders for all 12 figures + compute widget).\n\n"
                    "Central claim: Original Sin was creating man as a pain machine.\n\n"
                    "Placeholders to preserve exactly:\n"
                    + "\n".join(f"{{{{FIG:{f}}}}}" for f in FIGURE_IDS)
                    + "\n{{WIDGET:pm-compute}}\n\n"
                    f"--- CURRENT DRAFT (with placeholders) ---\n{draft}"
                ),
            },
        ],
        "reasoning": {"effort": REASONING},
        "text": {
            "verbosity": "high",
            "format": {
                "type": "json_schema",
                "name": "pain_machines_literary_rewrite",
                "strict": True,
                "schema": schema(),
            },
        },
        "max_output_tokens": 32000,
        "store": False,
    }
    req = urllib.request.Request(
        f"{base}/responses",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            body = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code}: {e.read().decode()[:3000]}") from e

    text = body.get("output_text") or ""
    if not text:
        for item in body.get("output") or []:
            for part in item.get("content") or []:
                if part.get("text"):
                    text += part["text"]
    return {"model": body.get("model"), "usage": body.get("usage"), "feedback": json.loads(text)}


def merge(original: str, rewrite_md: str, captions: dict[str, str]) -> str:
    # preserve front matter + style + appendix from original
    fm = re.match(r"(^---.*?---\n)", original, re.S)
    style = re.search(r"(<style>.*?</style>)", original, re.S)
    appendix = re.search(r"(<div class=\"pm-appendix\">.*)", original, re.S)
    figures = extract_figures(original)

    body = rewrite_md.strip()
    if not body.startswith("<div"):
        body = '<div class="pm" id="pain-machines">\n\n' + body + "\n\n</div>"

    for fid, html in figures.items():
        cap = captions.get(fid, "")
        replacement = html
        if cap:
            replacement = html + f'\n\n<p class="pm-after">{cap}</p>'
        body = body.replace(f"{{{{FIG:{fid}}}}}", replacement)

    if "pm-compute" in figures:
        body = body.replace("{{WIDGET:pm-compute}}", figures["pm-compute"])

    parts = []
    if fm:
        parts.append(fm.group(1))
    if style:
        parts.append(style.group(1))
    parts.append(body)
    if appendix:
        parts.append("\n\n" + appendix.group(1))
    return "\n".join(parts) + "\n"


def main() -> int:
    key = api_key()
    original = ARTICLE.read_text(encoding="utf-8")
    draft = compact_for_model(original)
    print(f"Literary rewrite via {MODEL} (reasoning={REASONING}), draft {len(draft):,} chars...")
    result = call_openai(key, draft)
    fb = result["feedback"]
    caps = {x["figure_id"]: x["after_figure_paragraph"] for x in fb["figure_captions"]}
    merged = merge(original, fb["opening_through_closing_markdown"], caps)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({**result, "generated_at": datetime.now(timezone.utc).isoformat()}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    MERGED.write_text(merged, encoding="utf-8")
    ARTICLE.write_text(merged, encoding="utf-8")

    print(f"Wrote {OUT}")
    print(f"Wrote {MERGED}")
    print(f"Updated {ARTICLE}")
    print("voice_notes:", (fb.get("voice_notes") or "")[:300])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
