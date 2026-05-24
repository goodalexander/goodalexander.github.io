#!/usr/bin/env python3
"""Run GPT-5.5-pro (xhigh reasoning) editorial review on pain_machines.md."""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ARTICLE = REPO / "content/posts/pain_machines.md"
OUT = REPO / "research/pain_machines/review_feedback.json"
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
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def resolve_api_key() -> str:
    if os.environ.get("OPENAI_API_KEY"):
        return os.environ["OPENAI_API_KEY"]
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
    """Drop bulky inline assets; keep prose, Toulmin boxes, section structure."""
    text = strip_front_matter(text)
    text = re.sub(r"<style>.*?</style>", "<style>[omitted]</style>", text, flags=re.S)
    text = re.sub(r"<svg.*?</svg>", "[figure svg omitted]", text, flags=re.S)
    text = re.sub(r"<script.*?</script>", "[interactive script omitted]", text, flags=re.S)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def review_schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": [
            "overall_thesis_clarity",
            "readability_score",
            "conclusion_strength",
            "opening_hook",
            "section_flow",
            "conclusion_rewrite",
            "proposed_new_sections",
            "line_edits",
            "priority_actions",
        ],
        "properties": {
            "overall_thesis_clarity": {
                "type": "string",
                "description": "1-2 paragraphs: is 'humans are pain machines' clear, earned, and memorable?",
            },
            "readability_score": {
                "type": "integer",
                "description": "1-10 readability for educated general audience",
            },
            "conclusion_strength": {
                "type": "integer",
                "description": "1-10 strength of current conclusion (§III)",
            },
            "opening_hook": {
                "type": "object",
                "additionalProperties": False,
                "required": ["diagnosis", "suggested_revision"],
                "properties": {
                    "diagnosis": {"type": "string"},
                    "suggested_revision": {"type": "string"},
                },
            },
            "section_flow": {
                "type": "array",
                "maxItems": 6,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["section", "issue", "fix"],
                    "properties": {
                        "section": {"type": "string"},
                        "issue": {"type": "string"},
                        "fix": {"type": "string"},
                    },
                },
            },
            "conclusion_rewrite": {
                "type": "object",
                "additionalProperties": False,
                "required": ["diagnosis", "full_replacement_markdown"],
                "properties": {
                    "diagnosis": {"type": "string"},
                    "full_replacement_markdown": {
                        "type": "string",
                        "description": "Complete replacement markdown for §III and any new closing section(s). Hugo-safe markdown/HTML allowed.",
                    },
                },
            },
            "proposed_new_sections": {
                "type": "array",
                "maxItems": 2,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["title", "rationale", "markdown_draft"],
                    "properties": {
                        "title": {"type": "string"},
                        "rationale": {"type": "string"},
                        "markdown_draft": {"type": "string"},
                    },
                },
            },
            "line_edits": {
                "type": "array",
                "maxItems": 6,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["location", "current", "suggested", "why"],
                    "properties": {
                        "location": {"type": "string"},
                        "current": {"type": "string"},
                        "suggested": {"type": "string"},
                        "why": {"type": "string"},
                    },
                },
            },
            "priority_actions": {
                "type": "array",
                "maxItems": 5,
                "items": {"type": "string"},
                "description": "Top 5 ordered edits to maximize artistic thesis landing",
            },
        },
    }


def call_openai(api_key: str, article: str) -> dict:
    base = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    payload = {
        "model": MODEL,
        "input": [
            {
                "role": "system",
                "content": (
                    "You are a long-form essay editor specializing in evidence-driven philosophical writing. "
                    "The author's thesis: humans are PAIN MACHINES — creatures whose suffering state-space "
                    "has far higher cardinality than their pleasure state-space (countable, not metaphorical). "
                    "Evaluate readability, argumentative clarity, and whether the conclusion lands the thesis "
                    "as strongly and artistically as possible. Preserve the author's dark, precise voice — "
                    "no gamification, no sermonizing, no Hyperstitional Vortex tone. "
                    "Propose concrete markdown replacements, especially for §III and the closing. "
                    "Consider whether a section on torture-as-pseudoscience (Senate SSCI, O'Mara, Carbone) "
                    "would strengthen the thesis as a live demo that pain is not a truth-extraction interface."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Review this draft article. Return structured editorial feedback.\n\n"
                    "Focus areas:\n"
                    "1. Readability and flow for an educated reader\n"
                    "2. Whether Claim/Warrant/Impact panels serve the thesis\n"
                    "3. Whether §III conclusion earns 'Pain Machines' artistically\n"
                    "4. A full replacement conclusion markdown block\n"
                    "5. Any missing section that would sharpen the thesis\n\n"
                    f"--- ARTICLE DRAFT ---\n{article}"
                ),
            },
        ],
        "reasoning": {"effort": REASONING},
        "text": {
            "verbosity": "high",
            "format": {
                "type": "json_schema",
                "name": "pain_machines_review",
                "strict": True,
                "schema": review_schema(),
            },
        },
        "max_output_tokens": 24000,
        "store": False,
        "metadata": {"app": "goodalexander.github.io", "harness": "pain_machines_review"},
    }
    req = urllib.request.Request(
        f"{base}/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"OpenAI HTTP {exc.code}: {detail[:4000]}") from exc

    text = body.get("output_text")
    if not text:
        chunks = []
        for item in body.get("output") or []:
            for part in item.get("content") or []:
                if part.get("type") in {"output_text", "text"} and part.get("text"):
                    chunks.append(part["text"])
        text = "\n".join(chunks).strip()
    if not text:
        raise SystemExit(f"No output text in response: {json.dumps(body)[:2000]}")
    try:
        feedback = json.loads(text)
    except json.JSONDecodeError as exc:
        raw_path = OUT.with_suffix(".raw.json")
        raw_path.write_text(json.dumps(body, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        raise SystemExit(f"Failed to parse model JSON ({exc}); saved raw response to {raw_path}") from exc
    return {
        "model": body.get("model", MODEL),
        "reasoning_effort": REASONING,
        "usage": body.get("usage", {}),
        "feedback": feedback,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def main() -> int:
    api_key = resolve_api_key()
    article = compact_article(ARTICLE.read_text(encoding="utf-8"))
    print(f"Reviewing {ARTICLE.name} ({len(article):,} chars) with {MODEL} reasoning={REASONING}...")
    result = call_openai(api_key, article)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    fb = result["feedback"]
    print(f"Wrote {OUT}")
    print(f"readability={fb.get('readability_score')} conclusion_strength={fb.get('conclusion_strength')}")
    print("priority_actions:")
    for item in fb.get("priority_actions", []):
        print(f"  - {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
