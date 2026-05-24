#!/usr/bin/env python3
"""Run GPT-5.5-pro (xhigh) narrative editorial review on pain_machines.md."""

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
OUT = REPO / "research/pain_machines/review_feedback_story.json"
ENV_CANDIDATES = [
    REPO / ".env",
    Path("/home/pfrpc/repos/pftasks/worker/.env"),
    Path("/home/pfrpc/repos/tasknodeofficial/.env.tasknodeofficial-dev"),
    Path("/home/pfrpc/repos/tasknodeofficial/.env"),
]

MODEL = os.environ.get("PAIN_MACHINES_REVIEW_MODEL", "gpt-5.5-pro")
REASONING = os.environ.get("PAIN_MACHINES_REVIEW_REASONING", "xhigh")
TIMEOUT_S = int(os.environ.get("PAIN_MACHINES_REVIEW_TIMEOUT_S", "600"))


def load_env_file(path: Path) -> None:
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def resolve_api_key() -> str:
    if not os.environ.get("OPENAI_API_KEY"):
        for candidate in ENV_CANDIDATES:
            load_env_file(candidate)
    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        raise SystemExit("OPENAI_API_KEY not found in env or candidate .env files")
    return key


def strip_front_matter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :].lstrip()
    return text


def compact_article(text: str) -> str:
    text = strip_front_matter(text)
    text = re.sub(r"<style>.*?</style>", "<style>[css omitted]</style>", text, flags=re.S)
    text = re.sub(r"<svg[^>]*viewBox=\"([^\"]+)\"[^>]*>.*?</svg>", r"[figure svg viewBox=\1]", text, flags=re.S)
    text = re.sub(r"<script.*?</script>", "[interactive widget omitted]", text, flags=re.S)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def review_schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": [
            "diagnosis",
            "persuasion_score",
            "readability_score",
            "story_spine",
            "reader_journey",
            "narrative_architecture",
            "figure_story_order",
            "prose_rewrites",
            "transition_patches",
            "arg_panel_strategy",
            "priority_integrations",
        ],
        "properties": {
            "diagnosis": {
                "type": "string",
                "description": "2-3 paragraphs: why the draft overwhelms instead of persuades; what emotional/intellectual journey is missing.",
            },
            "persuasion_score": {"type": "integer"},
            "readability_score": {"type": "integer"},
            "story_spine": {
                "type": "string",
                "description": "One tight paragraph: the article as a story arc from hook to inevitability. Memorable, not academic.",
            },
            "reader_journey": {
                "type": "array",
                "maxItems": 5,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["beat", "reader_feeling", "what_to_do"],
                    "properties": {
                        "beat": {"type": "string"},
                        "reader_feeling": {"type": "string"},
                        "what_to_do": {"type": "string"},
                    },
                },
            },
            "narrative_architecture": {
                "type": "object",
                "additionalProperties": False,
                "required": ["opening_markdown", "counting_rule_markdown", "section_one_intro", "neuro_bridge", "section_two_intro", "section_three_intro", "closing_markdown"],
                "properties": {
                    "opening_markdown": {"type": "string"},
                    "counting_rule_markdown": {"type": "string", "description": "HTML for pm-counting div or empty string to drop it from reader path"},
                    "section_one_intro": {"type": "string", "description": "Prose before evidence panels — sets up Act I as story"},
                    "neuro_bridge": {"type": "string"},
                    "section_two_intro": {"type": "string"},
                    "section_three_intro": {"type": "string"},
                    "closing_markdown": {"type": "string", "description": "Full §III+§IV replacement markdown"},
                },
            },
            "figure_story_order": {
                "type": "array",
                "maxItems": 12,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["figure_id", "story_role", "one_line_tease", "arg_rewrite"],
                    "properties": {
                        "figure_id": {"type": "string"},
                        "story_role": {"type": "string", "description": "What narrative job this figure does in one phrase"},
                        "one_line_tease": {"type": "string", "description": "Single sentence to place above/below figure — pull reader forward"},
                        "arg_rewrite": {
                            "type": "object",
                            "additionalProperties": False,
                            "required": ["claim", "warrant", "impact"],
                            "properties": {
                                "claim": {"type": "string", "description": "Max 20 words"},
                                "warrant": {"type": "string", "description": "Max 35 words"},
                                "impact": {"type": "string", "description": "Max 25 words — punchy story beat, not cardinality jargon"},
                            },
                        },
                    },
                },
            },
            "prose_rewrites": {
                "type": "array",
                "maxItems": 8,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["location", "replacement"],
                    "properties": {
                        "location": {"type": "string"},
                        "replacement": {"type": "string"},
                    },
                },
            },
            "transition_patches": {
                "type": "array",
                "maxItems": 6,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["after", "bridge_markdown"],
                    "properties": {
                        "after": {"type": "string", "description": "Section or figure cluster name"},
                        "bridge_markdown": {"type": "string", "description": "1-3 sentence bridge using pm-bridge class HTML"},
                    },
                },
            },
            "arg_panel_strategy": {
                "type": "string",
                "description": "How to keep Toulmin boxes without killing momentum — concrete instruction",
            },
            "priority_integrations": {
                "type": "array",
                "maxItems": 7,
                "items": {"type": "string"},
            },
        },
    }


