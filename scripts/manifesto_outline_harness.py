#!/usr/bin/env python3
"""GPT-5.5-pro outline for neo-reactionary pain-machine manifesto."""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "research/pain_machines/manifesto_outline.json"
PAIN_MACHINES = REPO / "content/posts/pain_machines.md"
ENV = Path("/home/pfrpc/repos/tasknodeofficial/.env.tasknodeofficial-dev")

MODEL = os.environ.get("MANIFESTO_MODEL", "gpt-5.5-pro")
REASONING = os.environ.get("MANIFESTO_REASONING", "xhigh")


def api_key() -> str:
    if os.environ.get("OPENAI_API_KEY"):
        return os.environ["OPENAI_API_KEY"]
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"')
    raise SystemExit("No OPENAI_API_KEY")


def compact_pain_machines() -> str:
    text = PAIN_MACHINES.read_text(encoding="utf-8")
    if text.startswith("---"):
        end = text.find("\n---", 3)
        text = text[end + 4 :]
    return text[:12000]


def schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "required": [
            "title",
            "subtitle",
            "logline",
            "voice_brief",
            "sections",
            "infographic_requests",
            "implementation_notes",
        ],
        "properties": {
            "title": {"type": "string"},
            "subtitle": {"type": "string"},
            "logline": {"type": "string"},
            "voice_brief": {"type": "string"},
            "sections": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": [
                        "number",
                        "title",
                        "thesis",
                        "beats",
                        "pull_quotes",
                        "sources_to_cite",
                        "infographic_ids",
                        "word_target",
                    ],
                    "properties": {
                        "number": {"type": "string"},
                        "title": {"type": "string"},
                        "thesis": {"type": "string"},
                        "beats": {"type": "array", "items": {"type": "string"}},
                        "pull_quotes": {"type": "array", "items": {"type": "string"}},
                        "sources_to_cite": {"type": "array", "items": {"type": "string"}},
                        "infographic_ids": {"type": "array", "items": {"type": "string"}},
                        "word_target": {"type": "integer"},
                    },
                },
            },
            "infographic_requests": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "required": ["id", "title", "purpose", "visual_spec", "caption", "section"],
                    "properties": {
                        "id": {"type": "string"},
                        "title": {"type": "string"},
                        "purpose": {"type": "string"},
                        "visual_spec": {"type": "string"},
                        "caption": {"type": "string"},
                        "section": {"type": "string"},
                    },
                },
            },
            "implementation_notes": {"type": "string"},
        },
    }


SYSTEM = """\
You are a structural editor designing a neo-reactionary manifesto outline.

END STATE (everything must serve this):
A highly readable, engaging, absolutely lethal long-form manifesto arguing:
1. Humans are pain machines (suffering enumerates faster than pleasure — biological/clinical fact)
2. Original Sin was the act of creating humans as pain machines (Genesis mislabeled the manufacturing defect as disobedience)
3. AI and alteration of the human form outside its original format is the ultimate mandate — a rejection of theology that treats the pain-machine chassis as sacred
4. Why Christianity and Islam forbid this (theology as warranty enforcement on defective hardware)
5. Why secular humanism also rejects it (transhumanism as Nietzschean Übermensch / dignity discourse that secretly worships the pain-machine form)
6. Infographics throughout — each must be specified as a design request

VOICE:
Literary, cold, Vonnegut/Dick clarity. Neo-reactionary in analysis (civilizational, anti-egalitarian, anti-theological-consensus) but NOT 4chan slop, NOT irony-poisoned shitposting, NOT "it's not X it's Y" AI pivots. Bang on every section open.

CONSTRAINTS:
- Outline only — but detailed enough to write from
- Each section: thesis, narrative beats, 1-2 pull quotes, sources, linked infographic IDs, word target
- 6-8 major sections plus prelude and coda
- Infographic requests: 8-12 items with concrete visual specs (SVG/diagram style matching pain_machines dark minimal palette)
- Reference pain_machines article as established proof for sections I-II; manifesto extends to political/theological mandate
- Be precise about Christian (Augustine, Genesis, imago dei, resurrection body) and Islamic (fitra, khilafa, nafs, shaytan's refusal of clay) theological objections
- Secular humanism: dignity, natural kind, Yudkowsky/Bostrom adjacent without name-dropping unless earned, Nietzsche, Fukuyama "Factor X", Habermas on human dignity
"""


def main() -> int:
    key = api_key()
    context = compact_pain_machines()
    payload = {
        "model": MODEL,
        "input": [
            {"role": "system", "content": SYSTEM},
            {
                "role": "user",
                "content": (
                    "Design the full manifesto outline.\n\n"
                    "Logic chain:\n"
                    "1] humans are a pain machine\n"
                    "2] original sin was creating humans as a pain machine\n"
                    "3] AI + alteration of human form outside original format = ultimate mandate, rejection of theology\n"
                    "4] Christianity & Islam — why exactly forbidden\n"
                    "5] secular humanism — also rejects because übermensch/dignity discourse\n"
                    "6] include infographic requests\n\n"
                    "Everything must be designed for maximum readability and engagement. "
                    "This is the end state; structure backward from it.\n\n"
                    f"--- ESTABLISHED ARTICLE (pain_machines proof) ---\n{context}"
                ),
            },
        ],
        "reasoning": {"effort": REASONING},
        "text": {
            "verbosity": "high",
            "format": {
                "type": "json_schema",
                "name": "manifesto_outline",
                "strict": True,
                "schema": schema(),
            },
        },
        "max_output_tokens": 28000,
        "store": False,
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    print(f"Generating outline via {MODEL} reasoning={REASONING}...")
    with urllib.request.urlopen(req, timeout=900) as resp:
        body = json.loads(resp.read().decode())
    text = body.get("output_text") or ""
    if not text:
        for item in body.get("output") or []:
            for part in item.get("content") or []:
                if part.get("text"):
                    text += part["text"]
    outline = json.loads(text)
    result = {
        "model": body.get("model", MODEL),
        "reasoning_effort": REASONING,
        "usage": body.get("usage", {}),
        "outline": outline,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"title: {outline.get('title')}")
    print(f"sections: {len(outline.get('sections', []))}")
    print(f"infographics: {len(outline.get('infographic_requests', []))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