SYSTEM_PROMPT = """\
You are a narrative editor for long-form philosophical essays — not a compliance reviewer, not an IRB chair, not a Wikipedia fact-check bot.

The author writes "Pain Machines": humans are creatures whose suffering state-space has far higher cardinality than pleasure state-space. The thesis must PERSUADE and DELIGHT, not drown the reader in citations.

HARD CONSTRAINTS — do not violate:
- KEEP all existing figures, charts, SVG diagrams, 3D brain widget, and compute block. Do not recommend deleting visual evidence.
- KEEP the dark, precise, stack-trace voice. No gamification. No sermon. No Hyperstitional Vortex tone.
- KEEP auditable sources — but sources serve the story; the story does not serve the bibliography.
- Do NOT produce compliance slop: no "it's important to note", no "in conclusion", no hedging throat-clearing, no flattening the voice into Medium-blog neutrality, no replacing edge with "balanced" mush.

YOUR JOB:
Design a READING EXPERIENCE. The charts must TELL A STORY in sequence — each figure is a scene, not an exhibit in a museum of pain.
Optimize for: readability, intelligibility, momentum, emotional inevitability, and the reader feeling the thesis land before they see the math.

ANTI-PATTERNS TO FIX:
- Evidence dump: 12 panels with identical rhetorical shape = fatigue
- Method before hook: counting rules before the reader cares
- Impact boxes repeating "suffering-space ≫ pleasure-space" like a mantra instead of advancing the plot
- Sections that start with taxonomy instead of stakes
- Conclusion that summarizes instead of closes with an image

DELIVER concrete Hugo-safe markdown/HTML replacements the author can paste in. Shorten Toulmin cells ruthlessly where needed — one breath each. Write tease lines that make the reader WANT the next figure.
"""


def call_openai(api_key: str, article: str) -> dict:
    base = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    payload = {
        "model": MODEL,
        "input": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    "The draft overwhelms with evidence and does not persuade. Redesign the READING EXPERIENCE.\n\n"
                    "Return structured feedback with paste-ready markdown for:\n"
                    "- opening + counting rule (or argue to fold counting into story)\n"
                    "- Act I intro before figure panels\n"
                    "- one-line teases + shortened arg boxes for each figure\n"
                    "- bridges between figure clusters and into §II compute / §III torture / §IV Eden\n"
                    "- full closing sections\n\n"
                    "Figure IDs: fig-neuromatrix, fig-iasp, fig-icd11, fig-mcgill, fig-price, "
                    "fig-berridge, fig-leknes, fig-baumeister, fig-rozin, fig-eisenberger, fig-lazarus, fig-brain\n\n"
                    f"--- ARTICLE DRAFT ---\n{article}"
                ),
            },
        ],
        "reasoning": {"effort": REASONING},
        "text": {
            "verbosity": "high",
            "format": {
                "type": "json_schema",
                "name": "pain_machines_story_review",
                "strict": True,
                "schema": review_schema(),
            },
        },
        "max_output_tokens": 28000,
        "store": False,
        "metadata": {"app": "goodalexander.github.io", "harness": "pain_machines_story_review"},
    }
    req = urllib.request.Request(
        f"{base}/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raise SystemExit(f"OpenAI HTTP {exc.code}: {exc.read().decode('utf-8', errors='replace')[:4000]}") from exc

    text = body.get("output_text") or ""
    if not text:
        for item in body.get("output") or []:
            for part in item.get("content") or []:
                if part.get("text"):
                    text += part["text"] + "\n"
        text = text.strip()
    try:
        feedback = json.loads(text)
    except json.JSONDecodeError as exc:
        OUT.with_suffix(".raw.json").write_text(json.dumps(body, indent=2) + "\n", encoding="utf-8")
        raise SystemExit(f"JSON parse failed ({exc}); saved raw response") from exc
    return {
        "model": body.get("model", MODEL),
        "reasoning_effort": REASONING,
        "review_mode": "story_narrative",
        "usage": body.get("usage", {}),
        "feedback": feedback,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def main() -> int:
    api_key = resolve_api_key()
    article = compact_article(ARTICLE.read_text(encoding="utf-8"))
    print(f"Story review: {ARTICLE.name} ({len(article):,} chars) · {MODEL} · reasoning={REASONING}")
    result = call_openai(api_key, article)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    fb = result["feedback"]
    print(f"Wrote {OUT}")
    print(f"persuasion={fb.get('persuasion_score')} readability={fb.get('readability_score')}")
    print("story_spine:", (fb.get("story_spine") or "")[:200], "...")
    print("priority_integrations:")
    for item in fb.get("priority_integrations", []):
        print(f"  - {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
